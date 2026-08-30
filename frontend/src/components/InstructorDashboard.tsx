import { Plus, Users, FileText, AlertTriangle, TrendingUp, Eye, Edit, X, Loader2, ArrowUpDown, Trash2, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProfileDropdown } from "./ProfileDropdown";
import { NotificationBell } from "./NotificationBell";
import { ExportMenu } from "./ExportMenu";
import { useEffect, useState } from "react";
import { apiFetch } from "../services/httpClient";
import { calculateCountdown, formatCountdown, computeStatus, type ExamStatus } from "../utils/examTime";

interface Exam {
  _id: string;
  title: string;
  courseCode: string;
  duration: number;
  date: string;
  time: string;
  // Canonical UTC instants returned by the backend (see backend/models/Exam.js).
  // All countdown/status logic should use these via utils/examTime.ts instead
  // of re-deriving from date/time.
  startAtUTC?: string;
  endAtUTC?: string;
  cancelled?: boolean;
  computedStatus?: ExamStatus;
  students?: number;
  submitted?: number;
  violations?: number;
  avgScore?: number | null;
}

interface InstructorStats {
  totalExams: number;
  activeStudents: number;
  avgScore: number | null;
  violations: number;
  nextExam: {
    examId: string;
    title: string;
    courseCode: string;
    date: string;
    time: string;
    registeredStudents: number;
  } | null;
}

interface ExamResultRow {
  resultId: string;
  studentName: string;
  studentEmail: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  correctCount: number;
  wrongCount: number;
  unattemptedCount: number;
  rank: number;
  totalStudents: number;
  percentile: number;
  passed: boolean;
  timeTakenSeconds: number;
  submittedAt: string;
  violations: number;
  riskScore: number;
  integrityScore: number;
}

interface ViolationRow {
  logId: string;
  sessionId: string;
  student: { name: string; email: string };
  eventType: string;
  severity: string;
  riskPoints: number;
  details: string;
  evidenceUrl: string | null;
  timestamp: string;
}

interface InstructorDashboardProps {
  userName: string | null;
  avatarUrl?: string | null;
  onCreateExam: () => void;
  onEditExam: (examId: string) => void;
  onMonitorExam: (examId: string) => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

const formatDate = (date: string) => {
  if (!date) return 'Date TBD';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Date TBD';
  return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
};

const formatDuration = (seconds: number) => {
  const m = Math.round(seconds / 60);
  return `${m} min`;
};

// Replaces the old `new Date(`${datePart}T${time}`)` construction, which
// parsed in the *browser's* local timezone and, worse, could go negative
// once the start time passed (producing "Starts in -1h -2m"). Now backed by
// the exam's canonical startAtUTC and clamped to zero — see utils/examTime.ts.
const getTimeLeft = (exam: Exam, nowMs: number) => {
  const ms = calculateCountdown(exam, nowMs);
  return formatCountdown(ms);
};

export function InstructorDashboard({ userName, avatarUrl, onCreateExam, onEditExam, onMonitorExam, onLogout, onOpenProfile }: InstructorDashboardProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'scheduled' | 'completed'>('all');

  // View Results modal state
  const [resultsModalExam, setResultsModalExam] = useState<Exam | null>(null);
  const [resultsData, setResultsData] = useState<ExamResultRow[] | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [resultsSort, setResultsSort] = useState<'highest' | 'lowest' | 'latest'>('latest');
  const [resultsFilters, setResultsFilters] = useState({ dateFrom: '', dateTo: '', minRisk: '' });

  // Violation Management modal state
  const [violationsModalExam, setViolationsModalExam] = useState<Exam | null>(null);
  const [violationsData, setViolationsData] = useState<ViolationRow[] | null>(null);
  const [violationsLoading, setViolationsLoading] = useState(false);
  const [violationsError, setViolationsError] = useState<string | null>(null);
  const [violationSearch, setViolationSearch] = useState('');
  const [violationSeverityFilter, setViolationSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');

  // Delete Exam modal state
  const [deleteTarget, setDeleteTarget] = useState<Exam | null>(null);
  const [deleteStage, setDeleteStage] = useState<1 | 2>(1);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Live clock used to recompute exam status/countdown every second (see the
  // `computeStatus(exam, nowMs)` / `getTimeLeft(exam, nowMs)` call sites
  // below) without needing to refetch from the server on every tick.
  const [nowMs, setNowMs] = useState(() => Date.now());

  const fetchDashboardData = async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [examsData, statsData] = await Promise.all([
        apiFetch("/exams/my-exams"),
        apiFetch("/exams/instructor/stats"),
      ]);

      setExams(examsData);
      setStats(statsData);
    } catch (err) {
      // A background silent refetch failing shouldn't blank out an
      // already-loaded dashboard with an error banner — only surface the
      // error on the initial load.
      if (!silent) {
        setError(err instanceof Error ? err.message : "Something went wrong while loading your dashboard.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Tick the clock every second so Scheduled -> Live -> Completed (and the
    // countdown) update live, purely client-side, between refetches.
    const clockHandle = setInterval(() => setNowMs(Date.now()), 1000);

    // Periodically re-sync with the backend (which remains the source of
    // truth for computedStatus, student counts, etc.) so the dashboard
    // reflects server-side state changes — e.g. another tab editing/
    // cancelling an exam — without the instructor needing to refresh the page.
    const refetchHandle = setInterval(() => fetchDashboardData({ silent: true }), 30000);

    return () => {
      clearInterval(clockHandle);
      clearInterval(refetchHandle);
    };
  }, []);

  const filteredExams = exams.filter((exam) => {
    if (activeTab === "all") return true;
    return computeStatus(exam, nowMs) === activeTab;
  });

  // Performance trend: real average score per exam (only exams with submitted results)
  const performanceData = exams
    .filter((e) => e.avgScore !== null && e.avgScore !== undefined)
    .map((e) => ({ exam: e.title, avg: e.avgScore as number }));

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openDeleteModal = (exam: Exam) => {
    setDeleteTarget(exam);
    setDeleteStage(1);
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setDeleteStage(1);
    setDeleteError(null);
  };

  const handleConfirmDelete = () => {
    // Extra protection: if students have already submitted, require a
    // second, more explicit confirmation before actually deleting.
    if (deleteTarget && (deleteTarget.submitted ?? 0) > 0 && deleteStage === 1) {
      setDeleteStage(2);
      return;
    }
    performDelete();
  };

  const performDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);

    try {
      await apiFetch(`/exams/${deleteTarget._id}`, { method: "DELETE" });

      setExams((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      closeDeleteModal();
      showToast("Exam deleted successfully.", "success");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Something went wrong while deleting this exam.");
    } finally {
      setDeleting(false);
    }
  };


  const openResultsModal = async (
    exam: Exam,
    sort: 'highest' | 'lowest' | 'latest' = 'latest',
    filters: { dateFrom: string; dateTo: string; minRisk: string } = resultsFilters
  ) => {
    setResultsModalExam(exam);
    setResultsSort(sort);
    setResultsLoading(true);
    setResultsError(null);
    setResultsData(null);
    try {
      const params = new URLSearchParams({ sort });
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      if (filters.minRisk) params.set('minRisk', filters.minRisk);
      const data = await apiFetch(`/results/exam/${exam._id}?${params.toString()}`);
      setResultsData(data.results);
    } catch (err) {
      setResultsError(err instanceof Error ? err.message : "Something went wrong while loading results.");
    } finally {
      setResultsLoading(false);
    }
  };

  const openViolationsModal = async (exam: Exam) => {
    setViolationsModalExam(exam);
    setViolationSearch('');
    setViolationSeverityFilter('all');
    setViolationsLoading(true);
    setViolationsError(null);
    setViolationsData(null);
    try {
      const data = await apiFetch(`/proctor/exam/${exam._id}/violations`);
      setViolationsData(data);
    } catch (err) {
      setViolationsError(err instanceof Error ? err.message : "Something went wrong while loading violations.");
    } finally {
      setViolationsLoading(false);
    }
  };

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
              <span className="ml-3 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                Instructor
              </span>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Instructor Dashboard</h2>
            <p className="text-sm sm:text-base text-slate-600">Manage exams, monitor students, and analyze performance</p>
          </div>
          <button
            onClick={onCreateExam}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            Create New Exam
          </button>
        </div>

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 mb-8">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Total Exams</span>
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{loading ? '–' : stats?.totalExams ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">Created by you</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Active Students</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{loading ? '–' : stats?.activeStudents ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">Started or submitted your exams</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Avg. Score</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {loading ? '–' : stats?.avgScore !== null && stats?.avgScore !== undefined ? `${stats.avgScore}%` : 'N/A'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Across all submitted results</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Violations</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{loading ? '–' : stats?.violations ?? 0}</p>
            <p className="text-xs text-slate-500 mt-1">AI Proctoring not yet enabled</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Exams List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-4 sm:p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900">All Exams</h3>

                  <div className="flex gap-1 sm:gap-2 overflow-x-auto hide-scrollbar">
                    {(['all', 'live', 'scheduled', 'completed'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap min-h-[36px] ${
                          activeTab === tab
                            ? "text-indigo-600 bg-indigo-50"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {loading && (
                  <div className="flex items-center justify-center gap-2 text-slate-500 py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading your exams...</span>
                  </div>
                )}

                {!loading && filteredExams.length === 0 && (
                  <p className="text-sm text-slate-500 py-8 text-center">
                    No exams found{activeTab !== 'all' ? ` for "${activeTab}"` : ''}.
                  </p>
                )}

                {!loading && filteredExams.map((exam) => {
                  // Recomputed every tick from the exam's canonical startAtUTC/
                  // endAtUTC (see utils/examTime.ts) so Scheduled -> Live ->
                  // Completed transitions happen live, between refetches,
                  // instead of only updating on the next page load.
                  const status = computeStatus(exam, nowMs);
                  return (
                    <div
                      key={exam._id}
                      className="border border-slate-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-slate-900">{exam.title}</h4>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              status === 'live'
                                ? 'bg-green-100 text-green-700'
                                : status === 'scheduled'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">
                            {exam.courseCode} • {formatDate(exam.date)} • {exam.time} • {exam.duration} min
                          </p>
                          {status === "scheduled" && (
                            <p className="text-xs text-blue-600 mt-1">
                              Starts in: {getTimeLeft(exam, nowMs)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-slate-900">{exam.students ?? 0}</p>
                          <p className="text-xs text-slate-600">Total Students</p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{exam.submitted ?? 0}</p>
                          <p className="text-xs text-slate-600">Submitted</p>
                        </div>
                        <div className="text-center p-3 bg-slate-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">{exam.violations ?? 0}</p>
                          <p className="text-xs text-slate-600">Violations</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {status === 'live' && (
                          <button
                            onClick={() => onMonitorExam(exam._id)}
                            className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm min-h-[40px]"
                          >
                            <Eye className="w-4 h-4" />
                            Monitor
                          </button>
                        )}
                        <button
                          onClick={() => onEditExam(exam._id)}
                          className="flex-1 min-w-[80px] flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm min-h-[40px]"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            const cleared = { dateFrom: '', dateTo: '', minRisk: '' };
                            setResultsFilters(cleared);
                            openResultsModal(exam, 'latest', cleared);
                          }}
                          className="flex-1 min-w-[80px] flex items-center justify-center gap-2 px-3 sm:px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors text-sm min-h-[40px]"
                        >
                          Results
                        </button>
                        <ExportMenu examId={exam._id} examTitle={exam.title} />
                        <button
                          onClick={() => openViolationsModal(exam)}
                          className="flex items-center justify-center gap-2 px-3 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors min-h-[40px]"
                          title="View violations"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(exam)}
                          title="Delete Exam"
                          className="flex items-center justify-center px-3 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors min-h-[40px]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance Analytics  */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-6">Student Performance Trend</h3>
              {performanceData.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-12">
                  No submitted results yet — this chart will populate once students complete your exams.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="exam" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="avg"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Violations Report */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Recent Violations</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-slate-500 text-center py-8">
                  No violation data available.
                  <br />
                  <span className="text-xs">(AI Proctoring module not yet enabled)</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => alert('Question bank import is coming in a future update.')}
                  className="w-full px-4 py-3 text-left border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                      <Plus className="w-5 h-5 text-indigo-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Import Questions</p>
                      <p className="text-xs text-slate-600">From question bank</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => alert('Student management is coming in a future update.')}
                  className="w-full px-4 py-3 text-left border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <Users className="w-5 h-5 text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Manage Students</p>
                      <p className="text-xs text-slate-600">Add or remove students</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => alert('Open an exam and view its results to see per-student violation counts. A dedicated cross-exam violations review screen is coming in a future update.')}
                  className="w-full px-4 py-3 text-left border border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                      <AlertTriangle className="w-5 h-5 text-amber-600 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Review Violations</p>
                      <p className="text-xs text-slate-600">{stats?.violations ?? 0} pending reviews</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-semibold mb-3">Next Exam</h3>
              {loading ? (
                <p className="text-purple-100 text-sm">Loading...</p>
              ) : stats?.nextExam ? (
                <>
                  <p className="text-purple-100 text-sm mb-1">{stats.nextExam.title}</p>
                  <p className="text-2xl font-bold mb-1">{formatDate(stats.nextExam.date)}</p>
                  <p className="text-purple-100 text-sm mb-4">
                    {stats.nextExam.time} • {stats.nextExam.registeredStudents} student(s) registered
                  </p>
                  <button
                    onClick={() => onEditExam(stats.nextExam!.examId)}
                    className="w-full bg-white text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition-colors"
                  >
                    View Details
                  </button>
                </>
              ) : (
                <p className="text-purple-100 text-sm">No upcoming exams scheduled.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Results Modal */}
      {resultsModalExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{resultsModalExam.title}</h3>
                <p className="text-sm text-slate-600">{resultsModalExam.courseCode} — Results</p>
              </div>
              <button
                onClick={() => setResultsModalExam(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600 mr-2">Sort by:</span>
                {(['highest', 'lowest', 'latest'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => openResultsModal(resultsModalExam, s)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg ${
                      resultsSort === s
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {s === 'highest' ? 'Highest Score' : s === 'lowest' ? 'Lowest Score' : 'Latest Submission'}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-end gap-3 mb-5 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Submitted from</label>
                  <input
                    type="date"
                    value={resultsFilters.dateFrom}
                    onChange={(e) => setResultsFilters({ ...resultsFilters, dateFrom: e.target.value })}
                    className="px-2 py-1.5 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Submitted to</label>
                  <input
                    type="date"
                    value={resultsFilters.dateTo}
                    onChange={(e) => setResultsFilters({ ...resultsFilters, dateTo: e.target.value })}
                    className="px-2 py-1.5 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Min. risk score</label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Any"
                    value={resultsFilters.minRisk}
                    onChange={(e) => setResultsFilters({ ...resultsFilters, minRisk: e.target.value })}
                    className="w-24 px-2 py-1.5 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <button
                  onClick={() => openResultsModal(resultsModalExam, resultsSort, resultsFilters)}
                  className="px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Apply Filters
                </button>
                {(resultsFilters.dateFrom || resultsFilters.dateTo || resultsFilters.minRisk) && (
                  <button
                    onClick={() => {
                      const cleared = { dateFrom: '', dateTo: '', minRisk: '' };
                      setResultsFilters(cleared);
                      openResultsModal(resultsModalExam, resultsSort, cleared);
                    }}
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Clear
                  </button>
                )}
              </div>

              {resultsLoading && (
                <div className="flex items-center justify-center gap-2 text-slate-500 py-12">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading results...</span>
                </div>
              )}

              {!resultsLoading && resultsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {resultsError}
                </div>
              )}

              {!resultsLoading && !resultsError && resultsData && resultsData.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-12">
                  No students have submitted this exam yet.
                </p>
              )}

              {!resultsLoading && !resultsError && resultsData && resultsData.length > 0 && (
                <div className="table-scroll">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead>
                      <tr className="text-left text-slate-500 border-b border-slate-200">
                        <th className="py-2 pr-4">Student</th>
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Score</th>
                        <th className="py-2 pr-4">%</th>
                        <th className="py-2 pr-4">Grade</th>
                        <th className="py-2 pr-4">C/W/S</th>
                        <th className="py-2 pr-4">Rank</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Time Taken</th>
                        <th className="py-2 pr-4">Submitted</th>
                        <th className="py-2 pr-4">Violations</th>
                        <th className="py-2 pr-4">Integrity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultsData.map((r) => (
                        <tr key={r.resultId} className="border-b border-slate-100">
                          <td className="py-3 pr-4 font-medium text-slate-900">{r.studentName}</td>
                          <td className="py-3 pr-4 text-slate-600">{r.studentEmail}</td>
                          <td className="py-3 pr-4 text-slate-900">{r.obtainedMarks}/{r.totalMarks}</td>
                          <td className="py-3 pr-4 text-slate-900">{r.percentage}%</td>
                          <td className="py-3 pr-4 text-slate-900 font-medium">{r.grade}</td>
                          <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">
                            <span className="text-green-600">{r.correctCount}</span>
                            {' / '}
                            <span className="text-red-600">{r.wrongCount}</span>
                            {' / '}
                            <span className="text-slate-400">{r.unattemptedCount}</span>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">
                            {r.rank}/{r.totalStudents}
                          </td>
                          <td className="py-3 pr-4">
                            <span className={r.passed ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {r.passed ? 'Pass' : 'Fail'}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-slate-600">{formatDuration(r.timeTakenSeconds)}</td>
                          <td className="py-3 pr-4 text-slate-600">
                            {new Date(r.submittedAt).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                          </td>
                          <td className="py-3 pr-4 text-slate-600">{r.violations}</td>
                          <td className="py-3 pr-4">
                            <span
                              className={
                                r.integrityScore >= 80
                                  ? 'text-green-600 font-medium'
                                  : r.integrityScore >= 50
                                  ? 'text-amber-600 font-medium'
                                  : 'text-red-600 font-medium'
                              }
                            >
                              {r.integrityScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Violation Management Modal */}
      {violationsModalExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{violationsModalExam.title}</h3>
                <p className="text-sm text-slate-600">{violationsModalExam.courseCode} — Violations</p>
              </div>
              <button
                onClick={() => setViolationsModalExam(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    value={violationSearch}
                    onChange={(e) => setViolationSearch(e.target.value)}
                    placeholder="Search by student or detection type..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <select
                  value={violationSeverityFilter}
                  onChange={(e) => setViolationSeverityFilter(e.target.value as typeof violationSeverityFilter)}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg"
                >
                  <option value="all">All severities</option>
                  <option value="low">Low+</option>
                  <option value="medium">Medium+</option>
                  <option value="high">High+</option>
                  <option value="critical">Critical only</option>
                </select>
                <ExportMenu examId={violationsModalExam._id} examTitle={violationsModalExam.title} />
              </div>

              {violationsLoading && (
                <div className="flex items-center justify-center gap-2 text-slate-500 py-12">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading violations...</span>
                </div>
              )}

              {!violationsLoading && violationsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {violationsError}
                </div>
              )}

              {!violationsLoading && !violationsError && violationsData && (() => {
                const severityRank: Record<string, number> = { info: 0, low: 1, medium: 2, high: 3, critical: 4 };
                const minRank = violationSeverityFilter === 'all' ? 0 : severityRank[violationSeverityFilter];
                const searchLower = violationSearch.trim().toLowerCase();

                const filtered = violationsData.filter((v) => {
                  if (severityRank[v.severity] < minRank) return false;
                  if (!searchLower) return true;
                  return (
                    v.student.name.toLowerCase().includes(searchLower) ||
                    v.eventType.toLowerCase().replace(/_/g, ' ').includes(searchLower)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <p className="text-sm text-slate-500 text-center py-12">
                      {violationsData.length === 0
                        ? 'No violations recorded for this exam.'
                        : 'No violations match the current search/filter.'}
                    </p>
                  );
                }

                return (
                  <div className="table-scroll">
                    <table className="w-full text-sm min-w-[600px]">
                      <thead>
                        <tr className="text-left text-slate-500 border-b border-slate-200">
                          <th className="py-2 pr-4">Student</th>
                          <th className="py-2 pr-4">Detection Type</th>
                          <th className="py-2 pr-4">Severity</th>
                          <th className="py-2 pr-4">Details</th>
                          <th className="py-2 pr-4">Evidence</th>
                          <th className="py-2 pr-4">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((v) => (
                          <tr key={v.logId} className="border-b border-slate-100">
                            <td className="py-3 pr-4 font-medium text-slate-900">{v.student.name}</td>
                            <td className="py-3 pr-4 text-slate-700">{v.eventType.replace(/_/g, ' ')}</td>
                            <td className="py-3 pr-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  v.severity === 'critical'
                                    ? 'bg-red-100 text-red-700'
                                    : v.severity === 'high'
                                    ? 'bg-orange-100 text-orange-700'
                                    : v.severity === 'medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {v.severity}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-slate-600 max-w-xs truncate">{v.details || '—'}</td>
                            <td className="py-3 pr-4">
                              {v.evidenceUrl ? (
                                <a
                                  href={v.evidenceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-indigo-600 hover:underline"
                                >
                                  View
                                </a>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 pr-4 text-slate-600 whitespace-nowrap">
                              {new Date(v.timestamp).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Delete Exam Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {deleteStage === 1 ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Delete Exam</h3>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-1 text-sm">
                  <p className="font-medium text-slate-900">{deleteTarget.title}</p>
                  <p className="text-slate-600">{deleteTarget.courseCode}</p>
                  <p className="text-slate-600">
                    {formatDate(deleteTarget.date)} at {deleteTarget.time}
                  </p>
                  <p className="text-slate-600">{deleteTarget.duration} min</p>
                </div>

                <p className="text-sm text-slate-700 mb-6">
                  Are you sure you want to delete this exam? This action cannot be undone.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">This Exam Has Submissions</h3>
                </div>

                <p className="text-sm text-slate-700 mb-6">
                  This exam already contains student submissions. Deleting it will
                  permanently remove all associated results and submissions. Do you
                  still want to continue?
                </p>
              </>
            )}

            {deleteError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
                {deleteError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Yes, Delete Exam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
