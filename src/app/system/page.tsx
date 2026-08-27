'use client';

import AppLayout from '@/components/layout/AppLayout';
import TelemetryPanel from '@/components/telemetry/TelemetryPanel';
import { runAnalysis, TELEMETRY_IS_SIMULATED } from '@/data/scenarios';
import { useAppState } from '@/lib/state/app-context';
import { erpSourceMeta } from '@/data/sources/sales-transactions';
import { crmSourceMeta } from '@/data/sources/customer-feedback';
import { opsSourceMeta } from '@/data/sources/operations-events';

export default function SystemPage() {
  const { scenario } = useAppState();
  const analysis = runAnalysis(scenario);

  // Single source of truth: telemetry comes from the analysis result, not hardcoded here.
  const telemetryData = analysis.telemetry;

  const sources = [erpSourceMeta, crmSourceMeta, opsSourceMeta];

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">System &amp; Trust</h1>
        <p className="text-sm text-slate-500 mt-0.5">Processing transparency and telemetry</p>
      </div>

      {/* Data Sources & Processing Boundary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Connected Data Sources</h3>
              <p className="text-xs text-slate-400">Deterministic integration contracts</p>
            </div>
            <span className="badge badge-brand text-[11px]">{sources.length} Active</span>
          </div>
          <div className="p-5">
            <div className="space-y-2.5">
              {sources.map((source) => {
                const freshness = source.freshnessMinutes;
                const freshnessColor = freshness < 30 ? 'text-emerald-700 font-semibold' : freshness < 60 ? 'text-amber-700 font-semibold' : 'text-rose-700 font-semibold';

                return (
                  <div key={source.id} className="flex items-center justify-between p-3 bg-slate-50/80 rounded-lg border border-slate-200/70">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-slate-200/80 flex items-center justify-center text-slate-700 font-mono text-xs font-bold uppercase">
                        {source.type.slice(0, 3)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{source.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{source.grain}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-mono tabular-nums ${freshnessColor}`}>{freshness}m ago</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Freshness</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Processing Boundary */}
        <div className="card">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Processing Boundary Architecture</h3>
              <p className="text-xs text-slate-400">Strict separation of deterministic vs generative compute</p>
            </div>
            <span className="badge badge-neutral text-[11px]">Verifiable</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50/90 rounded-lg border border-slate-200/80">
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-200/60">
                  <span className="w-4 h-4 rounded bg-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-center">D</span>
                  <span className="text-xs font-bold text-slate-800">Deterministic</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600 font-medium">
                  <li>• KPI calculations</li>
                  <li>• Aggregations</li>
                  <li>• Contribution math</li>
                  <li>• Threshold checks</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50/90 rounded-lg border border-slate-200/80">
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-200/60">
                  <span className="w-4 h-4 rounded bg-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-center">S</span>
                  <span className="text-xs font-bold text-slate-800">Statistical/ML</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600 font-medium">
                  <li>• Signal scoring</li>
                  <li>• Driver ranking</li>
                  <li>• Confidence score</li>
                  <li>• Volatility tests</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50/90 rounded-lg border border-slate-200/80">
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-200/60">
                  <span className="w-4 h-4 rounded bg-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-center">R</span>
                  <span className="text-xs font-bold text-slate-800">Retrieval</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600 font-medium">
                  <li>• Ticket search</li>
                  <li>• Review clustering</li>
                  <li>• Unstructured data</li>
                  <li>• Context grounding</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50/90 rounded-lg border border-slate-200/80">
                <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-200/60">
                  <span className="w-4 h-4 rounded bg-slate-200 text-[10px] font-bold text-slate-700 flex items-center justify-center">AI</span>
                  <span className="text-xs font-bold text-slate-800">LLM Synthesis</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600 font-medium">
                  <li>• Narrative summary</li>
                  <li>• Persona adapting</li>
                  <li>• Action draft</li>
                  <li>• Zero math role</li>
                </ul>
              </div>
            </div>

            {/* Key Note */}
            <div className="mt-4 trust-callout">
              <svg className="w-4 h-4 text-violet-700 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              <div>
                <p className="trust-callout-title">Deterministic Source of Truth Guardrail</p>
                <p className="trust-callout-body">
                  All KPI movements, driver contributions, and confidence calculations are strictly computed deterministically and statistically. The LLM is restricted exclusively to executive narrative synthesis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry Panel */}
      <TelemetryPanel telemetry={telemetryData} simulated={TELEMETRY_IS_SIMULATED} />
    </AppLayout>
  );
}
