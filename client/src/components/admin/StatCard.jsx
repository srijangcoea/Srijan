import React from 'react';

export default function StatCard({ icon: Icon, label, value, change, color = 'cyan' }) {
  const colorMap = {
    cyan: { bg: 'from-cyan-500/10 to-cyan-500/5', border: 'border-cyan-500/20', icon: 'text-cyan-400', glow: 'shadow-cyan-500/5' },
    amber: { bg: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20', icon: 'text-amber-400', glow: 'shadow-amber-500/5' },
    emerald: { bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', icon: 'text-emerald-400', glow: 'shadow-emerald-500/5' },
    red: { bg: 'from-red-500/10 to-red-500/5', border: 'border-red-500/20', icon: 'text-red-400', glow: 'shadow-red-500/5' },
    purple: { bg: 'from-purple-500/10 to-purple-500/5', border: 'border-purple-500/20', icon: 'text-purple-400', glow: 'shadow-purple-500/5' },
    blue: { bg: 'from-blue-500/10 to-blue-500/5', border: 'border-blue-500/20', icon: 'text-blue-400', glow: 'shadow-blue-500/5' },
  };

  const c = colorMap[color] || colorMap.cyan;

  return (
    <div className={`relative rounded-xl border ${c.border} bg-gradient-to-br ${c.bg} p-5 shadow-lg ${c.glow} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group`}>
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value ?? '—'}</p>
          {change && (
            <p className={`text-xs mt-1 ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {change >= 0 ? '↑' : '↓'} {Math.abs(change)} today
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg bg-white/5 ${c.icon}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}
