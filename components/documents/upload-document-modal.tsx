'use client';

import React, { useState } from 'react';
import { X, UploadCloud, Loader2, FileText, Mail, ClipboardList, AlertTriangle } from 'lucide-react';
import { documentService } from '@/lib/services/document-service';

interface UploadDocumentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const docTypes = [
  { id: 'lpj', label: 'Laporan Pertanggungjawaban (LPJ)', icon: FileText },
  { id: 'surat', label: 'Surat Keterangan', icon: Mail },
  { id: 'notulen', label: 'Notulen Rapat', icon: ClipboardList },
  { id: 'info', label: 'Informasi Umum', icon: AlertTriangle },
];

export default function UploadDocumentModal({ onClose, onSuccess }: UploadDocumentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'lpj',
    fileUrl: '', // In real app, this would be from a file upload service
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl) {
      alert('Mohon isi judul dan URL file');
      return;
    }

    setIsSubmitting(true);
    try {
      await documentService.upload({
        ...formData,
        size: '1.2 MB' // Mock size for now
      });
      onSuccess();
    } catch (error: any) {
      alert(error.message || 'Gagal mengunggah dokumen');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Unggah Dokumen</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Arsip Digital Administrasi RT</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 shadow-sm">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Judul Dokumen</label>
            <input 
              type="text" 
              required
              placeholder="Contoh: Laporan Keuangan Agustus 2023"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-600 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Dokumen</label>
            <div className="grid grid-cols-2 gap-3">
              {docTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({...formData, type: type.id})}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                    formData.type === type.id
                      ? 'bg-cyan-50 border-cyan-200 text-cyan-900 shadow-sm'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <type.icon size={18} />
                  <span className="text-xs font-bold">{type.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tautan File (URL)</label>
            <div className="relative">
              <input 
                type="url" 
                required
                placeholder="https://example.com/file.pdf"
                value={formData.fileUrl}
                onChange={e => setFormData({...formData, fileUrl: e.target.value})}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-600 outline-none transition-all shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-lg border border-slate-100">
                <UploadCloud size={16} className="text-slate-400" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-2 px-1">Tip: Gunakan Google Drive atau layanan cloud storage lainnya.</p>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-cyan-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-900/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
              Unggah Sekarang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
