'use client';

import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const switchRole = (role: 'rt' | 'sekretaris' | 'bendahara' | 'warga') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser?.(updatedUser);
      localStorage.setItem('civic_user', JSON.stringify(updatedUser));
      setShowRoleSwitcher(false);
      // Optional: reload or re-path to dashboard to see menu changes
      router.push('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-30 glass-header shadow-sm border-b border-outline-variant/20 px-4 md:px-6 py-3 flex items-center justify-between gap-4 transition-all">
      {/* Mobile Menu Button - Left aligned on mobile, hidden on desktop */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-surface-container rounded-full transition flex-shrink-0"
        >
          <span className="material-symbols-outlined text-on-surface">menu</span>
        </button>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden sm:flex flex-1 max-w-md ml-2 md:ml-0">
          <div className="relative w-full">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search community records..."
              className="w-full pl-12 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border-none text-sm font-inter focus:ring-2 focus:ring-cyan-500/20 text-on-surface placeholder-slate-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        
        {/* DEMO ROLE SWITCHER (Tugas UX Polish) */}
        <div className="relative">
          <button 
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
            Ganti Peran Demo
          </button>
          
          {showRoleSwitcher && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowRoleSwitcher(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Pilih Peran Simulasi</p>
                </div>
                {[
                  { id: 'rt', label: 'Ketua RT', icon: 'shield_person' },
                  { id: 'sekretaris', label: 'Sekretaris', icon: 'edit_document' },
                  { id: 'bendahara', label: 'Bendahara', icon: 'account_balance_wallet' },
                  { id: 'warga', label: 'Warga', icon: 'person' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => switchRole(r.id as any)}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                      user?.role === r.id 
                        ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-bold' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 text-slate-500 rounded-full transition-colors hidden sm:block">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
        </button>

        {/* Separator */}
        <div className="hidden sm:block h-6 w-[1px] bg-outline-variant/30 mx-1"></div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 pl-2 py-1 rounded-full transition-colors hover:opacity-80"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-cyan-950 dark:text-cyan-50 font-headline leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider capitalize">
                {user?.role === 'rt' ? 'Ketua RT' : 
                 user?.role === 'wakil_rt' ? 'Wakil RT' :
                 user?.role === 'sekretaris' ? 'Sekretaris' :
                 user?.role === 'bendahara' ? 'Bendahara' : 'Warga'}
              </p>
            </div>
            
            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-container text-lg md:text-xl">person</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              {/* Invisible Overlay for closing when clicking outside */}
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl py-2 z-50 overflow-hidden transform opacity-100 scale-100 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-outline-variant/30 bg-surface-container/30">
                  <p className="text-sm font-bold text-on-surface font-headline">{user?.name}</p>
                  <p className="text-xs text-on-surface/60 font-inter">{user?.phone}</p>
                </div>

                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 hover:bg-surface-container text-sm text-slate-600 dark:text-slate-300 flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">account_circle</span>
                    Profil Saya
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-surface-container text-sm text-slate-600 dark:text-slate-300 flex items-center gap-3 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">lock</span>
                    Ubah Password
                  </button>
                </div>

                <div className="border-t border-outline-variant/30 my-1"></div>

                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-error-container/50 text-sm text-error flex items-center gap-3 transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Keluar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
