/* =========================================================
   PROCTOR EVENT TYPES — single source of truth.
   Shared by models/ProctorLog.js (schema enum) and
   middleware/validators.js (logProctorEventValidation), so the two lists
   can't silently drift out of sync as new phases add event types.
========================================================= */
const PROCTOR_EVENT_TYPES = [
  // Foundation — device/session lifecycle
  "camera_requested",
  "camera_granted",
  "camera_denied",
  "microphone_requested",
  "microphone_granted",
  "microphone_denied",
  "device_unavailable",
  "browser_unsupported",
  "session_started",
  "session_ended",

  // Face detection
  "NO_FACE",
  "MULTIPLE_FACE",

  // Head pose estimation
  "HEAD_LEFT",
  "HEAD_RIGHT",
  "HEAD_UP",
  "HEAD_DOWN",
  "LOOKING_AWAY",

  // Eye tracking
  "EYES_CLOSED",
  "EYES_MISSING",

  // Browser security — fullscreen / window state
  "FULLSCREEN_EXIT",
  "FULLSCREEN_REENTERED",
  "TAB_SWITCH",
  "WINDOW_BLUR",
  "WINDOW_FOCUS_RETURN",
  "BROWSER_MINIMIZE",
  "WINDOW_RESIZED",
  "MULTI_MONITOR_DETECTED",

  // Browser security — input restriction attempts
  "RIGHT_CLICK_ATTEMPT",
  "TEXT_SELECTION_ATTEMPT",
  "DRAG_ATTEMPT",
  "COPY_ATTEMPT",
  "PASTE_ATTEMPT",
  "CUT_ATTEMPT",
  "SELECT_ALL_ATTEMPT",

  // Browser security — devtools / inspection attempts
  "VIEW_SOURCE_ATTEMPT",
  "DEVTOOLS_SHORTCUT_ATTEMPT",
  "DEVTOOLS_OPENED",
  "F12_ATTEMPT",
  "ESC_KEY_PRESSED",
  "PRINT_SCREEN_DETECTED",

  // Browser security — environment
  "ZOOM_CHANGED",
  "NETWORK_DISCONNECTED",
  "NETWORK_RECONNECTED",
  "INCOGNITO_DETECTED",

  // AI proctoring — object detection (coco-ssd)
  "PHONE_DETECTED",
  "BOOK_DETECTED",
  "LAPTOP_DETECTED",
  "SECOND_PERSON_DETECTED",

  // AI proctoring — face distance (Phase 6 bounding-box-area heuristic)
  "FACE_TOO_CLOSE",
  "FACE_TOO_FAR",

  // AI proctoring — audio monitoring
  "NOISE_DETECTED",

  // AI proctoring — device disabled mid-exam (distinct from denial at setup)
  "CAMERA_DISABLED",
  "MICROPHONE_DISABLED",

  // AI proctoring — camera stream health (Phase 7: the track is still
  // technically "live" per the browser, but the actual video content is
  // no longer trustworthy — e.g. a static image/paper held over the lens,
  // or a frame that has simply stopped updating)
  "CAMERA_FROZEN",
  "CAMERA_BLACK_SCREEN",
  "CAMERA_PERMISSION_REVOKED",
  "MICROPHONE_PERMISSION_REVOKED",
];

module.exports = { PROCTOR_EVENT_TYPES };
