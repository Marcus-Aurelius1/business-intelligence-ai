'use client';

import AppLayout from '@/components/layout/AppLayout';
import { runAnalysis, ScenarioType, getAvailableScenarios } from '@/data/scenarios';
import { useAppState } from '@/lib/state/app-context';
import { ALL_ROLES, ROLE_DEFINITIONS, allowedKPIIds, maskField } from '@/lib/permissions/entitlements';
import { kpiContracts } from '@/data/kpis/contracts';

export default function ScenariosPage() {
  const {
    scenario: activeScenario,
    setScenario: setActiveScenario,
    persona: activePersona,
    setPersona: setActivePersona,
    role: activeRole,
    setRole,
  } = useAppState();
  const analysis = runAnalysis(activeScenario);
  const scenarios = getAvailableScenarios();

  const activeNarrative = analysis.personaNarratives.find(n => n.persona === activePersona);

  const scenarioCards = [
    { type: 'primary' as ScenarioType, badge: 'brand', badgeText: 'Primary' },
    { type: 'low_confidence' as ScenarioType, badge: 'warning', badgeText: 'Low Confidence' },
    { type: 'sparse_history' as ScenarioType, badge: 'neutral', badgeText: 'Sparse History' },
  ];

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Scenarios &amp; Personas</h1>
        <p className="text-sm text-slate-500 mt-0.5">Explore different narratives and edge cases</p>
      </div>

      {/* Persona Selector */}
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <span className="section-label">Persona</span>
          <div className="segmented-control">
            <button
              onClick={() => setActivePersona('business_head')}
              className={`segmented-control-item${activePersona === 'business_head' ? ' active' : ''}`}
            >
              Business Head
            </button>
            <button
              onClick={() => setActivePersona('finance_controller')}
              className={`segmented-control-item${activePersona === 'finance_controller' ? ' active' : ''}`}
            >
              Finance Controller
            </button>
            <button
              onClick={() => setActivePersona('business_analyst')}
              className={`segmented-control-item${activePersona === 'business_analyst' ? ' active' : ''}`}
            >
              Business Analyst
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {scenarioCards.map((s) => {
          const scenario = scenarios.find(sc => sc.type === s.type);
          const isActive = activeScenario === s.type;
          const scenarioAnalysis = runAnalysis(s.type);

          return (
            <div
              key={s.type}
              onClick={() => setActiveScenario(s.type)}
              className={`card p-5 cursor-pointer transition-all ${
                isActive
                  ? 'border-violet-500/80 ring-2 ring-violet-500/10 bg-violet-50/20 shadow-xs'
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2.5">
                <span className={`badge badge-${s.badge}`}>{s.badgeText}</span>
                {isActive && (
                  <span className="text-[11px] font-bold text-violet-700 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{scenario?.name}</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed line-clamp-2 min-h-[32px]">{scenario?.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="font-semibold text-slate-800">
                  <span className={`font-bold tabular-nums ${s.type === 'low_confidence' ? 'text-amber-600' : 'text-violet-700'}`}>
                    {scenarioAnalysis.confidence.score}%
                  </span>
                  {' '}confidence
                </div>
                <div className="text-[11px] text-slate-400">{scenarioAnalysis.drivers.length} drivers · {scenarioAnalysis.evidence.length} evidence</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Persona Narrative Preview */}
      <div className="card">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-violet-700">
                {activePersona === 'business_head' ? 'BH' : activePersona === 'finance_controller' ? 'FC' : 'BA'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activePersona === 'business_head' ? 'Business Head' : activePersona === 'finance_controller' ? 'Finance Controller' : 'Business Analyst'} Strategic Narrative
              </h3>
              <p className="text-xs text-slate-400">
                Key focus areas: {activeNarrative?.focus.join(', ')}
              </p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200/80">
            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {activeNarrative?.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Role-Based Access Demo — interactive, wired to the shared role state */}
      <div className="mt-6 card p-5">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold text-slate-900">Role-Based Access</h4>
          <span className="text-xs text-slate-500">Same analysis — entitlements only change visibility</span>
        </div>
        <p className="text-xs text-slate-500 mb-4">Select a role to apply it across the whole app (dashboard KPIs, supplier detail).</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ALL_ROLES.map((r) => {
            const def = ROLE_DEFINITIONS[r];
            const isActive = activeRole === r;
            const kpiIds = allowedKPIIds(r);
            const kpiLabels = kpiIds.map((id) => kpiContracts[id]?.name ?? id);
            return (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`text-left p-4 rounded-lg border transition-all ${
                  isActive ? `${def.accent.bg} border-transparent ring-2 ${def.accent.ring}` : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${def.accent.bg}`}>
                      <span className={`text-xs font-bold ${def.accent.text}`}>{def.short}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900">{def.label}</span>
                  </div>
                  {isActive && (
                    <svg className={`w-4 h-4 ${def.accent.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-slate-600 mb-3">{def.description}</p>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Visible KPIs ({kpiLabels.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {kpiLabels.map((label) => (
                      <span key={label} className="inline-block px-1.5 py-0.5 rounded bg-white/70 border border-slate-200 text-[11px] text-slate-600">{label}</span>
                    ))}
                  </div>
                  <p className={`text-[11px] mt-2 font-medium ${def.maskedFields.length ? 'text-slate-700' : 'text-slate-400'}`}>
                    {def.maskedFields.length > 0
                      ? `${def.maskedFields.length} supplier field${def.maskedFields.length > 1 ? 's' : ''} masked`
                      : 'No fields masked'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live masking preview for the active role, using the shared supplier data */}
        {analysis.supplierDetail && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Supplier detail as seen by {ROLE_DEFINITIONS[activeRole].label}</p>
              {ROLE_DEFINITIONS[activeRole].maskedFields.length > 0 && (
                <span className="badge badge-neutral text-xs">Masked</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              {(() => {
                const name = maskField(activeRole, 'supplier_name', analysis.supplierDetail.supplierName);
                const margin = maskField(activeRole, 'supplier_margin', analysis.supplierDetail.supplierMarginPct);
                const cost = maskField(activeRole, 'supplier_pricing', analysis.supplierDetail.supplierUnitCost);
                return (
                  <>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Supplier</p>
                      <p className={`font-semibold ${name.masked ? 'text-slate-400 tracking-widest' : 'text-slate-900'}`}>{name.value}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Margin</p>
                      <p className={`font-semibold ${margin.masked ? 'text-slate-400 tracking-widest' : 'text-slate-900'}`}>{margin.value}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Unit cost</p>
                      <p className={`font-semibold ${cost.masked ? 'text-slate-400 tracking-widest' : 'text-slate-900'}`}>{cost.value}</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
