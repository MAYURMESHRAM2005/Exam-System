import { ArrowLeft, Camera, Mic, Monitor, CheckCircle2, AlertCircle, Loader2, ShieldAlert, Wifi } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { setProctorStream, stopProctorStream } from '../lib/proctorStream';
import { loadFaceModelsOnce, quickFaceCheck } from '../lib/faceModels';
import { apiFetch } from '../services/httpClient';

interface ProctoringSetupProps {
  examId: string | null;
  onStartExam: () => void;
  onBack: () => void;
  onSessionStarted?: (sessionId: string) => void;
}

type DeviceStatus = 'checking' | 'ready' | 'denied' | 'unavailable';

export function ProctoringSetup({ examId, onStartExam, onBack, onSessionStarted }: ProctoringSetupProps) {
  const [browserSupported, setBrowserSupported] = useState<boolean | null>(null);
  const [cameraStatus, setCameraStatus] = useState<DeviceStatus>('checking');
  const [micStatus, setMicStatus] = useState<DeviceStatus>('checking');
  // Real checks — previously this card was a hardcoded "always green"
  // placeholder that didn't reflect anything about the actual browser/
  // network. fullscreenSupported reflects whether the Fullscreen API is
  // even available in this browser (it's requested later, at the actual
  // "Start Exam" click, since it must happen inside a user gesture — see
  // handleStart below); isOnline is the live network status.
  const [fullscreenSupported] = useState<boolean>(() => Boolean(document.documentElement.requestFullscreen));
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);
  // Pre-exam face-detection readiness check (requirement: show Face
  // Detection status before the exam starts, not just camera/mic). Reuses
  // the shared model loader from lib/faceModels.ts — the same model
  // weights FaceDetectionMonitor uses in-exam, loaded once and cached.
  const [faceCheckStatus, setFaceCheckStatus] = useState<'loading' | 'face' | 'no_face' | 'multiple_face' | 'unavailable'>('loading');
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const handedOffRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  // ===== Backend helpers =====
  const startProctorSession = async () => {
    if (!examId) return;
    setSessionError(null);
    try {
      const data = await apiFetch('/proctor/start', {
        method: 'POST',
        body: JSON.stringify({
          examId,
          browserInfo: navigator.userAgent,
          browserSupported: true,
        }),
      });
      sessionIdRef.current = data.sessionId;
      setSessionReady(true);
      onSessionStarted?.(data.sessionId);
    } catch (err: any) {
      setSessionReady(false);
      setSessionError(err.message || 'Failed to start proctoring session');
    }
  };

  const logEvent = async (eventType: string, details?: string) => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    try {
      await apiFetch(`/proctor/${sid}/log`, {
        method: 'POST',
        body: JSON.stringify({ eventType, details }),
      });
    } catch {
      // best-effort logging — never blocks the exam flow
    }
  };

  // ===== Browser compatibility check =====
  useEffect(() => {
    const supported =
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function';

    setBrowserSupported(supported);

    if (!supported) {
      setCameraStatus('unavailable');
      setMicStatus('unavailable');
    }
  }, []);

  // ===== Live network status =====
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // ===== Face-detection pre-check =====
  // Only starts once the camera is actually streaming; loads the same
  // face-api.js models FaceDetectionMonitor uses in-exam (shared loader —
  // see lib/faceModels.ts — so this doesn't trigger a second model
  // download) and polls every 1.5s for exactly one visible face.
  useEffect(() => {
    if (cameraStatus !== 'ready') return;

    let cancelled = false;
    let intervalId: number | null = null;

    loadFaceModelsOnce()
      .then(() => {
        if (cancelled) return;
        intervalId = window.setInterval(async () => {
          const video = videoRef.current;
          if (!video || video.readyState < 2 || cancelled) return;
          try {
            const result = await quickFaceCheck(video);
            if (!cancelled) setFaceCheckStatus(result);
          } catch {
            // transient decode error — leave the last known status in place
          }
        }, 1500);
      })
      .catch(() => {
        if (!cancelled) setFaceCheckStatus('unavailable');
      });

    return () => {
      cancelled = true;
      if (intervalId !== null) window.clearInterval(intervalId);
    };
  }, [cameraStatus]);

  // ===== Start proctor session as soon as the screen loads =====
  useEffect(() => {
    if (browserSupported === null) return; // wait for the compatibility check first
    startProctorSession();
    if (!browserSupported) {
      logEvent('browser_unsupported', navigator.userAgent);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserSupported]);

  // ===== Real camera + microphone permission request =====
  useEffect(() => {
    if (!browserSupported) return;

    let cancelled = false;

    const requestDevices = async () => {
      logEvent('camera_requested');
      logEvent('microphone_requested');

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;

        // ✅ Store the stream in the shared module immediately on acquisition,
        // not only at click time. This eliminates the React effect ordering
        // race: FaceDetectionMonitor's mount effect reads getProctorStream()
        // and will find a live stream regardless of when React schedules it
        // relative to ProctoringSetup's unmount cleanup.
        setProctorStream(stream);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        const hasVideoTrack = stream.getVideoTracks().length > 0;
        const hasAudioTrack = stream.getAudioTracks().length > 0;

        setCameraStatus(hasVideoTrack ? 'ready' : 'unavailable');
        setMicStatus(hasAudioTrack ? 'ready' : 'unavailable');

        logEvent(hasVideoTrack ? 'camera_granted' : 'device_unavailable', 'camera');
        logEvent(hasAudioTrack ? 'microphone_granted' : 'device_unavailable', 'microphone');
      } catch (err: any) {
        if (cancelled) return;

        // NotFoundError = no camera/mic device exists on this machine.
        // NotAllowedError / PermissionDeniedError = user denied permission.
        if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
          setCameraStatus('unavailable');
          setMicStatus('unavailable');
          logEvent('device_unavailable', err?.message);
        } else {
          setCameraStatus('denied');
          setMicStatus('denied');
          logEvent('camera_denied', err?.message);
          logEvent('microphone_denied', err?.message);
        }
      }
    };

    requestDevices();

    return () => {
      cancelled = true;
      // Only stop the stream here if it was NOT handed off via handleStart
      // (i.e. the student is navigating away without proceeding to the exam).
      // handleStart() calls setProctorStream() synchronously before
      // triggering the screen change, so by the time this cleanup runs we
      // can safely check whether the stream is still "ours" or has moved on.
      if (!handedOffRef.current) {
        streamRef.current?.getTracks().forEach((t) => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browserSupported]);

  // ===== Retry handler for the permission-denied screen =====
  const handleRetry = () => {
    setCameraStatus('checking');
    setMicStatus('checking');
    // Re-running the effect requires a new "tick" — simplest reliable way
    // without restructuring state is to just re-invoke the same logic.
    (async () => {
      logEvent('camera_requested');
      logEvent('microphone_requested');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        setProctorStream(stream); // keep shared module in sync immediately
        if (videoRef.current) videoRef.current.srcObject = stream;
        const hasVideoTrack = stream.getVideoTracks().length > 0;
        const hasAudioTrack = stream.getAudioTracks().length > 0;
        setCameraStatus(hasVideoTrack ? 'ready' : 'unavailable');
        setMicStatus(hasAudioTrack ? 'ready' : 'unavailable');
        logEvent(hasVideoTrack ? 'camera_granted' : 'device_unavailable', 'camera');
        logEvent(hasAudioTrack ? 'microphone_granted' : 'device_unavailable', 'microphone');
      } catch (err: any) {
        if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
          setCameraStatus('unavailable');
          setMicStatus('unavailable');
          logEvent('device_unavailable', err?.message);
        } else {
          setCameraStatus('denied');
          setMicStatus('denied');
          logEvent('camera_denied', err?.message);
          logEvent('microphone_denied', err?.message);
        }
      }
    })();
  };

  const allChecksPass =
    cameraStatus === 'ready' &&
    micStatus === 'ready' &&
    browserSupported === true &&
    sessionReady &&
    fullscreenSupported &&
    isOnline;
  const permissionDenied = cameraStatus === 'denied' || micStatus === 'denied';
  const deviceUnavailable = cameraStatus === 'unavailable' || micStatus === 'unavailable';

  const handleStart = () => {
    // Prevent duplicate invocations — a fast double-click, or a click that
    // lands right as React re-renders the (now momentarily still-enabled)
    // button, should not fire this twice.
    if (isStarting) return;
    setIsStarting(true);

    // ✅ Hand the already-granted camera/mic stream off to Face Detection
    // (Phase 2) instead of stopping it — this is what makes "use the webcam
    // already initialized in Phase 1" actually true.
    handedOffRef.current = true;
    if (streamRef.current) {
      setProctorStream(streamRef.current);
    } else {
      // Defensive: allChecksPass should make this unreachable (camera must
      // already be 'ready', which only happens once streamRef.current is
      // set), but if it ever does happen, fail visibly instead of silently
      // no-op'ing — a silent console-only error here was previously
      // indistinguishable from "nothing happens" to the student.
      setIsStarting(false);
      setSessionError('Camera stream is not ready yet. Please wait a moment and try again.');
      return;
    }
    // Fullscreen must be requested synchronously inside a real user-gesture
    // handler (this click) — browsers reject requestFullscreen() calls made
    // later, e.g. inside an effect on the next screen. If it's rejected
    // anyway (unsupported environment, iframe restrictions, etc.) the exam
    // still proceeds; useBrowserSecurity just won't have anything to
    // exit-detect until fullscreen is entered.
    document.documentElement.requestFullscreen?.().catch(() => {});
    onStartExam();
  };

  const handleBack = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    stopProctorStream();
    if (sessionIdRef.current) {
      apiFetch(`/proctor/${sessionIdRef.current}/end`, { method: 'POST' }).catch(() => {});
    }
    onBack();
  };

  // ===== Browser not supported screen =====
  if (browserSupported === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-xl p-8 max-w-md text-center">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Browser Not Supported</h2>
          <p className="text-slate-600 text-sm mb-6">
            Your browser does not support camera/microphone access required for
            AI proctoring. Please use an up-to-date version of Chrome, Firefox,
            or Edge.
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300"
          >
            Back to Instructions
          </button>
        </div>
      </div>
    );
  }

  // ===== Permission denied screen =====
  if (permissionDenied) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Camera/Microphone Access Denied</h2>
          <p className="text-slate-600 text-sm mb-6">
            This exam requires camera and microphone access for AI proctoring.
            Please allow access in your browser settings and try again.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleBack}
              className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300"
            >
              Back
            </button>
            <button
              onClick={handleRetry}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Proctoring Setup
          </h1>
          <p className="text-sm sm:text-base text-slate-600">Verify your devices before starting the exam</p>
        </div>

        {sessionError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-3xl mx-auto flex items-center justify-between gap-4">
            <span className="text-sm text-red-700">{sessionError}</span>
            <button
              onClick={startProctorSession}
              className="text-sm font-medium text-red-700 hover:text-red-800 underline flex-shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {deviceUnavailable && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-6 max-w-3xl mx-auto">
            One or more required devices (camera/microphone) could not be found
            on this device. Please connect a camera and microphone, then go
            back and try again.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Camera Preview */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Camera Preview</h2>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden relative mb-4">
                {/* Real live camera feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className={`w-full h-full object-cover ${cameraStatus === 'ready' ? 'block' : 'hidden'}`}
                />

                {cameraStatus !== 'ready' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      {cameraStatus === 'checking' ? (
                        <Loader2 className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-spin" />
                      ) : (
                        <Camera className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                      )}
                      <p className="text-slate-400 text-sm">
                        {cameraStatus === 'checking'
                          ? 'Requesting camera access...'
                          : cameraStatus === 'unavailable'
                          ? 'No camera detected'
                          : 'Camera unavailable'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Device summary */}
              <div className="p-4 rounded-lg flex items-center gap-3 bg-blue-50 border border-blue-200">
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">AI Monitoring Ready</p>
                  <p className="text-sm text-blue-700">
                    Face, gaze, and object detection will activate once the exam starts.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* System Checks */}
          <div className="space-y-6">
            {/* Camera Check */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    cameraStatus === 'ready' 
                      ? 'bg-green-100' 
                      : cameraStatus === 'checking'
                      ? 'bg-blue-100'
                      : 'bg-red-100'
                  }`}>
                    <Camera className={`w-6 h-6 ${
                      cameraStatus === 'ready'
                        ? 'text-green-600'
                        : cameraStatus === 'checking'
                        ? 'text-blue-600'
                        : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Camera Access</h3>
                    <p className="text-sm text-slate-600">Webcam monitoring</p>
                  </div>
                </div>
                {cameraStatus === 'ready' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : cameraStatus === 'checking' ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <p className="text-sm text-slate-600">
                {cameraStatus === 'ready'
                  ? 'Camera is working properly'
                  : cameraStatus === 'checking'
                  ? 'Checking camera access...'
                  : cameraStatus === 'unavailable'
                  ? 'No camera device found'
                  : 'Camera access denied'}
              </p>
            </div>

            {/* Microphone Check */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    micStatus === 'ready' 
                      ? 'bg-green-100' 
                      : micStatus === 'checking'
                      ? 'bg-blue-100'
                      : 'bg-red-100'
                  }`}>
                    <Mic className={`w-6 h-6 ${
                      micStatus === 'ready'
                        ? 'text-green-600'
                        : micStatus === 'checking'
                        ? 'text-blue-600'
                        : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Microphone Access</h3>
                    <p className="text-sm text-slate-600">Audio monitoring</p>
                  </div>
                </div>
                {micStatus === 'ready' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : micStatus === 'checking' ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <p className="text-sm text-slate-600">
                {micStatus === 'ready'
                  ? 'Microphone is working properly'
                  : micStatus === 'checking'
                  ? 'Checking microphone access...'
                  : micStatus === 'unavailable'
                  ? 'No microphone device found'
                  : 'Microphone access denied'}
              </p>
            </div>

            {/* Screen Recording / Fullscreen + Network */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    fullscreenSupported ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <Monitor className={`w-6 h-6 ${fullscreenSupported ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Screen Monitoring</h3>
                    <p className="text-sm text-slate-600">Fullscreen &amp; tab-switch detection</p>
                  </div>
                </div>
                {fullscreenSupported ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <p className="text-sm text-slate-600">
                {fullscreenSupported
                  ? "Fullscreen mode will be requested when you start — exiting it during the exam is recorded as a violation."
                  : 'Your browser does not support the Fullscreen API required for exam monitoring. Please use an up-to-date Chrome, Edge, or Firefox.'}
              </p>
            </div>

            {/* Network Status */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isOnline ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <Wifi className={`w-6 h-6 ${isOnline ? 'text-green-600' : 'text-red-600'}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Network Connection</h3>
                    <p className="text-sm text-slate-600">Required to submit answers &amp; log activity</p>
                  </div>
                </div>
                {isOnline ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <p className="text-sm text-slate-600">
                {isOnline ? 'You are connected to the internet.' : 'No internet connection detected. Reconnect before starting the exam.'}
              </p>
            </div>

            {/* Face Detection Pre-Check */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    faceCheckStatus === 'face' ? 'bg-green-100' : faceCheckStatus === 'loading' ? 'bg-blue-100' : 'bg-amber-100'
                  }`}>
                    <Camera className={`w-6 h-6 ${
                      faceCheckStatus === 'face' ? 'text-green-600' : faceCheckStatus === 'loading' ? 'text-blue-600' : 'text-amber-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Face Detection</h3>
                    <p className="text-sm text-slate-600">AI proctoring readiness</p>
                  </div>
                </div>
                {faceCheckStatus === 'face' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : faceCheckStatus === 'loading' ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <p className="text-sm text-slate-600">
                {faceCheckStatus === 'face'
                  ? 'Your face is clearly visible.'
                  : faceCheckStatus === 'loading'
                  ? cameraStatus === 'ready'
                    ? 'Loading AI face-detection models...'
                    : 'Waiting for camera...'
                  : faceCheckStatus === 'no_face'
                  ? 'No face detected — center yourself in the camera frame.'
                  : faceCheckStatus === 'multiple_face'
                  ? 'More than one face detected — make sure you are alone in frame.'
                  : 'AI face detection could not be loaded, but the exam can still proceed — other proctoring checks remain active.'}
              </p>
            </div>

            {/* Important Notes */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Important Reminders
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• Ensure your face is clearly visible</li>
                <li>• Stay in a well-lit environment</li>
                <li>• Remove any background noise</li>
                <li>• Do not leave the exam screen</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            className="px-6 py-3 text-slate-600 hover:text-slate-900 font-medium"
          >
            Back to Instructions
          </button>
          <button
            onClick={handleStart}
            disabled={!allChecksPass || isStarting}
            className={`px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              allChecksPass && !isStarting
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isStarting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isStarting
              ? 'Starting Exam...'
              : allChecksPass
              ? 'Start Exam Now'
              : !isOnline
              ? 'Waiting for Network...'
              : !fullscreenSupported
              ? 'Unsupported Browser'
              : cameraStatus !== 'ready' || micStatus !== 'ready'
              ? 'Completing Checks...'
              : 'Preparing Session...'}
          </button>
        </div>
      </div>
    </div>
  );
}
