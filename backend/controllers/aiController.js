const asyncHandler = require("../utils/asyncHandler");

/* =========================================================
   AI QUESTION GENERATION
   POST /api/ai/generate-questions
   Body: { topic, count, difficulty, marksPerQuestion }
   
   Calls an OpenAI-compatible API (OpenAI, Groq, etc.) to generate
   structured exam questions. The API key is never exposed to the client.
========================================================= */

const DIFFICULTY_DESCRIPTIONS = {
  easy: "basic recall and simple comprehension questions suitable for beginners",
  medium: "application-level questions requiring understanding of concepts and their relationships",
  hard: "advanced analytical questions requiring deep understanding, problem-solving, and synthesis of multiple concepts",
};

function buildPrompt(topic, count, difficulty, marksPerQuestion) {
  const diffDesc = DIFFICULTY_DESCRIPTIONS[difficulty] || DIFFICULTY_DESCRIPTIONS.medium;

  return `You are an expert exam question writer. Generate exactly ${count} multiple-choice questions (MCQs) about "${topic}".

Difficulty level: ${difficulty} — ${diffDesc}

Requirements:
- Questions must be educationally meaningful and factually accurate
- Each question must have exactly 4 options (A, B, C, D)
- Exactly one option must be the correct answer
- Questions should cover diverse subtopics within "${topic}" — avoid repetitive or near-identical questions
- Options should be plausible but clearly distinguishable
- Each question should be self-contained and unambiguous
- Do NOT include numbering prefixes like "1." or "Q:" in the question text

Return ONLY a valid JSON object (no markdown, no explanation, no code fences) in this exact format:
{
  "questions": [
    {
      "questionText": "string — the question text",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string — must exactly match one of the options",
      "marks": ${marksPerQuestion}
    }
  ]
}

Generate exactly ${count} questions. No more, no less.`;
}

function parseAIResponse(text) {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
  }

  // Try to extract JSON object if there's surrounding text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in AI response");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  if (!parsed.questions || !Array.isArray(parsed.questions)) {
    throw new Error("AI response missing 'questions' array");
  }

  return parsed.questions;
}

function validateQuestion(q, index) {
  const errors = [];

  if (!q.questionText || typeof q.questionText !== "string" || q.questionText.trim().length === 0) {
    errors.push(`Question ${index + 1}: missing questionText`);
  }

  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push(`Question ${index + 1}: must have at least 2 options`);
    return errors; // can't validate further without options
  }

  if (q.options.length !== 4) {
    errors.push(`Question ${index + 1}: must have exactly 4 options (found ${q.options.length})`);
  }

  const emptyOptions = q.options.filter((o) => !o || String(o).trim().length === 0);
  if (emptyOptions.length > 0) {
    errors.push(`Question ${index + 1}: contains empty option(s)`);
  }

  const uniqueOptions = new Set(q.options.map((o) => String(o).trim().toLowerCase()));
  if (uniqueOptions.size < q.options.length) {
    errors.push(`Question ${index + 1}: contains duplicate options`);
  }

  if (!q.correctAnswer || typeof q.correctAnswer !== "string" || q.correctAnswer.trim().length === 0) {
    errors.push(`Question ${index + 1}: missing correctAnswer`);
  } else {
    const normalizedAnswer = q.correctAnswer.trim();
    const optionMatches = q.options.some((o) => String(o).trim() === normalizedAnswer);
    if (!optionMatches) {
      errors.push(`Question ${index + 1}: correctAnswer "${q.correctAnswer}" does not match any option`);
    }
  }

  const marks = Number(q.marks);
  if (isNaN(marks) || marks <= 0) {
    errors.push(`Question ${index + 1}: marks must be a positive number`);
  }

  return errors;
}

function deduplicateQuestions(questions) {
  const seen = new Set();
  return questions.filter((q) => {
    const key = q.questionText.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

exports.generateQuestions = asyncHandler(async (req, res) => {
  const { topic, count, difficulty, marksPerQuestion } = req.body;

  // --- Input validation ---
  if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
    const error = new Error("Exam title/topic is required");
    error.statusCode = 400;
    throw error;
  }

  const questionCount = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50);
  const difficultyLevel = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "medium";
  const marks = Math.max(parseInt(marksPerQuestion, 10) || 5, 1);

  // --- AI provider configuration ---
  const apiKey = process.env.OPENAI_API_KEY;
  const apiBase = process.env.OPENAI_API_BASE || "https://api.openai.com/v1";
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    const error = new Error(
      "AI question generation is not configured. Please set the OPENAI_API_KEY environment variable."
    );
    error.statusCode = 503;
    throw error;
  }

  // --- Call AI API ---
  const prompt = buildPrompt(topic.trim(), questionCount, difficultyLevel, marks);

  let aiResponse;
  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert exam question writer. You respond ONLY with valid JSON — no markdown, no explanation, no code fences.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(`[AI] API error ${response.status}:`, errorBody);

      if (response.status === 401) {
        const error = new Error("Invalid AI API key. Please check the OPENAI_API_KEY configuration.");
        error.statusCode = 503;
        throw error;
      }
      if (response.status === 429) {
        const error = new Error("AI rate limit exceeded. Please try again in a moment.");
        error.statusCode = 429;
        throw error;
      }
      const error = new Error("AI service is temporarily unavailable. Please try again later.");
      error.statusCode = 502;
      throw error;
    }

    aiResponse = await response.json();
  } catch (err) {
    if (err.statusCode) throw err; // re-throw our own errors
    console.error("[AI] Network error:", err.message);
    const error = new Error("Failed to connect to AI service. Please check your network and try again.");
    error.statusCode = 502;
    throw error;
  }

  // --- Parse AI response ---
  const content = aiResponse?.choices?.[0]?.message?.content;
  if (!content) {
    const error = new Error("AI returned an empty response. Please try again.");
    error.statusCode = 502;
    throw error;
  }

  let rawQuestions;
  try {
    rawQuestions = parseAIResponse(content);
  } catch (err) {
    console.error("[AI] Failed to parse response:", err.message, "\nContent:", content.slice(0, 500));
    const error = new Error("AI returned an invalid response format. Please try again.");
    error.statusCode = 502;
    throw error;
  }

  // --- Validate each question ---
  const allErrors = [];
  const validQuestions = [];

  rawQuestions.forEach((q, i) => {
    const errors = validateQuestion(q, i);
    if (errors.length > 0) {
      allErrors.push(...errors);
    } else {
      validQuestions.push({
        questionText: q.questionText.trim(),
        type: "mcq",
        options: q.options.map((o) => String(o).trim()),
        correctAnswer: q.correctAnswer.trim(),
        marks: Number(q.marks) || marks,
      });
    }
  });

  // Deduplicate
  const uniqueQuestions = deduplicateQuestions(validQuestions);

  if (uniqueQuestions.length === 0) {
    const error = new Error(
      allErrors.length > 0
        ? `All generated questions were invalid: ${allErrors.slice(0, 3).join("; ")}`
        : "AI returned no valid questions. Please try again."
    );
    error.statusCode = 422;
    throw error;
  }

  // --- Return results ---
  res.json({
    questions: uniqueQuestions,
    generated: uniqueQuestions.length,
    requested: questionCount,
    validationErrors: allErrors.length > 0 ? allErrors : undefined,
    topic: topic.trim(),
    difficulty: difficultyLevel,
  });
});
