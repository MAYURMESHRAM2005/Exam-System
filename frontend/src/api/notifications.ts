import { apiFetch } from '../services/httpClient';

export type NotificationType =
  | 'exam_scheduled'
  | 'exam_reminder'
  | 'exam_started'
  | 'exam_ending_soon'
  | 'exam_submitted'
  | 'result_published'
  | 'warning_received'
  | 'violation_detected'
  | 'exam_terminated'
  | 'session_expired'
  | 'password_changed'
  | 'student_started'
  | 'student_completed'
  | 'student_terminated'
  | 'ai_cheating_detected'
  | 'result_generated'
  | 'new_exam_created'
  | 'student_joined'
  | 'student_left';

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: AppNotification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export interface NotificationFilters {
  type?: NotificationType;
  isRead?: boolean;
  q?: string;
  page?: number;
  limit?: number;
}

const buildQuery = (filters: NotificationFilters): string => {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.isRead !== undefined) params.set('isRead', String(filters.isRead));
  if (filters.q) params.set('q', filters.q);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

export const getNotifications = (
  filters: NotificationFilters = {}
): Promise<NotificationListResponse> => apiFetch(`/notifications${buildQuery(filters)}`);

export const getUnreadCount = (): Promise<{ unreadCount: number }> =>
  apiFetch('/notifications/unread-count');

export const markNotificationAsRead = (id: string): Promise<{ notification: AppNotification }> =>
  apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });

export const markAllNotificationsAsRead = (): Promise<{ matched: number; modified: number }> =>
  apiFetch('/notifications/read-all', { method: 'PATCH' });

export const deleteNotification = (id: string): Promise<{ message: string; id: string }> =>
  apiFetch(`/notifications/${id}`, { method: 'DELETE' });
