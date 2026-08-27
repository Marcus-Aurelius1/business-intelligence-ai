import { Recommendation } from '@/types';
import { ScenarioType } from '@/data/scenarios';

// A human decision taken from the recommendation card.
export type DecisionAction = 'approved' | 'clarify' | 'monitor' | 'deferred' | 'tested';

// Map driver IDs to human-readable names from deterministic data
const driverNameMap: Record<string, string> = {
  d1: 'Electronics Volume Decline',
  d2: 'West Offline-Channel Weakness',
  d3: 'Fulfillment Disruption',
  d4: 'Marketing Offset',
  d5: 'Price Adjustment',
  ld1: 'Potential Demand Shift',
  ld2: 'Competitor Pricing Pressure',
};

function getDriverDisplayName(driverId: string): string {
  return driverNameMap[driverId] || driverId || 'No driver identified';
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  scenarioType?: ScenarioType;
  onDecision?: (action: DecisionAction) => void;
}

export default function RecommendationCard({ recommendation, scenarioType = 'primary', onDecision }: RecommendationCardProps) {
  const routingConfig: Record<string, {
    bg: string;
    text: string;
    border: string;
    icon: React.ReactNode;
    label: string;
    description: string;
  }> = {
    recommend: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'RECOMMEND',
      description: 'High confidence, low risk — proceed with action'
    },
    review: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      ),
      label: 'REVIEW',
      description: 'Requires human review before proceeding'
    },
    escalate: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
      label: 'ESCALATE',
      description: 'Material risk — escalate to leadership'
    }
  };

  const config = routingConfig[recommendation.routing];

  return (
    <div className="card overflow-hidden">
      {/* Routing Header */}
      <div className={`${config.bg} ${config.border} border-b px-5 py-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`${config.text}`}>{config.icon}</div>
            <div>
              <p className={`text-sm font-bold ${config.text}`}>{config.label}</p>
              <p className="text-xs text-slate-600">{config.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Confidence</span>
            <span className={`text-lg font-bold ${config.text}`}>{recommendation.confidence}%</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Driver */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Driver</p>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">{getDriverDisplayName(recommendation.driverId)}</p>
        </div>

        {/* Controllable Lever */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Controllable Lever</p>
          <p className="text-sm font-medium text-slate-800">{recommendation.controllableLever}</p>
        </div>

        {/* Recommended Action */}
        <div className="bg-violet-50/70 border border-violet-200/80 rounded-lg p-4">
          <p className="text-[10px] font-bold text-violet-700 uppercase tracking-wider mb-1.5">Recommended Action</p>
          <p className="text-sm text-slate-900 leading-relaxed font-semibold">{recommendation.action}</p>
        </div>

        {/* Expected Impact */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expected Impact</p>
          <p className="text-sm text-slate-800 font-semibold">{recommendation.expectedImpact}</p>
        </div>

        {/* Owner and Status */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Owner</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-violet-700">
                  {recommendation.owner.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-800">{recommendation.owner}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <p className="text-xs font-semibold text-slate-800">Pending Review</p>
            </div>
          </div>
        </div>

        {/* Monitoring Plan */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Monitoring Plan</p>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">{recommendation.monitoringPlan}</p>
        </div>

        {/* Clarification prompt */}
        {recommendation.routing !== 'recommend' && recommendation.clarificationQuestion && (
          <div className="bg-amber-50/80 rounded-lg p-3.5 border border-amber-200">
            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">Clarification Needed</p>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">{recommendation.clarificationQuestion}</p>
          </div>
        )}

        {/* Action Buttons — adapt to routing so no confident action is offered when the
            system is abstaining (review) or monitoring (sparse history). */}
        <div className="flex gap-3 pt-2">
          {recommendation.routing === 'recommend' ? (
            <>
              <button className="btn btn-primary flex-1" onClick={() => onDecision?.('approved')}>
                Approve Action
              </button>
              <button className="btn btn-secondary flex-1" onClick={() => onDecision?.('tested')}>
                Modify Plan
              </button>
            </>
          ) : scenarioType === 'sparse_history' ? (
            <>
              <button className="btn btn-primary flex-1" onClick={() => onDecision?.('monitor')}>
                Continue Monitoring
              </button>
              <button className="btn btn-secondary flex-1" onClick={() => onDecision?.('deferred')}>
                Defer Decision
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary flex-1" onClick={() => onDecision?.('clarify')}>
                Request Clarification
              </button>
              <button className="btn btn-secondary flex-1" onClick={() => onDecision?.('deferred')}>
                Defer Decision
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
