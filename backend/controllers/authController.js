const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Session = require("../models/Session");
const ActivityLog = require("../models/ActivityLog");
const Result = require("../models/Result");
const ProctorSession = require("../models/ProctorSession");
const asyncHandler = require("../utils/asyncHandler");
const { sendEmail } = require("../utils/email");
const { generateOTP, hashOTP } = require("../utils/otp");
const { saveAvatarImage, deleteAvatarImage, AvatarValidationError } = require("../utils/saveAvatar");
const { escapeRegex, parsePagination } = require("../utils/pagination");
const {
  generateAccessToken,
  generateOpaqueToken,
  hashToken,
  refreshTokenTTL,
} = require("../utils/tokens");
const { generateCsrfToken, setCsrfCookie, clearCsrfCookie } = require("../utils/csrf");
const { logActivity } = require("../utils/activityLog");
const { notify } = require("../services/notificationService");

/* =========================================================
   CONFIG CONSTANTS
========================================================= */
const OTP_EXPIRES_MS = 10 * 60 * 1000; // 10 minutes
const OTP_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const RESET_TOKEN_EXPIRES_MS = 30 * 60 * 1000; // 30 minutes
const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_COOKIE_NAME = "refreshToken";

// Lazily constructed so a missing GOOGLE_CLIENT_ID only breaks the Google
// sign-in endpoint itself (fails fast, with a clear error) rather than
// crashing the whole process at import time before dotenv has even run
// in every possible startup order.
let googleClient = null;
const getGoogleClient = () => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    const error = new Error(
      "Google sign-in is not configured on this server (missing GOOGLE_CLIENT_ID)."
    );
    error.statusCode = 503;
    throw error;
  }
  if (!googleClient) {
    googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }
  return googleClient;
};

/* =========================================================
   HELPERS
========================================================= */
const hashUserAgent = (req) =>
  crypto
    .createHash("sha256")
    .update(req.headers["user-agent"] || "unknown")
    .digest("hex");

const refreshCookieOptions = (maxAgeMs) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: maxAgeMs,
});

// Creates a Session document + returns the raw refresh token to be set as a cookie.
const createSession = async (user, req, rememberMe) => {
  const rawToken = generateOpaqueToken();
  const ttlMs = refreshTokenTTL(rememberMe);

  await Session.create({
    user: user._id,
    tokenHash: hashToken(rawToken),
    userAgent: req.headers["user-agent"] || "",
    userAgentHash: hashUserAgent(req),
    ip: req.ip,
    rememberMe: Boolean(rememberMe),
    expiresAt: new Date(Date.now() + ttlMs),
  });

  return { rawToken, ttlMs };
};

const setRefreshCookie = (res, rawToken, ttlMs) => {
  res.cookie(REFRESH_COOKIE_NAME, rawToken, refreshCookieOptions(ttlMs));
  // Double-submit CSRF token, scoped to the same lifetime as the refresh
  // cookie it protects (covers /refresh and /logout, which authenticate
  // purely off the cookie).
  setCsrfCookie(res, generateCsrfToken(), ttlMs);
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });
  clearCsrfCookie(res);
};

const calculateProfileCompletion = (user) => {
  const fields = [
    user.name,
    user.email,
    user.phone,
    user.bio,
    user.avatarUrl,
    user.enrollmentNumber,
    user.collegeName,
    user.branch,
    user.semester,
    user.rollNumber,
    user.gender,
    user.dateOfBirth,
    user.address,
    user.city,
    user.state,
    user.country,
  ];
  const filled = fields.filter((f) => f && String(f).trim().length > 0).length;
  return Math.round((filled / fields.length) * 100);
};

/* =========================================================
   REGISTER
   Google Sign-In replaces email-OTP as the account-verification
   mechanism (see googleAuth below), so local registration no longer
   gates on a mailed code: the account is created and the user is
   logged in immediately, matching the Google flow's UX. The
   verify-email/resend-otp endpoints below are kept, unused by this
   flow, purely so any account created under the old flow with a
   still-pending OTP isn't left stranded.
========================================================= */
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const allowedPublicRoles = ["student", "instructor"];
  const finalRole = allowedPublicRoles.includes(role) ? role : "student";

  const userExists = await User.findOne({ email });
  if (userExists) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: finalRole,
    isEmailVerified: true,
    authProviders: ["local"],
  });

  const token = generateAccessToken(user);
  const { rawToken, ttlMs } = await createSession(user, req, false);
  setRefreshCookie(res, rawToken, ttlMs);

  logActivity(user._id, "register", "Account created.");
  sendEmail({
    to: user.email,
    subject: "Welcome to ExamSecure AI",
    text: `Hi ${user.name}, your ExamSecure AI account has been created successfully.`,
    html: `<p>Hi ${user.name},</p><p>Your ExamSecure AI account has been created successfully.</p>`,
  }).catch(() => {}); // best-effort — never blocks registration

  res.status(201).json({ token, role: user.role, name: user.name });
});

/* =========================================================
   VERIFY EMAIL (OTP)
   On success, logs the user in immediately (issues tokens).
========================================================= */
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email }).select(
    "+emailOTPHash +emailOTPExpires"
  );

  if (!user) {
    const error = new Error("Invalid email or OTP");
    error.statusCode = 400;
    throw error;
  }

  if (user.isEmailVerified) {
    const error = new Error("Email is already verified");
    error.statusCode = 400;
    throw error;
  }

  if (!user.emailOTPHash || !user.emailOTPExpires || user.emailOTPExpires < new Date()) {
    const error = new Error("OTP has expired. Please request a new one.");
    error.statusCode = 400;
    throw error;
  }

  if (hashOTP(otp) !== user.emailOTPHash) {
    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

  user.isEmailVerified = true;
  user.emailOTPHash = null;
  user.emailOTPExpires = null;
  await user.save();

  const token = generateAccessToken(user);
  const { rawToken, ttlMs } = await createSession(user, req, false);
  setRefreshCookie(res, rawToken, ttlMs);

  res.json({ token, role: user.role, name: user.name });
});

/* =========================================================
   RESEND OTP
   Always returns a generic message so email existence can't be enumerated.
========================================================= */
exports.resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const genericMessage =
    "If an account with that email exists and isn't verified yet, a new code has been sent.";

  const user = await User.findOne({ email }).select(
    "+emailOTPHash +emailOTPExpires +otpLastSentAt"
  );

  if (!user || user.isEmailVerified) {
    return res.json({ message: genericMessage });
  }

  if (
    user.otpLastSentAt &&
    Date.now() - user.otpLastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS
  ) {
    const error = new Error(
      "Please wait a moment before requesting another code."
    );
    error.statusCode = 429;
    throw error;
  }

  const otp = generateOTP();
  user.emailOTPHash = hashOTP(otp);
  user.emailOTPExpires = new Date(Date.now() + OTP_EXPIRES_MS);
  user.otpLastSentAt = new Date();
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your new ExamSecure AI verification code",
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });

  res.json({ message: genericMessage });
});

/* =========================================================
   GOOGLE SIGN-IN (Continue with Google button + One Tap)
   Both send the same thing to the backend: a signed Google ID token
   ("credential") obtained client-side via Google Identity Services.
   The server independently verifies that token against Google's public
   keys — the client can't forge an email/identity this way, unlike a
   plain "trust me, this is the user" request body.

   Behavior:
     - googleId already on file            -> log that user in
     - no googleId, but email matches an
       existing (local) account            -> link Google to that
                                               account, then log in
     - no match at all                     -> auto-create a new account
========================================================= */
exports.googleAuth = asyncHandler(async (req, res) => {
  const { credential, role, rememberMe } = req.body;

  if (!credential) {
    const error = new Error("Missing Google credential");
    error.statusCode = 400;
    throw error;
  }

  const client = getGoogleClient();

  let payload;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    const error = new Error("Invalid or expired Google credential");
    error.statusCode = 401;
    throw error;
  }

  if (!payload || !payload.email) {
    const error = new Error("Google did not return an email address");
    error.statusCode = 401;
    throw error;
  }

  // Google's own attestation that the email is verified — this is exactly
  // the trust signal the OTP flow used to establish manually.
  if (!payload.email_verified) {
    const error = new Error("Your Google email address is not verified");
    error.statusCode = 401;
    throw error;
  }

  const allowedPublicRoles = ["student", "instructor"];
  const requestedRole = allowedPublicRoles.includes(role) ? role : "student";

  let user = await User.findOne({ googleId: payload.sub }).select(
    "+googleId"
  );
  let isNewUser = false;

  if (!user) {
    user = await User.findOne({ email: payload.email }).select("+googleId");

    if (user) {
      // Link: an existing local account signed in with Google for the
      // first time. Google has already proven ownership of this email,
      // so linking is safe without any extra confirmation step.
      user.googleId = payload.sub;
      user.isEmailVerified = true;
      if (!user.authProviders.includes("google")) {
        user.authProviders.push("google");
      }
      if (!user.avatarUrl && payload.picture) {
        user.avatarUrl = payload.picture;
      }
      await user.save();
    } else {
      user = await User.create({
        name: payload.name || payload.email.split("@")[0],
        email: payload.email,
        googleId: payload.sub,
        role: requestedRole,
        isEmailVerified: true,
        authProviders: ["google"],
        avatarUrl: payload.picture || null,
      });
      isNewUser = true;
    }
  }

  const token = generateAccessToken(user);
  const { rawToken, ttlMs } = await createSession(user, req, Boolean(rememberMe));
  setRefreshCookie(res, rawToken, ttlMs);

  const previousLoginAt = user.lastLoginAt;
  user.lastLoginAt = new Date();
  await user.save();

  logActivity(
    user._id,
    isNewUser ? "register" : "login",
    isNewUser ? "Account created via Google." : "Logged in with Google."
  );

  if (isNewUser) {
    sendEmail({
      to: user.email,
      subject: "Welcome to ExamSecure AI",
      text: `Hi ${user.name}, your ExamSecure AI account has been created via Google Sign-In.`,
      html: `<p>Hi ${user.name},</p><p>Your ExamSecure AI account has been created via Google Sign-In.</p>`,
    }).catch(() => {});
  } else if (previousLoginAt) {
    sendEmail({
      to: user.email,
      subject: "New login to your ExamSecure AI account",
      text: `Hi ${user.name}, we noticed a new login (via Google) to your account just now. If this wasn't you, please contact support immediately.`,
      html: `<p>Hi ${user.name},</p><p>We noticed a new login (via Google) to your account just now. If this wasn't you, please contact support immediately.</p>`,
    }).catch(() => {});
  }

  res.json({ token, role: user.role, name: user.name, isNewUser });
});

/* =========================================================
   LOGIN
   Account lockout after repeated failures + email-verification gate +
   refresh-token session creation.
========================================================= */
exports.login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email }).select(
    "+password +failedLoginAttempts +lockUntil"
  );

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  if (user.lockUntil && user.lockUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockUntil - new Date()) / 60000);
    const error = new Error(
      `Account temporarily locked due to too many failed login attempts. Try again in ${minutesLeft} minute(s).`
    );
    error.statusCode = 423;
    throw error;
  }

  if (!user.password) {
    // Google-only account (created/linked via Google Sign-In, no password
    // was ever set) — bcrypt.compare would throw on an undefined hash.
    const error = new Error(
      "This account uses Google Sign-In. Please continue with Google instead."
    );
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    if (user.failedLoginAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + ACCOUNT_LOCK_MS);
      user.failedLoginAttempts = 0;
    }
    await user.save();

    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  if (!user.isEmailVerified) {
    return res.status(403).json({
      message: "Please verify your email before logging in.",
      emailNotVerified: true,
      email: user.email,
    });
  }

  const token = generateAccessToken(user);
  const { rawToken, ttlMs } = await createSession(user, req, Boolean(rememberMe));
  setRefreshCookie(res, rawToken, ttlMs);

  const previousLoginAt = user.lastLoginAt;
  user.lastLoginAt = new Date();
  await user.save();

  logActivity(user._id, "login", "Logged in.", {
    userAgent: req.headers["user-agent"] || "",
    ip: req.ip,
  });

  // Best-effort login alert — never blocks the login response, and
  // deliberately skipped on someone's very first-ever login (nothing to
  // compare "is this new" against yet, and it'd be a redundant welcome-ish
  // email right after they just verified their address via OTP anyway).
  if (previousLoginAt) {
    sendEmail({
      to: user.email,
      subject: "New login to your ExamSecure AI account",
      text: `Hi ${user.name}, we noticed a new login to your account just now. If this wasn't you, please change your password immediately.`,
      html: `<p>Hi ${user.name},</p><p>We noticed a new login to your account just now. If this wasn't you, please change your password immediately.</p>`,
    }).catch(() => {});
  }

  res.json({ token, role: user.role, name: user.name });
});

/* =========================================================
   REFRESH ACCESS TOKEN
   Reads the httpOnly refresh cookie, validates + rotates it, and issues a
   fresh short-lived access token. Includes a device-mismatch check.
========================================================= */
exports.refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (!rawToken) {
    const error = new Error("No refresh token provided. Please log in again.");
    error.statusCode = 401;
    throw error;
  }

  const tokenHash = hashToken(rawToken);
  const session = await Session.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    clearRefreshCookie(res);
    const error = new Error("Session expired or invalid. Please log in again.");
    error.statusCode = 401;
    throw error;
  }

  // Device validation: the User-Agent that refreshes must match the one
  // that created the session.
  if (session.userAgentHash && session.userAgentHash !== hashUserAgent(req)) {
    session.revokedAt = new Date();
    await session.save();
    clearRefreshCookie(res);
    const error = new Error(
      "This session was issued to a different device/browser. Please log in again."
    );
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(session.user);
  if (!user) {
    session.revokedAt = new Date();
    await session.save();
    clearRefreshCookie(res);
    const error = new Error("User no longer exists.");
    error.statusCode = 401;
    throw error;
  }

  // Rotate: revoke the old session, issue a brand new one.
  session.revokedAt = new Date();
  await session.save();

  const { rawToken: newRawToken, ttlMs } = await createSession(
    user,
    req,
    session.rememberMe
  );
  setRefreshCookie(res, newRawToken, ttlMs);

  const token = generateAccessToken(user);
  res.json({ token, role: user.role, name: user.name });
});

/* =========================================================
   LOGOUT (current device only)
========================================================= */
exports.logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];

  if (rawToken) {
    await Session.updateOne(
      { tokenHash: hashToken(rawToken), revokedAt: null },
      { revokedAt: new Date() }
    );
  }

  clearRefreshCookie(res);
  res.json({ message: "Logged out" });
});

/* =========================================================
   LOGOUT ALL DEVICES (requires a valid access token)
========================================================= */
exports.logoutAll = asyncHandler(async (req, res) => {
  await Session.updateMany(
    { user: req.user._id, revokedAt: null },
    { revokedAt: new Date() }
  );

  clearRefreshCookie(res);
  res.json({ message: "Logged out from all devices" });
});

/* =========================================================
   FORGOT PASSWORD
   Always returns a generic message — never reveals whether the email exists.
========================================================= */
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const genericMessage =
    "If an account with that email exists, a password reset code has been sent.";

  const user = await User.findOne({ email });

  if (user) {
    const rawToken = generateOpaqueToken();
    user.passwordResetTokenHash = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS);
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Reset your ExamSecure AI password",
      text: `Your password reset code is ${rawToken}. It expires in 30 minutes. If you didn't request this, you can ignore this email.`,
      html: `<p>Your password reset code is:</p><p style="font-family:monospace;font-size:14px;word-break:break-all;">${rawToken}</p><p>It expires in 30 minutes. If you didn't request this, you can ignore this email.</p>`,
    });
  }

  res.json({ message: genericMessage });
});

/* =========================================================
   RESET PASSWORD
   Consumes the reset token from forgotPassword and invalidates every
   active session for the account.
========================================================= */
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, token, newPassword } = req.body;

  const user = await User.findOne({ email }).select(
    "+passwordResetTokenHash +passwordResetExpires"
  );

  const invalidError = () => {
    const error = new Error("Invalid or expired reset code");
    error.statusCode = 400;
    return error;
  };

  if (!user || !user.passwordResetTokenHash || !user.passwordResetExpires) {
    throw invalidError();
  }

  if (user.passwordResetExpires < new Date()) {
    throw invalidError();
  }

  if (hashToken(token) !== user.passwordResetTokenHash) {
    throw invalidError();
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.passwordResetTokenHash = null;
  user.passwordResetExpires = null;
  user.passwordChangedAt = new Date();
  await user.save();

  await Session.updateMany(
    { user: user._id, revokedAt: null },
    { revokedAt: new Date() }
  );

  res.json({
    message: "Password reset successful. Please log in with your new password.",
  });
});

/* =========================================================
   CHANGE PASSWORD (logged-in user)
   Invalidates every other active session, but leaves the current one
   (identified by the current refresh cookie, if present) logged in.
========================================================= */
exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  if (oldPassword === newPassword) {
    const error = new Error(
      "New password must be different from the current password"
    );
    error.statusCode = 400;
    throw error;
  }

  user.password = await bcrypt.hash(newPassword, 12);
  user.passwordChangedAt = new Date();
  await user.save();

  const currentRawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const currentHash = currentRawToken ? hashToken(currentRawToken) : null;

  await Session.updateMany(
    {
      user: user._id,
      revokedAt: null,
      ...(currentHash ? { tokenHash: { $ne: currentHash } } : {}),
    },
    { revokedAt: new Date() }
  );

  logActivity(user._id, "password_changed", "Password was changed.");
  notify({
    recipient: user._id,
    type: "password_changed",
    title: "Password changed",
    message: "Your password was just changed and all other devices were logged out.",
  });
  sendEmail({
    to: user.email,
    subject: "Your ExamSecure AI password was changed",
    text: `Hi ${user.name}, your password was just changed and all other devices were logged out. If this wasn't you, contact support immediately.`,
    html: `<p>Hi ${user.name},</p><p>Your password was just changed and all other devices were logged out. If this wasn't you, contact support immediately.</p>`,
  }).catch(() => {});

  res.json({ message: "Password updated successfully. Other devices have been logged out." });
});

/* =========================================================
   LIST ACTIVE SESSIONS (logged-in devices)
   Shows every non-revoked, non-expired session for the current user,
   flagging which one belongs to the request making the call.
========================================================= */
exports.getSessions = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const currentHash = rawToken ? hashToken(rawToken) : null;

  const sessions = await Session.find({
    user: req.user._id,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  })
    .sort({ updatedAt: -1 })
    .select("userAgent ip rememberMe createdAt updatedAt expiresAt tokenHash");

  res.json({
    sessions: sessions.map((s) => ({
      id: s._id,
      userAgent: s.userAgent || "Unknown device",
      ip: s.ip || "",
      rememberMe: s.rememberMe,
      createdAt: s.createdAt,
      lastActiveAt: s.updatedAt,
      expiresAt: s.expiresAt,
      isCurrent: currentHash ? s.tokenHash === currentHash : false,
    })),
  });
});

/* =========================================================
   REVOKE A SINGLE SESSION (log out one specific device)
========================================================= */
exports.revokeSession = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const session = await Session.findOne({ _id: id, user: req.user._id });
  if (!session || session.revokedAt) {
    const error = new Error("Session not found");
    error.statusCode = 404;
    throw error;
  }

  session.revokedAt = new Date();
  await session.save();

  // If the caller just revoked their own current session, clear the cookie too.
  const rawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  if (rawToken && hashToken(rawToken) === session.tokenHash) {
    clearRefreshCookie(res);
  }

  res.json({ message: "Session revoked" });
});

/* =========================================================
   REQUEST EMAIL CHANGE
   Requires the current password to prevent a hijacked session from
   silently redirecting account-recovery emails to an attacker's address.
   Sends an OTP to the NEW address to prove ownership before anything
   actually changes.
========================================================= */
exports.requestEmailChange = asyncHandler(async (req, res) => {
  const { newEmail, password } = req.body;

  const user = await User.findById(req.user._id).select(
    "+password +pendingEmailOTPHash +pendingEmailOTPExpires +pendingEmailOTPLastSentAt"
  );
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Incorrect password");
    error.statusCode = 400;
    throw error;
  }

  if (newEmail === user.email) {
    const error = new Error("That's already your current email address");
    error.statusCode = 400;
    throw error;
  }

  const emailTaken = await User.findOne({ email: newEmail });
  if (emailTaken) {
    const error = new Error("That email address is already in use");
    error.statusCode = 400;
    throw error;
  }

  if (
    user.pendingEmailOTPLastSentAt &&
    Date.now() - user.pendingEmailOTPLastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS
  ) {
    const error = new Error(
      "Please wait a moment before requesting another code."
    );
    error.statusCode = 429;
    throw error;
  }

  const otp = generateOTP();
  user.pendingEmail = newEmail;
  user.pendingEmailOTPHash = hashOTP(otp);
  user.pendingEmailOTPExpires = new Date(Date.now() + OTP_EXPIRES_MS);
  user.pendingEmailOTPLastSentAt = new Date();
  await user.save();

  await sendEmail({
    to: newEmail,
    subject: "Confirm your new ExamSecure AI email address",
    text: `Your verification code is ${otp}. It expires in 10 minutes. Enter it in ExamSecure AI to confirm this email change.`,
    html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes. Enter it in ExamSecure AI to confirm this email change.</p>`,
  });

  res.json({
    message: `A verification code was sent to ${newEmail}.`,
    pendingEmail: newEmail,
  });
});

/* =========================================================
   RESEND EMAIL-CHANGE OTP
========================================================= */
exports.resendEmailChangeOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "+pendingEmailOTPHash +pendingEmailOTPExpires +pendingEmailOTPLastSentAt"
  );
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.pendingEmail) {
    const error = new Error("No email change is currently pending");
    error.statusCode = 400;
    throw error;
  }

  if (
    user.pendingEmailOTPLastSentAt &&
    Date.now() - user.pendingEmailOTPLastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS
  ) {
    const error = new Error(
      "Please wait a moment before requesting another code."
    );
    error.statusCode = 429;
    throw error;
  }

  const otp = generateOTP();
  user.pendingEmailOTPHash = hashOTP(otp);
  user.pendingEmailOTPExpires = new Date(Date.now() + OTP_EXPIRES_MS);
  user.pendingEmailOTPLastSentAt = new Date();
  await user.save();

  await sendEmail({
    to: user.pendingEmail,
    subject: "Your new ExamSecure AI verification code",
    text: `Your verification code is ${otp}. It expires in 10 minutes.`,
    html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });

  res.json({ message: `A new verification code was sent to ${user.pendingEmail}.` });
});

/* =========================================================
   CONFIRM EMAIL CHANGE
   On success, the email actually changes and every other active
   session is revoked (email is a security-sensitive identifier used
   for login and account recovery).
========================================================= */
exports.confirmEmailChange = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const user = await User.findById(req.user._id).select(
    "+pendingEmailOTPHash +pendingEmailOTPExpires"
  );
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.pendingEmail || !user.pendingEmailOTPHash || !user.pendingEmailOTPExpires) {
    const error = new Error("No email change is currently pending");
    error.statusCode = 400;
    throw error;
  }

  if (user.pendingEmailOTPExpires < new Date()) {
    const error = new Error("OTP has expired. Please request a new one.");
    error.statusCode = 400;
    throw error;
  }

  if (hashOTP(otp) !== user.pendingEmailOTPHash) {
    const error = new Error("Invalid OTP");
    error.statusCode = 400;
    throw error;
  }

  // Guard against a race where someone else claimed this email while the
  // OTP was pending.
  const emailTaken = await User.findOne({
    email: user.pendingEmail,
    _id: { $ne: user._id },
  });
  if (emailTaken) {
    const error = new Error(
      "That email address was just taken by another account. Please start over with a different address."
    );
    error.statusCode = 400;
    throw error;
  }

  user.email = user.pendingEmail;
  user.pendingEmail = null;
  user.pendingEmailOTPHash = null;
  user.pendingEmailOTPExpires = null;
  await user.save();

  // Revoke every other active session — keep only the one making this
  // request, mirroring the change-password behavior.
  const currentRawToken = req.cookies?.[REFRESH_COOKIE_NAME];
  const currentHash = currentRawToken ? hashToken(currentRawToken) : null;

  await Session.updateMany(
    {
      user: user._id,
      revokedAt: null,
      ...(currentHash ? { tokenHash: { $ne: currentHash } } : {}),
    },
    { revokedAt: new Date() }
  );

  res.json({
    message: "Email address updated. Other devices have been logged out.",
    email: user.email,
  });
});

/* =========================================================
   GET CURRENT USER PROFILE
========================================================= */
const formatProfileResponse = (user) => ({
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || "",
  bio: user.bio || "",
  isEmailVerified: user.isEmailVerified,
  pendingEmail: user.pendingEmail || null,
  avatarUrl: user.avatarUrl || null,
  enrollmentNumber: user.enrollmentNumber || "",
  collegeName: user.collegeName || "",
  branch: user.branch || "",
  semester: user.semester || "",
  rollNumber: user.rollNumber || "",
  gender: user.gender || "",
  dateOfBirth: user.dateOfBirth || null,
  address: user.address || "",
  city: user.city || "",
  state: user.state || "",
  country: user.country || "",
  createdAt: user.createdAt,
  lastLoginAt: user.lastLoginAt || null,
  profileCompletionPercent: calculateProfileCompletion(user),
});

/* =========================================================
   GET CURRENT USER PROFILE
========================================================= */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  res.json(formatProfileResponse(user));
});

/* =========================================================
   UPDATE PROFILE
   Email is deliberately not editable here — see requestEmailChange/
   confirmEmailChange for the OTP-verified email-change flow.
========================================================= */
const EDITABLE_PROFILE_FIELDS = [
  "name",
  "phone",
  "bio",
  "enrollmentNumber",
  "collegeName",
  "branch",
  "semester",
  "rollNumber",
  "gender",
  "dateOfBirth",
  "address",
  "city",
  "state",
  "country",
];

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  EDITABLE_PROFILE_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  await user.save();

  logActivity(user._id, "profile_updated", "Profile information was updated.");
  sendEmail({
    to: user.email,
    subject: "Your ExamSecure AI profile was updated",
    text: `Hi ${user.name}, your profile information was just updated. If this wasn't you, please secure your account immediately.`,
    html: `<p>Hi ${user.name},</p><p>Your profile information was just updated. If this wasn't you, please secure your account immediately.</p>`,
  }).catch(() => {}); // best-effort notification — never blocks the response

  res.json(formatProfileResponse(user));
});

/* =========================================================
   UPLOAD PROFILE PHOTO
   Accepts a base64 data URL (client compresses/resizes before sending —
   see saveAvatar.js for why this is a JSON-body approach rather than
   multipart/form-data, matching this codebase's existing evidence-image
   pattern rather than introducing a new upload mechanism).
========================================================= */
exports.uploadProfilePhoto = asyncHandler(async (req, res) => {
  const { image } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  let newUrl;
  try {
    newUrl = saveAvatarImage(image);
  } catch (err) {
    if (err instanceof AvatarValidationError) {
      err.statusCode = 400;
    }
    throw err;
  }

  const previousUrl = user.avatarUrl;
  user.avatarUrl = newUrl;
  await user.save();

  // Clean up the old file only after the new one is safely saved and the
  // user record updated — never delete before the replacement is confirmed.
  if (previousUrl) deleteAvatarImage(previousUrl);

  res.json(formatProfileResponse(user));
});

/* =========================================================
   DELETE PROFILE PHOTO
========================================================= */
exports.deleteProfilePhoto = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const previousUrl = user.avatarUrl;
  user.avatarUrl = null;
  await user.save();

  if (previousUrl) deleteAvatarImage(previousUrl);

  res.json(formatProfileResponse(user));
});

/* =========================================================
   GET ACTIVITY TIMELINE
   Paginated (see utils/pagination.js) — omitting page/limit returns the
   most recent 20 entries by default rather than the user's entire history.
========================================================= */
exports.getActivity = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query) || { page: 1, limit: 20, skip: 0 };

  const [entries, totalCount] = await Promise.all([
    ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    ActivityLog.countDocuments({ user: req.user._id }),
  ]);

  res.json({
    activities: entries.map((e) => ({
      id: e._id,
      type: e.type,
      message: e.message,
      createdAt: e.createdAt,
    })),
    page: pagination.page,
    totalPages: Math.max(1, Math.ceil(totalCount / pagination.limit)),
    totalCount,
  });
});

/* =========================================================
   GET EXAM STATISTICS
   Aggregated from Result + ProctorSession — no separate "statistics"
   collection to keep in sync; always computed fresh from the source of
   truth. Certificates are not tracked anywhere in this codebase (no
   certificate-issuance feature exists yet), so that field is honestly 0
   rather than a fabricated number.
========================================================= */
exports.getExamStatistics = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const [statusCounts, submittedAgg, violationsAgg] = await Promise.all([
    Result.aggregate([
      { $match: { student: studentId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Result.aggregate([
      { $match: { student: studentId, status: "submitted" } },
      {
        $group: {
          _id: null,
          avgScore: { $avg: "$percentage" },
          highestScore: { $max: "$percentage" },
          lowestScore: { $min: "$percentage" },
          passedCount: { $sum: { $cond: ["$passed", 1, 0] } },
          totalCount: { $sum: 1 },
        },
      },
    ]),
    ProctorSession.aggregate([
      { $match: { student: studentId } },
      { $group: { _id: null, total: { $sum: "$violationCount" } } },
    ]),
  ]);

  const countsByStatus = {};
  statusCounts.forEach((s) => { countsByStatus[s._id] = s.count; });

  const submitted = submittedAgg[0] || {
    avgScore: 0, highestScore: 0, lowestScore: 0, passedCount: 0, totalCount: 0,
  };

  const totalExams = statusCounts.reduce((sum, s) => sum + s.count, 0);

  res.json({
    totalExams,
    completedExams: countsByStatus["submitted"] || 0,
    ongoingExams: countsByStatus["in-progress"] || 0,
    averageScore: submitted.totalCount ? Math.round(submitted.avgScore * 10) / 10 : 0,
    highestScore: submitted.totalCount ? Math.round(submitted.highestScore * 10) / 10 : 0,
    lowestScore: submitted.totalCount ? Math.round(submitted.lowestScore * 10) / 10 : 0,
    passPercentage: submitted.totalCount
      ? Math.round((submitted.passedCount / submitted.totalCount) * 1000) / 10
      : 0,
    totalViolations: violationsAgg.length ? violationsAgg[0].total : 0,
    certificatesEarned: 0, // no certificate-issuance feature exists in this codebase yet
  });
});
