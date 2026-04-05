'use client';

import { useState } from 'react';
import { memberService } from '@/lib/services/member-service';
import { CreateMemberInput } from '@/lib/types/member';

interface AddMemberModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddMemberModal({ onClose, onSuccess }: AddMemberModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateMemberInput>({
    kkNumber: '',
    familyHeadName: '',
    address: '',
    houseNumber: '',
    ownershipStatus: 'milik',
    totalFamilyMembers: 1,
    phoneNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalFamilyMembers' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await memberService.createMember(formData);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError('Gagal menambahkan data warga. Silakan coba lagi.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-headline text-2xl font-black text-cyan-950 dark:text-cyan-50">Registrasi Warga</h2>
            <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Pendataan Kepala Keluarga Baru</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-2xl p-4 text-sm font-bold flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">error</span>
              {error}
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 gap-5">
            {/* KK Number */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Nomor Kartu Keluarga (KK)</label>
                {formData.kkNumber.length === 16 && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span> Valid (16 Digit)
                  </span>
                )}
              </div>
              <div className="relative group">
                <input
                  type="text"
                  name="kkNumber"
                  maxLength={16}
                  value={formData.kkNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setFormData(prev => ({ ...prev, kkNumber: val }));
                  }}
                  placeholder="16 digit nomor KK"
                  className={`w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border transition-all font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    formData.kkNumber.length === 16 
                      ? 'border-emerald-500 ring-2 ring-emerald-500/10' 
                      : 'border-slate-100 dark:border-slate-800 focus:border-primary'
                  }`}
                  required
                />
                {formData.kkNumber.length > 0 && formData.kkNumber.length < 16 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                    {formData.kkNumber.length}/16
                  </span>
                )}
              </div>
            </div>

            {/* Family Head Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Nama Kepala Keluarga</label>
              <input
                type="text"
                name="familyHeadName"
                value={formData.familyHeadName}
                onChange={handleChange}
                placeholder="Nama lengkap sesuai KTP"
                className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Blok / Alamat</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Misal: Blok B"
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary transition-all font-bold text-sm"
                  required
                />
              </div>
              {/* House Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Nomor Rumah</label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  placeholder="No. 12"
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary transition-all font-bold text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Total Family Members */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Jumlah Anggota</label>
                <div className="relative">
                  <input
                    type="number"
                    name="totalFamilyMembers"
                    value={formData.totalFamilyMembers}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary transition-all font-bold text-sm"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">Orang</span>
                </div>
              </div>
              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">No. WhatsApp</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="0812..."
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-primary transition-all font-bold text-sm"
                  required
                />
              </div>
            </div>

            {/* Ownership Status */}
            <div className="space-y-3 pt-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Status Kepemilikan Rumah</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer group">
                  <input
                    type="radio"
                    name="ownershipStatus"
                    value="milik"
                    checked={formData.ownershipStatus === 'milik'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                    formData.ownershipStatus === 'milik'
                      ? 'border-primary bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 group-hover:border-slate-200'
                  }`}>
                    <span className="material-symbols-outlined">home</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Milik Sendiri</span>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer group">
                  <input
                    type="radio"
                    name="ownershipStatus"
                    value="sewa"
                    checked={formData.ownershipStatus === 'sewa'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center gap-1 ${
                    formData.ownershipStatus === 'sewa'
                      ? 'border-primary bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400'
                      : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 group-hover:border-slate-200'
                  }`}>
                    <span className="material-symbols-outlined">contract</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Sewa / Kontrak</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex gap-4 shrink-0 bg-slate-50/50 dark:bg-slate-800/20">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 font-bold text-sm transition-all shadow-sm"
          >
            Batal
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-4 rounded-2xl primary-gradient text-white font-bold text-sm hover:translate-y-[-2px] disabled:opacity-50 disabled:translate-y-0 transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            )}
            {isSubmitting ? 'Menyimpan...' : 'Simpan Data Warga'}
          </button>
        </div>
      </div>
    </div>
  );
}
