import React, { useState, useEffect } from 'react';
import {
  Activity,
  Clock,
  User,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { getActivityLog } from '../../services/adminService';

const ACTION_COLORS = {
  LOGIN: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  STATUS_UPDATE: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  BULK_STATUS: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  BULK_DELETE: 'bg-red-500/15 text-red-400 border-red-500/30',
  ATTENDANCE_MARK: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  EVENT_UPDATE: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getActivityLog(p, 25);
      if (res.success && Array.isArray(res.data)) {
        setLogs(res.data);
        setPage(res.page || p);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || res.data.length);
      }
    } catch (err) {
      console.error('Failed to load activity logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const filteredLogs = logs.filter((l) => {
    if (!search.trim()) return true;
    const query = search.toLowerCase();
    const action = (l.action || '').toLowerCase();
    const details = (l.details || '').toLowerCase();
    const admin = (l.adminName || l.adminId || '').toLowerCase();
    return action.includes(query) || details.includes(query) || admin.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Audit Activity Log
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {totalCount} EVENTS RECORDED
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable administrative action audit trail for security and event integrity.
          </p>
        </div>

        <button
          onClick={() => fetchLogs(page)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter audit records..."
          className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
        />
      </div>

      {/* Log Table */}
      <div className="rounded-xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-white/[0.08] text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-40">Timestamp</th>
                <th className="py-3 px-4 w-36">Action</th>
                <th className="py-3 px-4">Details & Target</th>
                <th className="py-3 px-4 w-44">Admin User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {filteredLogs.map((log) => {
                const badgeStyle = ACTION_COLORS[log.action] || 'bg-slate-500/15 text-slate-400 border-slate-500/30';
                return (
                  <tr key={log._id || log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded border text-[10px] font-mono font-bold tracking-wider ${badgeStyle}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      <p>{log.details || '—'}</p>
                      {log.registrationId && (
                        <p className="text-[10px] text-cyan-400 font-mono mt-0.5">
                          Target: {log.registrationId}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-slate-500" />
                        <span className="font-medium">{log.adminName || 'Super Admin'}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-xs text-slate-500">
                    No activity log records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-white/[0.06] bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
          <span>
            Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1 rounded border border-white/[0.06] disabled:opacity-30 hover:bg-white/5 text-slate-300"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1 rounded border border-white/[0.06] disabled:opacity-30 hover:bg-white/5 text-slate-300"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
