import { UserRole } from '@/lib/types/common';

export const ROLE_LABELS: Record<UserRole, string> = {
  rt: 'RT / Ketua',
  wakil_rt: 'Wakil RT',
  sekretaris: 'Sekretaris',
  bendahara: 'Bendahara',
  warga: 'Warga / Penduduk',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  rt: 'Akses penuh untuk pemantauan seluruh modul sistem (Poin 1-10)',
  wakil_rt: 'Akses penuh sebagai pengawasan operasional bersama Ketua RT',
  sekretaris: 'Wewenang spesifik manajemen data kependudukan (Fitur 1)',
  bendahara: 'Wewenang modul transaksional dan pelaporan (Fitur 2, 3, 6, 7, 8)',
  warga: 'Melihat tagihan pribadi, pembayaran mandiri, dan notifikasi',
};

// Modul access strictly based on Topik 15 RBAC Matrix
export const MODULE_ACCESS: Record<UserRole, string[]> = {
  rt: ['dashboard', 'members', 'financial', 'documents', 'announcements', 'settings'],
  wakil_rt: ['dashboard', 'members', 'financial', 'documents', 'announcements', 'settings'],
  sekretaris: ['dashboard', 'members', 'announcements'],
  bendahara: ['dashboard', 'financial', 'documents'], // Documents for reports (Fitur 8)
  warga: ['dashboard', 'financial', 'announcements'], // Financial for personal billing (Fitur 4)
};

export const SIDEBAR_MODULES = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: 'dashboard', 
    roles: ['rt', 'wakil_rt', 'sekretaris', 'bendahara', 'warga'] 
  },
  { 
    id: 'members', 
    label: 'Data Kependudukan', 
    icon: 'badge', 
    roles: ['rt', 'wakil_rt', 'sekretaris'] 
  },
  { 
    id: 'financial', 
    label: 'Kas & Keuangan', 
    icon: 'account_balance_wallet', 
    roles: ['rt', 'wakil_rt', 'bendahara', 'warga'] 
  },
  { 
    id: 'documents', 
    label: 'Laporan & LPJ', 
    icon: 'summarize', 
    roles: ['rt', 'wakil_rt', 'bendahara'] 
  },
  { 
    id: 'announcements', 
    label: 'Pengumuman', 
    icon: 'campaign', 
    roles: ['rt', 'wakil_rt', 'sekretaris', 'bendahara', 'warga'] 
  },
];
