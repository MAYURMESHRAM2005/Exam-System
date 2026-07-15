import { useEffect, useState } from "react";
import { ArrowLeft, User, Mail, Phone, FileText, Loader2, AlertCircle, CheckCircle, ShieldCheck, ShieldAlert, Monitor, LogOut, KeyRound, Clock, Calendar, MapPin, GraduationCap, History, BarChart3 } from "lucide-react";
import { getMe, updateProfile as updateProfileApi, listSessions, revokeSession, type Profile, type DeviceSession, type ProfileUpdatePayload } from "../api/auth";
import { API_ORIGIN } from "../config/env";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { ChangeEmailModal } from "./ChangeEmailModal";
import { AvatarUploader } from "./AvatarUploader";
import { ExamStatisticsCard } from "./ExamStatisticsCard";
import { ActivityTimeline } from "./ActivityTimeline";

function describeDevice(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  let os = "Unknown OS";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad")) os = "iOS";
  else if (ua.includes("linux")) os = "Linux";

  let browser = "Unknown browser";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome/")) browser = "Chrome";
  else if (ua.includes("firefox/")) browser = "Firefox";
  else if (ua.includes("safari/")) browser = "Safari";

  return `${browser} on ${os}`;
}

interface ProfilePageProps {
  onBack: () => void;
  onProfileUpdated?: (profile: Profile) => void;
}

const emptyForm = {
  name: "",
  phone: "",
  bio: "",
  enrollmentNumber: "",
  collegeName: "",
  branch: "",
  semester: "",
  rollNumber: "",
  gender: "",
  dateOfBirth: "",
  address: "",
  city: "",
  state: "",
  country: "",
};

export function ProfilePage({ onBack, onProfileUpdated }: ProfilePageProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [sessions, setSessions] = useState<DeviceSession[] | null>(null);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const setField = (field: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const loadSessions = async () => {
    try {
      const data = await listSessions();
      setSessions(data.sessions);
      setSessionsError(null);
    } catch (err: any) {
      setSessionsError(err.message || "Couldn't load your active sessions.");
    }
  };

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await revokeSession(id);
      setSessions((prev) => (prev ? prev.filter((s) => s.id !== id) : prev));
    } catch (err: any) {
      setSessionsError(err.message || "Couldn't revoke that session.");
    } finally {
      setRevokingId(null);
    }
  };

  const applyProfile = (data: Profile) => {
    setProfile(data);
    onProfileUpdated?.(data);
    setForm({
      name: data.name || "",
      phone: data.phone || "",
      bio: data.bio || "",
      enrollmentNumber: data.enrollmentNumber || "",
      collegeName: data.collegeName || "",
      branch: data.branch || "",
      semester: data.semester || "",
      rollNumber: data.rollNumber || "",
      gender: data.gender || "",
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      country: data.country || "",
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        applyProfile(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong while loading your profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (form.name.trim().length < 2) errs.name = "Name must be at least 2 characters.";

    if (form.phone) {
      const digitsOnly = form.phone.replace(/[\s-()]/g, "");
      if (!/^[0-9]{7,15}$/.test(digitsOnly)) errs.phone = "Enter a valid mobile number (7-15 digits).";
    }

    if (form.dateOfBirth) {
      const dob = new Date(form.dateOfBirth);
      if (dob > new Date()) errs.dateOfBirth = "Date of birth cannot be in the future.";
    }

    if (form.address.length > 300) errs.address = "Address is too long.";

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    setError(null);
    setSaved(false);

    if (!validateForm()) return;

    setSaving(true);
    try {
      const payload: ProfileUpdatePayload = { ...form };
      if (!payload.dateOfBirth) delete payload.dateOfBirth;
      if (!payload.gender) delete payload.gender;

      const data = await updateProfileApi(payload);
      applyProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong while saving your profile.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field: string) =>
    `flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
      fieldErrors[field] ? "border-red-400" : ""
    }`;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-6 text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft /> Back
      </button>

      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 py-6">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading your profile...</span>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 mb-4">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && profile && (
          <>
            <div className="flex justify-center mb-6">
              <AvatarUploader
                avatarUrl={profile.avatarUrl}
                apiOrigin={API_ORIGIN}
                onChanged={(avatarUrl) =>
                  setProfile((prev) => {
                    if (!prev) return prev;
                    const updated = { ...prev, avatarUrl };
                    onProfileUpdated?.(updated);
                    return updated;
                  })
                }
              />
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <User className="text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Full name"
                    className={inputClass("name")}
                  />
                </div>
                {fieldErrors.name && <p className="text-xs text-red-600 mt-1 ml-9">{fieldErrors.name}</p>}
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-slate-400 flex-shrink-0" />
                <span className="flex-1">{profile.email || "No Email"}</span>
                {profile.isEmailVerified ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    <ShieldAlert className="w-3 h-3" /> Unverified
                  </span>
                )}
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex-shrink-0"
                >
                  Change
                </button>
              </div>

              {profile.pendingEmail && (
                <div className="flex items-center gap-2 -mt-2 ml-9 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                  <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    Verification pending for <span className="font-medium">{profile.pendingEmail}</span>
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center gap-3">
                  <Phone className="text-slate-400 flex-shrink-0" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="Mobile number"
                    className={inputClass("phone")}
                  />
                </div>
                {fieldErrors.phone && <p className="text-xs text-red-600 mt-1 ml-9">{fieldErrors.phone}</p>}
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-slate-400 flex-shrink-0" />
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setField("dateOfBirth", e.target.value)}
                  className={inputClass("dateOfBirth")}
                />
                <select
                  value={form.gender}
                  onChange={(e) => setField("gender", e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
              {fieldErrors.dateOfBirth && <p className="text-xs text-red-600 -mt-3 ml-9">{fieldErrors.dateOfBirth}</p>}

              <div className="flex items-start gap-3">
                <MapPin className="text-slate-400 mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    placeholder="Address"
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      placeholder="City"
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) => setField("state", e.target.value)}
                      placeholder="State"
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) => setField("country", e.target.value)}
                      placeholder="Country"
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {profile.role === "student" && (
                <div className="flex items-start gap-3">
                  <GraduationCap className="text-slate-400 mt-2 flex-shrink-0" />
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={form.enrollmentNumber}
                      onChange={(e) => setField("enrollmentNumber", e.target.value)}
                      placeholder="Enrollment number"
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={form.rollNumber}
                      onChange={(e) => setField("rollNumber", e.target.value)}
                      placeholder="Roll number"
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={form.collegeName}
                      onChange={(e) => setField("collegeName", e.target.value)}
                      placeholder="College name"
                      className="col-span-2 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={form.branch}
                      onChange={(e) => setField("branch", e.target.value)}
                      placeholder="Branch"
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={form.semester}
                      onChange={(e) => setField("semester", e.target.value)}
                      placeholder="Semester"
                      className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <FileText className="text-slate-400 mt-2 flex-shrink-0" />
                <textarea
                  value={form.bio}
                  onChange={(e) => setField("bio", e.target.value)}
                  placeholder="Add a short bio"
                  className="flex-1 border rounded-lg px-3 py-2 h-24 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t">
                <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                <span>
                  Last login {profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : "—"}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Profile completion</span>
                <span className="font-medium text-slate-900">
                  {profile.profileCompletionPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${profile.profileCompletionPercent}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saved && <CheckCircle className="w-4 h-4" />}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
            </button>
          </>
        )}
      </div>

      {!loading && profile && profile.role === "student" && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow mt-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold">Exam Statistics</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Your performance across every exam you've taken.</p>
          <ExamStatisticsCard />
        </div>
      )}

      {!loading && profile && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow mt-6">
          <h3 className="text-lg font-bold mb-1">Account Security</h3>
          <p className="text-sm text-slate-500 mb-4">
            Manage your password and how you sign in.
          </p>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 border rounded-lg px-4 py-2.5 hover:bg-slate-50"
          >
            <KeyRound className="w-4 h-4 text-slate-400" />
            Change Password
          </button>
        </div>
      )}

      {!loading && profile && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow mt-6">
          <h3 className="text-lg font-bold mb-1">Login Devices</h3>
          <p className="text-sm text-slate-500 mb-4">
            Devices currently signed in to your account.
          </p>

          {sessionsError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{sessionsError}</span>
            </div>
          )}

          {sessions === null && !sessionsError && (
            <div className="flex items-center gap-2 text-slate-500 py-4 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading devices...</span>
            </div>
          )}

          {sessions && sessions.length === 0 && (
            <p className="text-sm text-slate-500 py-2">No active sessions found.</p>
          )}

          {sessions && sessions.length > 0 && (
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 border rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Monitor className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900 truncate">
                          {describeDevice(s.userAgent)}
                        </span>
                        {s.isCurrent && (
                          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                            This device
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Last active {new Date(s.lastActiveAt).toLocaleString()}
                        {s.rememberMe && " · Remember me"}
                      </div>
                    </div>
                  </div>

                  {!s.isCurrent && (
                    <button
                      onClick={() => handleRevoke(s.id)}
                      disabled={revokingId === s.id}
                      className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-50 flex-shrink-0"
                    >
                      {revokingId === s.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      Log out
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!loading && profile && (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow mt-6 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold">Activity Timeline</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Recent account and exam activity.</p>
          <ActivityTimeline />
        </div>
      )}

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {showEmailModal && profile && (
        <ChangeEmailModal
          currentEmail={profile.email}
          onClose={() => setShowEmailModal(false)}
          onEmailChanged={(newEmail) =>
            setProfile((prev) => (prev ? { ...prev, email: newEmail, pendingEmail: null } : prev))
          }
        />
      )}
    </div>
  );
}
