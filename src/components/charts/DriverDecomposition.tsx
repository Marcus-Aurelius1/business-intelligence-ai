import { Driver } from '@/types';

interface DriverDecompositionProps {
  drivers: Driver[];
}

export default function DriverDecomposition({ drivers }: DriverDecompositionProps) {
  const sortedDrivers = [...drivers].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  const maxContribution = Math.max(...drivers.map(d => Math.abs(d.contribution)));

  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Driver Decomposition</h3>
            <p className="text-sm text-slate-500 mt-0.5">Contribution to KPI movement (percentage points)</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-400" />
              <span className="text-slate-600">Negative</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-400" />
              <span className="text-slate-600">Positive</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {sortedDrivers.map((driver, index) => {
          const isNegative = driver.contribution < 0;
          const barWidth = Math.min(100, Math.max(4, (Math.abs(driver.contribution) / maxContribution) * 100));
          const barBg = isNegative ? 'bg-rose-500' : 'bg-emerald-500';

          return (
            <div key={driver.id} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-400 w-4 tabular-nums">#{index + 1}</span>
                  <span className="text-sm font-semibold text-slate-800">{driver.name}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className={`text-sm font-bold font-mono tabular-nums ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {isNegative ? '' : '+'}{driver.contribution.toFixed(1)}pp
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded">
                    {driver.confidence}% conf
                  </span>
                </div>
              </div>

              {/* Precision Data Bar */}
              <div className="ml-6.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${barBg} transition-all duration-300`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* Metadata tags */}
              <div className="ml-6.5 mt-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200/60 text-slate-600">
                  {driver.method}
                </span>
                <span>•</span>
                <span>{driver.evidenceCount} evidence items</span>
                <span>•</span>
                <span>{driver.freshness}m freshness</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Net Movement Total */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 rounded-b-lg">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Net Movement</span>
          <span className="text-base font-bold font-mono text-slate-900 tabular-nums">
            {sortedDrivers.reduce((sum, d) => sum + d.contribution, 0).toFixed(1)}pp
          </span>
        </div>
      </div>
    </div>
  );
}
