// Standard percentage -> letter grade bands. Pure function, no DB access,
// so it's trivial to unit test and to retune later if a school wants a
// different scale.
function computeGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

module.exports = { computeGrade };
