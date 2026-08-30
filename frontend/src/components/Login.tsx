import { useEffect, useRef, useState } from 'react';
import type React from 'react';
import type { UserRole } from '../types';
import { GraduationCap, Lock, Mail, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { registerUser, loginUser, googleAuth } from '../api/auth';
import { ApiError } from '../services/httpClient';
import { GOOGLE_CLIENT_ID } from '../config/env';

interface LoginProps {
  onLogin: (role: UserRole, name: string) => void;
  onRegistered: (email: string) => void;
  onForgotPassword: () => void;
}

// Minimal shape of the `window.google` Identity Services API actually used
// here — the full type-def package isn't worth pulling in for four calls.
interface GoogleIdentityServices {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
        auto_select?: boolean;
      }) => void;
      renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
      prompt: () => void;
      cancel: () => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityServices;
  }
}

const getErrorMessage = (err: unknown, fallback: string): string =>
  err instanceof Error && err.message ? err.message : fallback;

export function Login({ onLogin, onRegistered, onForgotPassword }: LoginProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError(null);
  };

  // Google Sign-In: renders the official "Continue with Google" button
  // into googleButtonRef, and (only on the sign-in step, not while someone
  // is mid-registration) triggers the One Tap prompt. Re-runs whenever the
  // register/sign-in mode or selected role changes so the callback below
  // always closes over fresh state, and so the button's label can switch
  // between "Sign in with Google" / "Sign up with Google".
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return; // feature not configured for this deployment

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const handleCredential = async (response: { credential: string }) => {
      setLoading(true);
      setError(null);
      try {
        const data = await googleAuth({
          credential: response.credential,
          role: isRegister ? 'student' : undefined,
          rememberMe,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name);
        onLogin(data.role, data.name);
      } catch (err) {
        setError(getErrorMessage(err, 'Google sign-in failed'));
      } finally {
        setLoading(false);
      }
    };

    const setup = () => {
      if (cancelled) return;
      const google = window.google;
      if (!google?.accounts?.id) {
        // The GSI <script> in index.html loads async — poll briefly until
        // it's ready rather than assuming a fixed load order.
        retryTimer = setTimeout(setup, 200);
        return;
      }

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredential,
        auto_select: false,
      });

      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = '';
        google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: 336,
          text: isRegister ? 'signup_with' : 'signin_with',
        });
      }

      if (!isRegister) {
        google.accounts.id.prompt(); // One Tap
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      window.google?.accounts.id.cancel();
    };
  }, [isRegister, rememberMe, onLogin]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const data = await registerUser({ name, email, password, role: 'student' });
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name);
        onLogin(data.role, data.name);
        return;
      }

      const data = await loginUser({ email, password, rememberMe });
      localStorage.setItem('token', data.token);
      localStorage.setItem('name', data.name);
      onLogin(data.role, data.name);
    } catch (err) {
      if (err instanceof ApiError && err.body?.emailNotVerified) {
        onRegistered(err.body.email || email);
        return;
      }
      setError(getErrorMessage(err, 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            ExamSecure AI
          </h1>
          <p className="text-slate-600">Secure Online Examination System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            {isRegister ? 'Create Student Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-5">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {GOOGLE_CLIENT_ID && (
            <>
              <div className="flex justify-center mb-5" ref={googleButtonRef} />
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-medium text-slate-400 uppercase">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">



            {/* Full Name (Only for Register) */}
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {isRegister && (
                <p className="text-xs text-slate-500 mt-1">
                  At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.
                </p>
              )}
            </div>

            {!isRegister && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-indigo-600 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading
                ? 'Please wait...'
                : isRegister
                ? 'Create Account'
                : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={toggleMode}
              className="ml-1 text-indigo-600 font-medium"
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
