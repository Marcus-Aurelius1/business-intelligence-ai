import AppLayout from '@/components/layout/AppLayout';

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Executive Dashboard</h1>
        <p className="text-slate-600 mt-1">Detect and prioritize material KPI movements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* KPI cards will be populated in Phase 3 */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
          KPI cards will appear here
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
          KPI cards will appear here
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
          KPI cards will appear here
        </div>
      </div>
    </AppLayout>
  );
}
