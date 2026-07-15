const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/* =========================================================
   ACCESS TOKEN (JWT — short-lived, sent as a normal Bearer token)
========================================================= */
const generateAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.ACCESS_TOKEN_EXPIRES_IN ||
        process.env.JWT_EXPIRES_IN ||
        "15m",
    }
  );

/* =========================================================
   REFRESH TOKEN (opaque random string — never a JWT)
   The raw value is only ever given to the client (httpOnly cookie).
   Only its SHA-256 hash is persisted, in the Session collection.
========================================================= */
const generateOpaqueToken = () => crypto.randomBytes(48).toString("hex");

const hashToken = (value) =>
  crypto.createHash("sha256").update(String(value)).digest("hex");

const REMEMBER_ME_MS = parseDuration(
  process.env.REFRESH_TOKEN_EXPIRES_IN_REMEMBER || "30d"
);
const DEFAULT_REFRESH_MS = parseDuration(
  process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"
);

function parseDuration(str) {
  const match = /^(\d+)([smhd])$/.exec(String(str).trim());
  if (!match) return 7 * 24 * 60 * 60 * 1000; // fallback: 7 days
  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return value * multipliers[unit];
}

const refreshTokenTTL = (rememberMe) =>
  rememberMe ? REMEMBER_ME_MS : DEFAULT_REFRESH_MS;

module.exports = {
  generateAccessToken,
  generateOpaqueToken,
  hashToken,
  refreshTokenTTL,
};
