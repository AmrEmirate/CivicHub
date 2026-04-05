'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  icon?: string;
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
    if (color === 'primary') return 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 border-cyan-100 dark:border-cyan-800';
    if (color === 'secondary') return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
    if (color === 'tertiary') return 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800';
    if (color === 'warning') return 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800';
    if (color === 'success') return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
    if (color === 'error') return 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800';
    return 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700';
  };

  return (
    <div className="glass-panel p-6 rounded-[2rem] border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all custom-shadow group flex flex-col justify-between min-h-[140px] relative overflow-hidden">
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors group-hover:text-slate-500">
            {label}
          </span>
          <h3 className="text-2xl md:text-3xl font-black font-headline text-cyan-950 dark:text-cyan-50 tracking-tight">
            {value}
          </h3>
        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110 group-hover:rotate-3 ${getIconColor()}`}>
          <span className="material-symbols-outlined text-[24px]">
            {icon || 'analytics'}
          </span>
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
              <span className="material-symbols-outlined text-[14px]">
                {trend.startsWith('+') ? 'trending_up' : 'trending_down'}
              </span>
              {trend}
            </div>
            <span className="text-[10px] font-bold text-slate-400 transition-opacity opacity-0 group-hover:opacity-100">vs Bulan Lalu</span>
          </div>
        ) : null}
      </div>

      {/* Subtle Background Glow */}
      <div className={`absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none ${
        color === 'primary' ? 'bg-cyan-500' : 
        color === 'secondary' ? 'bg-emerald-500' : 
        color === 'tertiary' ? 'bg-amber-500' : 'bg-primary'
      }`}></div>
    </div>
  );
}
