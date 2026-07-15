import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import { Login } from './components/Login';
import { VerifyEmail } from './components/VerifyEmail';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { StudentDashboard } from './components/StudentDashboard';
import { InstructorDashboard } from './components/InstructorDashboard';
import { ExamInstructions } from './components/ExamInstructions';
import { ProctoringSetup } from './components/ProctoringSetup';
import { LiveExam } from './components/LiveExam';
import { stopProctorStream } from './lib/proctorStream';
import { ExamSubmission } from './components/ExamSubmission';
import { Results } from './components/Results';
import { CreateExam } from './components/CreateExam';
import { LiveProctoring } from './components/LiveProctoring';
import { ProfilePage } from './components/ProfilePage';
import { refreshSession, logoutUser, getMe } from './api/auth';
import { API_ORIGIN } from './config/env';

export type UserRole = 'student' | 'instructor' | null;

interface JwtPayload {
  id: string;
  role: UserRole;
  name: string;   // ✅ added
  exp: number;
}

export type Screen =
  | 'login'
  | 'verify-email'
  | 'forgot-password'
  | 'reset-password'
  | 'student-dashboard'
  | 'instructor-dashboard'
  | 'exam-instructions'
  | 'proctoring-setup'
  | 'live-exam'
  | 'exam-submission'
  | 'results'
  | 'create-exam'
  | 'live-proctoring'
  | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [proctorSessionId, setProctorSessionId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  // The JWT only ever carries `name` (and not always fresh — see below);
  // it never carries avatarUrl at all. This fetches the real, current
  // profile so the header reflects reality rather than a snapshot from
  // whenever the access token happened to be issued. Fire-and-forget by
  // design: it shouldn't block the initial screen transition, and if it
  // fails the JWT-decoded name is still a reasonable fallback.
  const refreshProfileHeader = () => {
    getMe()
      .then((profile) => {
        setUserName(profile.name);
        setAvatarUrl(profile.avatarUrl ? `${API_ORIGIN}${profile.avatarUrl}` : null);
      })
      .catch(() => {
        // Non-fatal — the header just keeps whatever name it already had.
      });
  };

  // 🔥 AUTO LOGIN + EXPIRY CHECK
  // Fast path: a still-valid access token in localStorage.
  // Fallback: attempt a silent refresh using the httpOnly refresh-token
  // cookie, which is what actually powers "Remember me" persisting a
  // session across browser restarts even after the short-lived access
  // token has expired.
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          if (decoded.exp * 1000 > Date.now()) {
            setUserRole(decoded.role);
            setUserName(decoded.name);
            if (decoded.role === 'student') setCurrentScreen('student-dashboard');
            if (decoded.role === 'instructor') setCurrentScreen('instructor-dashboard');
            setAuthChecked(true);
            refreshProfileHeader();
            return;
          }
        } catch {
          // fall through to refresh attempt
        }
      }

      try {
        const data = await refreshSession();
        localStorage.setItem('token', data.token);
        localStorage.setItem('name', data.name);
        setUserRole(data.role);
        setUserName(data.name);
        if (data.role === 'student') setCurrentScreen('student-dashboard');
        if (data.role === 'instructor') setCurrentScreen('instructor-dashboard');
        refreshProfileHeader();
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
      } finally {
        setAuthChecked(true);
      }
    };

    init();
  }, []);

  const handleLogin = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);

    if (role === 'student') setCurrentScreen('student-dashboard');
    if (role === 'instructor') setCurrentScreen('instructor-dashboard');
    refreshProfileHeader();
  };

  const handleRegistered = (email: string) => {
    setPendingVerificationEmail(email);
    setCurrentScreen('verify-email');
  };

  const handleVerified = (role: UserRole, name: string) => {
    setPendingVerificationEmail(null);
    handleLogin(role, name);
  };

  const handleForgotPassword = () => {
    setCurrentScreen('forgot-password');
  };

  const handleResetCodeSent = (email: string) => {
    setResetEmail(email);
    setCurrentScreen('reset-password');
  };

  const handleResetDone = () => {
    setResetEmail(null);
    setCurrentScreen('login');
  };

  const handleBackToLogin = () => {
    setPendingVerificationEmail(null);
    setResetEmail(null);
    setCurrentScreen('login');
  };

  // 🔥 Logout
  const handleLogout = () => {
    // Revoke the refresh-token session server-side too — fire-and-forget so
    // the UI doesn't wait on it, but still clear local state immediately.
    logoutUser().catch(() => {});
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    setUserRole(null);
    setUserName(null);
    setAvatarUrl(null);
    setCurrentScreen('login');
    setSelectedExamId(null);
    setSelectedResultId(null);
    setProctorSessionId(null);
    stopProctorStream();
  };

  const handleStartExam = (examId: string) => {
    setSelectedExamId(examId);
    setCurrentScreen('exam-instructions');
  };

  const handleProceedToSetup = () => {
    setCurrentScreen('proctoring-setup');
  };

  const handleStartLiveExam = () => {
    setCurrentScreen('live-exam');
  };

  const handleSubmitExam = (resultId: string) => {
    setSelectedResultId(resultId);
    setCurrentScreen('exam-submission');
  };

  const handleViewResults = (resultId?: string) => {
    if (resultId) setSelectedResultId(resultId);
    setCurrentScreen('results');
  };

  const handleBackToDashboard = () => {
    if (userRole === 'student') setCurrentScreen('student-dashboard');
    if (userRole === 'instructor') setCurrentScreen('instructor-dashboard');
  };

  const handleCreateExam = () => {
    setSelectedExamId(null);
    setCurrentScreen('create-exam');
  };

  const handleEditExam = (examId: string) => {
    setSelectedExamId(examId);
    setCurrentScreen('create-exam');
  };

  const handleMonitorExam = (examId: string) => {
    setSelectedExamId(examId);
    setCurrentScreen('live-proctoring');
  };
  const handleOpenProfile = () => {
  setCurrentScreen('profile');
};

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {currentScreen === 'login' && (
        <Login
          onLogin={handleLogin}
          onRegistered={handleRegistered}
          onForgotPassword={handleForgotPassword}
        />
      )}

      {currentScreen === 'verify-email' && pendingVerificationEmail && (
        <VerifyEmail
          email={pendingVerificationEmail}
          onVerified={handleVerified}
          onBack={handleBackToLogin}
        />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPassword
          onCodeSent={handleResetCodeSent}
          onBack={handleBackToLogin}
        />
      )}

      {currentScreen === 'reset-password' && resetEmail && (
        <ResetPassword
          email={resetEmail}
          onDone={handleResetDone}
          onBack={handleBackToLogin}
        />
      )}

      {currentScreen === 'student-dashboard' && userRole === 'student' && (
        <StudentDashboard
          userName={userName}
          avatarUrl={avatarUrl}
          onStartExam={handleStartExam}
          onViewResults={handleViewResults}
          onOpenProfile={handleOpenProfile}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'instructor-dashboard' && userRole === 'instructor' && (
        <InstructorDashboard
          userName={userName}
          avatarUrl={avatarUrl}
          onCreateExam={handleCreateExam}
          onEditExam={handleEditExam}
          onMonitorExam={handleMonitorExam}
          onLogout={handleLogout}
          onOpenProfile={handleOpenProfile}
        />
      )}

      {currentScreen === 'exam-instructions' && (
        <ExamInstructions
          examId={selectedExamId}
          onProceed={handleProceedToSetup}
          onBack={handleBackToDashboard}
        />
      )}

      {currentScreen === 'proctoring-setup' && (
        <ProctoringSetup
          examId={selectedExamId}
          onStartExam={handleStartLiveExam}
          onBack={() => setCurrentScreen('exam-instructions')}
          onSessionStarted={setProctorSessionId}
        />
      )}

      {currentScreen === 'live-exam' && (
        <LiveExam
          examId={selectedExamId}
          proctorSessionId={proctorSessionId}
          onSubmit={handleSubmitExam}
        />
      )}

      {currentScreen === 'exam-submission' && (
        <ExamSubmission
          resultId={selectedResultId}
          onBackToDashboard={handleBackToDashboard}
          onViewResults={() => handleViewResults()}
        />
      )}

      {currentScreen === 'results' && (
        <Results resultId={selectedResultId} onBack={handleBackToDashboard} />
      )}

      {currentScreen === 'create-exam' && (
        <CreateExam onBack={handleBackToDashboard} examId={selectedExamId} />
      )}

      {currentScreen === 'live-proctoring' && (
        <LiveProctoring
          examId={selectedExamId}
          onBack={handleBackToDashboard}
        />
      )}
      {currentScreen === 'profile' && (
        <ProfilePage
          onBack={handleBackToDashboard}
          onProfileUpdated={(profile) => {
            setUserName(profile.name);
            setAvatarUrl(profile.avatarUrl ? `${API_ORIGIN}${profile.avatarUrl}` : null);
          }}
        />
      )}
    </div>
  );
}