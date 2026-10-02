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
  Filter,
} from 'lucide-react';
import { getAttendance, markAttendance, getAttendanceStats, getAllRegistrations } from '../../services/adminService';

const EVENT_LIST = ['ALL', 'HACK', 'KBC', 'PCB', 'CAD', 'BRG', 'CIRCUIT'];

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'present', 'absent'

  const fetchData = async () => {
    setLoading(true);
    try {
      // First try dedicated attendance endpoint, and augment with registrations
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
        const att = attendanceMap.get(regId);
        return {
          id: regId,
          _id: r._id,
          registrationId: regId,
          eventCode: r.eventCode || r.event_code || r.eventId,
          teamName: r.teamName || r.team_name,
          leaderName: r.leader?.name || r.name,
          leaderMobile: r.leader?.mobile || r.phone,
          department: r.leader?.department || r.department,
          year: r.leader?.year || r.year,
          present: att ? att.present : r.status === 'attended' || false,
          markedAt: att ? att.markedAt || att.marked_at : null,
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

  useEffect(() => {
    fetchData();
  }, [selectedEvent]);

  const handleToggleAttendance = async (record) => {
    const newStatus = !record.present;
    // Optimistic UI update
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id ? { ...r, present: newStatus, markedAt: new Date().toISOString() } : r
      )
    );

    try {
      await markAttendance(record.id, newStatus);
    } catch (err) {
      console.error('Failed to mark attendance', err);
      // Rollback on error
      setRecords((prev) =>
        prev.map((r) => (r.id === record.id ? { ...r, present: record.present } : r))
      );
      alert(`Could not mark attendance: ${err.message}`);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (filterStatus === 'present' && !r.present) return false;
      if (filterStatus === 'absent' && r.present) return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const regId = (r.registrationId || '').toLowerCase();
        const leader = (r.leaderName || '').toLowerCase();
        const team = (r.teamName || '').toLowerCase();
        const phone = (r.leaderMobile || '').toLowerCase();
        return regId.includes(query) || leader.includes(query) || team.includes(query) || phone.includes(query);
      }

      return true;
    });
  }, [records, filterStatus, search]);

  const totalCount = records.length;
  const presentCount = records.filter((r) => r.present).length;
  const absentCount = totalCount - presentCount;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header (hidden in print) */}
      <div className="print:hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Attendance Desk Verification
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {presentCount} / {totalCount} CHECKED-IN
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time physical desk attendance scanner and check-in register for Srijan 2026.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <Printer size={14} />
            <span>Print Attendance Sheet</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row (hidden in print) */}
      <div className="print:hidden grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.06]">
          <p className="text-xs text-slate-400">Total Registered</p>
          <p className="text-2xl font-bold text-white mt-1">{totalCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/20">
          <p className="text-xs text-emerald-400">Present (Checked In)</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{presentCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/20">
          <p className="text-xs text-amber-400">Pending / Absent</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{absentCount}</p>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/20">
          <p className="text-xs text-cyan-400">Check-in Turnout</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{attendanceRate}%</p>
        </div>
      </div>

      {/* Filter & Search Bar (hidden in print) */}
      <div className="print:hidden flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, participant name, or team..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
            />
          </div>

          {/* Event filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {EVENT_LIST.map((ev) => (
              <button
                key={ev}
                onClick={() => setSelectedEvent(ev)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedEvent === ev
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-white/[0.03] text-slate-400 hover:text-white'
                }`}
              >
                {ev}
              </button>
            ))}
          </div>
        </div>

        {/* Presence filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-2.5 py-1 rounded ${
              filterStatus === 'ALL'
                ? 'bg-white/10 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => setFilterStatus('present')}
            className={`px-2.5 py-1 rounded ${
              filterStatus === 'present'
                ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Present ({presentCount})
          </button>
          <button
            onClick={() => setFilterStatus('absent')}
            className={`px-2.5 py-1 rounded ${
              filterStatus === 'absent'
                ? 'bg-amber-500/20 text-amber-300 font-medium'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Absent ({absentCount})
          </button>
        </div>
      </div>

      {/* Print-Only Sheet Header */}
      <div className="hidden print:block mb-4 border-b border-black pb-2 text-black">
        <h1 className="text-xl font-bold uppercase tracking-wider">
          SRIJAN 2026 — OFFICIAL ATTENDANCE ROSTER
        </h1>
        <div className="flex justify-between text-xs mt-1">
          <span>Event: {selectedEvent === 'ALL' ? 'All Competitions' : selectedEvent}</span>
          <span>Printed on: {new Date().toLocaleString()}</span>
          <span>Verified Total: {presentCount} Present</span>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="rounded-xl border border-white/[0.08] print:border-black bg-slate-900/40 print:bg-white overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs border-collapse print:text-black">
          <thead>
            <tr className="bg-slate-950/80 print:bg-slate-100 border-b border-white/[0.08] print:border-black text-slate-400 print:text-black text-[11px] uppercase tracking-wider font-semibold">
              <th className="py-3 px-3 w-16">Sl No</th>
              <th className="py-3 px-3">Reg ID</th>
              <th className="py-3 px-3">Event</th>
              <th className="py-3 px-3">Participant / Team</th>
              <th className="py-3 px-3">Dept & Year</th>
              <th className="py-3 px-3">Contact</th>
              <th className="py-3 px-3 text-center w-28">Status</th>
              <th className="py-3 px-3 print:hidden text-right w-28">Action</th>
              <th className="hidden print:table-cell py-3 px-3 w-32">Signature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] print:divide-slate-300 text-slate-300 print:text-black">
            {filteredRecords.map((r, i) => (
              <tr
                key={r.id}
                className={`transition-colors ${
                  r.present
                    ? 'bg-emerald-500/[0.04] print:bg-slate-50'
                    : 'hover:bg-white/[0.02]'
                }`}
              >
                <td className="py-2.5 px-3 font-mono text-slate-500 print:text-black">
                  {i + 1}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-cyan-400 print:text-black">
                  {r.registrationId}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-200 print:text-black">
                  {r.eventCode}
                </td>
                <td className="py-2.5 px-3">
                  <div className="font-medium text-white print:text-black">
                    {r.teamName || r.leaderName}
                  </div>
                  {r.teamName && (
                    <div className="text-[10px] text-slate-400 print:text-slate-600">
                      Lead: {r.leaderName}
                    </div>
                  )}
                </td>
                <td className="py-2.5 px-3 text-slate-400 print:text-black">
                  {r.department || '—'} ({r.year || '—'})
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-400 print:text-black">
                  {r.leaderMobile || '—'}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      r.present
                        ? 'bg-emerald-500/15 text-emerald-400 print:border print:border-black print:text-black'
                        : 'bg-slate-500/15 text-slate-400'
                    }`}
                  >
                    {r.present ? 'PRESENT' : 'ABSENT'}
                  </span>
                </td>
                <td className="py-2.5 px-3 print:hidden text-right">
                  <button
                    onClick={() => handleToggleAttendance(r)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      r.present
                        ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                        : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md'
                    }`}
                  >
                    {r.present ? 'Mark Absent' : 'Mark Present'}
                  </button>
                </td>
                <td className="hidden print:table-cell py-2.5 px-3 border-b border-black">
                  {/* Blank line for participant desk signature */}
                </td>
              </tr>
            ))}

            {filteredRecords.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs text-slate-500">
                  No attendance records found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
