const ActivityLog = require("../models/ActivityLog");

// Best-effort: recording that "the user changed their password" should
// never be the reason changing the password actually fails. Same pattern
// already used for proctoring event logging elsewhere in this codebase.
async function logActivity(userId, type, message, metadata = null) {
  try {
    await ActivityLog.create({ user: userId, type, message, metadata });
  } catch {
    // swallow — activity logging is observability, not a critical path
  }
}

module.exports = { logActivity };
