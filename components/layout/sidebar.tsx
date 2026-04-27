'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';
import { SIDEBAR_MODULES } from '@/lib/constants/roles';
import { HelpCircle, LogOut } from 'lucide-react';

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
    <aside className="w-full md:w-64 h-full bg-surface-container-high dark:bg-surface-dim flex flex-col overflow-y-auto border-r border-outline-variant transition-all">
      {/* Logo Section */}
      <div className="px-6 py-8">
        <Link href="/dashboard" className="block" onClick={() => onClose?.()}>
          <div className="text-2xl font-black text-primary dark:text-primary-fixed-dim font-headline">Civic Hub</div>
          <div className="text-[10px] font-inter font-black text-primary/60 uppercase tracking-widest mt-1">Community Portal</div>
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
              className={`flex items-center px-6 py-3.5 transition-all duration-200 ${
                active
                  ? 'bg-slate-50 text-slate-900 shadow-sm font-bold border-r-4 border-slate-900 transform scale-105 z-10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <module.icon strokeWidth={2.5} className="w-5 h-5 mr-3" />
              <span className="text-sm">{module.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-6 space-y-4">
        {user?.role === 'rt' || user?.role === 'bendahara' ? (
          <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold text-sm shadow-sm hover:bg-slate-800 hover:scale-105 transition-transform">
            Export Report
          </button>
        ) : null}
        
        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800">
          <Link href="/settings" onClick={() => onClose?.()} className="flex items-center text-slate-500 font-medium text-sm py-2 hover:text-cyan-800 dark:hover:text-cyan-300 transition-colors">
             <HelpCircle strokeWidth={2.5} className="w-5 h-5 mr-3" /> Help Center
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center text-slate-500 font-medium text-sm py-2 hover:text-error text-left transition-colors">
             <LogOut strokeWidth={2.5} className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
