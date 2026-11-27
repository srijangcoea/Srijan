import React, { useState, useEffect, useMemo } from 'react';
import {
  ClipboardCheck,
  Search,
  Printer,
  Check,
  X,
  UserCheck,
  Users,
  RefreshCw,
  Phone,
  BookOpen,
  Calendar,
  Tag,
  Hash,
} from 'lucide-react';
import { getAttendance, markAttendance, getAttendanceStats, getAllRegistrations } from '../../services/adminService';
import { notify } from '../../utils/toast';

const EVENT_LIST = ['ALL', 'HACK', 'KBC', 'PCB', 'CAD', 'BRG', 'CIRCUIT'];

export default function AttendancePage() {
  const [records, setRecords]       = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [filterStatus, setFilterStatus]   = useState('ALL'); // 'ALL' | 'present' | 'absent'
  const [marking, setMarking]       = useState(null); // id being toggled

  // ── Data fetch ──────────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [attRes, regRes, statsRes] = await Promise.all([
        getAttendance({ eventId: selectedEvent !== 'ALL' ? selectedEvent : undefined }).catch(() => ({ data: [] })),
        getAllRegistrations({ eventId: selectedEvent !== 'ALL' ? selectedEvent : undefined }).catch(() => ({ data: [] })),
        getAttendanceStats().catch(() => ({ data: null })),
      ]);

      const attendanceMap = new Map();
      if (attRes.data && Array.isArray(attRes.data)) {
        attRes.data.forEach((a) => {
          const key = a.registrationId || a.registration_id;
          attendanceMap.set(key, a);
        });
      }

      const combined = (regRes.data || []).map((r) => {
        const regId = r.registrationId || r.registration_id || r._id;
        const att   = attendanceMap.get(regId);
        const lead  = r.teamLeader || r.participant || r.leader;
        return {
          id:             regId,
          _id:            r._id,
          registrationId: regId,
          eventCode:      r.eventCode || r.event_code || r.eventId,
          teamName:       r.teamName  || r.team_name,
          leaderName:     lead?.name  || r.name,
          leaderMobile:   lead?.phone || lead?.mobile || r.phone,
          department:     lead?.department || lead?.branch || r.department,
          year:           lead?.year  || r.year,
          present:        att ? att.present : r.status === 'attended' || false,
          markedAt:       att ? att.markedAt || att.marked_at : null,
        };
      });

      setRecords(combined);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load attendance records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [selectedEvent]);

  // ── Toggle attendance ────────────────────────────────────────────────────────
  const handleToggle = async (record) => {
    if (marking === record.id) return;
    const newStatus = !record.present;
    setMarking(record.id);
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id ? { ...r, present: newStatus, markedAt: new Date().toISOString() } : r
      )
    );
    try {
      await markAttendance(record.id, newStatus);
      notify.success(
        'Attendance Updated',
        `${record.leaderName || 'Participant'} marked as ${newStatus ? 'PRESENT' : 'ABSENT'}`
      );
    } catch (err) {
      setRecords((prev) =>
        prev.map((r) => (r.id === record.id ? { ...r, present: record.present } : r))
      );
      notify.error('Attendance Error', err.message || 'Could not mark attendance');
    } finally {
      setMarking(null);
    }
  };

  // ── Filtered list ────────────────────────────────────────────────────────────
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filterStatus === 'present' && !r.present) return false;
      if (filterStatus === 'absent'  &&  r.present) return false;
      if (search.trim()) {
        const q      = search.toLowerCase();
        const regId  = (r.registrationId || '').toLowerCase();
        const leader = (r.leaderName || '').toLowerCase();
        const team   = (r.teamName || '').toLowerCase();
        const phone  = (r.leaderMobile || '').toLowerCase();
        return regId.includes(q) || leader.includes(q) || team.includes(q) || phone.includes(q);
      }
      return true;
    });
  }, [records, filterStatus, search]);

  const totalCount     = records.length;
  const presentCount   = records.filter((r) => r.present).length;
  const absentCount    = totalCount - presentCount;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const statusFilterBtn = (val, label, activeClass, hoverClass) => (
    <button
      onClick={() => setFilterStatus(val)}
      className={`flex-1 sm:flex-none px-3 py-2 sm:py-1 rounded-lg text-xs font-semibold transition-colors ${
        filterStatus === val ? activeClass : `text-slate-400 hover:text-white ${hoverClass}`
      }`}
    >
      {label}
    </button>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div className="print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-white tracking-tight flex flex-wrap items-center gap-2">
            Attendance Verification
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 whitespace-nowrap">
              {presentCount}/{totalCount} IN
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
            Real-time desk check-in register for Srijan 2026.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20"
          >
            <Printer size={14} />
            <span className="hidden xs:inline">Print Sheet</span>
            <span className="xs:hidden">Print</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────────────────── */}
      <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Registered',   value: totalCount,     color: 'text-white',       border: 'border-white/[0.06]' },
          { label: 'Present',      value: presentCount,   color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { label: 'Absent',       value: absentCount,    color: 'text-amber-400',   border: 'border-amber-500/20' },
          { label: 'Turnout',      value: `${attendanceRate}%`, color: 'text-cyan-400', border: 'border-cyan-500/20' },
        ].map(({ label, value, color, border }) => (
          <div key={label} className={`p-3 sm:p-4 rounded-xl bg-slate-900/60 border ${border}`}>
            <p className={`text-[11px] ${color} opacity-80`}>{label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${color} mt-1`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Search + Filters ──────────────────────────────────────────────────── */}
      <div className="print:hidden space-y-2.5 bg-slate-900/40 p-3 rounded-xl border border-white/[0.06]">

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, team, ID or phone…"
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
          />
        </div>

        {/* Event filter — horizontally scrollable pill row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {EVENT_LIST.map((ev) => (
            <button
              key={ev}
              onClick={() => setSelectedEvent(ev)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedEvent === ev
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {ev}
            </button>
          ))}
        </div>

        {/* Presence filter — full-width on mobile */}
        <div className="flex items-center gap-1.5">
          {statusFilterBtn('ALL',     `All (${totalCount})`,         'bg-white/10 text-white', '')}
          {statusFilterBtn('present', `Present (${presentCount})`,   'bg-emerald-500/20 text-emerald-300', 'hover:text-emerald-400')}
          {statusFilterBtn('absent',  `Absent (${absentCount})`,     'bg-amber-500/20 text-amber-300',   'hover:text-amber-400')}
        </div>
      </div>

      {/* ── Print header (hidden on screen) ───────────────────────────────────── */}
      <div className="hidden print:block mb-4 border-b border-black pb-2 text-black">
        <h1 className="text-xl font-bold uppercase tracking-wider">
          SRIJAN 2026 — OFFICIAL ATTENDANCE ROSTER
        </h1>
        <div className="flex justify-between text-xs mt-1">
          <span>Event: {selectedEvent === 'ALL' ? 'All Competitions' : selectedEvent}</span>
          <span>Printed: {new Date().toLocaleString()}</span>
          <span>Present: {presentCount}</span>
        </div>
      </div>

      {/* ── Loading skeleton ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-2 print:hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────────────────── */}
      {!loading && filteredRecords.length === 0 && (
        <div className="py-16 text-center print:hidden">
          <ClipboardCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No records match the selected filters.</p>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE: Card list  (hidden on md+)
      ════════════════════════════════════════════════════════════════════════ */}
      {!loading && filteredRecords.length > 0 && (
        <div className="md:hidden print:hidden space-y-2.5">
          {filteredRecords.map((r, i) => {
            const isPresent = r.present;
            const isBusy    = marking === r.id;
            return (
              <div
                key={r.id}
                className={`rounded-xl border p-3.5 transition-colors ${
                  isPresent
                    ? 'bg-emerald-500/[0.06] border-emerald-500/25'
                    : 'bg-slate-900/50 border-white/[0.07]'
                }`}
              >
                {/* Row 1: index + regId + event badge + status pill */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-slate-800 text-slate-500 text-[10px] font-mono flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-cyan-400 font-bold truncate">
                        {r.registrationId}
                      </p>
                      <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-700/60 text-slate-300">
                        {r.eventCode || '—'}
                      </span>
                    </div>
                  </div>

                  {/* Status pill */}
                  <span
                    className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      isPresent
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-700/40 text-slate-400 border border-white/[0.06]'
                    }`}
                  >
                    {isPresent ? <Check size={10} /> : <X size={10} />}
                    {isPresent ? 'Present' : 'Absent'}
                  </span>
                </div>

                {/* Row 2: Participant info */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-slate-500 shrink-0" />
                    <span className="text-sm font-semibold text-white truncate">
                      {r.teamName || r.leaderName || '—'}
                    </span>
                  </div>
                  {r.teamName && r.leaderName && (
                    <div className="flex items-center gap-2 pl-5">
                      <span className="text-xs text-slate-400">Lead: {r.leaderName}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 pl-5">
                    {r.leaderMobile && (
                      <div className="flex items-center gap-1.5">
                        <Phone size={11} className="text-slate-500" />
                        <span className="text-xs font-mono text-slate-400">{r.leaderMobile}</span>
                      </div>
                    )}
                    {(r.department || r.year) && (
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={11} className="text-slate-500" />
                        <span className="text-xs text-slate-400">
                          {r.department || '—'} · {r.year || '—'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 3: Mark button — full width, big tap target */}
                <button
                  onClick={() => handleToggle(r)}
                  disabled={isBusy}
                  className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                    isPresent
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
                  } ${isBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {isBusy ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : isPresent ? (
                    <><X size={14} /> Mark Absent</>
                  ) : (
                    <><Check size={14} /> Mark Present</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          DESKTOP: Full table  (hidden on < md)
      ════════════════════════════════════════════════════════════════════════ */}
      {!loading && filteredRecords.length > 0 && (
        <div className="hidden md:block rounded-xl border border-white/[0.08] print:border-black bg-slate-900/40 print:bg-white overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs border-collapse print:text-black">
            <thead>
              <tr className="bg-slate-950/80 print:bg-slate-100 border-b border-white/[0.08] print:border-black text-slate-400 print:text-black text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-3 w-12">#</th>
                <th className="py-3 px-3">Reg ID</th>
                <th className="py-3 px-3">Event</th>
                <th className="py-3 px-3">Participant / Team</th>
                <th className="py-3 px-3">Dept &amp; Year</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3 text-center w-28">Status</th>
                <th className="py-3 px-3 print:hidden text-right w-32">Action</th>
                <th className="hidden print:table-cell py-3 px-3 w-32">Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] print:divide-slate-300 text-slate-300 print:text-black">
              {filteredRecords.map((r, i) => (
                <tr
                  key={r.id}
                  className={`transition-colors ${
                    r.present ? 'bg-emerald-500/[0.04] print:bg-slate-50' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono text-slate-500 print:text-black">{i + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400 print:text-black">
                    {r.registrationId}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-black">{r.eventCode}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-medium text-white print:text-black">{r.teamName || r.leaderName}</div>
                    {r.teamName && (
                      <div className="text-[10px] text-slate-400 print:text-slate-600">Lead: {r.leaderName}</div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 print:text-black">
                    {r.department || '—'} ({r.year || '—'})
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400 print:text-black">{r.leaderMobile || '—'}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        r.present
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-slate-500/15 text-slate-400'
                      }`}
                    >
                      {r.present ? 'PRESENT' : 'ABSENT'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 print:hidden text-right">
                    <button
                      onClick={() => handleToggle(r)}
                      disabled={marking === r.id}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ml-auto ${
                        r.present
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                          : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md'
                      } ${marking === r.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {marking === r.id ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : r.present ? (
                        'Mark Absent'
                      ) : (
                        'Mark Present'
                      )}
                    </button>
                  </td>
                  <td className="hidden print:table-cell py-2.5 px-3 border-b border-black" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Print table (mobile print fallback — always table) */}
      {!loading && filteredRecords.length > 0 && (
        <div className="hidden print:block rounded-xl border border-black overflow-hidden">
          <table className="w-full text-left text-xs border-collapse text-black">
            <thead>
              <tr className="bg-slate-100 border-b border-black text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">Reg ID</th>
                <th className="py-2 px-2">Event</th>
                <th className="py-2 px-2">Participant / Team</th>
                <th className="py-2 px-2">Dept &amp; Year</th>
                <th className="py-2 px-2">Contact</th>
                <th className="py-2 px-2 text-center">Status</th>
                <th className="py-2 px-2 w-28">Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {filteredRecords.map((r, i) => (
                <tr key={r.id} className={r.present ? 'bg-slate-50' : ''}>
                  <td className="py-1.5 px-2">{i + 1}</td>
                  <td className="py-1.5 px-2 font-mono font-bold">{r.registrationId}</td>
                  <td className="py-1.5 px-2">{r.eventCode}</td>
                  <td className="py-1.5 px-2">
                    <div>{r.teamName || r.leaderName}</div>
                    {r.teamName && <div className="text-[10px] text-slate-500">Lead: {r.leaderName}</div>}
                  </td>
                  <td className="py-1.5 px-2">{r.department || '—'} ({r.year || '—'})</td>
                  <td className="py-1.5 px-2 font-mono">{r.leaderMobile || '—'}</td>
                  <td className="py-1.5 px-2 text-center font-semibold">{r.present ? 'PRESENT' : 'ABSENT'}</td>
                  <td className="py-1.5 px-2" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
