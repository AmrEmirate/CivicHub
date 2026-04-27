'use client';

import { useState } from 'react';
import { announcementService } from '@/lib/services/announcement-service';
import { CreateAnnouncementInput } from '@/lib/types/announcement';
import { X, AlertCircle, Send } from 'lucide-react';

interface AddAnnouncementModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddAnnouncementModal({ onClose, onSuccess }: AddAnnouncementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateAnnouncementInput>({
    title: '',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await announcementService.createAnnouncement(formData);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal membuat pengumuman. Silakan coba lagi.');
      console.error('Error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-headline text-2xl font-black text-cyan-950 dark:text-cyan-50">Buat Pengumuman Baru</h2>
            <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Informasi Lingkungan RT</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
          >
            <X strokeWidth={2.5} className="w-5 h-5" />
          </button>
        </div>

        {/* Form — action buttons di DALAM <form> agar type='submit' berfungsi */}
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden flex-1">
          {/* Content Area */}
          <div className="p-8 space-y-6 overflow-y-auto flex-1">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-2xl p-4 text-sm font-bold flex items-center gap-3">
                <AlertCircle strokeWidth={2.5} className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Judul Pengumuman</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Contoh: Rapat Rutin Warga & Kerja Bakti"
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold"
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Isi Pesan / Informasi</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Tuliskan detail pengumuman secara lengkap di sini..."
                rows={5}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-inter text-sm leading-relaxed"
                required
              />
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 px-1">Tag / Kategori (Opsional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Misal: Rapat, Sosial, Keamanan"
                    className="flex-1 px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-primary transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 font-bold text-sm text-cyan-700 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:border-cyan-200 transition-colors shrink-0"
                  >
                    Tambah
                  </button>
                </div>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 px-1">
                  {formData.tags.map((tag) => (
                    <div
                      key={tag}
                      className="bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/50 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 group transition-all"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-cyan-300 hover:text-rose-500 transition-colors"
                      >
                        <X strokeWidth={3} className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons — di dalam form agar type='submit' berfungsi */}
          <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 shrink-0 bg-slate-50/50 dark:bg-slate-800/20">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm"
            >
              Batalkan
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3.5 rounded-2xl primary-gradient text-white font-bold text-sm hover:translate-y-[-2px] disabled:opacity-50 disabled:translate-y-0 transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Send strokeWidth={2.5} className="w-4 h-4" />
              )}
              {isSubmitting ? 'Memproses...' : 'Terbitkan Pengumuman'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
