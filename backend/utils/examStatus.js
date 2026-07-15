/**
 * Computes the real-time status of an exam.
 *
 * This is now a thin, backward-compatible wrapper around the centralized,
 * timezone-safe logic in utils/dateTime.js — see that file for the full
 * explanation of the UTC-vs-local bug this replaces. Every previous inline
 * copy of this logic (there were three, in examController.js, plus this
 * file, plus examWindow.js) has been consolidated there.
 *
 * Returns one of: "cancelled" | "scheduled" | "live" | "completed" | "expired"
 * (call sites written against the old 3-value enum keep working: "expired"
 * only appears for a malformed/legacy record that has no parseable
 * schedule at all — something that always silently returned "scheduled"
 * before, which was worse).
 */
const { computeExamStatus } = require("./dateTime");

module.exports = function (exam, now) {
  return computeExamStatus(exam, now);
};
