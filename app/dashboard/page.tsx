'use client';

import { useState, useEffect } from 'react';
import { memberService } from '@/lib/services/member-service';
import { financialService } from '@/lib/services/financial-service';
import { announcementService } from '@/lib/services/announcement-service';
import { MembersStats } from '@/lib/types/member';
import { FinancialStats, Transaction } from '@/lib/types/financial';
import { Announcement } from '@/lib/types/announcement';
import { useAuth } from '@/lib/context/auth-context';
import { 
  FileText, PlusCircle, Wallet, TrendingUp, HandCoins, 
  Bell, Info, ArrowDownRight, ArrowUpRight, InboxIcon
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils/formatters';

export default function DashboardPage() {
  const [membersStats, setMembersStats] = useState<MembersStats | null>(null);
  const [financialStats, setFinancialStats] = useState<FinancialStats | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const [members, financial, annc, trx] = await Promise.all([
          memberService.getMembersStats(),
          financialService.getFinancialStats(),
          announcementService.getPinnedAnnouncements(),
          financialService.getTransactions({ page: 1, limit: 5 }),
        ]);
        setMembersStats(members);
        setFinancialStats(financial);
        setAnnouncements(annc);
        setTransactions(trx.data || []);
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
          <div className="w-12 h-12 border-4 border-cyan-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-slate-500 font-inter text-sm font-medium animate-pulse">Menyiapkan Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-cyan-100 p-8 shadow-2xl shadow-cyan-200/50 text-cyan-950 isolate">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-300/30 rounded-full blur-3xl -z-10 mix-blend-multiply pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl -z-10 mix-blend-multiply pointer-events-none transform -translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-headline text-3xl font-extrabold tracking-tight">Selamat datang, {user?.name || 'Administrator'}! 👋</h1>
            <p className="font-inter text-cyan-900/80 max-w-2xl text-sm leading-relaxed">
              Ini adalah ringkasan operasional Civic Hub hari ini. Saldo kas saat ini berada dalam kondisi sehat, ada {financialStats?.invoicesTunggakan || 0} tagihan yang masih membutuhkan perhatian.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/financial" className="px-5 py-2.5 bg-cyan-900/10 hover:bg-cyan-900/20 backdrop-blur-md rounded-2xl font-semibold text-sm transition-all border border-cyan-900/20 flex items-center shadow-sm active:scale-95 group text-cyan-950">
              <FileText strokeWidth={2.5} className="w-4 h-4 mr-2 group-hover:text-cyan-700 transition-colors" /> Laporan
            </Link>
            <Link href="/financial" className="px-5 py-2.5 bg-cyan-950 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-cyan-900 hover:scale-105 active:scale-95 transition-all flex items-center group">
              <PlusCircle strokeWidth={3} className="w-4 h-4 mr-2 text-cyan-300 group-hover:rotate-90 transition-transform duration-300" /> Entri Baru
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left/Main Column */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Financial Summary Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group bg-card p-6 rounded-3xl flex flex-col justify-between border border-outline-variant/30 shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-0"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform">
                  <Wallet strokeWidth={2.5} className="w-6 h-6" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant bg-surface-variant px-2 py-1 rounded-lg">Total Kas</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-headline text-3xl font-black text-on-surface tracking-tight">
                  {financialStats ? formatCurrency(financialStats.saldo) : 'Rp 0'}
                </h3>
                <p className="text-xs text-outline font-medium mt-1">Saldo akhir operasional RT</p>
              </div>
            </div>

            <div className="group bg-card p-6 rounded-3xl flex flex-col justify-between border border-outline-variant/30 shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -z-0"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white border border-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-md shadow-emerald-500/30">
                  <TrendingUp strokeWidth={2.5} className="w-6 h-6" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight">
                  {financialStats ? formatCurrency(financialStats.totalPemasukan) : 'Rp 0'}
                </h3>
                <p className="text-xs text-outline font-medium mt-1">Pemasukan bulan ini</p>
              </div>
            </div>

            <div className="group bg-card p-6 rounded-3xl flex flex-col justify-between border border-outline-variant/30 shadow-sm hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-bl-full -z-0"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white border border-rose-400 group-hover:scale-110 group-hover:-rotate-6 transition-all shadow-md shadow-rose-500/30">
                  <HandCoins strokeWidth={2.5} className="w-6 h-6" />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight">
                  {financialStats ? formatCurrency(financialStats.totalPengeluaran) : 'Rp 0'}
                </h3>
                <p className="text-xs text-outline font-medium mt-1">Pengeluaran bulan ini</p>
              </div>
            </div>
          </div>

          {/* Transaksi Terakhir — DATA REAL dari BE */}
          <div className="bg-card rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-card">
              <div>
                <h2 className="font-headline font-extrabold text-lg text-on-surface">Laporan Transaksi Terakhir</h2>
                <p className="text-xs text-outline mt-1 font-medium">Mutasi mutakhir kas operasional CivicHub</p>
              </div>
              <Link href="/financial" className="text-primary text-sm font-bold cursor-pointer hover:underline underline-offset-4 focus:outline-none">
                Semua Transaksi
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase text-outline bg-surface-container/50 font-bold tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Keterangan</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4 text-right">Nominal (Rp)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 font-inter">
                  {transactions.length > 0 ? transactions.map((trx, i) => (
                    <tr key={i} className="hover:bg-surface-container/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-on-surface">{trx.description}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-surface-container border border-outline-variant/30 text-on-surface-variant flex items-center inline-flex gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${trx.type === 'pemasukan' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                          {trx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-outline font-medium">
                        {new Date(trx.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold flex items-center justify-end gap-1.5 ${trx.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {trx.type === 'pemasukan'
                          ? <ArrowDownRight strokeWidth={3} className="w-4 h-4" />
                          : <ArrowUpRight strokeWidth={3} className="w-4 h-4" />}
                        {formatCurrency(trx.amount)}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-3 text-outline">
                          <InboxIcon strokeWidth={1.5} className="w-10 h-10 text-outline-variant/50" />
                          <p className="text-sm font-semibold">Belum ada transaksi tercatat</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          
          {/* Notifications Panel */}
          <div className="bg-card p-6 rounded-3xl border border-outline-variant/30 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-error-container text-error flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h2 className="font-headline font-extrabold text-lg text-on-surface">Papan Informasi</h2>
              </div>
              {announcements.length > 0 && (
                <span className="bg-error text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md shadow-error/20">BARU</span>
              )}
            </div>
            
            <div className="space-y-4 flex-grow">
              {announcements.length > 0 ? announcements.slice(0, 3).map((annc, i) => (
                <div key={annc.id} className="group cursor-pointer p-3 -mx-3 hover:bg-surface-container rounded-2xl transition-colors">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 mt-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] shrink-0 group-hover:scale-150 transition-transform"></div>
                    <div>
                      <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors leading-tight">{annc.title}</p>
                      <p className="text-xs text-outline mt-1.5 line-clamp-2 leading-relaxed">{annc.content}</p>
                      <span className="text-[10px] text-outline/80 font-bold uppercase tracking-wider mt-2.5 block flex items-center">
                        <Info className="w-3 h-3 mr-1" /> {new Date(annc.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center h-48 text-center text-outline">
                  <Bell strokeWidth={1} className="w-10 h-10 mb-3 text-outline-variant opacity-50" />
                  <p className="text-sm font-semibold">Belum ada pengumuman</p>
                  <p className="text-xs text-outline/70 mt-1">Area Anda tenang untuk hari ini.</p>
                </div>
              )}
            </div>
            <Link href="/announcements" className="w-full mt-6 py-3 rounded-xl border border-outline-variant/50 text-xs font-bold text-on-surface-variant hover:bg-surface-container active:scale-95 transition-all shadow-sm text-center block">
              Lihat Pusat Pesan
            </Link>
          </div>

          {/* Members Stats Grid */}
          {membersStats && (
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-3xl shadow-lg border border-cyan-200 text-cyan-950 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-900/5 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:bg-cyan-900/10 transition-colors duration-700"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl translate-y-12 -translate-x-4 pointer-events-none"></div>
              
              <h2 className="font-headline font-extrabold text-lg mb-6 relative z-10 text-cyan-950 tracking-tight flex items-center">
                Statistik Kependudukan
              </h2>
              
              <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="p-4 bg-cyan-900/[0.04] hover:bg-cyan-900/[0.08] rounded-2xl border border-cyan-900/10 transition-colors backdrop-blur-sm">
                  <span className="text-4xl font-black tabular-nums">{membersStats.totalKK}</span>
                  <p className="text-[10px] uppercase tracking-widest text-cyan-800 font-semibold mt-1">Total KK</p>
                </div>
                <div className="p-4 bg-cyan-900/[0.04] hover:bg-cyan-900/[0.08] rounded-2xl border border-cyan-900/10 transition-colors backdrop-blur-sm">
                  <span className="text-4xl font-black tabular-nums">{membersStats.totalWarga}</span>
                  <p className="text-[10px] uppercase tracking-widest text-cyan-800 font-semibold mt-1">Jiwa Warga</p>
                </div>
                <div className="p-4 bg-cyan-900/[0.04] hover:bg-cyan-900/[0.08] rounded-2xl border border-cyan-900/10 transition-colors backdrop-blur-sm">
                  <span className="text-2xl font-bold tabular-nums">{membersStats.hunianMilik}</span>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-700 font-semibold mt-1 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span> Milik Pribadi
                  </p>
                </div>
                <div className="p-4 bg-cyan-900/[0.04] hover:bg-cyan-900/[0.08] rounded-2xl border border-cyan-900/10 transition-colors backdrop-blur-sm">
                  <span className="text-2xl font-bold tabular-nums">{membersStats.hunianSewa}</span>
                  <p className="text-[10px] uppercase tracking-widest text-amber-700 font-semibold mt-1 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span> Sewa/Kontrak
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
