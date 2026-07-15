import { useEffect, useState } from "react";
import { Loader2, AlertCircle, User, KeyRound, LogIn, PlayCircle, CheckCircle2, XCircle, ShieldAlert, ChevronLeft, ChevronRight } from "lucide-react";
import { getActivity, type ActivityEntry } from "../api/auth";

const TYPE_ICON: Record<string, React.ReactNode> = {
  profile_updated: <User className="w-4 h-4 text-indigo-500" />,
  password_changed: <KeyRound className="w-4 h-4 text-amber-500" />,
  login: <LogIn className="w-4 h-4 text-emerald-500" />,
  exam_started: <PlayCircle className="w-4 h-4 text-indigo-500" />,
  exam_submitted: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  exam_cancelled: <XCircle className="w-4 h-4 text-red-500" />,
  violation_generated: <ShieldAlert className="w-4 h-4 text-red-500" />,
};

export function ActivityTimeline() {
  const [entries, setEntries] = useState<ActivityEntry[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getActivity(page)
      .then((data) => {
        setEntries(data.activities);
        setTotalPages(data.totalPages);
        setError(null);
      })
      .catch((err) => setError(err.message || "Couldn't load activity history."))
      .finally(() => setLoading(false));
  }, [page]);

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      {loading && (
        <div className="flex items-center gap-2 text-slate-500 py-4 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading activity...</span>
        </div>
      )}

      {!loading && entries && entries.length === 0 && (
        <p className="text-sm text-slate-500 py-2">No activity recorded yet.</p>
      )}

      {!loading && entries && entries.length > 0 && (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">{TYPE_ICON[entry.type] || <User className="w-4 h-4 text-slate-400" />}</div>
              <div className="min-w-0">
                <p className="text-sm text-slate-800">{entry.message}</p>
                <p className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center gap-1 text-slate-600 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-slate-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center gap-1 text-slate-600 disabled:opacity-40"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
