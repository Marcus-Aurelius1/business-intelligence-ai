import { Driver } from '@/types';

interface DriverDecompositionProps {
  drivers: Driver[];
}

export default function DriverDecomposition({ drivers }: DriverDecompositionProps) {
  const sortedDrivers = [...drivers].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  const maxContribution = Math.max(...drivers.map(d => Math.abs(d.contribution)));

  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-sm font-medium text-slate-900">Driver Decomposition</h3>
      </div>

      <div className="p-4 space-y-3">
        {sortedDrivers.map((driver) => {
          const isNegative = driver.contribution < 0;
          const barWidth = Math.abs(driver.contribution) / maxContribution * 100;

          return (
            <div key={driver.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-700">{driver.name}</span>
                <span className={`text-sm font-medium ${isNegative ? 'text-red-600' : 'text-emerald-600'}`}>
                  {isNegative ? '' : '+'}{driver.contribution.toFixed(1)}pp
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isNegative ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
