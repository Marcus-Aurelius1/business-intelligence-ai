interface SignalMeterProps {
  score: number;
  label?: string;
}

export default function SignalMeter({ score, label = 'Signal Score' }: SignalMeterProps) {
  const color = score >= 70 ? 'text-violet-600' : score >= 40 ? 'text-amber-600' : 'text-slate-600';

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${score} 100`}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${color}`}>{score}</span>
        </div>
      </div>
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}
