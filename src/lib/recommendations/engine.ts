// Recommendation Engine - Route to Recommend/Review/Escalate based on confidence and risk

import { Recommendation, ConfidenceAssessment } from '@/types';

interface RecommendationInput {
  primaryDriverId: string;
  confidence: ConfidenceAssessment;
  materiality: 'low' | 'medium' | 'high';
  expectedImpact: string;
  action: string;
  owner: string;
}

// Determine routing based on confidence and materiality
export function determineRouting(
  confidence: number,
  materiality: 'low' | 'medium' | 'high'
): 'recommend' | 'review' | 'escalate' {
  // High confidence + low/medium risk = RECOMMEND
  if (confidence >= 70 && materiality !== 'high') {
    return 'recommend';
  }

  // Medium confidence OR high materiality = REVIEW
  if (confidence >= 40 || materiality === 'high') {
    return 'review';
  }

  // Low confidence = REVIEW (not escalate, since we don't have enough confidence)
  if (confidence < 40) {
    return 'review';
  }

  // Material risk = ESCALATE
  return 'escalate';
}

// Generate recommendation from input
export function generateRecommendation(input: RecommendationInput): Recommendation {
  const routing = determineRouting(input.confidence.score, input.materiality);

  return {
    driverId: input.primaryDriverId,
    controllableLever: input.primaryDriverId === 'd3' ? 'Inventory allocation + fulfillment capacity' : 'TBD',
    action: input.action,
    expectedImpact: input.expectedImpact,
    owner: input.owner,
    confidence: input.confidence.score,
    monitoringPlan: generateMonitoringPlan(input.primaryDriverId),
    routing,
  };
}

// Generate monitoring plan based on driver
function generateMonitoringPlan(driverId: string): string {
  const plans: Record<string, string> = {
    d1: 'Track Electronics volume daily for 7 days. Alert if decline continues.',
    d2: 'Monitor offline channel metrics and customer footfall weekly.',
    d3: 'Track West electronics volume and fulfillment SLA daily for 7 days. Report recovery progress.',
    d4: 'Monitor marketing spend effectiveness and promotional ROI weekly.',
    d5: 'Track ASP trends and competitive pricing bi-weekly.',
  };

  return plans[driverId] || 'Monitor KPI daily for 7 days. Alert on significant deviation.';
}

// Pre-built recommendations for scenarios
export function getPrimaryScenarioRecommendation(): Recommendation {
  return {
    driverId: 'd3',
    controllableLever: 'Inventory allocation + fulfillment capacity',
    action: 'Prioritize affected SKUs and reallocate inventory toward high-value West stores while investigating fulfillment SLA.',
    expectedImpact: '+₹2.1M to +₹2.7M recovered revenue over 7-14 days',
    owner: 'Regional Operations Lead',
    confidence: 78,
    monitoringPlan: 'Track West electronics volume and fulfillment SLA daily for 7 days. Report recovery progress.',
    routing: 'recommend',
  };
}

export function getLowConfidenceRecommendation(): Recommendation {
  return {
    driverId: 'ld1',
    controllableLever: 'Customer research and competitive analysis',
    action: 'ABSTAIN from high-impact action. Request clarification on promotional activity context.',
    expectedImpact: 'Requires additional investigation before action',
    owner: 'Business Analyst',
    confidence: 34,
    monitoringPlan: 'Monitor for additional signals. Request competitive intelligence update.',
    routing: 'review',
  };
}

export function getSparseHistoryRecommendation(): Recommendation {
  return {
    driverId: '',
    controllableLever: 'Monitoring and data collection',
    action: 'MONITOR - No action recommended. Continue tracking for 41 more days to establish reliable baseline.',
    expectedImpact: 'Baseline will be established by approximately October 7, 2026',
    owner: 'Business Analyst',
    confidence: 15,
    monitoringPlan: 'Daily monitoring. No alerts until baseline established. Report weekly on data accumulation progress.',
    routing: 'review',
  };
}
