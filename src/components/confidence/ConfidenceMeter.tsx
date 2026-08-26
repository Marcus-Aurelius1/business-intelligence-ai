import { ConfidenceAssessment } from '@/types';

interface ConfidenceMeterProps {
  assessment: ConfidenceAssessment;
}

export default function ConfidenceMeter({ assessment }: ConfidenceMeterProps) {
  const score = assessment.score;
  const color = score >= 70 ? 'text-emerald-600' : score >= 40 ? 'text-amber-600' : 'text-red-600';
  const bgColor = score >= 70 ? 'bg-emerald-50' : score >= 40 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className={`${bgColor} rounded-lg p-5`}>
      {/* Score */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">Confidence</p>
          <p className={`text-3xl font-bold ${color}`}>{score}/100</p>
        </div>
        <div className="w-24 h-24">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              className={color}
            />
          </svg>
        </div>
      </div>

      {/* Factors */}
      {assessment.positiveFactors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-slate-600 mb-2">Positive factors:</p>
          <ul className="space-y-1">
            {assessment.positiveFactors.map((factor, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {assessment.negativeFactors.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-slate-600 mb-2">Negative factors:</p>
          <ul className="space-y-1">
            {assessment.negativeFactors.map((factor, i) => (
              <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">!</span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 italic mt-4 pt-3 border-t border-slate-200">
        {assessment.disclaimer}
      </p>
    </div>
  );
}
