'use client';

import { useState } from 'react';
import { 
  Settings, ChevronRight, Users, Sliders, Cable, 
  UserCircle, PlusCircle, PencilLine, Trash2, 
  Mail, MessageSquare, Moon, MessageCircle, 
  CreditCard, Save 
} from 'lucide-react';

import { useAuth } from '@/lib/context/auth-context';

const settingsMenu = [
  { id: 'users', label: 'Manajemen Pengguna', icon: Users, description: 'Kelola akun dan role pengguna' },
  { id: 'preferences', label: 'Preferensi Sistem', icon: Sliders, description: 'Atur pengaturan umum sistem' },
  { id: 'integrations', label: 'Integrasi', icon: Cable, description: 'Hubungkan dengan layanan eksternal' },
  { id: 'profile', label: 'Profil Saya', icon: UserCircle, description: 'Kelola akun pribadi Anda' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState<any[]>([]); // Menunggu endpoint manajemen akses dari backend

  const deleteUser = (id: string) => {
    if (confirm('Hapus pengguna ini?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          <Settings strokeWidth={2.5} className="w-4 h-4" />
          <span>Konfigurasi</span>
          <ChevronRight strokeWidth={3} className="w-3 h-3" />
          <span className="text-secondary">Sistem</span>
        </div>
        <h1 className="font-headline text-3xl font-extrabold text-cyan-950 dark:text-cyan-50 tracking-tight">Pengaturan</h1>
        <p className="font-inter text-slate-500 text-sm mt-1 max-w-lg">Kelola preferensi, hak akses pengguna, profil pribadi, dan pengaturan tingkat lanjut sistem.</p>
      </div>

      {/* Tabs for Mobile */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {settingsMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors flex-shrink-0 ${
              activeSection === item.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-cyan-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Settings Menu - Sidebar (Desktop) */}
        <div className="hidden lg:flex lg:flex-col gap-2">
          {settingsMenu.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all group relative overflow-hidden ${
                activeSection === item.id
                  ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 shadow-sm border border-cyan-100 dark:border-cyan-800'
                  : 'bg-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <item.icon strokeWidth={2.5} className={`w-5 h-5 transition-transform ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className={`font-bold text-sm ${activeSection === item.id ? '' : 'font-medium'}`}>{item.label}</span>
              </div>
              {activeSection === item.id && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
              )}
            </button>
          ))}
        </div>

        {/* Settings Content Panels */}
        <div className="lg:col-span-3">
          
          {activeSection === 'users' && (
            <div className="glass-panel rounded-3xl custom-shadow border border-outline-variant/30 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline font-bold text-xl text-cyan-950 dark:text-cyan-50">Manajemen Pengguna</h2>
                  <p className="text-sm text-slate-500 mt-1">Kelola data login seluruh pengurus dan warga.</p>
                </div>
                <button className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 shadow-lg shadow-primary/20 shrink-0">
                  <PlusCircle strokeWidth={2.5} className="w-5 h-5" /> Tambah Pengguna
                </button>
              </div>

              <div className="overflow-x-auto p-2">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Kredensial</th>
                      <th className="px-6 py-4 text-center">Akses Role</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4">
                          <h4 className="font-bold text-slate-700 dark:text-slate-200">{user.name}</h4>
                          <p className="text-secondary text-xs mt-0.5 font-mono">{user.phone}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[80px] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            user.status === 'aktif' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                              : 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {user.status === 'aktif' ? 'Aktif' : 'Non-Aktif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 text-cyan-600 rounded-xl transition-colors" title="Edit">
                              <PencilLine strokeWidth={2.5} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 rounded-xl transition-colors"
                              title="Hapus"
                            >
                              <Trash2 strokeWidth={2.5} className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="glass-panel rounded-3xl custom-shadow border border-outline-variant/30 p-8 space-y-8 max-w-2xl">
              <div>
                 <h2 className="font-headline font-bold text-xl text-cyan-950 dark:text-cyan-50">Preferensi Sistem</h2>
                 <p className="text-sm text-slate-500 mt-1">Konfigurasi visual dan pengaturan notifikasi otomatis aplikasi.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                        <Mail strokeWidth={2.5} className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Notifikasi Email</h3>
                       <p className="text-xs text-slate-500">Terima rekap aktivitas via email terdaftar.</p>
                     </div>
                  </div>
                  {/* Simulate Toggle */}
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                     <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <MessageSquare strokeWidth={2.5} className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Notifikasi WhatsApp</h3>
                       <p className="text-xs text-slate-500">Broadcast massal ke warga via WhatsApp.</p>
                     </div>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                     <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Moon strokeWidth={2.5} className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Mode Gelap (Dark Mode)</h3>
                       <p className="text-xs text-slate-500">Gunakan tema gelap pada antarmuka aplikasi.</p>
                     </div>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer shadow-inner transition-colors">
                     <div className="absolute top-1 left-1 w-4 h-4 bg-slate-400 dark:bg-slate-500 rounded-full transition-transform"></div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                 <button className="w-full primary-gradient hover:opacity-90 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-cyan-900/20 active:scale-[0.98]">
                   Simpan Preferensi
                 </button>
              </div>
            </div>
          )}

          {activeSection === 'integrations' && (
            <div className="glass-panel rounded-3xl custom-shadow border border-outline-variant/30 p-8 max-w-2xl">
              <h2 className="font-headline font-bold text-xl text-cyan-950 dark:text-cyan-50 mb-1">Integrasi Modul Eksternal</h2>
              <p className="text-sm text-slate-500 mb-8">Hubungkan sistem CivicHub dengan API dari penyedia layanan eksternal untuk memperkaya fitur.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center text-center group hover:border-emerald-400 transition-colors bg-white dark:bg-slate-900">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-4 text-emerald-500 group-hover:scale-110 transition-transform">
                     <MessageCircle strokeWidth={2.5} className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">WhatsApp Gateway API</h3>
                  <p className="text-[10px] text-slate-500 mt-1 mb-4">Twilio / WABlas interkoneksi.</p>
                  <button className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl hover:bg-emerald-500 hover:text-white transition-colors">
                    Hubungkan
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col items-center text-center group hover:border-cyan-400 transition-colors bg-white dark:bg-slate-900">
                  <div className="w-16 h-16 rounded-full bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center mb-4 text-cyan-600 group-hover:scale-110 transition-transform">
                     <CreditCard strokeWidth={2.5} className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Xendit / Midtrans</h3>
                  <p className="text-[10px] text-slate-500 mt-1 mb-4">Payment gateway verifikasi instan.</p>
                  <button className="w-full py-2 border-2 border-cyan-500 text-cyan-600 font-bold text-xs rounded-xl hover:bg-cyan-500 hover:text-white transition-colors">
                    Tersambung
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div className="glass-panel rounded-3xl custom-shadow border border-outline-variant/30 p-8 max-w-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl -translate-y-12 translate-x-12 z-0"></div>
              
               <div className="relative z-10">
                 <h2 className="font-headline font-bold text-xl text-cyan-950 dark:text-cyan-50 mb-1">Profil Administrator</h2>
                 <p className="text-sm text-slate-500 mb-8">Ubah informasi dasar akun sekuritas Anda.</p>

                 <div className="space-y-5">
                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Nama Lengkap</label>
                     <input
                       type="text"
                       defaultValue={user?.name || ""}
                       className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
                     />
                   </div>

                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">No. WhatsApp Pribadi</label>
                     <input
                       type="tel"
                       defaultValue={user?.phone || ""}
                       className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
                     />
                   </div>

                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Alamat Email Aktif</label>
                     <input
                       type="email"
                       defaultValue={user?.email || ""}
                       className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
                     />
                   </div>

                   <button className="w-full primary-gradient hover:opacity-90 text-white font-bold py-3 mt-4 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-[0.98] flex items-center justify-center gap-2">
                     <Save strokeWidth={2.5} className="w-5 h-5" /> Simpan Perubahan Profil
                   </button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
