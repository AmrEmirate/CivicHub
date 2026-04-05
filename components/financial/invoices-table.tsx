'use client';

import { Invoice } from '@/lib/types/financial';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';

interface InvoicesTableProps {
  invoices: Invoice[];
}

export default function InvoicesTable({ invoices }: InvoicesTableProps) {
  return (
    <div className="glass-panel border-2 border-transparent rounded-[2rem] overflow-hidden mt-6 custom-shadow bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">No. Invoice</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Nama Warga</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Terbit</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Tagihan</th>
              <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10 transition-colors group">
                <td className="px-6 py-4">
                   <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded-md border border-cyan-100 dark:border-cyan-800">
                      {invoice.invoiceNumber}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <div className="font-bold text-slate-700 dark:text-slate-200">{invoice.memberName}</div>
                   <div className="text-[10px] text-slate-400 font-medium">Warga RT 01</div>
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium text-xs">{formatDate(invoice.issueDate)}</td>
                <td className="px-6 py-4 text-right font-black text-cyan-950 dark:text-cyan-50">
                   {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    invoice.status === 'lunas'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800'
                      : invoice.status === 'tunggakan'
                      ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'
                      : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {invoice.status === 'lunas' ? 'Lunas' : invoice.status === 'tunggakan' ? 'Tunggakan' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-cyan-600 rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700" title="Detail">
                      <span className="material-symbols-outlined text-[20px]">visibility</span>
                    </button>
                    <button className="p-2 hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700" title="Cetak">
                      <span className="material-symbols-outlined text-[20px]">print</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {invoices.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-200 dark:text-slate-700">
             <span className="material-symbols-outlined text-[48px]">receipt_long</span>
          </div>
          <p className="text-slate-400 font-bold text-sm tracking-wide">Belum ada invoice yang diterbitkan</p>
        </div>
      )}
    </div>
  );
}
