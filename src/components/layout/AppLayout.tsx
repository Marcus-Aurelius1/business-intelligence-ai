import Navigation from '../navigation/Navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pl-64 pt-16">
        <div className="p-8 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
}
