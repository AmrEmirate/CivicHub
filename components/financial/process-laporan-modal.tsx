'use client';

import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, MessageSquare, ShieldCheck, Loader2 } from 'lucide-react';
import { laporanService } from '@/lib/services/laporan-service';

interface ProcessLaporanModalProps {
  laporan: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProcessLaporanModal({ laporan, onClose, onSuccess }: ProcessLaporanModalProps) {
  const [komentar, setKomentar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (status: 'APPROVED' | 'REVISI') => {
    setIsSubmitting(true);
    try {
      await laporanService.approve(laporan.id, status, komentar);
      alert(`Laporan berhasil ${status === 'APPROVED' ? 'disetujui' : 'ditolak untuk revisi'}.`);
      onSuccess();
    } catch (err: any) {
      alert(`Gagal memproses: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-cyan-900 text-white flex items-center justify-center shadow-lg shadow-cyan-900/20">
                <ShieldCheck strokeWidth={2.5} className="w-6 h-6" />
             </div>
             <div>
                <h2 className="font-headline font-bold text-xl text-slate-900">Validasi Laporan</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Tinjauan akhir oleh Ketua RT</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
             <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Detail Laporan</label>
             <h3 className="font-bold text-slate-800 text-lg">{laporan.title}</h3>
             <p className="text-xs text-slate-500 mt-1 font-medium">Diajukan oleh: <span className="text-slate-700 font-bold">{laporan.pembuat?.name}</span></p>
             {laporan.fileUrl && (
               <a 
                 href={laporan.fileUrl} 
                 target="_blank" 
                 className="inline-flex items-center gap-2 mt-4 text-xs font-bold text-cyan-700 hover:underline"
               >
                 <CheckCircle className="w-4 h-4" /> Lihat Dokumen Terlampir
               </a>
             )}
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Komentar / Catatan Revisi (Opsional)</label>
            <div className="relative">
               <textarea
                 value={komentar}
                 onChange={(e) => setKomentar(e.target.value)}
                 className="w-full px-6 py-4 rounded-3xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-700 focus:outline-none focus:border-cyan-600 focus:bg-white transition-all min-h-[120px] shadow-inner"
                 placeholder="Tulis alasan jika membutuhkan revisi atau catatan tambahan..."
               />
               <MessageSquare className="absolute right-6 top-4 w-5 h-5 text-slate-300" />
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleAction('REVISI')}
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 rounded-2xl bg-white border border-rose-200 text-rose-600 font-bold text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <AlertTriangle strokeWidth={2.5} className="w-4 h-4" /> Minta Revisi
          </button>
          <button
            onClick={() => handleAction('APPROVED')}
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 rounded-2xl bg-cyan-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-cyan-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle strokeWidth={2.5} className="w-4 h-4" />}
            Setujui Laporan
          </button>
        </div>
      </div>
    </div>
  );
}
