'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Check, Loader2, Info } from 'lucide-react';
import { financialService } from '@/lib/services/financial-service';

interface ManageIuranModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ManageIuranModal({ onClose, onSuccess }: ManageIuranModalProps) {
  const [iurans, setIurans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [newIuran, setNewIuran] = useState({
    nama: '',
    nominal: '',
    periode: 'BULANAN'
  });

  const [editForm, setEditForm] = useState({
    nama: '',
    nominal: '',
    periode: 'BULANAN'
  });

  const fetchIurans = async () => {
    setIsLoading(true);
    try {
      const data = await financialService.getIuranMaster();
      setIurans(data);
    } catch (error) {
      console.error('Failed to fetch iurans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIurans();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIuran.nama || !newIuran.nominal) return;
    
    setIsSubmitting(true);
    try {
      await financialService.createIuranMaster({
        nama: newIuran.nama,
        nominal: parseFloat(newIuran.nominal),
        periode: newIuran.periode
      });
      setNewIuran({ nama: '', nominal: '', periode: 'BULANAN' });
      fetchIurans();
      onSuccess();
    } catch (error) {
      alert('Gagal menambah iuran');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus referensi iuran ini?')) return;
    try {
      await financialService.deleteIuranMaster(id);
      fetchIurans();
      onSuccess();
    } catch (error) {
      alert('Gagal menghapus iuran');
    }
  };

  const startEdit = (iuran: any) => {
    setEditingId(iuran.id);
    setEditForm({
      nama: iuran.nama,
      nominal: String(iuran.nominal),
      periode: iuran.periode
    });
  };

  const handleUpdate = async (id: number) => {
    setIsSubmitting(true);
    try {
      await financialService.updateIuranMaster(id, {
        nama: editForm.nama,
        nominal: parseFloat(editForm.nominal),
        periode: editForm.periode
      });
      setEditingId(null);
      fetchIurans();
      onSuccess();
    } catch (error) {
      alert('Gagal mengupdate iuran');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Kelola Referensi Iuran</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Master Data Jenis Iuran Warga</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-slate-400 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200 shadow-sm">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh]">
          {/* Add Form */}
          <form onSubmit={handleAdd} className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Iuran</label>
              <input 
                type="text" 
                placeholder="Contoh: Keamanan"
                value={newIuran.nama}
                onChange={e => setNewIuran({...newIuran, nama: e.target.value})}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div className="w-32 space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nominal</label>
              <input 
                type="number" 
                placeholder="0"
                value={newIuran.nominal}
                onChange={e => setNewIuran({...newIuran, nominal: e.target.value})}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
              />
            </div>
            <button 
              disabled={isSubmitting || !newIuran.nama || !newIuran.nominal}
              className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-slate-900/20 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Tambah
            </button>
          </form>

          {/* List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>
            ) : iurans.length === 0 ? (
              <div className="text-center py-12 px-6 border-2 border-dashed border-slate-100 rounded-[2rem]">
                <Info className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-400">Belum ada data referensi iuran</p>
              </div>
            ) : iurans.map((iuran) => (
              <div key={iuran.id} className="group p-5 bg-white border border-slate-100 rounded-[1.75rem] hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all flex items-center justify-between">
                {editingId === iuran.id ? (
                  <div className="flex-1 flex gap-3 items-center">
                    <input 
                      type="text" 
                      value={editForm.nama}
                      onChange={e => setEditForm({...editForm, nama: e.target.value})}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold"
                    />
                    <input 
                      type="number" 
                      value={editForm.nominal}
                      onChange={e => setEditForm({...editForm, nominal: e.target.value})}
                      className="w-28 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold"
                    />
                    <button onClick={() => handleUpdate(iuran.id)} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors">
                      <Check size={18} strokeWidth={3} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-colors">
                      <X size={18} strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm group-hover:scale-110 transition-transform">
                        <Info size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm tracking-tight">{iuran.nama}</h4>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(iuran.nominal)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(iuran)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200 shadow-sm">
                        <Edit2 size={16} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => handleDelete(iuran.id)} className="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all border border-transparent hover:border-rose-200 shadow-sm">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-8 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
