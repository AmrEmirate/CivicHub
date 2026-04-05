'use client';

import { useState, useEffect } from 'react';
import { announcementService } from '@/lib/services/announcement-service';
import { Announcement } from '@/lib/types/announcement';
import AddAnnouncementModal from '@/components/announcements/add-announcement-modal';
import { formatDateTime } from '@/lib/utils/formatters';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

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
            <span className="material-symbols-outlined text-[16px]">campaign</span>
            <span>Komunikasi</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary">Pengumuman</span>
          </div>
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-cyan-950 dark:text-cyan-50 tracking-tight">Pusat Informasi RT</h1>
            <p className="font-inter text-slate-500 text-sm mt-1 max-w-lg">Kelola penyebaran informasi, rapat warga, dan woro-woro lingkungan.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 primary-gradient rounded-xl font-bold text-sm text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center shrink-0"
        >
          <span className="material-symbols-outlined mr-2 text-[18px]">add_circle</span> Buat Pengumuman
        </button>
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="flex w-full h-[40vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-700 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-inter text-sm font-medium animate-pulse">Memuat Data...</p>
          </div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center mt-4">
          <div className="w-24 h-24 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-slate-400">notifications_off</span>
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Belum Ada Informasi</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Anda belum membuat pengumuman apapun. Buat pengumuman pertama Anda sekarang.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className={`glass-panel border-2 rounded-3xl p-6 custom-shadow relative flex flex-col justify-between group transition-all hover:-translate-y-1 ${
                announcement.isPinned 
                  ? 'border-primary/50 bg-cyan-50/30 dark:bg-cyan-950/10 shadow-primary/5' 
                  : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {announcement.isPinned ? (
                      <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 shrink-0">
                         <span className="material-symbols-outlined text-[20px]">push_pin</span>
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                         <span className="material-symbols-outlined text-[20px]">feed</span>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-cyan-950 dark:text-cyan-50 line-clamp-2 leading-tight">
                      {announcement.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-4 leading-relaxed font-inter">
                  {announcement.content}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                  {announcement.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-col">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Diterbitkan</span>
                   <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{formatDateTime(announcement.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleTogglePin(announcement.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      announcement.isPinned
                        ? 'bg-primary-container text-on-primary-container'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-primary'
                    }`}
                    title={announcement.isPinned ? 'Lepas Sematan' : 'Sematkan'}
                  >
                    <span className="material-symbols-outlined text-[18px]">push_pin</span>
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                    title="Hapus"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Announcement Modal */}
      {showAddModal && (
        <AddAnnouncementModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            window.location.reload(); // Simple refresh for now
          }}
        />
      )}
    </div>
  );
}
