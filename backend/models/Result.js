const mongoose = require("mongoose");

/* =========================
   ANSWER SUBDOCUMENT
   `question` stores the _id of the matching question subdocument
   inside the parent Exam document.
========================= */
const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedAnswer: { type: String, default: "" },
    isCorrect: { type: Boolean, default: false },
    marksAwarded: { type: Number, default: 0 },
  },
  { _id: false }
);

/* =========================
   RESULT (also doubles as the exam-attempt record)
   One document per (exam, student) pair — created as "in-progress"
   when the student starts the exam, and finalized to "submitted"
   once they submit. The unique index below is what actually
   prevents duplicate attempts/submissions at the database level.
========================= */
const resultSchema = new mongoose.Schema(
  {
    exam: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    answers: [answerSchema],

    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress",
    },

    startedAt: { type: Date, default: Date.now },
    submittedAt: { type: Date },
    timeTakenSeconds: { type: Number, default: 0 },

    totalMarks: { type: Number, default: 0 },
    obtainedMarks: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },

    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    unattemptedCount: { type: Number, default: 0 },

    passed: { type: Boolean, default: false },

    // Set true when an examiner force-submitted this attempt (e.g. via the
    // live monitoring "Terminate exam" action) rather than the student
    // submitting it themselves.
    terminatedByExaminer: { type: Boolean, default: false },
    // True specifically when a configured auto-terminate rule (not a
    // human instructor) ended this attempt — see utils/autoTerminationRules.js.
    // terminatedByExaminer is still also set true in this case so any
    // existing UI/query that already treats it as "not a normal submit"
    // keeps working unchanged for both manual and automatic terminations.
    autoTerminated: { type: Boolean, default: false },
    // Human-readable reason, populated for both manual and automatic
    // terminations, surfaced in the violation/report views.
    terminationReason: { type: String, default: null },

    // 🔒 Single-active-session enforcement (prevents the same exam being
    // taken in two tabs/windows/devices at once). Whichever tab most
    // recently called "start" owns this token; any other tab's
    // save/submit calls will be rejected once their token goes stale.
    activeSessionToken: { type: String, default: null },
    lastHeartbeatAt: { type: Date, default: null },

    // Set once by examNotificationScheduler.js when this in-progress
    // attempt crosses the "ending soon" threshold, so the 60-second poll
    // sends it at most once per attempt.
    endingSoonNotifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// 🔒 A student can only ever have ONE result/attempt per exam.
resultSchema.index({ exam: 1, student: 1 }, { unique: true });

// Serves getMyResults: every student's "my results" page does
// Result.find({ student, status: "submitted" }).sort({ submittedAt: -1 }).
// The unique index above has `exam` as its leftmost field, so it can't
// serve a student-only (or student+status) query at all — this is a
// separate, dedicated index for that access pattern.
resultSchema.index({ student: 1, status: 1, submittedAt: -1 });

module.exports = mongoose.model("Result", resultSchema);
