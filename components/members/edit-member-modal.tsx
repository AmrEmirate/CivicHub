'use client';

import { useState } from 'react';
import { Member, UpdateMemberInput } from '@/lib/types/member';
import { memberService } from '@/lib/services/member-service';
import { X, Save, Loader2, User, Phone, Hash, Home, Users, Building2 } from 'lucide-react';

interface EditMemberModalProps {
  member: Member;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditMemberModal({ member, onClose, onSuccess }: EditMemberModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<UpdateMemberInput>({
    familyHeadName: member.familyHeadName,
    phoneNumber: member.phoneNumber || '',
    kkNumber: member.kkNumber || '',
    houseNumber: member.houseNumber || member.address || '',
    totalFamilyMembers: member.totalFamilyMembers || 1,
    ownershipStatus: member.ownershipStatus || 'milik',
  });

  const handleChange = (field: keyof UpdateMemberInput, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.familyHeadName.trim()) return setError('Nama kepala keluarga wajib diisi.');
    if (!form.kkNumber.trim()) return setError('Nomor KK wajib diisi.');

    setIsLoading(true);
    try {
      await memberService.updateMember(member.id, form);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan perubahan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-outline-variant/20 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-outline-variant/10">
          <div>
            <h2 className="font-headline text-xl font-extrabold text-on-surface">Edit Data Warga</h2>
            <p className="text-xs text-outline mt-0.5 font-medium">Perbarui informasi kependudukan</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-container rounded-xl transition-colors text-outline hover:text-on-surface"
          >
            <X strokeWidth={2.5} className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-5">

          {/* Nama KK */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-outline">
              <User strokeWidth={2.5} className="w-3.5 h-3.5 inline mr-1.5" />
              Nama Kepala Keluarga
            </label>
            <input
              type="text"
              value={form.familyHeadName}
              onChange={e => handleChange('familyHeadName', e.target.value)}
              className="w-full px-4 py-3 border border-outline-variant/40 rounded-xl text-sm font-semibold bg-white focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10 outline-none transition-all"
              placeholder="Nama lengkap kepala keluarga"
            />
          </div>

          {/* No Telepon */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-outline">
              <Phone strokeWidth={2.5} className="w-3.5 h-3.5 inline mr-1.5" />
              Nomor Telepon
            </label>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={e => handleChange('phoneNumber', e.target.value)}
              className="w-full px-4 py-3 border border-outline-variant/40 rounded-xl text-sm font-semibold bg-white focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10 outline-none transition-all"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          {/* No KK */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-outline">
              <Hash strokeWidth={2.5} className="w-3.5 h-3.5 inline mr-1.5" />
              Nomor KK
            </label>
            <input
              type="text"
              value={form.kkNumber}
              onChange={e => handleChange('kkNumber', e.target.value)}
              className="w-full px-4 py-3 border border-outline-variant/40 rounded-xl text-sm font-semibold font-mono bg-white focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10 outline-none transition-all"
              placeholder="16 digit nomor KK"
              maxLength={16}
            />
          </div>

          {/* No Rumah & Jumlah Anggota */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-outline">
                <Home strokeWidth={2.5} className="w-3.5 h-3.5 inline mr-1.5" />
                No. Rumah
              </label>
              <input
                type="text"
                value={form.houseNumber}
                onChange={e => handleChange('houseNumber', e.target.value)}
                className="w-full px-4 py-3 border border-outline-variant/40 rounded-xl text-sm font-semibold bg-white focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10 outline-none transition-all"
                placeholder="A-01"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-outline">
                <Users strokeWidth={2.5} className="w-3.5 h-3.5 inline mr-1.5" />
                Jumlah Anggota
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={form.totalFamilyMembers}
                onChange={e => handleChange('totalFamilyMembers', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 border border-outline-variant/40 rounded-xl text-sm font-semibold bg-white focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10 outline-none transition-all"
              />
            </div>
          </div>

          {/* Status Kepemilikan */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-outline">
              <Building2 strokeWidth={2.5} className="w-3.5 h-3.5 inline mr-1.5" />
              Status Kepemilikan
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['milik', 'sewa'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange('ownershipStatus', type)}
                  className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all ${
                    form.ownershipStatus === type
                      ? type === 'milik'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-outline-variant/30 text-outline hover:border-outline-variant'
                  }`}
                >
                  {type === 'milik' ? '🏠 Milik Pribadi' : '🔑 Sewa / Kontrak'}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-error bg-error-container/30 px-4 py-3 rounded-xl font-semibold border border-error/20">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-outline-variant/40 font-bold text-sm text-outline hover:bg-surface-container transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-cyan-900 hover:bg-cyan-800 font-bold text-sm text-white transition-all shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 strokeWidth={2.5} className="w-4 h-4 animate-spin" /> Menyimpan...</>
              ) : (
                <><Save strokeWidth={2.5} className="w-4 h-4" /> Simpan Perubahan</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
