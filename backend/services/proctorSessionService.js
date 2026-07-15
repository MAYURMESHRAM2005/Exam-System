const ProctorSession = require("../models/ProctorSession");
const Result = require("../models/Result");
const Exam = require("../models/Exam");
const { finalizeResultAsSubmitted } = require("../utils/finalizeResult");

/* =========================================================
   TERMINATE SESSION
   Ends a proctoring session and, if it has a linked in-progress Result,
   force-submits that attempt using whatever answers were already
   auto-saved. Shared by:
     - the REST "terminate" endpoint (manual, instructor-initiated)
     - the `examiner:terminate` socket event (same, manual)
     - proctorController.logEvent (automatic, when a configured
       auto-terminate rule fires — see utils/autoTerminationRules.js)

   Caller is responsible for authorizing the request (must be the
   instructor who owns the exam, for the manual paths) BEFORE calling this.

   @param {object} [options]
   @param {string} [options.reason] - human-readable reason, stored on
     the Result and surfaced in notifications
   @param {boolean} [options.automatic] - true when a security rule
     triggered this rather than a human instructor action
========================================================= */
async function terminateSession(sessionId, { reason, automatic = false } = {}) {
  const session = await ProctorSession.findById(sessionId);
  if (!session) {
    const error = new Error("Proctoring session not found");
    error.statusCode = 404;
    throw error;
  }

  if (session.status !== "ended") {
    session.status = "ended";
    session.endedAt = new Date();
    await session.save();
  }

  let finalizedResult = null;

  // Prefer the direct link, but fall back to looking up this student's
  // own in-progress attempt for this exam if the link is missing —
  // belt-and-suspenders alongside the fix in resultController.startExam,
  // so a session created before that fix (or a link that failed for any
  // other reason) still actually gets force-submitted here rather than
  // silently ending the camera-monitoring session while the exam itself
  // keeps running untouched.
  let result = session.result ? await Result.findById(session.result) : null;
  if (!result) {
    result = await Result.findOne({
      exam: session.exam,
      student: session.student,
      status: "in-progress",
    });
  }

  if (result && result.status === "in-progress") {
    const exam = await Exam.findById(result.exam);
    if (exam) {
      const { result: updated } = await finalizeResultAsSubmitted(
        result,
        exam,
        result.answers,
        {
          terminatedByExaminer: true,
          autoTerminated: automatic,
          terminationReason: reason || null,
        }
      );
      finalizedResult = updated;
    }
  }

  return { session, result: finalizedResult };
}

module.exports = { terminateSession };
