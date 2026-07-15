const Exam = require("../models/Exam");
const Result = require("../models/Result");
const User = require("../models/User");
const getExamWindow = require("../utils/examWindow");
const { notifyMany, notify } = require("./notificationService");

/* =========================================================
   EXAM NOTIFICATION SCHEDULER
   "Exam reminder", "Exam started" (i.e. the exam went live), and "Exam
   ending soon" are all triggered by wall-clock time passing a threshold,
   not by any user action — there is no request/response cycle to hang
   these off, so they need something checking the clock on its own. This
   is a plain in-process poll (checked every POLL_INTERVAL_MS) rather
   than pulling in a cron dependency; each exam/result only fires each
   notification once, tracked via the *NotifiedAt fields added to the
   Exam/Result schemas, which double as the guard against a second
   server process (if ever run with >1 instance) double-sending —
   the update that sets the field only succeeds for one racer.

   Known limitation: with multiple backend instances behind a load
   balancer, more than one process runs this poll independently. The
   guard fields prevent double *notifications* (Mongo only lets one
   concurrent updateOne "win" per document) but this is still simplest
   run as a single instance; a proper multi-instance deployment would
   move this to a dedicated worker process or a distributed scheduler
   (e.g. agenda/bull) instead of an in-process interval per web instance.
========================================================= */

const POLL_INTERVAL_MS = 60 * 1000;
const REMINDER_WINDOW_MS = 15 * 60 * 1000; // "starts within 15 minutes"
const ENDING_SOON_WINDOW_MS = 5 * 60 * 1000; // "less than 5 minutes remaining"

let studentIdsCache = { ids: [], fetchedAt: 0 };
const STUDENT_CACHE_TTL_MS = 5 * 60 * 1000;

async function getAllStudentIds() {
  if (Date.now() - studentIdsCache.fetchedAt < STUDENT_CACHE_TTL_MS && studentIdsCache.ids.length) {
    return studentIdsCache.ids;
  }
  const students = await User.find({ role: "student" }).select("_id");
  studentIdsCache = { ids: students.map((s) => s._id), fetchedAt: Date.now() };
  return studentIdsCache.ids;
}

async function sendUpcomingReminders() {
  const now = Date.now();
  const candidates = await Exam.find({
    reminderSentAt: null,
    date: { $ne: null },
  }).select("title courseCode date time duration reminderSentAt");

  for (const exam of candidates) {
    let start;
    try {
      start = getExamWindow(exam).start;
    } catch {
      continue;
    }
    const msUntilStart = start.getTime() - now;
    if (msUntilStart <= 0 || msUntilStart > REMINDER_WINDOW_MS) continue;

    // Atomically claim this exam so a second poll tick (or a second
    // server process) can't send the same reminder twice.
    const claimed = await Exam.findOneAndUpdate(
      { _id: exam._id, reminderSentAt: null },
      { $set: { reminderSentAt: new Date() } }
    );
    if (!claimed) continue;

    const studentIds = await getAllStudentIds();
    notifyMany(studentIds, {
      type: "exam_reminder",
      title: "Exam starting soon",
      message: `"${exam.title}" (${exam.courseCode}) starts at ${exam.time} — less than 15 minutes away.`,
      data: { examId: exam._id },
    });
  }
}

async function sendGoingLiveNotifications() {
  const now = Date.now();
  const candidates = await Exam.find({
    liveNotifiedAt: null,
    date: { $ne: null },
  }).select("title courseCode date time duration liveNotifiedAt");

  for (const exam of candidates) {
    let start, end;
    try {
      ({ start, end } = getExamWindow(exam));
    } catch {
      continue;
    }
    if (now < start.getTime() || now > end.getTime()) continue;

    const claimed = await Exam.findOneAndUpdate(
      { _id: exam._id, liveNotifiedAt: null },
      { $set: { liveNotifiedAt: new Date() } }
    );
    if (!claimed) continue;

    const studentIds = await getAllStudentIds();
    notifyMany(studentIds, {
      type: "exam_started",
      title: "Exam is now live",
      message: `"${exam.title}" (${exam.courseCode}) is now open.`,
      data: { examId: exam._id },
    });
  }
}

async function sendEndingSoonNotifications() {
  const now = Date.now();
  const inProgress = await Result.find({
    status: "in-progress",
    endingSoonNotifiedAt: null,
  }).select("exam student startedAt endingSoonNotifiedAt");

  if (!inProgress.length) return;

  const examIds = [...new Set(inProgress.map((r) => r.exam.toString()))];
  const exams = await Exam.find({ _id: { $in: examIds } }).select("title date time duration");
  const examById = new Map(exams.map((e) => [e._id.toString(), e]));

  for (const result of inProgress) {
    const exam = examById.get(result.exam.toString());
    if (!exam) continue;

    let end;
    try {
      ({ end } = getExamWindow(exam));
    } catch {
      continue;
    }
    const msRemaining = end.getTime() - now;
    if (msRemaining <= 0 || msRemaining > ENDING_SOON_WINDOW_MS) continue;

    const claimed = await Result.findOneAndUpdate(
      { _id: result._id, endingSoonNotifiedAt: null },
      { $set: { endingSoonNotifiedAt: new Date() } }
    );
    if (!claimed) continue;

    notify({
      recipient: result.student,
      type: "exam_ending_soon",
      title: "Exam ending soon",
      message: `Less than 5 minutes remain on "${exam.title}" — submit soon to avoid an automatic cutoff.`,
      data: { examId: exam._id, resultId: result._id },
    });
  }
}

async function tick() {
  try {
    await Promise.all([
      sendUpcomingReminders(),
      sendGoingLiveNotifications(),
      sendEndingSoonNotifications(),
    ]);
  } catch (err) {
    console.error("[examNotificationScheduler] tick failed:", err.message);
  }
}

let intervalHandle = null;

function startExamNotificationScheduler() {
  if (intervalHandle) return; // idempotent — a second call is a no-op
  tick(); // run once immediately on boot rather than waiting a full interval
  intervalHandle = setInterval(tick, POLL_INTERVAL_MS);
}

function stopExamNotificationScheduler() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}

module.exports = { startExamNotificationScheduler, stopExamNotificationScheduler };
