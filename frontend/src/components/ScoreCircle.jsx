function scoreColor(score) {
  if (score >= 75) return { stroke: "#22c55e", text: "text-green-600" };
  if (score >= 50) return { stroke: "#f59e0b", text: "text-amber-600" };
  return { stroke: "#ef4444", text: "text-red-600" };
}

export default function ScoreCircle({ score, reason }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const { stroke, text } = scoreColor(score);

  return (
    <div className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${text}`}>{score}</span>
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            ATS Score
          </span>
        </div>
      </div>
      {reason && (
        <p className="mt-4 text-center text-sm text-slate-600">{reason}</p>
      )}
    </div>
  );
}
