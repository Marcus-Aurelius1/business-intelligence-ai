// Core KPI Types
export interface KPI {
  id: string;
  name: string;
  definition: string;
  calculation: string;
  dimensions: string[];
  drivers: string[];
  materialityThreshold: number;
  signalThreshold: number;
  lineage: string;
  access: string[];
}

export interface KPIMovement {
  kpiId: string;
  currentValue: number;
  baselineValue: number;
  percentageChange: number;
  absoluteChange: number;
  signalScore: number;
  materiality: 'low' | 'medium' | 'high';
  status: 'stable' | 'investigate' | 'action_required';
  freshness: number; // minutes
}

// Driver Types
export interface Driver {
  id: string;
  name: string;
  contribution: number; // percentage points
  confidence: number;
  method: string;
  evidenceCount: number;
  freshness: number;
  rank: number;
}

// Evidence Types
export interface Evidence {
  id: string;
  driverId: string;
  type: 'structured' | 'unstructured' | 'operational';
  description: string;
  source: string;
  freshness: number;
  method: string;
  lineage: string;
  status: 'supporting' | 'contradicting' | 'neutral';
}

// Confidence Types
export interface ConfidenceAssessment {
  score: number;
  positiveFactors: string[];
  negativeFactors: string[];
  disclaimer: string;
}

// Recommendation Types
export interface Recommendation {
  driverId: string;
  controllableLever: string;
  action: string;
  expectedImpact: string;
  owner: string;
  confidence: number;
  monitoringPlan: string;
  routing: 'recommend' | 'review' | 'escalate';
  // Present when the system abstains and needs a human to clarify before acting.
  clarificationQuestion?: string;
}

// Persona Types
export type Persona = 'business_head' | 'finance_controller' | 'business_analyst';

export interface PersonaNarrative {
  persona: Persona;
  summary: string;
  focus: string[];
}

// Scenario Types
export type ScenarioType = 'primary' | 'low_confidence' | 'sparse_history';

export interface Scenario {
  id: string;
  type: ScenarioType;
  name: string;
  description: string;
}

// Telemetry Types
export interface Telemetry {
  sourceCount: number;
  freshestSource: number;
  analysisLatency: number;
  modelCallCount: number;
  tokenUsage: {
    input: number;
    output: number;
  };
  estimatedCost: string;
  processingMethods: {
    deterministic: number;
    statistical: number;
    retrieval: number;
    llm: number;
  };
}

// Role Types
export type Role = 'business_head' | 'finance_controller' | 'restricted';

export interface RolePermissions {
  role: Role;
  allowedKPIs: string[];
  allowedEvidence: string[];
  maskedFields: string[];
}

// Data Source Types
export interface DataSource {
  id: string;
  name: string;
  type: 'erp' | 'crm' | 'operations';
  grain: string;
  refreshMinutes: number;
  lastUpdated: Date;
}

// KPI Card Props
export interface KPICardProps {
  movement: KPIMovement;
  kpi: KPI;
  onInvestigate?: () => void;
}

// Evidence Explorer Props
export interface EvidenceExplorerProps {
  driverId: string;
  evidence: Evidence[];
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}
