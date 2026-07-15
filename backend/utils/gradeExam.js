/* =========================================================
   GRADING HELPER
   Pure function: given an exam + the answers collected so far,
   returns the fully graded breakdown. Used by a normal student-initiated
   submit, the lazy server-side auto-finalize path (window expired before
   the student submitted), and an examiner-initiated force-terminate.
========================================================= */

// MSQ answers are stored as a comma-joined string of selected option
// labels (the `selectedAnswer`/`correctAnswer` schema fields are plain
// Strings, so this avoids a schema migration). Comparison is order- and
// whitespace-independent — the student can select the same set of options
// in any order and still be marked correct.
function normalizeMultiAnswer(value) {
  return String(value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean)
    .sort()
    .join(",");
}

function gradeExam(exam, existingAnswers) {
  let obtainedMarks = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  const negativeMarkingEnabled = Boolean(exam.negativeMarking?.enabled);
  const marksPerWrong = Math.max(0, Number(exam.negativeMarking?.marksPerWrong) || 0);

  const gradedAnswers = exam.questions.map((question) => {
    const given = existingAnswers.find(
      (a) => a.question.toString() === question._id.toString()
    );
    const selectedAnswer = given?.selectedAnswer || "";

    if (!selectedAnswer) {
      unattemptedCount += 1;
      return {
        question: question._id,
        selectedAnswer: "",
        isCorrect: false,
        marksAwarded: 0,
      };
    }

    // MCQ and True/False are auto-graded (single correct answer, exact
    // match). MSQ is auto-graded as an order-independent set match — all
    // correct options selected, no incorrect ones. Descriptive/coding
    // answers are recorded but left at 0 marks pending manual grading
    // (future module). Negative marking only applies to attempted,
    // wrong, auto-graded answers — never to unattempted or manually
    // graded ones.
    if (question.type === "mcq" || question.type === "truefalse") {
      const isCorrect = selectedAnswer === question.correctAnswer;
      const marksAwarded = isCorrect
        ? question.marks
        : negativeMarkingEnabled
        ? -marksPerWrong
        : 0;

      if (isCorrect) correctCount += 1;
      else wrongCount += 1;

      obtainedMarks += marksAwarded;

      return { question: question._id, selectedAnswer, isCorrect, marksAwarded };
    }

    if (question.type === "msq") {
      const isCorrect =
        normalizeMultiAnswer(selectedAnswer) === normalizeMultiAnswer(question.correctAnswer);
      const marksAwarded = isCorrect
        ? question.marks
        : negativeMarkingEnabled
        ? -marksPerWrong
        : 0;

      if (isCorrect) correctCount += 1;
      else wrongCount += 1;

      obtainedMarks += marksAwarded;

      return { question: question._id, selectedAnswer, isCorrect, marksAwarded };
    }

    return {
      question: question._id,
      selectedAnswer,
      isCorrect: false,
      marksAwarded: 0,
    };
  });

  // Deductions can make the running total negative, but a final score
  // below zero isn't meaningful — floor the reported total at 0 while
  // leaving the per-question breakdown showing the actual deduction.
  obtainedMarks = Math.max(0, obtainedMarks);

  const percentage =
    exam.totalMarks > 0
      ? Math.round((obtainedMarks / exam.totalMarks) * 10000) / 100
      : 0;

  return {
    gradedAnswers,
    obtainedMarks,
    correctCount,
    wrongCount,
    unattemptedCount,
    percentage,
    passed: obtainedMarks >= exam.passingMarks,
  };
}

module.exports = { gradeExam };
