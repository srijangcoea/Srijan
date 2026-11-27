import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Trash2,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  Layers,
  ChevronDown,
  Search,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  LayoutGrid,
  Table2,
} from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import DetailDrawer from '../../components/admin/DetailDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
  getAllRegistrations,
  bulkDeleteRegistrations,
  deleteRegistration,
  getCachedData,
} from '../../services/adminService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { notify } from '../../utils/toast';

const EVENT_TABS = [
  { code: 'ALL', label: 'All Events' },
  { code: 'HACK', label: 'Hackathon' },
  { code: 'KBC', label: 'KBC Quiz' },
  { code: 'PCB', label: 'PCB Design' },
  { code: 'CAD', label: 'CAD Model' },
  { code: 'BRG', label: 'Bridge Making' },
  { code: 'CIRCUIT', label: 'Circuit Making' },
];

export default function RegistrationsPage() {
  const cachedRegs = getCachedData('registrations')?.data;
  const [registrations, setRegistrations] = useState(Array.isArray(cachedRegs) ? cachedRegs : []);
  const [loading, setLoading] = useState(!Array.isArray(cachedRegs));
  const [activeTab, setActiveTab] = useState('ALL');
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [selectedReg, setSelectedReg] = useState(null);
  const [desktopView, setDesktopView] = useState('table'); // 'table' | 'cards'

  // Filters
  const [yearFilter, setYearFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    variant: 'danger',
    onConfirm: () => {},
  });

  const fetchData = async (force = false) => {
    if (!registrations.length) setLoading(true);
    try {
      const res = await getAllRegistrations({}, { force });
      if (res.success && Array.isArray(res.data)) {
        setRegistrations(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch registrations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false);
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return registrations.filter((reg) => {
      const lead = reg.teamLeader || reg.participant || reg.leader;
      const eventCode = (reg.eventCode || reg.event_code || reg.eventId || '').toUpperCase();

      // Event tab filter
      if (activeTab !== 'ALL') {
        const tabMatch =
          eventCode === activeTab ||
          eventCode.includes(activeTab) ||
          (activeTab === 'HACK' && (eventCode.includes('HACK') || reg.eventId === 'event-1')) ||
          (activeTab === 'KBC' && (eventCode.includes('KBC') || reg.eventId === 'event-2')) ||
          (activeTab === 'PCB' && (eventCode.includes('PCB') || reg.eventId === 'event-3')) ||
          (activeTab === 'CAD' && (eventCode.includes('CAD') || reg.eventId === 'event-4')) ||
          (activeTab === 'BRG' && (eventCode.includes('BRG') || reg.eventId === 'event-5')) ||
          (activeTab === 'CIRCUIT' && (eventCode.includes('CIRCUIT') || reg.eventId === 'event-6'));
        if (!tabMatch) return false;
      }

      // Year filter
      const leaderYear = lead?.year || reg.year || '';
      if (yearFilter !== 'ALL' && leaderYear !== yearFilter) {
        return false;
      }

      // Department filter
      const leaderDept = (lead?.department || lead?.branch || reg.department || '').toLowerCase();
      if (deptFilter !== 'ALL' && !leaderDept.includes(deptFilter.toLowerCase())) {
        return false;
      }

      // Date range filter
      if (dateRange.start && new Date(reg.createdAt) < new Date(dateRange.start)) {
        return false;
      }
      if (dateRange.end) {
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        if (new Date(reg.createdAt) > endDate) {
          return false;
        }
      }

      // Global search string
      if (globalFilter.trim()) {
        const query = globalFilter.toLowerCase();
        const regId = (reg.registrationId || reg.registration_id || reg._id || '').toLowerCase();
        const teamName = (reg.teamName || reg.team_name || '').toLowerCase();
        const leaderName = (lead?.name || reg.name || '').toLowerCase();
        const leaderEmail = (lead?.email || reg.email || '').toLowerCase();
        const leaderMobile = (lead?.phone || lead?.mobile || reg.phone || '').toLowerCase();
        const leaderCollege = (lead?.college || reg.college || '').toLowerCase();

        return (
          regId.includes(query) ||
          teamName.includes(query) ||
          leaderName.includes(query) ||
          leaderEmail.includes(query) ||
          leaderMobile.includes(query) ||
          leaderCollege.includes(query)
        );
      }

      return true;
    });
  }, [registrations, activeTab, yearFilter, deptFilter, dateRange, globalFilter]);

  // Bulk Actions
  const selectedRowsList = useMemo(() => {
    return Object.keys(rowSelection).map((index) => filteredData[Number(index)]).filter(Boolean);
  }, [rowSelection, filteredData]);

  const handleBulkDelete = () => {
    const ids = selectedRowsList.map((r) => r._id || r.id);
    if (ids.length === 0) return;

    setConfirmDialog({
      open: true,
      title: 'Bulk Delete Registrations',
      message: `Are you sure you want to permanently delete ${ids.length} selected registration(s)? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await bulkDeleteRegistrations(ids);
          setConfirmDialog((prev) => ({ ...prev, open: false }));
          setRowSelection({});
          fetchData();
          notify.info('Deleted', `Permanently removed ${ids.length} registration(s)`);
        } catch (err) {
          notify.error('Delete Failed', err.message || 'Could not delete registrations');
        }
      },
    });
  };

  const handleExportSelected = () => {
    const rows = selectedRowsList.length > 0 ? selectedRowsList : filteredData;
    if (rows.length === 0) {
      notify.warning('No Records', 'No registrations available to export');
      return;
    }
    const exportData = rows.map((r) => {
      const lead = r.teamLeader || r.participant || r.leader;
      return {
        'Registration ID': r.registrationId || r.registration_id || r._id,
        Event: r.eventName || r.eventCode || r.eventId,
        'Team Name': r.teamName || r.team_name || 'Individual',
        'Team Size': r.teamSize || r.team_size || (r.members ? r.members.length + 1 : 1),
        'Leader / Participant Name': lead?.name || r.name || '',
        'Leader / Participant Email': lead?.email || r.email || '',
        'Leader / Participant Mobile': lead?.phone || lead?.mobile || r.phone || '',
        Department: lead?.department || lead?.branch || r.department || '',
        Year: lead?.year || r.year || '',
        College: lead?.college || r.college || '',
        'Date Submitted': r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `Srijan_Registrations_${activeTab}_${Date.now()}.xlsx`);
    notify.success('Export Ready', `Downloaded Excel report with ${exportData.length} records`);
  };

  // Table Columns
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => {
              e.stopPropagation();
              row.toggleSelected();
            }}
            className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer"
          />
        ),
        size: 38,
      },
      {
        accessorKey: 'registrationId',
        header: 'Reg ID',
        cell: ({ row }) => (
          <span className="font-mono font-bold text-cyan-400 whitespace-nowrap">
            {row.original.registrationId || row.original.registration_id || row.original._id?.slice(-6)}
          </span>
        ),
      },
      {
        accessorKey: 'eventCode',
        header: 'Event',
        cell: ({ row }) => (
          <span className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/[0.08] text-slate-200 font-semibold text-xs whitespace-nowrap inline-block">
            {row.original.eventName || row.original.eventCode || row.original.event_code || row.original.eventId}
          </span>
        ),
      },
      {
        id: 'teamLeader',
        header: 'Participant / Team',
        cell: ({ row }) => {
          const r = row.original;
          const lead = r.teamLeader || r.participant || r.leader;
          const isTeam = r.registrationType === 'team' || r.teamName || (r.members && r.members.length > 0);
          return (
            <div className="min-w-[160px]">
              <div className="font-semibold text-white text-xs flex items-center gap-1.5 flex-wrap">
                <span>{r.teamName || r.team_name || lead?.name || r.name || 'Participant'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isTeam
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20'
                    : 'bg-slate-800 text-slate-400 border border-white/10'
                }`}>
                  {isTeam ? `Team (${(r.members?.length || 0) + 1})` : 'Solo'}
                </span>
              </div>
              {isTeam && (
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Lead: <span className="text-slate-300">{lead?.name || r.name || '—'}</span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        id: 'contact',
        header: 'Contact Info',
        cell: ({ row }) => {
          const r = row.original;
          const lead = r.teamLeader || r.participant || r.leader;
          return (
            <div className="text-xs space-y-0.5 min-w-[170px]">
              <div className="text-slate-200 truncate max-w-[200px]" title={lead?.email || r.email}>
                {lead?.email || r.email || '—'}
              </div>
              <div className="text-slate-400 font-mono text-[11px]">
                {lead?.phone || lead?.mobile || r.phone || '—'}
              </div>
            </div>
          );
        },
      },
      {
        id: 'deptYear',
        header: 'College & Dept',
        cell: ({ row }) => {
          const r = row.original;
          const lead = r.teamLeader || r.participant || r.leader;
          const dept = lead?.department || lead?.branch || r.department || '—';
          const year = lead?.year || r.year || '—';
          const college = lead?.college || r.college || '';
          return (
            <div className="text-xs min-w-[150px]">
              <div className="text-slate-200 font-medium truncate max-w-[180px]" title={college || `${dept} / ${year}`}>
                {college || `${dept} • ${year}`}
              </div>
              <div className="text-[11px] text-slate-400">
                {dept} <span className="text-slate-600">/</span> {year}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Submitted',
        cell: ({ row }) => {
          const d = row.original.createdAt;
          return (
            <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
              {d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 70,
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedReg(row.original)}
              className="p-1 rounded hover:bg-white/10 text-cyan-400 transition-colors"
              title="View full registration details"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => {
                setConfirmDialog({
                  open: true,
                  title: 'Delete Registration',
                  message: `Permanently delete registration for "${row.original.teamName || row.original.leader?.name || 'this participant'}"?`,
                  variant: 'danger',
                  onConfirm: async () => {
                    await deleteRegistration(row.original._id || row.original.id);
                    setConfirmDialog((prev) => ({ ...prev, open: false }));
                    fetchData();
                  },
                });
              }}
              className="p-1 rounded hover:bg-red-500/20 text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ),
      },
    ],
    [filteredData]
  );

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.07]">
        <div>
          <h1 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Registrations Management
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
              {filteredData.length} records
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Filter, inspect leader and team compositions, and batch export.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Desktop View Toggle */}
          <div className="hidden md:flex items-center p-0.5 rounded-lg bg-space-900/70 border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setDesktopView('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                desktopView === 'table'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Table View"
            >
              <Table2 size={13} />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => setDesktopView('cards')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                desktopView === 'cards'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Cards View"
            >
              <LayoutGrid size={13} />
              <span>Cards</span>
            </button>
          </div>

          <button
            onClick={() => fetchData(true)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-space-900/70 border border-white/[0.08] text-xs text-slate-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-amber-400' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExportSelected}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
          >
            <Download size={14} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Event Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-white/[0.07]">
        {EVENT_TABS.map((tab) => {
          const isActive = activeTab === tab.code;
          return (
            <button
              key={tab.code}
              onClick={() => {
                setActiveTab(tab.code);
                setRowSelection({});
              }}
              className={`px-3.5 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all duration-150 border-b-2 ${
                isActive
                  ? 'border-amber-400 text-amber-400 bg-amber-500/[0.08]'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Bulk Action Banner */}
      {selectedRowsList.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <Users size={15} />
            <span>
              <strong>{selectedRowsList.length}</strong> registration(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500 text-white font-semibold text-xs hover:bg-red-400 transition-colors shadow-sm"
            >
              <Trash2 size={13} />
              <span>Delete Selected</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Controls Bar */}
      <div className="bg-slate-900/50 border border-white/[0.06] rounded-xl p-3 space-y-2.5">
        {/* Search bar for mobile & cards view */}
        <div className={`${desktopView === 'cards' ? 'block' : 'block md:hidden'} relative`}>
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search by Reg ID, name, team, email, phone, or college..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/40"
          />
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Year Filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-cyan-500/40"
          >
            <option value="ALL" className="bg-slate-900">All Years</option>
            <option value="1st" className="bg-slate-900">1st Year</option>
            <option value="2nd" className="bg-slate-900">2nd Year</option>
            <option value="3rd" className="bg-slate-900">3rd Year</option>
            <option value="4th" className="bg-slate-900">4th Year</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="col-span-2 sm:col-span-1 bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-cyan-500/40"
          >
            <option value="ALL" className="bg-slate-900">All Departments</option>
            <option value="CSE" className="bg-slate-900">Computer Science</option>
            <option value="IT" className="bg-slate-900">Information Technology</option>
            <option value="ENTC" className="bg-slate-900">Electronics & Telecomm</option>
            <option value="MECH" className="bg-slate-900">Mechanical</option>
            <option value="CIVIL" className="bg-slate-900">Civil</option>
            <option value="ELECT" className="bg-slate-900">Electrical</option>
          </select>

          {/* Date Range Inputs */}
          <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="shrink-0">From:</span>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="flex-1 sm:flex-none bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-lg px-2 py-1 text-xs outline-none"
            />
            <span className="shrink-0">To:</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="flex-1 sm:flex-none bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-lg px-2 py-1 text-xs outline-none"
            />
          </div>

          {(yearFilter !== 'ALL' || deptFilter !== 'ALL' || dateRange.start || dateRange.end || globalFilter) && (
            <button
              onClick={() => {
                setYearFilter('ALL');
                setDeptFilter('ALL');
                setDateRange({ start: '', end: '' });
                setGlobalFilter('');
              }}
              className="text-xs text-cyan-400 hover:underline px-2 justify-self-start"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Structured Cards View (Always on mobile < md, optional on desktop) */}
      <div className={desktopView === 'cards' ? 'block' : 'block md:hidden'}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 rounded-xl bg-slate-900/50 border border-white/[0.06] animate-pulse p-4" />
            ))}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/40 p-10 text-center text-slate-400 text-xs">
            No matching registrations found. Try adjusting your filters or search query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredData.map((r, idx) => {
              const lead = r.teamLeader || r.participant || r.leader;
              const isTeam = r.registrationType === 'team' || r.teamName || (r.members && r.members.length > 0);
              const regId = r.registrationId || r.registration_id || r._id?.slice(-6);
              const eventLabel = r.eventName || r.eventCode || r.event_code || r.eventId;
              const dept = lead?.department || lead?.branch || r.department || '—';
              const year = lead?.year || r.year || '—';
              const college = lead?.college || r.college || '—';
              const email = lead?.email || r.email || '—';
              const phone = lead?.phone || lead?.mobile || r.phone || '—';
              const isSelected = Boolean(rowSelection[idx]);

              return (
                <div
                  key={r._id || r.id || idx}
                  onClick={() => setSelectedReg(r)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-500/40'
                      : 'bg-slate-900/60 border-white/[0.08] hover:border-cyan-500/35'
                  }`}
                >
                  {/* Top Row: Checkbox + Reg ID + Event + Team/Solo Badge */}
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          setRowSelection((prev) => {
                            const next = { ...prev };
                            if (e.target.checked) next[idx] = true;
                            else delete next[idx];
                            return next;
                          })
                        }
                        className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-0 cursor-pointer shrink-0"
                      />
                      <span className="font-mono text-xs font-bold text-cyan-400 shrink-0">
                        {regId}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-slate-200 font-semibold text-[11px] truncate">
                        {eventLabel}
                      </span>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono shrink-0 ${
                      isTeam
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                        : 'bg-slate-800 text-slate-400 border border-white/10'
                    }`}>
                      {isTeam ? `Team (${(r.members?.length || 0) + 1})` : 'Solo'}
                    </span>
                  </div>

                  {/* Participant / Team Title */}
                  <div>
                    <h3 className="font-semibold text-sm text-white truncate">
                      {r.teamName || r.team_name || lead?.name || r.name || 'Participant'}
                    </h3>
                    {isTeam && (
                      <p className="text-xs text-slate-400 mt-0.5">
                        Leader: <span className="text-slate-200 font-medium">{lead?.name || r.name || '—'}</span>
                      </p>
                    )}
                  </div>

                  {/* Clean Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-black/20 rounded-lg p-2.5 border border-white/[0.04]">
                    <div className="flex items-center gap-2 text-slate-300 min-w-0">
                      <Mail size={13} className="text-cyan-400 shrink-0" />
                      <span className="truncate">{email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-mono">
                      <Phone size={13} className="text-cyan-400 shrink-0" />
                      <span>{phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 min-w-0">
                      <GraduationCap size={13} className="text-amber-400 shrink-0" />
                      <span className="truncate">{dept} / {year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 min-w-0">
                      <Building2 size={13} className="text-amber-400 shrink-0" />
                      <span className="truncate">{college}</span>
                    </div>
                  </div>

                  {/* Bottom Footer: Date + Actions */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                    <span className="font-mono">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => setSelectedReg(r)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 hover:bg-cyan-500/20 font-medium transition-colors"
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDialog({
                            open: true,
                            title: 'Delete Registration',
                            message: `Permanently delete registration for "${r.teamName || lead?.name || 'this participant'}"?`,
                            variant: 'danger',
                            onConfirm: async () => {
                              await deleteRegistration(r._id || r.id);
                              setConfirmDialog((prev) => ({ ...prev, open: false }));
                              fetchData();
                            },
                          });
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main TanStack Table (Desktop when desktopView === 'table') */}
      <div className={desktopView === 'table' ? 'hidden md:block' : 'hidden'}>
        <DataTable
          data={filteredData}
          columns={columns}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onRowClick={(row) => setSelectedReg(row)}
          initialPageSize={25}
        />
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        registration={selectedReg}
        onClose={() => setSelectedReg(null)}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
