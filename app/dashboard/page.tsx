'use client';

import { useState, useEffect } from 'react';
import { memberService } from '@/lib/services/member-service';
import { financialService } from '@/lib/services/financial-service';
import { announcementService } from '@/lib/services/announcement-service';
import { MembersStats } from '@/lib/types/member';
import { FinancialStats } from '@/lib/types/financial';
import { Announcement } from '@/lib/types/announcement';
import { useAuth } from '@/lib/context/auth-context';

export default function DashboardPage() {
  const [membersStats, setMembersStats] = useState<MembersStats | null>(null);
  const [financialStats, setFinancialStats] = useState<FinancialStats | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const [members, financial, annc] = await Promise.all([
          memberService.getMembersStats(),
          financialService.getFinancialStats(),
          announcementService.getPinnedAnnouncements(),
        ]);
        setMembersStats(members);
        setFinancialStats(financial);
        setAnnouncements(annc);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-700 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-inter text-sm font-medium animate-pulse">Menyiapkan Dashboard...</p>
        </div>
      </div>
    );
  }

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden custom-shadow border border-outline-variant/30 text-white">
        {/* Background gradient injection */}
        <div className="absolute inset-0 primary-gradient z-0"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight">Selamat datang, {user?.name || 'Administrator'}! 👋</h1>
            <p className="font-inter text-cyan-100 mt-2 max-w-xl text-sm leading-relaxed">
              Ini adalah ringkasan operasional Civic Hub hari ini. Saldo kas dalam kondisi sehat, ada {financialStats?.invoicesTunggakan || 0} tagihan yang butuh perhatian.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-sm transition-colors border border-white/30 flex items-center shadow-lg">
              <span className="material-symbols-outlined mr-2 text-[18px]">receipt_long</span> Laporan
            </button>
            <button className="px-6 py-3 bg-white text-primary rounded-xl font-bold text-sm shadow-xl shadow-black/10 hover:scale-105 transition-transform flex items-center">
              <span className="material-symbols-outlined mr-2 text-[18px]">add_circle</span> Entri Baru
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left/Main Column - Bento Grids */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Financial Summary Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary-fixed-dim">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant bg-surface-container-lowest px-2 py-1 rounded-md">Total Kas</span>
              </div>
              <div>
                <h3 className="font-headline text-2xl font-black text-on-surface">
                  {financialStats ? formatIDR(financialStats.saldo) : 'Rp 0'}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Saldo akhir operasional RT</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-md">
                  <span className="material-symbols-outlined text-[20px]">trending_up</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md">+4.2%</span>
              </div>
              <div>
                <h3 className="font-headline text-2xl font-black text-on-surface">
                  {financialStats ? formatIDR(financialStats.totalPemasukan) : 'Rp 0'}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Pemasukan bulan ini</p>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-[20px]">payments</span>
                </div>
              </div>
              <div>
                <h3 className="font-headline text-2xl font-black text-on-surface">
                  {financialStats ? formatIDR(financialStats.totalPengeluaran) : 'Rp 0'}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-1">Pengeluaran bulan ini</p>
              </div>
            </div>
          </div>

          {/* Aesthetic Mock Graph (Tunggakan Iuran) */}
          <div className="glass-panel p-6 rounded-3xl custom-shadow border border-outline-variant/30">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-headline font-bold text-lg text-cyan-950 dark:text-cyan-50">Analisis Tunggakan Iuran</h2>
                <p className="text-xs text-slate-500 mt-1">Estimasi tunggakan warga per blok wilayah (Ribuan Rp)</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined text-[18px]">more_horiz</span>
              </button>
            </div>
            
            {/* Minimalist HTML Graph Mockup */}
            <div className="relative h-48 w-full flex items-end justify-between px-2 gap-2 mt-4">
              {/* Background Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full border-t border-slate-200/50 dark:border-slate-800/50 border-dashed h-0"></div>
                ))}
              </div>
              
              {/* Bars */}
              {[40, 75, 45, 90, 60, 30, 85].map((h, i) => (
                <div key={i} className="relative z-10 w-full bg-cyan-100 dark:bg-cyan-900/20 rounded-t-lg mx-1 group flex flex-col justify-end h-full">
                  <div 
                    className="w-full primary-gradient rounded-t-sm transition-all duration-700 ease-out relative group-hover:opacity-90"
                    style={{ height: `${h}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {h * 15} rb
                    </div>
                  </div>
                  <div className="absolute -bottom-6 w-full text-center text-[10px] font-semibold text-slate-400">Blok {['A','B','C','D','E','F','G'][i]}</div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex gap-4 text-xs font-medium text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary"></div> Iuran Wajib</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-200"></div> Donasi Sukarela</div>
            </div>
          </div>

          {/* Ledger Table Mockup */}
          <div className="glass-panel rounded-3xl custom-shadow border border-outline-variant/30 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="font-headline font-bold text-lg text-cyan-950 dark:text-cyan-50">Laporan Ledger Terakhir</h2>
                <p className="text-xs text-slate-500 mt-1">Mutasi transaksi operasional RT</p>
              </div>
              <span className="text-blue-600 text-sm font-semibold cursor-pointer hover:underline">Lihat Semua</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase text-slate-400 bg-slate-50/50 dark:bg-slate-800/30 font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">ID Transaksi</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4 text-right rounded-tr-lg">Nominal (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 font-inter">
                  {[
                    { id: 'TRX-V2-0091', kat: 'Iuran Sampah', date: '04 Apr 2026', nom: '+ 4.500.000', pos: true },
                    { id: 'TRX-V2-0090', kat: 'Honor Security', date: '01 Apr 2026', nom: '- 3.200.000', pos: false },
                    { id: 'TRX-V2-0089', kat: 'Donasi Masjid', date: '28 Mar 2026', nom: '+ 1.250.000', pos: true },
                    { id: 'TRX-V2-0088', kat: 'Perawatan Cctv', date: '25 Mar 2026', nom: '- 850.000', pos: false },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{row.id}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {row.kat}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{row.date}</td>
                      <td className={`px-6 py-4 text-right font-bold ${row.pos ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
                        {row.nom}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebars */}
        <div className="flex flex-col gap-6">
          
          {/* Notifications Panel */}
          <div className="glass-panel p-6 rounded-3xl custom-shadow border border-outline-variant/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline font-bold text-lg text-cyan-950 dark:text-cyan-50">Notifikasi Penting</h2>
              <span className="bg-error-container text-error text-[10px] font-bold px-2 py-1 rounded-md">2 BARU</span>
            </div>
            
            <div className="space-y-4">
              {announcements.length > 0 ? announcements.slice(0, 3).map((annc, i) => (
                <div key={annc.id} className="group cursor-pointer">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] shrink-0"></div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{annc.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{annc.content}</p>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-2 block">{new Date(annc.createdAt).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                  {i < announcements.length - 1 && <div className="border-t border-slate-100 dark:border-slate-800 my-4 ml-5"></div>}
                </div>
              )) : (
                <div className="text-sm text-slate-500 text-center py-4">Belum ada pengumuman terbaru</div>
              )}
            </div>
            <button className="w-full mt-6 py-2.5 rounded-xl border-2 border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              Lihat Pusat Pesan
            </button>
          </div>

          {/* Members Stats Grid */}
          {membersStats && (
            <div className="glass-panel p-6 rounded-3xl custom-shadow border border-outline-variant/30 bg-primary text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
              <h2 className="font-headline font-bold text-lg mb-6 relative z-10 text-white">Statistik Warga</h2>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/20 transition-colors">
                  <span className="text-4xl font-black">{membersStats.totalKK}</span>
                  <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold mt-1">Total KK</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/20 transition-colors">
                  <span className="text-4xl font-black">{membersStats.totalWarga}</span>
                  <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold mt-1">Jiwa Warga</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/20 transition-colors">
                  <span className="text-2xl font-bold">{membersStats.hunianMilik}</span>
                  <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold mt-1">Milik Pribadi</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/20 transition-colors">
                  <span className="text-2xl font-bold">{membersStats.hunianSewa}</span>
                  <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold mt-1">Sewa / Kontrak</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
