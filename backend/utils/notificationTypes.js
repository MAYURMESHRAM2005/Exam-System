/* =========================================================
   NOTIFICATION TYPES — single source of truth.
   Shared by notificationController.js (type filter validation) and the
   frontend (filter dropdown labels/icons), so the two lists can't drift.
========================================================= */
const STUDENT_NOTIFICATION_TYPES = [
  "exam_scheduled",
  "exam_reminder",
  "exam_started",
  "exam_ending_soon",
  "exam_submitted",
  "result_published",
  "warning_received",
  "violation_detected",
  "exam_terminated",
  "session_expired",
  "password_changed",
];

const INSTRUCTOR_NOTIFICATION_TYPES = [
  "student_started",
  "student_completed",
  "student_terminated",
  "ai_cheating_detected",
  "result_generated",
  "new_exam_created",
  "student_joined",
  "student_left",
];

const ALL_NOTIFICATION_TYPES = [
  ...STUDENT_NOTIFICATION_TYPES,
  ...INSTRUCTOR_NOTIFICATION_TYPES,
];

module.exports = {
  STUDENT_NOTIFICATION_TYPES,
  INSTRUCTOR_NOTIFICATION_TYPES,
  ALL_NOTIFICATION_TYPES,
};
