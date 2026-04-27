'use client';

import { useAuth } from '@/lib/context/auth-context';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, Search, User, Bell, UserCircle, Lock, LogOut, CheckCheck, Info } from 'lucide-react';
import { apiClient } from '@/lib/api/api-client';

interface HeaderProps {
  onMenuClick?: () => void;
}

interface Notif {
  id: number;
  pesan: string;
  isRead: boolean;
  createdAt: string;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Fetch notifikasi saat dropdown dibuka
  const loadNotifs = async () => {
    try {
      const data = await apiClient('/notifikasi');
      const list: Notif[] = Array.isArray(data) ? data : (data?.data || []);
      setNotifs(list.slice(0, 10)); // Tampilkan max 10
      setUnreadCount(list.filter((n: Notif) => !n.isRead).length);
    } catch {
      // Silent fail
    }
  };

  useEffect(() => {
    // Load unread count saat komponen mount
    loadNotifs();
  }, []);

  const handleBellClick = () => {
    setShowNotif(prev => !prev);
    setShowMenu(false);
    if (!showNotif) loadNotifs();
  };

  const markAsRead = async (id: number) => {
    try {
      await apiClient(`/notifikasi/${id}/read`, { method: 'PUT' });
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // Silent fail
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    return `${Math.floor(hours / 24)} hari lalu`;
  };

  return (
    <header className="sticky top-0 z-30 glass-header shadow-sm border-b border-outline-variant/20 px-4 md:px-6 py-3 flex items-center justify-between gap-4 transition-all">
      {/* Mobile Menu Button */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-surface-container rounded-full transition flex-shrink-0"
        >
          <Menu strokeWidth={2.5} className="w-5 h-5 text-on-surface" />
        </button>

        {/* Search Bar */}
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

        {/* Notifications Bell */}
        <div className="relative hidden sm:block" ref={notifRef}>
          <button
            onClick={handleBellClick}
            className="relative p-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 text-slate-500 rounded-full transition-colors"
          >
            <Bell strokeWidth={2.5} className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white border border-outline-variant/20 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="px-4 py-3 border-b border-outline-variant/10 flex items-center justify-between bg-slate-50/80">
                  <div>
                    <p className="text-sm font-black text-on-surface">Notifikasi</p>
                    <p className="text-[10px] text-slate-400 font-medium">{unreadCount} belum dibaca</p>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={async () => {
                        for (const n of notifs.filter(x => !x.isRead)) await markAsRead(n.id);
                      }}
                      className="text-[10px] font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 px-2 py-1 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <CheckCheck className="w-3 h-3" /> Tandai Semua
                    </button>
                  )}
                </div>

                {/* Notif List */}
                <div className="max-h-72 overflow-y-auto divide-y divide-outline-variant/10">
                  {notifs.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center gap-2">
                      <Bell strokeWidth={1.5} className="w-8 h-8 text-slate-300" />
                      <p className="text-xs text-slate-400 font-medium">Tidak ada notifikasi</p>
                    </div>
                  ) : (
                    notifs.map(n => (
                      <button
                        key={n.id}
                        onClick={() => !n.isRead && markAsRead(n.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex gap-3 items-start ${
                          !n.isRead ? 'bg-cyan-50/50' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          !n.isRead ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <Info strokeWidth={2.5} className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-relaxed ${!n.isRead ? 'font-semibold text-on-surface' : 'font-medium text-slate-500'}`}>
                            {n.pesan}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">{formatTimeAgo(n.createdAt)}</p>
                        </div>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0 mt-1.5" />
                        )}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Separator */}
        <div className="hidden sm:block h-6 w-[1px] bg-outline-variant/30 mx-1"></div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { setShowMenu(!showMenu); setShowNotif(false); }}
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
