const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const {
  register,
  googleAuth,
  verifyEmail,
  resendOtp,
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateProfile,
  getSessions,
  revokeSession,
  requestEmailChange,
  resendEmailChangeOtp,
  confirmEmailChange,
  uploadProfilePhoto,
  deleteProfilePhoto,
  getActivity,
  getExamStatistics,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireCsrf } = require("../utils/csrf");
const {
  validate,
  registerValidation,
  googleAuthValidation,
  loginValidation,
  verifyEmailValidation,
  resendOtpValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  requestEmailChangeValidation,
  confirmEmailChangeValidation,
  updateStudentProfileValidation,
  uploadProfilePhotoValidation,
} = require("../middleware/validators");

/* =========================================================
   Extra, tighter rate limits for the most sensitive/abusable endpoints,
   layered on top of the general authLimiter already applied to all of
   /api/auth in server.js.
========================================================= */
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many OTP requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many password reset requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const emailChangeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

/* =========================================================
   Registration / Email verification
========================================================= */
router.post("/register", registerValidation, validate, register);
router.post("/verify-email", verifyEmailValidation, validate, verifyEmail);
router.post("/resend-otp", otpLimiter, resendOtpValidation, validate, resendOtp);

/* =========================================================
   Google Sign-In (Continue with Google button + One Tap)
   Shares the general authLimiter (applied to all of /api/auth in
   server.js); a dedicated tighter limiter isn't warranted since this
   endpoint's real cost is a single verifyIdToken call against Google,
   not a password-guessing surface.
========================================================= */
router.post("/google", googleAuthValidation, validate, googleAuth);

/* =========================================================
   Login / Session lifecycle
========================================================= */
router.post("/login", loginValidation, validate, login);
router.post("/refresh", requireCsrf, refresh);
router.post("/logout", requireCsrf, logout);
router.post("/logout-all", protect, logoutAll);

/* =========================================================
   Forgot / Reset password
========================================================= */
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordValidation,
  validate,
  forgotPassword
);
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  resetPassword
);

/* =========================================================
   Change password (logged in)
========================================================= */
router.post(
  "/change-password",
  protect,
  changePasswordValidation,
  validate,
  changePassword
);

/* =========================================================
   Profile
========================================================= */
router.get("/me", protect, getMe);
router.put("/profile", protect, updateStudentProfileValidation, validate, updateProfile);

const photoUploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many photo upload attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/profile/photo",
  protect,
  photoUploadLimiter,
  uploadProfilePhotoValidation,
  validate,
  uploadProfilePhoto
);
router.delete("/profile/photo", protect, deleteProfilePhoto);

router.get("/activity", protect, getActivity);
router.get("/exam-statistics", protect, getExamStatistics);

/* =========================================================
   Email change (re-verified against the NEW address before it takes effect)
========================================================= */
router.post(
  "/change-email/request",
  protect,
  emailChangeLimiter,
  requestEmailChangeValidation,
  validate,
  requestEmailChange
);
router.post(
  "/change-email/resend",
  protect,
  emailChangeLimiter,
  resendEmailChangeOtp
);
router.post(
  "/change-email/confirm",
  protect,
  confirmEmailChangeValidation,
  validate,
  confirmEmailChange
);

/* =========================================================
   Active sessions / logged-in devices
========================================================= */
router.get("/sessions", protect, getSessions);
router.delete("/sessions/:id", protect, revokeSession);

module.exports = router;
