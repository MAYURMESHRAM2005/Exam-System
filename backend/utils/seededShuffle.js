const crypto = require("crypto");

// Small, fast seeded PRNG (mulberry32). Deterministic: same seed always
// produces the same sequence, which is what makes the shuffle stable
// across page reloads/resumes without having to persist the shuffled
// order anywhere — it's recomputed identically every time from the same
// (examId, studentId[, questionId]) inputs.
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Hashes an arbitrary string down to a 32-bit int usable as a PRNG seed.
function seedFrom(str) {
  const hash = crypto.createHash("sha256").update(str).digest();
  return hash.readUInt32BE(0);
}

// Fisher-Yates using a seeded PRNG instead of Math.random(), so the same
// seed always yields the same permutation.
function seededShuffle(array, seedString) {
  const rng = mulberry32(seedFrom(seedString));
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

module.exports = { seededShuffle };
