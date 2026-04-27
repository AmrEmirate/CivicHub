'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { useSearchParams } from 'next/navigation';
import { financialService } from '@/lib/services/financial-service';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, QrCode, CheckCircle2, Receipt, Download, HelpCircle, Wallet } from 'lucide-react';

export default function PaymentGatewayPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tagihanId, setTagihanId] = useState<string | null>(null);

  useEffect(() => {
    setTagihanId(searchParams.get('tagihanId') || '1'); // Default to 1 if testing
  }, [searchParams]);

  const initiateMidtransPayment = async () => {
    setIsProcessing(true);
    try {
      // Simulasi delay proses pembayaran (endpoint Midtrans belum tersedia di BE)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsProcessing(false);
    }
  };
    
  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 min-h-[80vh] animate-in fade-in zoom-in-95 duration-500">
      
      {/* Background Ornaments */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-100 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-100 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md relative">
        {/* Navigation / Back */}
        {!isSuccess && (
          <Link href="/financial" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-6 group">
            <ArrowLeft strokeWidth={2.5} className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Portal
          </Link>
        )}
        
        {/* Gateway Card */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-outline-variant/30 flex flex-col items-center relative overflow-hidden">
          
          {/* Decorative Corner Label */}
          <div className="absolute top-0 right-0 bg-slate-100 border-b border-l border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-3xl">
            {isSuccess ? 'Pembayaran Berhasil' : 'Gateway Aman'}
          </div>

          {!isSuccess ? (
            <>
              <div className="w-16 h-16 rounded-3xl bg-cyan-900 text-white flex items-center justify-center shadow-lg shadow-cyan-900/20 mb-4 animate-in slide-in-from-top-4 duration-500 delay-150 relative">
                 <div className="relative z-10 w-8 h-8 flex items-center justify-center">
                    {isProcessing ? <RefreshCw strokeWidth={2.5} className="w-6 h-6 animate-spin" /> : <QrCode strokeWidth={2.5} className="w-7 h-7" />}
                 </div>
              </div>
              
              <h1 className="font-headline text-2xl font-black text-slate-900 mb-1 text-center">
                {isProcessing ? 'Memproses Callback...' : 'Gateway Pembayaran'}
              </h1>
              <p className="text-sm text-slate-500 font-medium mb-8 text-center max-w-[250px]">
                {isProcessing ? 'Sistem sedang menerima konfirmasi otomatis dari bank.' : 'Pindai QR Code di bawah menggunakan aplikasi M-Banking atau e-Wallet.'}
              </p>
              
              {/* QR Code Container */}
              <div className={`relative group transition-opacity duration-300 ${isProcessing ? 'opacity-30' : ''}`}>
                <div className="absolute -inset-4 border-2 border-dashed border-slate-200 rounded-[2rem] group-hover:border-slate-400 transition-colors -z-10"></div>
                <div className="w-56 h-56 bg-white rounded-3xl shadow-lg border border-slate-100 flex items-center justify-center relative overflow-hidden p-3">
                  <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-1 opacity-80 mix-blend-multiply grayscale">
                    {[...Array(25)].map((_, i) => (
                      <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                    ))}
                    <div className="absolute top-3 left-3 w-12 h-12 border-4 border-slate-900 rounded-lg flex items-center justify-center bg-white"><div className="w-5 h-5 bg-slate-900 rounded-sm"></div></div>
                    <div className="absolute top-3 right-3 w-12 h-12 border-4 border-slate-900 rounded-lg flex items-center justify-center bg-white"><div className="w-5 h-5 bg-slate-900 rounded-sm"></div></div>
                    <div className="absolute bottom-3 left-3 w-12 h-12 border-4 border-slate-900 rounded-lg flex items-center justify-center bg-white"><div className="w-5 h-5 bg-slate-900 rounded-sm"></div></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
                     <span className="font-extrabold text-red-600 text-[10px] tracking-tight">QRIS</span>
                     <span className="font-bold text-sky-800 text-[10px] tracking-tight ml-0.5">PAY</span>
                  </div>
                  {!isProcessing && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-900 opacity-20 blur-[2px] animate-[scan_3s_ease-in-out_infinite]"></div>
                  )}
                </div>
              </div>
              
              {/* Nominal Details */}
              <div className="w-full mt-10 p-5 bg-slate-50 rounded-3xl border border-slate-100 animate-in slide-in-from-bottom-4 duration-500 delay-300">
                <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-500">Tagihan Iuran (April)</span>
                      <span className="text-[10px] font-black text-slate-900 mt-1 uppercase tracking-widest">Rp 150.000</span>
                    </div>
                    <button 
                      onClick={initiateMidtransPayment}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? 'Memproses...' : 'Bayar via Snap'}
                    </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-6 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-6">
                  <CheckCircle2 strokeWidth={2.5} className="w-12 h-12" />
               </div>
               <h2 className="font-headline text-3xl font-black text-slate-900 mb-2">Terima Kasih!</h2>
               <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl mb-8 text-center">
                  <p className="text-emerald-800 text-sm font-bold leading-relaxed">
                    Sistem sudah menerima <span className="underline decoration-2-transparent font-black">API Callback</span> otomatis dari Bank. Tagihan Anda kini berstatus <span className="font-black uppercase tracking-widest bg-emerald-600 text-white px-2 py-0.5 rounded ml-1">Lunas</span> secara real-time.
                  </p>
                  <p className="text-emerald-600/70 text-xs mt-4 font-semibold italic">
                    Mutasi kas Bendahara & Buku Umum telah diperbarui otomatis.
                  </p>
               </div>
               <div className="flex flex-col gap-3 w-full">
                  <Link href="/financial" className="w-full py-4 bg-cyan-900 text-white hover:bg-cyan-800 rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 shadow-sm transition-colors">
                     <Receipt strokeWidth={2.5} className="w-5 h-5" /> Lihat Kwitansi Digital
                  </Link>
                  <Link href="/dashboard" className="w-full py-4 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-colors">
                     Kembali ke Beranda
                  </Link>
               </div>
            </div>
          )}

        </div>

        {/* Support actions */}
        {!isSuccess && (
          <div className="mt-8 flex justify-center gap-6">
              <button className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download strokeWidth={2.5} className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Simpan QR</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HelpCircle strokeWidth={2.5} className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">Bantuan</span>
              </button>
          </div>
        )}
        
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(14rem); }
        }
      `}} />
    </div>
  );
}
