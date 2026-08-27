'use client';

import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import KPICard from '@/components/kpi/KPICard';
import { kpiContracts } from '@/data/kpis/contracts';
import { runAnalysis, getAvailableScenarios } from '@/data/scenarios';
import { useAppState } from '@/lib/state/app-context';
import { canViewKPI, getRoleDefinition } from '@/lib/permissions/entitlements';
import { KPI } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const { scenario: activeScenario, setScenario, role } = useAppState();
  const analysis = runAnalysis(activeScenario);
  const scenarios = getAvailableScenarios();
  const roleDef = getRoleDefinition(role);

  // Same analysis for every role — entitlements only change which KPIs are visible.
  const visibleMovements = analysis.kpiMovements.filter((m) => canViewKPI(role, m.kpiId));
  const hiddenCount = analysis.kpiMovements.length - visibleMovements.length;

  const handleInvestigate = (kpiId: string) => {
    // Client-side navigation preserves shared state; scenario is also passed in the
    // URL as a deep-link backup so a direct refresh of /investigation stays correct.
    router.push(`/investigation?kpi=${kpiId}&scenario=${activeScenario}`);
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Decision Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Detect material KPI deviations, attribute root drivers, and route decision gates</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-md border ${roleDef.accent.bg} border-transparent`}>
              <svg className={`w-3.5 h-3.5 ${roleDef.accent.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className={`text-xs font-semibold ${roleDef.accent.text}`}>{roleDef.label}</span>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-white rounded-md border border-slate-200">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 status-pulse" />
              <span className="text-xs font-semibold text-slate-700">Pipeline Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Control & Executive Context */}
      <div className="mb-6 card p-3.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scenario Mode</span>
          <div className="segmented-control">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setScenario(scenario.type)}
                className={`segmented-control-item${activeScenario === scenario.type ? ' active' : ''}`}
              >
                {scenario.name}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-600 font-medium">
            {scenarios.find(s => s.type === activeScenario)?.description}
          </span>
        </div>
      </div>

      {/* KPI Performance Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Enterprise KPI Performance</h2>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200/80 px-1.5 py-0.2 rounded">
              {visibleMovements.length} Monitored
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Deterministic Baseline Comparison
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleMovements.map((movement) => {
            const kpi = kpiContracts[movement.kpiId];
            if (!kpi) return null;

            return (
              <KPICard
                key={movement.kpiId}
                movement={movement}
                kpi={kpi as KPI}
                onInvestigate={() => handleInvestigate(movement.kpiId)}
              />
            );
          })}
        </div>
      </div>

      {/* Role-scope note */}
      {hiddenCount > 0 && (
        <div className="mb-6 flex items-start gap-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50">
          <svg className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              {hiddenCount} KPI{hiddenCount > 1 ? 's' : ''} hidden for the {roleDef.label} role
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">{roleDef.description}</p>
          </div>
        </div>
      )}

      {/* Analysis Telemetry & Integrity Ribbon */}
      <div className="card p-4 border-slate-200/80 bg-slate-50/60">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Verifiable Telemetry</span>
            <div className="flex items-center gap-3 text-xs text-slate-600 font-medium">
              <span>{analysis.telemetry.sourceCount} connected sources</span>
              <span>•</span>
              <span>{analysis.telemetry.freshestSource}m freshest update</span>
              <span>•</span>
              <span className="font-mono">{analysis.telemetry.analysisLatency.toFixed(2)}s deterministic latency</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/80 text-slate-700">
              Deterministic: {analysis.telemetry.processingMethods.deterministic}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/80 text-slate-700">
              Statistical: {analysis.telemetry.processingMethods.statistical}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/80 text-slate-700">
              Retrieval: {analysis.telemetry.processingMethods.retrieval}
            </span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
