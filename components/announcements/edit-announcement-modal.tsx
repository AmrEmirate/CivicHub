'use client';

import { useState } from 'react';
import { Announcement, UpdateAnnouncementInput } from '@/lib/types/announcement';
import { announcementService } from '@/lib/services/announcement-service';
import { X, Save, Loader2, Megaphone, AlignLeft } from 'lucide-react';

interface EditAnnouncementModalProps {
  announcement: Announcement;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditAnnouncementModal({ announcement, onClose, onSuccess }: EditAnnouncementModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<UpdateAnnouncementInput>({
    title: announcement.title,
    content: announcement.content,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) return setError('Judul pengumuman wajib diisi.');
    if (!form.content?.trim()) return setError('Isi pengumuman wajib diisi.');

    setIsLoading(true);
    try {
      await announcementService.updateAnnouncement(announcement.id, form);
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
            <h2 className="font-headline text-xl font-extrabold text-on-surface">Edit Pengumuman</h2>
            <p className="text-xs text-outline mt-0.5 font-medium">Perbarui informasi pengumuman</p>
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

          {/* Judul */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-outline">
              <Megaphone strokeWidth={2.5} className="w-3.5 h-3.5 inline mr-1.5" />
              Judul Pengumuman
            </label>
            <input
              type="text"
              value={form.title || ''}
              onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setError(''); }}
              className="w-full px-4 py-3 border border-outline-variant/40 rounded-xl text-sm font-semibold bg-white focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10 outline-none transition-all"
              placeholder="Judul pengumuman yang jelas dan informatif"
            />
          </div>

          {/* Konten */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-outline">
              <AlignLeft strokeWidth={2.5} className="w-3.5 h-3.5 inline mr-1.5" />
              Isi Pengumuman
            </label>
            <textarea
              value={form.content || ''}
              onChange={e => { setForm(p => ({ ...p, content: e.target.value })); setError(''); }}
              rows={6}
              className="w-full px-4 py-3 border border-outline-variant/40 rounded-xl text-sm font-semibold bg-white focus:border-cyan-700 focus:ring-4 focus:ring-cyan-700/10 outline-none transition-all resize-none leading-relaxed"
              placeholder="Tulis isi pengumuman secara lengkap dan jelas..."
            />
            <p className="text-[10px] text-outline text-right">{(form.content || '').length} karakter</p>
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
