'use client';

import { ElementType } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon?: ElementType;
  color?: string;
  showProgress?: boolean;
  progressValue?: number;
}

export function StatCard({
  label,
  value,
  trend,
  icon,
  color = 'primary',
  showProgress,
  progressValue,
}: StatCardProps) {
  
  const getIconColor = () => {
    if (color === 'primary') return 'bg-cyan-50 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 border-cyan-100 dark:border-cyan-800';
    if (color === 'secondary') return 'bg-emerald-50 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800';
    if (color === 'tertiary') return 'bg-amber-50 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800';
    if (color === 'warning') return 'bg-rose-50 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800';
    if (color === 'success') return 'bg-emerald-50 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800';
    if (color === 'error') return 'bg-rose-50 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-800';
    return 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-100 dark:border-slate-700';
  };

  return (
    <div className="glass-panel p-6 rounded-[2rem] border-2 border-outline-variant hover:border-primary transition-all custom-shadow group flex flex-col justify-between min-h-[140px] relative overflow-hidden">
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-hover:text-slate-600">
            {label}
          </span>
          <h3 className="text-2xl md:text-3xl font-black font-headline text-on-surface tracking-tight">
            {value}
          </h3>
        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 group-hover:rotate-3 ${getIconColor()}`}>
          {icon ? (() => { 
            const Icon = icon;
            return <Icon strokeWidth={2.5} className="w-6 h-6" />; 
          })() : <BarChart3 strokeWidth={2.5} className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 relative z-10">
        {showProgress ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Target Tercapai</span>
              <span className="text-cyan-600">{progressValue}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50 p-[1px]">
              <div
                className="h-full transition-all primary-gradient rounded-full shadow-sm"
                style={{ width: `${progressValue}%` }}
              ></div>
            </div>
          </div>
        ) : trend ? (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
              trend.startsWith('+') 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800' 
                : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'
            }`}>
              {trend.startsWith('+') ? <TrendingUp strokeWidth={2.5} className="w-3.5 h-3.5" /> : <TrendingDown strokeWidth={2.5} className="w-3.5 h-3.5" />}
              {trend}
            </div>
            <span className="text-[10px] font-bold text-on-surface/50 transition-opacity opacity-0 group-hover:opacity-100 uppercase tracking-tighter">vs Bulan Lalu</span>
          </div>
        ) : null}
      </div>

      {/* Removed Background Glow for better clarity */}
    </div>
  );
}
