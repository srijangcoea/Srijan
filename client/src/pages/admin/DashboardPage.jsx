import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  TrendingUp,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import StatusBadge from '../../components/admin/StatusBadge';
import DetailDrawer from '../../components/admin/DetailDrawer';
import { getDashboardStats, updateRegistrationStatus } from '../../services/adminService';

const STATUS_COLORS = {
  confirmed: '#10b981', // emerald-500
  pending: '#f59e0b',   // amber-500
  rejected: '#ef4444',  // red-500
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      setError(null);
      const res = await getDashboardStats();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
      setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const handleStatusChange = async (id, newStatus, reason) => {
    try {
      await updateRegistrationStatus(id, newStatus, reason);
      // Update local state if selected registration is open
      if (selectedReg && (selectedReg._id === id || selectedReg.id === id)) {
        setSelectedReg((prev) => ({ ...prev, status: newStatus, rejectionReason: reason }));
      }
      fetchStats();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const kpi = data?.kpi || {
    totalRegistrations: 0,
    totalParticipants: 0,
    confirmed: 0,
    pending: 0,
    rejected: 0,
    registrationsToday: 0,
  };

  // Status donut data
  const statusPieData = [
    { name: 'Confirmed', value: kpi.confirmed || 0, color: STATUS_COLORS.confirmed },
    { name: 'Pending', value: kpi.pending || 0, color: STATUS_COLORS.pending },
    { name: 'Rejected', value: kpi.rejected || 0, color: STATUS_COLORS.rejected },
  ].filter((item) => item.value > 0);

  // Bar chart data (Event Registrations)
  const eventBarData = (data?.eventStats || []).map((e) => ({
    name: e._id || e.eventName || 'Unknown',
    registrations: e.count || 0,
    confirmed: e.confirmed || 0,
  }));

  // Timeline line chart data
  const timelineData = data?.timelineData || [];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Executive Dashboard
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              LIVE METRICS
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time participant and event registrations telemetry for SRIJAN 2026.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-cyan-400' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => navigate('/admin/registrations')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            <span>View All Registrations</span>
            <ExternalLink size={13} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center justify-between">
          <span>Failed to fetch live database statistics: {error}</span>
          <button onClick={handleRefresh} className="underline hover:text-red-300">
            Retry
          </button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          icon={Users}
          label="Total Registrations"
          value={loading ? '...' : kpi.totalRegistrations}
          color="cyan"
        />
        <StatCard
          icon={UserCheck}
          label="Total Participants"
          value={loading ? '...' : kpi.totalParticipants}
          color="blue"
        />
        <StatCard
          icon={CheckCircle}
          label="Confirmed"
          value={loading ? '...' : kpi.confirmed}
          color="emerald"
        />
        <StatCard
          icon={Clock}
          label="Pending Review"
          value={loading ? '...' : kpi.pending}
          color="amber"
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={loading ? '...' : kpi.rejected}
          color="red"
        />
        <StatCard
          icon={Calendar}
          label="Registrations Today"
          value={loading ? '...' : kpi.registrationsToday}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Registrations Per Event */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Registrations per Event"
            subtitle="Breakdown of total registrations across technical competitions"
          >
            <div className="h-64 sm:h-72 w-full pt-4">
              {eventBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventBarData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="registrations" name="Total Regs" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="confirmed" name="Confirmed" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  No event registration data available yet.
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Donut Chart: Status Split */}
        <div>
          <ChartCard
            title="Approval Status Split"
            subtitle="Proportion of confirmed, pending, and rejected registrations"
          >
            <div className="h-64 sm:h-72 w-full flex flex-col items-center justify-center">
              {statusPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(val) => <span className="text-xs text-slate-300">{val}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-xs text-slate-500">No status metrics recorded yet.</div>
              )}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Row 3: Registrations over Time & Event Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Area/Line Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Registrations Trend"
            subtitle="Timeline trajectory of registrations over recent days"
          >
            <div className="h-64 sm:h-72 w-full pt-4">
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                    />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#fff',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      name="Registrations"
                      stroke="#38bdf8"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#38bdf8' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  No timeline data recorded yet.
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Per-event progress bars */}
        <div>
          <ChartCard
            title="Event Capacity & Traction"
            subtitle="Registration shares relative to maximum capacity targets"
          >
            <div className="space-y-4 py-2">
              {(data?.eventStats || []).slice(0, 6).map((event) => {
                const maxTarget = 60; // baseline target capacity
                const percentage = Math.min(100, Math.round(((event.count || 0) / maxTarget) * 100));
                return (
                  <div key={event._id || event.eventName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {event._id || event.eventName}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {event.count || 0} / {maxTarget} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {(!data?.eventStats || data.eventStats.length === 0) && (
                <p className="text-xs text-slate-500 text-center py-6">No event stats found</p>
              )}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Recent Registrations Table Snippet */}
      <div className="rounded-xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-sm p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">Recent Registrations</h2>
            <p className="text-xs text-slate-400">Latest entries submitted by participants</p>
          </div>
          <button
            onClick={() => navigate('/admin/registrations')}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Reg ID</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Team / Leader</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {(data?.recentRegistrations || []).slice(0, 6).map((reg) => (
                <tr
                  key={reg._id || reg.id}
                  onClick={() => setSelectedReg(reg)}
                  className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                    {reg.registrationId || reg.registration_id || reg._id?.slice(-6)}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">
                    {reg.eventName || reg.event_code || reg.eventId}
                  </td>
                  <td className="py-2.5 px-3">
                    <p className="font-semibold text-white">
                      {reg.teamName || reg.team_name || reg.leader?.name || reg.name || 'Participant'}
                    </p>
                    {reg.teamName && (
                      <p className="text-[10px] text-slate-500">
                        Lead: {reg.leader?.name || reg.name}
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {reg.leader?.email || reg.email || '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusBadge status={reg.status || 'pending'} />
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500 font-mono text-[11px]">
                    {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
              {(!data?.recentRegistrations || data.recentRegistrations.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                    No recent registrations submitted yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        registration={selectedReg}
        onClose={() => setSelectedReg(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
