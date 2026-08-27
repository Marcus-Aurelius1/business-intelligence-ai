// Confidence Calculation Engine - Evidence-backed confidence assessment

import { ConfidenceAssessment, Evidence } from '@/types';

interface ConfidenceInput {
  driversWithEvidence: {
    driverId: string;
    evidence: Evidence[];
    contribution: number;
  }[];
  kpiId: string;
}

// Calculate overall confidence based on evidence alignment
export function calculateConfidence(input: ConfidenceInput): ConfidenceAssessment {
  const positiveFactors: string[] = [];
  const negativeFactors: string[] = [];
  let baseScore = 50;

  // Analyze each driver's evidence
  for (const driver of input.driversWithEvidence) {
    const supporting = driver.evidence.filter(e => e.status === 'supporting');
    const contradicting = driver.evidence.filter(e => e.status === 'contradicting');

    // Positive: Multiple supporting evidence
    if (supporting.length >= 2) {
      positiveFactors.push(`${supporting.length} independent signals align for ${driver.driverId}`);
      baseScore += 10;
    }

    // Positive: Evidence from multiple sources
    const sources = new Set(supporting.map(e => e.source));
    if (sources.size >= 2) {
      positiveFactors.push('Evidence from multiple heterogeneous sources');
      baseScore += 8;
    }

    // Negative: Contradicting evidence exists
    if (contradicting.length > 0) {
      negativeFactors.push(`Counter-signals detected for ${driver.driverId}`);
      baseScore -= 5;
    }
  }

  // Check evidence freshness
  const allEvidence = input.driversWithEvidence.flatMap(d => d.evidence);
  const avgFreshness = allEvidence.reduce((sum, e) => sum + e.freshness, 0) / allEvidence.length;
  if (avgFreshness < 30) {
    positiveFactors.push('Recent evidence (< 30 minutes old)');
    baseScore += 5;
  } else if (avgFreshness > 60) {
    negativeFactors.push('Some evidence is stale (> 60 minutes old)');
    baseScore -= 5;
  }

  // Check evidence type diversity
  const evidenceTypes = new Set(allEvidence.map(e => e.type));
  if (evidenceTypes.size >= 3) {
    positiveFactors.push('Evidence spans structured, unstructured, and operational data');
    baseScore += 8;
  }

  // Universal disclaimer for causal claims
  negativeFactors.push('Causal relationship not experimentally proven');

  // Clamp score
  const score = Math.min(Math.max(Math.round(baseScore), 0), 100);

  // Determine disclaimer based on score
  let disclaimer: string;
  if (score >= 70) {
    disclaimer = 'Likely driver — causal link not proven. Correlation does not imply causation.';
  } else if (score >= 40) {
    disclaimer = 'Plausible driver with moderate evidence. Additional verification recommended.';
  } else {
    disclaimer = 'Insufficient evidence to identify a reliable primary driver. Recommend abstention or clarification.';
  }

  return {
    score,
    positiveFactors,
    negativeFactors,
    disclaimer,
  };
}

// Pre-calculated confidence for primary scenario
export function getPrimaryScenarioConfidence(): ConfidenceAssessment {
  return {
    score: 78,
    positiveFactors: [
      '3 independent structured evidence sources align',
      'Customer feedback corroborates operational disruption',
      'Clear causal chain from fulfillment → delivery → sales',
    ],
    negativeFactors: [
      'Causal relationship not experimentally proven',
      'Multiple drivers may have interaction effects',
    ],
    disclaimer: 'Likely driver — causal link not proven. Correlation does not imply causation.',
  };
}

// Pre-calculated confidence for low-confidence scenario
export function getLowConfidenceScenarioConfidence(): ConfidenceAssessment {
  return {
    score: 34,
    positiveFactors: [
      'Sales decline is statistically significant',
    ],
    negativeFactors: [
      'Conflicting source signals (volume down, sentiment neutral)',
      'Freshness mismatch between data sources (45m vs 120m)',
      'Insufficient supporting evidence for either hypothesis',
      'Two plausible hypotheses with similar likelihood',
    ],
    disclaimer: 'Insufficient evidence to identify a reliable primary driver. Recommend abstention or clarification.',
  };
}

// Pre-calculated confidence for sparse history scenario
export function getSparseHistoryConfidence(): ConfidenceAssessment {
  return {
    score: 15,
    positiveFactors: [],
    negativeFactors: [
      'Only 19 days of history available (required: 60 days)',
      'Weak baseline for seasonality or trend analysis',
      'Cannot reliably detect anomalies or patterns',
    ],
    disclaimer: 'Insufficient historical observations for reliable anomaly detection. Recommend MONITOR status until 60 days of data accumulated.',
  };
}
