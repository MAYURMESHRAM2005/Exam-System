import { useEffect, useRef, useState } from 'react';
import { Download, FileSpreadsheet, FileText, FileDown, Loader2 } from 'lucide-react';
import { downloadFile } from '../services/httpClient';

interface ExportMenuProps {
  examId: string;
  examTitle: string;
}

type ReportKey = 'results' | 'violations' | 'attendance' | 'ai-report';
type Format = 'csv' | 'xlsx' | 'pdf';

const REPORTS: { key: ReportKey; label: string }[] = [
  { key: 'results', label: 'Student Results' },
  { key: 'violations', label: 'Violation Report' },
  { key: 'attendance', label: 'Attendance Report' },
  { key: 'ai-report', label: 'AI Proctoring Report' },
];

const FORMAT_ICON: Record<Format, typeof FileText> = {
  csv: FileText,
  xlsx: FileSpreadsheet,
  pdf: FileDown,
};

export function ExportMenu({ examId, examTitle }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (report: ReportKey, format: Format) => {
    const key = `${report}-${format}`;
    setDownloading(key);
    setError(null);
    try {
      await downloadFile(`/reports/${examId}/${report}?format=${format}`, `${examTitle}-${report}.${format}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(null);
    }
  };

  const handleCompleteReport = async () => {
    setDownloading('complete');
    setError(null);
    try {
      await downloadFile(`/reports/${examId}/complete`, `${examTitle}-complete-report.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
        title="Export reports"
      >
        <Download className="w-4 h-4" />
        Reports
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50">
          <div className="p-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-900">Export reports</p>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
          </div>
          <div className="p-2">
            {REPORTS.map((report) => (
              <div key={report.key} className="flex items-center justify-between px-2 py-2 hover:bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{report.label}</span>
                <div className="flex gap-1">
                  {(['csv', 'xlsx', 'pdf'] as Format[]).map((format) => {
                    const Icon = FORMAT_ICON[format];
                    const key = `${report.key}-${format}`;
                    return (
                      <button
                        key={format}
                        onClick={() => handleDownload(report.key, format)}
                        disabled={downloading === key}
                        title={format.toUpperCase()}
                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-50"
                      >
                        {downloading === key ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Icon className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                onClick={handleCompleteReport}
                disabled={downloading === 'complete'}
                className="w-full flex items-center gap-2 px-2 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg disabled:opacity-50"
              >
                {downloading === 'complete' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <FileDown className="w-3.5 h-3.5" />
                )}
                Complete Report (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
