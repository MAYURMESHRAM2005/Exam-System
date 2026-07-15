
// const mongoose = require("mongoose");

// const examSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   courseCode: { type: String, required: true },
//   duration: { type: Number, required: true },
//   date:{type:String},
//   totalMarks: { type: Number, required: true },
//   passingMarks: { type: Number, required: true },
//   instructions: { type: String },

//   proctoring: {
//     enableAI: Boolean,
//     enableCamera: Boolean,
//     enableMicrophone: Boolean,
//     enableScreenShare: Boolean,
//     faceDetection: Boolean,
//     tabSwitchLimit: Number
//   },

//   questions: [
//     {
//       questionText: { type: String, required: true },
//       type: { type: String, default: "mcq" },
//       options: [String],
//       correctAnswer: String,
//       marks: { type: Number, default: 1 }
//     }
//   ],

//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
//   }

// }, { timestamps: true });

// module.exports = mongoose.model("Exam", examSchema);
const mongoose = require("mongoose");
const { parseExamTime } = require("../utils/dateTime");

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    courseCode: { type: String, required: true },

    duration: { type: Number, required: true }, // in minutes

    // ✅ FIXED DATE + TIME
    // These remain the source of truth for *what the instructor entered*
    // (kept for backward compatibility with existing API consumers/UI),
    // interpreted as wall-clock time in APP_TIMEZONE (see utils/dateTime.js).
    date: { type: Date, required: true },
    time: { type: String, required: true }, // "HH:MM"

    // ✅ CANONICAL UTC INSTANTS (production-safe storage)
    // Derived automatically from date + time + duration by the pre-save
    // hook below — never set these directly. All status/countdown/live
    // logic reads ONLY these fields (via utils/dateTime.js), so it never
    // depends on the timezone of whichever machine is running the code.
    startAtUTC: { type: Date, index: true },
    endAtUTC: { type: Date },

    // ✅ CANCELLED (manual override)
    // Lets an instructor cancel an exam outright; computeExamStatus()
    // always reports "cancelled" for these regardless of schedule.
    cancelled: { type: Boolean, default: false },

    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },

    instructions: { type: String, default: "" },

    // ✅ FIXED PROCTORING (match frontend)
    proctoring: {
      enableProctoring: { type: Boolean, default: true },
      enableCamera: { type: Boolean, default: true },
      enableMicrophone: { type: Boolean, default: true },
      enableScreenShare: { type: Boolean, default: false },
      faceDetection: { type: Boolean, default: true },
      tabSwitchLimit: { type: Number, default: 3 },
    },

    // ✅ NEGATIVE MARKING
    // Applies only to auto-graded types (mcq / msq / truefalse). marksPerWrong
    // is a positive number subtracted per wrong answer when enabled — e.g.
    // 0.25 deducts a quarter mark per wrong answer, the common convention.
    negativeMarking: {
      enabled: { type: Boolean, default: false },
      marksPerWrong: { type: Number, default: 0, min: 0 },
    },

    // ✅ SHUFFLING
    // Applied per-student with a deterministic seed (exam+student[+question]
    // id), so each student sees a randomized-but-stable order across
    // reloads without needing to persist the shuffled order anywhere.
    shuffleQuestions: { type: Boolean, default: false },
    shuffleOptions: { type: Boolean, default: false },

    // ✅ QUESTIONS
    questions: [
      {
        questionText: { type: String, required: true },
        type: { type: String, default: "mcq" },
        options: { type: [String], default: [] },
        correctAnswer: { type: String },
        marks: { type: Number, default: 1 },
      },
    ],

    // ✅ OPTIONAL: store stats (for dashboard)
    students: { type: Number, default: 0 },
    submitted: { type: Number, default: 0 },
    violations: { type: Number, default: 0 },

    // ✅ OPTIONAL STATUS (not used for the real status; the real,
    // authoritative status is always computed on the fly by
    // utils/dateTime.js#computeExamStatus, from startAtUTC/endAtUTC vs
    // Date.now(). This stored field is kept only for any legacy code path
    // that reads it directly; it is not kept in sync automatically.)
    status: {
      type: String,
      enum: ["scheduled", "live", "completed", "expired", "cancelled"],
      default: "scheduled",
    },

    // ✅ AUTO-TERMINATE RULES (configurable per exam, opt-in)
    // Checked by proctorController.logEvent on every violation. Disabled
    // by default so existing exams keep behaving exactly as before —
    // an instructor has to deliberately turn this on for a given exam.
    // "Browser minimize" is deliberately NOT a separate rule here: the
    // Page Visibility API (what the frontend actually has access to)
    // can't distinguish "window minimized" from "switched tabs" — both
    // fire the exact same visibilitychange/blur events — so minimizing
    // is already covered by maxTabSwitches rather than faking a second,
    // indistinguishable signal.
    autoTerminate: {
      enabled: { type: Boolean, default: false },
      maxTabSwitches: { type: Number, default: null, min: 1 },
      onFullscreenExit: { type: Boolean, default: false },
      onDevToolsOpen: { type: Boolean, default: false },
      onMultipleFaces: { type: Boolean, default: false },
      maxPhoneDetections: { type: Number, default: null, min: 1 },
      onCameraDisabled: { type: Boolean, default: false },
      onMicrophoneDisabled: { type: Boolean, default: false },
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Set once each by examNotificationScheduler.js the first time it
    // observes this exam crossing the relevant threshold — prevents the
    // 60-second poll from re-sending the same "starts soon"/"is now live"
    // notification to every student on every tick.
    reminderSentAt: { type: Date, default: null },
    liveNotifiedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Serves getMyExams / getInstructorStats: every instructor dashboard load
// does Exam.find({ createdBy }).sort({ createdAt: -1 }) — this index
// covers both the filter and the sort in one pass instead of an
// in-memory sort after the filter.
examSchema.index({ createdBy: 1, createdAt: -1 });

// ============================================================================
// Keep startAtUTC / endAtUTC in sync with date/time/duration.
// ----------------------------------------------------------------------------
// This runs on every create AND every edit (Exam Creation + Exam Edit from
// the requirements list). Any request that changes date, time, or duration
// gets its canonical UTC instants recomputed here — the controllers never
// need to (and must not) do this math themselves.
// ============================================================================
examSchema.pre("save", function (next) {
  if (this.isModified("date") || this.isModified("time") || this.isModified("duration")) {
    const start = parseExamTime(this.date, this.time);
    if (start) {
      this.startAtUTC = start;
      this.endAtUTC = new Date(start.getTime() + this.duration * 60000);
    }
  }
  next();
});

module.exports = mongoose.model("Exam", examSchema);