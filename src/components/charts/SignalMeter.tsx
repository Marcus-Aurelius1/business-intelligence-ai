interface SignalMeterProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function SignalMeter({ score, label = 'Signal Score', size = 'md' }: SignalMeterProps) {
  const getColor = (score: number) => {
    if (score >= 70) return { stroke: '#9333ea', text: 'text-violet-600' };
    if (score >= 40) return { stroke: '#f59e0b', text: 'text-amber-600' };
    return { stroke: '#64748b', text: 'text-slate-600' };
  };

  const colors = getColor(score);
  const dimensions = {
    sm: { outer: 36, inner: 14 },
    md: { outer: 40, inner: 16 },
    lg: { outer: 48, inner: 20 }
  };

  const { outer, inner } = dimensions[size];
  const radius = inner;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative" style={{ width: outer, height: outer }}>
        <svg viewBox={`0 0 ${outer} ${outer}`} className="w-full h-full transform -rotate-90">
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          <circle
            cx={outer / 2}
            cy={outer / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-bold ${colors.text}`}>{score}</span>
        </div>
      </div>
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  );
}
