/**
 * ============================================================================
 * CENTRALIZED EXAM TIME UTILITY (frontend)
 * ============================================================================
 *
 * Mirrors backend/utils/dateTime.js. See that file for the full explanation
 * of the underlying bug. The short version, for the frontend side:
 *
 * The backend now always returns a canonical `startAtUTC` / `endAtUTC` ISO
 * string on every exam object (see backend/models/Exam.js). Those are true,
 * unambiguous UTC instants — "2026-07-15T15:30:00.000Z" means the exact same
 * moment in time no matter what timezone the reader is in. That means the
 * frontend NEVER needs to re-derive a start time from `date` + `time`
 * strings (which is what the old, buggy `getTimeLeft()` in
 * InstructorDashboard.tsx did, via `new Date(`${datePart}T${time}`)` — that
 * expression is parsed in the *browser's* local timezone, which happens to
 * usually be correct for the actual human using the dashboard, but was
 * fragile and duplicated the same footgun the backend had).
 *
 * All status/countdown math here works with epoch milliseconds
 * (`Date#getTime()`), which is timezone-free by construction — 1ms is 1ms
 * everywhere. Formatting for *display* is the only place we convert to a
 * human timezone, and we deliberately use the browser's own local timezone
 * for that (via toLocaleString), which is the actual correct thing to do:
 * show each viewer the exam time in the timezone their computer is set to.
 *
 * Every dashboard component should import from here instead of doing its
 * own `new Date(...)` arithmetic on exam date/time fields.
 * ============================================================================
 */

export type ExamStatus = "cancelled" | "scheduled" | "live" | "completed" | "expired";

export interface ExamTimeFields {
  date?: string | null;
  time?: string | null;
  duration?: number | null;
  startAtUTC?: string | null;
  endAtUTC?: string | null;
  cancelled?: boolean;
}

/**
 * getExamStartMs(exam) -> epoch ms, or null if it can't be determined.
 *
 * Prefers the canonical `startAtUTC` sent by the backend. Falls back to
 * parsing `date` + `time` as browser-local time ONLY for older cached data
 * that predates this fix (e.g. a stale service worker cache) — this is a
 * safety net, not the primary path, and is why it's clearly commented as
 * a fallback rather than duplicated logic.
 */
export function getExamStartMs(exam: ExamTimeFields): number | null {
  if (exam.startAtUTC) {
    const t = new Date(exam.startAtUTC).getTime();
    if (!isNaN(t)) return t;
  }
  if (exam.date && exam.time) {
    const datePart = exam.date.split("T")[0];
    const t = new Date(`${datePart}T${exam.time}`).getTime();
    if (!isNaN(t)) return t;
  }
  return null;
}

/**
 * getExamEndMs(exam) -> epoch ms, or null.
 * Prefers `endAtUTC`; otherwise derives it from start + duration.
 */
export function getExamEndMs(exam: ExamTimeFields): number | null {
  if (exam.endAtUTC) {
    const t = new Date(exam.endAtUTC).getTime();
    if (!isNaN(t)) return t;
  }
  const startMs = getExamStartMs(exam);
  if (startMs !== null && exam.duration) {
    return startMs + exam.duration * 60000;
  }
  return null;
}

/**
 * computeStatus(exam, nowMs) -> ExamStatus
 * Client-side mirror of the backend's computeExamStatus, used so the UI can
 * update between polls (e.g. flipping "Scheduled" -> "Live" the instant the
 * clock ticks over, without waiting for the next refetch). The backend's
 * `computedStatus` field on each exam remains the source of truth and wins
 * on every refetch; this is purely for smooth between-poll UI updates.
 */
export function computeStatus(exam: ExamTimeFields, nowMs: number = Date.now()): ExamStatus {
  if (exam.cancelled) return "cancelled";
  const startMs = getExamStartMs(exam);
  const endMs = getExamEndMs(exam);
  if (startMs === null || endMs === null) return "expired";
  if (nowMs < startMs) return "scheduled";
  if (nowMs <= endMs) return "live";
  return "completed";
}

/**
 * calculateCountdown(exam, nowMs) -> milliseconds remaining until start,
 * clamped to 0. Never negative — this is what eliminates "Starts in -1h -2m".
 * Once it hits 0, the UI should be reading `computeStatus` as "live", not
 * continuing to display a countdown.
 */
export function calculateCountdown(exam: ExamTimeFields, nowMs: number = Date.now()): number {
  const startMs = getExamStartMs(exam);
  if (startMs === null) return 0;
  return Math.max(0, startMs - nowMs);
}

/**
 * formatCountdown(ms) -> "Xh Ym" (or "Xd Yh" beyond 24h, or "starting now"
 * once it hits 0). Pure formatting, always non-negative by construction
 * since calculateCountdown() already clamps.
 */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "starting now";
  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * formatExamDateTime(exam) -> human-readable date + time string, converted
 * from the stored UTC instant into whatever timezone the viewer's own
 * browser is set to. This is a genuine, correct timezone conversion (via
 * the Intl APIs underlying Date#toLocaleString), not the ad hoc string
 * concatenation the old code used.
 */
export function formatExamDateTime(exam: ExamTimeFields): string {
  const startMs = getExamStartMs(exam);
  if (startMs === null) return "Date TBD";
  return new Date(startMs).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
