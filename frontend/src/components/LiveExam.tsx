import { useState, useEffect, useRef, useCallback } from "react";
import {
  Clock,
  AlertTriangle,
  Wifi,
  WifiOff,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
  Loader2,
  ShieldAlert,
  Maximize,
} from "lucide-react";
import { FaceDetectionMonitor } from "./FaceDetectionMonitor";
import { stopProctorStream } from "../lib/proctorStream";
import { apiFetch, ApiError } from "../services/httpClient";
import { useBrowserSecurity } from "../hooks/useBrowserSecurity";
import { getSocket, disconnectSocket } from "../services/socket";

interface LiveExamProps {
  examId: string | null;
  proctorSessionId: string | null;
  onSubmit: (resultId: string) => void;
}

interface Question {
  _id: string;
  questionText: string;
  type: string;
  options?: string[];
  marks: number;
}

const AUTOSAVE_DEBOUNCE_MS = 700;
const HEARTBEAT_INTERVAL_MS = 30000;

export function LiveExam({ examId, proctorSessionId, onSubmit }: LiveExamProps) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  const [examTitle, setExamTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Refs so interval/timeout closures always see the latest values
  // without needing to be re-created on every render.
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const dirtyRef = useRef<Set<string>>(new Set());
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const resultIdRef = useRef<string | null>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const submittedRef = useRef(false);

  const security = useBrowserSecurity(proctorSessionId, {
    enabled: !loading && !loadError && !blockedMessage,
  });
  const [showViolationToast, setShowViolationToast] = useState(false);
  const violationCountForToast = security.violations.length;

  const [examinerMessage, setExaminerMessage] = useState<string | null>(null);

  // Live connection to the examiner's monitoring session — lets the
  // examiner send a warning, broadcast a message to everyone taking this
  // exam, or force-terminate this specific attempt in real time.
  useEffect(() => {
    if (loading || loadError || !proctorSessionId || !examId) return;

    const socket = getSocket();
    socket.emit('join:session', { sessionId: proctorSessionId, examId });

    const onWarning = (data: { message: string }) => setExaminerMessage(data.message);
    const onBroadcast = (data: { message: string }) => setExaminerMessage(data.message);
    const onTerminated = (data: { resultId: string | null }) => {
      submittedRef.current = true;
      stopProctorStream();
      if (data.resultId) {
        onSubmit(data.resultId);
      } else if (resultIdRef.current) {
        onSubmit(resultIdRef.current);
      }
    };

    socket.on('student:warning', onWarning);
    socket.on('student:broadcast', onBroadcast);
    socket.on('student:terminated', onTerminated);

    // Periodic heartbeat so the instructor's live dashboard can show
    // "last seen Xs ago" and flag a stale session well before Socket.IO's
    // own transport-level ping/pong timeout would notice a dead connection.
    const heartbeatInterval = setInterval(() => {
      socket.emit('heartbeat');
    }, 15000);
    socket.emit('heartbeat'); // immediate first beat, don't wait 15s

    return () => {
      clearInterval(heartbeatInterval);
      socket.off('student:warning', onWarning);
      socket.off('student:broadcast', onBroadcast);
      socket.off('student:terminated', onTerminated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadError, proctorSessionId, examId]);

  useEffect(() => {
    if (!examinerMessage) return;
    const timer = setTimeout(() => setExaminerMessage(null), 8000);
    return () => clearTimeout(timer);
  }, [examinerMessage]);

  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    if (violationCountForToast === 0) return;
    setShowViolationToast(true);
    const timer = setTimeout(() => setShowViolationToast(false), 4000);
    return () => clearTimeout(timer);
  }, [violationCountForToast]);

  /* =========================
     START / RESUME EXAM
     Waits for proctorSessionId to actually be available before calling
     POST /results/start — this is the fix for a real stale-closure race:
     ProctoringSetup creates the proctor session and requests camera/mic
     access independently and concurrently (two separate async effects
     there), so if this effect fired immediately on mount with whatever
     proctorSessionId happened to be in scope at that instant, a session
     that was still in flight would be captured as `null` forever — this
     effect's dependency array previously didn't even include
     proctorSessionId, so a session that arrived moments later was never
     picked up, silently starting the exam with no proctoring link for the
     entire attempt.
     Guarded with a ref so the network call only ever fires once. If no
     session shows up within 10s, that's treated as a real failure (shown
     to the student, with the option to go back and retry) rather than
     silently proceeding with proctoring un-linked for the whole attempt.
  ========================= */
  const examStartedRef = useRef(false);

  useEffect(() => {
    if (examStartedRef.current) return;

    if (!examId) {
      examStartedRef.current = true;
      setLoadError("No exam was selected.");
      setLoading(false);
      return;
    }

    if (!proctorSessionId) return; // wait — effect re-runs once the prop updates

    examStartedRef.current = true;

    const start = async () => {
      try {
        const data = await apiFetch(`/results/start/${examId}`, {
          method: "POST",
          body: JSON.stringify({ proctorSessionId }),
        });

        resultIdRef.current = data.resultId;
        sessionTokenRef.current = data.sessionToken;
        setExamTitle(data.examTitle);
        setCourseCode(data.courseCode);
        setQuestions(data.questions || []);
        setTimeLeft(data.secondsRemaining);

        const prefill: Record<string, string> = {};
        (data.existingAnswers || []).forEach((a: { question: string; selectedAnswer: string }) => {
          prefill[a.question] = a.selectedAnswer;
        });
        setAnswers(prefill);
      } catch (err: any) {
        setLoadError(err.message || "Something went wrong while loading the exam.");
      } finally {
        setLoading(false);
      }
    };

    start();
  }, [examId, proctorSessionId]);

  // Fallback: if the proctor session never shows up (ProctoringSetup's
  // session-creation request failed in some way this component wasn't
  // told about), don't leave the student on an infinite spinner — surface
  // a clear, actionable error after a generous grace period instead.
  useEffect(() => {
    if (proctorSessionId || examStartedRef.current) return;
    const timer = setTimeout(() => {
      if (!examStartedRef.current) {
        examStartedRef.current = true;
        setLoadError(
          "Unable to establish a secure exam session. Please go back and try again."
        );
        setLoading(false);
      }
    }, 10000);
    return () => clearTimeout(timer);
  }, [proctorSessionId]);

  /* =========================
     SAFETY NET: stop the camera/mic stream if this screen unmounts for any
     reason other than a clean submit (e.g. user closes the tab/navigates
     away unexpectedly). The submit paths above already stop it explicitly
     on success; this just guarantees the camera light always turns off.
  ========================= */
  useEffect(() => {
    return () => {
      if (!submittedRef.current) {
        stopProctorStream();
      }
    };
  }, []);

  /* =========================
     SAVE A SINGLE ANSWER
  ========================= */
  const saveAnswer = useCallback(
    async (questionId: string, value: string) => {
      if (!resultIdRef.current || !sessionTokenRef.current || submittedRef.current) return;

      try {
        const data = await apiFetch(`/results/${resultIdRef.current}/save`, {
          method: "PUT",
          body: JSON.stringify({
            questionId,
            selectedAnswer: value,
            sessionToken: sessionTokenRef.current,
          }),
        });

        if (data.autoSubmitted) {
          submittedRef.current = true;
          stopProctorStream();
          onSubmit(data.resultId);
          return;
        }

        dirtyRef.current.delete(questionId);
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 1200);
      } catch (err: any) {
        if (err instanceof ApiError && err.status === 409) {
          setBlockedMessage(err.body?.message || err.message);
          return;
        }
        // Any other error (network blip, 401 refresh failure, etc.) — leave
        // it marked dirty, the 30s heartbeat will retry.
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onSubmit]
  );

  /* =========================
     ANSWER CHANGE: immediate state update + debounced save
     (so rapid changes don't fire one request per keystroke/click)
  ========================= */
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    dirtyRef.current.add(questionId);

    if (saveTimers.current[questionId]) {
      clearTimeout(saveTimers.current[questionId]);
    }
    saveTimers.current[questionId] = setTimeout(() => {
      saveAnswer(questionId, value);
    }, AUTOSAVE_DEBOUNCE_MS);
  };

  /* =========================
     30s HEARTBEAT: flush anything still unsaved, and double as a
     liveness ping so the server can lazily auto-submit if time ran out.
  ========================= */
  useEffect(() => {
    if (loading || loadError || blockedMessage) return;

    const interval = setInterval(() => {
      const dirtyIds = Array.from(dirtyRef.current);
      if (dirtyIds.length > 0) {
        dirtyIds.forEach((qid) => saveAnswer(qid, answersRef.current[qid] || ""));
      } else if (questions.length > 0) {
        // Nothing unsaved — still ping with the current question's answer
        // (no-op save) purely as a heartbeat so an expired server-side
        // window gets detected even if the student stopped interacting.
        const qid = questions[0]._id;
        saveAnswer(qid, answersRef.current[qid] || "");
      }
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadError, blockedMessage, questions, saveAnswer]);

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = useCallback(async () => {
    if (submitting || submittedRef.current) return;
    if (!resultIdRef.current || !sessionTokenRef.current) return;

    setSubmitting(true);

    const finalAnswers = Object.entries(answersRef.current).map(
      ([questionId, selectedAnswer]) => ({ questionId, selectedAnswer })
    );

    try {
      const data = await apiFetch(`/results/${resultIdRef.current}/submit`, {
        method: "POST",
        body: JSON.stringify({
          sessionToken: sessionTokenRef.current,
          answers: finalAnswers,
        }),
      });

      submittedRef.current = true;
      stopProctorStream();
      onSubmit(data.resultId);
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 409) {
        setBlockedMessage(err.body?.message || err.message);
        setSubmitting(false);
        return;
      }
      alert(err.message || "Network error while submitting. Please try again.");
      setSubmitting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitting, onSubmit]);

  /* =========================
     TIMER — counts down from the server-computed remaining time and
     auto-submits the moment it hits zero.
  ========================= */
  useEffect(() => {
    if (loading || loadError || blockedMessage) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, loadError, blockedMessage, handleSubmit]);

  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleMarkForReview = (questionId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  /* =========================
     RENDER STATES: loading / error / blocked
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading your exam...</span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-xl p-8 max-w-md text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Unable to start exam</h2>
          <p className="text-slate-600 text-sm">{loadError}</p>
        </div>
      </div>
    );
  }

  if (blockedMessage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white border rounded-xl p-8 max-w-md text-center">
          <AlertTriangle className="w-10 h-10 text-orange-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Exam Locked</h2>
          <p className="text-slate-600 text-sm">{blockedMessage}</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = Object.values(answers).filter((v) => v && v.length > 0).length;

  if (!question) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">This exam has no questions.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div>
            <h1 className="font-semibold">{examTitle}</h1>
            <p className="text-xs text-slate-600">{courseCode}</p>
          </div>

          <div className="flex items-center gap-6">
            {security.isOnline ? (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Wifi className="w-4 h-4" />
                Connected
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <WifiOff className="w-4 h-4" />
                Offline
              </div>
            )}

            {security.violationCount > 0 && (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                  security.flagged
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                }`}
                title="Security violations detected during this exam"
              >
                <ShieldAlert className="w-4 h-4" />
                {security.violationCount} violation{security.violationCount === 1 ? "" : "s"}
              </div>
            )}

            {autoSaved && (
              <div className="flex items-center gap-1 text-green-600">
                <Check className="w-4 h-4" /> Saved
              </div>
            )}

            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 600 ? "bg-red-100 text-red-700" : "bg-slate-100"
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-semibold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen-exit warning */}
      {!security.isFullscreen && (
        <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            You've exited fullscreen mode. This has been recorded as a security violation.
          </div>
          <button
            onClick={security.requestFullscreen}
            className="flex items-center gap-2 bg-white text-red-700 px-3 py-1.5 rounded-lg text-sm font-medium flex-shrink-0"
          >
            <Maximize className="w-4 h-4" /> Return to fullscreen
          </button>
        </div>
      )}

      {/* Message from the examiner (warning or broadcast) */}
      {examinerMessage && (
        <div className="bg-indigo-600 text-white px-6 py-3 flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Message from examiner: {examinerMessage}
        </div>
      )}

      {/* Most recent violation toast */}
      {showViolationToast && security.violations[0] && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 px-6 py-2 text-sm flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          {security.violations[0].message}
        </div>
      )}

      <div className="flex flex-1">
        {/* Main */}
        <div className="flex-1 p-8">
          <div className="bg-white border rounded-xl p-8 mb-6">
            <div className="flex justify-between mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                Question {currentQuestion + 1} / {questions.length}
              </span>
              <div className="flex items-center gap-3">
                {markedForReview[question._id] && (
                  <span className="text-orange-600 flex gap-1 items-center text-sm">
                    <Flag className="w-4 h-4" /> Marked
                  </span>
                )}
                {answers[question._id] && (
                  <span className="text-green-600 flex gap-1 items-center">
                    <Check className="w-4 h-4" /> Answered
                  </span>
                )}
              </div>
            </div>

            <h2 className="text-xl mb-6">{question.questionText}</h2>

            {question.type === "mcq" ? (
              <div className="space-y-3">
                {question.options?.map((opt) => (
                  <label
                    key={opt}
                    className={`flex gap-3 p-4 border rounded-lg cursor-pointer ${
                      answers[question._id] === opt
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={answers[question._id] === opt}
                      onChange={() => handleAnswerChange(question._id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : question.type === "msq" ? (
              <div className="space-y-3">
                {question.options?.map((opt) => {
                  const selected = (answers[question._id] || "")
                    .split(",")
                    .map((v) => v.trim())
                    .filter(Boolean);
                  const isChecked = selected.includes(opt);
                  return (
                    <label
                      key={opt}
                      className={`flex gap-3 p-4 border rounded-lg cursor-pointer ${
                        isChecked ? "border-indigo-500 bg-indigo-50" : "border-slate-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const next = isChecked
                            ? selected.filter((v) => v !== opt)
                            : [...selected, opt];
                          handleAnswerChange(question._id, next.join(","));
                        }}
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            ) : question.type === "truefalse" ? (
              <div className="grid grid-cols-2 gap-3">
                {["True", "False"].map((opt) => (
                  <label
                    key={opt}
                    className={`flex justify-center gap-3 p-4 border rounded-lg cursor-pointer font-medium ${
                      answers[question._id] === opt
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      checked={answers[question._id] === opt}
                      onChange={() => handleAnswerChange(question._id, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : question.type === "coding" ? (
              <textarea
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                className="w-full h-64 border rounded-lg p-4 font-mono text-sm bg-slate-950 text-slate-100"
                placeholder="// Write your code here"
                spellCheck={false}
              />
            ) : (
              <textarea
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                className="w-full h-40 border rounded-lg p-4"
                placeholder="Type your answer…"
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((q) => q - 1)}
              className="flex items-center gap-2 text-slate-600 disabled:opacity-40"
            >
              <ChevronLeft /> Previous
            </button>

            <button
              onClick={() => toggleMarkForReview(question._id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
                markedForReview[question._id]
                  ? "bg-orange-100 text-orange-700 border-orange-300"
                  : "text-slate-600 border-slate-200"
              }`}
            >
              <Flag className="w-4 h-4" />
              {markedForReview[question._id] ? "Marked for Review" : "Mark for Review"}
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                Submit Exam <Flag />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion((q) => q + 1)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center gap-2"
              >
                Next <ChevronRight />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l p-6">
          <div className="mb-6">
            <FaceDetectionMonitor sessionId={proctorSessionId} />
          </div>

          <p className="text-sm mb-2">
            Progress: {answeredCount}/{questions.length}
          </p>
          <div className="w-full bg-slate-200 h-2 rounded-full mb-4">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{
                width: `${(answeredCount / questions.length) * 100}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => (
              <button
                key={q._id}
                onClick={() => setCurrentQuestion(i)}
                className={`p-2 rounded relative ${
                  i === currentQuestion
                    ? "bg-indigo-600 text-white"
                    : markedForReview[q._id]
                    ? "bg-orange-100 text-orange-700"
                    : answers[q._id]
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Flag /> Submit Exam
          </button>
        </div>
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-2">Submit Exam?</h3>
            <p className="text-slate-600 mb-4">
              Answered {answeredCount} / {questions.length} questions
              {Object.values(markedForReview).some(Boolean) && (
                <>
                  {" "}
                  ({Object.values(markedForReview).filter(Boolean).length} marked
                  for review)
                </>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
                className="flex-1 border py-2 rounded-lg disabled:opacity-50"
              >
                Review
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
