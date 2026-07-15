import { useCallback, useEffect, useRef, useState } from 'react';
import { apiFetch } from '../services/httpClient';

export interface SecurityViolation {
  type: string;
  severity: string;
  message: string;
  timestamp: number;
}

interface UseBrowserSecurityOptions {
  /** Only wires listeners while true — pass false to disable during loading/blocked states. */
  enabled: boolean;
}

interface UseBrowserSecurityResult {
  isFullscreen: boolean;
  isOnline: boolean;
  violationCount: number;
  riskScore: number;
  flagged: boolean;
  violations: SecurityViolation[];
  requestFullscreen: () => Promise<void>;
}

// Human-readable messages shown in the on-screen warning banner.
const MESSAGES: Record<string, string> = {
  FULLSCREEN_EXIT: 'You exited fullscreen mode.',
  FULLSCREEN_REENTERED: 'You re-entered fullscreen mode after exiting.',
  TAB_SWITCH: 'You switched away from the exam tab.',
  WINDOW_BLUR: 'The exam window lost focus.',
  RIGHT_CLICK_ATTEMPT: 'Right-click is disabled during the exam.',
  TEXT_SELECTION_ATTEMPT: 'Text selection is disabled during the exam.',
  DRAG_ATTEMPT: 'Dragging content is disabled during the exam.',
  COPY_ATTEMPT: 'Copying is disabled during the exam.',
  PASTE_ATTEMPT: 'Pasting is disabled during the exam.',
  CUT_ATTEMPT: 'Cutting is disabled during the exam.',
  SELECT_ALL_ATTEMPT: 'Select-all is disabled during the exam.',
  VIEW_SOURCE_ATTEMPT: 'Viewing page source is disabled during the exam.',
  DEVTOOLS_SHORTCUT_ATTEMPT: 'Developer tools shortcuts are disabled during the exam.',
  DEVTOOLS_OPENED: 'Developer tools appear to be open.',
  F12_ATTEMPT: 'The F12 key is disabled during the exam.',
  ESC_KEY_PRESSED: 'The Escape key was pressed.',
  PRINT_SCREEN_DETECTED: 'A screenshot key press was detected.',
  ZOOM_CHANGED: 'Browser zoom level changed.',
  WINDOW_RESIZED: 'The browser window was resized.',
  NETWORK_DISCONNECTED: 'Your internet connection was lost.',
  INCOGNITO_DETECTED: 'Private/incognito browsing was detected.',
  MULTI_MONITOR_DETECTED: 'Multiple monitors were detected.',
};

// Per-event-type cooldown so a held key or rapid resize doesn't spam the
// server with duplicate violations for what is really one continuous action.
const COOLDOWN_MS: Record<string, number> = {
  WINDOW_RESIZED: 4000,
  ZOOM_CHANGED: 4000,
  TEXT_SELECTION_ATTEMPT: 3000,
  DEVTOOLS_OPENED: 5000,
  RIGHT_CLICK_ATTEMPT: 1500,
};
const DEFAULT_COOLDOWN_MS = 1200;

// Reads the fullscreen element across every vendor-prefixed property still
// in use. `fullscreenElement`/`fullscreenchange` are the modern standard
// (current Chrome, Edge, Firefox), but older Safari/Chromium builds only
// expose the `webkit`-prefixed versions — checking all of them is what
// makes fullscreen-exit detection actually reliable across browsers,
// rather than silently doing nothing on one of them.
function getFullscreenElement(): Element | null {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
    mozFullScreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  };
  return (
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null
  );
}

export function useBrowserSecurity(
  sessionId: string | null,
  { enabled }: UseBrowserSecurityOptions
): UseBrowserSecurityResult {
  const [isFullscreen, setIsFullscreen] = useState(Boolean(getFullscreenElement()));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [violationCount, setViolationCount] = useState(0);
  const [riskScore, setRiskScore] = useState(0);
  const [flagged, setFlagged] = useState(false);
  const [violations, setViolations] = useState<SecurityViolation[]>([]);

  const lastLoggedAt = useRef<Record<string, number>>({});
  const wasBlurred = useRef(false);
  const hasEnteredFullscreenOnce = useRef(Boolean(getFullscreenElement()));
  const isFullscreenRef = useRef(Boolean(getFullscreenElement()));

  const logViolation = useCallback(
    (eventType: string, details = '') => {
      const now = Date.now();
      const cooldown = COOLDOWN_MS[eventType] ?? DEFAULT_COOLDOWN_MS;
      if (now - (lastLoggedAt.current[eventType] || 0) < cooldown) return;
      lastLoggedAt.current[eventType] = now;

      const message = MESSAGES[eventType] || eventType;

      // Show it immediately — don't wait on the network round trip.
      setViolations((prev) => [{ type: eventType, severity: 'pending', message, timestamp: now }, ...prev].slice(0, 20));

      if (!sessionId) return;

      apiFetch(`/proctor/${sessionId}/log`, {
        method: 'POST',
        body: JSON.stringify({ eventType, details }),
      })
        .then((data) => {
          setViolationCount(data.violationCount ?? 0);
          setRiskScore(data.riskScore ?? 0);
          setFlagged(Boolean(data.flagged));
          setViolations((prev) =>
            prev.map((v) => (v.timestamp === now ? { ...v, severity: data.severity || v.severity } : v))
          );
        })
        .catch(() => {
          // Best-effort — a dropped violation log shouldn't interrupt the exam.
        });
    },
    [sessionId]
  );

  const requestFullscreen = useCallback(async () => {
    try {
      if (!getFullscreenElement()) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen must be triggered by a user gesture — if this rejects
      // (e.g. called outside one), the exit-detection listener below will
      // still keep working once the student does enter fullscreen manually.
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    /* ---------------- Fullscreen ---------------- */
    const onFullscreenChange = () => {
      const nowFullscreen = Boolean(getFullscreenElement());
      isFullscreenRef.current = nowFullscreen;
      setIsFullscreen(nowFullscreen);
      if (nowFullscreen) {
        if (hasEnteredFullscreenOnce.current) {
          logViolation('FULLSCREEN_REENTERED');
        }
        hasEnteredFullscreenOnce.current = true;
      } else if (hasEnteredFullscreenOnce.current) {
        logViolation('FULLSCREEN_EXIT');
      }
    };

    /* ---------------- Tab switch / window focus ---------------- */
    const onVisibilityChange = () => {
      if (document.hidden) {
        logViolation('TAB_SWITCH');
      } else if (wasBlurred.current) {
        logViolation('WINDOW_FOCUS_RETURN');
        wasBlurred.current = false;
      }
    };

    const onBlur = () => {
      wasBlurred.current = true;
      if (!document.hidden) {
        // Focus was lost without the tab itself becoming hidden — e.g. an
        // undocked devtools window or another app overlapping the browser.
        logViolation('WINDOW_BLUR');
      }
    };

    const onFocus = () => {
      if (wasBlurred.current) {
        logViolation('WINDOW_FOCUS_RETURN');
      }
      wasBlurred.current = false;
    };

    /* ---------------- Right-click / selection / drag ---------------- */
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logViolation('RIGHT_CLICK_ATTEMPT');
    };
    const onSelectStart = (e: Event) => {
      e.preventDefault();
      logViolation('TEXT_SELECTION_ATTEMPT');
    };
    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
      logViolation('DRAG_ATTEMPT');
    };

    /* ---------------- Clipboard ---------------- */
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation('COPY_ATTEMPT');
    };
    const onPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation('PASTE_ATTEMPT');
    };
    const onCut = (e: ClipboardEvent) => {
      e.preventDefault();
      logViolation('CUT_ATTEMPT');
    };

    /* ---------------- Keyboard shortcuts ---------------- */
    const onKeyDown = (e: KeyboardEvent) => {
      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      if (e.key === 'F12') {
        e.preventDefault();
        logViolation('F12_ATTEMPT');
        return;
      }
      if (ctrlOrCmd && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
        e.preventDefault();
        logViolation('DEVTOOLS_SHORTCUT_ATTEMPT');
        return;
      }
      if (ctrlOrCmd && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        logViolation('VIEW_SOURCE_ATTEMPT');
        return;
      }
      if (ctrlOrCmd && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        logViolation('SELECT_ALL_ATTEMPT');
        return;
      }
      if (e.key === 'Escape') {
        // Browsers intentionally don't allow preventDefault() to stop
        // Escape's built-in "exit fullscreen" behavior — this can only
        // detect and log it, not block it.
        logViolation('ESC_KEY_PRESSED');
        return;
      }
      if (e.key === 'PrintScreen') {
        logViolation('PRINT_SCREEN_DETECTED');
      }
    };

    /* ---------------- Resize / zoom ---------------- */
    let lastPixelRatio = window.devicePixelRatio;
    const onResize = () => {
      logViolation('WINDOW_RESIZED');
      if (window.devicePixelRatio !== lastPixelRatio) {
        lastPixelRatio = window.devicePixelRatio;
        logViolation('ZOOM_CHANGED');
      }
    };

    /* ---------------- Network ---------------- */
    const onOnline = () => {
      setIsOnline(true);
      logViolation('NETWORK_RECONNECTED');
    };
    const onOffline = () => {
      setIsOnline(false);
      logViolation('NETWORK_DISCONNECTED');
    };

    /* ---------------- Fullscreen exit — polling fallback ----------------
       `fullscreenchange` (in all its vendor-prefixed forms above) is the
       primary signal, but polling document state independently every
       second is what makes this robust against any single browser/event
       misfiring or not firing at all — matches the requirement to not
       depend on only one detection mechanism. Cheap: just a property read. */
    const fullscreenPollInterval = window.setInterval(() => {
      const nowFullscreen = Boolean(getFullscreenElement());
      if (nowFullscreen !== isFullscreenRef.current) {
        onFullscreenChange();
      }
    }, 1000);

    document.addEventListener('fullscreenchange', onFullscreenChange);
    // Vendor-prefixed equivalents for older Safari/Chromium builds that
    // don't fire the unprefixed event at all.
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    document.addEventListener('mozfullscreenchange', onFullscreenChange);
    document.addEventListener('MSFullscreenChange', onFullscreenChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('selectstart', onSelectStart);
    document.addEventListener('dragstart', onDragStart);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    document.addEventListener('cut', onCut);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Best-effort: disable text selection visually while the exam is active.
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    /* ---------------- DevTools heuristic (window-size gap) ----------------
       Not 100% reliable (false positives on some OS toolbars / on-screen
       keyboards), but it's the standard best-effort browser-side signal —
       there is no real DOM API that can confirm devtools are open. */
    const devtoolsThreshold = 160;
    const devtoolsInterval = window.setInterval(() => {
      const widthGap = window.outerWidth - window.innerWidth;
      const heightGap = window.outerHeight - window.innerHeight;
      if (widthGap > devtoolsThreshold || heightGap > devtoolsThreshold) {
        logViolation('DEVTOOLS_OPENED');
      }
    }, 1500);

    /* ---------------- Multi-monitor (best-effort, Chrome-only) ----------------
       screen.isExtended is available without a permission prompt in
       Chromium browsers; it's simply undefined elsewhere, so this silently
       does nothing on unsupported browsers rather than faking a result. */
    const screenAny = window.screen as unknown as { isExtended?: boolean };
    if (screenAny.isExtended) {
      logViolation('MULTI_MONITOR_DETECTED');
    }

    /* ---------------- Incognito heuristic (best-effort, Chrome-only) ----------------
       Chrome's incognito mode caps the StorageManager quota estimate far
       below normal browsing; this is a known heuristic, not a guarantee,
       and Firefox/Safari private modes aren't reliably detectable this way
       — so this only ever logs a positive, never a false "not incognito". */
    if (navigator.storage?.estimate) {
      navigator.storage
        .estimate()
        .then(({ quota }) => {
          if (typeof quota === 'number' && quota > 0 && quota < 120_000_000) {
            logViolation('INCOGNITO_DETECTED');
          }
        })
        .catch(() => {});
    }

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      document.removeEventListener('mozfullscreenchange', onFullscreenChange);
      document.removeEventListener('MSFullscreenChange', onFullscreenChange);
      window.clearInterval(fullscreenPollInterval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('selectstart', onSelectStart);
      document.removeEventListener('dragstart', onDragStart);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('cut', onCut);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.clearInterval(devtoolsInterval);
      document.body.style.userSelect = previousUserSelect;
    };
  }, [enabled, logViolation]);

  return { isFullscreen, isOnline, violationCount, riskScore, flagged, violations, requestFullscreen };
}
