# Deployment Guide

Two supported paths: **Docker Compose** (recommended — one command, everything
wired together) or **PM2 + a system-installed Nginx** (for a bare VM without Docker).

---

## Option A — Docker Compose

### 1. Prerequisites
- Docker + Docker Compose v2
- A domain pointed at your server (for real TLS — see step 5)

### 2. Configure environment
```bash
cp .env.example .env                      # root — sets VITE_API_URL for the frontend build
cp backend/.env.example backend/.env      # fill in JWT_SECRET, SMTP_*, etc.
```

In `.env` (root) and `backend/.env`, set both to your real public domain so
frontend and API are same-origin behind the bundled reverse proxy:
```
# root .env
VITE_API_URL=https://exam.example.com/api

# backend/.env
CLIENT_URL=https://exam.example.com
NODE_ENV=production
```

`JWT_SECRET` must be a long random string — generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 3. Build and start
```bash
docker compose up -d --build
```

This starts four containers: `mongo`, `backend`, `frontend` (static build
served by its own internal Nginx), and a top-level `nginx` reverse proxy on
port 80 that routes `/api`, `/socket.io`, and `/uploads` to the backend and
everything else to the frontend.

### 4. Verify
```bash
curl http://localhost/api/health
# {"status":"ok","db":"connected","uptimeSeconds":...}
```

### 5. TLS (HTTPS)
The bundled `nginx/nginx.conf` serves plain HTTP on port 80 — it does not
fabricate or bundle any certificates. The straightforward way to add TLS:
run [Certbot](https://certbot.eff.org/) against the `nginx` container (or
put a managed load balancer / Cloudflare in front of it) and extend
`nginx/nginx.conf` with a `listen 443 ssl` server block pointing at the
issued cert files. This is an infrastructure decision specific to your
host/registrar, so it's intentionally left as a documented step rather than
a guessed-at config.

### Updating uploaded evidence retention
Captured evidence images live in the `evidence_uploads` named volume. If you
need a retention policy (e.g. auto-delete after 90 days), add a cron job on
the host or a scheduled task in the container — not included by default
since retention requirements vary by institution/policy.

---

## Option B — PM2 + system Nginx (no Docker)

### 1. Backend
```bash
cd backend
npm ci --omit=dev
cp .env.example .env   # fill in real values, NODE_ENV=production
npm install -g pm2
pm2 start ../ecosystem.config.js --env production
pm2 save && pm2 startup   # persist across reboots — follow the printed instructions
```

### 2. Frontend
```bash
cd frontend
npm ci
VITE_API_URL=https://exam.example.com/api npm run build
# copy the resulting dist/ to wherever your system Nginx serves static files, e.g.:
sudo rsync -a dist/ /var/www/exam-frontend/
```

### 3. System Nginx
Adapt `nginx/nginx.conf` (from this repo) for a bare-metal install: replace
the `frontend` upstream with your static file root (`root /var/www/exam-frontend;`
+ the same SPA `try_files` fallback from `frontend/nginx.conf`), and point
the `backend` upstream at `127.0.0.1:5000` (PM2 runs the backend locally,
not in a container). Reload with `sudo nginx -s reload`.

### Scaling note
`ecosystem.config.js` intentionally runs a single backend instance. This app
uses Socket.IO for live proctoring; running more than one instance requires
a shared adapter (e.g. `@socket.io/redis-adapter`) so a violation broadcast
from one worker reaches examiners connected to another — that isn't wired
up in this codebase. Scale vertically, or add the Redis adapter + sticky
sessions, before increasing instance count.

---

## Environment variables reference

See `backend/.env.example` and `frontend/.env.example` for the full,
commented list. The ones that must be set correctly per-environment (not
left at their local-dev defaults):

| Variable | Where | Purpose |
|---|---|---|
| `JWT_SECRET` | backend | Signs access tokens — long random string, never reused across environments |
| `MONGO_URI` | backend | Production MongoDB connection string |
| `CLIENT_URL` | backend | CORS origin — must be the real frontend origin, not `*` (refresh cookie needs `credentials: true`) |
| `SMTP_HOST`/`PORT`/`USER`/`PASS` | backend | Required in production — without it, OTP/reset emails only log to console |
| `VITE_API_URL` | frontend (build-time) | Where the frontend calls the API — baked into the build, not runtime-configurable |
