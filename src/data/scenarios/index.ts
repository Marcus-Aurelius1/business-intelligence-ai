// Intelligence Engine - Orchestrates all analysis components
// Deterministic pipeline: Raw data → KPI calc → Signal validation → Driver decomposition → Evidence matching → Confidence → Recommendation

import { KPIMovement, Driver, Evidence, ConfidenceAssessment, Recommendation, Persona, Telemetry } from '@/types';
import { kpiContracts } from '@/data/kpis/contracts';
import { primaryScenario, lowConfidenceScenario, sparseHistoryScenario } from '@/data/scenarios/primary';
import { erpSourceMeta } from '@/data/sources/sales-transactions';
import { crmSourceMeta } from '@/data/sources/customer-feedback';
import { opsSourceMeta } from '@/data/sources/operations-events';
import { calculateAllKPIs } from '@/lib/analytics/kpi-calculator';
import { validateSignal, assessMateriality, determineStatus } from '@/lib/signals/scoring';
import { performDriverDecomposition } from '@/lib/drivers/decomposition';
import { calculateConfidence, getPrimaryScenarioConfidence, getLowConfidenceScenarioConfidence, getSparseHistoryConfidence } from '@/lib/confidence/calculation';
import { generateRecommendation, getPrimaryScenarioRecommendation, getLowConfidenceRecommendation, getSparseHistoryRecommendation } from '@/lib/recommendations/engine';
import { getAllEvidence } from '@/lib/evidence/matcher';

export type ScenarioType = 'primary' | 'low_confidence' | 'sparse_history';

// Type guard + normalizer so invalid/unknown scenario values degrade gracefully to 'primary'.
export function isScenarioType(value: unknown): value is ScenarioType {
  return value === 'primary' || value === 'low_confidence' || value === 'sparse_history';
}

export function normalizeScenarioType(value: unknown): ScenarioType {
  return isScenarioType(value) ? value : 'primary';
}

// Deterministic per-scenario analysis latency (seconds). Primary matches the deck's 1.8s.
const ANALYSIS_LATENCY_SECONDS: Record<ScenarioType, number> = {
  primary: 1.8,
  low_confidence: 2.1,
  sparse_history: 0.9,
};

// The three connected data sources. Freshness values are static literals (no wall-clock
// read), so the "freshest source" metric is identical on server and client.
const SOURCE_METAS = [erpSourceMeta, crmSourceMeta, opsSourceMeta];
const SOURCE_COUNT = SOURCE_METAS.length;
const FRESHEST_SOURCE_MINUTES = Math.min(...SOURCE_METAS.map((s) => s.freshnessMinutes));

// SIMULATED / ILLUSTRATIVE LLM usage per scenario — there is NO live LLM call in this
// build. These deterministic figures represent what narrative synthesis + persona
// adaptation would consume, so telemetry can demonstrate token/cost accounting without
// claiming a live model. Primary matches the PRD Section 17 example (calls≈1–2, ~1.2K in).
const LLM_SIM: Record<ScenarioType, { calls: number; input: number; output: number }> = {
  primary: { calls: 2, input: 1182, output: 423 },
  low_confidence: { calls: 2, input: 1340, output: 389 },
  sparse_history: { calls: 1, input: 720, output: 210 },
};

// Illustrative token pricing (USD per 1M tokens) — used only to show an estimated cost.
const INPUT_RATE_PER_M = 3.0;
const OUTPUT_RATE_PER_M = 15.0;
function estimateCost(inputTokens: number, outputTokens: number): string {
  const usd = (inputTokens * INPUT_RATE_PER_M + outputTokens * OUTPUT_RATE_PER_M) / 1_000_000;
  return `$${usd.toFixed(4)}`;
}

// Deterministic count of processing steps per method, so the System page's processing
// breakdown always reconciles with the LLM call count shown elsewhere.
const PROCESSING_METHODS: Record<ScenarioType, Telemetry['processingMethods']> = {
  primary: { deterministic: 4, statistical: 2, retrieval: 3, llm: LLM_SIM.primary.calls },
  low_confidence: { deterministic: 4, statistical: 3, retrieval: 2, llm: LLM_SIM.low_confidence.calls },
  sparse_history: { deterministic: 3, statistical: 1, retrieval: 1, llm: LLM_SIM.sparse_history.calls },
};

// Whether telemetry LLM/cost figures are simulated. Always true in this build (no live model).
export const TELEMETRY_IS_SIMULATED = true;

// Main analysis result
export interface AnalysisResult {
  scenarioId: string;
  scenarioType: ScenarioType;
  kpiMovements: KPIMovement[];
  drivers: Driver[];
  evidence: Evidence[];
  confidence: ConfidenceAssessment;
  recommendation: Recommendation;
  personaNarratives: {
    persona: Persona;
    summary: string;
    focus: string[];
  }[];
  // Single shared telemetry object — every page reads these figures from here so numbers
  // never drift between screens (Round 2 telemetry-completeness requirement).
  telemetry: Telemetry;
  // Supplier-sensitive margin detail (optional). Present only where the scenario has a
  // supplier story; rendered with role-based masking, never removed from the data.
  supplierDetail?: {
    supplierName: string;
    supplierMarginPct: string;
    supplierUnitCost: string;
    note: string;
  };
}

// Run full analysis for a scenario
export function runAnalysis(scenarioType: ScenarioType = 'primary'): AnalysisResult {
  // Normalize so an invalid value never throws — fall back to the primary scenario.
  const type = normalizeScenarioType(scenarioType);

  // Select scenario
  const scenario = type === 'primary' ? primaryScenario :
                   type === 'low_confidence' ? lowConfidenceScenario :
                   sparseHistoryScenario;

  // Get KPI movements from scenario
  const kpiMovements = scenario.kpiMovements;

  // Get drivers from scenario (or calculate)
  const drivers = scenario.drivers.length > 0 ? scenario.drivers : performDriverDecomposition();

  // Get evidence
  const evidence = scenario.evidence;

  // Get confidence
  const confidence = scenario.confidence;

  // Get recommendation
  const recommendation = scenario.recommendation;

  // Get persona narratives
  const personaNarratives = scenario.personaNarratives;

  // Calculate telemetry (deterministic — no wall-clock reads, so values are reproducible
  // and identical between server render and client hydration). All figures come from this
  // single object; LLM/cost values are SIMULATED (no live model call in this build).
  const llm = LLM_SIM[type];
  const telemetry: Telemetry = {
    sourceCount: SOURCE_COUNT,
    freshestSource: FRESHEST_SOURCE_MINUTES,
    analysisLatency: ANALYSIS_LATENCY_SECONDS[type],
    modelCallCount: llm.calls,
    tokenUsage: { input: llm.input, output: llm.output },
    estimatedCost: estimateCost(llm.input, llm.output),
    processingMethods: PROCESSING_METHODS[type],
  };

  return {
    scenarioId: scenario.id,
    scenarioType: type,
    kpiMovements,
    drivers,
    evidence,
    confidence,
    recommendation,
    personaNarratives,
    telemetry,
    supplierDetail: scenario.supplierDetail,
  };
}

// Get analysis for specific KPI
export function getKPIAnalysis(kpiId: string, scenarioType: ScenarioType = 'primary'): {
  movement: KPIMovement;
  drivers: Driver[];
  evidence: Evidence[];
} {
  const scenario = scenarioType === 'primary' ? primaryScenario :
                   scenarioType === 'low_confidence' ? lowConfidenceScenario :
                   sparseHistoryScenario;

  const movement = scenario.kpiMovements.find(m => m.kpiId === kpiId);
  if (!movement) {
    throw new Error(`KPI ${kpiId} not found in scenario`);
  }

  // Get related drivers and evidence
  const drivers = scenario.drivers;
  const evidence = scenario.evidence;

  return { movement, drivers, evidence };
}

// Get all available scenarios
export function getAvailableScenarios(): {
  id: string;
  type: ScenarioType;
  name: string;
  description: string;
}[] {
  return [
    { id: primaryScenario.id, type: 'primary', name: primaryScenario.name, description: primaryScenario.description },
    { id: lowConfidenceScenario.id, type: 'low_confidence', name: lowConfidenceScenario.name, description: lowConfidenceScenario.description },
    { id: sparseHistoryScenario.id, type: 'sparse_history', name: sparseHistoryScenario.name, description: sparseHistoryScenario.description },
  ];
}

// Quick access to primary scenario (for default dashboard)
export function getPrimaryScenarioAnalysis(): AnalysisResult {
  return runAnalysis('primary');
}
