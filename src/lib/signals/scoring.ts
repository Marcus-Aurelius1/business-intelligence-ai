// Signal Validation Engine - Deterministic signal scoring

import { KPIMovement } from '@/types';

interface SignalValidationResult {
  score: number;
  factors: {
    seasonality: boolean;
    volatility: number;
    expectedRange: { min: number; max: number };
    persistence: number;
    baselineQuality: 'strong' | 'moderate' | 'weak';
  };
  isMeaningful: boolean;
}

// Deterministic signal scoring based on movement characteristics
export function validateSignal(movement: KPIMovement): SignalValidationResult {
  const absChange = Math.abs(movement.percentageChange);

  // Base score from magnitude (higher magnitude = more likely meaningful)
  let score = Math.min(absChange * 8, 50);

  // Volatility factor (deterministic based on KPI type)
  const volatilityFactors: Record<string, number> = {
    revenue: 0.85,
    gross_margin: 0.80,
    units_sold: 0.75,
    average_selling_price: 0.70,
    fulfillment_sla: 0.90,
  };
  const volatility = volatilityFactors[movement.kpiId] || 0.75;
  score = score * volatility + 20;

  // Expected range (deterministic based on historical patterns)
  const expectedRanges: Record<string, { min: number; max: number }> = {
    revenue: { min: -3, max: 5 },
    gross_margin: { min: -2, max: 2 },
    units_sold: { min: -5, max: 8 },
    average_selling_price: { min: -2, max: 3 },
    fulfillment_sla: { min: -5, max: 2 },
  };
  const expectedRange = expectedRanges[movement.kpiId] || { min: -5, max: 5 };

  // Check if outside expected range
  const outsideRange = movement.percentageChange < expectedRange.min || movement.percentageChange > expectedRange.max;
  if (outsideRange) {
    score = Math.min(score + 20, 100);
  }

  // Seasonality check (deterministic simulation - August is typically stable)
  const seasonality = false; // No seasonal effect in current scenario

  // Persistence (deterministic - assume multi-day movement)
  const persistence = absChange > 5 ? 0.85 : 0.70;

  // Baseline quality (deterministic based on freshness)
  const baselineQuality = movement.freshness < 30 ? 'strong' : movement.freshness < 60 ? 'moderate' : 'weak';

  // Final score adjustment
  score = Math.min(Math.round(score * persistence), 100);

  // Threshold for meaningful signal
  const signalThreshold = 70;
  const isMeaningful = score >= signalThreshold;

  return {
    score,
    factors: {
      seasonality,
      volatility,
      expectedRange,
      persistence,
      baselineQuality,
    },
    isMeaningful,
  };
}

// Materiality assessment
export function assessMateriality(movement: KPIMovement): 'low' | 'medium' | 'high' {
  const absChange = Math.abs(movement.percentageChange);

  if (movement.kpiId === 'revenue' || movement.kpiId === 'gross_margin') {
    if (absChange >= 7) return 'high';
    if (absChange >= 4) return 'medium';
    return 'low';
  }

  if (movement.kpiId === 'fulfillment_sla') {
    if (absChange >= 10) return 'high';
    if (absChange >= 5) return 'medium';
    return 'low';
  }

  // Default thresholds
  if (absChange >= 8) return 'high';
  if (absChange >= 5) return 'medium';
  return 'low';
}

// Status determination based on signal and materiality
export function determineStatus(
  signalScore: number,
  materiality: 'low' | 'medium' | 'high'
): 'stable' | 'investigate' | 'action_required' {
  if (signalScore >= 85 && materiality === 'high') {
    return 'action_required';
  }

  if (signalScore >= 70 && (materiality === 'medium' || materiality === 'high')) {
    return 'investigate';
  }

  return 'stable';
}
