const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // Not required for Google-only accounts (no password was ever set).
    // Local registration/login still validates this at the controller
    // layer via express-validator, same as before.
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor"],
      default: "student",
    },

    /* =========================================================
       GOOGLE SIGN-IN
       googleId is the stable Google account subject ("sub" claim) from a
       verified ID token — never trust a client-supplied id. `sparse: true`
       lets many users have `googleId: null` while still enforcing
       uniqueness for the ones who do have it (a plain unique index would
       reject every second user with no googleId as a "duplicate null").
       A user can have both a password AND a googleId (local account that
       later linked Google, or vice versa) — authProviders tracks which
       sign-in methods are actually usable for this account, purely for
       UI/profile display, not for authorization decisions.
    ========================================================= */
    googleId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
      select: false,
    },
    authProviders: {
      type: [String],
      enum: ["local", "google"],
      default: ["local"],
    },
    // Optional profile fields — used to compute a real "profile completion" %
    // instead of a hardcoded number.
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },

    /* =========================================================
       STUDENT PROFILE
    ========================================================= */
    avatarUrl: { type: String, default: null },
    enrollmentNumber: { type: String, default: "" },
    collegeName: { type: String, default: "" },
    branch: { type: String, default: "" },
    semester: { type: String, default: "" },
    rollNumber: { type: String, default: "" },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say", ""],
      default: "",
    },
    dateOfBirth: { type: Date, default: null },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    lastLoginAt: { type: Date, default: null },

    /* =========================================================
       EMAIL VERIFICATION (OTP)
       Defaults to `true` so pre-existing users created before this field
       existed are never accidentally locked out. New registrations
       explicitly set this to `false` in the register controller.
    ========================================================= */
    isEmailVerified: { type: Boolean, default: true },
    emailOTPHash: { type: String, default: null, select: false },
    emailOTPExpires: { type: Date, default: null, select: false },
    otpLastSentAt: { type: Date, default: null, select: false },

    /* =========================================================
       EMAIL CHANGE (re-verification against the NEW address)
       Mirrors the registration OTP pattern: the email only actually
       changes once the OTP sent to the new address is confirmed.
    ========================================================= */
    pendingEmail: { type: String, default: null },
    pendingEmailOTPHash: { type: String, default: null, select: false },
    pendingEmailOTPExpires: { type: Date, default: null, select: false },
    pendingEmailOTPLastSentAt: { type: Date, default: null, select: false },

    /* =========================================================
       FORGOT / RESET PASSWORD
    ========================================================= */
    passwordResetTokenHash: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false },

    // Used to invalidate any access token issued before a password change,
    // even if that token hasn't expired yet.
    passwordChangedAt: { type: Date, default: null, select: false },

    /* =========================================================
       BRUTE-FORCE / ACCOUNT LOCKOUT
    ========================================================= */
    failedLoginAttempts: { type: Number, default: 0, select: false },
    lockUntil: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
