'use client';

import { useState, useEffect } from 'react';
import { 
  Settings, ChevronRight, Users, Sliders, Cable, 
  UserCircle, PlusCircle, PencilLine, Trash2, 
  Mail, MessageSquare, MessageCircle, 
  CreditCard, Save, RefreshCw
} from 'lucide-react';

import { useAuth } from '@/lib/context/auth-context';
import { apiClient } from '@/lib/api/api-client';

const settingsMenu = [
  { id: 'users', label: 'Manajemen Pengguna', icon: Users, description: 'Kelola akun dan role pengguna' },
  { id: 'preferences', label: 'Preferensi Sistem', icon: Sliders, description: 'Atur pengaturan umum sistem' },
  { id: 'integrations', label: 'Integrasi', icon: Cable, description: 'Hubungkan dengan layanan eksternal' },
  { id: 'profile', label: 'Profil Saya', icon: UserCircle, description: 'Kelola akun pribadi Anda' },
];

const roleLabels: Record<string, string> = {
  'SUPER_ADMIN': 'Super Admin (RT)',
  'ADMIN_ADMINISTRASI': 'Sekretaris',
  'ADMIN_KEUANGAN': 'Bendahara',
  'WARGA': 'Warga',
};

const roleBadgeColor: Record<string, string> = {
  'SUPER_ADMIN': 'bg-purple-50 text-purple-700 border-purple-200',
  'ADMIN_ADMINISTRASI': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'ADMIN_KEUANGAN': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'WARGA': 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '', noTelepon: '' });
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Fetch user list (hanya RT yang bisa akses)
  useEffect(() => {
    if (activeSection === 'users' && user?.role === 'rt') {
      const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
          const data = await apiClient('/users');
          setUsers(Array.isArray(data) ? data : []);
        } catch {
          setUsers([]);
        } finally {
          setIsLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeSection, user?.role]);

  // Pre-fill profil form dari context
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        noTelepon: (user as any).phone || (user as any).noTelepon || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setProfileMessage('');
    try {
      await apiClient('/users/me', {
        method: 'PUT',
        data: {
          name: profileForm.name,
          email: profileForm.email || undefined,
          noTelepon: profileForm.noTelepon || undefined,
        }
      });
      setProfileMessage('✓ Profil berhasil disimpan!');
    } catch (err: any) {
      setProfileMessage(`✗ Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSavingProfile(false);
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
          <span className="text-slate-600">Sistem</span>
        </div>
        <h1 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">Pengaturan</h1>
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
                ? 'bg-cyan-900 text-white shadow-sm shadow-cyan-900/10'
                : 'bg-white text-slate-500 hover:bg-cyan-50 hover:text-cyan-900'
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
                  ? 'bg-cyan-50 text-cyan-900 shadow-sm border border-cyan-100'
                  : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-cyan-800 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 relative z-10">
                <item.icon strokeWidth={2.5} className={`w-5 h-5 transition-transform ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className={`font-bold text-sm ${activeSection === item.id ? '' : 'font-medium'}`}>{item.label}</span>
              </div>
              {activeSection === item.id && (
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-600"></div>
              )}
            </button>
          ))}
        </div>

        {/* Settings Content Panels */}
        <div className="lg:col-span-3">
          
          {/* === MANAJEMEN PENGGUNA === */}
          {activeSection === 'users' && (
            <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline font-bold text-xl text-slate-900">Manajemen Pengguna</h2>
                  <p className="text-sm text-slate-500 mt-1">Kelola data login seluruh pengurus dan warga.</p>
                </div>
              </div>

              {user?.role !== 'rt' ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users strokeWidth={1.5} className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">Fitur ini hanya tersedia untuk Super Admin (Ketua RT).</p>
                </div>
              ) : isLoadingUsers ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
                </div>
              ) : (
                <div className="overflow-x-auto p-2">
                  <table className="w-full text-sm text-left">
                    <thead className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Nama / Kredensial</th>
                        <th className="px-6 py-4 text-center">Role</th>
                        <th className="px-6 py-4 text-center">No. Rumah</th>
                        <th className="px-6 py-4 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-sm text-slate-400 font-medium">
                            Tidak ada data pengguna
                          </td>
                        </tr>
                      ) : users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <h4 className="font-bold text-slate-700">{u.name || '-'}</h4>
                            <p className="text-slate-500 text-xs mt-0.5 font-mono">{u.email || u.noTelepon || '-'}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleBadgeColor[u.role] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                              {roleLabels[u.role] || u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-slate-500 font-mono">
                            {u.warga?.noRumah || '-'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-xl transition-colors" title="Edit">
                                <PencilLine strokeWidth={2.5} className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* === PREFERENSI SISTEM === */}
          {activeSection === 'preferences' && (
            <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/30 p-8 space-y-8 max-w-2xl">
              <div>
                 <h2 className="font-headline font-bold text-xl text-slate-900">Preferensi Sistem</h2>
                 <p className="text-sm text-slate-500 mt-1">Konfigurasi visual dan pengaturan notifikasi otomatis aplikasi.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
                        <Mail strokeWidth={2.5} className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-bold text-sm text-slate-700">Notifikasi Email</h3>
                       <p className="text-xs text-slate-500">Terima rekap aktivitas via email terdaftar.</p>
                     </div>
                  </div>
                  {/* Toggle */}
                  <div className="w-12 h-6 bg-cyan-600 rounded-full relative cursor-pointer shadow-inner">
                     <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
                        <MessageSquare strokeWidth={2.5} className="w-5 h-5" />
                     </div>
                     <div>
                       <h3 className="font-bold text-sm text-slate-700">Notifikasi WhatsApp</h3>
                       <p className="text-xs text-slate-500">Broadcast massal ke warga via WhatsApp.</p>
                     </div>
                  </div>
                  <div className="w-12 h-6 bg-cyan-600 rounded-full relative cursor-pointer shadow-inner">
                     <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                 <button className="w-full bg-cyan-900 hover:bg-cyan-800 text-white font-bold py-3 rounded-2xl transition-all shadow-sm shadow-cyan-900/10 active:scale-[0.98]">
                   Simpan Preferensi
                 </button>
              </div>
            </div>
          )}

          {/* === INTEGRASI === */}
          {activeSection === 'integrations' && (
            <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/30 p-8 max-w-2xl">
              <h2 className="font-headline font-bold text-xl text-slate-900 mb-1">Integrasi Modul Eksternal</h2>
              <p className="text-sm text-slate-500 mb-8">Hubungkan sistem CivicHub dengan API dari penyedia layanan eksternal untuk memperkaya fitur.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center group hover:border-emerald-400 transition-colors bg-white">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform">
                     <MessageCircle strokeWidth={2.5} className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-700 text-sm">WhatsApp Gateway API</h3>
                  <p className="text-[10px] text-slate-500 mt-1 mb-4">Twilio / WABlas interkoneksi.</p>
                  <button className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-colors">
                    Hubungkan
                  </button>
                </div>

                <div className="border border-slate-200 rounded-2xl p-5 flex flex-col items-center text-center group hover:border-slate-400 transition-colors bg-white">
                  <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-600 group-hover:scale-110 transition-transform">
                     <CreditCard strokeWidth={2.5} className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-700 text-sm">Xendit / Midtrans</h3>
                  <p className="text-[10px] text-slate-500 mt-1 mb-4">Payment gateway verifikasi instan.</p>
                  <button className="w-full py-2 border-2 border-cyan-700 text-cyan-700 font-bold text-xs rounded-xl hover:bg-cyan-700 hover:text-white transition-colors">
                    Tersambung
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* === PROFIL SAYA === */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/30 p-8 max-w-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-slate-100 rounded-full blur-3xl -translate-y-12 translate-x-12 z-0"></div>
              
               <div className="relative z-10">
                 <h2 className="font-headline font-bold text-xl text-slate-900 mb-1">Profil Administrator</h2>
                 <p className="text-sm text-slate-500 mb-8">Ubah informasi dasar akun sekuritas Anda.</p>

                 {profileMessage && (
                   <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-bold ${profileMessage.startsWith('✓') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                     {profileMessage}
                   </div>
                 )}

                 <div className="space-y-5">
                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Nama Lengkap</label>
                     <input
                       type="text"
                       value={profileForm.name}
                       onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                       className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:border-slate-900 transition-colors shadow-sm"
                     />
                   </div>

                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">No. WhatsApp Pribadi</label>
                     <input
                       type="tel"
                       value={profileForm.noTelepon}
                       onChange={e => setProfileForm(p => ({ ...p, noTelepon: e.target.value }))}
                       className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:border-slate-900 transition-colors shadow-sm"
                     />
                   </div>

                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Alamat Email Aktif</label>
                     <input
                       type="email"
                       value={profileForm.email}
                       onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                       className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:border-cyan-700 transition-colors shadow-sm"
                     />
                   </div>

                   <button
                     onClick={handleSaveProfile}
                     disabled={isSavingProfile}
                     className="w-full bg-cyan-900 hover:bg-cyan-800 text-white font-bold py-3 mt-4 rounded-xl transition-all shadow-sm shadow-cyan-900/10 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
                   >
                     {isSavingProfile ? (
                       <RefreshCw strokeWidth={2.5} className="w-5 h-5 animate-spin" />
                     ) : (
                       <Save strokeWidth={2.5} className="w-5 h-5" />
                     )}
                     {isSavingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
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
