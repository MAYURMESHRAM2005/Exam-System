const express = require("express");
const path = require("path");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const mongoSanitize = require("./middleware/mongoSanitize");
const { initSocket } = require("./socket");
const { startExamNotificationScheduler } = require("./services/examNotificationScheduler");

dotenv.config();
connectDB();

const app = express();

// Render, Railway, and most other hosts put the app behind a reverse proxy.
// Without this, req.ip (and express-rate-limit, which reads req.ip) would
// see the proxy's internal address for every request instead of the real
// client IP — silently breaking both rate limiting and the proctoring
// system's per-violation IP address capture (see controllers/proctorController.js).
// `1` trusts exactly one hop, which matches a standard single-reverse-proxy
// deployment; raise it (or set to the platform's documented value) if
// deploying behind an additional load balancer.
app.set("trust proxy", 1);

/* -------------------- Security & Logging Middlewares -------------------- */
app.use(helmet());
app.use(
  cors({
    // credentials:true requires an explicit origin — '*' cannot be combined
    // with cookies, so CLIENT_URL must be set to the real frontend origin
    // in production.
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// Strips MongoDB operator keys ($gt, $where, etc.) and dotted keys from
// req.body/query/params before any route or validator sees them — defense
// against NoSQL operator-injection. See middleware/mongoSanitize.js for why
// this is hand-rolled rather than the popular express-mongo-sanitize
// package (which crashes on Express 5's read-only req.query).
app.use(mongoSanitize());

// Evidence snapshots captured by the AI proctoring monitor are written to
// disk under /uploads/evidence — served statically so the examiner's live
// monitoring / violation report views can actually display them.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rate limit auth endpoints to slow down brute-force login/register attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// General backstop for every other /api route (exams, results, proctor).
// Sized well above real usage — auto-save pings every 30s, the socket
// heartbeat doesn't count here at all (separate transport), and even a
// burst of several different proctoring violation types firing at once is
// still governed by their own 5s-per-type cooldown client-side — so this
// is purely an anti-abuse ceiling, not something a real exam session
// should ever get near.
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 600,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

/* -------------------- Health Check -------------------- */
// Reports real DB connectivity (mongoose.connection.readyState), not just
// "the process is alive" — used by the Docker HEALTHCHECK and can be
// pointed at by any external uptime monitor.
app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    db: dbConnected ? "connected" : "disconnected",
    uptimeSeconds: Math.round(process.uptime()),
  });
});
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ExamSecure AI Backend Running"
    });
});
/* -------------------- Routes -------------------- */
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/exams", apiLimiter, require("./routes/examRoutes")); // ✅ Exam Routes
app.use("/api/results", apiLimiter, require("./routes/resultRoutes")); // ✅ Result/Exam-taking Routes
app.use("/api/proctor", apiLimiter, require("./routes/proctorRoutes")); // ✅ AI Proctoring Routes (Phase 1)
app.use("/api/notifications", apiLimiter, require("./routes/notificationRoutes"));
app.use("/api/reports", apiLimiter, require("./routes/reportRoutes"));
app.use("/api/ai", apiLimiter, require("./routes/aiRoutes")); // AI question generation

/* -------------------- Error Handling -------------------- */
app.use(notFound);
app.use(errorHandler);

/* -------------------- Server -------------------- */
const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startExamNotificationScheduler();
  // Log AI config status for debugging
  if (process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY) {
    const provider = process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY ? "Groq" : "OpenAI";
    console.log(`[AI] Question generation enabled via ${provider} (model: ${process.env.AI_MODEL || 'llama-3.3-70b-versatile'})`);
  } else {
    console.log("[AI] Question generation DISABLED — set GROQ_API_KEY or OPENAI_API_KEY in .env to enable");
  }
});
