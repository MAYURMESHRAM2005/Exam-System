import { useState } from 'react';
import { ArrowLeft, KeyRound, Loader2 } from 'lucide-react';
import { forgotPassword } from '../api/auth';

interface ForgotPasswordProps {
  onCodeSent: (email: string) => void;
  onBack: () => void;
}

export function ForgotPassword({ onCodeSent, onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
    } catch (err: any) {
      // forgotPassword never throws for "email not found" (generic response
      // by design), but network/validation errors still surface here.
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <KeyRound className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot password</h1>
          <p className="text-slate-600">Enter your account email and we'll send you a reset code.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          {message ? (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-sm text-emerald-700">
                {message}
              </div>
              <button
                onClick={() => onCodeSent(email)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                I have my code — Reset password
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Sending...' : 'Send reset code'}
              </button>
            </form>
          )}

          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-slate-700 mt-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </button>
        </div>
      </div>
    </div>
  );
}
