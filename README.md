# ExamSecure AI — Online Proctored Examination Platform

A two-role (Student / Examiner) online examination platform with real-time
browser-lockdown security, AI-powered webcam/audio proctoring, and live
examiner monitoring over Socket.IO.

## Stack

- **Frontend**: React + TypeScript + Vite, Tailwind, face-api.js + coco-ssd (client-side AI)
- **Backend**: Node.js + Express + MongoDB (Mongoose), Socket.IO
- **Auth**: JWT access tokens + httpOnly rotating refresh-token cookies, email OTP verification, forgot/reset password

## Feature summary

- **Auth**: register/login, email OTP verification, forgot/reset password, "remember me", account lockout after repeated failed logins, logout-all-devices
- **Exam engine**: live timer, auto-save, resume after refresh/disconnect, question navigation, mark-for-review
- **Browser security**: fullscreen enforcement, tab-switch/devtools/copy-paste detection and blocking, all logged as violations
- **AI proctoring**: face detection, head-pose estimation, eye tracking, phone/book object detection, audio noise monitoring, automatic evidence-snapshot capture
- **Violation system**: per-event severity scoring, running risk score per session, auto-flagging
- **Live monitoring**: real-time Socket.IO dashboard for examiners — live violation feed, warn/broadcast/terminate actions, CSV export

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
  controllers/   route handlers
  models/        Mongoose schemas
  routes/        Express routers
  middleware/    auth, validation, error handling
  services/      business logic shared across controllers/sockets
  socket/        Socket.IO server + rooms
  utils/         small pure helpers
  uploads/       captured proctoring evidence (git-ignored)
frontend/
  src/components/  screens + UI components
  src/hooks/       useBrowserSecurity, etc.
  src/services/    HTTP client (with auto token refresh) + Socket.IO client
  src/api/         typed API call wrappers
```

## Known limitations (documented, not hidden)

- Live camera *feeds* in the examiner's monitoring dashboard are not
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
