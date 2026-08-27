'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import RecommendationCard, { DecisionAction } from '@/components/recommendations/RecommendationCard';
import FeedbackWidget from '@/components/feedback/FeedbackWidget';
import { runAnalysis, getAvailableScenarios } from '@/data/scenarios';
import { useAppState } from '@/lib/state/app-context';
import { computeScenarioProjection, scenarioAssumptions } from '@/lib/analytics/scenario-test';
import { Persona } from '@/types';

const personaMeta: { id: Persona; label: string }[] = [
  { id: 'business_head', label: 'Business Head' },
  { id: 'finance_controller', label: 'Finance Controller' },
  { id: 'business_analyst', label: 'Business Analyst' },
];

function formatRevenue(value: number): string {
  return `${(value / 1000000).toFixed(1)}M`;
}

export default function RecommendationsPage() {
  const { scenario: activeScenario, setScenario, persona, setPersona } = useAppState();
  const analysis = runAnalysis(activeScenario);
  const scenarios = getAvailableScenarios();

  const recommendation = analysis.recommendation;
  const isAbstaining = recommendation.routing !== 'recommend';

  // Scenario-test + decision state. Reset whenever the scenario changes.
  const [activeAssumptions, setActiveAssumptions] = useState<string[]>([]);
  const [decision, setDecision] = useState<DecisionAction | null>(null);
  // Human override of the abstain gate — lets a person approve despite the system withholding
  // a confident recommendation, with the override explicitly recorded (human stays in control).
  const [override, setOverride] = useState(false);
  const [overrideRecorded, setOverrideRecorded] = useState(false);

  // Reset when the scenario changes. Done during render (React's "adjusting state on a
  // prop change" pattern) rather than in an effect — no extra commit, no cascading render.
  const [prevScenario, setPrevScenario] = useState(activeScenario);
  if (activeScenario !== prevScenario) {
    setPrevScenario(activeScenario);
    setActiveAssumptions([]);
    setDecision(null);
    setOverride(false);
    setOverrideRecorded(false);
  }

  const baselineRevenue = analysis.kpiMovements.find((m) => m.kpiId === 'revenue')?.currentValue ?? 0;
  const projection = computeScenarioProjection(baselineRevenue, activeAssumptions);
  const hasAssumptions = projection.multiplier !== 1;

  const toggleAssumption = (id: string) => {
    setActiveAssumptions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Approve from the Decision Gate. When the system is abstaining, approval is only reachable
  // via the explicit human override toggle, and we record that it was an override.
  const handleApprove = () => {
    setOverrideRecorded(isAbstaining && override);
    setDecision('approved');
  };

  const personaNarrative = analysis.personaNarratives.find((n) => n.persona === persona);

  const decisionMessage = (d: DecisionAction): string => {
    switch (d) {
      case 'approved':
        return `Action approved and routed to ${recommendation.owner}. Monitoring plan activated.`;
      case 'tested':
        return 'Logged for scenario testing. Review the projected impact before committing.';
      case 'deferred':
        return 'Decision deferred. No action taken; item returned to the monitoring queue.';
      case 'clarify':
        return `Clarification requested${recommendation.clarificationQuestion ? `: ${recommendation.clarificationQuestion}` : ''} Awaiting input before any action.`;
      case 'monitor':
        return 'Monitoring continued. No confident diagnosis until a reliable baseline is established.';
    }
  };

  const decisionTone: Record<DecisionAction, string> = {
    approved: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    tested: 'bg-violet-50 border-violet-200 text-violet-800',
    deferred: 'bg-slate-50 border-slate-200 text-slate-700',
    clarify: 'bg-amber-50 border-amber-200 text-amber-800',
    monitor: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Decision Workspace</h1>
        <p className="text-sm text-slate-500 mt-0.5">Evidence-backed recommendations with scenario testing</p>
      </div>

      {/* Scenario + Persona Selectors */}
      <div className="mb-6 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="section-label">Scenario</span>
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
        <div className="flex items-center gap-3">
          <span className="section-label">Persona</span>
          <div className="segmented-control">
            {personaMeta.map((p) => (
              <button
                key={p.id}
                onClick={() => setPersona(p.id)}
                className={`segmented-control-item${persona === p.id ? ' active' : ''}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Abstain / Monitor banner — makes low-confidence & sparse-history behavior explicit */}
      {isAbstaining && (
        <div className={`mb-6 rounded-lg border p-4 ${activeScenario === 'sparse_history' ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-start gap-3">
            <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${activeScenario === 'sparse_history' ? 'text-blue-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className={`text-sm font-semibold ${activeScenario === 'sparse_history' ? 'text-blue-900' : 'text-amber-900'}`}>
                {activeScenario === 'sparse_history'
                  ? 'MONITOR — insufficient historical baseline'
                  : 'ABSTAIN — evidence is conflicting / insufficient'}
              </p>
              <p className={`text-sm mt-0.5 ${activeScenario === 'sparse_history' ? 'text-blue-700' : 'text-amber-700'}`}>
                {activeScenario === 'sparse_history'
                  ? `Confidence ${analysis.confidence.score}%. No confident diagnosis — continue monitoring until a reliable baseline is established.`
                  : `Confidence ${analysis.confidence.score}%. No confident action recommended — request clarification before acting.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Decision Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendation Card */}
        <RecommendationCard
          recommendation={recommendation}
          scenarioType={activeScenario}
          onDecision={setDecision}
        />

        <div className="space-y-6">
          {/* Persona Narrative */}
          <div className="card">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Persona View</h3>
              <span className="badge badge-neutral">{personaMeta.find((p) => p.id === persona)?.label}</span>
            </div>
            <div className="p-5">
              <p className="text-sm text-slate-700 leading-relaxed">
                {personaNarrative?.summary ?? 'No narrative available for this persona in the current scenario.'}
              </p>
              {personaNarrative && personaNarrative.focus.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {personaNarrative.focus.map((f) => (
                    <span key={f} className="badge badge-brand">{f}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Scenario Testing */}
          <div className="card">
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900">Scenario Testing</h3>
                <span className="badge badge-neutral">Illustrative</span>
              </div>
            </div>
            <div className="p-5">
              {/* Baseline */}
              <div className="mb-5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Baseline Revenue</label>
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-xs text-slate-500 font-medium">Deterministic Baseline</span>
                  <span className="text-sm font-bold font-mono text-slate-900 tabular-nums">₹{formatRevenue(baselineRevenue)}</span>
                </div>
              </div>

              {/* Assumptions */}
              <div className="mb-5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Select Assumption</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {scenarioAssumptions.map((assumption) => {
                    const active = activeAssumptions.includes(assumption.id);
                    return (
                      <button
                        key={assumption.id}
                        onClick={() => toggleAssumption(assumption.id)}
                        title={assumption.rationale}
                        className={`text-xs px-3 py-2 rounded-md font-semibold text-left transition-all border ${
                          active
                            ? 'bg-violet-900 text-white border-violet-950 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {assumption.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scenario Output */}
              <div className="bg-slate-50/90 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Projected Impact</span>
                  <span className={`text-xs font-bold font-mono tabular-nums ${hasAssumptions ? (projection.delta >= 0 ? 'text-emerald-700' : 'text-rose-700') : 'text-slate-500'}`}>
                    {hasAssumptions
                      ? `Δ ${projection.delta >= 0 ? '+' : '-'}₹${formatRevenue(Math.abs(projection.delta))}`
                      : 'At baseline'}
                  </span>
                </div>
                <div className="text-center py-3">
                  <p className="text-3xl font-extrabold font-mono text-slate-900 tabular-nums tracking-tight">₹{formatRevenue(projection.projected)}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {hasAssumptions
                      ? 'Illustrative projection under active assumptions'
                      : 'Select an assumption above to simulate delta'}
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-3.5 flex items-start gap-2 p-2.5 bg-slate-100/70 rounded-md border border-slate-200/60">
                <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Scenario testing provides illustrative estimates under explicit assumptions. It does not prove causal impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Gate */}
      <div className="mt-6 card p-5 border-slate-200">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-0.5">Decision Gate</h4>
            <p className="text-xs text-slate-500">
              {recommendation.routing === 'recommend'
                ? 'Review evidence and approve action'
                : recommendation.routing === 'escalate'
                ? 'Material risk — escalate to leadership'
                : 'Human review required — approval disabled until confidence improves'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-ghost text-sm py-2 px-3" onClick={() => { setOverrideRecorded(false); setDecision('deferred'); }}>Defer</button>
            <button className="btn btn-secondary text-sm py-2 px-3" onClick={() => { setOverrideRecorded(false); setDecision('tested'); }}>Test scenario</button>
            <button
              className={`btn btn-primary text-sm py-2 px-4 ${isAbstaining && !override ? 'opacity-40 cursor-not-allowed' : ''}`}
              disabled={isAbstaining && !override}
              title={isAbstaining && !override ? 'Approval disabled — system is abstaining. Enable human override to approve anyway.' : undefined}
              onClick={handleApprove}
            >
              Approve &amp; Act
            </button>
          </div>
        </div>

        {/* Human override — only relevant while the system is abstaining */}
        {isAbstaining && (
          <label className="mt-4 flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 p-3 cursor-pointer">
            <input
              type="checkbox"
              checked={override}
              onChange={(e) => setOverride(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-300"
            />
            <span className="text-sm text-slate-700">
              <span className="font-semibold">Human override</span> — approve despite the abstain gate. The system recommends withholding action at {analysis.confidence.score}% confidence; overriding is logged as a human decision.
            </span>
          </label>
        )}

        {decision && (
          <div className={`mt-4 rounded-lg border p-3 text-sm ${decisionTone[decision]}`}>
            {decision === 'approved' && overrideRecorded ? (
              <span>
                <span className="font-semibold">Human override recorded.</span> Action approved by a human against the system&apos;s abstain recommendation ({analysis.confidence.score}% confidence). Routed to {recommendation.owner}; monitoring plan activated.
              </span>
            ) : (
              decisionMessage(decision)
            )}
          </div>
        )}
      </div>

      {/* Feedback loop — local-only, visibly updates a persisted history */}
      <div className="mt-6">
        <FeedbackWidget
          targetId={`${analysis.scenarioId}:${recommendation.driverId || 'recommendation'}`}
          targetLabel={`${scenarios.find((s) => s.type === activeScenario)?.name ?? activeScenario} — ${recommendation.controllableLever}`}
          scenario={activeScenario}
        />
      </div>
    </AppLayout>
  );
}
