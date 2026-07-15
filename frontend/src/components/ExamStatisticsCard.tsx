import { useEffect, useState } from "react";
import { Loader2, AlertCircle, Trophy, TrendingUp, TrendingDown, ShieldAlert, Award, ListChecks } from "lucide-react";
import { getExamStatistics, type ExamStatistics } from "../api/auth";

export function ExamStatisticsCard() {
  const [stats, setStats] = useState<ExamStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getExamStatistics()
      .then(setStats)
      .catch((err) => setError(err.message || "Couldn't load exam statistics."));
  }, []);

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center gap-2 text-slate-500 py-4 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading statistics...</span>
      </div>
    );
  }

  const tiles: { label: string; value: string | number; icon: React.ReactNode }[] = [
    { label: "Total Exams", value: stats.totalExams, icon: <ListChecks className="w-4 h-4 text-indigo-500" /> },
    { label: "Completed", value: stats.completedExams, icon: <Trophy className="w-4 h-4 text-emerald-500" /> },
    { label: "Ongoing", value: stats.ongoingExams, icon: <Loader2 className="w-4 h-4 text-amber-500" /> },
    { label: "Average Score", value: `${stats.averageScore}%`, icon: <TrendingUp className="w-4 h-4 text-indigo-500" /> },
    { label: "Highest Score", value: `${stats.highestScore}%`, icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
    { label: "Lowest Score", value: `${stats.lowestScore}%`, icon: <TrendingDown className="w-4 h-4 text-slate-400" /> },
    { label: "Pass Rate", value: `${stats.passPercentage}%`, icon: <Award className="w-4 h-4 text-emerald-500" /> },
    { label: "Violations", value: stats.totalViolations, icon: <ShieldAlert className="w-4 h-4 text-red-500" /> },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tiles.map((tile) => (
        <div key={tile.label} className="border rounded-lg p-3 text-center">
          <div className="flex items-center justify-center mb-1">{tile.icon}</div>
          <div className="text-lg font-bold text-slate-900">{tile.value}</div>
          <div className="text-xs text-slate-500">{tile.label}</div>
        </div>
      ))}
    </div>
  );
}
