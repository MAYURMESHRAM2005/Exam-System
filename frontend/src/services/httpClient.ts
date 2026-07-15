import { API_BASE_URL } from '../config/env';
import { refreshSocketAuth } from './socket';

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(message: string, status: number, body: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

// Reads the (intentionally non-httpOnly) csrfToken cookie set by the backend
// alongside the refresh-token cookie. Required as a header on any endpoint
// that authenticates purely off a cookie (refresh, logout) — see
// backend/utils/csrf.js for the double-submit-cookie rationale.
export function getCsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)csrfToken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

let refreshPromise: Promise<boolean> | null = null;

/**
 * Calls POST /auth/refresh using the httpOnly refresh-token cookie.
 * De-duplicated: if several requests 401 at once, only one refresh call
 * is made and everyone awaits the same promise.
 */
async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const csrfToken = getCsrfToken();
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
        });
        if (!res.ok) return false;
        const data = await res.json();
        localStorage.setItem('token', data.token);
        if (data.name) localStorage.setItem('name', data.name);
        refreshSocketAuth();
        return true;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

interface ApiFetchOptions extends RequestInit {
  /** Skip the automatic refresh-and-retry-once behavior (used by auth endpoints themselves). */
  skipAuthRetry?: boolean;
}

/**
 * Wrapper around fetch() that:
 *  - prefixes API_BASE_URL
 *  - attaches the Authorization header from localStorage
 *  - always sends credentials so the httpOnly refresh cookie travels with it
 *  - on a 401, tries a single silent refresh + retry before giving up
 */
export async function apiFetch(path: string, options: ApiFetchOptions = {}): Promise<any> {
  const { skipAuthRetry, headers, ...rest } = options;

  const doFetch = async (): Promise<Response> => {
    const token = localStorage.getItem('token');
    const csrfToken = getCsrfToken();
    return fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        ...headers,
      },
    });
  };

  let res = await doFetch();

  if (res.status === 401 && !skipAuthRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      res = await doFetch();
    }
  }

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    // no JSON body (e.g. 204)
  }

  if (!res.ok) {
    throw new ApiError(body?.message || 'Something went wrong', res.status, body);
  }

  return body;
}

// apiFetch always parses the response as JSON, which breaks for binary
// export endpoints (CSV/XLSX/PDF) — this is the same auth/credentials
// setup, but reads a blob and triggers a real browser download instead.
export async function downloadFile(path: string, fallbackFilename: string): Promise<void> {
  const token = localStorage.getItem('token');
  const csrfToken = getCsrfToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
    },
  });

  if (!res.ok) {
    let message = 'Failed to download file';
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // response wasn't JSON (e.g. the file streamed partway then errored) — keep the fallback message
    }
    throw new ApiError(message, res.status, null);
  }

  const disposition = res.headers.get('Content-Disposition') || '';
  const match = disposition.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] || fallbackFilename;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
