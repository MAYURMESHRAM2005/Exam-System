import { useEffect, useState } from 'react';
import { Bell, Calendar, Clock, FileText, User, AlertCircle, CheckCircle, Trophy, Loader2 } from 'lucide-react';
import { apiFetch } from '../services/httpClient';
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationBell } from './NotificationBell';
import { getNotifications, type AppNotification } from '../api/notifications';
import { NOTIFICATION_TYPE_LABELS, getNotificationTone } from '../utils/notificationDisplay';
import { timeAgo } from '../utils/timeAgo';
import { computeStatus, calculateCountdown, formatCountdown, type ExamStatus } from '../utils/examTime';

interface StudentDashboardProps {
  userName: string | null;
  avatarUrl?: string | null;
  onStartExam: (examId: string) => void;
  onViewResults: (resultId?: string) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

// ✅ Shape returned by GET /api/exams/available
interface AvailableExam {
  _id: string;
  title: string;
  courseCode: string;
  date: string;
  time: string;
  duration: number;
  // Canonical UTC instants returned by the backend — see
  // backend/models/Exam.js and frontend/src/utils/examTime.ts.
  startAtUTC?: string;
  endAtUTC?: string;
  cancelled?: boolean;
  computedStatus: ExamStatus;
  proctoring?: {
    enableProctoring?: boolean;
  };
}

// ✅ Shape returned by GET /api/results/mine
interface MyResult {
  resultId: string;
  examTitle: string;
  courseCode: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
}

// ✅ Shape returned by GET /api/auth/me
interface Profile {
  name: string;
  email: string;
  profileCompletionPercent: number;
}

const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'Date TBD';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Date TBD';
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Date TBD';
  }
};


export function StudentDashboard({ userName, avatarUrl, onStartExam, onViewResults, onOpenProfile, onLogout }: StudentDashboardProps) {
  const [exams, setExams] = useState<AvailableExam[]>([]);
  const [results, setResults] = useState<MyResult[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentNotifications, setRecentNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Live clock, ticked every second, used to recompute each exam's status
  // client-side (see computeStatus() below) so "Start Exam" appears exactly
  // when an exam goes live — without needing the student to refresh the page.
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const fetchDashboardData = async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!silent) setLoading(true);
      setError(null);

      try {
        const [examsData, resultsData, profileData, notificationsData] = await Promise.all([
          apiFetch('/exams/available'),
          apiFetch('/results/mine'),
          apiFetch('/auth/me'),
          getNotifications({ limit: 6 }),
        ]);

        setExams(examsData);
        setResults(resultsData);
        setProfile(profileData);
        setRecentNotifications(notificationsData.notifications);
      } catch (err) {
        // Don't blank out an already-loaded dashboard with an error banner
        // just because a background silent refetch failed.
        if (!silent) {
          setError(err instanceof Error ? err.message : 'Something went wrong while loading your dashboard.');
        }
      } finally {
        if (!silent) setLoading(false);
      }
    };

    fetchDashboardData();

    const clockHandle = setInterval(() => setNowMs(Date.now()), 1000);
    // Re-sync with the backend periodically — the source of truth for
    // computedStatus — so an exam going live (or a result appearing after
    // auto-completion) shows up without a manual refresh.
    const refetchHandle = setInterval(() => fetchDashboardData({ silent: true }), 30000);

    return () => {
      clearInterval(clockHandle);
      clearInterval(refetchHandle);
    };
  }, []);

  // ===== Derived stats (all computed from real data — nothing hardcoded) =====
  const completedCount = results.length;
  const averageScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="ml-3 text-xl font-semibold text-slate-900">ExamSecure AI</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <NotificationBell />
              <ProfileDropdown
                userName={userName}
                avatarUrl={avatarUrl}
                onLogout={onLogout}
                onProfile={onOpenProfile}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Welcome back, {userName || 'Student'}!</h2>
          <p className="text-sm sm:text-base text-slate-600">Here's your exam schedule and performance overview</p>
        </div>

        {!loading && error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 mb-8">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Upcoming Exams</span>
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{loading ? '–' : exams.length}</p>
            <p className="text-xs text-slate-500 mt-1">
              {loading ? 'Loading...' : exams.length > 0 ? `${exams.length} exam(s) available` : 'No exams scheduled'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Completed</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{loading ? '–' : completedCount}</p>
            <p className="text-xs text-slate-500 mt-1">Exams submitted</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Avg. Score</span>
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {loading ? '–' : averageScore !== null ? `${averageScore}%` : 'N/A'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {averageScore !== null ? `Across ${completedCount} exam(s)` : 'No exams completed yet'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Profile</span>
              <User className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {loading ? '–' : `${profile?.profileCompletionPercent ?? 0}%`}
            </p>
            <p className="text-xs text-orange-600 mt-1">
              {profile && profile.profileCompletionPercent < 100 ? 'Complete profile' : 'Profile complete'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Exams */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900">Upcoming Exams</h3>
              </div>
              <div className="p-6 space-y-4">
                {loading && (
                  <div className="flex items-center justify-center gap-2 text-slate-500 py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading your exams...</span>
                  </div>
                )}

                {!loading && !error && exams.length === 0 && (
                  <p className="text-sm text-slate-500 py-8 text-center">
                    No exams are available right now. Check back later.
                  </p>
                )}

                {!loading && !error && exams.map((exam) => {
                  // Recomputed every tick from the exam's canonical
                  // startAtUTC/endAtUTC — this is what makes "Start Exam"
                  // appear exactly when the exam goes live, without a
                  // manual page refresh, and disappear again once it ends.
                  const liveStatus = computeStatus(exam, nowMs);
                  const isLive = liveStatus === 'live';
                  const countdownMs = calculateCountdown(exam, nowMs);

                  return (
                  <div
                    key={exam._id}
                    className="border border-slate-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">{exam.title}</h4>
                        <p className="text-sm text-slate-600">{exam.courseCode}</p>
                      </div>
                      {exam.proctoring?.enableProctoring && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          AI Proctored
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(exam.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{exam.time}</span>
                      </div>
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs">{exam.duration} min</span>
                      {isLive && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          Live Now
                        </span>
                      )}
                    </div>

                    {isLive ? (
                      <button
                        onClick={() => onStartExam(exam._id)}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                      >
                        Start Exam
                      </button>
                    ) : liveStatus === 'scheduled' ? (
                      <button
                        disabled
                        className="w-full bg-slate-100 text-slate-500 py-2.5 rounded-lg font-medium cursor-not-allowed"
                      >
                        Starts in {formatCountdown(countdownMs)}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-slate-100 text-slate-400 py-2.5 rounded-lg font-medium cursor-not-allowed"
                      >
                        {liveStatus === 'cancelled' ? 'Cancelled' : 'No longer available'}
                      </button>
                    )}
                  </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Results */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900">Recent Results</h3>
              </div>
              <div className="p-6">
                {loading && (
                  <div className="flex items-center justify-center gap-2 text-slate-500 py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading your results...</span>
                  </div>
                )}

                {!loading && !error && results.length === 0 && (
                  <p className="text-sm text-slate-500 py-8 text-center">
                    You haven't completed any exams yet.
                  </p>
                )}

                {!loading && !error && results.length > 0 && (
                  <div className="space-y-3">
                    {results.slice(0, 5).map((r) => (
                      <div
                        key={r.resultId}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 mb-1 truncate">{r.examTitle}</h4>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-600">
                            <span>{r.courseCode}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{formatDate(r.submittedAt)}</span>
                            <span className={r.passed ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {r.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                          <div className="text-right">
                            <p className={`text-xl sm:text-2xl font-bold ${r.passed ? 'text-green-600' : 'text-red-600'}`}>
                              {r.obtainedMarks}
                            </p>
                            <p className="text-xs text-slate-500">out of {r.totalMarks} ({r.percentage}%)</p>
                          </div>
                          <button
                            onClick={() => onViewResults(r.resultId)}
                            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors min-h-[40px]"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
              </div>
              <div className="p-4">
                {loading && (
                  <div className="flex items-center justify-center gap-2 text-slate-500 py-6">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                )}

                {!loading && recentNotifications.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-6">No notifications right now.</p>
                )}

                {!loading && recentNotifications.length > 0 && (
                  <div className="space-y-3">
                    {recentNotifications.map((notif) => {
                      const tone = getNotificationTone(notif.type);
                      return (
                        <div
                          key={notif._id}
                          className={`p-3 rounded-lg border ${
                            tone === 'warning'
                              ? 'bg-orange-50 border-orange-200'
                              : tone === 'success'
                              ? 'bg-green-50 border-green-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {tone === 'warning' ? (
                              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            ) : tone === 'success' ? (
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            ) : (
                              <Bell className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-800 mb-0.5">
                                {NOTIFICATION_TYPE_LABELS[notif.type] || notif.title}
                              </p>
                              <p className="text-xs text-slate-700 mb-1">{notif.message}</p>
                              <p className="text-xs text-slate-500">{timeAgo(notif.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions Reminder */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-semibold mb-2">Exam Preparation</h3>
              <p className="text-sm text-indigo-100 mb-4">
                Make sure your device meets all technical requirements before starting an exam.
              </p>
              <button className="w-full bg-white text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors">
                View Requirements
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
