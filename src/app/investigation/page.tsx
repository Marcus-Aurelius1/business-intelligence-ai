import AppLayout from '@/components/layout/AppLayout';

export default function InvestigationPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Investigation</h1>
        <p className="text-slate-600 mt-1">Explore drivers and evidence behind KPI movements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
            Driver decomposition and evidence will appear here
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
            Confidence assessment will appear here
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
