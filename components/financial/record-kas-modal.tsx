'use client';

import { useState } from 'react';
import { financialService } from '@/lib/services/financial-service';
import { X, AlertCircle, TrendingDown, TrendingUp, Save } from 'lucide-react';

interface RecordKasModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const kategoriPemasukan = ['Iuran Warga', 'Retribusi', 'Sumbangan', 'Dana Desa', 'Lainnya'];
const kategoriPengeluaran = ['Operasional', 'Kebersihan', 'Keamanan', 'Perawatan Fasilitas', 'Acara RT', 'Alat Tulis', 'Lainnya'];

export default function RecordKasModal({ onClose, onSuccess }: RecordKasModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    jenis: 'PEMASUKAN' as 'PEMASUKAN' | 'PENGELUARAN',
    kategori: '',
    keterangan: '',
    nominal: '',
  });

  const kategoriOptions = formData.jenis === 'PEMASUKAN' ? kategoriPemasukan : kategoriPengeluaran;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kategori) {
      setError('Pilih kategori terlebih dahulu.');
      return;
    }
    if (!formData.nominal || parseFloat(formData.nominal) <= 0) {
      setError('Nominal harus lebih dari 0.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await financialService.recordKas({
        jenis: formData.jenis,
        kategori: formData.kategori,
        keterangan: formData.keterangan || formData.kategori,
        nominal: parseFloat(formData.nominal),
      });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal mencatat kas. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-headline text-2xl font-black text-cyan-950">Catat Kas Harian</h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Rekam Mutasi Kas Umum RT</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <X strokeWidth={2.5} className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-8 space-y-5">
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-4 text-sm font-bold flex items-center gap-3">
                <AlertCircle strokeWidth={2.5} className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            {/* Jenis Kas — Pemasukan vs Pengeluaran */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Jenis Mutasi</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input type="radio" name="jenis" value="PEMASUKAN" className="sr-only"
                    checked={formData.jenis === 'PEMASUKAN'}
                    onChange={() => setFormData(p => ({ ...p, jenis: 'PEMASUKAN', kategori: '' }))} />
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    formData.jenis === 'PEMASUKAN'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}>
                    <TrendingUp strokeWidth={2.5} className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm">Pemasukan</span>
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input type="radio" name="jenis" value="PENGELUARAN" className="sr-only"
                    checked={formData.jenis === 'PENGELUARAN'}
                    onChange={() => setFormData(p => ({ ...p, jenis: 'PENGELUARAN', kategori: '' }))} />
                  <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    formData.jenis === 'PENGELUARAN'
                      ? 'border-rose-500 bg-rose-50 text-rose-700'
                      : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                  }`}>
                    <TrendingDown strokeWidth={2.5} className="w-5 h-5 shrink-0" />
                    <span className="font-bold text-sm">Pengeluaran</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Kategori */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Kategori</label>
              <select
                value={formData.kategori}
                onChange={e => setFormData(p => ({ ...p, kategori: e.target.value }))}
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm focus:outline-none focus:border-primary transition-all"
                required
              >
                <option value="">-- Pilih Kategori --</option>
                {kategoriOptions.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Keterangan */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Keterangan <span className="font-normal normal-case">(opsional)</span></label>
              <input
                type="text"
                value={formData.keterangan}
                onChange={e => setFormData(p => ({ ...p, keterangan: e.target.value }))}
                placeholder="Deskripsi singkat transaksi..."
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-bold text-sm focus:outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Nominal */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Nominal (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                <input
                  type="number"
                  value={formData.nominal}
                  onChange={e => setFormData(p => ({ ...p, nominal: e.target.value }))}
                  placeholder="0"
                  min="1"
                  className="w-full pl-10 pr-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 font-black text-lg focus:outline-none focus:border-primary transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-8 py-6 border-t border-slate-100 flex gap-4 bg-slate-50/50 rounded-b-[2.5rem]">
            <button type="button" onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl bg-white border border-slate-200 text-slate-500 hover:text-slate-700 font-bold text-sm transition-all shadow-sm">
              Batal
            </button>
            <button type="submit" disabled={isSubmitting}
              className={`flex-1 px-6 py-4 rounded-2xl font-bold text-sm text-white shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${
                formData.jenis === 'PEMASUKAN'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}>
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save strokeWidth={2.5} className="w-5 h-5" />
              )}
              {isSubmitting ? 'Menyimpan...' : 'Catat Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
