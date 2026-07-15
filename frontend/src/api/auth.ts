import { apiFetch } from '../services/httpClient';

export interface AuthResponse {
  token: string;
  role: 'student' | 'instructor';
  name: string;
}

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'instructor';
}): Promise<AuthResponse> =>
  apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuthRetry: true,
  });

export interface GoogleAuthResponse extends AuthResponse {
  isNewUser: boolean;
}

// `credential` is the signed Google ID token JWT string handed back by
// Google Identity Services (button click or One Tap) — verified
// server-side against Google's own public keys before anything happens.
export const googleAuth = (data: {
  credential: string;
  role?: 'student' | 'instructor';
  rememberMe?: boolean;
}): Promise<GoogleAuthResponse> =>
  apiFetch('/auth/google', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuthRetry: true,
  });

export const verifyEmail = (data: { email: string; otp: string }): Promise<AuthResponse> =>
  apiFetch('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuthRetry: true,
  });

export const resendOtp = (email: string): Promise<{ message: string }> =>
  apiFetch('/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuthRetry: true,
  });

export const loginUser = (data: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthResponse> =>
  apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuthRetry: true,
  });

export const refreshSession = (): Promise<AuthResponse> =>
  apiFetch('/auth/refresh', { method: 'POST', skipAuthRetry: true });

export const logoutUser = (): Promise<{ message: string }> =>
  apiFetch('/auth/logout', { method: 'POST', skipAuthRetry: true });

export const logoutAllDevices = (): Promise<{ message: string }> =>
  apiFetch('/auth/logout-all', { method: 'POST' });

export const forgotPassword = (email: string): Promise<{ message: string }> =>
  apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
    skipAuthRetry: true,
  });

export const resetPassword = (data: {
  email: string;
  token: string;
  newPassword: string;
}): Promise<{ message: string }> =>
  apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(data),
    skipAuthRetry: true,
  });

export const changePassword = (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ message: string }> =>
  apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export interface Profile {
  name: string;
  email: string;
  role: 'student' | 'instructor';
  phone: string;
  bio: string;
  isEmailVerified: boolean;
  pendingEmail: string | null;
  avatarUrl: string | null;
  enrollmentNumber: string;
  collegeName: string;
  branch: string;
  semester: string;
  rollNumber: string;
  gender: string;
  dateOfBirth: string | null;
  address: string;
  city: string;
  state: string;
  country: string;
  createdAt: string;
  lastLoginAt: string | null;
  profileCompletionPercent: number;
}

export interface ProfileUpdatePayload {
  name?: string;
  phone?: string;
  bio?: string;
  enrollmentNumber?: string;
  collegeName?: string;
  branch?: string;
  semester?: string;
  rollNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export const getMe = (): Promise<Profile> => apiFetch('/auth/me');

export const updateProfile = (data: ProfileUpdatePayload): Promise<Profile> =>
  apiFetch('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const uploadProfilePhoto = (imageDataUrl: string): Promise<Profile> =>
  apiFetch('/auth/profile/photo', {
    method: 'POST',
    body: JSON.stringify({ image: imageDataUrl }),
  });

export const deleteProfilePhoto = (): Promise<Profile> =>
  apiFetch('/auth/profile/photo', { method: 'DELETE' });

export interface ActivityEntry {
  id: string;
  type: string;
  message: string;
  createdAt: string;
}

export const getActivity = (page = 1): Promise<{ activities: ActivityEntry[]; page: number; totalPages: number; totalCount: number }> =>
  apiFetch(`/auth/activity?page=${page}&limit=10`);

export interface ExamStatistics {
  totalExams: number;
  completedExams: number;
  ongoingExams: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passPercentage: number;
  totalViolations: number;
  certificatesEarned: number;
}

export const getExamStatistics = (): Promise<ExamStatistics> => apiFetch('/auth/exam-statistics');

export interface DeviceSession {
  id: string;
  userAgent: string;
  ip: string;
  rememberMe: boolean;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export const listSessions = (): Promise<{ sessions: DeviceSession[] }> =>
  apiFetch('/auth/sessions');

export const revokeSession = (id: string): Promise<{ message: string }> =>
  apiFetch(`/auth/sessions/${id}`, { method: 'DELETE' });

export const requestEmailChange = (data: {
  newEmail: string;
  password: string;
}): Promise<{ message: string; pendingEmail: string }> =>
  apiFetch('/auth/change-email/request', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const resendEmailChangeOtp = (): Promise<{ message: string }> =>
  apiFetch('/auth/change-email/resend', { method: 'POST' });

export const confirmEmailChange = (otp: string): Promise<{ message: string; email: string }> =>
  apiFetch('/auth/change-email/confirm', {
    method: 'POST',
    body: JSON.stringify({ otp }),
  });
