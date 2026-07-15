import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

// Module-level promise, shared across every component that imports this
// file, so the (fairly large) face-api.js model weights are only ever
// fetched once per page load — regardless of whether ProctoringSetup's
// pre-exam face check and FaceDetectionMonitor's in-exam monitoring both
// need them. Reset to null on failure so the next caller can retry rather
// than being stuck with a permanently-rejected promise.
let modelsLoadPromise: Promise<void> | null = null;

export function loadFaceModelsOnce(): Promise<void> {
  if (!modelsLoadPromise) {
    modelsLoadPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ])
      .then(() => undefined)
      .catch((err) => {
        modelsLoadPromise = null;
        throw err;
      });
  }
  return modelsLoadPromise;
}

export type QuickFaceCheckResult = "face" | "no_face" | "multiple_face";

/**
 * One-shot face count check against a live <video> element — used by
 * ProctoringSetup's pre-exam readiness card. Lighter-weight than the full
 * monitoring loop in FaceDetectionMonitor (no landmarks/head-pose/eye
 * tracking needed here, just "is exactly one face visible right now").
 */
export async function quickFaceCheck(video: HTMLVideoElement): Promise<QuickFaceCheckResult> {
  const detections = await faceapi.detectAllFaces(
    video,
    new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
  );
  if (detections.length === 0) return "no_face";
  if (detections.length > 1) return "multiple_face";
  return "face";
}
