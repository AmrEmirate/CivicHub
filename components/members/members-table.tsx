'use client';

import { Member } from '@/lib/types/member';

interface MembersTableProps {
  members: Member[];
}

export default function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase text-slate-400 font-semibold tracking-wider">
              <th className="px-6 py-4 font-semibold text-slate-500">Keluarga</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Kontak & Alamat</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-center">Anggota</th>
              <th className="px-6 py-4 font-semibold text-slate-500">Status & Kepemilikan</th>
              <th className="px-6 py-4 font-semibold text-slate-500 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-400 flex items-center justify-center font-bold font-headline select-none">
                      {(member.familyHeadName || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{member.familyHeadName}</h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{(member.kkNumber || '').substring(0, 16)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{member.phoneNumber || '-'}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[200px]">
                    {member.address} No. {member.houseNumber}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm">
                    {member.totalFamilyMembers}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2 items-start">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      member.status === 'aktif'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
                        : member.status === 'nonaktif'
                        ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800'
                        : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                      {member.status === 'aktif' ? 'Aktif' : member.status === 'nonaktif' ? 'Nonaktif' : 'Pindah'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      member.ownershipStatus === 'milik'
                        ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                        : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                    }`}>
                      {member.ownershipStatus === 'milik' ? 'Milik Pribadi' : 'Sewa / Kontrak'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-cyan-50 dark:hover:bg-cyan-900/30 text-cyan-600 rounded-xl transition-colors" title="Edit Data">
                      <span className="material-symbols-outlined text-[20px]">edit_document</span>
                    </button>
                    <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 rounded-xl transition-colors" title="Hapus Data">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {members.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-4xl text-slate-400">group_off</span>
          </div>
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">Data Tidak Ditemukan</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Kami tidak dapat menemukan data warga dengan filter yang Anda pilih saat ini.</p>
        </div>
      )}
    </div>
  );
}
