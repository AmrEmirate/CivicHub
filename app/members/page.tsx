'use client';

import { useState, useEffect } from 'react';
import { memberService } from '@/lib/services/member-service';
import { Member, MembersStats } from '@/lib/types/member';
import MembersTable from '@/components/members/members-table';
import AddMemberModal from '@/components/members/add-member-modal';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MembersStats | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'semua' | 'milik' | 'sewa'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [membersData, statsData] = await Promise.all([
          memberService.getMembers({ page: currentPage, limit: 20 }),
          memberService.getMembersStats(),
        ]);
        
        let filtered = membersData.data;
        if (filterStatus === 'milik') {
          filtered = filtered.filter(m => m.ownershipStatus === 'milik');
        } else if (filterStatus === 'sewa') {
          filtered = filtered.filter(m => m.ownershipStatus === 'sewa');
        }

        if (searchQuery) {
          filtered = filtered.filter(m => 
            m.familyHeadName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (m.kkNumber && m.kkNumber.includes(searchQuery))
          );
        }
        
        setMembers(filtered);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentPage, filterStatus, searchQuery]);

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header & Breadcrumbs section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <span className="material-symbols-outlined text-[16px]">folder_open</span>
            <span>Database</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary">Warga</span>
          </div>
          <div>
            <h1 className="font-headline text-3xl font-extrabold text-cyan-950 dark:text-cyan-50 tracking-tight">Manajemen Data Warga</h1>
            <p className="font-inter text-slate-500 text-sm mt-1 max-w-lg">Sistem informasi kependudukan. Harap verifikasi data mutasi warga secara berkala.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center shadow-sm">
            <span className="material-symbols-outlined mr-2 text-[18px]">download</span> Export Data
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-2.5 primary-gradient rounded-xl font-bold text-sm text-white shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center"
          >
            <span className="material-symbols-outlined mr-2 text-[18px]">person_add</span> Tambah Warga
          </button>
        </div>
      </div>

      {/* Bento Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-6 rounded-3xl custom-shadow border border-outline-variant/30 flex flex-col justify-between group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-100/50 text-cyan-700 flex items-center justify-center mb-6 group-hover:bg-cyan-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">home_work</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Total K. Keluarga</p>
              <h3 className="font-headline text-3xl font-black text-cyan-950 dark:text-cyan-50 flex items-end gap-2">
                {stats.totalKK} <span className="text-sm font-bold text-emerald-500 mb-1">+2%</span>
              </h3>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl custom-shadow border border-outline-variant/30 flex flex-col justify-between group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100/50 text-indigo-700 flex items-center justify-center mb-6 group-hover:bg-indigo-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Jiwa Warga</p>
              <h3 className="font-headline text-3xl font-black text-cyan-950 dark:text-cyan-50">
                {stats.totalWarga}
              </h3>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border-2 border-emerald-500 bg-emerald-50/30 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-emerald-500/30">
              <span className="material-symbols-outlined text-2xl">real_estate_agent</span>
            </div>
            <div className="relative z-10">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Hunian Milik Pribadi</p>
              <h3 className="font-headline text-3xl font-black text-emerald-950 flex items-center gap-2">
                {stats.hunianMilik}
              </h3>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl custom-shadow border border-outline-variant/30 flex flex-col justify-between group">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/50 text-amber-700 flex items-center justify-center mb-6 group-hover:bg-amber-100 transition-colors">
              <span className="material-symbols-outlined text-2xl">key</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Sewa / Kontrak</p>
              <h3 className="font-headline text-3xl font-black text-amber-950">
                {stats.hunianSewa}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Area */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col mt-4">
        
        {/* Table Toolbar */}
        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="w-full md:w-96 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Cari nama atau No. KK..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-medium focus:border-cyan-500 focus:ring-0 transition-colors"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value as any); setCurrentPage(1); }}
              className="px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 focus:border-cyan-500 focus:ring-0 outline-none w-full md:w-48 appearance-none"
            >
              <option value="semua">Semua Status</option>
              <option value="milik">Milik Pribadi</option>
              <option value="sewa">Sewa/Kontrak</option>
            </select>
            <button className="px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-slate-500 hover:text-cyan-700 hover:border-cyan-200 transition-colors flex items-center justify-center aspect-square">
              <span className="material-symbols-outlined">filter_list</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-cyan-200 border-t-cyan-700 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-inter text-sm md:text-base font-medium animate-pulse">Memuat data warga...</p>
            </div>
          ) : (
            <MembersTable members={members} />
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
}
