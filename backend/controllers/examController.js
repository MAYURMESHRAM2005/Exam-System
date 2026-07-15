const Exam = require("../models/Exam");
const Result = require("../models/Result");
const ProctorSession = require("../models/ProctorSession");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const computeExamStatus = require("../utils/examStatus");
const { getExamWindow, fromUTC } = require("../utils/dateTime");
const { escapeRegex, parsePagination } = require("../utils/pagination");
const { notify, notifyMany } = require("../services/notificationService");

// Shared, timezone-safe "start instant in ms" getter used for sorting exams
// by schedule. Delegates entirely to utils/dateTime.js instead of the old
// per-call-site `new Date(`${datePart}T${time}`)` (server-local-timezone
// dependent — the actual cause of the Render bug). Returns null instead of
// throwing so a single malformed/legacy exam can't crash a whole list
// request or corrupt an entire sort.
const safeStartMs = (exam) => {
  const window = getExamWindow(exam);
  return window ? window.start.getTime() : null;
};

const isPrivilegedRole = (role) => role === "instructor";

/* =========================
   CREATE EXAM
========================= */
exports.createExam = asyncHandler(async (req, res) => {
  const {
    title,
    courseCode,
    duration,
    totalMarks,
    passingMarks,
    instructions,
    proctoring,
    negativeMarking,
    shuffleQuestions,
    shuffleOptions,
    date,
    time,
    questions,
    autoTerminate,
  } = req.body;

  const exam = await Exam.create({
    title,
    courseCode,
    duration,
    totalMarks,
    passingMarks,
    instructions,
    proctoring,
    negativeMarking,
    shuffleQuestions,
    shuffleOptions,
    date,
    time,
    questions,
    autoTerminate,
    createdBy: req.user._id,
  });

  res.status(201).json({
    message: "Exam created successfully",
    exam,
  });

  // Fire-and-forget — the response above has already gone out; a
  // notification failure here should never affect exam creation itself.
  User.find({ role: "student" })
    .select("_id")
    .then((students) => {
      notifyMany(
        students.map((s) => s._id),
        {
          type: "exam_scheduled",
          title: "New exam scheduled",
          // Format the *canonical UTC instant* back into the app's fixed
          // display timezone, instead of the old `.toLocaleDateString()`
          // call, which silently used whatever locale/timezone the server
          // process happened to be running under (fine on a dev laptop set
          // to IST, wrong on a Render container set to UTC).
          message: `"${exam.title}" (${exam.courseCode}) has been scheduled for ${
            fromUTC(exam.startAtUTC)?.toFormat("dd LLL yyyy") ?? new Date(exam.date).toISOString().split("T")[0]
          } at ${exam.time}.`,
          data: { examId: exam._id },
        }
      );
    })
    .catch(() => {});

  notify({
    recipient: req.user._id,
    type: "new_exam_created",
    title: "Exam created",
    message: `"${exam.title}" (${exam.courseCode}) was created successfully.`,
    data: { examId: exam._id },
  });
});

/* =========================
   GET MY EXAMS (Instructor)
   Each exam is enriched with real aggregated data from Results:
   - students: distinct students who have started/submitted this exam
     (there is no separate enrollment system in this project, so "assigned"
     is defined as "has engaged with this exam attempt")
   - submitted: count of fully submitted attempts
   - avgScore: average percentage across submitted attempts (null if none)
   - violations: real per-exam total, summed from ProctorSession.violationCount
     across every proctoring session tied to that exam.
========================= */
exports.getMyExams = asyncHandler(async (req, res) => {
  const filter = { createdBy: req.user._id };
  if (req.query.search) {
    const pattern = escapeRegex(req.query.search);
    filter.$or = [
      { title: { $regex: pattern, $options: "i" } },
      { courseCode: { $regex: pattern, $options: "i" } },
    ];
  }

  const examQuery = Exam.find(filter).sort({ createdAt: -1 });

  const pagination = parsePagination(req.query);
  if (pagination) {
    const totalCount = await Exam.countDocuments(filter);
    examQuery.skip(pagination.skip).limit(pagination.limit);
    res.set("X-Total-Count", String(totalCount));
    res.set("X-Total-Pages", String(Math.max(1, Math.ceil(totalCount / pagination.limit))));
    res.set("X-Page", String(pagination.page));
  }

  const exams = await examQuery;

  const examIds = exams.map((e) => e._id);

  const stats = await Result.aggregate([
    { $match: { exam: { $in: examIds } } },
    {
      $group: {
        _id: "$exam",
        totalAttempts: { $sum: 1 },
        submittedCount: {
          $sum: { $cond: [{ $eq: ["$status", "submitted"] }, 1, 0] },
        },
        avgPercentage: {
          $avg: {
            $cond: [{ $eq: ["$status", "submitted"] }, "$percentage", null],
          },
        },
      },
    },
  ]);

  const statsMap = {};
  stats.forEach((s) => {
    statsMap[s._id.toString()] = s;
  });

  const violationStats = await ProctorSession.aggregate([
    { $match: { exam: { $in: examIds } } },
    { $group: { _id: "$exam", total: { $sum: "$violationCount" } } },
  ]);
  const violationsMap = {};
  violationStats.forEach((v) => {
    violationsMap[v._id.toString()] = v.total;
  });

  const enriched = exams.map((exam) => {
    const s = statsMap[exam._id.toString()];
    return {
      ...exam.toObject(),
      computedStatus: computeExamStatus(exam),
      students: s ? s.totalAttempts : 0,
      submitted: s ? s.submittedCount : 0,
      violations: violationsMap[exam._id.toString()] ?? 0,
      avgScore: s && s.avgPercentage != null ? Math.round(s.avgPercentage) : null,
    };
  });

  res.json(enriched);
});

/* =========================
   UPDATE EXAM (Instructor — Edit Exam flow)
========================= */
exports.updateExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    const error = new Error("Exam not found");
    error.statusCode = 404;
    throw error;
  }

  const isOwner = exam.createdBy.toString() === req.user._id.toString();

  if (!isOwner) {
    const error = new Error("Not authorized to edit this exam");
    error.statusCode = 403;
    throw error;
  }

  const editableFields = [
    "title",
    "courseCode",
    "duration",
    "date",
    "time",
    "totalMarks",
    "passingMarks",
    "instructions",
    "proctoring",
    "negativeMarking",
    "shuffleQuestions",
    "shuffleOptions",
    "questions",
    "autoTerminate",
    "cancelled",
  ];

  editableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      exam[field] = req.body[field];
    }
  });

  await exam.save();

  res.json({ message: "Exam updated successfully", exam });
});

/* =========================
   GET INSTRUCTOR DASHBOARD STATS
   GET /api/exams/instructor/stats
   Aggregates everything the Instructor Dashboard cards need in one call.
========================= */
exports.getInstructorStats = asyncHandler(async (req, res) => {
  const exams = await Exam.find({ createdBy: req.user._id });
  const examIds = exams.map((e) => e._id);

  const totalExams = exams.length;

  // Active Students: distinct students who have started or submitted
  // ANY of this instructor's exams.
  const distinctStudents = await Result.distinct("student", {
    exam: { $in: examIds },
  });
  const activeStudents = distinctStudents.length;

  // Average Score: across all submitted results for this instructor's exams.
  const avgAgg = await Result.aggregate([
    { $match: { exam: { $in: examIds }, status: "submitted" } },
    { $group: { _id: null, avgPercentage: { $avg: "$percentage" } } },
  ]);
  const avgScore = avgAgg.length > 0 ? Math.round(avgAgg[0].avgPercentage) : null;

  // Violations: total across every proctoring session for this
  // instructor's exams (a single aggregate, not per-exam N+1 queries).
  const violationsAgg = await ProctorSession.aggregate([
    { $match: { exam: { $in: examIds } } },
    { $group: { _id: null, total: { $sum: "$violationCount" } } },
  ]);
  const violations = violationsAgg.length > 0 ? violationsAgg[0].total : 0;

  // Next Exam: nearest upcoming (scheduled or live) exam by start time.
  const upcoming = exams
    .map((exam) => ({ exam, status: computeExamStatus(exam), start: safeStartMs(exam) }))
    .filter((e) => e.status !== "completed")
    .sort((a, b) => {
      if (a.start === null && b.start === null) return 0;
      if (a.start === null) return 1;
      if (b.start === null) return -1;
      return a.start - b.start;
    });

  let nextExam = null;
  if (upcoming.length > 0) {
    const ne = upcoming[0].exam;
    const registeredStudents = await Result.countDocuments({ exam: ne._id });
    nextExam = {
      examId: ne._id,
      title: ne.title,
      courseCode: ne.courseCode,
      date: ne.date,
      time: ne.time,
      registeredStudents,
    };
  }

  res.json({ totalExams, activeStudents, avgScore, violations, nextExam });
});
/* =========================
   DELETE EXAM
========================= */
exports.deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    const error = new Error("Exam not found");
    error.statusCode = 404;
    throw error;
  }

  // Only the creating instructor can delete their exam
  const isOwner = exam.createdBy.toString() === req.user._id.toString();

  if (!isOwner) {
    const error = new Error("Not authorized to delete this exam");
    error.statusCode = 403;
    throw error;
  }

  // 🔒 DATABASE CONSISTENCY: cascade-delete every Result tied to this exam
  // (Result already doubles as the exam-attempt record from Module 3 — there
  // is no separate ExamAttempt or Notification collection in this project;
  // notifications are computed on the fly and never persisted, so there is
  // nothing else to clean up).
  const { deletedCount: deletedResultsCount } = await Result.deleteMany({
    exam: exam._id,
  });

  await exam.deleteOne();

  res.json({
    message: "Exam deleted successfully",
    deletedResultsCount,
  });
});

/* =========================
   GET ALL EXAMS (Student)
   🔒 SECURITY: correctAnswer is stripped out for any non-instructor
   caller so students can never read MCQ answers
   straight from the network response.
   Each exam is also annotated with a real-time `computedStatus`.
========================= */
exports.getAllExams = asyncHandler(async (req, res) => {
  const privileged = isPrivilegedRole(req.user.role);

  const filter = {};
  if (req.query.search) {
    const pattern = escapeRegex(req.query.search);
    filter.$or = [
      { title: { $regex: pattern, $options: "i" } },
      { courseCode: { $regex: pattern, $options: "i" } },
    ];
  }

  const query = Exam.find(filter).sort({ createdAt: -1 });

  if (!privileged) {
    query.select("-questions.correctAnswer");
  }

  // Pagination is opt-in (see utils/pagination.js) — omitting page/limit
  // keeps today's exact behavior: every matching exam, as a flat array.
  const pagination = parsePagination(req.query);
  if (pagination) {
    const totalCount = await Exam.countDocuments(filter);
    query.skip(pagination.skip).limit(pagination.limit);
    res.set("X-Total-Count", String(totalCount));
    res.set("X-Total-Pages", String(Math.max(1, Math.ceil(totalCount / pagination.limit))));
    res.set("X-Page", String(pagination.page));
  }

  const exams = await query;

  const withStatus = exams.map((exam) => ({
    ...exam.toObject(),
    computedStatus: computeExamStatus(exam),
  }));

  res.json(withStatus);
});

/* =========================
   GET AVAILABLE EXAMS (Student)
   Returns only exams that are still relevant to take —
   i.e. not yet completed — sorted by the soonest first.
   This powers the Student Dashboard's "Available / Upcoming Exams" list.
========================= */
exports.getAvailableExams = asyncHandler(async (req, res) => {
  const privileged = isPrivilegedRole(req.user.role);

  const query = Exam.find();

  if (!privileged) {
    query.select("-questions.correctAnswer");
  }

  const exams = await query;

  const available = exams
    .map((exam) => ({
      ...exam.toObject(),
      computedStatus: computeExamStatus(exam),
    }))
    .filter((exam) => exam.computedStatus !== "completed")
    .sort((a, b) => {
      const aTime = safeStartMs(a);
      const bTime = safeStartMs(b);

      // Exams with an unparseable schedule sort to the end instead of
      // crashing the whole request.
      if (aTime === null && bTime === null) return 0;
      if (aTime === null) return 1;
      if (bTime === null) return -1;

      return aTime - bTime;
    });

  res.json(available);
});

/* =========================
   GET EXAM BY ID
   Used by the Exam Instructions screen to show real exam details,
   and to validate whether the student is actually allowed to start it.
   🔒 SECURITY: correctAnswer is stripped for non-privileged roles.
========================= */
exports.getExamById = asyncHandler(async (req, res) => {
  const privileged = isPrivilegedRole(req.user.role);

  const query = Exam.findById(req.params.id);

  if (!privileged) {
    query.select("-questions.correctAnswer");
  }

  const exam = await query;

  if (!exam) {
    const error = new Error("Exam not found");
    error.statusCode = 404;
    throw error;
  }

  const computedStatus = computeExamStatus(exam);

  // 🔒 A student who already submitted this exam may never re-enter it.
  let alreadySubmitted = false;
  if (!privileged) {
    const existingResult = await Result.findOne({
      exam: exam._id,
      student: req.user._id,
      status: "submitted",
    });
    alreadySubmitted = !!existingResult;
  }

  // Students may only start an exam while it is actually "live", and only
  // if they haven't already submitted it.
  const canStart = privileged || (computedStatus === "live" && !alreadySubmitted);

  let accessMessage = null;
  if (!privileged) {
    if (alreadySubmitted) {
      accessMessage = "You have already completed this exam.";
    } else if (computedStatus === "scheduled") {
      accessMessage = "This exam has not started yet. Please come back at the scheduled time.";
    } else if (computedStatus === "completed") {
      accessMessage = "This exam window has ended and can no longer be started.";
    }
  }

  res.json({
    ...exam.toObject(),
    computedStatus,
    canStart,
    accessMessage,
    alreadySubmitted,
  });
});
