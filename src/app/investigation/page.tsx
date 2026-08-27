'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import DriverDecomposition from '@/components/charts/DriverDecomposition';
import EvidenceExplorer from '@/components/evidence/EvidenceExplorer';
import ConfidenceMeter from '@/components/confidence/ConfidenceMeter';
import SignalMeter from '@/components/charts/SignalMeter';
import { kpiContracts } from '@/data/kpis/contracts';
import { runAnalysis, isScenarioType } from '@/data/scenarios';
import { useAppState } from '@/lib/state/app-context';
import { maskField, getRoleDefinition } from '@/lib/permissions/entitlements';
import { Driver, Evidence, ConfidenceAssessment } from '@/types';

function InvestigationContent() {
  const searchParams = useSearchParams();
  const { scenario, setScenario, role } = useAppState();

  const kpiId = searchParams.get('kpi') || 'revenue';
  const scenarioParam = searchParams.get('scenario');

  // A valid ?scenario= param wins for the initial render (deep-link / refresh safety);
  // otherwise fall back to the shared app state.
  const effectiveScenario = isScenarioType(scenarioParam) ? scenarioParam : scenario;

  // Keep shared state in sync so other pages reflect a deep-linked scenario.
  useEffect(() => {
    if (isScenarioType(scenarioParam) && scenarioParam !== scenario) {
      setScenario(scenarioParam);
    }
  }, [scenarioParam, scenario, setScenario]);

  const analysis = runAnalysis(effectiveScenario);

  // Resolve the requested KPI; if it doesn't exist in this scenario, fall back to the
  // first available movement so the page never dead-ends when scenarios differ.
  const movement =
    analysis.kpiMovements.find((m) => m.kpiId === kpiId) ?? analysis.kpiMovements[0];
  const activeKpiId = movement?.kpiId ?? kpiId;
  const kpi = kpiContracts[activeKpiId];

  const drivers = analysis.drivers;
  const evidence = analysis.evidence;
  const confidence = analysis.confidence;

  // Derived pieces for the end-to-end analysis chain (KPI → driver → evidence → source →
  // method → confidence). All values come straight from the deterministic analysis result.
  const topDriver = drivers.find((d) => d.rank === 1) ?? drivers[0];
  const supportingCount = evidence.filter((e) => e.status === 'supporting').length;
  const counterCount = evidence.filter((e) => e.status === 'contradicting').length;
  const distinctSources = Array.from(new Set(evidence.map((e) => e.source)));
  const chainMethod = topDriver?.method ?? evidence[0]?.method ?? 'Deterministic aggregation';

  if (!kpi || !movement) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <p className="text-slate-500">KPI not found</p>
        </div>
      </AppLayout>
    );
  }

  const isNegative = movement.percentageChange < 0;
  const isPositive = movement.percentageChange > 0;

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Investigation</h1>
        <p className="text-sm text-slate-500 mt-0.5">Explore drivers and evidence behind KPI movements</p>
      </div>

      {/* KPI Movement Header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-label text-slate-500 mb-2">{kpi.name}</p>
            <div className="flex items-baseline gap-3">
              <span className="metric-value-lg text-slate-900">
                {formatValue(movement.currentValue, activeKpiId)}
              </span>
              <span className="text-sm text-slate-500">
                from {formatValue(movement.baselineValue, activeKpiId)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`movement-indicator ${isNegative ? 'negative' : isPositive ? 'positive' : 'neutral'} mb-2`}>
              {isNegative ? '↓' : isPositive ? '↑' : '—'} {Math.abs(movement.percentageChange).toFixed(1)}%
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                <span>Signal: {movement.signalScore}/100</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <span>Materiality: {movement.materiality}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Signal Score Indicator */}
        <div className="flex items-center gap-4 p-4 analytical-surface rounded-lg mt-5">
          <SignalMeter score={movement.signalScore} label="Signal Score" size="lg" />
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700">
              {movement.signalScore >= 70 ? 'Meaningful signal detected' : 'Movement within expected range'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {movement.signalScore >= 70
                ? 'Investigation recommended based on magnitude and volatility analysis'
                : 'No immediate action required - continue monitoring'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Analysis Chain — KPI movement → driver → evidence → source → method → confidence */}
          <div className="card">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-base font-semibold text-slate-900">Analysis Chain</h3>
              <p className="text-sm text-slate-500 mt-0.5">How this movement traces to a confidence score</p>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-stretch gap-2">
                <ChainNode step="1" label="KPI Movement" value={`${kpi.name}`} sub={`${isNegative ? '↓' : isPositive ? '↑' : '—'} ${Math.abs(movement.percentageChange).toFixed(1)}%`} tone="default" />
                <ChainArrow />
                <ChainNode step="2" label="Primary Driver" value={topDriver ? topDriver.name : 'No single driver'} sub={topDriver ? `${topDriver.contribution > 0 ? '+' : ''}${topDriver.contribution}pp` : 'insufficient evidence'} tone="accent" />
                <ChainArrow />
                <ChainNode step="3" label="Evidence" value={`${evidence.length} items`} sub={`${supportingCount} supporting · ${counterCount} counter`} tone="default" />
                <ChainArrow />
                <ChainNode step="4" label="Sources" value={`${distinctSources.length} sources`} sub={distinctSources.join(', ') || '—'} tone="default" />
                <ChainArrow />
                <ChainNode step="5" label="Method" value={chainMethod} tone="default" />
                <ChainArrow />
                <ChainNode step="6" label="Confidence" value={`${confidence.score}/100`} sub={confidence.score >= 70 ? 'High' : confidence.score >= 40 ? 'Moderate' : 'Low'} tone={confidence.score >= 70 ? 'success' : 'default'} />
              </div>
            </div>
          </div>

          {/* Driver Decomposition */}
          {drivers.length > 0 ? (
            <DriverDecomposition drivers={drivers as Driver[]} />
          ) : (
            <div className="card p-8 text-center">
              <p className="text-slate-500">No drivers identified for this scenario</p>
            </div>
          )}

          {/* Evidence Explorer */}
          {evidence.length > 0 ? (
            <div className="card">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-900">Evidence Explorer</h3>
                <p className="text-sm text-slate-500 mt-0.5">Supporting and contradicting evidence</p>
              </div>
              <div className="p-5">
                <EvidenceExplorer driverId={drivers[0]?.id || ''} evidence={evidence as Evidence[]} />
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-slate-500">No evidence available for this scenario</p>
            </div>
          )}
        </div>

        {/* Confidence Sidebar */}
        <div>
          <ConfidenceMeter assessment={confidence as ConfidenceAssessment} />

          {/* Quick Stats */}
          <div className="card p-5 mt-6">
            <h4 className="text-sm font-semibold text-slate-800 mb-4">Investigation Stats</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Drivers identified</span>
                <span className="font-semibold text-slate-900">{drivers.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Evidence items</span>
                <span className="font-semibold text-slate-900">{evidence.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Data sources</span>
                <span className="font-semibold text-slate-900">{analysis.telemetry.sourceCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Analysis time</span>
                <span className="font-semibold text-slate-900">{analysis.telemetry.analysisLatency.toFixed(2)}s</span>
              </div>
            </div>
          </div>

          {/* Supplier-sensitive detail — same data for every role, masked by entitlement */}
          {analysis.supplierDetail && (
            <SupplierDetailCard detail={analysis.supplierDetail} role={role} />
          )}
        </div>
      </div>
    </AppLayout>
  );
}

interface ChainNodeProps {
  step: string;
  label: string;
  value: string;
  sub?: string;
  tone: 'amber' | 'violet' | 'emerald' | 'blue' | 'slate' | 'purple';
}

function ChainNode({ step, label, value, sub, tone = 'default' }: { step: string; label: string; value: string; sub?: string; tone?: 'default' | 'accent' | 'success' }) {
  return (
    <div className="flex-1 min-w-[130px] rounded-lg bg-slate-50 border border-slate-200/90 p-3 hover:bg-white hover:border-slate-300 transition-all shadow-xs">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-slate-200 text-[10px] font-bold text-slate-700">{step}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-xs font-bold leading-tight ${tone === 'accent' ? 'text-violet-700' : tone === 'success' ? 'text-emerald-700' : 'text-slate-900'}`}>{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-1 leading-tight font-medium">{sub}</p>}
    </div>
  );
}

function ChainArrow() {
  return (
    <div className="flex items-center justify-center self-center text-slate-300 flex-shrink-0">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </div>
  );
}

function SupplierDetailCard({
  detail,
  role,
}: {
  detail: NonNullable<ReturnType<typeof runAnalysis>['supplierDetail']>;
  role: Parameters<typeof maskField>[0];
}) {
  const name = maskField(role, 'supplier_name', detail.supplierName);
  const margin = maskField(role, 'supplier_margin', detail.supplierMarginPct);
  const unitCost = maskField(role, 'supplier_pricing', detail.supplierUnitCost);
  const anyMasked = name.masked || margin.masked || unitCost.masked;
  const roleDef = getRoleDefinition(role);

  return (
    <div className="card mt-6">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <h4 className="text-sm font-semibold text-slate-800">Supplier Detail</h4>
        </div>
        {anyMasked && (
          <span className="badge badge-neutral text-xs">Restricted for {roleDef.label}</span>
        )}
      </div>
      <div className="p-5 space-y-3">
        <SupplierRow label="Supplier" value={name.value} masked={name.masked} />
        <SupplierRow label="Supplier margin" value={margin.value} masked={margin.masked} />
        <SupplierRow label="Unit cost" value={unitCost.value} masked={unitCost.masked} />
        <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">{detail.note}</p>
      </div>
    </div>
  );
}

function SupplierRow({ label, value, masked }: { label: string; value: string; masked: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`font-semibold ${masked ? 'text-slate-400 tracking-widest' : 'text-slate-900'}`} title={masked ? 'Masked for this role' : undefined}>
        {value}
      </span>
    </div>
  );
}

export default function InvestigationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <InvestigationContent />
    </Suspense>
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
  if (kpiId === 'fulfillment_sla') {
    return `${value}%`;
  }
  return value.toLocaleString();
}
