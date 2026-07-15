const mongoose = require("mongoose");

/* =========================
   PROCTOR SESSION
   One document per exam attempt's proctoring session. Tracks device
   readiness and the overall session lifecycle. Face-detection-specific
   fields are intentionally NOT included yet — this is Phase 1
   (foundation) only.
========================= */
const proctorSessionSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Optional link to the exam attempt this session belongs to.
    result: { type: mongoose.Schema.Types.ObjectId, ref: "Result", default: null },

    status: {
      type: String,
      enum: ["active", "ended"],
      default: "active",
    },

    cameraStatus: {
      type: String,
      enum: ["pending", "granted", "denied", "unavailable"],
      default: "pending",
    },
    microphoneStatus: {
      type: String,
      enum: ["pending", "granted", "denied", "unavailable"],
      default: "pending",
    },

    browserInfo: { type: String, default: "" },
    browserSupported: { type: Boolean, default: true },

    // Running tally maintained by proctorController.logEvent — avoids
    // re-scanning the whole ProctorLog history on every request.
    violationCount: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 },
    flagged: { type: Boolean, default: false },
    flaggedAt: { type: Date, default: null },

    // Per-eventType violation counts (e.g. { TAB_SWITCH: 3, PHONE_DETECTED: 1 })
    // — powers threshold-based auto-terminate rules like "maxTabSwitches"
    // without re-scanning ProctorLog history for a count on every event.
    eventCounts: {
      type: Map,
      of: Number,
      default: {},
    },

    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Every proctoring query in the codebase filters by exam — the live
// monitoring session list, the violation-count aggregates for instructor
// stats, the results-page violation lookup. `student` as the second field
// also makes a future exam+student lookup (e.g. "this student's session
// for this exam") an index-covered query rather than a full scan.
proctorSessionSchema.index({ exam: 1, student: 1 });

module.exports = mongoose.model("ProctorSession", proctorSessionSchema);
