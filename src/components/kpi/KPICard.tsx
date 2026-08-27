import { KPICardProps } from '@/types';

export default function KPICard({ movement, kpi, onInvestigate }: KPICardProps) {
  const isNegative = movement.percentageChange < 0;
  const isPositive = movement.percentageChange > 0;
  const isInvestigate = movement.status === 'investigate';

  const statusConfig = {
    investigate: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      label: 'Investigate'
    },
    stable: {
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      border: 'border-slate-200',
      dot: 'bg-slate-400',
      label: 'Stable'
    },
    action_required: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-red-500',
      label: 'Action Required'
    }
  };

  const status = statusConfig[movement.status];

  const isRevenue = kpi.id === 'revenue';

  return (
    <div className={`
      card p-5 group relative overflow-hidden flex flex-col justify-between
      ${isRevenue ? 'border-slate-300 ring-1 ring-slate-200/80 shadow-xs' : ''}
      ${isInvestigate && !isRevenue ? 'border-amber-200/90 shadow-sm' : ''}
    `}>
      {/* Priority accent top bar */}
      {isInvestigate && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-500" />
      )}

      {/* Header: KPI Name + Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 truncate">{kpi.name}</h3>
            {isRevenue && (
              <span className="text-[9px] font-bold text-slate-500 bg-slate-100/90 border border-slate-200/80 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Top-line
              </span>
            )}
            <div className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${status.dot} ${isInvestigate ? 'status-pulse' : ''}`} />
          </div>
          <span className={`
            flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap
            ${status.bg} ${status.text} ${status.border} border
          `}>
            {status.label}
          </span>
        </div>

        {/* Definition / Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 min-h-[32px] mb-4">{kpi.definition}</p>

        {/* Primary Value + Movement Badge + Baseline */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between gap-2 flex-wrap mb-1">
            <span className="metric-value text-slate-900 tracking-tight">
              {formatValue(movement.currentValue, kpi.id)}
            </span>
            <div className={`
              movement-indicator
              ${isNegative ? 'negative' : ''}
              ${isPositive ? 'positive' : ''}
              ${!isNegative && !isPositive ? 'neutral' : ''}
            `}>
              {isNegative && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {isPositive && (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {!isNegative && !isPositive && '—'}
              <span>{Math.abs(movement.percentageChange).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Baseline: <span className="text-slate-600 font-semibold">{formatValue(movement.baselineValue, kpi.id)}</span>
          </p>
        </div>
      </div>

      {/* Footer Metrics & CTA */}
      <div className="pt-3 border-t border-slate-100 mt-auto">
        <div className="grid grid-cols-3 gap-2 text-center mb-3">
          <div className="bg-slate-50/80 rounded py-1.5 px-1 border border-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Signal</p>
            <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">{movement.signalScore}<span className="text-[10px] text-slate-400 font-normal">/100</span></p>
          </div>
          <div className="bg-slate-50/80 rounded py-1.5 px-1 border border-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Materiality</p>
            <p className={`text-sm font-bold capitalize leading-tight mt-0.5 ${movement.materiality === 'high' ? 'text-amber-700' : 'text-slate-800'}`}>
              {movement.materiality}
            </p>
          </div>
          <div className="bg-slate-50/80 rounded py-1.5 px-1 border border-slate-100">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Freshness</p>
            <p className="text-sm font-bold text-slate-800 leading-tight mt-0.5">{movement.freshness}m</p>
          </div>
        </div>

        {/* Action Button */}
        {isInvestigate && onInvestigate ? (
          <button
            onClick={onInvestigate}
            className="btn btn-primary w-full text-xs py-2 font-semibold group flex items-center justify-center gap-1.5 shadow-sm"
          >
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Investigate Root Cause
          </button>
        ) : (
          <div className="h-8 flex items-center justify-center text-[11px] font-medium text-slate-400">
            Within expected bounds
          </div>
        )}
      </div>
    </div>
  );
}

function formatValue(value: number, kpiId: string): string {
  if (kpiId === 'revenue') {
    return `₹${(value / 1000000).toFixed(1)}M`;
  }
  if (kpiId === 'gross_margin') {
    return `${value.toFixed(1)}%`;
  }
  if (kpiId === 'average_selling_price') {
    return `₹${value.toLocaleString()}`;
  }
  return value.toLocaleString();
}
