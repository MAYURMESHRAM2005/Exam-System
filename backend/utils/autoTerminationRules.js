/* =========================================================
   AUTO-TERMINATION RULES
   Pure decision function — given an exam's configured rules, a session's
   per-event-type counts, and the event that was just logged, returns
   either a human-readable termination reason (meaning "terminate now")
   or null (meaning "no rule matched"). Has no side effects itself;
   proctorController.logEvent is what actually calls terminateSession
   when this returns non-null.

   `eventCounts` must already include the CURRENT event (i.e. call this
   after incrementing the count for `eventType`, not before) so a
   maxTabSwitches: 1 rule fires on the first switch rather than the
   second.
========================================================= */

// Maps a proctor eventType to the exam.autoTerminate config key that
// governs it, and whether that key is a boolean switch or a numeric
// threshold checked against eventCounts.
const RULES = [
  { eventType: "TAB_SWITCH", configKey: "maxTabSwitches", kind: "count" },
  { eventType: "FULLSCREEN_EXIT", configKey: "onFullscreenExit", kind: "boolean" },
  { eventType: "DEVTOOLS_OPENED", configKey: "onDevToolsOpen", kind: "boolean" },
  { eventType: "MULTIPLE_FACE", configKey: "onMultipleFaces", kind: "boolean" },
  { eventType: "PHONE_DETECTED", configKey: "maxPhoneDetections", kind: "count" },
  { eventType: "CAMERA_DISABLED", configKey: "onCameraDisabled", kind: "boolean" },
  { eventType: "MICROPHONE_DISABLED", configKey: "onMicrophoneDisabled", kind: "boolean" },
  // Frozen/black camera feed and a mid-session permission revocation are
  // just as serious as the camera being disabled outright — reuse the same
  // config switch rather than adding new per-exam toggles for what is,
  // from an instructor's perspective, the same underlying policy decision
  // ("should losing camera visibility end the exam?").
  { eventType: "CAMERA_FROZEN", configKey: "onCameraDisabled", kind: "boolean" },
  { eventType: "CAMERA_PERMISSION_REVOKED", configKey: "onCameraDisabled", kind: "boolean" },
  { eventType: "MICROPHONE_PERMISSION_REVOKED", configKey: "onMicrophoneDisabled", kind: "boolean" },
];

const REASON_TEXT = {
  TAB_SWITCH: (limit) => `switched away from the exam tab ${limit} time${limit > 1 ? "s" : ""}`,
  FULLSCREEN_EXIT: () => "exited fullscreen mode",
  DEVTOOLS_OPENED: () => "opened developer tools",
  MULTIPLE_FACE: () => "had more than one face in frame",
  PHONE_DETECTED: (limit) => `had a phone detected ${limit} time${limit > 1 ? "s" : ""}`,
  CAMERA_DISABLED: () => "disabled the camera",
  MICROPHONE_DISABLED: () => "disabled the microphone",
  CAMERA_FROZEN: () => "had a frozen or blacked-out camera feed",
  CAMERA_PERMISSION_REVOKED: () => "revoked camera permission mid-exam",
  MICROPHONE_PERMISSION_REVOKED: () => "revoked microphone permission mid-exam",
};

/**
 * @param {object} exam - Exam document (reads exam.autoTerminate)
 * @param {Map|object} eventCounts - session.eventCounts (Mongoose Map or plain object), already incremented for this event
 * @param {string} eventType
 * @returns {string|null} termination reason, or null if no rule matched
 */
function getAutoTerminationReason(exam, eventCounts, eventType) {
  const config = exam?.autoTerminate;
  if (!config?.enabled) return null;

  const rule = RULES.find((r) => r.eventType === eventType);
  if (!rule) return null;

  if (rule.kind === "boolean") {
    if (!config[rule.configKey]) return null;
    return `Auto-terminated: this student ${REASON_TEXT[eventType]()}.`;
  }

  // kind === "count"
  const limit = config[rule.configKey];
  if (!limit) return null; // null/0 means the rule isn't configured for this exam
  const count = eventCounts instanceof Map ? eventCounts.get(eventType) : eventCounts?.[eventType];
  if ((count || 0) < limit) return null;
  return `Auto-terminated: this student ${REASON_TEXT[eventType](limit)}.`;
}

module.exports = { getAutoTerminationReason };
