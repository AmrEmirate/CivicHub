'use client';

import { Member } from '@/lib/types/member';
import { PencilLine, Trash2, Users } from 'lucide-react';

interface MembersTableProps {
  members: Member[];
}

export default function MembersTable({ members }: MembersTableProps) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container/50 border-b border-outline-variant/20 text-[10px] uppercase text-outline font-bold tracking-widest">
              <th className="px-6 py-5">Keluarga</th>
              <th className="px-6 py-5">Kontak & Alamat</th>
              <th className="px-6 py-5 text-center">Anggota</th>
              <th className="px-6 py-5">Status & Kepemilikan</th>
              <th className="px-6 py-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-primary/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black font-headline text-lg group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                      {(member.familyHeadName || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm tracking-tight mb-0.5">{member.familyHeadName}</h4>
                      <p className="text-xs text-outline font-mono font-medium">{(member.kkNumber || '').substring(0, 16)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-on-surface-variant">{member.phoneNumber || '-'}</p>
                  <p className="text-xs text-outline mt-1 font-medium truncate max-w-[200px]">
                    {member.address} No. {member.houseNumber}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-xl bg-surface-container-high text-on-surface font-black text-sm border border-outline-variant/30">
                    {member.totalFamilyMembers}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2 items-start">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                      member.status === 'aktif'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : member.status === 'nonaktif'
                        ? 'bg-error-container text-on-error-container border-error/20'
                        : 'bg-surface-container text-outline border-outline-variant/30'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                      {member.status === 'aktif' ? 'Aktif' : member.status === 'nonaktif' ? 'Nonaktif' : 'Pindah'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                      member.ownershipStatus === 'milik'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {member.ownershipStatus === 'milik' ? 'Milik Pribadi' : 'Sewa / Kontrak'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2.5 border border-outline-variant/30 hover:bg-cyan-50 hover:border-cyan-200 text-cyan-700 rounded-xl transition-colors shadow-sm" title="Edit Data">
                      <PencilLine strokeWidth={2.5} className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 border border-outline-variant/30 hover:bg-error-container hover:border-error/20 text-error rounded-xl transition-colors shadow-sm" title="Hapus Data">
                      <Trash2 strokeWidth={2.5} className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {members.length === 0 && (
        <div className="text-center py-24 px-4 flex flex-col items-center">
          <div className="w-20 h-20 bg-surface-container rounded-3xl flex items-center justify-center mb-6 border border-outline-variant/30 shadow-sm">
            <Users strokeWidth={2} className="w-10 h-10 text-outline" />
          </div>
          <h3 className="text-xl font-headline font-black text-on-surface mb-2">Data Tidak Ditemukan</h3>
          <p className="text-sm font-medium text-outline max-w-sm">Kami tidak dapat menemukan data warga dengan kondisi dan filter yang Anda berikan.</p>
        </div>
      )}
    </div>
  );
}
