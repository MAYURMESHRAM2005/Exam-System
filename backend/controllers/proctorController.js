const Exam = require("../models/Exam");
const ProctorSession = require("../models/ProctorSession");
const ProctorLog = require("../models/ProctorLog");
const asyncHandler = require("../utils/asyncHandler");
const { getSeverity, getRiskPoints, isViolation } = require("../utils/violationSeverity");
const { getIO, examMonitorRoom } = require("../socket");
const { terminateSession } = require("../services/proctorSessionService");
const { saveEvidenceImage } = require("../utils/saveEvidence");
const { notify } = require("../services/notificationService");
const { getAutoTerminationReason } = require("../utils/autoTerminationRules");
const { getExamViolationsData } = require("../utils/reportData");

// A session is auto-flagged for examiner review once its cumulative risk
// score crosses this threshold (e.g. one MULTIPLE_FACE (20) + two
// TAB_SWITCH (10 each) already crosses it).
const RISK_FLAG_THRESHOLD = 40;

/* =========================
   START PROCTOR SESSION
   POST /api/proctor/start
   Body: { examId, cameraStatus, microphoneStatus, browserInfo, browserSupported }
========================= */
exports.startSession = asyncHandler(async (req, res) => {
  const { examId, cameraStatus, microphoneStatus, browserInfo, browserSupported } = req.body;

  const exam = await Exam.findById(examId);
  if (!exam) {
    const error = new Error("Exam not found");
    error.statusCode = 404;
    throw error;
  }

  const session = await ProctorSession.create({
    exam: exam._id,
    student: req.user._id,
    cameraStatus: cameraStatus || "pending",
    microphoneStatus: microphoneStatus || "pending",
    browserInfo: browserInfo || "",
    browserSupported: browserSupported !== undefined ? browserSupported : true,
  });

  await ProctorLog.create({
    session: session._id,
    eventType: "session_started",
    details: `Camera: ${session.cameraStatus}, Microphone: ${session.microphoneStatus}`,
  });

  notify({
    recipient: exam.createdBy,
    type: "student_joined",
    title: "Student joined exam",
    message: `${req.user.name} joined "${exam.title}".`,
    data: { examId: exam._id, sessionId: session._id, studentId: req.user._id },
  });

  res.status(201).json({
    sessionId: session._id,
    status: session.status,
    cameraStatus: session.cameraStatus,
    microphoneStatus: session.microphoneStatus,
  });
});

/* =========================
   END PROCTOR SESSION
   POST /api/proctor/:sessionId/end
========================= */
exports.endSession = asyncHandler(async (req, res) => {
  const session = await ProctorSession.findById(req.params.sessionId);

  if (!session) {
    const error = new Error("Proctor session not found");
    error.statusCode = 404;
    throw error;
  }

  if (session.student.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to end this session");
    error.statusCode = 403;
    throw error;
  }

  if (session.status === "ended") {
    return res.json({ message: "Session already ended", sessionId: session._id });
  }

  session.status = "ended";
  session.endedAt = new Date();
  await session.save();

  await ProctorLog.create({
    session: session._id,
    eventType: "session_ended",
  });

  Exam.findById(session.exam)
    .select("title createdBy")
    .then((exam) => {
      if (!exam) return;
      notify({
        recipient: exam.createdBy,
        type: "student_left",
        title: "Student left exam",
        message: `${req.user.name} left "${exam.title}".`,
        data: { examId: exam._id, sessionId: session._id, studentId: req.user._id },
      });
    })
    .catch(() => {});

  res.json({ message: "Proctor session ended", sessionId: session._id });
});

/* =========================
   SAVE PROCTOR EVENT
   POST /api/proctor/:sessionId/log
   Body: { eventType, details }
========================= */
exports.logEvent = asyncHandler(async (req, res) => {
  const { eventType, details, evidence, confidence } = req.body;

  console.log(`[proctor:logEvent] session=${req.params.sessionId} eventType=${eventType} details=${details || ""}`);

  const session = await ProctorSession.findById(req.params.sessionId);

  if (!session) {
    const error = new Error("Proctor session not found");
    error.statusCode = 404;
    throw error;
  }

  if (session.student.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to log events for this session");
    error.statusCode = 403;
    throw error;
  }

  const severity = getSeverity(eventType);
  const riskPoints = getRiskPoints(eventType);
  const evidenceUrl = saveEvidenceImage(evidence);

  // req.ip requires `app.set("trust proxy", ...)` upstream (already set in
  // server.js for Render/other reverse-proxy deployments) to reflect the
  // real client IP rather than the proxy's. Always taken from the request
  // itself — the client never gets to claim its own IP address.
  const ipAddress = req.ip || req.connection?.remoteAddress || null;

  // Confidence must be a finite 0-100 number if provided at all; anything
  // else (missing, NaN, out of range) is stored as null rather than
  // trusting an arbitrary client-supplied value into a numeric field.
  const confidenceScore =
    typeof confidence === "number" && Number.isFinite(confidence)
      ? Math.max(0, Math.min(100, confidence))
      : null;

  const log = await ProctorLog.create({
    session: session._id,
    eventType,
    severity,
    riskPoints,
    details: details || "",
    confidenceScore,
    ipAddress,
    evidenceUrl,
  });

  // Keep the session's own status fields in sync with key device events,
  // so other endpoints can answer "is this session camera-ready?" without
  // having to re-scan the whole log.
  if (eventType === "camera_granted") session.cameraStatus = "granted";
  if (eventType === "camera_denied") session.cameraStatus = "denied";
  if (eventType === "microphone_granted") session.microphoneStatus = "granted";
  if (eventType === "microphone_denied") session.microphoneStatus = "denied";
  if (eventType === "device_unavailable") {
    // Doesn't specify which device — leave camera/mic status untouched,
    // the frontend logs a more specific event type per device when known.
  }

  let justFlagged = false;
  if (isViolation(eventType)) {
    const wasAlreadyFlagged = session.flagged;
    session.violationCount += 1;
    session.riskScore += riskPoints;
    session.eventCounts.set(eventType, (session.eventCounts.get(eventType) || 0) + 1);
    if (!session.flagged && session.riskScore >= RISK_FLAG_THRESHOLD) {
      session.flagged = true;
      session.flaggedAt = new Date();
    }
    justFlagged = !wasAlreadyFlagged && session.flagged;
  }

  await session.save();

  let terminationReason = null;

  if (isViolation(eventType)) {
    const io = getIO();
    if (io) {
      io.to(examMonitorRoom(session.exam.toString())).emit("violation:new", {
        sessionId: session._id,
        studentId: session.student,
        eventType,
        severity,
        details: details || "",
        evidenceUrl,
        violationCount: session.violationCount,
        riskScore: session.riskScore,
        flagged: session.flagged,
        timestamp: log.timestamp,
      });
    }

    // In-app notifications, on top of the always-on live socket event
    // above. Deliberately restricted to medium+ severity — persisting one
    // for every single low-severity blip (e.g. a brief window resize)
    // would flood both the student's and instructor's notification
    // centers with noise that the live monitoring view already surfaces
    // in real time for anyone actively watching.
    if (severity !== "low") {
      notify({
        recipient: session.student,
        type: "violation_detected",
        title: "Violation detected",
        message: `A ${severity}-severity violation was flagged during your exam: ${eventType.replace(/_/g, " ").toLowerCase()}.`,
        data: { sessionId: session._id, eventType, severity },
      });
    }

    // Fetched once, reused for both the "AI detected cheating" notification
    // and the auto-terminate rule check below — both need the exam's
    // config/title, so there's no reason to fetch it twice.
    const exam = await Exam.findById(session.exam);

    if (exam) {
      // "AI detected cheating" — reserved for the most serious signals
      // (critical severity, e.g. a phone or a second person in frame) or
      // the moment a session first crosses the flagged threshold, so this
      // notification means something distinct from the routine
      // violation_detected one above rather than duplicating it.
      if (severity === "critical" || justFlagged) {
        notify({
          recipient: exam.createdBy,
          type: "ai_cheating_detected",
          title: "Possible cheating detected",
          message: `AI proctoring flagged a ${severity}-severity event ("${eventType.replace(/_/g, " ").toLowerCase()}") during "${exam.title}".`,
          data: { examId: exam._id, sessionId: session._id, studentId: session.student, eventType, severity },
        });
      }

      // Auto-terminate rules (see utils/autoTerminationRules.js) — opt-in
      // per exam, disabled by default. terminateSession() itself handles
      // finalizing the attempt, notifying both parties, and the audit
      // trail (terminationReason/autoTerminated on the Result), so this
      // is just the trigger check.
      console.log(
        `[autoTerminate] event=${eventType} severity=${severity} exam=${exam._id} ` +
          `config=${JSON.stringify(exam.autoTerminate)}`
      );
      terminationReason = getAutoTerminationReason(exam, session.eventCounts, eventType);
      console.log(`[autoTerminate] rule check result: ${terminationReason || "no rule matched — not terminating"}`);

      if (terminationReason) {
        try {
          const { result: terminatedResult } = await terminateSession(session._id, {
            reason: terminationReason,
            automatic: true,
          });

          console.log(
            `[autoTerminate] terminateSession() finished. Result document ` +
              `${terminatedResult ? `${terminatedResult._id} was force-submitted successfully.` : "was NOT found/updated — the exam attempt was NOT force-submitted (session may not be linked to a Result)."}`
          );

          io?.to(`session:${session._id}`).emit("student:terminated", {
            message: terminationReason,
            resultId: terminatedResult?._id || null,
          });
          io?.to(examMonitorRoom(exam._id.toString())).emit("session:terminated", {
            sessionId: session._id,
            resultId: terminatedResult?._id || null,
          });
        } catch (err) {
          console.error(`[autoTerminate] terminateSession() threw an error:`, err);
          // If termination itself fails for some reason, the violation is
          // still logged normally above — never lose the log over this.
          terminationReason = null;
        }
      }
    }
  }

  res.status(201).json({
    message: "Event logged",
    logId: log._id,
    severity,
    violationCount: session.violationCount,
    riskScore: session.riskScore,
    flagged: session.flagged,
    terminated: Boolean(terminationReason),
    terminationReason: terminationReason || undefined,
  });
});

/* =========================================================
   LIST LIVE SESSIONS FOR AN EXAM (examiner)
   GET /api/proctor/exam/:examId/sessions
========================================================= */
exports.getExamSessions = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.examId);
  if (!exam) {
    const error = new Error("Exam not found");
    error.statusCode = 404;
    throw error;
  }

  if (exam.createdBy.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to view sessions for this exam");
    error.statusCode = 403;
    throw error;
  }

  const sessions = await ProctorSession.find({ exam: exam._id })
    .populate("student", "name email")
    .populate("result", "status obtainedMarks totalMarks percentage submittedAt terminatedByExaminer answers")
    .sort("-startedAt")
    .lean();

  const totalQuestions = exam.questions.length;

  res.json({
    exam: {
      id: exam._id,
      title: exam.title,
      courseCode: exam.courseCode,
      totalQuestions,
    },
    sessions: sessions.map((s) => ({
      sessionId: s._id,
      student: s.student
        ? { id: s.student._id, name: s.student.name, email: s.student.email }
        : null,
      status: s.status,
      cameraStatus: s.cameraStatus,
      microphoneStatus: s.microphoneStatus,
      violationCount: s.violationCount,
      riskScore: s.riskScore,
      flagged: s.flagged,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      progress: {
        answered: s.result
          ? s.result.answers.filter((a) => a.selectedAnswer).length
          : 0,
        total: totalQuestions,
      },
      result: s.result
        ? {
            status: s.result.status,
            obtainedMarks: s.result.obtainedMarks,
            totalMarks: s.result.totalMarks,
            percentage: s.result.percentage,
            submittedAt: s.result.submittedAt,
            terminatedByExaminer: s.result.terminatedByExaminer,
          }
        : null,
    })),
  });
});

/* =========================================================
   RECENT VIOLATIONS FOR AN EXAM (examiner)
   GET /api/proctor/exam/:examId/violations
========================================================= */
exports.getExamViolations = asyncHandler(async (req, res) => {
  const { studentId, eventType, minSeverity, dateFrom, dateTo } = req.query;

  const { rows } = await getExamViolationsData(req.params.examId, req.user._id, {
    studentId,
    eventType,
    minSeverity,
    dateFrom,
    dateTo,
    limit: 100,
  });

  res.json(
    rows.map((row) => ({
      logId: row.logId,
      sessionId: row.sessionId,
      student: { name: row.studentName, email: row.studentEmail },
      eventType: row.eventType,
      severity: row.severity,
      riskPoints: row.riskPoints,
      details: row.details,
      confidenceScore: row.confidenceScore,
      ipAddress: row.ipAddress,
      evidenceUrl: row.evidenceUrl || null,
      timestamp: row.timestamp,
    }))
  );
});

/* =========================================================
   TERMINATE SESSION (examiner) — force-submit + end proctoring
   POST /api/proctor/:sessionId/terminate
========================================================= */
exports.terminateSessionHandler = asyncHandler(async (req, res) => {
  const session = await ProctorSession.findById(req.params.sessionId);
  if (!session) {
    const error = new Error("Proctoring session not found");
    error.statusCode = 404;
    throw error;
  }

  const exam = await Exam.findById(session.exam).select("createdBy");
  if (!exam || exam.createdBy.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to terminate this session");
    error.statusCode = 403;
    throw error;
  }

  const { session: endedSession, result } = await terminateSession(req.params.sessionId, {
    reason: typeof req.body?.reason === "string" ? req.body.reason.slice(0, 300) : undefined,
  });

  const io = getIO();
  if (io) {
    io.to(`session:${endedSession._id}`).emit("student:terminated", {
      message: "Your exam was ended by the examiner.",
      resultId: result?._id || null,
    });
    io.to(examMonitorRoom(session.exam.toString())).emit("session:terminated", {
      sessionId: endedSession._id,
      resultId: result?._id || null,
    });
  }

  res.json({
    message: "Session terminated",
    sessionId: endedSession._id,
    resultId: result?._id || null,
  });
});
