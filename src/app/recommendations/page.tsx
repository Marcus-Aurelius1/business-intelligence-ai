import AppLayout from '@/components/layout/AppLayout';

export default function RecommendationsPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Recommendations</h1>
        <p className="text-slate-600 mt-1">Decision workspace with scenario testing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
          Recommendation details will appear here
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
          Scenario testing controls will appear here
        </div>
      </div>
    </AppLayout>
  );
}
