const mongoose = require("mongoose");

/* =========================================================
   NOTIFICATION
   One document per in-app notification, always addressed to a single
   recipient (a broadcast to N users — e.g. "exam scheduled" going out to
   every student — simply creates N documents, one per recipient, rather
   than a single shared document with a read-by-list; this keeps read/
   delete state trivially per-user with no extra joins).

   `type` drives both the icon/color the frontend renders and the filter
   dropdown in the notification center — see utils/notificationTypes.js
   for the single source of truth on which types exist and which
   audience (student/instructor) each belongs to.
========================================================= */
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },

    // Free-form context for deep-linking from the notification (examId,
    // resultId, sessionId, studentId, etc.) — never rendered directly,
    // only read by the frontend to decide where a click should navigate.
    data: { type: mongoose.Schema.Types.Mixed, default: {} },

    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Every notification-center query filters by recipient and sorts by
// recency; this composite index covers both in one pass.
notificationSchema.index({ recipient: 1, createdAt: -1 });
// Powers the unread-count badge (a covered count query).
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model("Notification", notificationSchema);
