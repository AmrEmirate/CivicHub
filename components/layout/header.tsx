'use client';

import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, Search, User, Bell, UserCircle, Lock, LogOut } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, setUser, logout } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);


  const handleLogout = () => {
    logout();
    router.push('/login');
  };



  return (
    <header className="sticky top-0 z-30 glass-header shadow-sm border-b border-outline-variant/20 px-4 md:px-6 py-3 flex items-center justify-between gap-4 transition-all">
      {/* Mobile Menu Button - Left aligned on mobile, hidden on desktop */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-surface-container rounded-full transition flex-shrink-0"
        >
          <Menu strokeWidth={2.5} className="w-5 h-5 text-on-surface" />
        </button>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden sm:flex flex-1 max-w-md ml-2 md:ml-0">
          <div className="relative w-full">
            <Search strokeWidth={2.5} className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <input
              type="text"
              placeholder="Search community records..."
              className="w-full pl-12 pr-4 py-2 rounded-full bg-surface-container-low dark:bg-surface-container-high border-2 border-outline-variant text-sm font-inter focus:ring-2 focus:ring-primary text-on-surface placeholder-on-surface/50 transition"
            />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        


        {/* Notifications */}
        <button className="relative p-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 text-slate-500 rounded-full transition-colors hidden sm:block">
          <Bell strokeWidth={2.5} className="w-5 h-5" />
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
              <User strokeWidth={2.5} className="text-primary-container w-5 h-5" />
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
                  <p className="text-xs text-on-surface font-inter opacity-80">{user?.phone}</p>
                </div>

                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 hover:bg-surface-container text-sm text-on-surface/70 flex items-center gap-3 transition-colors">
                    <UserCircle strokeWidth={2.5} className="w-4 h-4" />
                    Profil Saya
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-surface-container text-sm text-on-surface/70 flex items-center gap-3 transition-colors">
                    <Lock strokeWidth={2.5} className="w-4 h-4" />
                    Ubah Password
                  </button>
                </div>

                <div className="border-t border-outline-variant/30 my-1"></div>

                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-error-container/50 text-sm text-error flex items-center gap-3 transition-colors font-medium"
                  >
                    <LogOut strokeWidth={2.5} className="w-4 h-4" />
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
