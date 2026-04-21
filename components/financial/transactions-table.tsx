'use client';

import { Transaction } from '@/lib/types/financial';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { ArrowDownLeft, ArrowUpRight, History } from 'lucide-react';

interface TransactionsTableProps {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="glass-panel border-2 border-transparent rounded-[2rem] overflow-hidden mt-6 custom-shadow bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Waktu & Tanggal</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Deskripsi Transaksi</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-center">Kategori</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Nominal</th>
              <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Oleh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-cyan-50/30 dark:hover:bg-cyan-900/10 transition-colors group">
                <td className="px-6 py-4">
                   <div className="font-bold text-slate-700 dark:text-slate-200 text-xs">{formatDate(transaction.date)}</div>
                   <div className="text-[10px] text-slate-400 font-medium">PKL 09:00 WIB</div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                         transaction.type === 'pemasukan' 
                           ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/20' 
                           : 'bg-rose-50 text-rose-500 dark:bg-rose-900/20'
                      }`}>
                         {transaction.type === 'pemasukan' 
                            ? <ArrowDownLeft strokeWidth={2.5} className="w-4 h-4" /> 
                            : <ArrowUpRight strokeWidth={2.5} className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-slate-600 dark:text-slate-300 text-sm line-clamp-1">{transaction.description}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-center">
                   <span className="inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {transaction.category}
                   </span>
                </td>
                <td className={`px-6 py-4 text-right font-black text-sm ${
                  transaction.type === 'pemasukan' ? 'text-emerald-500' : 'text-rose-500'
                }`}>
                  {transaction.type === 'pemasukan' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                   <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{transaction.createdBy || 'Sistem'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {transactions.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 text-slate-200 dark:text-slate-700">
             <History strokeWidth={2.5} className="w-8 h-8" />
          </div>
          <p className="text-slate-400 font-bold text-sm tracking-wide">Belum ada riwayat transaksi</p>
        </div>
      )}
    </div>
  );
}
