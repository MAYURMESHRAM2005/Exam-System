const crypto = require("crypto");

const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";

const generateCsrfToken = () => crypto.randomBytes(32).toString("hex");

// Readable by JS on purpose (double-submit-cookie pattern): the frontend
// reads this cookie and echoes it back as a header on cookie-only auth
// endpoints (refresh/logout). A cross-site attacker can trigger the request
// but can't read the cookie to produce a matching header, since browsers
// enforce same-origin on cookie reads via document.cookie / JS.
const csrfCookieOptions = (maxAgeMs) => ({
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  // Path is "/" (unlike the refresh cookie) so the SPA — served at "/" —
  // can actually read this cookie via document.cookie. It only needs to be
  // readable by JS, not scoped down for transmission like the refresh token.
  path: "/",
  maxAge: maxAgeMs,
});

const setCsrfCookie = (res, token, maxAgeMs) => {
  res.cookie(CSRF_COOKIE_NAME, token, csrfCookieOptions(maxAgeMs));
};

const clearCsrfCookie = (res) => {
  res.clearCookie(CSRF_COOKIE_NAME, { path: "/" });
};

// Middleware: requires header x-csrf-token to match the csrfToken cookie.
// Only needed on endpoints that authenticate purely off a cookie (no
// Authorization: Bearer check), since those are the actual CSRF surface.
const requireCsrf = (req, res, next) => {
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME];

  if (
    !cookieToken ||
    !headerToken ||
    typeof headerToken !== "string" ||
    cookieToken.length !== headerToken.length ||
    !crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))
  ) {
    const error = new Error("Invalid or missing CSRF token");
    error.statusCode = 403;
    return next(error);
  }

  next();
};

module.exports = {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  generateCsrfToken,
  setCsrfCookie,
  clearCsrfCookie,
  requireCsrf,
};
