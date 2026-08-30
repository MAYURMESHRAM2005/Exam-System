const express = require("express");
const router = express.Router();

const { generateQuestions } = require("../controllers/aiController");
const { protect, instructorOnly } = require("../middleware/authMiddleware");

/* =========================
   GENERATE QUESTIONS WITH AI
   POST /api/ai/generate-questions
   Only instructors can generate questions.
========================= */
router.post("/generate-questions", protect, instructorOnly, generateQuestions);

module.exports = router;
