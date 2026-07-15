# Production Checklist

Status reflects what's actually implemented in this codebase as of this
build — ✅ done, ⚠️ partial/needs your input, ❌ not implemented.

## Security

- ✅ Passwords hashed with bcrypt (cost 12), never returned in API responses (`select: false`)
- ✅ JWT access tokens are short-lived (15m default); refresh tokens are opaque, hashed at rest, httpOnly + `secure` in production, rotated on every use
- ✅ Account lockout after 5 failed logins (15 min), rate limiting on auth/OTP/forgot-password endpoints
- ✅ Helmet, CORS locked to an explicit origin (required for the credentialed refresh cookie)
- ✅ Input validation via express-validator on every mutating route
- ✅ Role-based authorization checked server-side on every exam/proctor/result route — never trust a client-sent role
- ⚠️ **You must set** `JWT_SECRET` to a real random value before deploying — the app will run with an empty/weak one otherwise
- ⚠️ **You must configure real SMTP** in production — without it, password reset and OTP verification silently only log to the server console
- ❌ No CSRF token — mitigated by `sameSite: lax` refresh cookie + requiring a valid Bearer access token for all mutating requests, but a dedicated CSRF token is not implemented
- ❌ No WAF / DDoS protection — put this behind Cloudflare or a cloud load balancer with rate limiting if internet-facing

## AI Proctoring / Privacy

- ⚠️ Webcam/mic access, face detection, and audio monitoring run in the
  browser — **you are responsible for your own compliance** (consent
  language, data retention policy, applicable privacy law) before deploying
  to real students. Nothing in this codebase provides legal compliance.
- ✅ Evidence snapshots are stored on your own server (`backend/uploads`),
  not a third party — but there's no automatic retention/deletion policy;
  add one appropriate to your institution's requirements.

## Reliability

- ✅ MongoDB TTL index auto-expires stale refresh-token sessions
- ✅ Exam auto-save + resume survives refresh/disconnect; server-side deadline enforcement force-submits expired attempts even if the student never returns
- ✅ Docker healthcheck hits a real `/api/health` endpoint that checks DB connectivity, not just process liveness
- ❌ No automated backups configured for the `mongo_data` volume — set up your own (e.g. `mongodump` on a cron, or use a managed MongoDB Atlas cluster instead of the bundled container for anything real)
- ❌ Socket.IO is single-instance (see DEPLOYMENT.md) — do not scale the backend horizontally without adding a shared adapter first, or live monitoring will silently miss events for some connected examiners

## Performance

- ✅ Vite production build (minified, content-hashed assets, cached aggressively by the frontend Nginx config)
- ✅ AI proctoring models are lazy-loaded (face-api models on mount, coco-ssd via dynamic `import()`), not bundled into the initial page load
- ⚠️ No CDN configured for static assets — add one (CloudFront/Cloudflare) in front of the frontend for anything beyond a single-region deployment
- ⚠️ No database indexes audit beyond what's declared in the Mongoose schemas — review query patterns against real usage before high-volume launch

## Before you flip the switch

1. Run through a full exam end-to-end on the actual deployed URLs (not localhost) — camera/mic permissions and fullscreen behave differently across browsers.
2. Confirm OTP verification and password-reset emails actually arrive (real SMTP, not the dev console fallback).
3. Load-test the `/api/results/:id/save` autosave endpoint at your expected concurrent-student count.
4. Decide and document your evidence-image retention period.
5. Have a real privacy notice / consent flow for camera+mic+screen monitoring — this is a legal requirement in many jurisdictions and is out of scope for this codebase to provide.
