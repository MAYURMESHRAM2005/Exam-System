import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Bell, Search, Trash2, CheckCheck, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type AppNotification,
} from '../api/notifications';
import { getSocket } from '../services/socket';
import { NOTIFICATION_TYPE_LABELS, getNotificationTone } from '../utils/notificationDisplay';
import { timeAgo } from '../utils/timeAgo';

type ReadFilter = 'all' | 'unread';

const TONE_STYLES: Record<string, { bg: string; icon: ReactNode }> = {
  warning: { bg: 'bg-orange-50 border-orange-200', icon: <AlertCircle className="w-4 h-4 text-orange-600" /> },
  success: { bg: 'bg-green-50 border-green-200', icon: <CheckCircle className="w-4 h-4 text-green-600" /> },
  info: { bg: 'bg-blue-50 border-blue-200', icon: <Info className="w-4 h-4 text-blue-600" /> },
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [readFilter, setReadFilter] = useState<ReadFilter>('all');
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click — same pattern as ProfileDropdown.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Badge count: fetched on mount, then kept live over the socket so it
  // updates instantly without polling.
  useEffect(() => {
    let cancelled = false;
    getUnreadCount()
      .then((data) => {
        if (!cancelled) setUnreadCount(data.unreadCount);
      })
      .catch(() => {});

    const socket = getSocket();
    const handleNew = (notification: AppNotification) => {
      setUnreadCount((c) => c + 1);
      setNotifications((prev) => [notification, ...prev]);
    };
    socket.on('notification:new', handleNew);
    return () => {
      cancelled = true;
      socket.off('notification:new', handleNew);
    };
  }, []);

  // Fetch the list whenever the panel opens or a filter changes while open.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    const debounce = setTimeout(() => {
      getNotifications({
        isRead: readFilter === 'unread' ? false : undefined,
        q: search.trim() || undefined,
        limit: 30,
      })
        .then((data) => {
          if (!cancelled) {
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(debounce);
    };
  }, [open, readFilter, search]);

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await markNotificationAsRead(id);
    } catch {
      // Best-effort — a failed mark-as-read isn't worth surfacing an error for.
    }
  };

  const handleMarkAllAsRead = async () => {
    const hadUnread = notifications.some((n) => !n.isRead);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    if (hadUnread) {
      try {
        await markAllNotificationsAsRead();
      } catch {
        // Best-effort.
      }
    }
  };

  const handleDelete = async (id: string) => {
    const wasUnread = notifications.find((n) => n._id === id)?.isRead === false;
    setNotifications((prev) => prev.filter((n) => n._id !== id));
    if (wasUnread) setUnreadCount((c) => Math.max(0, c - 1));
    try {
      await deleteNotification(id);
    } catch {
      // Best-effort.
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-lg z-50 animate-fadeIn">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          </div>

          <div className="p-3 border-b border-slate-100 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'unread'] as ReadFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setReadFilter(f)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                    readFilter === f
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All' : 'Unread'}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-3 space-y-2">
            {loading && (
              <div className="flex items-center justify-center gap-2 text-slate-500 py-6">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">No notifications to show.</p>
            )}

            {!loading &&
              notifications.map((notif) => {
                const tone = getNotificationTone(notif.type);
                const style = TONE_STYLES[tone];
                return (
                  <div
                    key={notif._id}
                    onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                    className={`p-3 rounded-lg border ${style.bg} ${!notif.isRead ? 'cursor-pointer' : 'opacity-70'}`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0">{style.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {NOTIFICATION_TYPE_LABELS[notif.type] || notif.title}
                          </p>
                          {!notif.isRead && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-700 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-slate-500 mt-1">{timeAgo(notif.createdAt)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notif._id);
                        }}
                        className="text-slate-400 hover:text-red-600 flex-shrink-0"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
