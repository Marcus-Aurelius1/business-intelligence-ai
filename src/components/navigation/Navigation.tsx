'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItem } from '@/types';

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Investigation', href: '/investigation', icon: 'search' },
  { label: 'Recommendations', href: '/recommendations', icon: 'lightbulb' },
  { label: 'Scenarios', href: '/scenarios', icon: 'science' },
  { label: 'System', href: '/system', icon: 'settings' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40">
        <div className="flex items-center justify-between h-full px-6 pl-72">
          <h1 className="text-lg font-semibold text-slate-900">
            BusinessIntelligence.ai
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">InsightX</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900 z-50">
        <div className="pt-20 pb-6 px-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-violet-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
