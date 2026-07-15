const mongoose = require("mongoose");
const { PROCTOR_EVENT_TYPES } = require("../utils/proctorEventTypes");

/* =========================
   PROCTOR LOG
   Individual proctoring events tied to a session. eventType is validated
   against the shared PROCTOR_EVENT_TYPES list (utils/proctorEventTypes.js)
   so every phase (device permissions, face detection, browser security,
   ...) can add new event types in one place without a schema migration.
========================= */
const proctorLogSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProctorSession",
      required: true,
    },

    eventType: {
      type: String,
      required: true,
      enum: PROCTOR_EVENT_TYPES,
    },

    // "info" | "low" | "medium" | "high" | "critical" — see utils/violationSeverity.js
    severity: { type: String, default: "info" },
    riskPoints: { type: Number, default: 0 },

    details: { type: String, default: "" },
    // 0-100 — populated for AI-detection events that carry a model
    // confidence (object detection, face detection score); null for
    // events that don't have a meaningful confidence value (e.g. TAB_SWITCH).
    confidenceScore: { type: Number, default: null, min: 0, max: 100 },
    // Captured server-side from the request, never trusted from the
    // client — see controllers/proctorController.js.
    ipAddress: { type: String, default: null },
    // Path (served statically) to a webcam snapshot captured at the moment
    // of a high-value violation (e.g. MULTIPLE_FACE, PHONE_DETECTED).
    // Populated by controllers/proctorController.js when the client sends
    // one; most events won't have one and this stays null.
    evidenceUrl: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

proctorLogSchema.index({ session: 1, timestamp: 1 });

module.exports = mongoose.model("ProctorLog", proctorLogSchema);
