import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Camera, Loader2, AlertCircle } from "lucide-react";
import { getProctorStream, setProctorStream } from "../lib/proctorStream";
import { loadFaceModelsOnce } from "../lib/faceModels";
import { apiFetch } from "../services/httpClient";

interface FaceDetectionMonitorProps {
  sessionId: string | null;
}

type FaceStatus =
  | "loading" | "detecting" | "face" | "no_face" | "multiple_face" | "camera_error";

// Phase 3
type HeadDirection =
  | "forward" | "left" | "right" | "up" | "down" | "away" | "unknown";

// Phase 4
type EyeStatus =
  | "screen"   // eyes open, looking at screen
  | "away"     // gaze directed away from screen
  | "closed"   // both eyes closed (potential blink or sustained close)
  | "missing"  // eye landmarks unreliable (sunglasses, hand covering, poor light)
  | "unknown"; // face not detected, eye status not available

// Phase 6 — face distance (bounding-box-area heuristic)
type DistanceStatus = "ok" | "too_close" | "too_far" | "unknown";

// Phase 5 — object detection (coco-ssd)
type ObjectStatus = "loading" | "clear" | "phone" | "book" | "laptop" | "second_person" | "unavailable";

type ViolationType =
  | "NO_FACE" | "MULTIPLE_FACE"
  | "HEAD_LEFT" | "HEAD_RIGHT" | "HEAD_UP" | "HEAD_DOWN" | "LOOKING_AWAY"
  | "EYES_CLOSED" | "EYES_MISSING"
  | "FACE_TOO_CLOSE" | "FACE_TOO_FAR"
  | "PHONE_DETECTED" | "BOOK_DETECTED" | "LAPTOP_DETECTED" | "SECOND_PERSON_DETECTED"
  | "NOISE_DETECTED" | "CAMERA_DISABLED" | "MICROPHONE_DISABLED"
  | "CAMERA_FROZEN" | "CAMERA_BLACK_SCREEN"
  | "CAMERA_PERMISSION_REVOKED" | "MICROPHONE_PERMISSION_REVOKED";

// ─── Detection intervals / thresholds ───────────────────────────────────────
const DETECTION_INTERVAL_MS    = 500;
const VIOLATION_COOLDOWN_MS    = 5000;
const POSE_VIOLATION_MS        = 3000;

// Phase 4 — EAR thresholds
// Typical open-eye EAR: 0.27–0.35; typical closed: ~0.15
const EAR_OPEN_THRESHOLD    = 0.20; // above this = eyes open
const EAR_MISSING_THRESHOLD = 0.08; // below this = landmarks unreliable

// Phase 4 — sustained duration thresholds
const EYES_CLOSED_VIOLATION_MS  = 2000; // closed continuously before logging
const EYES_AWAY_VIOLATION_MS    = 3000; // looking away continuously
const EYES_MISSING_VIOLATION_MS = 3000; // missing continuously

// Phase 4 — gaze-away thresholds (more sensitive than Phase 3 head-turn thresholds)
const GAZE_YAW_THRESHOLD   = 0.08;
const GAZE_PITCH_UP         = 0.40;
const GAZE_PITCH_DOWN       = 0.58;

// Phase 3 — head-pose thresholds
const YAW_THRESHOLD         = 0.12;
const PITCH_UP_THRESHOLD    = 0.38;
const PITCH_DOWN_THRESHOLD  = 0.60;
const AWAY_THRESHOLD        = 0.22;

// Phase 6 — face distance thresholds (heuristic, not device-calibrated)
// Proxy for distance: face bounding-box area as a fraction of the video
// frame area. A face filling more than ~40% of frame is uncomfortably
// close for a normal webcam setup; less than ~2.5% suggests the student
// has stepped back out of a reasonable monitoring range. These are rough
// defaults tuned for a typical laptop webcam at arm's length — they are
// intentionally conservative (wide "ok" band) to avoid false positives
// across different camera fields of view, and are easy to retune if real
// usage data suggests otherwise.
const FACE_AREA_TOO_CLOSE_RATIO = 0.40;
const FACE_AREA_TOO_FAR_RATIO   = 0.025;
const DISTANCE_VIOLATION_MS     = 4000; // sustained before logging (avoid flagging brief lean-ins)

// Pure function — no DOM/React dependency — so it's independently testable.
function computeDistanceStatus(
  box: { width: number; height: number },
  frameWidth: number,
  frameHeight: number
): DistanceStatus {
  if (!frameWidth || !frameHeight || box.width <= 0 || box.height <= 0) return "unknown";
  const ratio = (box.width * box.height) / (frameWidth * frameHeight);
  if (ratio >= FACE_AREA_TOO_CLOSE_RATIO) return "too_close";
  if (ratio <= FACE_AREA_TOO_FAR_RATIO) return "too_far";
  return "ok";
}

// Phase 7 — camera stream health (frozen frame / black screen). The video
// track can report readyState "live" while the actual picture has stopped
// changing (a static image/paper held over the lens) or gone black (lens
// covered, camera driver fault) — neither of those fires the track's
// native "ended" event, so they need their own lightweight heuristic.
const HEALTH_CHECK_INTERVAL_MS = 2000;   // cheap — small downsampled sample, run often
const HEALTH_SAMPLE_SIZE = 16;           // 16x16 downsample is enough to detect "did anything change"
const FROZEN_FRAME_DIFF_THRESHOLD = 2;   // avg per-pixel luminance delta below this = "unchanged"
const FROZEN_SUSTAINED_MS = 6000;        // require this long of zero motion before flagging
const BLACK_SCREEN_LUMINANCE_THRESHOLD = 8; // avg luminance (0-255) below this = "black"
const BLACK_SCREEN_SUSTAINED_MS = 4000;

// Phase 7 — permission-revocation polling. `track.addEventListener("ended", ...)`
// is the primary signal (Effect 2 below), but it isn't 100% reliable across
// every browser/OS permission-revocation path, so the Permissions API
// (where supported — Chrome/Edge; not Firefox/Safari) is polled as a
// second, independent signal per the "do not rely on only one signal"
// requirement.
const PERMISSION_POLL_INTERVAL_MS = 3000;

const MODEL_URL = "/models";

// Phase 5 — object detection (coco-ssd)
const OBJECT_DETECTION_INTERVAL_MS = 4000; // heavier model — run far less often than face detection
const OBJECT_SCORE_THRESHOLD = 0.6;

// Phase 5 — audio monitoring (Web Audio API)
const AUDIO_CHECK_INTERVAL_MS = 1000;
const NOISE_RMS_THRESHOLD = 0.12; // empirical — sustained background talking/noise
const NOISE_SUSTAINED_MS = 2500;

// Events valuable enough to justify capturing a webcam snapshot as evidence.
const EVIDENCE_EVENT_TYPES = new Set<ViolationType>([
  "MULTIPLE_FACE",
  "NO_FACE",
  "PHONE_DETECTED",
  "BOOK_DETECTED",
  "LAPTOP_DETECTED",
  "SECOND_PERSON_DETECTED",
  "CAMERA_FROZEN",
  "CAMERA_BLACK_SCREEN",
]);

// ─── Module-level model promise for face detection lives in
// lib/faceModels.ts (shared with ProctoringSetup's pre-exam face check, so
// the model weights are only ever fetched once per page load). ──────────

// ─── Phase 5: coco-ssd object-detection model (loaded lazily + separately —
// it's a bigger download than the face models, and detection for it runs on
// a much slower interval, so a failure here shouldn't break face detection) ─
let cocoModelPromise: Promise<import("@tensorflow-models/coco-ssd").ObjectDetection> | null = null;

function loadCocoModelOnce() {
  if (!cocoModelPromise) {
    cocoModelPromise = import("@tensorflow-models/coco-ssd")
      .then((cocoSsd) => cocoSsd.load({ base: "lite_mobilenet_v2" }))
      .catch((err) => { cocoModelPromise = null; throw err; });
  }
  return cocoModelPromise;
}

// ─── Camera error reason ────────────────────────────────────────────────────
function getCameraErrorReason(err: unknown): string {
  const e = err as { name?: string; message?: string } | null;
  if (!e) return "MediaStream is null — proctoring setup may have been skipped.";
  switch (e.name) {
    case "NotAllowedError":
    case "PermissionDeniedError": return "Camera permission denied. Allow access in your browser settings.";
    case "NotFoundError":
    case "DevicesNotFoundError":  return "No webcam detected. Connect a camera and try again.";
    case "NotReadableError":
    case "TrackStartError":       return "Camera is already in use by another application.";
    default: return e.message ? `Camera error: ${e.message}` : "Camera unavailable.";
  }
}

// ─── PHASE 3: Head pose helpers ─────────────────────────────────────────────
function estimateHeadDirection(
  landmarks: faceapi.FaceLandmarks68
): { direction: HeadDirection; yaw: number; pitch: number } {
  const pts = landmarks.positions;
  const leftEye  = pts[36]; const rightEye = pts[45];
  const noseTip  = pts[30]; const chin     = pts[8];
  const eyeMidX  = (leftEye.x + rightEye.x) / 2;
  const eyeMidY  = (leftEye.y + rightEye.y) / 2;
  const faceWidth  = rightEye.x - leftEye.x;
  const faceHeight = chin.y - eyeMidY;
  if (faceWidth < 1 || faceHeight < 1) return { direction: "unknown", yaw: 0, pitch: 0 };
  const yaw   = (noseTip.x - eyeMidX) / faceWidth;
  const pitch = (noseTip.y - eyeMidY) / faceHeight;
  const isYawExtreme   = Math.abs(yaw) > AWAY_THRESHOLD;
  const isPitchExtreme = pitch < PITCH_UP_THRESHOLD - 0.08 || pitch > PITCH_DOWN_THRESHOLD + 0.08;
  if (isYawExtreme && isPitchExtreme) return { direction: "away",  yaw, pitch };
  if (pitch < PITCH_UP_THRESHOLD)     return { direction: "up",    yaw, pitch };
  if (pitch > PITCH_DOWN_THRESHOLD)   return { direction: "down",  yaw, pitch };
  if (yaw < -YAW_THRESHOLD)           return { direction: "left",  yaw, pitch };
  if (yaw >  YAW_THRESHOLD)           return { direction: "right", yaw, pitch };
  return { direction: "forward", yaw, pitch };
}

function drawNoseDirectionLine(
  ctx: CanvasRenderingContext2D,
  landmarks: faceapi.FaceLandmarks68,
  direction: HeadDirection,
  scaleX: number, scaleY: number
) {
  const pts = landmarks.positions;
  const bridgeX = pts[27].x * scaleX; const bridgeY = pts[27].y * scaleY;
  const tipX    = pts[30].x * scaleX; const tipY    = pts[30].y * scaleY;
  const dx = tipX - bridgeX; const dy = tipY - bridgeY;
  const endX = tipX + dx * 1.5; const endY = tipY + dy * 1.5;
  const lineColor = direction === "forward" ? "#22c55e" : direction === "away" ? "#ef4444" : "#f59e0b";
  ctx.beginPath(); ctx.moveTo(bridgeX, bridgeY); ctx.lineTo(endX, endY);
  ctx.strokeStyle = lineColor; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke();
  ctx.beginPath(); ctx.arc(endX, endY, 4, 0, 2 * Math.PI);
  ctx.fillStyle = lineColor; ctx.fill();
}

// ─── PHASE 4: Eye Aspect Ratio helpers ──────────────────────────────────────
interface Point { x: number; y: number; }

function euclidean(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/**
 * EAR = (||p2-p6|| + ||p3-p5||) / (2 * ||p1-p4||)
 * Points: [outerCorner, upperLeft, upperRight, innerCorner, lowerRight, lowerLeft]
 */
function computeEAR(eye: Point[]): number {
  const A = euclidean(eye[1], eye[5]); // vertical top-left  to bottom-left
  const B = euclidean(eye[2], eye[4]); // vertical top-right to bottom-right
  const C = euclidean(eye[0], eye[3]); // horizontal outer   to inner corner
  if (C < 0.5) return 0;               // degenerate — landmarks on top of each other
  return (A + B) / (2.0 * C);
}

/**
 * Analyses eye status using the 68-landmark positions.
 * Landmarks used:
 *   Left eye:  36 outer, 37 upper-L, 38 upper-R, 39 inner, 40 lower-R, 41 lower-L
 *   Right eye: 42 inner, 43 upper-L, 44 upper-R, 45 outer, 46 lower-R, 47 lower-L
 *
 * "Looking Away" uses yaw/pitch from head-pose as a proxy for gaze direction,
 * with a MORE SENSITIVE threshold (0.08) than Phase 3 head-turn (0.12), so it
 * fires for subtle gaze shifts that don't yet constitute a full head turn.
 */
function analyzeEyes(
  landmarks: faceapi.FaceLandmarks68,
  yaw: number,
  pitch: number
): { eyeStatus: EyeStatus; leftEAR: number; rightEAR: number } {
  const pts = landmarks.positions;

  const leftEyePts:  Point[] = [pts[36], pts[37], pts[38], pts[39], pts[40], pts[41]];
  const rightEyePts: Point[] = [pts[42], pts[43], pts[44], pts[45], pts[46], pts[47]];

  const leftEAR  = computeEAR(leftEyePts);
  const rightEAR = computeEAR(rightEyePts);
  const avgEAR   = (leftEAR + rightEAR) / 2;

  // Unreliable landmarks (occluded eyes, sunglasses, hand, very poor light)
  if (avgEAR <= EAR_MISSING_THRESHOLD) {
    return { eyeStatus: "missing", leftEAR, rightEAR };
  }

  // Eyes closed (sustained blink or deliberate closure)
  if (avgEAR <= EAR_OPEN_THRESHOLD) {
    return { eyeStatus: "closed", leftEAR, rightEAR };
  }

  // Eyes open — check gaze direction via head-pose proxy
  const gazedAway =
    Math.abs(yaw) > GAZE_YAW_THRESHOLD ||
    pitch < GAZE_PITCH_UP ||
    pitch > GAZE_PITCH_DOWN;

  return { eyeStatus: gazedAway ? "away" : "screen", leftEAR, rightEAR };
}

/** Draws the 12 eye landmark dots, coloured by eye status. */
function drawEyeLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: faceapi.FaceLandmarks68,
  eyeStatus: EyeStatus,
  scaleX: number, scaleY: number
) {
  const pts = landmarks.positions;
  const eyeIndices = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
  const dotColor =
    eyeStatus === "screen" ? "#22c55e" :
    eyeStatus === "away"   ? "#f59e0b" :
    eyeStatus === "closed" ? "#f59e0b" :
    "#ef4444"; // missing

  eyeIndices.forEach((i) => {
    ctx.beginPath();
    ctx.arc(pts[i].x * scaleX, pts[i].y * scaleY, 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = dotColor;
    ctx.fill();
  });
}

// ─── Component ───────────────────────────────────────────────────────────────
export function FaceDetectionMonitor({ sessionId }: FaceDetectionMonitorProps) {
  const [status,       setStatus]       = useState<FaceStatus>("loading");
  const [headDirection,setHeadDirection]= useState<HeadDirection>("unknown");
  const [eyeStatus,   setEyeStatus]    = useState<EyeStatus>("unknown");
  const [distanceStatus, setDistanceStatus] = useState<DistanceStatus>("unknown");
  const [objectStatus, setObjectStatus] = useState<ObjectStatus>("loading");
  const [modelError,  setModelError]   = useState<string | null>(null);
  const [cameraErrMsg,setCameraErrMsg] = useState<string | null>(null);

  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Refs: read by interval without stale-closure issues
  const modelsReadyRef = useRef(false);
  const cameraReadyRef = useRef(false);
  const stoppedRef     = useRef(false);
  const cocoModelRef   = useRef<import("@tensorflow-models/coco-ssd").ObjectDetection | null>(null);

  // Violation cooldown — per event type, so e.g. a NOISE_DETECTED firing
  // doesn't reset the cooldown clock for HEAD_LEFT and vice versa (the
  // original single-slot ref only ever remembered the most recent type).
  const lastLoggedAtRef = useRef<Record<string, number>>({});

  // Phase 3 — head pose sustained timer
  const poseStartRef = useRef<{ direction: HeadDirection; since: number } | null>(null);

  // Phase 6 — face distance sustained timer
  const distanceStartRef = useRef<{ status: DistanceStatus; since: number } | null>(null);

  // Phase 4 — eye sustained timers
  const eyesClosedSinceRef  = useRef<number | null>(null);
  const eyesAwaySinceRef    = useRef<number | null>(null);
  const eyesMissingSinceRef = useRef<number | null>(null);

  // ─── Snapshot capture for high-value violations ─────────────────────────
  const captureSnapshot = (): string | undefined => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return undefined;
    try {
      const snap = document.createElement("canvas");
      snap.width = video.videoWidth;
      snap.height = video.videoHeight;
      const ctx = snap.getContext("2d");
      if (!ctx) return undefined;
      ctx.drawImage(video, 0, 0, snap.width, snap.height);
      return snap.toDataURL("image/jpeg", 0.6);
    } catch {
      return undefined;
    }
  };

  // ─── Shared violation logger ────────────────────────────────────────────
  const logViolation = async (eventType: ViolationType, details?: string, confidence?: number) => {
    if (!sessionId) return;
    const now = Date.now();
    const last = lastLoggedAtRef.current[eventType] || 0;
    if (now - last < VIOLATION_COOLDOWN_MS) return;
    lastLoggedAtRef.current[eventType] = now;

    const evidence = EVIDENCE_EVENT_TYPES.has(eventType) ? captureSnapshot() : undefined;

    try {
      await apiFetch(`/proctor/${sessionId}/log`, {
        method: "POST",
        body: JSON.stringify({ eventType, details, evidence, confidence }),
      });
    } catch { /* best-effort */ }
  };

  // ─── Phase 3: head pose violation handler ───────────────────────────────
  const handlePoseViolation = (direction: HeadDirection) => {
    const now = Date.now();
    const dirToViolation: Partial<Record<HeadDirection, ViolationType>> = {
      left: "HEAD_LEFT", right: "HEAD_RIGHT",
      up:   "HEAD_UP",   down:  "HEAD_DOWN",  away: "LOOKING_AWAY",
    };
    if (direction === "forward" || direction === "unknown") {
      poseStartRef.current = null; return;
    }
    const pose = poseStartRef.current;
    if (!pose || pose.direction !== direction) {
      poseStartRef.current = { direction, since: now }; return;
    }
    if (now - pose.since >= POSE_VIOLATION_MS) {
      const vt = dirToViolation[direction];
      if (vt) logViolation(vt, `Sustained ${Math.round((now - pose.since)/1000)}s`);
    }
  };

  // ─── Phase 6: face distance violation handler ───────────────────────────
  const handleDistanceViolation = (distance: DistanceStatus) => {
    const now = Date.now();
    if (distance === "ok" || distance === "unknown") {
      distanceStartRef.current = null;
      return;
    }
    const tracked = distanceStartRef.current;
    if (!tracked || tracked.status !== distance) {
      distanceStartRef.current = { status: distance, since: now };
      return;
    }
    if (now - tracked.since >= DISTANCE_VIOLATION_MS) {
      const vt: ViolationType = distance === "too_close" ? "FACE_TOO_CLOSE" : "FACE_TOO_FAR";
      logViolation(vt, `Sustained ${Math.round((now - tracked.since) / 1000)}s`);
    }
  };

  // ─── Phase 4: eye violation handler ─────────────────────────────────────
  const handleEyeViolation = (es: EyeStatus) => {
    const now = Date.now();

    // Reset timers for inactive states
    if (es !== "closed")  eyesClosedSinceRef.current  = null;
    if (es !== "away")    eyesAwaySinceRef.current    = null;
    if (es !== "missing") eyesMissingSinceRef.current = null;

    if (es === "closed") {
      if (!eyesClosedSinceRef.current) { eyesClosedSinceRef.current = now; return; }
      if (now - eyesClosedSinceRef.current >= EYES_CLOSED_VIOLATION_MS) {
        logViolation("EYES_CLOSED", `Closed for ${Math.round((now - eyesClosedSinceRef.current)/1000)}s`);
      }
    } else if (es === "away") {
      if (!eyesAwaySinceRef.current) { eyesAwaySinceRef.current = now; return; }
      if (now - eyesAwaySinceRef.current >= EYES_AWAY_VIOLATION_MS) {
        logViolation("LOOKING_AWAY", `Eyes away for ${Math.round((now - eyesAwaySinceRef.current)/1000)}s`);
      }
    } else if (es === "missing") {
      if (!eyesMissingSinceRef.current) { eyesMissingSinceRef.current = now; return; }
      if (now - eyesMissingSinceRef.current >= EYES_MISSING_VIOLATION_MS) {
        logViolation("EYES_MISSING", `Missing for ${Math.round((now - eyesMissingSinceRef.current)/1000)}s`);
      }
    }
  };

  // ─── EFFECT 1: Load models ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    console.log("[FaceDetection] Loading AI models from", MODEL_URL);
    loadFaceModelsOnce()
      .then(() => {
        if (cancelled) return;
        console.log("[FaceDetection] ✅ Models loaded");
        modelsReadyRef.current = true;
        setStatus((prev) => prev === "loading" ? "detecting" : prev);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err?.message || String(err);
        console.error("[FaceDetection] ❌ Model load failed:", err);
        setModelError(`Failed to load AI proctoring models: ${msg}. Check /models/ is accessible.`);
      });
    return () => { cancelled = true; };
  }, []);

  // ─── EFFECT 2: Attach webcam stream ─────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    let ownStream: MediaStream | null = null;

    const attachStream = async () => {
      let stream = getProctorStream();
      const tracks = stream?.getVideoTracks() ?? [];
      const isLive = tracks.length > 0 && tracks[0].readyState !== "ended";

      if (!stream || !isLive) {
        console.warn("[FaceDetection] Inherited stream unavailable — requesting directly");
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          ownStream = stream; setProctorStream(stream);
          console.log("[FaceDetection] ✅ Fallback camera acquired");
        } catch (err) {
          if (cancelled) return;
          setCameraErrMsg(getCameraErrorReason(err));
          setStatus("camera_error"); return;
        }
      } else {
        console.log("[FaceDetection] ✅ Inherited stream is live");
      }

      if (cancelled) { ownStream?.getTracks().forEach((t) => t.stop()); return; }

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        const markReady = () => {
          if (cancelled) return;
          console.log("[FaceDetection] ✅ Video ready —",
            video.videoWidth, "x", video.videoHeight, "readyState:", video.readyState);
          cameraReadyRef.current = true;
        };
        if (video.readyState >= 2) markReady();
        else video.addEventListener("loadeddata", markReady, { once: true });

        const [track] = stream.getVideoTracks();
        if (track) {
          track.addEventListener("ended", () => {
            stoppedRef.current = true; cameraReadyRef.current = false;
            setCameraErrMsg("Camera disconnected."); setStatus("camera_error");
            logViolation("CAMERA_DISABLED", "Video track ended during exam");
          });
        }
      }
    };

    attachStream();
    return () => {
      cancelled = true;
      if (ownStream) ownStream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ─── EFFECT 3: Detection interval (runs once; reads refs each tick) ──────
  useEffect(() => {
    let tickCount = 0;

    const detect = async () => {
      if (stoppedRef.current)  return;
      if (!modelsReadyRef.current || !cameraReadyRef.current) return;

      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || video.readyState < 2) return;

      tickCount++;
      try {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }))
          .withFaceLandmarks();

        if (stoppedRef.current) return;

        const count = detections.length;
        console.log(`[FaceDetection] tick#${tickCount} — faces: ${count}`);

        let newFaceStatus: FaceStatus;
        let newDirection:  HeadDirection = "unknown";
        let newEyeStatus:  EyeStatus    = "unknown";
        let newDistance:   DistanceStatus = "unknown";

        if (count === 0) {
          newFaceStatus = "no_face";
          logViolation("NO_FACE");
          poseStartRef.current       = null;
          eyesClosedSinceRef.current = null;
          eyesAwaySinceRef.current   = null;
          eyesMissingSinceRef.current= null;
          distanceStartRef.current   = null;
        } else if (count > 1) {
          newFaceStatus = "multiple_face";
          logViolation("MULTIPLE_FACE");
          poseStartRef.current       = null;
          eyesClosedSinceRef.current = null;
          eyesAwaySinceRef.current   = null;
          eyesMissingSinceRef.current= null;
          distanceStartRef.current   = null;
        } else {
          // ── Single face: Phase 3 head pose ──────────────────────────────
          newFaceStatus = "face";
          const pose = estimateHeadDirection(detections[0].landmarks);
          newDirection = pose.direction;
          handlePoseViolation(pose.direction);

          // ── Single face: Phase 4 eye tracking ───────────────────────────
          const { eyeStatus: es, leftEAR, rightEAR } =
            analyzeEyes(detections[0].landmarks, pose.yaw, pose.pitch);
          newEyeStatus = es;
          handleEyeViolation(es);

          // ── Single face: Phase 6 distance check ─────────────────────────
          newDistance = computeDistanceStatus(
            detections[0].detection.box,
            video.videoWidth,
            video.videoHeight
          );
          handleDistanceViolation(newDistance);

          console.log(`[FaceDetection] tick#${tickCount} — head: ${newDirection} | eye: ${es} | distance: ${newDistance} | EAR L:${leftEAR.toFixed(2)} R:${rightEAR.toFixed(2)}`);
        }

        setStatus(newFaceStatus);
        setHeadDirection(newDirection);
        setEyeStatus(newEyeStatus);
        setDistanceStatus(newDistance);

        // ── Canvas drawing ───────────────────────────────────────────────
        if (canvas && video.clientWidth > 0 && video.clientHeight > 0) {
          const displaySize = { width: video.clientWidth, height: video.clientHeight };
          faceapi.matchDimensions(canvas, displaySize);
          const resized = faceapi.resizeResults(detections, displaySize);
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const boxColor = count === 1 ? "#22c55e" : "#ef4444";

            resized.forEach((d, idx) => {
              // Bounding box (Phase 2)
              const { x, y, width, height } = d.detection.box;
              ctx.strokeStyle = boxColor; ctx.lineWidth = 3;
              ctx.strokeRect(x, y, width, height);

              if (count === 1 && video.videoWidth > 0 && video.videoHeight > 0) {
                const scaleX = displaySize.width  / video.videoWidth;
                const scaleY = displaySize.height / video.videoHeight;

                // Nose direction line (Phase 3)
                drawNoseDirectionLine(ctx, detections[idx].landmarks, newDirection, scaleX, scaleY);

                // Eye landmark dots (Phase 4)
                drawEyeLandmarks(ctx, detections[idx].landmarks, newEyeStatus, scaleX, scaleY);
              }
            });
          }
        }
      } catch (err) {
        console.error("[FaceDetection] detect() error:", err);
      }
    };

    console.log("[FaceDetection] Detection interval started");
    const id = setInterval(detect, DETECTION_INTERVAL_MS);
    return () => { clearInterval(id); stoppedRef.current = true; };
  }, []); // empty deps — reads all live values via refs

  // ─── EFFECT 4: Object detection (coco-ssd) — phone/book on-desk detection ─
  // Runs independently of face detection: a separate (heavier) model on a
  // much slower interval, reusing the same <video> element already playing
  // the live camera feed. A load failure here degrades gracefully — face
  // detection keeps working — since object detection is additive, not core.
  useEffect(() => {
    let cancelled = false;

    loadCocoModelOnce()
      .then((model) => {
        if (cancelled) return;
        cocoModelRef.current = model;
        setObjectStatus((prev) => (prev === "loading" ? "clear" : prev));
      })
      .catch((err) => {
        console.error("[ObjectDetection] Failed to load coco-ssd model:", err);
        if (!cancelled) setObjectStatus("unavailable");
      });

    const detectObjects = async () => {
      if (stoppedRef.current || cancelled) return;
      const model = cocoModelRef.current;
      const video = videoRef.current;
      if (!model || !video || video.readyState < 2 || !cameraReadyRef.current) return;

      try {
        const predictions = await model.detect(video);
        const phone = predictions.find(
          (p) => p.class === "cell phone" && p.score >= OBJECT_SCORE_THRESHOLD
        );
        const book = predictions.find(
          (p) => p.class === "book" && p.score >= OBJECT_SCORE_THRESHOLD
        );
        const laptop = predictions.find(
          (p) => p.class === "laptop" && p.score >= OBJECT_SCORE_THRESHOLD
        );
        const personCount = predictions.filter(
          (p) => p.class === "person" && p.score >= OBJECT_SCORE_THRESHOLD
        ).length;

        if (phone) {
          setObjectStatus("phone");
          logViolation("PHONE_DETECTED", `confidence ${(phone.score * 100).toFixed(0)}%`, phone.score * 100);
        } else if (personCount > 1) {
          // Independent signal from face detection: coco-ssd can pick up a
          // second person even when face-api only ever sees one face at a
          // time (e.g. someone standing behind/beside, out of the tight
          // face-detection crop but still in the wider camera frame).
          setObjectStatus("second_person");
          logViolation("SECOND_PERSON_DETECTED", `${personCount} people in frame`);
        } else if (book) {
          setObjectStatus("book");
          logViolation("BOOK_DETECTED", `confidence ${(book.score * 100).toFixed(0)}%`, book.score * 100);
        } else if (laptop) {
          setObjectStatus("laptop");
          logViolation("LAPTOP_DETECTED", `confidence ${(laptop.score * 100).toFixed(0)}%`, laptop.score * 100);
        } else {
          setObjectStatus("clear");
        }
      } catch (err) {
        console.error("[ObjectDetection] detect() error:", err);
      }
    };

    const objId = setInterval(detectObjects, OBJECT_DETECTION_INTERVAL_MS);
    return () => { cancelled = true; clearInterval(objId); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── EFFECT 5: Audio monitoring — sustained noise + mic-disabled detection
  // Reuses the audio track already present on the shared proctoring stream
  // (requested alongside video back in ProctoringSetup) rather than opening
  // a second microphone connection.
  useEffect(() => {
    let cancelled = false;
    let audioCtx: AudioContext | null = null;
    let intervalId: number | null = null;
    let noiseSince: number | null = null;

    const setup = () => {
      const stream = getProctorStream();
      const [audioTrack] = stream?.getAudioTracks() ?? [];
      if (!audioTrack) return; // no mic in this session — nothing to monitor

      audioTrack.addEventListener("ended", () => {
        logViolation("MICROPHONE_DISABLED", "Audio track ended during exam");
      });

      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioCtx.createMediaStreamSource(new MediaStream([audioTrack]));
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        intervalId = window.setInterval(() => {
          if (cancelled || stoppedRef.current) return;
          analyser.getByteTimeDomainData(data);

          let sumSquares = 0;
          for (let i = 0; i < data.length; i++) {
            const normalized = (data[i] - 128) / 128;
            sumSquares += normalized * normalized;
          }
          const rms = Math.sqrt(sumSquares / data.length);

          const now = Date.now();
          if (rms >= NOISE_RMS_THRESHOLD) {
            if (noiseSince === null) noiseSince = now;
            if (now - noiseSince >= NOISE_SUSTAINED_MS) {
              logViolation("NOISE_DETECTED", `RMS ${rms.toFixed(3)}`);
              noiseSince = now; // restart window so cooldown (not this timer) governs re-logging
            }
          } else {
            noiseSince = null;
          }
        }, AUDIO_CHECK_INTERVAL_MS);
      } catch (err) {
        console.error("[AudioMonitor] Failed to start audio analysis:", err);
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (intervalId !== null) window.clearInterval(intervalId);
      audioCtx?.close().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── EFFECT 6: Camera stream health — frozen frame / black screen ───────
  // Runs independently of face detection so it keeps working even while
  // face-api is between ticks; uses a tiny offscreen canvas (16x16) so the
  // per-tick cost is negligible regardless of the real camera resolution.
  useEffect(() => {
    const healthCanvas = document.createElement("canvas");
    healthCanvas.width = HEALTH_SAMPLE_SIZE;
    healthCanvas.height = HEALTH_SAMPLE_SIZE;
    const healthCtx = healthCanvas.getContext("2d", { willReadFrequently: true });

    let lastFrame: Uint8ClampedArray | null = null;
    let frozenSince: number | null = null;
    let blackSince: number | null = null;

    const checkHealth = () => {
      if (stoppedRef.current || !cameraReadyRef.current || !healthCtx) return;
      const video = videoRef.current;
      if (!video || video.readyState < 2 || video.videoWidth === 0) return;

      let frame: ImageData;
      try {
        healthCtx.drawImage(video, 0, 0, HEALTH_SAMPLE_SIZE, HEALTH_SAMPLE_SIZE);
        frame = healthCtx.getImageData(0, 0, HEALTH_SAMPLE_SIZE, HEALTH_SAMPLE_SIZE);
      } catch {
        return; // e.g. a transient decode error — try again next tick
      }

      const now = Date.now();
      const pixels = frame.data;

      // Average luminance (simple, fast approximation — good enough at 16x16)
      let luminanceSum = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        luminanceSum += 0.299 * pixels[i] + 0.587 * pixels[i + 1] + 0.114 * pixels[i + 2];
      }
      const avgLuminance = luminanceSum / (pixels.length / 4);

      if (avgLuminance <= BLACK_SCREEN_LUMINANCE_THRESHOLD) {
        if (blackSince === null) blackSince = now;
        if (now - blackSince >= BLACK_SCREEN_SUSTAINED_MS) {
          logViolation("CAMERA_BLACK_SCREEN", `Avg luminance ${avgLuminance.toFixed(1)}/255`);
        }
      } else {
        blackSince = null;
      }

      // Frame-to-frame diff (skipped on the very first sample, and skipped
      // while the frame is black — a black frame is "unchanging" by
      // definition and would otherwise double-fire as CAMERA_FROZEN too).
      if (lastFrame && avgLuminance > BLACK_SCREEN_LUMINANCE_THRESHOLD) {
        let diffSum = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          diffSum += Math.abs(pixels[i] - lastFrame[i]);
        }
        const avgDiff = diffSum / (pixels.length / 4);

        if (avgDiff <= FROZEN_FRAME_DIFF_THRESHOLD) {
          if (frozenSince === null) frozenSince = now;
          if (now - frozenSince >= FROZEN_SUSTAINED_MS) {
            logViolation("CAMERA_FROZEN", `Avg pixel delta ${avgDiff.toFixed(2)} over ${Math.round((now - frozenSince) / 1000)}s`);
          }
        } else {
          frozenSince = null;
        }
      }

      lastFrame = pixels;
    };

    const id = window.setInterval(checkHealth, HEALTH_CHECK_INTERVAL_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── EFFECT 7: Permission-revocation polling (secondary signal) ─────────
  // track.addEventListener("ended", ...) in Effect 2/5 is the primary
  // camera/mic-lost signal, but per the requirement to never rely on a
  // single browser event, this polls the Permissions API (where supported)
  // as an independent check — catching the case where a browser revokes
  // access without ever firing "ended" on the existing track object.
  useEffect(() => {
    if (!navigator.permissions?.query) return; // unsupported (Firefox/Safari) — silently skip

    let cancelled = false;
    let lastCameraState: PermissionState | null = null;
    let lastMicState: PermissionState | null = null;

    const poll = async () => {
      if (cancelled || stoppedRef.current) return;
      try {
        const [cameraPerm, micPerm] = await Promise.all([
          navigator.permissions.query({ name: "camera" as PermissionName }).catch(() => null),
          navigator.permissions.query({ name: "microphone" as PermissionName }).catch(() => null),
        ]);

        if (cameraPerm) {
          if (lastCameraState === "granted" && cameraPerm.state !== "granted") {
            logViolation("CAMERA_PERMISSION_REVOKED", `Permission changed to ${cameraPerm.state}`);
          }
          lastCameraState = cameraPerm.state;
        }
        if (micPerm) {
          if (lastMicState === "granted" && micPerm.state !== "granted") {
            logViolation("MICROPHONE_PERMISSION_REVOKED", `Permission changed to ${micPerm.state}`);
          }
          lastMicState = micPerm.state;
        }
      } catch {
        // Permissions API unsupported for these names on this browser — skip silently.
      }
    };

    const id = window.setInterval(poll, PERMISSION_POLL_INTERVAL_MS);
    poll(); // seed initial state immediately rather than waiting a full interval
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Status display configs ──────────────────────────────────────────────
  const faceStatusConfig: Record<FaceStatus, { label: string; dot: string; textColor: string }> = {
    loading:       { label: "Loading AI models...",    dot: "bg-yellow-400", textColor: "text-yellow-700" },
    detecting:     { label: "Detecting...",            dot: "bg-yellow-400", textColor: "text-yellow-700" },
    face:          { label: "Face Detected",           dot: "bg-green-500",  textColor: "text-green-700"  },
    no_face:       { label: "No Face Detected",        dot: "bg-red-500",    textColor: "text-red-700"    },
    multiple_face: { label: "Multiple Faces Detected", dot: "bg-red-500",    textColor: "text-red-700"    },
    camera_error:  { label: "Camera Unavailable",      dot: "bg-red-500",    textColor: "text-red-700"    },
  };

  const headStatusConfig: Record<HeadDirection, { label: string; dot: string; textColor: string }> = {
    forward: { label: "Looking Forward", dot: "bg-green-500",  textColor: "text-green-700"  },
    left:    { label: "Looking Left",    dot: "bg-yellow-400", textColor: "text-yellow-700" },
    right:   { label: "Looking Right",   dot: "bg-yellow-400", textColor: "text-yellow-700" },
    up:      { label: "Looking Up",      dot: "bg-yellow-400", textColor: "text-yellow-700" },
    down:    { label: "Looking Down",    dot: "bg-yellow-400", textColor: "text-yellow-700" },
    away:    { label: "Looking Away",    dot: "bg-red-500",    textColor: "text-red-700"    },
    unknown: { label: "Detecting...",    dot: "bg-yellow-400", textColor: "text-yellow-700" },
  };

  const eyeStatusConfig: Record<EyeStatus, { label: string; dot: string; textColor: string }> = {
    screen:  { label: "Looking at Screen", dot: "bg-green-500",  textColor: "text-green-700"  },
    away:    { label: "Looking Away",      dot: "bg-yellow-400", textColor: "text-yellow-700" },
    closed:  { label: "Eyes Closed",       dot: "bg-yellow-400", textColor: "text-yellow-700" },
    missing: { label: "Eyes Missing",      dot: "bg-red-500",    textColor: "text-red-700"    },
    unknown: { label: "Detecting...",      dot: "bg-yellow-400", textColor: "text-yellow-700" },
  };

  const distanceStatusConfig: Record<DistanceStatus, { label: string; dot: string; textColor: string }> = {
    ok:        { label: "Distance OK",         dot: "bg-green-500",  textColor: "text-green-700"  },
    too_close: { label: "Too Close to Camera", dot: "bg-yellow-400", textColor: "text-yellow-700" },
    too_far:   { label: "Too Far from Camera", dot: "bg-yellow-400", textColor: "text-yellow-700" },
    unknown:   { label: "Detecting...",        dot: "bg-yellow-400", textColor: "text-yellow-700" },
  };

  const objectStatusConfig: Record<ObjectStatus, { label: string; dot: string; textColor: string }> = {
    loading:       { label: "Loading object detection...", dot: "bg-yellow-400", textColor: "text-yellow-700" },
    clear:         { label: "No Prohibited Items",          dot: "bg-green-500",  textColor: "text-green-700"  },
    phone:         { label: "Phone Detected",                dot: "bg-red-500",    textColor: "text-red-700"    },
    book:          { label: "Book Detected",                 dot: "bg-red-500",    textColor: "text-red-700"    },
    laptop:        { label: "Second Screen Detected",        dot: "bg-red-500",    textColor: "text-red-700"    },
    second_person: { label: "Second Person Detected",        dot: "bg-red-500",    textColor: "text-red-700"    },
    unavailable:   { label: "Object Detection Unavailable",  dot: "bg-slate-400",  textColor: "text-slate-500"  },
  };

  const faceCfg = faceStatusConfig[status];
  const headCfg = headStatusConfig[headDirection];
  const eyeCfg  = eyeStatusConfig[eyeStatus];
  const distCfg = distanceStatusConfig[distanceStatus];
  const objCfg  = objectStatusConfig[objectStatus];

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <Camera className="w-4 h-4" /> Camera Monitor
      </h3>

      <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative mb-3">
        {modelError ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <div>
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 text-xs leading-relaxed">{modelError}</p>
            </div>
          </div>
        ) : status === "camera_error" ? (
          <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
            <div>
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 text-xs leading-relaxed">
                {cameraErrMsg || "Camera is unavailable."}
              </p>
            </div>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay muted playsInline
              className="w-full h-full object-cover" />
            <canvas ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none" />
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-spin" />
                  <p className="text-slate-300 text-xs">Loading AI models...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Live Status Panel — three rows stacked */}
      <div className="space-y-1.5">
        {/* Row 1 — Face detection (Phase 2) */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${faceCfg.dot}`} />
          <span className={`text-sm font-medium ${faceCfg.textColor}`}>{faceCfg.label}</span>
        </div>

        {/* Rows 2 + 3 — only visible when exactly one face is detected */}
        {status === "face" && (
          <>
            {/* Row 2 — Head pose (Phase 3) */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${headCfg.dot}`} />
              <span className={`text-sm font-medium ${headCfg.textColor}`}>{headCfg.label}</span>
            </div>

            {/* Row 3 — Eye tracking (Phase 4) */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${eyeCfg.dot}`} />
              <span className={`text-sm font-medium ${eyeCfg.textColor}`}>{eyeCfg.label}</span>
            </div>

            {/* Row 3b — Distance (Phase 6) */}
            {distanceStatus !== "unknown" && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${distCfg.dot}`} />
                <span className={`text-sm font-medium ${distCfg.textColor}`}>{distCfg.label}</span>
              </div>
            )}
          </>
        )}

        {/* Row 4 — Object detection (Phase 5) — always shown; monitors the
            desk area regardless of whether a face is currently detected */}
        {objectStatus !== "unavailable" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${objCfg.dot}`} />
            <span className={`text-sm font-medium ${objCfg.textColor}`}>{objCfg.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
