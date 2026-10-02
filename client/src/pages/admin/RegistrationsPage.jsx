import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import DetailDrawer from '../../components/admin/DetailDrawer';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import {
  getAllRegistrations,
  updateRegistrationStatus,
  bulkUpdateStatus,
  bulkDeleteRegistrations,
  deleteRegistration,
} from '../../services/adminService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const [selectedReg, setSelectedReg] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
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
  const [rejectReasonPrompt, setRejectReasonPrompt] = useState({
    open: false,
    ids: [],
    reason: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAllRegistrations();
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
    fetchData();
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return registrations.filter((reg) => {
      // Event tab filter
      const eventCode = (reg.eventCode || reg.event_code || reg.eventId || '').toUpperCase();
      if (activeTab !== 'ALL' && !eventCode.includes(activeTab)) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && reg.status !== statusFilter) {
        return false;
      }

      // Year filter
      const leaderYear = reg.leader?.year || reg.year || '';
      if (yearFilter !== 'ALL' && leaderYear !== yearFilter) {
        return false;
      }

      // Department filter
      const leaderDept = (reg.leader?.department || reg.department || '').toLowerCase();
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
        const leaderName = (reg.leader?.name || reg.name || '').toLowerCase();
        const leaderEmail = (reg.leader?.email || reg.email || '').toLowerCase();
        const leaderMobile = (reg.leader?.mobile || reg.phone || '').toLowerCase();

        return (
          regId.includes(query) ||
          teamName.includes(query) ||
          leaderName.includes(query) ||
          leaderEmail.includes(query) ||
          leaderMobile.includes(query)
        );
      }

      return true;
    });
  }, [registrations, activeTab, statusFilter, yearFilter, deptFilter, dateRange, globalFilter]);

  // Status Change Handler
  const handleStatusChange = async (id, newStatus, reason = '') => {
    try {
      await updateRegistrationStatus(id, newStatus, reason);
      setRegistrations((prev) =>
        prev.map((r) =>
          (r._id === id || r.id === id) ? { ...r, status: newStatus, rejectionReason: reason } : r
        )
      );
      if (selectedReg && (selectedReg._id === id || selectedReg.id === id)) {
        setSelectedReg((prev) => ({ ...prev, status: newStatus, rejectionReason: reason }));
      }
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  // Inline Quick Status Toggle
  const handleQuickStatusCycle = (e, row) => {
    e.stopPropagation();
    const current = row.status || 'pending';
    const nextStatus = current === 'pending' ? 'confirmed' : current === 'confirmed' ? 'rejected' : 'confirmed';
    if (nextStatus === 'rejected') {
      setRejectReasonPrompt({
        open: true,
        ids: [row._id || row.id],
        reason: 'Eligibility or documentation criteria not met',
      });
    } else {
      handleStatusChange(row._id || row.id, nextStatus);
    }
  };

  // Bulk Actions
  const selectedRowsList = useMemo(() => {
    return Object.keys(rowSelection).map((index) => filteredData[Number(index)]).filter(Boolean);
  }, [rowSelection, filteredData]);

  const handleBulkConfirm = async () => {
    const ids = selectedRowsList.map((r) => r._id || r.id);
    if (ids.length === 0) return;
    try {
      await bulkUpdateStatus(ids, 'confirmed');
      setRowSelection({});
      fetchData();
    } catch (err) {
      alert(`Bulk confirm failed: ${err.message}`);
    }
  };

  const handleBulkRejectPrompt = () => {
    const ids = selectedRowsList.map((r) => r._id || r.id);
    if (ids.length === 0) return;
    setRejectReasonPrompt({
      open: true,
      ids,
      reason: 'Batch review rejected by admin',
    });
  };

  const executeBulkReject = async () => {
    try {
      await bulkUpdateStatus(rejectReasonPrompt.ids, 'rejected', rejectReasonPrompt.reason);
      setRejectReasonPrompt({ open: false, ids: [], reason: '' });
      setRowSelection({});
      fetchData();
    } catch (err) {
      alert(`Bulk reject failed: ${err.message}`);
    }
  };

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
        } catch (err) {
          alert(`Delete failed: ${err.message}`);
        }
      },
    });
  };

  const handleExportSelected = () => {
    const rows = selectedRowsList.length > 0 ? selectedRowsList : filteredData;
    const exportData = rows.map((r) => ({
      'Registration ID': r.registrationId || r.registration_id || r._id,
      Event: r.eventName || r.eventCode || r.eventId,
      'Team Name': r.teamName || r.team_name || 'Individual',
      'Team Size': r.teamSize || r.team_size || (r.members ? r.members.length + 1 : 1),
      'Leader Name': r.leader?.name || r.name,
      'Leader Email': r.leader?.email || r.email,
      'Leader Mobile': r.leader?.mobile || r.phone,
      Department: r.leader?.department || r.department || '',
      Year: r.leader?.year || r.year || '',
      College: r.leader?.college_id || r.college || '',
      Status: r.status || 'pending',
      'Rejection Reason': r.rejectionReason || '',
      'Date Submitted': r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `Srijan_Registrations_${activeTab}_${Date.now()}.xlsx`);
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
          <span className="font-mono font-bold text-cyan-400">
            {row.original.registrationId || row.original.registration_id || row.original._id?.slice(-6)}
          </span>
        ),
      },
      {
        accessorKey: 'eventCode',
        header: 'Event',
        cell: ({ row }) => (
          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-200 font-semibold text-[11px]">
            {row.original.eventCode || row.original.event_code || row.original.eventId}
          </span>
        ),
      },
      {
        id: 'teamLeader',
        header: 'Participant / Team',
        cell: ({ row }) => {
          const r = row.original;
          const isTeam = r.teamName || (r.members && r.members.length > 0);
          return (
            <div>
              <div className="font-medium text-white flex items-center gap-1.5">
                <span>{r.teamName || r.team_name || r.leader?.name || r.name}</span>
                {isTeam && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                    Team ({(r.members?.length || 0) + 1})
                  </span>
                )}
              </div>
              {isTeam && (
                <div className="text-[10px] text-slate-500">
                  Lead: {r.leader?.name || r.name}
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
          return (
            <div className="text-[11px]">
              <div className="text-slate-300">{r.leader?.email || r.email || '—'}</div>
              <div className="text-slate-500 font-mono">{r.leader?.mobile || r.phone || '—'}</div>
            </div>
          );
        },
      },
      {
        id: 'deptYear',
        header: 'Dept & Year',
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="text-[11px] text-slate-400">
              <span>{r.leader?.department || r.department || '—'}</span>
              <span className="mx-1 text-slate-600">/</span>
              <span>{r.leader?.year || r.year || '—'}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div
              title="Click to cycle status: Pending -> Confirmed -> Rejected"
              onClick={(e) => handleQuickStatusCycle(e, r)}
            >
              <StatusBadge status={r.status || 'pending'} onClick={(e) => handleQuickStatusCycle(e, r)} />
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
            <span className="text-[11px] text-slate-500 font-mono">
              {d ? new Date(d).toLocaleDateString() : '—'}
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Registrations Management
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {filteredData.length} records
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Filter, inspect leader and team compositions, cycle approval status, and batch export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} />
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
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-white/[0.06]">
        {EVENT_TABS.map((tab) => {
          const isActive = activeTab === tab.code;
          return (
            <button
              key={tab.code}
              onClick={() => {
                setActiveTab(tab.code);
                setRowSelection({});
              }}
              className={`px-3.5 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                isActive
                  ? 'border-cyan-400 text-cyan-400 bg-cyan-500/[0.06]'
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
            <CheckCircle size={15} />
            <span>
              <strong>{selectedRowsList.length}</strong> registration(s) selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkConfirm}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
            >
              <CheckCircle size={13} />
              <span>Confirm</span>
            </button>
            <button
              onClick={handleBulkRejectPrompt}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition-colors shadow-sm"
            >
              <XCircle size={13} />
              <span>Reject</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-500 text-white font-semibold text-xs hover:bg-red-400 transition-colors shadow-sm"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-cyan-500/40"
        >
          <option value="ALL" className="bg-slate-900">All Statuses</option>
          <option value="confirmed" className="bg-slate-900">Confirmed</option>
          <option value="pending" className="bg-slate-900">Pending</option>
          <option value="rejected" className="bg-slate-900">Rejected</option>
        </select>

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
          className="bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-cyan-500/40"
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
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span>From:</span>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
            className="bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-lg px-2 py-1 text-xs outline-none"
          />
          <span>To:</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
            className="bg-white/[0.04] border border-white/[0.08] text-slate-300 rounded-lg px-2 py-1 text-xs outline-none"
          />
        </div>

        {(statusFilter !== 'ALL' || yearFilter !== 'ALL' || deptFilter !== 'ALL' || dateRange.start || dateRange.end) && (
          <button
            onClick={() => {
              setStatusFilter('ALL');
              setYearFilter('ALL');
              setDeptFilter('ALL');
              setDateRange({ start: '', end: '' });
            }}
            className="text-[11px] text-cyan-400 hover:underline px-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Main TanStack Table */}
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

      {/* Detail Drawer */}
      <DetailDrawer
        registration={selectedReg}
        onClose={() => setSelectedReg(null)}
        onStatusChange={handleStatusChange}
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

      {/* Rejection Reason Modal */}
      {rejectReasonPrompt.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setRejectReasonPrompt({ open: false, ids: [], reason: '' })}
          />
          <div className="relative w-full max-w-md bg-slate-900 border border-white/[0.08] rounded-xl p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Provide Rejection Reason</h3>
            <p className="text-xs text-slate-400">
              This note will be recorded in the participant log and audit trail.
            </p>
            <textarea
              value={rejectReasonPrompt.reason}
              onChange={(e) =>
                setRejectReasonPrompt((prev) => ({ ...prev, reason: e.target.value }))
              }
              rows={3}
              placeholder="e.g. Duplicate registration, incomplete details, invalid ID"
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500/50"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectReasonPrompt({ open: false, ids: [], reason: '' })}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeBulkReject}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-400"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
