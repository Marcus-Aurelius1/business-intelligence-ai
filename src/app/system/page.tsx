import AppLayout from '@/components/layout/AppLayout';

export default function SystemPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">System</h1>
        <p className="text-slate-600 mt-1">Trust, telemetry, and processing transparency</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
          Telemetry metrics will appear here
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
          Processing boundary explanation will appear here
        </div>
      </div>
    </AppLayout>
  );
}
