'use client';

import { useState, useEffect } from 'react';
import { 
  FolderOpen, ChevronRight, UploadCloud, FileText, AlertTriangle, 
  Mail, ClipboardList, Download, Trash2, FolderMinus, FileArchive,
  Loader2
} from 'lucide-react';
import { documentService, Document } from '@/lib/services/document-service';
import UploadDocumentModal from '@/components/documents/upload-document-modal';

const documentTypes = [
  { id: 'lpj', label: 'Laporan Pertanggungjawaban (LPJ)', icon: FileText },
  { id: 'surat', label: 'Surat Keterangan', icon: Mail },
  { id: 'notulen', label: 'Notulen Rapat', icon: ClipboardList },
  { id: 'info', label: 'Informasi Umum', icon: AlertTriangle },
];

export default function DocumentsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      try {
        const data = await documentService.getAll(selectedType || undefined);
        setDocuments(data);
      } catch (error) {
        console.error('Failed to fetch documents:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, [selectedType, refreshKey]);

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus dokumen ini secara permanen?')) return;
    try {
      await documentService.delete(id);
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      alert('Gagal menghapus: ' + error.message);
    }
  };

  const getDocIcon = (type: string) => {
    const found = documentTypes.find(t => t.id === type);
    return found ? found.icon : FileArchive;
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <FolderOpen strokeWidth={2.5} className="w-4 h-4" />
            <span>Administrasi</span>
            <ChevronRight strokeWidth={3} className="w-3 h-3" />
            <span className="text-slate-600">Arsip Surat & Laporan</span>
          </div>
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">Dokumen & Laporan</h1>
            <p className="font-inter text-slate-500 text-sm mt-1 max-w-lg">Penyimpanan arsip digital administrasi RT untuk mendukung transparansi.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-2.5 bg-cyan-900 hover:bg-cyan-800 rounded-xl font-bold text-sm text-white shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center shrink-0"
        >
          <UploadCloud strokeWidth={2.5} className="w-5 h-5 mr-2" /> Unggah Dokumen
        </button>
      </div>

      {/* Document Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {documentTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
            className={`bg-white border rounded-3xl p-6 text-left transition-all hover:-translate-y-1 ${
              selectedType === type.id
                ? 'border-cyan-200 bg-cyan-50 shadow-md shadow-cyan-900/5'
                : 'border-outline-variant/30 hover:border-cyan-300 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors border ${
                selectedType === type.id 
                  ? 'bg-cyan-900 text-white border-cyan-900 shadow-sm' 
                  : 'bg-slate-50 text-slate-500 border-slate-100 group-hover:text-cyan-600'
              }`}>
                <type.icon strokeWidth={2} className="w-6 h-6" />
              </div>
              <span className="bg-white border border-slate-200 text-slate-600 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-sm">
                {documents.filter(d => d.type === type.id).length} File
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">{type.label}</h3>
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="mt-4">
        <h2 className="font-headline font-bold text-xl text-cyan-950 mb-4 flex items-center gap-2">
          <FileText strokeWidth={2.5} className="w-6 h-6 text-cyan-600" />
          {selectedType ? `${documentTypes.find(t => t.id === selectedType)?.label}` : 'Semua Dokumen'}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-600" />
          </div>
        ) : documents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const Icon = getDocIcon(doc.type);
              return (
                <div key={doc.id} className="bg-white border border-outline-variant/30 hover:border-slate-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4 flex-1 min-w-0 flex-row">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 border border-orange-100 group-hover:scale-105 transition-transform">
                      <Icon strokeWidth={2} className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-700 truncate text-sm">{doc.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-1.5">
                        <span className="font-semibold">{doc.author?.name}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{new Date(doc.createdAt).toLocaleDateString('id-ID')}</span>
                        {doc.size && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="uppercase font-mono text-[10px] tracking-wider bg-slate-50 px-1.5 rounded text-slate-400 border border-slate-100">{doc.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={doc.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-xl transition-colors" 
                      title="Unduh/Lihat File"
                    >
                      <Download strokeWidth={2.5} className="w-5 h-5" />
                    </a>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors" 
                      title="Hapus Dokumen"
                    >
                      <Trash2 strokeWidth={2.5} className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 mt-4 text-center border-2 border-dashed border-slate-200 shadow-sm">
            <div className="w-20 h-20 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <FolderMinus strokeWidth={1.5} className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Folder Kosong</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">Tidak ada file yang ditemukan dalam direktori ini.</p>
          </div>
        )}
      </div>

      {showUploadModal && (
        <UploadDocumentModal 
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
}
