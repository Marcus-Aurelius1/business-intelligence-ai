import AppLayout from '@/components/layout/AppLayout';

export default function ScenariosPage() {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Scenarios</h1>
        <p className="text-slate-600 mt-1">Persona-based narratives and edge cases</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400">
        Persona selector and scenario variations will appear here
      </div>
    </AppLayout>
  );
}
