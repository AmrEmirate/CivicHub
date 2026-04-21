'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { financialService } from '@/lib/services/financial-service';
import { Invoice, Transaction, FinancialStats } from '@/lib/types/financial';
import { formatCurrency } from '@/lib/utils/formatters';
import Link from 'next/link';
import { 
  Loader2, Receipt, Clock, Wallet, CalendarDays, 
  Printer, TrendingUp, HandCoins, ArrowDownRight, ArrowUpRight, 
  Eye, Megaphone, Trash2, ShieldAlert, DoorOpen, BadgeInfo,
  Settings, Landmark, Download, PlusCircle, Search, Filter 
} from 'lucide-react';

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
          <div className="w-12 h-12 border-4 border-cyan-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-outline font-inter text-sm font-medium animate-pulse">Menghitung kalkulasi keuangan...</p>
        </div>
      </div>
    );
  }

  // --- PORTAL WARGA ---
  if (user?.role === 'warga') {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="text-center mb-2">
           <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">Portal Tagihan Warga</h1>
           <p className="font-inter text-outline text-sm mt-3 font-medium">Lihat rincian kewajiban bulanan dan unduh kwitansi digital.</p>
        </div>

        {/* Invoice Highlight Card */}
        <div className="relative bg-card rounded-[2.5rem] p-8 md:p-10 border border-outline-variant/30 overflow-hidden group hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-500">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-transform group-hover:scale-110 pointer-events-none"></div>
           
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div>
                 <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-5 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Menunggu Pembayaran
                 </div>
                 <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest">Tagihan Iuran Bulanan</p>
                 <h2 className="font-headline text-6xl font-black text-on-surface mt-2 mb-2 tracking-tighter">Rp 150<span className="text-4xl text-outline-variant">.000</span></h2>
                 <p className="text-xs font-bold text-outline">Periode: April 2026</p>
                 <div className="font-inter text-xs text-on-surface-variant font-semibold mt-8 flex items-center bg-surface-container w-fit px-4 py-2.5 rounded-2xl border border-outline-variant/30 shadow-sm">
                    <Clock strokeWidth={2.5} className="w-4 h-4 mr-2 text-rose-500" />
                    Jatuh tempo: <strong className="ml-1.5 text-on-surface font-black">10 April 2026</strong>
                 </div>
              </div>

              <div className="bg-surface-container/50 backdrop-blur-xl border border-outline-variant/30 p-8 rounded-[2rem] w-full md:w-80 shrink-0 shadow-xl shadow-black/5 hover:-translate-y-1 transition-transform">
                 <h3 className="text-[10px] font-black text-outline uppercase tracking-widest border-b border-outline-variant/30 pb-4 mb-5 flex justify-between items-center">
                    Rincian Tagihan <Receipt strokeWidth={2.5} className="w-4 h-4 text-primary" />
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-on-surface">Iuran Keamanan</span>
                          <span className="text-[9px] text-outline uppercase font-bold mt-0.5">Wajib</span>
                       </div>
                       <span className="font-black text-on-surface text-sm">Rp 100k</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-on-surface">Kebersihan & Sosial</span>
                          <span className="text-[9px] text-outline uppercase font-bold mt-0.5">Wajib</span>
                       </div>
                       <span className="font-black text-on-surface text-sm">Rp 50k</span>
                    </div>
                 </div>
                 <Link href="/payment" className="mt-8 w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all shadow-lg shadow-primary/20 group">
                    <Wallet strokeWidth={2.5} className="w-4 h-4 group-hover:scale-110 transition-transform" /> Bayar Sekarang
                 </Link>
              </div>
           </div>
        </div>

        {/* History / Digital Receipts */}
        <div className="mt-4">
           <div className="flex items-center justify-between px-2 mb-6">
              <h3 className="font-headline font-black text-2xl text-on-surface tracking-tight">Kwitansi Digital</h3>
              <span className="text-[10px] font-bold text-outline uppercase tracking-widest bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/30">3 Transaksi Terakhir</span>
        </div>
        <div className="bg-card rounded-[2rem] border border-outline-variant/30 overflow-hidden">
           <table className="w-full text-sm text-left">
              <thead className="bg-surface-container/50 text-[10px] uppercase text-outline font-bold tracking-widest border-b border-outline-variant/20">
                 <tr>
                    <th className="px-8 py-5">Periode Tagihan</th>
                    <th className="px-6 py-5">Tgl Pembayaran</th>
                    <th className="px-8 py-5 text-right">Kwitansi</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                 {[
                    { month: 'Maret 2026', date: '05 Mar 2026', id: 'INV-MAR-001' },
                    { month: 'Februari 2026', date: '08 Feb 2026', id: 'INV-FEB-012' },
                    { month: 'Januari 2026', date: '02 Jan 2026', id: 'INV-JAN-045' }
                 ].map((row, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors group">
                       <td className="px-8 py-6">
                          <div className="font-black text-on-surface text-sm mb-1 group-hover:text-primary transition-colors tracking-tight">{row.month}</div>
                          <div className="text-[9px] text-outline font-bold uppercase font-mono">{row.id}</div>
                       </td>
                       <td className="px-6 py-6">
                          <div className="flex items-center gap-2 text-outline-variant font-bold text-xs">
                             <CalendarDays strokeWidth={2.5} className="w-4 h-4 text-primary/70" />
                             {row.date}
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                             <button 
                               onClick={() => handlePrint(row.id)}
                               disabled={!!isPrinting}
                               className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                 isPrinting === row.id 
                                   ? 'bg-surface-container text-outline border-outline-variant/30' 
                                   : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 shadow-sm active:scale-95'
                               }`}
                             >
                                {isPrinting === row.id ? (
                                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Mencetak...</>
                                ) : (
                                  <><Printer strokeWidth={2.5} className="w-3.5 h-3.5" /> Kwitansi</>
                                )}
                             </button>
                             <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
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

  // --- ADMIN / BENDAHARA ---
  return (
    <div className="w-full flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-outline">
            <span className="w-8 h-[2px] bg-primary/40 rounded-full"></span>
            MANAJEMEN KAS (BENDAHARA)
          </div>
          <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">Buku Kas Keuangan</h1>
          <p className="font-inter text-outline text-sm font-medium leading-relaxed max-w-xl">Pusat pemantauan saldo kas umum, manajemen referensi iuran, dan pencatatan transaksi harian.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex-1 md:flex-none px-5 py-3 rounded-2xl bg-card border border-outline-variant/50 font-bold text-xs text-on-surface-variant hover:bg-surface-container transition-all flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-primary/10">
            <Download strokeWidth={2.5} className="w-4 h-4" /> Export LPJ
          </button>
          <button className="flex-1 md:flex-none px-5 py-3 bg-gradient-to-r from-primary to-primary-container rounded-2xl font-black text-xs text-white uppercase tracking-widest shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2">
            <PlusCircle strokeWidth={2.5} className="w-4 h-4 text-cyan-200" /> Catat Kas Harian
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Buku Kas Umum Summary */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#001f2a] p-8 rounded-[2rem] border border-cyan-800/50 shadow-xl shadow-cyan-900/10 overflow-hidden text-white relative group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div className="w-14 h-14 rounded-[1.25rem] bg-white/5 backdrop-blur-xl flex items-center justify-center border border-white/10 mb-8 shadow-inner text-cyan-200 group-hover:scale-110 transition-transform">
                  <Landmark strokeWidth={2.5} className="w-7 h-7" />
               </div>
               <div>
                  <p className="text-[10px] font-black text-cyan-400/80 uppercase tracking-widest mb-3">Total Saldo Kas Umum</p>
                  <h3 className="font-headline text-4xl font-black tracking-tight leading-none drop-shadow-md">
                    {stats ? formatCurrency(stats.saldo) : 'Rp 0'}
                  </h3>
                  <div className="mt-5 flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 bg-emerald-500/10 w-fit px-2.5 py-1 rounded-full border border-emerald-500/20">
                     <TrendingUp strokeWidth={3} className="w-3 h-3" />
                     +2.4% dari bulan lalu
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-card p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm flex flex-col justify-between group hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/20 transition-all">
            <div className="w-14 h-14 rounded-[1.25rem] bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3 border border-emerald-100">
               <HandCoins strokeWidth={2.5} className="w-7 h-7" />
            </div>
            <div>
               <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2">Total Pemasukan (Bulan Ini)</p>
               <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight">
                 {stats ? formatCurrency(stats.totalPemasukan) : 'Rp 0'}
               </h3>
            </div>
          </div>

          <div className="bg-card p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm flex flex-col justify-between group hover:shadow-lg hover:shadow-rose-500/5 hover:border-rose-500/20 transition-all">
            <div className="w-14 h-14 rounded-[1.25rem] bg-rose-50 text-rose-600 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-3 border border-rose-100">
               <ArrowUpRight strokeWidth={2.5} className="w-7 h-7" />
            </div>
            <div>
               <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-2">Total Pengeluaran (Bulan Ini)</p>
               <h3 className="font-headline text-2xl font-black text-on-surface tracking-tight">
                 {stats ? formatCurrency(stats.totalPengeluaran) : 'Rp 0'}
               </h3>
            </div>
          </div>
        </div>

        {/* Manajemen Jenis Iuran */}
        <div className="bg-surface-container/30 p-6 rounded-[2rem] border border-outline-variant/30 flex flex-col hover:border-primary/30 transition-all">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/20">
             <h3 className="font-black text-[10px] text-on-surface uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-4 bg-primary rounded-full"></span> Referensi Iuran
             </h3>
             <button className="p-2 bg-card rounded-xl text-outline-variant hover:text-primary border border-outline-variant/30 hover:border-primary/50 transition-all shadow-sm">
                <Settings strokeWidth={2.5} className="w-4 h-4" />
             </button>
          </div>
          <div className="space-y-3 flex-1">
             {[
               { kat: 'Keamanan', nom: 'Rp 100.000' },
               { kat: 'Kebersihan', nom: 'Rp 35.000' },
               { kat: 'Sosial', nom: 'Rp 15.000' }
             ].map((iuran, i) => (
                <div key={i} className="px-4 py-3.5 bg-card rounded-2xl border border-outline-variant/30 flex justify-between items-center group hover:border-primary/50 hover:shadow-sm transition-all hover:translate-x-1">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-outline uppercase tracking-widest mb-0.5">{iuran.kat}</span>
                     <span className="font-bold text-on-surface text-xs">{iuran.nom}</span>
                  </div>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-lg">Bulan</span>
                </div>
             ))}
          </div>
          <button className="w-full py-4 mt-6 bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface font-black text-[10px] uppercase tracking-widest rounded-2xl hover:-translate-y-0.5 transition-all shadow-sm">
             Kelola Iuran
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Kas Harian */}
        <div className="lg:col-span-3 bg-card rounded-[2.5rem] border border-outline-variant/30 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 md:p-8 border-b border-outline-variant/20 flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container/30">
             <div>
                <h2 className="font-headline font-black text-2xl text-on-surface tracking-tight">Pencatatan Kas Harian</h2>
                <p className="text-[11px] text-outline font-bold mt-1.5 uppercase tracking-widest">Transaksi Ledger Masuk & Keluar</p>
             </div>
             <div className="flex gap-3 w-full md:w-auto">
                <button className="w-12 h-12 rounded-2xl bg-card border border-outline-variant/40 shadow-sm flex items-center justify-center text-outline-variant hover:text-primary transition-all"><Filter strokeWidth={2.5} className="w-5 h-5" /></button>
                <div className="relative flex-1 md:flex-none group">
                   <input type="text" placeholder="Cari transaksi..." className="w-full md:w-48 md:focus:w-64 transition-all duration-300 py-3.5 pl-11 pr-4 bg-card border border-outline-variant/40 rounded-2xl shadow-sm text-xs font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none" />
                   <Search strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors w-4 h-4" />
                </div>
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-surface-container/50 text-[10px] uppercase text-outline font-black tracking-widest border-b border-outline-variant/20">
                   <tr>
                      <th className="px-8 py-5">Deskripsi / Bukti</th>
                      <th className="px-6 py-5">Kategori</th>
                      <th className="px-6 py-5">Tanggal</th>
                      <th className="px-8 py-5 text-right">Nominal</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 text-xs">
                  {transactions.slice(0, 6).map((trx, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-all group">
                      <td className="px-8 py-6">
                         <div className="flex flex-col">
                            <span className="font-bold text-on-surface text-sm mb-2 tracking-tight">{trx.description}</span>
                            <div className="flex items-center gap-2">
                               <span className="px-2 py-1 bg-surface-container rounded-lg text-[9px] font-black uppercase text-outline tracking-wider border border-outline-variant/30">ID: {String(trx.id).substring(0, 8)}</span>
                               <button 
                                 onClick={() => alert('Simulasi: Menampilkan popup gambar bukti transaksi...')}
                                 className="flex items-center gap-1.5 p-1 px-2.5 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-primary/20 transition-all border border-primary/20"
                               >
                                  <Eye strokeWidth={2.5} className="w-3.5 h-3.5" /> Bukti
                               </button>
                            </div>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                         <span className="font-bold text-outline-variant uppercase tracking-widest text-[10px] bg-surface-container px-2.5 py-1.5 rounded-lg border border-outline-variant/30">{trx.category}</span>
                      </td>
                      <td className="px-6 py-6 font-bold text-on-surface-variant font-mono">{(new Date(trx.createdAt)).toLocaleDateString('id-ID')}</td>
                      <td className={`px-8 py-6 text-right font-black text-sm ${trx.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                         <span className="inline-flex items-center gap-1.5 justify-end w-full">
                            {trx.type === 'pemasukan' ? <ArrowDownRight strokeWidth={3} className="w-4 h-4" /> : <ArrowUpRight strokeWidth={3} className="w-4 h-4" />}
                            {formatCurrency(trx.amount)}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
          <div className="p-6 bg-surface-container/30 text-center border-t border-outline-variant/20 hover:bg-surface-container/60 transition-colors cursor-pointer">
             <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Lihat Semua Riwayat Kas</button>
          </div>
        </div>

        {/* Laporan Tunggakan */}
        <div className="bg-card p-6 md:p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-sm flex flex-col max-h-[600px] hover:border-rose-500/30 transition-all">
          <div className="flex items-center justify-between mb-8 border-b border-outline-variant/20 pb-6">
             <div>
                <h2 className="font-headline font-black text-2xl text-on-surface tracking-tight leading-tight">Tunggakan</h2>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-4 ring-rose-500/20"></div>
                   <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Perhatian Utama</span>
                </div>
             </div>
             <div className="bg-rose-50 text-rose-600 border border-rose-200 px-4 py-2 rounded-2xl text-sm font-black shadow-sm">{stats?.invoicesTunggakan || 0}</div>
          </div>
          
          <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar">
             {[
               { name: 'Bpk. Hendra Wijaya', amount: 300000, months: 2, telp: '0812XXX', blk: 'B-14' },
               { name: 'Ibu Susanti', amount: 150000, months: 1, telp: '0857XXX', blk: 'A-21' },
               { name: 'Bpk. Ahmad Malik', amount: 450000, months: 3, telp: '0813XXX', blk: 'C-05' },
               { name: 'Sdr. Rizky R', amount: 150000, months: 1, telp: '0899XXX', blk: 'E-12' }
             ].map((warga, i) => (
                <div key={i} className="p-5 bg-surface-container/30 rounded-[1.5rem] border border-outline-variant/30 hover:border-rose-300 hover:bg-rose-50/50 transition-all group flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-card border border-outline-variant/40 flex items-center justify-center text-rose-500 shadow-sm transition-all group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500">
                           <ShieldAlert strokeWidth={2.5} className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-on-surface tracking-tight truncate max-w-[100px]">{warga.name}</p>
                           <p className="text-[10px] font-bold text-outline uppercase tracking-widest mt-1 flex items-center gap-1.5">
                              <DoorOpen strokeWidth={2.5} className="w-3.5 h-3.5" /> {warga.blk} • <span className="text-rose-500">{warga.months} BLN</span>
                           </p>
                        </div>
                     </div>
                     <span className="text-sm font-black text-on-surface">{formatCurrency(warga.amount)}</span>
                  </div>
                  <button className="w-full py-2.5 bg-card border border-outline-variant/40 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-all shadow-sm active:scale-95">
                     <Megaphone strokeWidth={2.5} className="w-3.5 h-3.5" /> Kirim Pengingat
                  </button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
