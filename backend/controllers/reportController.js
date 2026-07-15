const asyncHandler = require("../utils/asyncHandler");
const PDFDocument = require("pdfkit");
const { sendCsv, sendXlsx, sendPdfTable } = require("../utils/exporters");
const {
  getExamResultsData,
  getExamViolationsData,
  getExamAttendanceData,
  getExamAIReportData,
} = require("../utils/reportData");

const readFilters = (query) => ({
  studentId: query.studentId,
  dateFrom: query.dateFrom,
  dateTo: query.dateTo,
  minRisk: query.minRisk,
  eventType: query.eventType,
  minSeverity: query.minSeverity,
});

const slug = (text) =>
  String(text || "exam")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);

function dispatch(req, res, format, { title, subtitle, columns, rows, filenameBase, meta }) {
  const filename = `${filenameBase}.${format === "xlsx" ? "xlsx" : format}`;
  if (format === "csv") {
    sendCsv(res, filename, columns, rows);
  } else if (format === "xlsx") {
    sendXlsx(res, filename, { title, columns, rows });
  } else if (format === "pdf") {
    sendPdfTable(res, filename, { title, subtitle, columns, rows, meta });
  } else {
    const error = new Error("Unsupported format — use csv, xlsx, or pdf");
    error.statusCode = 400;
    throw error;
  }
}

/* =========================================================
   STUDENT RESULTS REPORT
   GET /api/reports/:examId/results?format=csv|xlsx|pdf
========================================================= */
exports.exportResults = asyncHandler(async (req, res) => {
  const format = (req.query.format || "csv").toLowerCase();
  const { exam, rows } = await getExamResultsData(req.params.examId, req.user._id, readFilters(req.query));

  const columns = [
    { key: "studentName", label: "Student", width: 22 },
    { key: "studentEmail", label: "Email", width: 26 },
    { key: "obtainedMarks", label: "Marks", width: 10 },
    { key: "totalMarks", label: "Total", width: 10 },
    { key: "percentage", label: "%", width: 8 },
    { key: "grade", label: "Grade", width: 8 },
    { key: "correctCount", label: "Correct", width: 10 },
    { key: "wrongCount", label: "Wrong", width: 10 },
    { key: "unattemptedCount", label: "Skipped", width: 10 },
    { key: "passed", label: "Pass/Fail", width: 10 },
    { key: "status", label: "Status", width: 14 },
    { key: "timeTakenSeconds", label: "Time Taken (s)", width: 14 },
    { key: "violations", label: "Violations", width: 10 },
    { key: "riskScore", label: "Risk Score", width: 10 },
    { key: "integrityScore", label: "Integrity Score", width: 14 },
    { key: "submittedAt", label: "Submitted At", width: 20 },
  ];

  const formattedRows = rows.map((r) => ({
    ...r,
    passed: r.passed ? "Pass" : "Fail",
    submittedAt: new Date(r.submittedAt).toLocaleString(),
  }));

  dispatch(req, res, format, {
    title: `Results — ${exam.title}`,
    subtitle: `${exam.courseCode} · ${rows.length} submission${rows.length === 1 ? "" : "s"}`,
    columns,
    rows: formattedRows,
    filenameBase: `${slug(exam.title)}-results`,
  });
});

/* =========================================================
   VIOLATION REPORT
   GET /api/reports/:examId/violations?format=csv|xlsx|pdf
========================================================= */
exports.exportViolations = asyncHandler(async (req, res) => {
  const format = (req.query.format || "csv").toLowerCase();
  const { exam, rows } = await getExamViolationsData(req.params.examId, req.user._id, {
    ...readFilters(req.query),
    limit: 5000,
  });

  const columns = [
    { key: "studentName", label: "Student", width: 22 },
    { key: "eventType", label: "Detection Type", width: 22 },
    { key: "severity", label: "Severity", width: 10 },
    { key: "riskPoints", label: "Risk Points", width: 10 },
    { key: "details", label: "Details", width: 30 },
    { key: "hasEvidence", label: "Has Evidence", width: 10 },
    { key: "timestamp", label: "Timestamp", width: 20 },
  ];

  const formattedRows = rows.map((r) => ({
    ...r,
    hasEvidence: r.hasEvidence ? "Yes" : "No",
    timestamp: new Date(r.timestamp).toLocaleString(),
  }));

  dispatch(req, res, format, {
    title: `Violation Report — ${exam.title}`,
    subtitle: `${exam.courseCode} · ${rows.length} recorded event${rows.length === 1 ? "" : "s"}`,
    columns,
    rows: formattedRows,
    filenameBase: `${slug(exam.title)}-violations`,
  });
});

/* =========================================================
   ATTENDANCE REPORT
   GET /api/reports/:examId/attendance?format=csv|xlsx|pdf
   Derived from proctoring sessions — see getExamAttendanceData for why
   this isn't a roster against a pre-registered class list.
========================================================= */
exports.exportAttendance = asyncHandler(async (req, res) => {
  const format = (req.query.format || "csv").toLowerCase();
  const { exam, rows } = await getExamAttendanceData(req.params.examId, req.user._id, readFilters(req.query));

  const columns = [
    { key: "studentName", label: "Student", width: 22 },
    { key: "studentEmail", label: "Email", width: 26 },
    { key: "joinedAt", label: "Joined At", width: 20 },
    { key: "leftAt", label: "Left At", width: 20 },
    { key: "durationMinutes", label: "Duration (min)", width: 12 },
    { key: "status", label: "Session Status", width: 12 },
    { key: "cameraStatus", label: "Camera", width: 10 },
    { key: "microphoneStatus", label: "Microphone", width: 10 },
  ];

  const formattedRows = rows.map((r) => ({
    ...r,
    joinedAt: r.joinedAt ? new Date(r.joinedAt).toLocaleString() : "",
    leftAt: r.leftAt ? new Date(r.leftAt).toLocaleString() : "Still active",
    durationMinutes: r.durationSeconds !== null ? Math.round(r.durationSeconds / 60) : "—",
  }));

  dispatch(req, res, format, {
    title: `Attendance — ${exam.title}`,
    subtitle: `${exam.courseCode} · ${rows.length} student session${rows.length === 1 ? "" : "s"}`,
    columns,
    rows: formattedRows,
    filenameBase: `${slug(exam.title)}-attendance`,
  });
});

/* =========================================================
   AI RISK REPORT
   GET /api/reports/:examId/ai-report?format=csv|xlsx|pdf
========================================================= */
exports.exportAIReport = asyncHandler(async (req, res) => {
  const format = (req.query.format || "csv").toLowerCase();
  const { exam, rows } = await getExamAIReportData(req.params.examId, req.user._id, readFilters(req.query));

  const columns = [
    { key: "studentName", label: "Student", width: 22 },
    { key: "studentEmail", label: "Email", width: 26 },
    { key: "riskScore", label: "Risk Score", width: 10 },
    { key: "integrityScore", label: "Integrity Score", width: 14 },
    { key: "violationCount", label: "Violations", width: 10 },
    { key: "flagged", label: "Flagged", width: 8 },
    { key: "topDetections", label: "Top Detections", width: 36 },
  ];

  const formattedRows = rows.map((r) => ({ ...r, flagged: r.flagged ? "Yes" : "No" }));

  dispatch(req, res, format, {
    title: `AI Proctoring Report — ${exam.title}`,
    subtitle: `${exam.courseCode} · ranked by risk score, highest first`,
    columns,
    rows: formattedRows,
    filenameBase: `${slug(exam.title)}-ai-report`,
  });
});

/* =========================================================
   COMPLETE EXAM REPORT (PDF only)
   GET /api/reports/:examId/complete
   Results + AI risk + attendance summary in one document — a single
   file to hand to an academic office, rather than three separate ones.
========================================================= */
exports.exportCompleteReport = asyncHandler(async (req, res) => {
  const filters = readFilters(req.query);
  const [{ exam, rows: results }, { rows: aiRows }, { rows: attendanceRows }] = await Promise.all([
    getExamResultsData(req.params.examId, req.user._id, filters),
    getExamAIReportData(req.params.examId, req.user._id, filters),
    getExamAttendanceData(req.params.examId, req.user._id, filters),
  ]);

  const passCount = results.filter((r) => r.passed).length;
  const avgPercentage = results.length
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;
  const flaggedCount = aiRows.filter((r) => r.flagged).length;

  const filename = `${slug(exam.title)}-complete-report.pdf`;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  const doc = new PDFDocument({ margin: 40, size: "A4" });
  doc.pipe(res);

  doc.fontSize(20).font("Helvetica-Bold").text(`Complete Exam Report`);
  doc.fontSize(13).font("Helvetica").fillColor("#475569").text(`${exam.title} (${exam.courseCode})`);
  doc.fontSize(9).fillColor("#94a3b8").text(`Generated ${new Date().toLocaleString()}`);
  doc.fillColor("#000000").moveDown(1);

  doc.fontSize(14).font("Helvetica-Bold").text("Summary");
  doc.fontSize(10).font("Helvetica");
  doc.text(`Submissions: ${results.length}`);
  doc.text(`Pass rate: ${results.length ? Math.round((passCount / results.length) * 100) : 0}% (${passCount}/${results.length})`);
  doc.text(`Average score: ${avgPercentage}%`);
  doc.text(`Flagged attempts (AI risk): ${flaggedCount}`);
  doc.text(`Attendance (sessions started): ${attendanceRows.length}`);
  doc.moveDown(1);

  const renderSection = (title, columns, rows) => {
    doc.fontSize(14).font("Helvetica-Bold").text(title);
    doc.moveDown(0.3);
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = pageWidth / columns.length;

    const drawHeader = () => {
      doc.font("Helvetica-Bold").fontSize(9).fillColor("#1e293b");
      const y = doc.y;
      columns.forEach((c, i) => doc.text(c.label, doc.page.margins.left + i * colWidth, y, { width: colWidth - 4, ellipsis: true }));
      doc.moveDown(0.6);
      doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).strokeColor("#cbd5e1").stroke();
      doc.moveDown(0.3);
    };

    drawHeader();
    doc.font("Helvetica").fontSize(8.5).fillColor("#334155");
    if (rows.length === 0) {
      doc.fontSize(9).fillColor("#64748b").text("No records.");
    }
    rows.forEach((row) => {
      if (doc.y + 20 > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
        drawHeader();
        doc.font("Helvetica").fontSize(8.5).fillColor("#334155");
      }
      const y = doc.y;
      columns.forEach((c, i) => {
        const value = row[c.key];
        doc.text(value === null || value === undefined ? "" : String(value), doc.page.margins.left + i * colWidth, y, {
          width: colWidth - 4,
          ellipsis: true,
        });
      });
      doc.moveDown(0.85);
    });
    doc.fillColor("#000000").moveDown(1);
  };

  renderSection(
    "Results",
    [
      { key: "studentName", label: "Student" },
      { key: "percentage", label: "%" },
      { key: "grade", label: "Grade" },
      { key: "passed", label: "Pass/Fail" },
      { key: "riskScore", label: "Risk" },
    ],
    results.map((r) => ({ ...r, passed: r.passed ? "Pass" : "Fail" }))
  );

  if (doc.y > doc.page.height - 150) doc.addPage();
  renderSection(
    "AI Risk Summary",
    [
      { key: "studentName", label: "Student" },
      { key: "riskScore", label: "Risk Score" },
      { key: "violationCount", label: "Violations" },
      { key: "flagged", label: "Flagged" },
      { key: "topDetections", label: "Top Detections" },
    ],
    aiRows.map((r) => ({ ...r, flagged: r.flagged ? "Yes" : "No" }))
  );

  doc.end();
});
