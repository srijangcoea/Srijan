import React, { useState, useEffect, useMemo } from 'react';
import {
  fetchAdminRegistrations,
  fetchRegistrationStats,
  deleteRegistrationById,
} from '../services/api';
import { events } from '../data/events';
import DynamicIcon from '../components/DynamicIcon';
import { notify } from '../utils/toast';
import {
  Users,
  User,
  Search,
  Download,
  RefreshCw,
  Trash2,
  Eye,
  X,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  Mail,
  Phone,
  School,
  BookOpen,
} from 'lucide-react';

const ADMIN_PASSCODE = 'srijan2026';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('srijan_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Modal Detail State
  const [activeDetail, setActiveDetail] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Authenticate Admin
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === ADMIN_PASSCODE || passcode.trim().toLowerCase() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('srijan_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid passcode. (Hint: default passcode is "srijan2026")');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('srijan_admin_auth');
  };

  // Load Data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [regRes, statsRes] = await Promise.all([
        fetchAdminRegistrations({ eventId: selectedEventId, search: searchQuery, type: selectedType }),
        fetchRegistrationStats().catch(() => ({ success: false })),
      ]);

      if (regRes.success) {
        setRegistrations(regRes.data || []);
      }
      if (statsRes && statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load registration data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, selectedEventId, selectedType]);

  // Handle Search Debounce / Enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Delete Action
  const handleDelete = async (regId) => {
    if (!window.confirm(`Are you sure you want to delete registration ${regId}?`)) {
      return;
    }
    setDeletingId(regId);
    try {
      await deleteRegistrationById(regId);
      setRegistrations((prev) => prev.filter((r) => r.registrationId !== regId));
      if (activeDetail && activeDetail.registrationId === regId) {
        setActiveDetail(null);
      }
      loadData();
      notify.info('Deleted', `Registration ${regId} deleted`);
    } catch (err) {
      notify.error('Delete Failed', err.message || 'Could not delete registration');
    } finally {
      setDeletingId(null);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!registrations || registrations.length === 0) {
      notify.warning('No Records', 'No registrations available to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Event Name',
      'Event ID',
      'Registration Type',
      'Team Name',
      'Primary Contact Name',
      'Email',
      'Phone',
      'College',
      'Branch',
      'Year',
      'Team Members Count',
      'All Members Details',
      'Registered At',
    ];

    const rows = registrations.map((r) => {
      const isTeam = r.registrationType === 'team';
      const primaryName = isTeam ? r.teamLeader?.name : r.participant?.name;
      const email = isTeam ? r.teamLeader?.email : r.participant?.email;
      const phone = isTeam ? r.teamLeader?.phone : r.participant?.phone;
      const college = isTeam ? r.teamLeader?.college : r.participant?.college;
      const branch = isTeam ? r.teamLeader?.branch : r.participant?.branch;
      const year = isTeam ? r.teamLeader?.year : r.participant?.year;

      const membersDetail = isTeam && r.members && r.members.length > 0
        ? r.members.map((m) => `${m.name} (${m.email}, ${m.phone}, ${m.college})`).join(' | ')
        : 'N/A';

      const memberCount = isTeam ? (r.members?.length || 0) + 1 : 1;

      return [
        `"${r.registrationId || ''}"`,
        `"${r.eventName || ''}"`,
        `"${r.eventId || ''}"`,
        `"${r.registrationType || ''}"`,
        `"${r.teamName || ''}"`,
        `"${primaryName || ''}"`,
        `"${email || ''}"`,
        `"${phone || ''}"`,
        `"${college || ''}"`,
        `"${branch || ''}"`,
        `"${year || ''}"`,
        `"${memberCount}"`,
        `"${membersDetail.replace(/"/g, '""')}"`,
        `"${new Date(r.registeredAt || r.createdAt).toLocaleString()}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const filename = `srijan_registrations_${selectedEventId}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pre-calculate counts per event
  const eventCounts = useMemo(() => {
    const map = {};
    if (stats?.perEvent) {
      Object.keys(stats.perEvent).forEach((k) => {
        map[k] = stats.perEvent[k].count;
      });
    }
    return map;
  }, [stats]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-space-900/90 border border-amber-500/30 backdrop-blur-xl shadow-2xl text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-display font-bold text-white mb-2">
            SRIJAN 2026 Admin Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-6">
            Enter authorized passcode to view and manage event registrations.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode"
                className="w-full px-4 py-3 rounded-xl bg-space-950 border border-white/10 text-white text-center text-base tracking-widest focus:outline-none focus:border-amber-500 transition-colors"
                autoFocus
              />
              {authError && (
                <p className="text-xs text-red-400 mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-xl font-display font-bold text-sm text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-500 shadow-md shadow-orange-500/25 transition-all"
            >
              Access Dashboard
            </button>
          </form>

          <p className="text-[11px] font-mono text-slate-500 mt-6">
            Default passcode: <span className="text-amber-400/80">srijan2026</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                Admin Control Panel
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white mt-1">
              Event Registrations
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-space-900 border border-white/10 hover:border-amber-500/40 hover:text-white transition-all shadow-sm"
              title="Download CSV report"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-red-400 hover:bg-white/5 border border-transparent transition-colors"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-space-900/80 border border-white/10">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Total Registrations
            </span>
            <div className="text-3xl font-display font-extrabold text-white">
              {stats?.total ?? registrations.length}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">Across all competitions</div>
          </div>

          <div className="p-5 rounded-2xl bg-space-900/80 border border-white/10">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Team Entries
            </span>
            <div className="text-3xl font-display font-extrabold text-amber-400">
              {stats?.teamCount ?? registrations.filter((r) => r.registrationType === 'team').length}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">Hackathons & team events</div>
          </div>

          <div className="p-5 rounded-2xl bg-space-900/80 border border-white/10">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Individual Entries
            </span>
            <div className="text-3xl font-display font-extrabold text-cyan-400">
              {stats?.individualCount ?? registrations.filter((r) => r.registrationType === 'individual').length}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">Solo technical challenges</div>
          </div>

          <div className="p-5 rounded-2xl bg-space-900/80 border border-white/10">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Active Competitions
            </span>
            <div className="text-3xl font-display font-extrabold text-white">
              {events.length}
            </div>
            <div className="text-[11px] text-slate-500 font-mono mt-1">SRIJAN 2026 flagship events</div>
          </div>
        </div>

        {/* COMPETITIONS TAB SELECTOR (User Requirement: view registration for each competition) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              Filter By Competition:
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Showing: {selectedEventId === 'all' ? 'All Competitions' : events.find((e) => e.id === selectedEventId)?.name}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedEventId('all')}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-2 flex-shrink-0 ${
                selectedEventId === 'all'
                  ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                  : 'bg-space-900/80 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <span>All Competitions</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedEventId === 'all' ? 'bg-black/30 text-white' : 'bg-white/10 text-slate-400'}`}>
                {stats?.total ?? registrations.length}
              </span>
            </button>

            {events.map((evt) => {
              const isSelected = selectedEventId === evt.id;
              const count = eventCounts[evt.id] || 0;
              return (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 flex-shrink-0 ${
                    isSelected
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'bg-space-900/80 text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  <DynamicIcon name={evt.icon} className="w-3.5 h-3.5" />
                  <span>{evt.name}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-black/30 text-white' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-space-900/70 border border-white/10 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, email, team, college..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-space-950 border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs font-mono text-slate-400">Type:</span>
            <div className="inline-flex rounded-xl bg-space-950 p-1 border border-white/10">
              {['all', 'team', 'individual'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wider capitalize transition-colors ${
                    selectedType === t ? 'bg-amber-500 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Registrations Table / Content */}
        <div className="rounded-3xl bg-space-900/80 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
          {loading ? (
            <div className="py-24 text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-amber-400 mx-auto mb-3" />
              <p className="text-sm font-mono text-slate-400">Loading registrations...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto px-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-display font-bold text-white mb-1">
                No Registrations Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {selectedEventId !== 'all'
                  ? `No participants have registered for this competition yet.`
                  : `No registrations found matching the current search query.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-space-950/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">Reg ID</th>
                    <th className="py-3.5 px-4">Competition</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Participant / Team</th>
                    <th className="py-3.5 px-4">College</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                  {registrations.map((reg) => {
                    const isTeam = reg.registrationType === 'team';
                    const primaryName = isTeam ? reg.teamLeader?.name : reg.participant?.name;
                    const email = isTeam ? reg.teamLeader?.email : reg.participant?.email;
                    const phone = isTeam ? reg.teamLeader?.phone : reg.participant?.phone;
                    const college = isTeam ? reg.teamLeader?.college : reg.participant?.college;

                    return (
                      <tr
                        key={reg.registrationId || reg._id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                          {reg.registrationId}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-semibold text-white block">{reg.eventName}</span>
                          <span className="text-[10px] font-mono text-slate-400">{reg.eventId}</span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
                              isTeam
                                ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20'
                                : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                            }`}
                          >
                            {isTeam ? `Team (${(reg.members?.length || 0) + 1})` : 'Individual'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isTeam ? (
                            <div>
                              <span className="font-bold text-amber-300 block">{reg.teamName}</span>
                              <span className="text-xs text-slate-400">Leader: {primaryName}</span>
                            </div>
                          ) : (
                            <span className="font-semibold text-slate-200">{primaryName}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 max-w-[180px] truncate text-slate-300" title={college}>
                          {college}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs whitespace-nowrap">
                          <div className="text-slate-300">{email}</div>
                          <div className="text-slate-500">{phone}</div>
                        </td>

                        <td className="py-3.5 px-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                          {new Date(reg.registeredAt || reg.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setActiveDetail(reg)}
                              className="p-1.5 rounded-lg text-slate-300 hover:text-amber-300 hover:bg-white/5 border border-white/5 transition-colors"
                              title="View full registration details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(reg.registrationId)}
                              disabled={deletingId === reg.registrationId}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors disabled:opacity-50"
                              title="Delete registration"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Full Registration Details */}
        {activeDetail && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl bg-space-900 border border-amber-500/30 shadow-2xl text-left">
              <button
                onClick={() => setActiveDetail(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Registration Details
                </span>
                <span className="text-xs font-mono text-slate-400">
                  [{activeDetail.registrationType.toUpperCase()}]
                </span>
              </div>

              <h2 className="text-2xl font-display font-extrabold text-white mb-1">
                {activeDetail.registrationId}
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Competition: <strong className="text-amber-300">{activeDetail.eventName}</strong> ({activeDetail.eventId})
              </p>

              {activeDetail.registrationType === 'team' ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-space-950 border border-white/10">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                      Team Name
                    </span>
                    <span className="text-xl font-display font-bold text-gold-metallic">
                      {activeDetail.teamName}
                    </span>
                  </div>

                  {/* Team Leader */}
                  <div className="p-5 rounded-2xl bg-space-950/80 border border-amber-500/20">
                    <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                      <span className="font-mono text-xs uppercase font-bold text-amber-300">
                        Team Leader (Member 1)
                      </span>
                      <span className="text-[10px] font-mono text-amber-400/80 uppercase">
                        Primary Contact
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Name:</span>
                        <span className="text-white font-semibold">{activeDetail.teamLeader?.name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Email:</span>
                        <span className="text-white font-mono">{activeDetail.teamLeader?.email}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Phone:</span>
                        <span className="text-white font-mono">{activeDetail.teamLeader?.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">College:</span>
                        <span className="text-white">{activeDetail.teamLeader?.college}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Branch & Year:</span>
                        <span className="text-white">
                          {activeDetail.teamLeader?.branch} ({activeDetail.teamLeader?.year})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Other Members */}
                  {activeDetail.members && activeDetail.members.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                        Team Members ({activeDetail.members.length}):
                      </h4>
                      {activeDetail.members.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-space-950/60 border border-white/5 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2"
                        >
                          <div>
                            <span className="text-slate-400 block">Member {idx + 2}:</span>
                            <span className="text-white font-semibold">{m.name}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Email:</span>
                            <span className="text-white font-mono">{m.email}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Phone:</span>
                            <span className="text-white font-mono">{m.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">College / Branch:</span>
                            <span className="text-white">
                              {m.college} ({m.branch}, {m.year})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-space-950/80 border border-white/10 space-y-3 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block text-xs">Full Name:</span>
                      <span className="text-white font-semibold text-base">
                        {activeDetail.participant?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Email:</span>
                      <span className="text-white font-mono">{activeDetail.participant?.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Mobile Number:</span>
                      <span className="text-white font-mono">{activeDetail.participant?.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">College:</span>
                      <span className="text-white">{activeDetail.participant?.college}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Branch:</span>
                      <span className="text-white">{activeDetail.participant?.branch}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-xs">Year of Study:</span>
                      <span className="text-white">{activeDetail.participant?.year}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>
                  Registered on: {new Date(activeDetail.registeredAt || activeDetail.createdAt).toLocaleString()}
                </span>
                <button
                  onClick={() => setActiveDetail(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
