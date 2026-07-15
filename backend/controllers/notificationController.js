const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const { escapeRegex, parsePagination } = require("../utils/pagination");
const { ALL_NOTIFICATION_TYPES } = require("../utils/notificationTypes");

/* =========================================================
   LIST NOTIFICATIONS
   GET /api/notifications?type=&isRead=&q=&page=&limit=
   Every filter is optional — with none supplied this just returns the
   signed-in user's full notification history, newest first.
========================================================= */
exports.getNotifications = asyncHandler(async (req, res) => {
  const { type, isRead, q } = req.query;
  const filter = { recipient: req.user._id };

  if (type && ALL_NOTIFICATION_TYPES.includes(type)) {
    filter.type = type;
  }
  if (isRead === "true") filter.isRead = true;
  if (isRead === "false") filter.isRead = false;
  if (q && String(q).trim()) {
    const pattern = new RegExp(escapeRegex(String(q).trim()), "i");
    filter.$or = [{ title: pattern }, { message: pattern }];
  }

  const pagination = parsePagination(req.query, { defaultLimit: 20, maxLimit: 100 });

  let query = Notification.find(filter).sort({ createdAt: -1 });
  if (pagination) {
    query = query.skip(pagination.skip).limit(pagination.limit);
  }

  const [notifications, total, unreadCount] = await Promise.all([
    query,
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: req.user._id, isRead: false }),
  ]);

  res.json({
    notifications,
    total,
    unreadCount,
    page: pagination?.page ?? 1,
    limit: pagination?.limit ?? total,
  });
});

/* =========================================================
   UNREAD COUNT
   GET /api/notifications/unread-count
   Cheap, dedicated endpoint for the header badge — avoids fetching the
   full list just to show a number.
========================================================= */
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
  });
  res.json({ unreadCount });
});

/* =========================================================
   MARK ONE AS READ
   PATCH /api/notifications/:id/read
========================================================= */
exports.markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  if (!notification.isRead) {
    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();
  }

  res.json({ notification });
});

/* =========================================================
   MARK ALL AS READ
   PATCH /api/notifications/read-all
========================================================= */
exports.markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  res.json({ matched: result.matchedCount ?? result.n, modified: result.modifiedCount ?? result.nModified });
});

/* =========================================================
   DELETE ONE
   DELETE /api/notifications/:id
========================================================= */
exports.deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    const error = new Error("Notification not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: "Notification deleted", id: req.params.id });
});
