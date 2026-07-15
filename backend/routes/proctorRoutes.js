const express = require("express");
const router = express.Router();

const {
  startSession,
  endSession,
  logEvent,
  getExamSessions,
  getExamViolations,
  terminateSessionHandler,
} = require("../controllers/proctorController");
const { protect, instructorOnly } = require("../middleware/authMiddleware");
const {
  validate,
  startProctorSessionValidation,
  logProctorEventValidation,
} = require("../middleware/validators");

/* =========================
   START PROCTOR SESSION
========================= */
router.post("/start", protect, startProctorSessionValidation, validate, startSession);

/* =========================
   EXAMINER — LIVE MONITORING
========================= */
router.get("/exam/:examId/sessions", protect, instructorOnly, getExamSessions);
router.get("/exam/:examId/violations", protect, instructorOnly, getExamViolations);
router.post("/:sessionId/terminate", protect, instructorOnly, terminateSessionHandler);

/* =========================
   END PROCTOR SESSION
========================= */
router.post("/:sessionId/end", protect, endSession);

/* =========================
   SAVE PROCTOR EVENT
========================= */
router.post("/:sessionId/log", protect, logProctorEventValidation, validate, logEvent);

module.exports = router;
