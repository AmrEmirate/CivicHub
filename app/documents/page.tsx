'use client';

import { useState } from 'react';
import { 
  FolderOpen, ChevronRight, UploadCloud, FileText, AlertTriangle, 
  Mail, ClipboardList, Download, Trash2, FolderMinus, FileArchive 
} from 'lucide-react';

const documentTypes = [
  { id: 'lpj', label: 'Laporan Pertanggungjawaban (LPJ)', icon: FileText, count: 3 },
  { id: 'tunggakan', label: 'Laporan Tunggakan', icon: AlertTriangle, count: 1 },
  { id: 'surat', label: 'Surat Keterangan', icon: Mail, count: 5 },
  { id: 'notulen', label: 'Notulen Rapat', icon: ClipboardList, count: 8 },
];

export default function DocumentsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]); // Menunggu endpoint BE untuk dokumen

  const filteredDocs = selectedType
    ? documents.filter(d => d.type === selectedType)
    : documents;

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <FolderOpen strokeWidth={2.5} className="w-4 h-4" />
            <span>Administrasi</span>
            <ChevronRight strokeWidth={3} className="w-3 h-3" />
            <span className="text-secondary">Arsip Surat & Laporan</span>
          </div>
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-cyan-950 dark:text-cyan-50 tracking-tight">Dokumen & Laporan</h1>
            <p className="font-inter text-slate-500 text-sm mt-1 max-w-lg">Penyimpanan arsip digital administrasi RT untuk mendukung transparansi.</p>
          </div>
        </div>
        <button className="px-6 py-2.5 primary-gradient rounded-xl font-bold text-sm text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center shrink-0">
          <UploadCloud strokeWidth={2.5} className="w-5 h-5 mr-2" /> Unggah Dokumen
        </button>
      </div>

      {/* Document Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {documentTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
            className={`glass-panel border-2 rounded-3xl p-6 text-left transition-all hover:-translate-y-1 ${
              selectedType === type.id
                ? 'border-primary bg-cyan-50/50 dark:bg-cyan-950/20 shadow-md shadow-primary/10'
                : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700 custom-shadow'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                selectedType === type.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                <type.icon strokeWidth={2} className="w-6 h-6" />
              </div>
              <span className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm">
                {type.count} File
              </span>
            </div>
            <h3 className="font-bold text-cyan-950 dark:text-cyan-50 text-sm leading-snug">{type.label}</h3>
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="mt-4">
        <h2 className="font-headline font-bold text-xl text-cyan-950 dark:text-cyan-50 mb-4 flex items-center gap-2">
          <FileText strokeWidth={2.5} className="w-6 h-6 text-cyan-600" />
          {selectedType ? `${documentTypes.find(t => t.id === selectedType)?.label}` : 'Semua Dokumen'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="glass-panel border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl p-5 hover:shadow-md transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4 flex-1 min-w-0 flex-row">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 border border-orange-100 dark:border-orange-800/50 group-hover:scale-105 transition-transform">
                  <FileArchive strokeWidth={2} className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 truncate text-sm">{doc.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1.5">
                    <span className="font-semibold">{doc.createdBy}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span>{new Date(doc.date).toLocaleDateString('id-ID')}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className="uppercase font-mono text-[10px] tracking-wider bg-slate-100 dark:bg-slate-800 px-1.5 rounded text-slate-400">{doc.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 text-slate-400 hover:text-cyan-600 rounded-xl transition-colors" title="Unduh File">
                  <Download strokeWidth={2.5} className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-600 rounded-xl transition-colors" title="Hapus Dokumen">
                  <Trash2 strokeWidth={2.5} className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="glass-panel rounded-3xl p-16 mt-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 mx-auto bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
               <FolderMinus strokeWidth={1.5} className="w-10 h-10 text-slate-300 dark:text-slate-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Folder Kosong</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">Tidak ada file yang ditemukan dalam direktori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
