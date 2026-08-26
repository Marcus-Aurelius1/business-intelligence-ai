import { KPICardProps } from '@/types';

export default function KPICard({ movement, kpi, onInvestigate }: KPICardProps) {
  const isNegative = movement.percentageChange < 0;
  const isPositive = movement.percentageChange > 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:border-slate-300 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
            {kpi.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">{kpi.definition}</p>
        </div>
        <span className={`
          px-2.5 py-1 rounded-full text-xs font-medium
          ${movement.status === 'investigate' ? 'bg-amber-100 text-amber-800' : ''}
          ${movement.status === 'stable' ? 'bg-slate-100 text-slate-600' : ''}
          ${movement.status === 'action_required' ? 'bg-red-100 text-red-800' : ''}
        `}>
          {movement.status.replace('_', ' ')}
        </span>
      </div>

      {/* Values */}
      <div className="mb-4">
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-slate-900">
            {formatValue(movement.currentValue, kpi.id)}
          </span>
          <span className="text-sm text-slate-500">
            from {formatValue(movement.baselineValue, kpi.id)}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`
            text-lg font-medium
            ${isNegative ? 'text-red-600' : ''}
            ${isPositive ? 'text-emerald-600' : ''}
            ${!isNegative && !isPositive ? 'text-slate-600' : ''}
          `}>
            {isNegative ? '↓' : isPositive ? '↑' : '—'} {Math.abs(movement.percentageChange).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100">
        <div>
          <p className="text-xs text-slate-500 mb-1">Signal</p>
          <p className="text-sm font-medium text-slate-900">{movement.signalScore}/100</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Materiality</p>
          <p className="text-sm font-medium text-slate-900 capitalize">{movement.materiality}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Freshness</p>
          <p className="text-sm font-medium text-slate-900">{movement.freshness}m</p>
        </div>
      </div>

      {/* Action */}
      {movement.status === 'investigate' && onInvestigate && (
        <button
          onClick={onInvestigate}
          className="mt-4 w-full px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-md hover:bg-violet-700 transition-colors"
        >
          Investigate
        </button>
      )}
    </div>
  );
}

function formatValue(value: number, kpiId: string): string {
  if (kpiId === 'revenue' || kpiId === 'gross_margin') {
    return `₹${(value / 1000000).toFixed(1)}M`;
  }
  return value.toLocaleString();
}
