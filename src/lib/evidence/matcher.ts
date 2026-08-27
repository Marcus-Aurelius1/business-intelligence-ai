// Evidence Matcher - Match evidence to drivers

import { Evidence } from '@/types';
import { primaryScenario, lowConfidenceScenario, sparseHistoryScenario } from '@/data/scenarios/primary';

// Get evidence for a specific driver
export function getEvidenceForDriver(driverId: string, scenarioType: 'primary' | 'low_confidence' | 'sparse_history' = 'primary'): Evidence[] {
  const scenario = scenarioType === 'primary' ? primaryScenario :
                   scenarioType === 'low_confidence' ? lowConfidenceScenario :
                   sparseHistoryScenario;

  return scenario.evidence.filter(e => e.driverId === driverId);
}

// Get all evidence for a scenario
export function getAllEvidence(scenarioType: 'primary' | 'low_confidence' | 'sparse_history' = 'primary'): Evidence[] {
  const scenario = scenarioType === 'primary' ? primaryScenario :
                   scenarioType === 'low_confidence' ? lowConfidenceScenario :
                   sparseHistoryScenario;

  return scenario.evidence;
}

// Group evidence by status
export function groupEvidenceByStatus(evidence: Evidence[]): {
  supporting: Evidence[];
  contradicting: Evidence[];
  neutral: Evidence[];
} {
  return {
    supporting: evidence.filter(e => e.status === 'supporting'),
    contradicting: evidence.filter(e => e.status === 'contradicting'),
    neutral: evidence.filter(e => e.status === 'neutral'),
  };
}

// Get evidence metadata summary
export function getEvidenceSummary(evidence: Evidence[]): {
  totalCount: number;
  supportingCount: number;
  contradictingCount: number;
  avgFreshness: number;
  sourceBreakdown: Record<string, number>;
  typeBreakdown: Record<string, number>;
} {
  return {
    totalCount: evidence.length,
    supportingCount: evidence.filter(e => e.status === 'supporting').length,
    contradictingCount: evidence.filter(e => e.status === 'contradicting').length,
    avgFreshness: evidence.reduce((sum, e) => sum + e.freshness, 0) / evidence.length,
    sourceBreakdown: evidence.reduce((acc, e) => {
      acc[e.source] = (acc[e.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    typeBreakdown: evidence.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
}
