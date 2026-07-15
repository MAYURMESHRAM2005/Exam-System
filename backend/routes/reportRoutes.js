const express = require("express");
const router = express.Router();

const {
  exportResults,
  exportViolations,
  exportAttendance,
  exportAIReport,
  exportCompleteReport,
} = require("../controllers/reportController");
const { protect, instructorOnly } = require("../middleware/authMiddleware");

// Every handler re-checks exam ownership itself (via assertOwnedExam in
// utils/reportData.js) — instructorOnly here just keeps students from
// hitting these routes at all, same layered pattern as examRoutes.js.
router.get("/:examId/results", protect, instructorOnly, exportResults);
router.get("/:examId/violations", protect, instructorOnly, exportViolations);
router.get("/:examId/attendance", protect, instructorOnly, exportAttendance);
router.get("/:examId/ai-report", protect, instructorOnly, exportAIReport);
router.get("/:examId/complete", protect, instructorOnly, exportCompleteReport);

module.exports = router;
