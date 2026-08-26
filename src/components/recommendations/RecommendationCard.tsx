import { Recommendation } from '@/types';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const routingColors = {
    recommend: 'bg-emerald-100 text-emerald-800',
    review: 'bg-amber-100 text-amber-800',
    escalate: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Routing Badge */}
      <div className={`px-4 py-2 text-sm font-medium uppercase tracking-wide ${routingColors[recommendation.routing]}`}>
        {recommendation.routing}
      </div>

      <div className="p-6">
        {/* Driver */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Driver</p>
          <p className="text-sm text-slate-900">{recommendation.driverId}</p>
        </div>

        {/* Controllable Lever */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Controllable Lever</p>
          <p className="text-sm text-slate-900">{recommendation.controllableLever}</p>
        </div>

        {/* Action */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Recommended Action</p>
          <p className="text-sm text-slate-900">{recommendation.action}</p>
        </div>

        {/* Expected Impact */}
        <div className="mb-4">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Expected Impact</p>
          <p className="text-sm text-slate-900">{recommendation.expectedImpact}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500 mb-1">Owner</p>
            <p className="text-sm font-medium text-slate-900">{recommendation.owner}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Confidence</p>
            <p className="text-sm font-medium text-slate-900">{recommendation.confidence}/100</p>
          </div>
        </div>

        {/* Monitoring Plan */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Monitoring Plan</p>
          <p className="text-sm text-slate-700">{recommendation.monitoringPlan}</p>
        </div>
      </div>
    </div>
  );
}
