import { Telemetry } from '@/types';

interface TelemetryPanelProps {
  telemetry: Telemetry;
  // When true, the LLM usage figures are deterministic stand-ins (no live model call in this build).
  simulated?: boolean;
}

export default function TelemetryPanel({ telemetry, simulated = false }: TelemetryPanelProps) {
  return (
    <div className="card">
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-base font-semibold text-slate-900">System Telemetry</h3>
        <p className="text-sm text-slate-500 mt-0.5">Real-time processing metrics</p>
      </div>

      <div className="p-5 space-y-5">
        {/* Data Sources */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-violet-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">Data Sources</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500 mb-0.5">Active Sources</p>
              <p className="text-xl font-bold text-slate-900">{telemetry.sourceCount}</p>
            </div>
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500 mb-0.5">Freshest Update</p>
              <p className="text-xl font-bold text-slate-900">{telemetry.freshestSource}<span className="text-sm font-normal text-slate-500">m</span></p>
            </div>
          </div>
        </div>

        {/* Runtime Performance */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">Runtime</p>
          </div>
          <div className="bg-slate-50 rounded-lg px-3 py-2">
            <p className="text-xs text-slate-500 mb-0.5">Analysis Latency</p>
            <p className="text-xl font-bold text-slate-900">{telemetry.analysisLatency}<span className="text-sm font-normal text-slate-500">s</span></p>
          </div>
        </div>

        {/* Processing Methods */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">Processing Breakdown</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-indigo-50 rounded-lg px-3 py-2.5">
              <p className="text-xs text-indigo-600 font-medium mb-0.5">Deterministic</p>
              <p className="text-lg font-bold text-indigo-900">{telemetry.processingMethods.deterministic}</p>
            </div>
            <div className="bg-purple-50 rounded-lg px-3 py-2.5">
              <p className="text-xs text-purple-600 font-medium mb-0.5">Statistical/ML</p>
              <p className="text-lg font-bold text-purple-900">{telemetry.processingMethods.statistical}</p>
            </div>
            <div className="bg-teal-50 rounded-lg px-3 py-2.5">
              <p className="text-xs text-teal-600 font-medium mb-0.5">Retrieval</p>
              <p className="text-lg font-bold text-teal-900">{telemetry.processingMethods.retrieval}</p>
            </div>
            <div className="bg-rose-50 rounded-lg px-3 py-2.5">
              <p className="text-xs text-rose-600 font-medium mb-0.5">LLM Calls</p>
              <p className="text-lg font-bold text-rose-900">{telemetry.processingMethods.llm}</p>
            </div>
          </div>
        </div>

        {/* LLM Metrics */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-slate-700">LLM Usage</p>
            </div>
            {simulated && (
              <span className="badge badge-warning text-xs">Simulated / Illustrative</span>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500 mb-0.5">Input</p>
              <p className="text-base font-bold text-slate-900">{telemetry.tokenUsage.input.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500 mb-0.5">Output</p>
              <p className="text-base font-bold text-slate-900">{telemetry.tokenUsage.output.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 rounded-lg px-3 py-2">
              <p className="text-xs text-slate-500 mb-0.5">Cost</p>
              <p className="text-base font-bold text-slate-900">{telemetry.estimatedCost}</p>
            </div>
          </div>
          {simulated && (
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Token counts and cost are deterministic stand-ins — no live LLM call is made in this build.
            </p>
          )}
        </div>

        {/* Processing Boundary Notice */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg border border-violet-200">
            <svg className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-violet-900 mb-1">Processing Boundary</p>
              <p className="text-xs text-violet-700 leading-relaxed">
                LLM is used only for narrative synthesis and persona adaptation. All quantitative calculations are deterministic or statistical.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
