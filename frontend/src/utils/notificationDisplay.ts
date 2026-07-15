import type { NotificationType } from '../api/notifications';

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  exam_scheduled: 'Exam scheduled',
  exam_reminder: 'Exam reminder',
  exam_started: 'Exam started',
  exam_ending_soon: 'Exam ending soon',
  exam_submitted: 'Exam submitted',
  result_published: 'Result published',
  warning_received: 'Warning received',
  violation_detected: 'Violation detected',
  exam_terminated: 'Exam terminated',
  session_expired: 'Session expired',
  password_changed: 'Password changed',
  student_started: 'Student started exam',
  student_completed: 'Student completed exam',
  student_terminated: 'Student terminated',
  ai_cheating_detected: 'AI detected cheating',
  result_generated: 'Result generated',
  new_exam_created: 'New exam created',
  student_joined: 'Student joined',
  student_left: 'Student left',
};

export type NotificationTone = 'info' | 'success' | 'warning';

const WARNING_TYPES: NotificationType[] = [
  'warning_received',
  'violation_detected',
  'exam_terminated',
  'session_expired',
  'student_terminated',
  'ai_cheating_detected',
];

const SUCCESS_TYPES: NotificationType[] = [
  'result_published',
  'exam_submitted',
  'student_completed',
  'result_generated',
];

export function getNotificationTone(type: NotificationType): NotificationTone {
  if (WARNING_TYPES.includes(type)) return 'warning';
  if (SUCCESS_TYPES.includes(type)) return 'success';
  return 'info';
}
