import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { requestEmailChange, resendEmailChangeOtp, confirmEmailChange } from "../api/auth";

interface Props {
  currentEmail: string;
  onClose: () => void;
  onEmailChanged: (newEmail: string) => void;
}

export function ChangeEmailModal({ currentEmail, onClose, onEmailChanged }: Props) {
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRequest = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const data = await requestEmailChange({ newEmail, password });
      setSuccess(data.message);
      setStep("confirm");
    } catch (err: any) {
      setError(err.message || "Failed to start email change");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const data = await resendEmailChangeOtp();
      setSuccess(data.message);
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const data = await confirmEmailChange(otp);
      setSuccess(data.message);
      onEmailChanged(data.email);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to confirm email change");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-1">Change Email</h2>
        <p className="text-xs text-slate-500 mb-4">
          Current: <span className="font-medium text-slate-700">{currentEmail}</span>
        </p>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-3">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-sm text-emerald-700 mb-3">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {step === "request" && (
          <>
            <input
              type="email"
              placeholder="New email address"
              value={newEmail}
              className="w-full mb-3 p-2 border rounded"
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current password"
              value={password}
              className="w-full mb-1 p-2 border rounded"
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-slate-500 mb-3">
              We'll send a verification code to the new address before anything changes.
            </p>

            <div className="flex justify-end gap-2">
              <button onClick={onClose} disabled={loading}>Cancel</button>
              <button
                onClick={handleRequest}
                disabled={loading || !newEmail || !password}
                className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Sending..." : "Send Code"}
              </button>
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <input
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={otp}
              maxLength={6}
              className="w-full mb-1 p-2 border rounded tracking-widest text-center"
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
            <p className="text-xs text-slate-500 mb-3">
              Enter the 6-digit code sent to your new email address.
            </p>

            <div className="flex justify-between items-center">
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-xs text-indigo-600 hover:text-indigo-700 disabled:opacity-60"
              >
                Resend code
              </button>

              <div className="flex gap-2">
                <button onClick={onClose} disabled={loading}>Cancel</button>
                <button
                  onClick={handleConfirm}
                  disabled={loading || otp.length !== 6}
                  className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Confirming..." : "Confirm"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
