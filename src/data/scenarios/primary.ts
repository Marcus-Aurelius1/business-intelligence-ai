// Scenario definitions for different confidence levels and edge cases

export interface ScenarioConfig {
  id: string;
  type: 'primary' | 'low_confidence' | 'sparse_history';
  name: string;
  description: string;
  kpiMovements: {
    kpiId: string;
    currentValue: number;
    baselineValue: number;
    percentageChange: number;
    absoluteChange: number;
    signalScore: number;
    materiality: 'low' | 'medium' | 'high';
    status: 'stable' | 'investigate' | 'action_required';
    freshness: number;
  }[];
  drivers: {
    id: string;
    name: string;
    contribution: number;
    confidence: number;
    method: string;
    evidenceCount: number;
    freshness: number;
    rank: number;
  }[];
  evidence: {
    id: string;
    driverId: string;
    type: 'structured' | 'unstructured' | 'operational';
    description: string;
    source: string;
    freshness: number;
    method: string;
    lineage: string;
    status: 'supporting' | 'contradicting' | 'neutral';
  }[];
  confidence: {
    score: number;
    positiveFactors: string[];
    negativeFactors: string[];
    disclaimer: string;
  };
  recommendation: {
    driverId: string;
    controllableLever: string;
    action: string;
    expectedImpact: string;
    owner: string;
    confidence: number;
    monitoringPlan: string;
    routing: 'recommend' | 'review' | 'escalate';
    clarificationQuestion?: string;
  };
  personaNarratives: {
    persona: 'business_head' | 'finance_controller' | 'business_analyst';
    summary: string;
    focus: string[];
  }[];
  // Supplier-sensitive detail (optional). Present where a margin/supplier story exists.
  // Rendered with role-based masking — restricted roles see ████████ (PRD Section 16).
  supplierDetail?: {
    supplierName: string;
    supplierMarginPct: string;
    supplierUnitCost: string;
    note: string;
  };
}

// Primary Scenario: West Revenue Investigation
export const primaryScenario: ScenarioConfig = {
  id: 'primary_west_revenue',
  type: 'primary',
  name: 'West Revenue Investigation',
  description: 'Standard evidence-backed analysis with multiple supporting signals',

  kpiMovements: [
    {
      kpiId: 'revenue',
      currentValue: 38700000, // ₹38.7M
      baselineValue: 42100000, // ₹42.1M
      percentageChange: -8.07,
      absoluteChange: -3400000,
      signalScore: 92,
      materiality: 'high',
      status: 'investigate',
      freshness: 12,
    },
    {
      kpiId: 'gross_margin',
      currentValue: 28.9, // Gross margin percentage
      baselineValue: 29.7, // Gross margin percentage
      percentageChange: -2.69,
      absoluteChange: -0.8,
      signalScore: 88,
      materiality: 'high',
      status: 'investigate',
      freshness: 12,
    },
    {
      kpiId: 'units_sold',
      currentValue: 3530,
      baselineValue: 3890,
      percentageChange: -9.25,
      absoluteChange: -360,
      signalScore: 85,
      materiality: 'medium',
      status: 'investigate',
      freshness: 12,
    },
    {
      kpiId: 'average_selling_price',
      currentValue: 10963,
      baselineValue: 10823,
      percentageChange: 1.29,
      absoluteChange: 140,
      signalScore: 45,
      materiality: 'low',
      status: 'stable',
      freshness: 12,
    },
    {
      kpiId: 'fulfillment_sla',
      currentValue: 76,
      baselineValue: 94,
      percentageChange: -19.15,
      absoluteChange: -18,
      signalScore: 95,
      materiality: 'high',
      status: 'action_required',
      freshness: 28,
    },
  ],

  drivers: [
    {
      id: 'd1',
      name: 'Electronics Volume Decline',
      contribution: -5.6,
      confidence: 82,
      method: 'SQL aggregation + contribution analysis',
      evidenceCount: 5,
      freshness: 12,
      rank: 1,
    },
    {
      id: 'd2',
      name: 'West Offline-Channel Weakness',
      contribution: -3.2,
      confidence: 78,
      method: 'Channel segmentation analysis',
      evidenceCount: 3,
      freshness: 12,
      rank: 2,
    },
    {
      id: 'd3',
      name: 'Fulfillment Disruption',
      contribution: -2.8,
      confidence: 85,
      method: 'Correlation with operations data',
      evidenceCount: 4,
      freshness: 28,
      rank: 3,
    },
    {
      id: 'd4',
      name: 'Marketing Offset',
      contribution: 0.9,
      confidence: 75,
      method: 'Promotional impact analysis',
      evidenceCount: 2,
      freshness: 12,
      rank: 4,
    },
    {
      id: 'd5',
      name: 'Price Adjustment',
      contribution: 1.8,
      confidence: 88,
      method: 'Pricing variance analysis',
      evidenceCount: 2,
      freshness: 12,
      rank: 5,
    },
  ],

  evidence: [
    // Supporting evidence for Electronics Volume Decline
    {
      id: 'e1',
      driverId: 'd1',
      type: 'structured',
      description: 'Electronics sales down 24% (₹5.86M → ₹4.46M); decline is offline-led',
      source: 'ERP / Finance',
      freshness: 12,
      method: 'SQL aggregation + contribution analysis',
      lineage: 'sales_transactions → product=Electronics → SUM(revenue)',
      status: 'supporting',
    },
    {
      id: 'e2',
      driverId: 'd1',
      type: 'unstructured',
      description: '37 delivery complaints from West region customers',
      source: 'Customer Voice',
      freshness: 41,
      method: 'Retrieval + sentiment classification',
      lineage: 'customer_feedback → region=West → issue_type=delivery → COUNT',
      status: 'supporting',
    },

    // Supporting evidence for Fulfillment Disruption
    {
      id: 'e3',
      driverId: 'd3',
      type: 'operational',
      description: 'West fulfillment capacity reduced to 62% (from 95% baseline)',
      source: 'Product / Operations',
      freshness: 28,
      method: 'Business-rule comparison',
      lineage: 'operations_events → region=West → fulfillment_capacity',
      status: 'supporting',
    },
    {
      id: 'e4',
      driverId: 'd3',
      type: 'operational',
      description: 'Delivery SLA dropped to 76% on-time (target: 95%)',
      source: 'Product / Operations',
      freshness: 28,
      method: 'KPI threshold comparison',
      lineage: 'operations_events → region=West → delivery_sla',
      status: 'supporting',
    },
    {
      id: 'e5',
      driverId: 'd3',
      type: 'unstructured',
      description: 'Warehouse capacity reduced due to facility maintenance and staffing constraints',
      source: 'Customer Voice',
      freshness: 41,
      method: 'Text retrieval from incident reports',
      lineage: 'operations_events → incident_type=capacity_reduction',
      status: 'supporting',
    },

    // Supporting evidence for West Offline-Channel Weakness
    {
      id: 'e6',
      driverId: 'd2',
      type: 'structured',
      description: 'Offline channel revenue: ₹3.57M vs baseline ₹4.68M (-24%)',
      source: 'ERP / Finance',
      freshness: 12,
      method: 'Channel segmentation analysis',
      lineage: 'sales_transactions → region=West, channel=Offline → SUM(revenue)',
      status: 'supporting',
    },

    // Counter-signal: Marketing Offset
    {
      id: 'e7',
      driverId: 'd4',
      type: 'structured',
      description: 'Marketing spend increased 5% with promotional pricing driving +₹400K revenue',
      source: 'ERP / Finance',
      freshness: 12,
      method: 'Promotional impact analysis',
      lineage: 'sales_transactions → promotional_flag=true → SUM(revenue)',
      status: 'contradicting',
    },
    {
      id: 'e8',
      driverId: 'd4',
      type: 'unstructured',
      description: 'Customer feedback mentions positive promotional discounts',
      source: 'Customer Voice',
      freshness: 41,
      method: 'Sentiment analysis on price-related feedback',
      lineage: 'customer_feedback → issue_type=price, sentiment=positive',
      status: 'contradicting',
    },

    // Supporting evidence for Price Adjustment
    {
      id: 'e9',
      driverId: 'd5',
      type: 'structured',
      description: 'Average selling price increased 1.3% (₹10,823 → ₹10,963)',
      source: 'ERP / Finance',
      freshness: 12,
      method: 'Weighted average price calculation',
      lineage: 'sales_transactions → SUM(revenue)/SUM(units)',
      status: 'supporting',
    },
  ],

  confidence: {
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
  },

  recommendation: {
    driverId: 'd3',
    controllableLever: 'Inventory allocation + fulfillment capacity',
    action: 'Prioritize affected SKUs and reallocate inventory toward high-value West stores while investigating fulfillment SLA.',
    expectedImpact: '+₹2.1M to +₹2.7M recovered revenue over 7-14 days',
    owner: 'Regional Operations Lead',
    confidence: 78,
    monitoringPlan: 'Track West electronics volume and fulfillment SLA daily for 7 days. Report recovery progress.',
    routing: 'recommend',
  },

  personaNarratives: [
    {
      persona: 'business_head',
      summary: 'West revenue is down 8%. Electronics and fulfillment disruption account for most of the decline. Prioritize affected SKUs and investigate fulfillment SLA.',
      focus: ['Business impact', 'Operational cause', 'Next action', 'Decision urgency'],
    },
    {
      persona: 'finance_controller',
      summary: 'Revenue variance is -₹3.4M. Volume is the largest contributor at -5.6pp, partially offset by +1.8pp price. Confidence is 78/100; causal link remains unproven.',
      focus: ['Variance', 'Financial contribution', 'Margin impact', 'Confidence', 'Evidence'],
    },
    {
      persona: 'business_analyst',
      summary: 'Primary driver: Electronics volume decline (-24%) linked to West fulfillment issues. 37 customer complaints confirm delivery problems. Marketing offset of +0.9pp partially mitigates decline.',
      focus: ['Driver analysis', 'Evidence chain', 'Quantitative breakdown', 'Counter-signals'],
    },
  ],

  // Supplier-sensitive margin detail behind the gross-margin movement. Visible to Business
  // Head / Finance Controller; masked for the Restricted role.
  supplierDetail: {
    supplierName: 'Meridian Components (West)',
    supplierMarginPct: '18.4%',
    supplierUnitCost: '₹6,940 / unit',
    note: 'Supplier-level pricing and margin are commercially sensitive and access-controlled.',
  },
};

// Low Confidence Scenario: Conflicting Evidence
export const lowConfidenceScenario: ScenarioConfig = {
  id: 'low_conf_conflicting',
  type: 'low_confidence',
  name: 'Conflicting Evidence',
  description: 'Competing hypotheses with insufficient supporting data',

  kpiMovements: [
    {
      kpiId: 'revenue',
      currentValue: 39500000,
      baselineValue: 42100000,
      percentageChange: -6.18,
      absoluteChange: -2600000,
      signalScore: 72,
      materiality: 'high',
      status: 'investigate',
      freshness: 45,
    },
  ],

  drivers: [
    {
      id: 'ld1',
      name: 'Potential Demand Shift',
      contribution: -4.2,
      confidence: 35,
      method: 'Statistical analysis',
      evidenceCount: 2,
      freshness: 45,
      rank: 1,
    },
    {
      id: 'ld2',
      name: 'Competitor Pricing Pressure',
      contribution: -3.8,
      confidence: 28,
      method: 'Market analysis',
      evidenceCount: 1,
      freshness: 120,
      rank: 2,
    },
  ],

  evidence: [
    {
      id: 'le1',
      driverId: 'ld1',
      type: 'structured',
      description: 'Sales volume declined 6% but customer sentiment remains neutral',
      source: 'ERP / Finance',
      freshness: 45,
      method: 'Statistical variance analysis',
      lineage: 'sales_transactions → variance_analysis',
      status: 'supporting',
    },
    {
      id: 'le2',
      driverId: 'ld2',
      type: 'unstructured',
      description: 'Competitor launched promotional campaign 2 weeks ago',
      source: 'External Market Data',
      freshness: 120,
      method: 'Market intelligence retrieval',
      lineage: 'external_market → competitor_activity',
      status: 'contradicting',
    },
    {
      id: 'le3',
      driverId: 'ld1',
      type: 'operational',
      description: 'No operational disruptions detected in supply chain',
      source: 'Product / Operations',
      freshness: 30,
      method: 'Operational health check',
      lineage: 'operations_events → incident_check',
      status: 'contradicting',
    },
  ],

  confidence: {
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
    disclaimer: 'Insufficient evidence to identify a reliable primary driver. Recommend clarification or additional data collection.',
  },

  recommendation: {
    driverId: 'ld1',
    controllableLever: 'Customer research and competitive analysis',
    action: 'ABSTAIN from high-impact action. Request clarification on promotional activity context.',
    expectedImpact: 'Requires additional investigation before action',
    owner: 'Business Analyst',
    confidence: 34,
    monitoringPlan: 'Monitor for additional signals. Request competitive intelligence update.',
    routing: 'review',
    clarificationQuestion: 'Was the recent competitor promotional campaign a one-off or sustained? Confirm before attributing the decline.',
  },

  personaNarratives: [
    {
      persona: 'business_head',
      summary: 'Revenue declined 6% but the cause is unclear. Multiple factors may be at play. Recommend gathering more information before taking action.',
      focus: ['Uncertainty', 'Need for clarity', 'Risk of premature action'],
    },
    {
      persona: 'finance_controller',
      summary: 'Revenue variance is -₹2.6M with low confidence (34%). Insufficient evidence to attribute decline. Recommend abstaining from definitive statement.',
      focus: ['Low confidence', 'Evidence gaps', 'Abstention rationale'],
    },
    {
      persona: 'business_analyst',
      summary: 'Two competing hypotheses: demand shift vs competitor pricing. Evidence is conflicting and freshness varies. Cannot reliably rank drivers at this time.',
      focus: ['Competing hypotheses', 'Evidence conflicts', 'Data gaps'],
    },
  ],
};

// Sparse History Scenario: New KPI
export const sparseHistoryScenario: ScenarioConfig = {
  id: 'sparse_history_new_kpi',
  type: 'sparse_history',
  name: 'New KPI / Sparse History',
  description: 'Insufficient historical baseline for reliable analysis',

  kpiMovements: [
    {
      kpiId: 'revenue', // Using revenue as proxy for new product revenue
      currentValue: 8500000,
      baselineValue: 8200000,
      percentageChange: 3.66,
      absoluteChange: 300000,
      signalScore: 25,
      materiality: 'low',
      status: 'stable',
      freshness: 15,
    },
  ],

  drivers: [],

  evidence: [
    {
      id: 'se1',
      driverId: '',
      type: 'structured',
      description: 'New product line launched 19 days ago; insufficient historical data for anomaly detection',
      source: 'ERP / Finance',
      freshness: 15,
      method: 'Data availability check',
      lineage: 'sales_transactions → product_launch_date',
      status: 'neutral',
    },
  ],

  confidence: {
    score: 15,
    positiveFactors: [],
    negativeFactors: [
      'Only 19 days of history available (required: 60 days)',
      'Weak baseline for seasonality or trend analysis',
      'Cannot reliably detect anomalies or patterns',
    ],
    disclaimer: 'Insufficient historical observations for reliable anomaly detection. Recommend MONITOR status until 60 days of data accumulated.',
  },

  recommendation: {
    driverId: '',
    controllableLever: 'Monitoring and data collection',
    action: 'MONITOR - No action recommended. Continue tracking for 41 more days to establish reliable baseline.',
    expectedImpact: 'Baseline will be established by approximately October 7, 2026',
    owner: 'Business Analyst',
    confidence: 15,
    monitoringPlan: 'Daily monitoring. No alerts until baseline established. Report weekly on data accumulation progress.',
    routing: 'review',
  },

  personaNarratives: [
    {
      persona: 'business_head',
      summary: 'New product launched 19 days ago. Too early to assess performance trends. Recommend monitoring for 6 more weeks before drawing conclusions.',
      focus: ['New product', 'Insufficient data', 'Patience required'],
    },
    {
      persona: 'finance_controller',
      summary: 'Revenue tracking shows ₹8.5M in first 19 days. Cannot assess variance or trend reliability with current data depth. Confidence: 15%.',
      focus: ['Limited history', 'No trend analysis possible', 'Wait for baseline'],
    },
    {
      persona: 'business_analyst',
      summary: 'New KPI has 19 days of history vs 60 days required for statistical reliability. Current signal score of 25 is not meaningful. Status: MONITOR.',
      focus: ['History requirement', 'Statistical limitations', 'Timeline for reliability'],
    },
  ],
};
