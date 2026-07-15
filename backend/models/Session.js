const mongoose = require("mongoose");

/* =========================================================
   SESSION MODEL
   One document per logged-in device/browser. Backs:
     - Refresh token rotation
     - "Logout all devices"
     - Basic device validation on refresh
     - Automatic session expiry (TTL index below)
========================================================= */
const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // SHA-256 hash of the opaque refresh token. The raw token is never
    // stored — only ever held by the client, inside an httpOnly cookie.
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    userAgent: { type: String, default: "" },
    // SHA-256 hash of the User-Agent header at creation time, used for a
    // lightweight device-validation check when the refresh token is used.
    userAgentHash: { type: String, default: "" },
    ip: { type: String, default: "" },
    rememberMe: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// TTL index: MongoDB automatically deletes the document once expiresAt has
// passed, so expired sessions never need to be manually cleaned up.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Session", sessionSchema);
