const crypto = require("crypto");
const Exam = require("../models/Exam");
const Result = require("../models/Result");
const ProctorSession = require("../models/ProctorSession");
const asyncHandler = require("../utils/asyncHandler");
const computeExamStatus = require("../utils/examStatus");
const getExamWindow = require("../utils/examWindow");
const { finalizeResultAsSubmitted } = require("../utils/finalizeResult");
const { seededShuffle } = require("../utils/seededShuffle");
const { computeGrade } = require("../utils/grade");
const { computeRankAndPercentile } = require("../utils/rankPercentile");
const { logActivity } = require("../utils/activityLog");
const { sendEmail } = require("../utils/email");
const { notify } = require("../services/notificationService");
const { getExamResultsData } = require("../utils/reportData");

const isPrivilegedRole = (role) => role === "instructor";

// Small grace window so a submission already in flight when the timer hit
// zero isn't rejected purely due to network latency.
const SUBMIT_GRACE_SECONDS = 120;

/* =========================================================
   GRADING HELPER
   Pure function: given an exam + the answers collected so far,
   returns the fully graded breakdown. Used by both a normal
   student-initiated submit AND the lazy server-side auto-finalize
   path (when the window has expired before the student submitted).
========================================================= */
/* =========================================================
   AUTO-FINALIZE IF EXPIRED
   Lazily enforces the deadline server-side: any endpoint that touches
   an "in-progress" result first checks whether the exam window has
   passed. If so, it grades and finalizes the attempt right there —
   using an atomic update so a real concurrent submit can never race
   against it — instead of trusting the client to call submit in time.
   Returns the (possibly updated) result, plus whether it just auto-finalized.
========================================================= */
async function autoFinalizeIfExpired(result, exam) {
  if (result.status !== "in-progress") {
    return { result, autoSubmitted: false };
  }

  const { end } = getExamWindow(exam);
  if (Date.now() <= end.getTime()) {
    return { result, autoSubmitted: false };
  }

  const { result: finalResult } = await finalizeResultAsSubmitted(
    result,
    exam,
    result.answers,
    { autoSubmittedOnExpiry: true }
  );
  return { result: finalResult, autoSubmitted: true };
}

/* =========================
   START EXAM
   POST /api/results/start/:examId
   Creates (or resumes) the student's attempt and claims a fresh
   session token, which kicks out any other tab/window/device that
   had this same exam open.
========================= */
exports.startExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.examId);

  if (!exam) {
    const error = new Error("Exam not found");
    error.statusCode = 404;
    throw error;
  }

  const status = computeExamStatus(exam);
  if (status === "scheduled") {
    const error = new Error("This exam has not started yet.");
    error.statusCode = 403;
    throw error;
  }

  let result = await Result.findOne({ exam: exam._id, student: req.user._id });

  if (result && result.status === "submitted") {
    const error = new Error("You have already submitted this exam.");
    error.statusCode = 403;
    throw error;
  }

  if (!result) {
    if (status !== "live") {
      const error = new Error("This exam window has already ended.");
      error.statusCode = 403;
      throw error;
    }
    result = await Result.create({
      exam: exam._id,
      student: req.user._id,
      totalMarks: exam.totalMarks,
      startedAt: new Date(),
    });
    logActivity(req.user._id, "exam_started", `Started exam: ${exam.title}`, { examId: exam._id });
    notify({
      recipient: exam.createdBy,
      type: "student_started",
      title: "Student started exam",
      message: `${req.user.name} started "${exam.title}".`,
      data: { examId: exam._id, resultId: result._id, studentId: req.user._id },
    });
  }

  // Lazily enforce the deadline in case this is a resume attempt on an
  // attempt whose time has already run out.
  const { autoSubmitted, result: maybeFinalized } = await autoFinalizeIfExpired(
    result,
    exam
  );
  if (autoSubmitted) {
    const error = new Error(
      "Your time for this exam ran out and it was automatically submitted."
    );
    error.statusCode = 403;
    throw error;
  }
  result = maybeFinalized;

  // 🔒 Claim a new session token — this is what makes opening the exam in
  // a second tab/window kick the first one out the next time it tries to
  // save or heartbeat.
  const sessionToken = crypto.randomUUID();
  result.activeSessionToken = sessionToken;
  result.lastHeartbeatAt = new Date();
  await result.save();

  // Link this attempt to its proctoring session so the examiner's live
  // monitoring view can show real answer progress alongside camera/
  // violation status — and, critically, so terminateSession() can find
  // and force-submit THIS Result when a violation auto-terminates the
  // session. This used to be a fire-and-forget update keyed only on the
  // client-supplied proctorSessionId, which silently did nothing (no
  // error, no retry) if that id was ever missing/stale — meaning
  // auto-terminate would end the proctoring session but leave the exam
  // itself running, with nothing telling anyone it hadn't worked. Now:
  // 1) it's awaited, so linking is guaranteed to finish before this
  //    request completes, and 2) if the direct id match fails for any
  //    reason, we fall back to finding this student's own active
  //    proctoring session for this exam rather than giving up.
  const { proctorSessionId } = req.body;
  let linkedSession = null;

  if (proctorSessionId) {
    linkedSession = await ProctorSession.findOneAndUpdate(
      { _id: proctorSessionId, student: req.user._id, exam: exam._id },
      { $set: { result: result._id } },
      { new: true }
    );
  }

  if (!linkedSession) {
    linkedSession = await ProctorSession.findOneAndUpdate(
      { exam: exam._id, student: req.user._id, status: { $ne: "ended" }, result: null },
      { $set: { result: result._id } },
      { sort: { createdAt: -1 }, new: true }
    );
  }

  if (!linkedSession) {
    // Not fatal — the student can still take the exam — but this exam
    // attempt now has no proctoring session to auto-terminate against,
    // which is worth knowing about rather than silently losing.
    console.error(
      `[startExam] Could not link a ProctorSession to Result ${result._id} ` +
        `(exam ${exam._id}, student ${req.user._id}, proctorSessionId=${proctorSessionId || "none"}). ` +
        `Auto-termination rules won't be able to force-submit this attempt.`
    );
  } else {
    console.log(
      `[startExam] Linked ProctorSession ${linkedSession._id} to Result ${result._id} ` +
        `(exam ${exam._id}, student ${req.user._id}).`
    );
  }

  const { end } = getExamWindow(exam);
  const secondsRemaining = Math.max(
    0,
    Math.floor((end.getTime() - Date.now()) / 1000)
  );

  let questions = exam.questions.map((q) => ({
    _id: q._id,
    questionText: q.questionText,
    type: q.type,
    options: q.options,
    marks: q.marks,
  }));

  // Deterministic per-student shuffle: same seed -> same order every time,
  // so a page reload or resume shows the exact same layout the student saw
  // before. Grading is unaffected either way — answers are matched by
  // question _id and option text, never by position.
  if (exam.shuffleQuestions) {
    questions = seededShuffle(
      questions,
      `${exam._id}:${req.user._id}:questions`
    );
  }
  if (exam.shuffleOptions) {
    questions = questions.map((q) =>
      q.options && q.options.length > 0
        ? {
            ...q,
            options: seededShuffle(
              q.options,
              `${exam._id}:${req.user._id}:${q._id}:options`
            ),
          }
        : q
    );
  }

  res.json({
    resultId: result._id,
    sessionToken,
    examTitle: exam.title,
    courseCode: exam.courseCode,
    durationSeconds: exam.duration * 60,
    secondsRemaining,
    questions,
    existingAnswers: result.answers.map((a) => ({
      question: a.question,
      selectedAnswer: a.selectedAnswer,
    })),
  });
});

/* =========================
   AUTO-SAVE ANSWER (also acts as the session heartbeat)
   PUT /api/results/:id/save
========================= */
exports.autoSaveAnswer = asyncHandler(async (req, res) => {
  const { questionId, selectedAnswer, sessionToken } = req.body;

  const result = await Result.findById(req.params.id);

  if (!result) {
    const error = new Error("Exam attempt not found");
    error.statusCode = 404;
    throw error;
  }

  if (result.student.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to modify this attempt");
    error.statusCode = 403;
    throw error;
  }

  if (result.status === "submitted") {
    const error = new Error("This exam has already been submitted.");
    error.statusCode = 400;
    throw error;
  }

  // 🔒 Multi-tab guard: only the tab holding the current session token
  // may save. A stale tab gets a clear 409 instead of silently overwriting.
  if (!sessionToken || sessionToken !== result.activeSessionToken) {
    const error = new Error(
      "This exam is currently open in another tab or window."
    );
    error.statusCode = 409;
    throw error;
  }

  const exam = await Exam.findById(result.exam);
  if (!exam) {
    const error = new Error("Exam not found");
    error.statusCode = 404;
    throw error;
  }

  // 🔒 Server-enforced deadline: if time is already up, finalize instead
  // of accepting more answers.
  const { autoSubmitted, result: maybeFinalized } = await autoFinalizeIfExpired(
    result,
    exam
  );
  if (autoSubmitted) {
    return res.json({
      autoSubmitted: true,
      resultId: maybeFinalized._id,
      message: "Time is up — this exam has been automatically submitted.",
    });
  }

  const existing = result.answers.find(
    (a) => a.question.toString() === questionId
  );
  if (existing) {
    existing.selectedAnswer = selectedAnswer;
  } else {
    result.answers.push({ question: questionId, selectedAnswer });
  }

  result.lastHeartbeatAt = new Date();
  await result.save();

  res.json({ message: "Saved", autoSubmitted: false });
});

/* =========================
   SUBMIT EXAM
   POST /api/results/:id/submit
   Grades MCQ answers automatically and atomically finalizes the result —
   the atomic claim below is what makes this safe against duplicate
   submissions, even if "Submit" is clicked multiple times in a row.
========================= */
exports.submitExam = asyncHandler(async (req, res) => {
  const { answers, sessionToken } = req.body; // [{ questionId, selectedAnswer }]

  const result = await Result.findById(req.params.id);

  if (!result) {
    const error = new Error("Exam attempt not found");
    error.statusCode = 404;
    throw error;
  }

  if (result.student.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to submit this attempt");
    error.statusCode = 403;
    throw error;
  }

  // 🔒 Prevent duplicate submissions (fast path — also enforced atomically below)
  if (result.status === "submitted") {
    return res.json({
      resultId: result._id,
      alreadySubmitted: true,
      totalMarks: result.totalMarks,
      obtainedMarks: result.obtainedMarks,
      percentage: result.percentage,
      passed: result.passed,
      correctCount: result.correctCount,
      wrongCount: result.wrongCount,
      unattemptedCount: result.unattemptedCount,
      submittedAt: result.submittedAt,
      timeTakenSeconds: result.timeTakenSeconds,
    });
  }

  if (!sessionToken || sessionToken !== result.activeSessionToken) {
    const error = new Error(
      "This exam is currently open in another tab or window."
    );
    error.statusCode = 409;
    throw error;
  }

  const exam = await Exam.findById(result.exam);
  if (!exam) {
    const error = new Error("Exam not found");
    error.statusCode = 404;
    throw error;
  }

  // 🔒 Validate timing server-side — never trust the client's timer alone
  const { end } = getExamWindow(exam);
  const deadline = new Date(end.getTime() + SUBMIT_GRACE_SECONDS * 1000);
  if (Date.now() > deadline.getTime()) {
    const error = new Error("The submission window for this exam has expired.");
    error.statusCode = 400;
    throw error;
  }

  // Merge any final answers sent at submit-time with whatever was auto-saved
  const mergedAnswers = [...result.answers];
  if (Array.isArray(answers)) {
    for (const a of answers) {
      if (!a.questionId) continue;
      const existing = mergedAnswers.find(
        (existingAnswer) => existingAnswer.question.toString() === a.questionId
      );
      if (existing) {
        existing.selectedAnswer = a.selectedAnswer;
      } else {
        mergedAnswers.push({ question: a.questionId, selectedAnswer: a.selectedAnswer });
      }
    }
  }

  const { result: finalResult, changed } = await finalizeResultAsSubmitted(
    result,
    exam,
    mergedAnswers
  );

  // Best-effort stat increment — never blocks the response on failure.
  if (changed) {
    exam.submitted = (exam.submitted || 0) + 1;
    exam.save().catch(() => {});

    logActivity(
      req.user._id,
      "exam_submitted",
      `Submitted exam: ${exam.title} — scored ${finalResult.percentage}%`,
      { examId: exam._id, resultId: finalResult._id }
    );

    sendEmail({
      to: req.user.email,
      subject: `Your result for ${exam.title} is ready`,
      text: `Hi ${req.user.name}, your result for "${exam.title}" is ready: ${finalResult.obtainedMarks}/${finalResult.totalMarks} (${finalResult.percentage}%) — ${finalResult.passed ? "Passed" : "Not passed"}.`,
      html: `<p>Hi ${req.user.name},</p><p>Your result for <strong>${exam.title}</strong> is ready: ${finalResult.obtainedMarks}/${finalResult.totalMarks} (${finalResult.percentage}%) — ${finalResult.passed ? "Passed" : "Not passed"}.</p>`,
    }).catch(() => {});
  }

  res.json({
    resultId: finalResult._id,
    alreadySubmitted: !changed,
    totalMarks: finalResult.totalMarks,
    obtainedMarks: finalResult.obtainedMarks,
    percentage: finalResult.percentage,
    passed: finalResult.passed,
    correctCount: finalResult.correctCount,
    wrongCount: finalResult.wrongCount,
    unattemptedCount: finalResult.unattemptedCount,
    submittedAt: finalResult.submittedAt,
    timeTakenSeconds: finalResult.timeTakenSeconds,
  });
});

/* =========================
   GET MY RESULTS (Student)
   GET /api/results/mine
   Every submitted result for the logged-in student, newest first —
   powers the "Recent Results" section and the dashboard stat cards
   (Completed Exams count, Average Score).
========================= */
exports.getMyResults = asyncHandler(async (req, res) => {
  const results = await Result.find({
    student: req.user._id,
    status: "submitted",
  })
    .populate("exam", "title courseCode")
    .sort({ submittedAt: -1 });

  const formatted = results
    .filter((r) => r.exam) // defensively skip orphaned results (exam deleted)
    .map((r) => ({
      resultId: r._id,
      examTitle: r.exam.title,
      courseCode: r.exam.courseCode,
      totalMarks: r.totalMarks,
      obtainedMarks: r.obtainedMarks,
      percentage: r.percentage,
      passed: r.passed,
      submittedAt: r.submittedAt,
    }));

  res.json(formatted);
});

/* =========================
   GET EXAM RESULTS (Instructor — View Results flow)
   GET /api/results/exam/:examId?sort=highest|lowest|latest
========================= */
exports.getExamResults = asyncHandler(async (req, res) => {
  const { studentId, dateFrom, dateTo, minRisk } = req.query;

  const { exam, rows } = await getExamResultsData(req.params.examId, req.user._id, {
    studentId,
    dateFrom,
    dateTo,
    minRisk,
  });

  const sortParam = req.query.sort || "latest";
  if (sortParam === "highest") {
    rows.sort((a, b) => b.percentage - a.percentage);
  } else if (sortParam === "lowest") {
    rows.sort((a, b) => a.percentage - b.percentage);
  } else {
    rows.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  res.json({
    examTitle: exam.title,
    courseCode: exam.courseCode,
    results: rows,
  });
});

/* =========================
   GET RESULT BY ID
   GET /api/results/:id
========================= */
exports.getResultById = asyncHandler(async (req, res) => {
  const result = await Result.findById(req.params.id).populate("exam");

  if (!result) {
    const error = new Error("Result not found");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = result.student.toString() === req.user._id.toString();
  const privileged = isPrivilegedRole(req.user.role);

  if (!isOwner && !privileged) {
    const error = new Error("Not authorized to view this result");
    error.statusCode = 403;
    throw error;
  }

  if (result.status !== "submitted") {
    const error = new Error(
      "This result is not available until the exam has been submitted."
    );
    error.statusCode = 400;
    throw error;
  }

  const exam = result.exam;

  // Auto-graded types (mcq/msq/truefalse) all have a meaningful
  // correctAnswer to show in review. Descriptive/coding don't — there's
  // no single right answer to reveal, they're graded manually.
  const autoGradedTypes = new Set(["mcq", "msq", "truefalse"]);

  const questionResults = exam.questions.map((question) => {
    const answer = result.answers.find(
      (a) => a.question.toString() === question._id.toString()
    );

    return {
      questionId: question._id,
      questionText: question.questionText,
      type: question.type,
      options: question.options,
      yourAnswer: answer?.selectedAnswer || "",
      correctAnswer: autoGradedTypes.has(question.type) ? question.correctAnswer : undefined,
      isCorrect: answer?.isCorrect || false,
      marksAwarded: answer?.marksAwarded || 0,
      marks: question.marks,
    };
  });

  // Rank/percentile against every other submitted attempt for this exam.
  const cohort = await Result.find({ exam: exam._id, status: "submitted" })
    .select("obtainedMarks")
    .lean();
  const { rank, totalStudents, percentile } = computeRankAndPercentile(
    cohort.map((r) => r.obtainedMarks),
    result.obtainedMarks
  );

  res.json({
    resultId: result._id,
    examTitle: exam.title,
    courseCode: exam.courseCode,
    totalMarks: result.totalMarks,
    obtainedMarks: result.obtainedMarks,
    percentage: result.percentage,
    grade: computeGrade(result.percentage),
    rank,
    totalStudents,
    percentile,
    passed: result.passed,
    correctCount: result.correctCount,
    wrongCount: result.wrongCount,
    unattemptedCount: result.unattemptedCount,
    submittedAt: result.submittedAt,
    timeTakenSeconds: result.timeTakenSeconds,
    examDurationSeconds: exam.duration * 60,
    questionResults,
  });
});
