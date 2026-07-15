/**
 * Returns the real { start, end } Date objects for an exam.
 *
 * Thin, backward-compatible wrapper around utils/dateTime.js's
 * getExamWindow — see that file for why this can no longer be computed
 * with `new Date(`${datePart}T${exam.time}`)` (timezone-ambiguous; broke
 * on Render while appearing to work on localhost).
 */
const { getExamWindow } = require("./dateTime");

module.exports = function (exam) {
  const window = getExamWindow(exam);
  if (!window) {
    throw new Error("Exam has no valid schedule (missing/invalid date, time, or duration)");
  }
  return window;
};
