import React from 'react';

export default function ChartCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
