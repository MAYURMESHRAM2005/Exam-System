const Exam = require("../models/Exam");
const Result = require("../models/Result");
const ProctorSession = require("../models/ProctorSession");
const ProctorLog = require("../models/ProctorLog");
const { computeGrade } = require("./grade");
const { computeRankAndPercentile } = require("./rankPercentile");

/* =========================================================
   SHARED REPORT DATA BUILDERS
   Single source of truth for "what does a row of the results/violations/
   attendance/AI report look like" — reused by the JSON "View" endpoints
   (getExamResults, getExamViolations) AND every export format (CSV/XLSX/
   PDF), so a filter or a column added here shows up everywhere at once
   instead of drifting between a view path and an export path.

   All four `filters` objects share the same shape (only the fields each
   report actually supports are read):
     { studentId, dateFrom, dateTo, minRisk, eventType, minSeverity }
========================================================= */

const SEVERITY_ORDER = ["info", "low", "medium", "high", "critical"];

async function assertOwnedExam(examId, instructorId) {
  const exam = await Exam.findById(examId);
  if (!exam) {
    const error = new Error("Exam not found");
    error.statusCode = 404;
    throw error;
  }
  if (exam.createdBy.toString() !== instructorId.toString()) {
    const error = new Error("Not authorized for this exam");
    error.statusCode = 403;
    throw error;
  }
  return exam;
}

function dateRangeMatch(date, dateFrom, dateTo) {
  const t = new Date(date).getTime();
  if (dateFrom && t < new Date(dateFrom).getTime()) return false;
  if (dateTo && t > new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1) return false; // inclusive end-of-day
  return true;
}

/* ---------------------------------------------------------
   RESULTS REPORT
--------------------------------------------------------- */
async function getExamResultsData(examId, instructorId, filters = {}) {
  const exam = await assertOwnedExam(examId, instructorId);

  const resultQuery = { exam: exam._id, status: "submitted" };
  if (filters.studentId) resultQuery.student = filters.studentId;

  const results = await Result.find(resultQuery).populate("student", "name email");

  const proctorSessions = await ProctorSession.find({ exam: exam._id }).select(
    "student violationCount riskScore flagged"
  );
  const sessionByStudent = new Map(proctorSessions.map((s) => [s.student.toString(), s]));

  const allScores = results.filter((r) => r.student).map((r) => r.obtainedMarks);

  let rows = results
    .filter((r) => r.student)
    .map((r) => {
      const { rank, totalStudents, percentile } = computeRankAndPercentile(allScores, r.obtainedMarks);
      const session = sessionByStudent.get(r.student._id.toString());
      const riskScore = session?.riskScore ?? 0;
      // Simple, transparent formula: 100 minus risk, floored at 0 — not a
      // separately-modeled metric, just risk expressed the other way up
      // for a reader who thinks in "how clean was this attempt" terms.
      const integrityScore = Math.max(0, 100 - riskScore);

      return {
        resultId: r._id.toString(),
        studentName: r.student.name,
        studentEmail: r.student.email,
        obtainedMarks: r.obtainedMarks,
        totalMarks: r.totalMarks,
        percentage: r.percentage,
        grade: computeGrade(r.percentage),
        correctCount: r.correctCount,
        wrongCount: r.wrongCount,
        unattemptedCount: r.unattemptedCount,
        rank,
        totalStudents,
        percentile,
        passed: r.passed,
        status: r.terminatedByExaminer ? (r.autoTerminated ? "Auto-Terminated" : "Terminated") : "Submitted",
        timeTakenSeconds: r.timeTakenSeconds,
        submittedAt: r.submittedAt,
        violations: session?.violationCount ?? 0,
        riskScore,
        integrityScore,
        flagged: Boolean(session?.flagged),
      };
    });

  if (filters.dateFrom || filters.dateTo) {
    rows = rows.filter((row) => dateRangeMatch(row.submittedAt, filters.dateFrom, filters.dateTo));
  }
  if (filters.minRisk) {
    rows = rows.filter((row) => row.riskScore >= Number(filters.minRisk));
  }

  return { exam, rows };
}

/* ---------------------------------------------------------
   VIOLATIONS REPORT
--------------------------------------------------------- */
async function getExamViolationsData(examId, instructorId, filters = {}) {
  const exam = await assertOwnedExam(examId, instructorId);

  const sessionQuery = { exam: exam._id };
  if (filters.studentId) sessionQuery.student = filters.studentId;
  const sessions = await ProctorSession.find(sessionQuery).select("_id student");
  const sessionIds = sessions.map((s) => s._id);
  const studentBySession = new Map(sessions.map((s) => [s._id.toString(), s.student]));

  const logQuery = { session: { $in: sessionIds }, severity: { $ne: "info" } };
  if (filters.eventType) logQuery.eventType = filters.eventType;
  if (filters.minSeverity && SEVERITY_ORDER.includes(filters.minSeverity)) {
    const allowedSeverities = SEVERITY_ORDER.slice(SEVERITY_ORDER.indexOf(filters.minSeverity));
    logQuery.severity = { $in: allowedSeverities };
  }
  if (filters.dateFrom || filters.dateTo) {
    logQuery.timestamp = {};
    if (filters.dateFrom) logQuery.timestamp.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) logQuery.timestamp.$lte = new Date(new Date(filters.dateTo).getTime() + 24 * 60 * 60 * 1000 - 1);
  }

  const logs = await ProctorLog.find(logQuery)
    .sort("-timestamp")
    .limit(filters.limit || 2000)
    .populate({
      path: "session",
      select: "student",
      populate: { path: "student", select: "name email" },
    })
    .lean();

  const rows = logs.map((log) => ({
    logId: log._id.toString(),
    sessionId: log.session?._id?.toString() || null,
    studentName: log.session?.student?.name || "Unknown",
    studentEmail: log.session?.student?.email || "",
    examTitle: exam.title,
    eventType: log.eventType,
    severity: log.severity,
    riskPoints: log.riskPoints,
    details: log.details || "",
    confidenceScore: log.confidenceScore ?? null,
    ipAddress: log.ipAddress || null,
    hasEvidence: Boolean(log.evidenceUrl),
    evidenceUrl: log.evidenceUrl || "",
    timestamp: log.timestamp,
  }));

  return { exam, rows, studentBySession };
}

/* ---------------------------------------------------------
   ATTENDANCE REPORT
   Derived from ProctorSession — this app has no separate enrollment
   list (any student can attempt any published exam), so "attendance"
   here honestly means "who actually opened a proctoring session for
   this exam, and for how long" rather than an attendance roster against
   a pre-registered class list, which this system doesn't model.
--------------------------------------------------------- */
async function getExamAttendanceData(examId, instructorId, filters = {}) {
  const exam = await assertOwnedExam(examId, instructorId);

  const query = { exam: exam._id };
  if (filters.studentId) query.student = filters.studentId;

  const sessions = await ProctorSession.find(query)
    .populate("student", "name email")
    .sort("startedAt");

  let rows = sessions
    .filter((s) => s.student)
    .map((s) => {
      const durationSeconds = s.endedAt
        ? Math.max(0, Math.floor((s.endedAt.getTime() - s.startedAt.getTime()) / 1000))
        : null;
      return {
        studentName: s.student.name,
        studentEmail: s.student.email,
        joinedAt: s.startedAt,
        leftAt: s.endedAt,
        durationSeconds,
        status: s.status,
        cameraStatus: s.cameraStatus,
        microphoneStatus: s.microphoneStatus,
        violationCount: s.violationCount,
        riskScore: s.riskScore,
      };
    });

  if (filters.dateFrom || filters.dateTo) {
    rows = rows.filter((row) => dateRangeMatch(row.joinedAt, filters.dateFrom, filters.dateTo));
  }
  if (filters.minRisk) {
    rows = rows.filter((row) => row.riskScore >= Number(filters.minRisk));
  }

  return { exam, rows };
}

/* ---------------------------------------------------------
   AI REPORT
   Per-student risk/violation summary, plus a breakdown of which
   detection types actually fired for them — the "how" behind the
   headline risk score, not just the number.
--------------------------------------------------------- */
async function getExamAIReportData(examId, instructorId, filters = {}) {
  const exam = await assertOwnedExam(examId, instructorId);

  const query = { exam: exam._id };
  if (filters.studentId) query.student = filters.studentId;
  if (filters.minRisk) query.riskScore = { $gte: Number(filters.minRisk) };

  const sessions = await ProctorSession.find(query).populate("student", "name email");

  const rows = sessions
    .filter((s) => s.student)
    .map((s) => {
      const counts = s.eventCounts instanceof Map ? Object.fromEntries(s.eventCounts) : s.eventCounts || {};
      const topEvents = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([type, count]) => `${type.replace(/_/g, " ").toLowerCase()} (${count})`)
        .join(", ");

      return {
        studentName: s.student.name,
        studentEmail: s.student.email,
        riskScore: s.riskScore,
        integrityScore: Math.max(0, 100 - s.riskScore),
        violationCount: s.violationCount,
        flagged: s.flagged,
        topDetections: topEvents || "None",
      };
    })
    .sort((a, b) => b.riskScore - a.riskScore);

  return { exam, rows };
}

module.exports = {
  SEVERITY_ORDER,
  getExamResultsData,
  getExamViolationsData,
  getExamAttendanceData,
  getExamAIReportData,
};
