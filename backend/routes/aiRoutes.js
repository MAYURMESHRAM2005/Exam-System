const express = require("express");
const router = express.Router();

const { generateQuestions } = require("../controllers/aiController");
const { protect, instructorOnly } = require("../middleware/authMiddleware");

/* =========================
   AI CONFIG STATUS
   GET /api/ai/status
   Public endpoint — returns whether AI generation is configured.
========================= */
router.get("/status", (req, res) => {
  const hasKey = !!(process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY);
  const provider = process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY ? "Groq" : process.env.OPENAI_API_KEY ? "OpenAI" : null;
  res.json({ configured: !!provider, provider: provider || "none" });
});

/* =========================
   GENERATE QUESTIONS WITH AI
   POST /api/ai/generate-questions
   Only instructors can generate questions.
========================= */
router.post("/generate-questions", protect, instructorOnly, generateQuestions);

module.exports = router;
