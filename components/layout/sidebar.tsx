'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { SIDEBAR_MODULES } from '@/lib/constants/roles';

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Filter modules based on user role
  const visibleModules = user ? SIDEBAR_MODULES.filter(module => 
    module.roles.includes(user.role)
  ) : [];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-full md:w-64 h-full bg-slate-50 dark:bg-slate-900 flex flex-col overflow-y-auto border-r border-outline-variant/20 transition-all">
      {/* Logo Section */}
      <div className="px-6 py-8">
        <Link href="/dashboard" className="block" onClick={() => onClose?.()}>
          <div className="text-2xl font-black text-cyan-900 dark:text-cyan-100 font-headline">Civic Hub</div>
          <div className="text-xs font-inter font-medium text-slate-500 uppercase tracking-widest mt-1">Community Portal</div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {visibleModules.map((module) => {
          const active = isActive(`/${module.id}`);
          return (
            <Link
              key={module.id}
              href={`/${module.id}`}
              onClick={() => onClose?.()}
              className={`flex items-center px-6 py-3 transition-colors duration-200 ${
                active
                  ? 'text-cyan-900 dark:text-cyan-100 font-bold border-r-4 border-cyan-800 dark:border-cyan-400 bg-cyan-50/50 dark:bg-cyan-950/20 scale-102 transform'
                  : 'text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-cyan-800 dark:hover:text-cyan-200'
              }`}
            >
              <span className="material-symbols-outlined mr-3">{module.icon}</span>
              <span className="text-sm">{module.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-6 space-y-4">
        {user?.role === 'rt' || user?.role === 'bendahara' ? (
          <button className="w-full bg-primary text-on-primary py-3 rounded-xl font-semibold text-sm primary-gradient shadow-sm hover:scale-105 transition-transform">
            Export Report
          </button>
        ) : null}
        
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800">
          <Link href="/settings" onClick={() => onClose?.()} className="flex items-center text-slate-500 font-medium text-sm py-2 hover:text-cyan-800 dark:hover:text-cyan-300">
             <span className="material-symbols-outlined mr-3 text-lg">help</span> Help Center
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center text-slate-500 font-medium text-sm py-2 hover:text-error text-left">
             <span className="material-symbols-outlined mr-3 text-lg">logout</span> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
