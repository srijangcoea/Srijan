import React from 'react';

const statusConfig = {
  confirmed: {
    label: 'Confirmed',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400',
  },
  pending: {
    label: 'Pending',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    dot: 'bg-red-400',
  },
  cancelled: {
    label: 'Cancelled',
    bg: 'bg-slate-500/15',
    text: 'text-slate-400',
    dot: 'bg-slate-400',
  },
  attended: {
    label: 'Attended',
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    dot: 'bg-cyan-400',
  },
};

export default function StatusBadge({ status, size = 'sm', onClick }) {
  const config = statusConfig[status] || statusConfig.pending;

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
