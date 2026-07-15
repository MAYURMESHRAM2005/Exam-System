import { useState } from "react";
import { Loader2, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import { changePassword } from "../api/auth";

interface Props {
  onClose: () => void;
}

// Pure function — no DOM dependency — so it's independently testable.
// Deliberately simple (length + character-class variety) rather than a
// full entropy calculation; matches the exact requirements already
// enforced server-side (8+ chars, upper, lower, number, special char).
export function computePasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "bg-slate-200" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  const levels = [
    { label: "Very Weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-red-400" },
    { label: "Fair", color: "bg-amber-400" },
    { label: "Good", color: "bg-emerald-400" },
    { label: "Strong", color: "bg-emerald-500" },
    { label: "Very Strong", color: "bg-emerald-600" },
  ];
  const level = levels[Math.min(score, levels.length - 1)];
  return { score, label: level.label, color: level.color };
}

export function ChangePasswordModal({ onClose }: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const strength = computePasswordStrength(newPassword);
  const passwordsMatch = confirmPassword.length === 0 || confirmPassword === newPassword;

  const handleChange = async () => {
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await changePassword({ oldPassword, newPassword });
      setSuccess(data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({
    value,
    onChange,
    placeholder,
    show,
    setShow,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    show: boolean;
    setShow: (v: boolean) => void;
  }) => (
    <div className="relative mb-3">
      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        className="w-full p-2 pr-10 border rounded"
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        tabIndex={-1}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>

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

        <PasswordField value={oldPassword} onChange={setOldPassword} placeholder="Current Password" show={showOld} setShow={setShowOld} />

        <PasswordField value={newPassword} onChange={setNewPassword} placeholder="New Password" show={showNew} setShow={setShowNew} />

        {newPassword && (
          <div className="mb-3 -mt-2">
            <div className="flex gap-1 mb-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${i <= strength.score ? strength.color : "bg-slate-200"}`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">{strength.label}</p>
          </div>
        )}

        <PasswordField
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirm New Password"
          show={showConfirm}
          setShow={setShowConfirm}
        />
        {!passwordsMatch && (
          <p className="text-xs text-red-600 mb-3 -mt-2">Passwords do not match.</p>
        )}

        <p className="text-xs text-slate-500 mb-3">
          At least 8 characters, with an uppercase letter, a lowercase letter, a number, and a special character.
        </p>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button
            onClick={handleChange}
            disabled={loading || !oldPassword || !newPassword || !confirmPassword || !passwordsMatch}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
