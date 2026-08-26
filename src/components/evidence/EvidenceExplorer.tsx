import { EvidenceExplorerProps, Evidence } from '@/types';

export default function EvidenceExplorer({ driverId, evidence }: EvidenceExplorerProps) {
  const supporting = evidence.filter(e => e.status === 'supporting');
  const contradicting = evidence.filter(e => e.status === 'contradicting');

  return (
    <div className="space-y-6">
      {/* Supporting Evidence */}
      {supporting.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-3">Supporting Evidence</h4>
          <div className="space-y-3">
            {supporting.map((item) => (
              <EvidenceItem key={item.id} evidence={item} />
            ))}
          </div>
        </div>
      )}

      {/* Counter-signals */}
      {contradicting.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-amber-700 mb-3">Counter-signals</h4>
          <div className="space-y-3">
            {contradicting.map((item) => (
              <EvidenceItem key={item.id} evidence={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EvidenceItem({ evidence }: { evidence: Evidence }) {
  return (
    <div className="bg-white border border-slate-200 rounded-md p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-slate-900">{evidence.description}</p>
        <span className={`
          px-2 py-0.5 rounded text-xs font-medium
          ${evidence.type === 'structured' ? 'bg-blue-50 text-blue-700' : ''}
          ${evidence.type === 'unstructured' ? 'bg-purple-50 text-purple-700' : ''}
          ${evidence.type === 'operational' ? 'bg-teal-50 text-teal-700' : ''}
        `}>
          {evidence.type}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4 text-xs text-slate-500">
        <div>
          <span className="font-medium">Source:</span> {evidence.source}
        </div>
        <div>
          <span className="font-medium">Freshness:</span> {evidence.freshness}m
        </div>
        <div>
          <span className="font-medium">Method:</span> {evidence.method}
        </div>
      </div>
    </div>
  );
}
