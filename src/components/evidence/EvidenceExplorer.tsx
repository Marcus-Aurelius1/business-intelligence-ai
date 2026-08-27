import { ReactNode } from 'react';
import { EvidenceExplorerProps, Evidence } from '@/types';

interface EvidenceTypeConfig {
  bg: string;
  text: string;
  border: string;
  icon: ReactNode;
  label: string;
}

type EvidenceTypeConfigMap = Record<Evidence['type'], EvidenceTypeConfig>;

const typeConfig: EvidenceTypeConfigMap = {
  structured: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
      </svg>
    ),
    label: 'Structured Data',
  },
  unstructured: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    label: 'Unstructured',
  },
  operational: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-200',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
      </svg>
    ),
    label: 'Operational',
  },
};

export default function EvidenceExplorer({ evidence }: EvidenceExplorerProps) {
  const supporting = evidence.filter((e) => e.status === 'supporting');
  const contradicting = evidence.filter((e) => e.status === 'contradicting');
  // Contextual/neutral evidence (e.g. sparse-history data-availability notes) must not be
  // silently dropped — surface it in its own group.
  const neutral = evidence.filter((e) => e.status === 'neutral');

  if (evidence.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm text-slate-500">No evidence available for this scenario.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Supporting Evidence */}
      {supporting.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Supporting Evidence</h4>
            <span className="text-xs text-slate-500">({supporting.length} items)</span>
          </div>
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
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Counter-signals</h4>
            <span className="text-xs text-slate-500">({contradicting.length} items)</span>
          </div>
          <div className="space-y-3">
            {contradicting.map((item) => (
              <EvidenceItem key={item.id} evidence={item} />
            ))}
          </div>
        </div>
      )}

      {/* Contextual / neutral evidence */}
      {neutral.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Contextual Notes</h4>
            <span className="text-xs text-slate-500">({neutral.length} items)</span>
          </div>
          <div className="space-y-3">
            {neutral.map((item) => (
              <EvidenceItem key={item.id} evidence={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EvidenceItem({ evidence }: { evidence: Evidence }) {
  const config = typeConfig[evidence.type];
  const statusClass = evidence.status === 'neutral' ? '' : evidence.status;

  return (
    <div className={`evidence-card ${statusClass} hover:shadow-xs transition-all duration-150 p-4`}>
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <p className="text-xs font-semibold text-slate-800 leading-relaxed flex-1">
          {evidence.description}
        </p>
        <span className={`
          inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold flex-shrink-0
          ${config.bg} ${config.text} border ${config.border}
        `}>
          {config.icon}
          {config.label}
        </span>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium flex-wrap">
        <span className="font-semibold text-slate-700">{evidence.source}</span>
        <span>•</span>
        <span>{evidence.freshness}m ago</span>
        <span>•</span>
        <span>{evidence.method}</span>
      </div>

      {/* Data lineage */}
      {evidence.lineage && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">Lineage</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100/90 text-slate-700 font-mono text-[11px] border border-slate-200/80 truncate">
            {evidence.lineage}
          </span>
        </div>
      )}
    </div>
  );
}
