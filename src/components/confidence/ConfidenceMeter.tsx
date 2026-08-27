import { ConfidenceAssessment } from '@/types';

interface ConfidenceMeterProps {
  assessment: ConfidenceAssessment;
}

export default function ConfidenceMeter({ assessment }: ConfidenceMeterProps) {
  const score = assessment.score;

  const getConfidenceColor = (score: number) => {
    if (score >= 70) return {
      ring: '#10b981',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      light: '#d1fae5'
    };
    if (score >= 40) return {
      ring: '#f59e0b',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      light: '#fef3c7'
    };
    return {
      ring: '#ef4444',
      bg: 'bg-red-50',
      text: 'text-red-700',
      light: '#fee2e2'
    };
  };

  const colors = getConfidenceColor(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`${colors.bg} rounded-xl p-6`}>
      {/* Score Ring */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-slate-600 mb-2">Confidence Assessment</p>
          <p className={`text-4xl font-bold ${colors.text}`}>{score}<span className="text-2xl text-slate-400">/100</span></p>
        </div>
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={colors.light}
              strokeWidth="8"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={colors.ring}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className={`w-8 h-8 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {score >= 70 ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              ) : score >= 40 ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Positive Factors */}
      {assessment.positiveFactors.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Supporting Evidence
          </p>
          <ul className="space-y-2">
            {assessment.positiveFactors.map((factor, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2.5 bg-white/60 rounded-lg px-3 py-2">
                <span className="text-emerald-500 mt-0.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Negative Factors */}
      {assessment.negativeFactors.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            Limitations
          </p>
          <ul className="space-y-2">
            {assessment.negativeFactors.map((factor, i) => (
              <li key={i} className="text-sm text-slate-700 flex items-start gap-2.5 bg-white/60 rounded-lg px-3 py-2">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="pt-4 border-t border-slate-200/60">
        <p className="text-xs text-slate-500 flex items-start gap-2 leading-relaxed">
          <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          {assessment.disclaimer}
        </p>
      </div>
    </div>
  );
}
