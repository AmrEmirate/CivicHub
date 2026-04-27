'use client';

import { useState, useEffect } from 'react';
import { memberService } from '@/lib/services/member-service';
import { Member, MembersStats } from '@/lib/types/member';
import MembersTable from '@/components/members/members-table';
import AddMemberModal from '@/components/members/add-member-modal';
import { 
  FolderOpen, ChevronRight, Download, UserPlus, 
  Home, Users, Building, Key, Search, Filter 
} from 'lucide-react';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MembersStats | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'semua' | 'milik' | 'sewa'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [membersData, statsData] = await Promise.all([
          memberService.getMembers({ page: currentPage, limit: 20, search: searchQuery, status: filterStatus }),
          memberService.getMembersStats(),
        ]);
        
        setMembers(membersData.data);
        setStats(statsData);
      } catch (error) {
        console.error('Error loading members:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentPage, filterStatus, searchQuery, refreshKey]);

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Header & Breadcrumbs section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-outline">
            <FolderOpen strokeWidth={2.5} className="w-4 h-4" />
            <span>Database</span>
            <ChevronRight strokeWidth={3} className="w-3 h-3" />
            <span className="text-secondary">Warga</span>
          </div>
          <div>
            <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">Manajemen Warga</h1>
            <p className="font-inter text-outline text-sm mt-2 max-w-lg font-medium leading-relaxed">Sistem informasi kependudukan CivicHub. Pantau mutasi dan detail demografi warga dengan mudah.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-5 py-2.5 rounded-2xl border border-outline-variant/50 font-bold text-sm text-on-surface-variant bg-card hover:bg-surface-container active:scale-95 transition-all flex items-center shadow-sm">
            <Download strokeWidth={2.5} className="mr-2 w-4 h-4" /> Export Data
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-cyan-950 rounded-2xl font-bold text-sm text-white shadow-lg shadow-cyan-900/20 hover:bg-cyan-900 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center"
          >
            <UserPlus strokeWidth={2.5} className="mr-2 w-4 h-4 text-cyan-300" /> Tambah Warga
          </button>
        </div>
      </div>

      {/* Bento Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card p-6 rounded-3xl border border-outline-variant/30 flex flex-col justify-between group hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <Home strokeWidth={2.5} className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1.5">Total K. Keluarga</p>
              <h3 className="font-headline text-3xl font-black text-on-surface flex items-end gap-2 tracking-tight">
                {stats.totalKK} <span className="text-xs font-bold text-emerald-500 mb-1.5 bg-emerald-100 px-1.5 py-0.5 rounded">+2%</span>
              </h3>
            </div>
          </div>
          
          <div className="bg-card p-6 rounded-3xl border border-outline-variant/30 flex flex-col justify-between group hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <Users strokeWidth={2.5} className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1.5">Jiwa Warga</p>
              <h3 className="font-headline text-3xl font-black text-on-surface tracking-tight">
                {stats.totalWarga}
              </h3>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex flex-col justify-between relative overflow-hidden group hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
            <div className="absolute -right-4 -top-4 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <Building strokeWidth={2.5} className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1.5">Milik Pribadi</p>
              <h3 className="font-headline text-3xl font-black text-emerald-950 flex items-center gap-2 tracking-tight">
                {stats.hunianMilik}
              </h3>
            </div>
          </div>

          <div className="bg-card p-6 rounded-3xl border border-outline-variant/30 flex flex-col justify-between group hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
              <Key strokeWidth={2.5} className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-1.5">Sewa / Kontrak</p>
              <h3 className="font-headline text-3xl font-black text-on-surface tracking-tight">
                {stats.hunianSewa}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Area */}
      <div className="bg-card rounded-3xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col mt-4">
        
        {/* Table Toolbar */}
        <div className="p-4 md:p-6 border-b border-outline-variant/20 flex flex-col md:flex-row gap-4 items-center justify-between bg-card">
          <div className="w-full md:w-96 relative group">
            <Search strokeWidth={2.5} className="absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama atau No. KK..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-surface-container/50 border border-outline-variant/30 rounded-xl text-sm font-semibold focus:border-primary focus:bg-surface focus:ring-4 focus:ring-primary/10 transition-all outline-none placeholder:font-medium"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <select 
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value as any); setCurrentPage(1); }}
              className="px-4 py-3 bg-surface-container/50 border border-outline-variant/30 rounded-xl text-sm font-bold text-on-surface-variant focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none w-full md:w-48 appearance-none"
            >
              <option value="semua">Semua Status</option>
              <option value="milik">Milik Pribadi</option>
              <option value="sewa">Sewa/Kontrak</option>
            </select>
            <button className="px-4 py-3 bg-card border border-outline-variant/30 rounded-xl text-outline-variant hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center aspect-square shadow-sm">
              <Filter strokeWidth={2.5} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="w-full">
          {isLoading ? (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-cyan-200 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-outline font-inter text-sm font-medium animate-pulse">Menyelaraskan data warga...</p>
            </div>
          ) : (
            <MembersTable
              members={members}
              onRefresh={() => setRefreshKey(prev => prev + 1)}
            />
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <AddMemberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            setRefreshKey(prev => prev + 1); // re-trigger useEffect
          }}
        />
      )}
    </div>
  );
}
