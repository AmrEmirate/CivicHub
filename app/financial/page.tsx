'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { financialService } from '@/lib/services/financial-service';
import { Invoice, Transaction, FinancialStats } from '@/lib/types/financial';
import { formatCurrency } from '@/lib/utils/formatters';
import Link from 'next/link';

export default function FinancialPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<FinancialStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [statsData, invoicesData, transactionsData] = await Promise.all([
          financialService.getFinancialStats(),
          financialService.getInvoices({ page: 1, limit: 10 }),
          financialService.getTransactions({ page: 1, limit: 10 }),
        ]);
        
        setStats(statsData);
        setInvoices(invoicesData.data);
        setTransactions(transactionsData.data);
      } catch (error) {
        console.error('Error loading financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handlePrint = (id: string) => {
    setIsPrinting(id);
    setTimeout(() => {
      setIsPrinting(null);
      alert(`Simulasi: Kwitansi ${id} siap dicetak! Membuka preview cetak...`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex w-full h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-700 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-inter text-sm font-medium animate-pulse">Memuat data keuangan...</p>
        </div>
      </div>
    );
  }

  // --- PORTAL WARGA (FITUR 4 & 5) ---
  if (user?.role === 'warga') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-4">
           <h1 className="font-headline text-3xl font-extrabold text-cyan-950 dark:text-cyan-50">Portal Tagihan Warga</h1>
           <p className="text-sm text-slate-500 mt-2">Lihat rincian tagihan pribadi dan lakukan pembayaran mandiri.</p>
        </div>

        {/* Invoice Highlight Card (Fitur 4) */}
        <div className="relative glass-panel rounded-[2.5rem] p-8 custom-shadow border border-outline-variant/30 overflow-hidden group hover:border-cyan-300 transition-all">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform group-hover:scale-110"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                 <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 border border-amber-100 dark:border-amber-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Menunggu Pembayaran
                 </div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tagihan Iuran Bulanan</p>
                 <h2 className="font-headline text-5xl font-black text-cyan-950 dark:text-cyan-50 mt-2 mb-1 tracking-tight">Rp 150.000</h2>
                 <p className="text-xs font-bold text-slate-400">Periode: April 2026</p>
                 <div className="font-inter text-xs text-slate-500 font-semibold mt-6 flex items-center bg-slate-50 dark:bg-slate-800/50 w-fit px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined text-[16px] mr-2 text-rose-500">schedule</span>
                    Jatuh tempo: <strong className="ml-1 text-slate-700 dark:text-slate-300 font-black">10 April 2026</strong>
                 </div>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white dark:border-slate-700 p-6 rounded-3xl w-full md:w-72 shrink-0 shadow-xl shadow-black/5 hover:translate-y-[-4px] transition-transform">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 pb-3 mb-4 flex justify-between">
                    Rincian Tagihan <span className="material-symbols-outlined text-[14px]">receipt_long</span>
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Iuran Keamanan</span>
                          <span className="text-[9px] text-slate-400 uppercase font-bold">Wajib</span>
                       </div>
                       <span className="font-black text-cyan-950 dark:text-cyan-50 text-sm">Rp 100k</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Kebersihan & Sosial</span>
                          <span className="text-[9px] text-slate-400 uppercase font-bold">Wajib</span>
                       </div>
                       <span className="font-black text-cyan-950 dark:text-cyan-50 text-sm">Rp 50k</span>
                    </div>
                 </div>
                 <Link href="/payment" className="mt-8 w-full py-4 primary-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 hover:translate-y-[-2px] active:scale-95 transition-all shadow-lg shadow-cyan-900/40">
                    <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span> Bayar Sekarang
                 </Link>
              </div>
           </div>
        </div>

        {/* History / Digital Receipts (Fitur 5) */}
        <div className="mt-4">
           <div className="flex items-center justify-between px-2 mb-4">
              <h3 className="font-headline font-black text-lg text-cyan-950 dark:text-cyan-50">Riwayat & Kwitansi Digital</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">3 Transaksi Terakhir</span>
        </div>
        <div className="glass-panel rounded-[2rem] border border-outline-variant/30 overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
           <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] uppercase text-slate-400 font-bold tracking-widest shadow-sm">
                 <tr>
                    <th className="px-8 py-4">Bulan Tagihan</th>
                    <th className="px-6 py-4">Tanggal Pembayaran</th>
                    <th className="px-8 py-4 text-right">Status / Kwitansi</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                 {[
                    { month: 'Maret 2026', date: '05 Mar 2026', id: 'INV-MAR-001' },
                    { month: 'Februari 2026', date: '08 Feb 2026', id: 'INV-FEB-012' },
                    { month: 'Januari 2026', date: '02 Jan 2026', id: 'INV-JAN-045' }
                 ].map((row, i) => (
                    <tr key={i} className="hover:bg-cyan-50/20 dark:hover:bg-cyan-950/20 transition-all group">
                       <td className="px-8 py-5">
                          <div className="font-black text-slate-700 dark:text-slate-200 group-hover:text-cyan-700 transition-colors uppercase tracking-tight">{row.month}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 font-mono">{row.id}</div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                             <span className="material-symbols-outlined text-[14px]">event_available</span>
                             {row.date}
                          </div>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                             <button 
                               onClick={() => handlePrint(row.id)}
                               disabled={!!isPrinting}
                               className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
                                 isPrinting === row.id 
                                   ? 'bg-slate-100 text-slate-400 border-slate-200' 
                                   : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:scale-105 active:scale-95'
                               }`}
                             >
                                {isPrinting === row.id ? (
                                  <span className="flex items-center gap-1"><span className="w-2 h-2 border border-slate-400 border-t-transparent rounded-full animate-spin"></span> Printing...</span>
                                ) : (
                                  <><span className="material-symbols-outlined text-[16px]">print</span> Kwitansi</>
                                )}
                             </button>
                             <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
        </div>
      </div>
    );
  }

  // --- ADMIN / BENDAHARA (FITUR 2, 3, 6, 7, 8) ---
  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
            <span className="w-8 h-[1px] bg-slate-300"></span>
            MANAJEMEN KAS RT (BENDAHARA)
          </div>
          <h1 className="font-headline text-4xl font-black text-cyan-950 dark:text-cyan-50 tracking-tight">Financial Treasury</h1>
          <p className="font-inter text-slate-500 text-sm font-medium">Pengelolaan iuran, pencatatan kas harian, dan pelaporan otomatis.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm hover:translate-y-[-2px]">
            <span className="material-symbols-outlined text-[20px]">ios_share</span> Export LPJ (PDF)
          </button>
          <button className="flex-1 md:flex-none px-6 py-3.5 primary-gradient rounded-2xl font-black text-xs text-white uppercase tracking-widest shadow-xl shadow-cyan-900/30 hover:translate-y-[-2px] active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add_circle</span> Catat Kas Harian
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Buku Kas Umum Summary (Fitur 7) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-panel p-8 rounded-[2.5rem] custom-shadow border-2 border-transparent hover:border-cyan-500/20 transition-all overflow-hidden bg-cyan-950 text-white relative group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 mb-8 shadow-inner">
                  <span className="material-symbols-outlined text-[24px]">account_balance</span>
               </div>
               <div>
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-2">Total Saldo Kas Umum</p>
                  <h3 className="font-headline text-4xl font-black tracking-tight leading-none group-hover:tracking-normal transition-all">
                    {stats ? formatCurrency(stats.saldo) : 'Rp 0'}
                  </h3>
                  <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-400">
                     <span className="material-symbols-outlined text-[14px] mr-1">trending_up</span>
                     +2.4% dari bulan lalu
                  </div>
               </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 custom-shadow flex flex-col justify-between group hover:shadow-emerald-500/5 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3 border border-emerald-100 dark:border-emerald-800">
               <span className="material-symbols-outlined text-[24px]">payments</span>
            </div>
            <div className="mt-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-600 transition-colors">Total Pemasukan (Bulan Ini)</p>
               <h3 className="font-headline text-2xl font-black text-cyan-950 dark:text-cyan-50">
                 {stats ? formatCurrency(stats.totalPemasukan) : 'Rp 0'}
               </h3>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 custom-shadow flex flex-col justify-between group hover:shadow-rose-500/5 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:-rotate-3 border border-rose-100 dark:border-rose-800">
               <span className="material-symbols-outlined text-[24px]">outbox</span>
            </div>
            <div className="mt-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-rose-600 transition-colors">Total Pengeluaran (Bulan Ini)</p>
               <h3 className="font-headline text-2xl font-black text-cyan-950 dark:text-cyan-50">
                 {stats ? formatCurrency(stats.totalPengeluaran) : 'Rp 0'}
               </h3>
            </div>
          </div>
        </div>

        {/* Manajemen Jenis Iuran (Fitur 2) */}
        <div className="glass-panel p-6 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 flex flex-col hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-6 border-b border-white dark:border-slate-800 pb-4">
             <h3 className="font-black text-[10px] text-cyan-950 dark:text-cyan-50 uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-2 h-4 bg-cyan-600 rounded-sm"></span> Referensi Iuran
             </h3>
             <button className="p-2 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-cyan-600 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
             </button>
          </div>
          <div className="space-y-3 flex-1">
             {[
               { kat: 'Keamanan', nom: 'Rp 100.000', icon: 'shield_moon' },
               { kat: 'Kebersihan', nom: 'Rp 35.000', icon: 'delete_sweep' },
               { kat: 'Sosial', nom: 'Rp 15.000', icon: 'volunteer_activism' }
             ].map((iuran, i) => (
                <div key={i} className="px-4 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group hover:border-cyan-200 transition-all hover:translate-x-1">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-[18px] text-slate-300 group-hover:text-cyan-600 transition-colors">{iuran.icon}</span>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{iuran.kat}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200 text-xs">{iuran.nom}</span>
                     </div>
                  </div>
                  <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 dark:bg-cyan-950/20 px-1.5 py-0.5 rounded">Bulan</span>
                </div>
             ))}
          </div>
          <button className="w-full py-4 mt-6 primary-gradient text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:translate-y-[-2px] active:scale-95 transition-all shadow-lg shadow-cyan-900/30">
             Generate Tagihan Baru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kas Harian (Fitur 3) */}
        <div className="lg:col-span-3 glass-panel rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 custom-shadow overflow-hidden flex flex-col group/table">
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/10">
             <div>
                <h2 className="font-headline font-black text-xl text-cyan-950 dark:text-cyan-50 tracking-tight">Pencatatan Kas Harian</h2>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Transaksi Pemasukan & Pengeluaran</p>
             </div>
             <div className="flex gap-2">
                <button className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400 hover:text-cyan-600 transition-all"><span className="material-symbols-outlined text-[20px]">filter_alt</span></button>
                <div className="relative">
                   <input type="text" placeholder="Cari..." className="w-32 hover:w-64 focus:w-64 transition-all duration-300 py-2.5 pl-10 pr-4 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-sm text-xs font-bold focus:ring-2 focus:ring-cyan-500/20" />
                   <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-lg">search</span>
                </div>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] uppercase text-slate-400 font-black tracking-[0.15em] border-b border-slate-100 dark:border-slate-800">
                   <tr>
                      <th className="px-8 py-4">Keterangan / Bukti</th>
                      <th className="px-6 py-4">Kategori</th>
                      <th className="px-6 py-4">Tanggal</th>
                      <th className="px-8 py-4 text-right">Nominal</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 text-xs text-slate-600 dark:text-slate-400">
                  {transactions.slice(0, 6).map((trx, i) => (
                    <tr key={i} className="hover:bg-cyan-50/50 dark:hover:bg-cyan-950/10 transition-all group/row">
                      <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="font-black text-slate-700 dark:text-slate-200 text-sm mb-1 group-hover/row:text-cyan-700 transition-colors">{trx.description}</span>
                            <div className="flex items-center gap-2">
                               <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-[9px] font-black uppercase text-slate-400 tracking-tighter">ID: {String(trx.id).substring(0, 8)}</span>
                               <button 
                                 onClick={() => alert('Simulasi: Menampilkan popup gambar bukti transaksi...')}
                                 className="flex items-center gap-1.5 p-1.5 px-2 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-[9px] font-black uppercase tracking-tighter hover:bg-cyan-100 transition-all group-hover/row:scale-105"
                               >
                                  <span className="material-symbols-outlined text-[16px]">visibility</span> Lihat Bukti
                               </button>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-5">
                         <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">{trx.category}</span>
                      </td>
                      <td className="px-6 py-5 font-bold font-mono">{(new Date(trx.createdAt)).toLocaleDateString('id-ID')}</td>
                      <td className={`px-8 py-5 text-right font-black text-sm ${trx.type === 'pemasukan' ? 'text-emerald-500' : 'text-rose-500'}`}>
                         <span className="inline-flex items-center gap-1">
                            {trx.type === 'pemasukan' ? <span className="material-symbols-outlined text-[16px]">arrow_downward</span> : <span className="material-symbols-outlined text-[16px]">arrow_upward</span>}
                            {formatCurrency(trx.amount)}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
          <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 text-center border-t border-slate-50 dark:border-slate-800">
             <button className="text-[10px] font-black text-cyan-700 uppercase tracking-[0.2em] hover:tracking-[0.4em] transition-all">Lihat Semua Riwayat Ledger</button>
          </div>
        </div>

        {/* Laporan Tunggakan (Fitur 6) */}
        <div className="glass-panel p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 custom-shadow flex flex-col max-h-[600px] hover:border-rose-500/20 transition-all">
          <div className="flex items-center justify-between mb-8 border-b border-slate-50 dark:border-slate-800 pb-6">
             <div>
                <h2 className="font-headline font-black text-xl text-cyan-950 dark:text-cyan-50 leading-tight">Laporan Tunggakan</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-500/20"></div>
                   <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.1em]">Butuh Perhatian Utama</span>
                </div>
             </div>
             <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 px-4 py-2 rounded-2xl text-sm font-black shadow-inner">{stats?.invoicesTunggakan || 0}</div>
          </div>
          
          <div className="overflow-y-auto pr-3 space-y-4 custom-scrollbar">
             {[
               { name: 'Bpk. Hendra Wijaya', amount: 300000, months: 2, telp: '0812XXX', blk: 'B-14' },
               { name: 'Ibu Susanti', amount: 150000, months: 1, telp: '0857XXX', blk: 'A-21' },
               { name: 'Bpk. Ahmad Malik', amount: 450000, months: 3, telp: '0813XXX', blk: 'C-05' },
               { name: 'Sdr. Rizky Ramadhan', amount: 150000, months: 1, telp: '0899XXX', blk: 'E-12' }
             ].map((warga, i) => (
                <div key={i} className="p-5 bg-slate-50/50 dark:bg-slate-800/40 rounded-3xl border border-transparent hover:border-rose-100 dark:hover:border-rose-900/50 transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-rose-500 shadow-sm transition-all group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-rose-500/30">
                           <span className="material-symbols-outlined text-[24px]">contact_emergency</span>
                        </div>
                        <div>
                           <p className="text-[13px] font-black text-slate-700 dark:text-slate-200 leading-none group-hover:text-rose-600 transition-colors uppercase tracking-tight">{warga.name}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1.5 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-[14px]">door_open</span> Blok {warga.blk} • <span className="text-rose-400 font-black">{warga.months} BLN</span>
                           </p>
                        </div>
                     </div>
                     <span className="text-sm font-black text-cyan-950 dark:text-cyan-50">{formatCurrency(warga.amount)}</span>
                  </div>
                  <button className="w-full py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black text-cyan-700 dark:text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm">
                     <span className="material-symbols-outlined text-[18px]">campaign</span> Kirim Pengingat WA
                  </button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
