/**
 * Computes rank and percentile for one score against a cohort of scores
 * from the same exam. Pure function — takes plain numbers, no DB access —
 * so both callers (a single student's result view, and the instructor's
 * full results list) can reuse the exact same logic: the former queries
 * just the score column for the exam, the latter already has every score
 * in memory from its own listing query, so it never has to hit the
 * database again per student.
 *
 * Ranking convention: "standard competition ranking" (1224 style) — tied
 * scores share the same rank, and the next distinct rank skips ahead by
 * the number of people tied above it (e.g. two people tied for 1st are
 * both rank 1; the next student is rank 3, not rank 2).
 *
 * Percentile convention: percentage of the cohort this score is strictly
 * higher than (i.e. "you scored better than X% of students who took this
 * exam"). This is one of several valid percentile definitions — documented
 * here explicitly since the term is ambiguous across conventions. A lone
 * participant is defined as the 100th percentile.
 */
function computeRankAndPercentile(allScores, myScore) {
  const totalStudents = allScores.length;

  if (totalStudents === 0) {
    return { rank: 1, totalStudents: 0, percentile: 100 };
  }

  const rank = 1 + allScores.filter((s) => s > myScore).length;

  if (totalStudents === 1) {
    return { rank: 1, totalStudents: 1, percentile: 100 };
  }

  const scoredStrictlyBelow = allScores.filter((s) => s < myScore).length;
  const percentile = Math.round((scoredStrictlyBelow / totalStudents) * 1000) / 10; // one decimal place

  return { rank, totalStudents, percentile };
}

module.exports = { computeRankAndPercentile };
