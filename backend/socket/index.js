const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Exam = require("../models/Exam");
const ProctorSession = require("../models/ProctorSession");
const { terminateSession } = require("../services/proctorSessionService");

let io = null;

const examMonitorRoom = (examId) => `exam:${examId}:monitor`;
const examRoom = (examId) => `exam:${examId}`;
const sessionRoom = (sessionId) => `session:${sessionId}`;
// Every authenticated socket joins its own user room on connect (below) —
// this is how notificationService.notify() reaches a specific user in
// real time regardless of which exam/session rooms they're currently in.
const userRoom = (userId) => `user:${userId}`;

/* =========================================================
   AUTH MIDDLEWARE
   The client sends its access token as socket.handshake.auth.token
   (same JWT used for REST calls — no separate socket-only credential).
========================================================= */
async function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No auth token provided"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new Error("User no longer exists"));

    socket.user = { _id: user._id.toString(), role: user.role, name: user.name };
    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
}

/* =========================================================
   OWNERSHIP HELPERS
========================================================= */
async function examBelongsToInstructor(examId, userId) {
  const exam = await Exam.findById(examId).select("createdBy");
  return Boolean(exam && exam.createdBy.toString() === userId);
}

async function sessionBelongsToStudent(sessionId, userId, examId) {
  const session = await ProctorSession.findById(sessionId).select("student exam");
  return Boolean(
    session &&
      session.student.toString() === userId &&
      session.exam.toString() === examId
  );
}

/* =========================================================
   INIT
========================================================= */
function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    // Personal room for real-time notification delivery — joined
    // immediately, independent of whether this socket ever joins an
    // exam/session room at all (e.g. a student just browsing the
    // dashboard, not currently taking an exam, still gets live badges).
    socket.join(userRoom(socket.user._id));

    /* ---------- Student: join their own exam session ---------- */
    socket.on("join:session", async ({ sessionId, examId }) => {
      if (socket.user.role !== "student" || !sessionId || !examId) return;

      const ok = await sessionBelongsToStudent(sessionId, socket.user._id, examId);
      if (!ok) return;

      socket.data.sessionId = sessionId;
      socket.data.examId = examId;
      socket.join(sessionRoom(sessionId));
      socket.join(examRoom(examId));

      io.to(examMonitorRoom(examId)).emit("presence:update", {
        sessionId,
        studentId: socket.user._id,
        studentName: socket.user.name,
        online: true,
        lastSeenAt: Date.now(),
      });
    });

    /* ---------- Instructor: watch a specific exam's live sessions ---------- */
    socket.on("join:exam-monitor", async ({ examId }) => {
      if (socket.user.role !== "instructor" || !examId) return;

      const owns = await examBelongsToInstructor(examId, socket.user._id);
      if (!owns) return;

      socket.data.monitoringExamId = examId;
      socket.join(examMonitorRoom(examId));
    });

    /* ---------- Instructor action: warn one student ---------- */
    socket.on("examiner:warn", async ({ sessionId, message }) => {
      if (socket.user.role !== "instructor" || !sessionId || !message) return;

      const session = await ProctorSession.findById(sessionId).select("exam student");
      if (!session) return;
      const owns = await examBelongsToInstructor(session.exam.toString(), socket.user._id);
      if (!owns) return;

      io.to(sessionRoom(sessionId)).emit("student:warning", {
        message,
        timestamp: Date.now(),
      });

      const { notify } = require("../services/notificationService");
      notify({
        recipient: session.student,
        type: "warning_received",
        title: "Warning from your examiner",
        message,
        data: { sessionId, examId: session.exam },
      });
    });

    /* ---------- Instructor action: broadcast to every student in an exam ---------- */
    socket.on("examiner:broadcast", async ({ examId, message }) => {
      if (socket.user.role !== "instructor" || !examId || !message) return;

      const owns = await examBelongsToInstructor(examId, socket.user._id);
      if (!owns) return;

      io.to(examRoom(examId)).emit("student:broadcast", {
        message,
        timestamp: Date.now(),
      });
    });

    /* ---------- Instructor action: force-terminate one student's attempt ---------- */
    socket.on("examiner:terminate", async ({ sessionId }) => {
      if (socket.user.role !== "instructor" || !sessionId) return;

      const existing = await ProctorSession.findById(sessionId).select("exam");
      if (!existing) return;
      const examId = existing.exam.toString();
      const owns = await examBelongsToInstructor(examId, socket.user._id);
      if (!owns) return;

      try {
        const { session, result } = await terminateSession(sessionId);

        io.to(sessionRoom(sessionId)).emit("student:terminated", {
          message: "Your exam was ended by the examiner.",
          resultId: result?._id || null,
        });

        io.to(examMonitorRoom(examId)).emit("session:terminated", {
          sessionId: session._id,
          resultId: result?._id || null,
        });
      } catch {
        // Session already gone/invalid — nothing to broadcast.
      }
    });

    /* ---------- Student: periodic heartbeat while taking the exam ----------
       Socket.IO's own ping/pong will eventually notice a truly dead TCP
       connection, but that can take up to ~45s by default and only then
       fires "disconnect". An app-level heartbeat lets the instructor
       dashboard show a much more responsive "last seen Xs ago" signal and
       flag a session as stale well before the transport-level timeout. */
    socket.on("heartbeat", () => {
      if (!socket.data.sessionId || !socket.data.examId) return;

      io.to(examMonitorRoom(socket.data.examId)).emit("presence:update", {
        sessionId: socket.data.sessionId,
        studentId: socket.user._id,
        online: true,
        lastSeenAt: Date.now(),
      });
    });

    socket.on("disconnect", () => {
      if (socket.data.sessionId && socket.data.examId) {
        io.to(examMonitorRoom(socket.data.examId)).emit("presence:update", {
          sessionId: socket.data.sessionId,
          studentId: socket.user._id,
          online: false,
        });
      }
    });
  });

  return io;
}

/* =========================================================
   GET IO
   Lets REST controllers (e.g. proctorController.logEvent) broadcast
   real-time events without needing a socket connection themselves.
========================================================= */
function getIO() {
  return io;
}

module.exports = { initSocket, getIO, examMonitorRoom, examRoom, sessionRoom, userRoom };
