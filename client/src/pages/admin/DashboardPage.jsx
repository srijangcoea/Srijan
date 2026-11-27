import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Calendar,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LabelList,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import DetailDrawer from '../../components/admin/DetailDrawer';
import { getDashboardStats, getCachedData } from '../../services/adminService';
import { notify } from '../../utils/toast';

const EVENT_PALETTE = [
  '#F59E0B', // Gold
  '#06B6D4', // Cyan
  '#FB923C', // Solar Orange
  '#38BDF8', // Starlight Blue
  '#A855F7', // Nebula Purple
  '#10B981', // Emerald
];

const fmtShortDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
};

const fmtFullDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

function CosmicTooltip({ active, payload, label, isDate = false, totalRegs = 0 }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const val = item.value ?? 0;
  const displayLabel = isDate ? fmtFullDate(item.payload?.rawDate || label) : (item.payload?.fullName || label);
  const pct = totalRegs > 0 && !isDate ? Math.round((val / totalRegs) * 100) : null;

  return (
    <div className="rounded-xl bg-space-900/95 border border-amber-500/30 px-3.5 py-2.5 shadow-2xl backdrop-blur-md text-xs">
      <p className="font-display font-semibold text-white mb-1">{displayLabel}</p>
      <div className="flex items-center gap-2 text-slate-300">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: item.color || item.payload?.color || '#F59E0B' }}
        />
        <span>{item.name}:</span>
        <span className="font-mono font-bold text-amber-400">{val}</span>
        {pct !== null && (
          <span className="text-[10px] font-mono text-slate-400">({pct}%)</span>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const cached = getCachedData('dashboard')?.data || null;
  const [data, setData] = useState(cached);
  const [loading, setLoading] = useState(!cached);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [error, setError] = useState(null);
  const [trendMode, setTrendMode] = useState('daily'); // 'daily' | 'cumulative'
  const navigate = useNavigate();

  const fetchStats = async (force = false) => {
    try {
      setError(null);
      const res = await getDashboardStats({ force });
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics', err);
      if (!data) setError(err.message || 'Failed to load stats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(false);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats(true);
    notify.info('Dashboard Refreshed', 'Latest metrics and data loaded');
  };

  const kpi = data?.kpi || {
    totalRegistrations: 0,
    totalParticipants: 0,
    registrationsToday: 0,
  };

  // Event bar & donut data using friendly event names + palette colors
  const eventBarData = useMemo(() => {
    return (data?.eventStats || []).map((e, idx) => {
      const fullName = e.eventName || e._id || 'Unknown';
      const shortName = fullName.length > 14 ? `${fullName.slice(0, 12)}…` : fullName;
      return {
        name: shortName,
        fullName,
        registrations: e.count || 0,
        color: EVENT_PALETTE[idx % EVENT_PALETTE.length],
      };
    });
  }, [data?.eventStats]);

  // Timeline data supporting Daily & Cumulative modes with formatted dates
  const timelineData = useMemo(() => {
    const raw = data?.timelineData || [];
    let running = 0;
    return raw.map((d) => {
      running += d.count || 0;
      return {
        rawDate: d.date,
        date: fmtShortDate(d.date),
        daily: d.count || 0,
        cumulative: running,
      };
    });
  }, [data?.timelineData]);

  const totalEventRegs = useMemo(
    () => eventBarData.reduce((sum, e) => sum + e.registrations, 0),
    [eventBarData]
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.07]">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Executive Dashboard
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-space-900/70 border border-white/[0.08] text-xs text-slate-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin text-amber-400' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button
            onClick={() => navigate('/admin/registrations')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-space-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-500 transition-all"
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

      {/* KPI Cards Row — 4 boxes in a single row on mobile & desktop */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <StatCard
          icon={Users}
          label="Total Registrations"
          value={loading ? '...' : kpi.totalRegistrations}
          color="amber"
        />
        <StatCard
          icon={UserCheck}
          label="Total Participants"
          value={loading ? '...' : kpi.totalParticipants}
          color="cyan"
        />
        <StatCard
          icon={Layers}
          label="Active Events"
          value={loading ? '...' : (data?.eventStats?.length || 6)}
          color="purple"
        />
        <StatCard
          icon={Calendar}
          label="Registrations Today"
          value={loading ? '...' : kpi.registrationsToday}
          color="emerald"
        />
      </div>

      {/* Bar Chart: Registrations Per Event */}
      <div>
        <ChartCard
          title="Registrations per Event"
          subtitle="Competition-wise registration volume across Srijan 2026 events"
        >
          <div className="h-64 sm:h-72 w-full pt-2">
            {eventBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventBarData} margin={{ top: 20, right: 12, left: -18, bottom: 18 }}>
                  <defs>
                    {eventBarData.map((entry, idx) => (
                      <linearGradient key={idx} id={`barGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={0.95} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.35} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(245, 158, 11, 0.06)' }}
                    content={<CosmicTooltip totalRegs={totalEventRegs} />}
                  />
                  <Bar dataKey="registrations" name="Registrations" radius={[6, 6, 0, 0]} maxBarSize={52}>
                    {eventBarData.map((_, idx) => (
                      <Cell key={idx} fill={`url(#barGrad-${idx})`} />
                    ))}
                    <LabelList
                      dataKey="registrations"
                      position="top"
                      fill="#e2e8f0"
                      fontSize={11}
                      fontWeight={600}
                    />
                  </Bar>
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

      {/* Row 3: Registrations Trend Area Chart & Event Share Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Area Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Registrations Trend"
            subtitle={
              trendMode === 'daily'
                ? 'Daily registration volume over recent days'
                : 'Cumulative registration growth trajectory'
            }
            rightSlot={
              <div className="flex items-center p-0.5 rounded-lg bg-space-950/70 border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setTrendMode('daily')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    trendMode === 'daily'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Daily
                </button>
                <button
                  type="button"
                  onClick={() => setTrendMode('cumulative')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                    trendMode === 'cumulative'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cumulative
                </button>
              </div>
            }
          >
            <div className="h-64 sm:h-72 w-full pt-2">
              {timelineData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 12, right: 16, left: -18, bottom: 10 }}>
                    <defs>
                      <linearGradient id="trendGradAmber" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="trendGradCyan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
                    />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CosmicTooltip isDate />} />
                    <Area
                      type="monotone"
                      dataKey={trendMode}
                      name={trendMode === 'daily' ? 'Daily Regs' : 'Total Regs'}
                      stroke={trendMode === 'daily' ? '#F59E0B' : '#06B6D4'}
                      strokeWidth={2.5}
                      fill={trendMode === 'daily' ? 'url(#trendGradAmber)' : 'url(#trendGradCyan)'}
                      dot={{ r: 3.5, fill: trendMode === 'daily' ? '#FBBF24' : '#38BDF8', strokeWidth: 0 }}
                      activeDot={{ r: 6, stroke: '#04060E', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  No timeline data recorded yet.
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Event Share Donut & Breakdown */}
        <div>
          <ChartCard
            title="Event Share Breakdown"
            subtitle="Percentage distribution across competitions"
          >
            {eventBarData.length > 0 ? (
              <div className="space-y-4">
                <div className="h-44 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={eventBarData}
                        dataKey="registrations"
                        nameKey="fullName"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={72}
                        paddingAngle={3}
                        stroke="rgba(4,6,14,0.8)"
                        strokeWidth={2}
                      >
                        {eventBarData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CosmicTooltip totalRegs={totalEventRegs} />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Total Overlay */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-display font-bold text-white leading-none">
                      {totalEventRegs}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 mt-1">
                      TOTAL
                    </span>
                  </div>
                </div>

                {/* Ranked Event List */}
                <div className="space-y-2.5 pt-1">
                  {eventBarData.slice(0, 6).map((ev) => {
                    const share = totalEventRegs > 0 ? Math.round((ev.registrations / totalEventRegs) * 100) : 0;
                    return (
                      <div key={ev.fullName} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-2 font-medium text-slate-200 truncate pr-2">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: ev.color }}
                            />
                            <span className="truncate">{ev.fullName}</span>
                          </span>
                          <span className="text-slate-400 font-mono shrink-0">
                            {ev.registrations} <span className="text-slate-500">({share}%)</span>
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${share}%`, backgroundColor: ev.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-12">No event stats found</p>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Recent Registrations Table Snippet */}
      <div className="rounded-xl cosmic-glass p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-white tracking-wide">Recent Registrations</h2>
            <p className="text-xs text-slate-400">Latest entries submitted by participants</p>
          </div>
          <button
            onClick={() => navigate('/admin/registrations')}
            className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
          >
            <span>View All</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.07] text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Reg ID</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Team / Leader</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {(data?.recentRegistrations || []).slice(0, 6).map((reg) => (
                <tr
                  key={reg._id || reg.id}
                  onClick={() => setSelectedReg(reg)}
                  className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-400">
                    {reg.registrationId || reg.registration_id || reg._id?.slice(-6)}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-200">
                    {reg.eventName || reg.event_code || reg.eventId}
                  </td>
                  <td className="py-2.5 px-3">
                    {(() => {
                      const lead = reg.teamLeader || reg.participant || reg.leader;
                      return (
                        <>
                          <p className="font-semibold text-white">
                            {reg.teamName || reg.team_name || lead?.name || reg.name || 'Participant'}
                          </p>
                          {reg.teamName && (
                            <p className="text-[10px] text-slate-500">
                              Lead: {lead?.name || reg.name}
                            </p>
                          )}
                        </>
                      );
                    })()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">
                    {(() => {
                      const lead = reg.teamLeader || reg.participant || reg.leader;
                      return lead?.email || reg.email || '—';
                    })()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500 font-mono text-[11px]">
                    {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
              {(!data?.recentRegistrations || data.recentRegistrations.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-slate-500">
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
      />
    </div>
  );
}
