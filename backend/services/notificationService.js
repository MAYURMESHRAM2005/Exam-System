const Notification = require("../models/Notification");

/* =========================================================
   NOTIFICATION SERVICE
   Persists a Notification document AND pushes it in real time to the
   recipient's personal socket room, if they're currently connected.
   Deliberately best-effort/never-throwing, same pattern as
   utils/activityLog.js and the fire-and-forget email sends elsewhere in
   this codebase — a notification failing to send should never be the
   reason the underlying action (submitting an exam, logging a
   violation...) fails.

   `getIO`/`userRoom` are required lazily, inside the functions rather
   than at module load time, to sidestep a require cycle: socket/index.js
   requires services/proctorSessionService.js, which will in turn want to
   call notify() for termination notices.
========================================================= */

async function notify({ recipient, type, title, message, data = {} }) {
  try {
    const doc = await Notification.create({ recipient, type, title, message, data });

    const { getIO, userRoom } = require("../socket");
    const io = getIO();
    if (io) {
      io.to(userRoom(recipient.toString())).emit("notification:new", {
        id: doc._id,
        type: doc.type,
        title: doc.title,
        message: doc.message,
        data: doc.data,
        isRead: doc.isRead,
        createdAt: doc.createdAt,
      });
    }

    return doc;
  } catch {
    return null; // best-effort — observability, not a critical path
  }
}

// Fans the same notification out to many recipients — used for
// broadcast-style events like "exam scheduled" going to every student.
// Runs independently per-recipient (Promise.allSettled) so one bad id
// can't stop the rest of the class from being notified.
async function notifyMany(recipients, payload) {
  const results = await Promise.allSettled(
    recipients.map((recipient) => notify({ ...payload, recipient }))
  );
  return results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value)
    .filter(Boolean);
}

module.exports = { notify, notifyMany };
