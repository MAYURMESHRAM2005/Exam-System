import { ArrowLeft, Camera, AlertTriangle, Users, Search, Flag, Eye, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../services/httpClient';
import { getSocket, disconnectSocket } from '../services/socket';
import { API_ORIGIN } from '../config/env';

interface LiveProctoringProps {
  examId: string | null;
  onBack: () => void;
}

interface SessionData {
  sessionId: string;
  student: { id: string; name: string; email: string } | null;
  status: 'active' | 'ended';
  cameraStatus: string;
  microphoneStatus: string;
  violationCount: number;
  riskScore: number;
  flagged: boolean;
  startedAt: string;
  endedAt: string | null;
  progress: { answered: number; total: number };
  result: {
    status: string;
    obtainedMarks: number;
    totalMarks: number;
    percentage: number;
    submittedAt: string | null;
    terminatedByExaminer: boolean;
  } | null;
  online: boolean;
  lastSeenAt: number | null;
}

interface ViolationData {
  logId: string;
  sessionId: string;
  studentName: string;
  eventType: string;
  severity: string;
  timestamp: number;
  evidenceUrl?: string | null;
}

const EVENT_LABELS: Record<string, string> = {
  FULLSCREEN_EXIT: 'Exited Fullscreen',
  TAB_SWITCH: 'Tab Switch',
  WINDOW_BLUR: 'Window Lost Focus',
  BROWSER_MINIMIZE: 'Browser Minimized',
  RIGHT_CLICK_ATTEMPT: 'Right-Click Attempt',
  COPY_ATTEMPT: 'Copy Attempt',
  PASTE_ATTEMPT: 'Paste Attempt',
  DEVTOOLS_SHORTCUT_ATTEMPT: 'DevTools Shortcut',
  DEVTOOLS_OPENED: 'DevTools Opened',
  F12_ATTEMPT: 'F12 Pressed',
  VIEW_SOURCE_ATTEMPT: 'View Source Attempt',
  NO_FACE: 'Face Not Detected',
  MULTIPLE_FACE: 'Multiple People',
  LOOKING_AWAY: 'Looking Away',
  FACE_TOO_CLOSE: 'Too Close to Camera',
  FACE_TOO_FAR: 'Too Far from Camera',
  NETWORK_DISCONNECTED: 'Network Disconnected',
  INCOGNITO_DETECTED: 'Incognito Mode',
  PHONE_DETECTED: 'Phone Detected',
  BOOK_DETECTED: 'Book Detected',
  LAPTOP_DETECTED: 'Second Screen Detected',
  SECOND_PERSON_DETECTED: 'Second Person Detected',
  NOISE_DETECTED: 'Background Noise',
  CAMERA_DISABLED: 'Camera Disabled',
  MICROPHONE_DISABLED: 'Microphone Disabled',
};

function relativeTime(ts: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export function LiveProctoring({ examId, onBack }: LiveProctoringProps) {
  const [examMeta, setExamMeta] = useState<{ title: string; courseCode: string; totalQuestions: number } | null>(null);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [violations, setViolations] = useState<ViolationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);

  // Heartbeats arrive every ~15s; a session that claims "online" but hasn't
  // been heard from in a while (frozen tab, backgrounded app, flaky network)
  // should read as stale even though no new socket event has fired to
  // trigger a re-render. This tick forces one every 5s purely so the
  // "time since last seen" comparison stays current.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(tick);
  }, []);
  const HEARTBEAT_STALE_MS = 40000; // ~2.5x the 15s heartbeat interval

  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'flagged'>('all');
  const [search, setSearch] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!examId) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [sessionsRes, violationsRes] = await Promise.all([
          apiFetch(`/proctor/exam/${examId}/sessions`),
          apiFetch(`/proctor/exam/${examId}/violations`),
        ]);

        setExamMeta({
          title: sessionsRes.exam.title,
          courseCode: sessionsRes.exam.courseCode,
          totalQuestions: sessionsRes.exam.totalQuestions,
        });
        setSessions(
          sessionsRes.sessions.map((s: Omit<SessionData, 'online' | 'lastSeenAt'>) => ({
            ...s,
            online: s.status === 'active',
            lastSeenAt: null, // populated by the first heartbeat/presence:update after load
          }))
        );
        setViolations(
          violationsRes.map((v: any) => ({
            logId: v.logId,
            sessionId: v.sessionId,
            studentName: v.student?.name || 'Unknown student',
            eventType: v.eventType,
            severity: v.severity,
            timestamp: new Date(v.timestamp).getTime(),
            evidenceUrl: v.evidenceUrl || null,
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Failed to load live monitoring data.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [examId]);

  useEffect(() => {
    if (!examId) return;

    const socket = getSocket();
    socket.emit('join:exam-monitor', { examId });

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);
    setSocketConnected(socket.connected);

    const onViolation = (data: {
      sessionId: string;
      studentId: string;
      eventType: string;
      severity: string;
      violationCount: number;
      riskScore: number;
      flagged: boolean;
      timestamp: string;
      evidenceUrl?: string | null;
    }) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === data.sessionId
            ? { ...s, violationCount: data.violationCount, riskScore: data.riskScore, flagged: data.flagged }
            : s
        )
      );
      setViolations((prev) => {
        const student = sessions.find((s) => s.sessionId === data.sessionId)?.student;
        return [
          {
            logId: `${data.sessionId}-${data.timestamp}`,
            sessionId: data.sessionId,
            studentName: student?.name || 'Student',
            eventType: data.eventType,
            severity: data.severity,
            timestamp: new Date(data.timestamp).getTime(),
            evidenceUrl: data.evidenceUrl || null,
          },
          ...prev,
        ].slice(0, 100);
      });
    };

    const onPresence = (data: { sessionId: string; online: boolean; lastSeenAt?: number }) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === data.sessionId
            ? { ...s, online: data.online, lastSeenAt: data.lastSeenAt ?? s.lastSeenAt }
            : s
        )
      );
    };

    const onTerminated = (data: { sessionId: string }) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === data.sessionId
            ? {
                ...s,
                status: 'ended',
                online: false,
                result: s.result
                  ? { ...s.result, status: 'submitted', terminatedByExaminer: true }
                  : s.result,
              }
            : s
        )
      );
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('violation:new', onViolation);
    socket.on('presence:update', onPresence);
    socket.on('session:terminated', onTerminated);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('violation:new', onViolation);
      socket.off('presence:update', onPresence);
      socket.off('session:terminated', onTerminated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId]);

  // Disconnect only when actually leaving the monitoring screen.
  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    if (!actionMessage) return;
    const timer = setTimeout(() => setActionMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [actionMessage]);

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      if (filterStatus === 'active' && s.status !== 'active') return false;
      if (filterStatus === 'flagged' && !s.flagged) return false;
      if (search && !s.student?.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [sessions, filterStatus, search]);

  const selectedSession = sessions.find((s) => s.sessionId === selectedSessionId) || null;

  const totalStudents = sessions.length;
  const submittedCount = sessions.filter((s) => s.result?.status === 'submitted').length;
  const activeNowCount = sessions.filter((s) => s.status === 'active').length;
  const flaggedCount = sessions.filter((s) => s.flagged).length;
  const avgProgress =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => {
            const total = s.progress.total || 1;
            return sum + (s.progress.answered / total) * 100;
          }, 0) / sessions.length
        )
      : 0;

  const handleWarn = (sessionId: string) => {
    const message = window.prompt('Warning message to send to this student:');
    if (!message) return;
    getSocket().emit('examiner:warn', { sessionId, message });
    setActionMessage('Warning sent.');
  };

  const handleBroadcast = () => {
    if (!examId) return;
    const message = window.prompt('Message to broadcast to every student in this exam:');
    if (!message) return;
    getSocket().emit('examiner:broadcast', { examId, message });
    setActionMessage('Broadcast sent to all students.');
  };

  const handleTerminate = async (sessionId: string) => {
    if (!window.confirm('This will immediately end the exam for this student and submit their current answers. Continue?')) {
      return;
    }
    try {
      await apiFetch(`/proctor/${sessionId}/terminate`, { method: 'POST' });
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === sessionId
            ? { ...s, status: 'ended', online: false, result: s.result ? { ...s.result, status: 'submitted', terminatedByExaminer: true } : s.result }
            : s
        )
      );
      setActionMessage('Session terminated.');
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to terminate session.');
    }
  };

  const handleEndAllActive = async () => {
    const activeSessions = sessions.filter((s) => s.status === 'active');
    if (activeSessions.length === 0) return;
    if (
      !window.confirm(
        `This will immediately end the exam for all ${activeSessions.length} active student(s) and submit their current answers. Continue?`
      )
    ) {
      return;
    }
    await Promise.allSettled(
      activeSessions.map((s) => apiFetch(`/proctor/${s.sessionId}/terminate`, { method: 'POST' }))
    );
    setSessions((prev) =>
      prev.map((s) =>
        s.status === 'active'
          ? { ...s, status: 'ended', online: false, result: s.result ? { ...s.result, status: 'submitted', terminatedByExaminer: true } : s.result }
          : s
      )
    );
    setActionMessage('Exam ended for all active students.');
  };

  const handleExportCsv = () => {
    const header = 'Student,Event,Severity,Time\n';
    const rows = violations
      .map((v) => `"${v.studentName}","${EVENT_LABELS[v.eventType] || v.eventType}","${v.severity}","${new Date(v.timestamp).toISOString()}"`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `violation-report-${examId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-slate-700 mb-4">{error}</p>
          <button onClick={onBack} className="text-indigo-600 font-medium">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              <div className="h-8 w-px bg-slate-300"></div>
              <div>
                <h1 className="font-semibold text-slate-900">Live Proctoring Monitor</h1>
                <p className="text-xs text-slate-600">{examMeta?.title} {examMeta?.courseCode && `· ${examMeta.courseCode}`}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {socketConnected ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">Live</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-400">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-medium">Connecting…</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {actionMessage && (
        <div className="bg-indigo-50 border-b border-indigo-200 text-indigo-800 px-6 py-2 text-sm text-center">
          {actionMessage}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Total Students</span>
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalStudents}</p>
            <p className="text-xs text-green-600 mt-1">{submittedCount} submitted</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Active Now</span>
              <Camera className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{activeNowCount}</p>
            <p className="text-xs text-slate-500 mt-1">Taking exam</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Flagged</span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{flaggedCount}</p>
            <p className="text-xs text-red-600 mt-1">Needs review</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Avg Progress</span>
              <Flag className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{avgProgress}%</p>
            <p className="text-xs text-slate-500 mt-1">Questions answered</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Grid */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Student Monitoring</h2>
                  <div className="flex gap-2">
                    {(['all', 'active', 'flagged'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize ${
                          filterStatus === status
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search students..."
                    className="w-full pl-11 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="p-6">
                {filteredSessions.length === 0 ? (
                  <p className="text-center text-slate-500 py-10">No students match this filter yet.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredSessions.map((s) => {
                      const progressPct = s.progress.total > 0 ? Math.round((s.progress.answered / s.progress.total) * 100) : 0;
                      return (
                        <div
                          key={s.sessionId}
                          onClick={() => setSelectedSessionId(s.sessionId)}
                          className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedSessionId === s.sessionId
                              ? 'border-indigo-500 bg-indigo-50'
                              : s.flagged
                              ? 'border-red-200 hover:border-red-300'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Camera Feed Placeholder — live video requires a WebRTC signaling
                              layer that isn't built yet; this shows real device/connection
                              status without pretending to stream video. */}
                          <div className="aspect-video bg-slate-900 rounded-lg mb-3 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Camera className="w-8 h-8 text-slate-600" />
                            </div>
                            {s.online && (
                              (() => {
                                const isStale =
                                  s.status === 'active' &&
                                  s.lastSeenAt !== null &&
                                  now - s.lastSeenAt > HEARTBEAT_STALE_MS;
                                return (
                                  <div
                                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                                      isStale ? 'bg-yellow-400' : 'bg-green-500'
                                    }`}
                                    title={
                                      isStale
                                        ? `No heartbeat for ${Math.round((now - (s.lastSeenAt as number)) / 1000)}s — connection may be unstable`
                                        : 'Live'
                                    }
                                  />
                                );
                              })()
                            )}
                            {s.violationCount > 0 && (
                              <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                                {s.violationCount} ⚠
                              </div>
                            )}
                          </div>

                          <div className="mb-2">
                            <p className="font-medium text-slate-900 text-sm truncate">
                              {s.student?.name || 'Unknown student'}
                            </p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-slate-600">Progress</span>
                              <span className="text-xs font-medium text-slate-900">{progressPct}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1">
                              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${progressPct}%` }}></div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSessionId(s.sessionId);
                              }}
                              className="flex-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                            >
                              <Eye className="w-3 h-3 inline mr-1" />
                              View
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWarn(s.sessionId);
                              }}
                              disabled={s.status !== 'active'}
                              className="px-2 py-1 border border-red-300 text-red-600 text-xs rounded hover:bg-red-50 disabled:opacity-40"
                            >
                              Warn
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Violations & Details */}
          <div className="space-y-6">
            {/* Recent Violations */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="p-6 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900">Recent Violations</h3>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                {violations.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-4">No violations recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {violations.slice(0, 20).map((v) => (
                      <div
                        key={v.logId}
                        className={`p-3 rounded-lg border ${
                          v.severity === 'critical' || v.severity === 'high'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-orange-50 border-orange-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle
                            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              v.severity === 'critical' || v.severity === 'high' ? 'text-red-600' : 'text-orange-600'
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{v.studentName}</p>
                            <p className="text-xs text-slate-600">{EVENT_LABELS[v.eventType] || v.eventType}</p>
                            <p className="text-xs text-slate-500 mt-1">{relativeTime(v.timestamp)}</p>
                            {v.evidenceUrl && (
                              <a
                                href={`${API_ORIGIN}${v.evidenceUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-2"
                              >
                                <img
                                  src={`${API_ORIGIN}${v.evidenceUrl}`}
                                  alt="Violation evidence"
                                  className="w-20 h-12 object-cover rounded border border-slate-300 hover:opacity-80"
                                />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Student Details */}
            {selectedSession && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">Student Details</h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-slate-900">{selectedSession.student?.name}</p>
                    <p className="text-sm text-slate-600">{selectedSession.student?.email}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Status:</span>
                      <span className={`font-medium ${selectedSession.status === 'active' ? 'text-green-600' : 'text-slate-500'}`}>
                        {selectedSession.status === 'active' ? 'Active' : 'Ended'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Progress:</span>
                      <span className="font-medium text-slate-900">
                        {selectedSession.progress.answered}/{selectedSession.progress.total} answered
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Violations:</span>
                      <span className={`font-medium ${selectedSession.violationCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedSession.violationCount} (risk {selectedSession.riskScore})
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Camera:</span>
                      <span className="font-medium text-slate-900 capitalize">{selectedSession.cameraStatus}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Microphone:</span>
                      <span className="font-medium text-slate-900 capitalize">{selectedSession.microphoneStatus}</span>
                    </div>
                    {selectedSession.result && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Result:</span>
                        <span className="font-medium text-slate-900 capitalize">
                          {selectedSession.result.status}
                          {selectedSession.result.terminatedByExaminer && ' (terminated)'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleWarn(selectedSession.sessionId)}
                      disabled={selectedSession.status !== 'active'}
                      className="w-full px-4 py-2 border border-orange-300 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50 disabled:opacity-40"
                    >
                      Send Warning
                    </button>
                    <button
                      onClick={() => handleTerminate(selectedSession.sessionId)}
                      disabled={selectedSession.status !== 'active'}
                      className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-40"
                    >
                      Terminate Exam
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handleExportCsv}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Export Violation Report (CSV)
                </button>
                <button
                  onClick={handleBroadcast}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Broadcast Message
                </button>
                <button
                  onClick={handleEndAllActive}
                  className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  End Exam for All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
