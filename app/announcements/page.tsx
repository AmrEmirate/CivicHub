'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import { announcementService } from '@/lib/services/announcement-service';
import { Announcement } from '@/lib/types/announcement';
import AddAnnouncementModal from '@/components/announcements/add-announcement-modal';
import { formatDateTime } from '@/lib/utils/formatters';
import { Megaphone, ChevronRight, PlusCircle, BellOff, Pin, FileText, Trash2 } from 'lucide-react';

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Hanya RT (super_admin → 'rt') dan Sekretaris yang bisa kelola pengumuman
  const canManage = user?.role === 'rt' || user?.role === 'sekretaris';

  useEffect(() => {
    const loadAnnouncements = async () => {
      setIsLoading(true);
      try {
        const data = await announcementService.getAnnouncements({ page: 1, limit: 20 });
        setAnnouncements(data.data);
      } catch (error) {
        console.error('Error loading announcements:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnnouncements();
  }, [refreshKey]);

  const handleTogglePin = async (id: string) => {
    try {
      await announcementService.togglePin(id);
      setAnnouncements(announcements.map(a => 
        a.id === id ? { ...a, isPinned: !a.isPinned } : a
      ));
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus pengumuman ini?')) {
      try {
        await announcementService.deleteAnnouncement(id);
        setAnnouncements(announcements.filter(a => a.id !== id));
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <Megaphone strokeWidth={2.5} className="w-4 h-4" />
            <span>Komunikasi</span>
            <ChevronRight strokeWidth={3} className="w-3 h-3" />
            <span className="text-slate-600">Pengumuman</span>
          </div>
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">Pusat Informasi RT</h1>
            <p className="font-inter text-slate-500 text-sm mt-1 max-w-lg">
              {canManage ? 'Kelola penyebaran informasi, rapat warga, dan woro-woro lingkungan.' : 'Informasi terkini seputar lingkungan RT Anda.'}
            </p>
          </div>
        </div>

        {/* Hanya Admin / Sekretaris yang bisa buat pengumuman */}
        {canManage && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 bg-cyan-900 hover:bg-cyan-800 rounded-xl font-bold text-sm text-white shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center shrink-0"
          >
            <PlusCircle strokeWidth={2.5} className="w-5 h-5 mr-2" /> Buat Pengumuman
          </button>
        )}
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="flex w-full h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-inter text-sm font-medium animate-pulse">Memuat Data...</p>
          </div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white border border-outline-variant/30 shadow-sm rounded-3xl p-16 text-center mt-4">
          <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <BellOff strokeWidth={2} className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Informasi</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            {canManage ? 'Buat pengumuman pertama untuk warga Anda.' : 'Belum ada pengumuman dari pengurus RT.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white border rounded-3xl p-6 shadow-sm relative flex flex-col justify-between group transition-all hover:shadow-md hover:-translate-y-1 ${
                announcement.isPinned 
                  ? 'border-emerald-200 bg-emerald-50/30' 
                  : 'border-outline-variant/30 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {announcement.isPinned ? (
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                         <Pin strokeWidth={2.5} className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0 border border-slate-100 group-hover:text-cyan-600 transition-colors">
                         <FileText strokeWidth={2} className="w-5 h-5" />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-cyan-950 line-clamp-2 leading-tight">
                      {announcement.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-6 line-clamp-4 leading-relaxed font-inter">
                  {announcement.content}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {announcement.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diterbitkan</span>
                   <span className="text-xs font-semibold text-slate-700">{formatDateTime(announcement.createdAt)}</span>
                </div>

                {/* Actions — hanya tampil untuk role yang bisa manage */}
                {canManage && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleTogglePin(announcement.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        announcement.isPinned
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                      }`}
                      title={announcement.isPinned ? 'Lepas Sematan' : 'Sematkan'}
                    >
                      <Pin strokeWidth={2.5} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                      title="Hapus"
                    >
                      <Trash2 strokeWidth={2.5} className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Announcement Modal — hanya accessible oleh admin */}
      {showAddModal && canManage && (
        <AddAnnouncementModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setRefreshKey(prev => prev + 1);
          }}
        />
      )}
    </div>
  );
}
