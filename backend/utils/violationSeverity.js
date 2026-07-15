/* =========================================================
   VIOLATION SEVERITY
   Maps every proctor event type to a severity tier + risk-score weight.
   Device/session lifecycle and "back to normal" events are "info" (0
   points) — they're logged for the timeline but don't count as violations.
========================================================= */
const RISK_POINTS = {
  info: 0,
  low: 2,
  medium: 5,
  high: 10,
  critical: 20,
};

const EVENT_SEVERITY = {
  // Foundation — device/session lifecycle
  camera_requested: "info",
  camera_granted: "info",
  camera_denied: "high",
  microphone_requested: "info",
  microphone_granted: "info",
  microphone_denied: "high",
  device_unavailable: "medium",
  browser_unsupported: "medium",
  session_started: "info",
  session_ended: "info",

  // Face detection
  NO_FACE: "high",
  MULTIPLE_FACE: "critical",

  // Head pose
  HEAD_LEFT: "low",
  HEAD_RIGHT: "low",
  HEAD_UP: "low",
  HEAD_DOWN: "low",
  LOOKING_AWAY: "medium",

  // Eye tracking
  EYES_CLOSED: "low",
  EYES_MISSING: "medium",

  // Face distance (heuristic, bounding-box-area based) — low severity: on
  // its own this is often just a posture/lighting quirk, not evidence of
  // cheating, so it shouldn't weigh as heavily as e.g. LOOKING_AWAY.
  FACE_TOO_CLOSE: "low",
  FACE_TOO_FAR: "low",

  // Browser security — fullscreen / window state
  FULLSCREEN_EXIT: "high",
  FULLSCREEN_REENTERED: "info",
  TAB_SWITCH: "high",
  WINDOW_BLUR: "medium",
  WINDOW_FOCUS_RETURN: "info",
  BROWSER_MINIMIZE: "high",
  WINDOW_RESIZED: "low",
  MULTI_MONITOR_DETECTED: "medium",

  // Browser security — input restriction attempts
  RIGHT_CLICK_ATTEMPT: "low",
  TEXT_SELECTION_ATTEMPT: "low",
  DRAG_ATTEMPT: "low",
  COPY_ATTEMPT: "medium",
  PASTE_ATTEMPT: "medium",
  CUT_ATTEMPT: "medium",
  SELECT_ALL_ATTEMPT: "low",

  // Browser security — devtools / inspection attempts
  VIEW_SOURCE_ATTEMPT: "high",
  DEVTOOLS_SHORTCUT_ATTEMPT: "high",
  DEVTOOLS_OPENED: "critical",
  F12_ATTEMPT: "high",
  ESC_KEY_PRESSED: "low",
  PRINT_SCREEN_DETECTED: "medium",

  // Browser security — environment
  ZOOM_CHANGED: "low",
  NETWORK_DISCONNECTED: "medium",
  NETWORK_RECONNECTED: "info",
  INCOGNITO_DETECTED: "medium",

  // AI proctoring — object detection
  PHONE_DETECTED: "critical",
  BOOK_DETECTED: "high",
  LAPTOP_DETECTED: "high",
  SECOND_PERSON_DETECTED: "critical",

  // AI proctoring — audio monitoring
  NOISE_DETECTED: "medium",

  // AI proctoring — device disabled mid-exam
  CAMERA_DISABLED: "critical",
  MICROPHONE_DISABLED: "high",

  // AI proctoring — camera stream health (frozen/black frame, permission
  // revoked after the session already started)
  CAMERA_FROZEN: "critical",
  CAMERA_BLACK_SCREEN: "high",
  CAMERA_PERMISSION_REVOKED: "critical",
  MICROPHONE_PERMISSION_REVOKED: "high",
};

const getSeverity = (eventType) => EVENT_SEVERITY[eventType] || "low";
const getRiskPoints = (eventType) => RISK_POINTS[getSeverity(eventType)] ?? RISK_POINTS.low;
const isViolation = (eventType) => getSeverity(eventType) !== "info";

module.exports = { getSeverity, getRiskPoints, isViolation, RISK_POINTS };
