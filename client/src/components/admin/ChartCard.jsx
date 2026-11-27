import React from 'react';

export default function ChartCard({ title, subtitle, rightSlot, children, className = '' }) {
  return (
    <div className={`rounded-xl cosmic-glass p-5 ${className}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
