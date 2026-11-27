import React from 'react';

export default function StatCard({ icon: Icon, label, value, change, color = 'cyan' }) {
  const colorMap = {
    cyan: { bg: 'from-cyan-500/15 to-cyan-500/5', border: 'border-cyan-500/25', icon: 'text-cyan-400', glow: 'shadow-cyan-500/10' },
    amber: { bg: 'from-amber-500/15 to-amber-500/5', border: 'border-amber-500/25', icon: 'text-amber-400', glow: 'shadow-amber-500/10' },
    emerald: { bg: 'from-emerald-500/15 to-emerald-500/5', border: 'border-emerald-500/25', icon: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
    red: { bg: 'from-red-500/15 to-red-500/5', border: 'border-red-500/25', icon: 'text-red-400', glow: 'shadow-red-500/10' },
    purple: { bg: 'from-purple-500/15 to-purple-500/5', border: 'border-purple-500/25', icon: 'text-purple-400', glow: 'shadow-purple-500/10' },
    blue: { bg: 'from-blue-500/15 to-blue-500/5', border: 'border-blue-500/25', icon: 'text-blue-400', glow: 'shadow-blue-500/10' },
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`relative rounded-xl border ${c.border} bg-gradient-to-br ${c.bg} p-2.5 sm:p-5 shadow-lg ${c.glow} transition-all duration-300 sm:hover:scale-[1.02] hover:shadow-xl group overflow-hidden`}>
      {/* Subtle hover highlight */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-1.5 sm:gap-3">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
            <p className="text-[10px] sm:text-sm text-slate-400 font-medium leading-tight line-clamp-2 sm:line-clamp-1">
              {label}
            </p>
            {Icon && (
              <div className={`sm:hidden p-1 rounded-md bg-white/5 ${c.icon} shrink-0`}>
                <Icon size={12} />
              </div>
            )}
          </div>
          <p className="text-lg sm:text-3xl font-bold text-white tracking-tight leading-none">
            {value ?? '—'}
          </p>
          {change && (
            <p className={`text-[10px] sm:text-xs mt-1 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)} today
            </p>
          )}
        </div>

        {Icon && (
          <div className={`hidden sm:flex p-2.5 rounded-xl bg-white/5 border border-white/[0.06] ${c.icon} shrink-0`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
