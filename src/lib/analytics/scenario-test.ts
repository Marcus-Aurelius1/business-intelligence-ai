// Deterministic scenario-test math for the Recommendations "what-if" panel.
// No ML / no live calls — each assumption is an explicit, documented multiplier
// applied to the baseline revenue so projections are fully reproducible.

export interface ScenarioAssumption {
  id: string;
  label: string;
  // Multiplier applied to baseline revenue when this assumption is active.
  revenueMultiplier: number;
  rationale: string;
}

export const scenarioAssumptions: ScenarioAssumption[] = [
  {
    id: 'price_down_5',
    label: 'Price -5%',
    // 5% price cut with an assumed volume elasticity of ~1.8 (+9% units) → net +3.55% revenue.
    // Matches the deck example: ₹38.7M → ~₹40.1M (+₹1.4M).
    revenueMultiplier: 0.95 * 1.09,
    rationale: 'Price -5% with assumed volume elasticity 1.8 (+9% units)',
  },
  {
    id: 'volume_up_10',
    label: 'Volume +10%',
    revenueMultiplier: 1.1,
    rationale: 'Units +10% at constant price',
  },
];

export interface ScenarioProjection {
  baseline: number;
  projected: number;
  delta: number;
  multiplier: number;
}

export function computeScenarioProjection(
  baselineRevenue: number,
  activeAssumptionIds: string[]
): ScenarioProjection {
  const multiplier = activeAssumptionIds.reduce((acc, id) => {
    const assumption = scenarioAssumptions.find((a) => a.id === id);
    return assumption ? acc * assumption.revenueMultiplier : acc;
  }, 1);

  const projected = baselineRevenue * multiplier;

  return {
    baseline: baselineRevenue,
    projected,
    delta: projected - baselineRevenue,
    multiplier,
  };
}
