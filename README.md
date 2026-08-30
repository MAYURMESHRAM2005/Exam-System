# ExamSecure AI — Online Proctored Examination Platform

A two-role (Student / Instructor) online examination platform with real-time
browser-lockdown security, AI-powered webcam/audio proctoring, and live
instructor monitoring over Socket.IO.

## Stack

- **Frontend**: React + TypeScript + Vite, Tailwind, face-api.js + coco-ssd (client-side AI)
- **Backend**: Node.js + Express + MongoDB (Mongoose), Socket.IO
- **Auth**: JWT access tokens + httpOnly rotating refresh-token cookies, email OTP verification, forgot/reset password
- **AI Generation**: OpenAI-compatible API (supports OpenAI, Groq, Ollama, or any compatible endpoint)

## Feature summary

- **Auth**: Student registration (public) + Instructor login (pre-seeded accounts only), email OTP verification, forgot/reset password, "remember me", account lockout after repeated failed logins, logout-all-devices
- **Exam creation**: Manual question editor, CSV question import with validation, AI-powered question generation from topic/title, download CSV template
- **Exam engine**: live timer, auto-save, resume after refresh/disconnect, question navigation, mark-for-review, negative marking, question/option shuffling
- **Browser security**: fullscreen enforcement, tab-switch/devtools/copy-paste detection and blocking, all logged as violations
- **AI proctoring**: face detection, head-pose estimation, eye tracking, phone/book/laptop/person object detection, audio noise monitoring, camera health monitoring (frozen frame, black screen), permission revocation detection, automatic evidence-snapshot capture
- **Violation system**: per-event severity scoring, running risk score per session, auto-flagging, configurable auto-termination rules per exam
- **Live monitoring**: real-time Socket.IO dashboard for instructors — live violation feed, warn/broadcast/terminate actions, CSV/XLSX/PDF export
- **Notifications**: real-time in-app notifications for exam events, violations, and system alerts
- **Results**: automatic MCQ/True-False grading, rank and percentile computation, grade assignment, pass/fail determination
- **Reports**: exportable results, violations, attendance, and AI risk reports in CSV/XLSX/PDF formats
- **Profile management**: student profile editing, avatar upload, activity timeline, device session management, email change with re-verification

## Local development

```bash
# Backend
cd backend
cp .env.example .env   # fill in JWT_SECRET at minimum
npm install
npm run dev             # http://localhost:5000

# Frontend (separate terminal)
cd frontend
cp .env.example .env    # defaults to http://localhost:5000/api, fine for local dev
npm install
npm run dev              # http://localhost:5173
```

### Required environment variables

**Backend** (`backend/.env`):

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `CLIENT_URL` | Yes | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `OPENAI_API_KEY` | For AI generation | API key for OpenAI, Groq, or compatible provider |
| `OPENAI_API_BASE` | No | API base URL (default: `https://api.openai.com/v1`) |
| `AI_MODEL` | No | Model name (default: `gpt-4o-mini`) |
| `GOOGLE_CLIENT_ID` | For Google Sign-In | Google OAuth 2.0 Client ID |
| `SMTP_HOST/PORT/USER/PASS` | For email | SMTP credentials (dev prints to console) |

**Frontend** (`frontend/.env`):

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | No | Backend API URL (default: `http://localhost:5000/api`) |
| `VITE_GOOGLE_CLIENT_ID` | For Google Sign-In | Must match backend `GOOGLE_CLIENT_ID` |

You'll need a local MongoDB running on `mongodb://127.0.0.1:27017` (or point
`MONGO_URI` at your own instance/Atlas cluster).

Email (OTP verification, password reset) works without any SMTP setup in
development — messages print to the backend console instead of sending.
Set `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASS` to send real email.

## Production deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Docker Compose (recommended) and
PM2 + system Nginx instructions, and [PRODUCTION_CHECKLIST.md](./PRODUCTION_CHECKLIST.md)
before going live.

## Project structure

```
backend/
  controllers/   route handlers (auth, exam, proctor, result, ai, notification, report)
  models/        Mongoose schemas (User, Exam, Question, Result, ProctorSession, ProctorLog, ...)
  routes/        Express routers (auth, exam, proctor, result, ai, notification, report)
  middleware/    auth, validation, error handling
  services/      business logic shared across controllers/sockets
  socket/        Socket.IO server + rooms
  utils/         small pure helpers
  uploads/       captured proctoring evidence (git-ignored)
frontend/
  src/components/  screens + UI components
  src/hooks/       useBrowserSecurity, etc.
  src/lib/         face-api.js model loader, proctor stream manager
  src/services/    HTTP client (with auto token refresh) + Socket.IO client
  src/api/         typed API call wrappers
  src/config/      environment variable config
```

## Known limitations (documented, not hidden)

- Live camera *feeds* in the instructor's monitoring dashboard are not
  streamed — building that needs a WebRTC signaling layer, which isn't
  implemented. Live violation data, presence, and progress are real and
  update live; the video tile itself is a placeholder icon.
- Face *recognition/verification* (matching the live face against an
  enrolled ID photo) isn't implemented — only face *detection* (is a face
  present, how many, what pose) is.
- VPN detection and true cross-browser incognito detection aren't
  implemented — both would need a paid IP-intelligence service / aren't
  reliably detectable from the browser at all, so we didn't fake them.
- Socket.IO is single-instance by default (see `ecosystem.config.js`) —
  horizontal scaling needs a shared adapter (e.g. Redis) which isn't wired up.
- AI question generation requires a configured `OPENAI_API_KEY` in the backend
  environment. Without it, the feature is disabled with a clear error message.
  The API key is never exposed to the frontend.

## API reference (key endpoints)

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Student registration (always creates `role: student`) |
| POST | `/api/auth/login` | Public | Login (any existing role) |
| POST | `/api/auth/google` | Public | Google Sign-In / link |
| POST | `/api/exams/create` | Instructor | Create exam with questions |
| PUT | `/api/exams/:id` | Instructor | Update exam |
| GET | `/api/exams/my-exams` | Instructor | List instructor's exams |
| GET | `/api/exams/available` | Student | List available exams |
| POST | `/api/results/start/:examId` | Student | Start exam attempt |
| PUT | `/api/results/:id/save` | Student | Auto-save answer |
| POST | `/api/results/:id/submit` | Student | Submit exam |
| GET | `/api/results/mine` | Student | View own results |
| GET | `/api/results/exam/:examId` | Instructor | View exam results |
| POST | `/api/proctor/start` | Student | Start proctoring session |
| POST | `/api/proctor/:sessionId/log` | Student | Log proctoring event |
| GET | `/api/proctor/exam/:examId/sessions` | Instructor | Live monitoring data |
| GET | `/api/proctor/exam/:examId/violations` | Instructor | Violation report |
| POST | `/api/ai/generate-questions` | Instructor | AI question generation |

## CSV question import format

```csv
questionText,type,optionA,optionB,optionC,optionD,correctAnswer,marks
What is React?,mcq,Library,Framework,Language,Tool,Library,5
The sky is blue,truefalse,True,False,,,True,3
Describe OOP principles,descriptive,,,,,,10
```

Supported types: `mcq`, `msq`, `truefalse`, `descriptive`, `coding`

## AI question generation

Requires `OPENAI_API_KEY` (or compatible) in `backend/.env`. Supports:
- OpenAI (`gpt-4o-mini`, `gpt-4o`, etc.)
- Groq (set `OPENAI_API_BASE=https://api.groq.com/openai/v1`)
- Ollama (set `OPENAI_API_BASE=http://localhost:11434/v1`)
- Any OpenAI-compatible API endpoint

The instructor enters an exam title (used as the topic), number of questions,
and difficulty level. Generated questions are validated, deduplicated, and
merged into the existing question list for review before publishing.
