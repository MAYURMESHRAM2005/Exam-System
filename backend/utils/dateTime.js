/**
 * ============================================================================
 * CENTRALIZED EXAM DATE/TIME UTILITY
 * ============================================================================
 *
 * ROOT CAUSE OF THE "LOCALHOST WORKS, RENDER DOESN'T" BUG
 * ----------------------------------------------------------------------------
 * The old code (backend/utils/examStatus.js, backend/utils/examWindow.js, and
 * three copy-pasted helpers inside examController.js) built the exam's start
 * instant like this:
 *
 *     const start = new Date(`${datePart}T${exam.time}`);      // e.g. "2026-07-14T21:00"
 *
 *   ...or...
 *
 *     const start = new Date(exam.date);
 *     start.setHours(hours); start.setMinutes(minutes);
 *
 * Both of these are timezone-AMBIGUOUS. Per the ECMAScript spec, a date-time
 * string with no offset (no "Z", no "+05:30") and Date#setHours()/setMinutes()
 * are both interpreted using the *local timezone of the machine running the
 * JavaScript engine* — NOT the timezone the exam was scheduled in.
 *
 *   - On a developer's laptop (OS timezone = IST, UTC+5:30), "21:00" gets
 *     interpreted as 21:00 IST — which happens to be exactly what the
 *     instructor meant. Everything "just works" on localhost, by accident.
 *   - On Render (and Railway, Vercel, most Docker base images, and most CI
 *     runners), the container's OS timezone is UTC. The exact same code now
 *     interprets "21:00" as 21:00 UTC — 5 hours 30 minutes AFTER the
 *     instructor's intended IST start time. That's why the countdown goes
 *     negative ("Starts in -1h -2m") and the exam refuses to go live: the
 *     server thinks the real start time hasn't arrived yet (or has already
 *     passed, depending on the sign of the offset), while comparing against
 *     what it *thinks* is "now" using its own wrong reference point.
 *
 * THE FIX
 * ----------------------------------------------------------------------------
 * Every exam in this system is scheduled by an instructor working in a known,
 * fixed application timezone (APP_TIMEZONE below, default "Asia/Kolkata").
 * Instead of ever letting the *server's* OS timezone leak into the
 * calculation, we:
 *
 *   1. Explicitly interpret the instructor's wall-clock date+time as
 *      APP_TIMEZONE using Luxon (which uses the IANA tz database, so it is
 *      correct regardless of what timezone the Node process itself is
 *      running in — dev laptop, Render, Docker, doesn't matter).
 *   2. Convert that to a single, unambiguous UTC instant and store ONLY that
 *      instant (`startAtUTC`, a plain Date/BSON date column, which Mongo and
 *      JS both represent internally as milliseconds-since-epoch — inherently
 *      timezone-free).
 *   3. From then on, every comparison ("is it live yet?", "how long until it
 *      starts?", "has it ended?") is pure epoch-millisecond arithmetic
 *      (`Date.now()` vs `startAtUTC.getTime()`). Millisecond arithmetic can
 *      never be "wrong" based on server locale — 1 ms is 1 ms everywhere on
 *      Earth. This is what makes status calculation identical on localhost,
 *      Render, Railway, Vercel, Docker, Linux, Windows, and Mac.
 *
 * This module is the ONLY place in the codebase allowed to do date/time
 * arithmetic. Every other file (model hooks, controllers, the notification
 * scheduler, and the frontend's mirror of this logic) must go through these
 * functions instead of re-implementing date math inline.
 * ============================================================================
 */

const { DateTime } = require("luxon");

// The timezone every instructor's date/time picker is assumed to represent.
// Overridable via env var for deployments serving a different region, but
// defaults to Asia/Kolkata since that's this system's actual user base.
const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Kolkata";

/**
 * parseExamTime(dateInput, timeStr, tz = APP_TIMEZONE)
 * ----------------------------------------------------------------------------
 * Converts an instructor-entered { date, time } pair — e.g. date="2026-07-14"
 * (or a Date/ISO string whose calendar date we care about) and time="21:00" —
 * into the single correct UTC instant, by explicitly anchoring the wall-clock
 * value to `tz` rather than the server's local timezone.
 *
 * Returns a native JS Date (in UTC) or `null` if the inputs are missing/invalid.
 */
function parseExamTime(dateInput, timeStr, tz = APP_TIMEZONE) {
  if (!dateInput || !timeStr) return null;

  // Normalize the date part to "YYYY-MM-DD" regardless of whether we were
  // handed a Date object, a full ISO string, or a plain "YYYY-MM-DD" string.
  // We deliberately read the UTC calendar fields here: date-only values
  // (e.g. "2026-07-14") are parsed by JS as UTC midnight, so reading them
  // back via UTC getters recovers the exact same calendar date the
  // instructor picked, with no dependence on server locale.
  let datePart;
  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) return null;
    datePart = dateInput.toISOString().split("T")[0];
  } else {
    const asDate = new Date(dateInput);
    if (isNaN(asDate.getTime())) return null;
    datePart = asDate.toISOString().split("T")[0];
  }

  const match = /^(\d{1,2}):(\d{2})$/.exec(String(timeStr).trim());
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;

  const dt = DateTime.fromISO(`${datePart}T${match[1].padStart(2, "0")}:${match[2]}:00`, {
    zone: tz,
  });

  if (!dt.isValid) return null;

  return dt.toUTC().toJSDate();
}

/**
 * toUTC(date) -> ISO 8601 UTC string, or null.
 * Thin, explicit wrapper so call sites never call .toISOString() directly
 * (which is fine on a Date, but keeping it here means there's exactly one
 * place that owns "how do we serialize a UTC instant").
 */
function toUTC(date) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

/**
 * fromUTC(date, tz = APP_TIMEZONE) -> Luxon DateTime in the given zone.
 * Used anywhere we need to *display* a stored UTC instant in a specific
 * human timezone (e.g. formatting a notification message as IST regardless
 * of what timezone the server process happens to be running in).
 */
function fromUTC(date, tz = APP_TIMEZONE) {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;
  return DateTime.fromJSDate(d, { zone: "utc" }).setZone(tz);
}

/**
 * getExamWindow(exam) -> { start: Date, end: Date } | null
 *
 * Prefers the canonical `startAtUTC` field (set by the Exam model's
 * pre-save hook — see models/Exam.js). Falls back to deriving it from the
 * legacy `date` + `time` fields for any record that predates the
 * `startAtUTC` migration (see scripts/migrateExamStartAtUTC.js) and hasn't
 * been re-saved yet. This fallback is what preserves backward compatibility
 * without requiring the migration to run before deploying this fix.
 */
function getExamWindow(exam) {
  if (!exam || !exam.duration) return null;

  let start = null;

  if (exam.startAtUTC) {
    const d = new Date(exam.startAtUTC);
    if (!isNaN(d.getTime())) start = d;
  }

  if (!start) {
    start = parseExamTime(exam.date, exam.time);
  }

  if (!start) return null;

  const end = new Date(start.getTime() + exam.duration * 60000);
  return { start, end };
}

/**
 * calculateCountdown(startAtUTC, now = new Date()) -> milliseconds remaining
 * until start, clamped to 0. Never negative — this is what fixes the
 * "Starts in -1h -2m" display: once the start instant has passed, the
 * countdown reports exactly 0 instead of a growing negative number, and the
 * UI is expected to switch to showing "Live" (via computeExamStatus) rather
 * than continuing to render a countdown at all.
 */
function calculateCountdown(startAtUTC, now = new Date()) {
  if (!startAtUTC) return 0;
  const start = startAtUTC instanceof Date ? startAtUTC : new Date(startAtUTC);
  if (isNaN(start.getTime())) return 0;
  const diff = start.getTime() - (now instanceof Date ? now.getTime() : now);
  return Math.max(0, diff);
}

/**
 * computeExamStatus(exam, now = new Date())
 * -> "cancelled" | "scheduled" | "live" | "completed" | "expired"
 *
 * Always compares Current UTC Time (epoch ms) vs Stored UTC Exam Time
 * (epoch ms) — never the server's local wall clock, never the browser's.
 *
 *   cancelled  - instructor explicitly cancelled the exam (manual flag,
 *                takes priority over anything time-based).
 *   scheduled  - now < start
 *   live       - start <= now <= end
 *   completed  - now > end, and the exam had a valid, parseable schedule
 *   expired    - the exam's schedule could not be determined at all (e.g. a
 *                corrupt/legacy record missing date/time/duration). This
 *                used to silently fall back to "scheduled", which is
 *                actively misleading (a student would see a countdown to an
 *                exam that can never actually start). Surfacing it as its
 *                own state makes the failure visible instead of hidden.
 */
function computeExamStatus(exam, now = new Date()) {
  if (!exam) return "expired";
  if (exam.cancelled) return "cancelled";

  const window = getExamWindow(exam);
  if (!window) return "expired";

  const nowMs = now instanceof Date ? now.getTime() : now;
  const { start, end } = window;

  if (nowMs < start.getTime()) return "scheduled";
  if (nowMs <= end.getTime()) return "live";
  return "completed";
}

function isExamLive(exam, now = new Date()) {
  return computeExamStatus(exam, now) === "live";
}

function isExamCompleted(exam, now = new Date()) {
  return computeExamStatus(exam, now) === "completed";
}

module.exports = {
  APP_TIMEZONE,
  parseExamTime,
  toUTC,
  fromUTC,
  getExamWindow,
  calculateCountdown,
  computeExamStatus,
  isExamLive,
  isExamCompleted,
};
