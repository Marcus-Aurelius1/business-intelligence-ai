import { Telemetry } from '@/types';

interface TelemetryPanelProps {
  telemetry: Telemetry;
}

export default function TelemetryPanel({ telemetry }: TelemetryPanelProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg">
      <div className="px-4 py-3 border-b border-slate-200">
        <h3 className="text-sm font-medium text-slate-900">System Telemetry</h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Data */}
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Data</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Sources:</span>
              <span className="font-medium text-slate-900">{telemetry.sourceCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Freshest:</span>
              <span className="font-medium text-slate-900">{telemetry.freshestSource}m</span>
            </div>
          </div>
        </div>

        {/* Runtime */}
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Runtime</p>
          <div className="text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Analysis latency:</span>
              <span className="font-medium text-slate-900">{telemetry.analysisLatency}s</span>
            </div>
          </div>
        </div>

        {/* Processing */}
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Processing</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Deterministic:</span>
              <span className="font-medium text-slate-900">{telemetry.processingMethods.deterministic}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Statistical:</span>
              <span className="font-medium text-slate-900">{telemetry.processingMethods.statistical}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Retrieval:</span>
              <span className="font-medium text-slate-900">{telemetry.processingMethods.retrieval}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">LLM:</span>
              <span className="font-medium text-slate-900">{telemetry.processingMethods.llm}</span>
            </div>
          </div>
        </div>

        {/* LLM */}
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">LLM</p>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-slate-600">Input:</span>
              <span className="ml-1 font-medium text-slate-900">{telemetry.tokenUsage.input}</span>
            </div>
            <div>
              <span className="text-slate-600">Output:</span>
              <span className="ml-1 font-medium text-slate-900">{telemetry.tokenUsage.output}</span>
            </div>
            <div>
              <span className="text-slate-600">Cost:</span>
              <span className="ml-1 font-medium text-slate-900">{telemetry.estimatedCost}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
