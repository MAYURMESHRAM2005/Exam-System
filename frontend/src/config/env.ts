// Centralized environment config. Falls back to localhost so local dev
// keeps working without a .env file, but production deployments should
// set VITE_API_URL (see .env.example).
export const API_BASE_URL: string =
  import.meta.env?.VITE_API_URL || 'http://localhost:5000/api';

// The server origin (no "/api" suffix) — used for absolute links to
// statically-served assets like captured proctoring evidence images.
export const API_ORIGIN: string = API_BASE_URL.replace(/\/api\/?$/, '');

// Google OAuth Client ID for "Continue with Google" + One Tap. Empty
// string (not undefined) when unset, so components can cheaply check
// `if (GOOGLE_CLIENT_ID)` to hide the button rather than rendering a
// broken one when the feature isn't configured for this deployment.
export const GOOGLE_CLIENT_ID: string =
  import.meta.env?.VITE_GOOGLE_CLIENT_ID || '';
