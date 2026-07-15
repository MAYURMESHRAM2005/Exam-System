const Result = require("./../models/Result");
const User = require("./../models/User");
const { gradeExam } = require("./gradeExam");
const { notify } = require("../services/notificationService");

/* =========================================================
   FINALIZE RESULT AS SUBMITTED (atomic)
   Shared by:
     - resultController.submitExam        (student-initiated)
     - resultController's auto-finalize    (server-side deadline enforcement)
     - proctorSessionService.terminateSession (examiner-initiated force-submit)
   `answersToGrade` lets each caller decide what to grade (merged
   client-submitted answers vs. whatever was already auto-saved).

   `extra.terminatedByExaminer` is a real, persisted Result field.
   `extra.autoSubmittedOnExpiry` is NOT persisted (Result has no such
   field) — it only exists to tell this function, at call time, which of
   the three notification variants below to send; it's stripped out
   before the actual $set.

   Returns { result, changed } — changed is false if another request had
   already finalized it first (a benign race, not an error).
========================================================= */
async function finalizeResultAsSubmitted(result, exam, answersToGrade, extra = {}) {
  if (result.status !== "in-progress") {
    return { result, changed: false };
  }

  const { autoSubmittedOnExpiry, ...persistedExtra } = extra;

  const graded = gradeExam(exam, answersToGrade);
  const submittedAt = new Date();
  const timeTakenSeconds = Math.max(
    0,
    Math.floor((submittedAt.getTime() - result.startedAt.getTime()) / 1000)
  );

  const updated = await Result.findOneAndUpdate(
    { _id: result._id, status: "in-progress" },
    {
      $set: {
        answers: graded.gradedAnswers,
        status: "submitted",
        submittedAt,
        timeTakenSeconds,
        totalMarks: exam.totalMarks,
        obtainedMarks: graded.obtainedMarks,
        percentage: graded.percentage,
        correctCount: graded.correctCount,
        wrongCount: graded.wrongCount,
        unattemptedCount: graded.unattemptedCount,
        passed: graded.passed,
        ...persistedExtra,
      },
    },
    { new: true }
  );

  const finalResult = updated || (await Result.findById(result._id));

  // Notifications — only on the request that actually won the finalize
  // race, never the loser (`updated` is null when another request beat
  // this one to it, e.g. the student submitted right as the deadline hit).
  if (updated) {
    const terminatedByExaminer = Boolean(persistedExtra.terminatedByExaminer);
    const autoTerminated = Boolean(persistedExtra.autoTerminated);
    const reason = persistedExtra.terminationReason;

    const studentNotification = terminatedByExaminer
      ? {
          type: "exam_terminated",
          title: autoTerminated ? "Exam auto-terminated" : "Exam terminated",
          message: autoTerminated
            ? `Your attempt for "${exam.title}" was automatically terminated (${reason || "a security rule was triggered"}) and auto-submitted.`
            : `Your attempt for "${exam.title}" was ended by your examiner and auto-submitted.`,
        }
      : autoSubmittedOnExpiry
      ? {
          type: "session_expired",
          title: "Exam time expired",
          message: `Time ran out for "${exam.title}" — your answers were automatically submitted.`,
        }
      : {
          type: "exam_submitted",
          title: "Exam submitted",
          message: `Your attempt for "${exam.title}" was submitted successfully.`,
        };

    notify({
      recipient: finalResult.student,
      ...studentNotification,
      data: { examId: exam._id, resultId: finalResult._id },
    });

    // This codebase grades and finalizes a result the instant it's
    // submitted — there's no separate instructor "publish" step — so
    // "result published" fires alongside "exam submitted" rather than at
    // some later point, honestly reflecting how the system actually works.
    notify({
      recipient: finalResult.student,
      type: "result_published",
      title: "Result published",
      message: `Your result for "${exam.title}" is ready: ${finalResult.percentage}% (${finalResult.passed ? "Passed" : "Not passed"}).`,
      data: { examId: exam._id, resultId: finalResult._id },
    });

    // Best-effort — a missing student name just falls back to "A student".
    User.findById(finalResult.student)
      .select("name")
      .then((student) => {
        const studentName = student?.name || "A student";
        const instructorNotification = terminatedByExaminer
          ? {
              type: "student_terminated",
              title: autoTerminated ? "Student auto-terminated" : "Student attempt terminated",
              message: autoTerminated
                ? `${studentName}'s attempt for "${exam.title}" was automatically terminated (${reason || "a security rule was triggered"}).`
                : `${studentName}'s attempt for "${exam.title}" was terminated and auto-submitted.`,
            }
          : {
              type: "student_completed",
              title: "Student completed exam",
              message: `${studentName} completed "${exam.title}" — scored ${finalResult.percentage}%.`,
            };

        notify({
          recipient: exam.createdBy,
          ...instructorNotification,
          data: { examId: exam._id, resultId: finalResult._id, studentId: finalResult.student },
        });

        notify({
          recipient: exam.createdBy,
          type: "result_generated",
          title: "Result generated",
          message: `A result was generated for ${studentName} on "${exam.title}".`,
          data: { examId: exam._id, resultId: finalResult._id, studentId: finalResult.student },
        });
      })
      .catch(() => {});
  }

  return { result: finalResult, changed: Boolean(updated) };
}

module.exports = { finalizeResultAsSubmitted };
