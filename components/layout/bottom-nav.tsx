'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { SIDEBAR_MODULES } from '@/lib/constants/roles';

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Filter modules based on user role
  const visibleModules = user ? SIDEBAR_MODULES.filter(module => 
    module.roles.includes(user.role)
  ) : [];

  // Usually mobile bottom nav has max 4-5 items. We take the top 4.
  const mainModules = visibleModules.slice(0, 4);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl px-2 py-3 pb-safe flex justify-around items-center transition-all duration-300">
      {mainModules.map((module) => {
        const active = isActive(`/${module.id}`);
        return (
          <Link
            key={module.id}
            href={`/${module.id}`}
            className={`flex flex-col items-center justify-center px-4 py-2 transition-transform active:scale-90 ${
              active 
                ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-900 dark:text-cyan-100 rounded-xl' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <module.icon strokeWidth={active ? 2.5 : 2} className={`w-6 h-6 transition-all ${active ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-semibold uppercase tracking-wider mt-1 whitespace-nowrap">
              {module.label.split(' ')[0]} {/* Shorten label for mobile */}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
