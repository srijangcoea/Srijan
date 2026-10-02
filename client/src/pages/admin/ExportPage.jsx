import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  Database,
  Filter,
} from 'lucide-react';
import { getAllRegistrations } from '../../services/adminService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const EVENTS = [
  { code: 'ALL', name: 'All Events (Combined)' },
  { code: 'HACK', name: 'Hackathon' },
  { code: 'KBC', name: 'KBC Quiz' },
  { code: 'PCB', name: 'PCB Designing' },
  { code: 'CAD', name: 'CAD Modeling' },
  { code: 'BRG', name: 'Bridge Making' },
  { code: 'CIRCUIT', name: 'Circuit Making' },
];

export default function ExportPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [includeMembers, setIncludeMembers] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    getAllRegistrations()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setRegistrations(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const code = (r.eventCode || r.event_code || r.eventId || '').toUpperCase();
      if (selectedEvent !== 'ALL' && !code.includes(selectedEvent)) return false;
      if (selectedStatus !== 'ALL' && r.status !== selectedStatus) return false;
      return true;
    });
  }, [registrations, selectedEvent, selectedStatus]);

  const generateDataRows = () => {
    return filtered.map((r, idx) => {
      const membersText = (r.members || [])
        .map((m, i) => `${i + 1}. ${m.name} (${m.email || ''}, ${m.mobile || ''})`)
        .join(' | ');

      const row = {
        'Sl No': idx + 1,
        'Registration ID': r.registrationId || r.registration_id || r._id,
        'Event Code': r.eventCode || r.event_code || r.eventId,
        'Team Name': r.teamName || r.team_name || 'Individual',
        'Team Size': r.teamSize || r.team_size || (r.members ? r.members.length + 1 : 1),
        'Leader Name': r.leader?.name || r.name || '',
        'Leader Email': r.leader?.email || r.email || '',
        'Leader Mobile': r.leader?.mobile || r.phone || '',
        Department: r.leader?.department || r.department || '',
        Year: r.leader?.year || r.year || '',
        'College / ID': r.leader?.college_id || r.college || '',
        Status: r.status || 'pending',
        'Rejection Reason': r.rejectionReason || '',
        'Submission Timestamp': r.createdAt ? new Date(r.createdAt).toLocaleString() : '',
      };

      if (includeMembers) {
        row['Team Members Details'] = membersText;
      }

      return row;
    });
  };

  const handleExportExcel = () => {
    setExporting(true);
    try {
      const dataRows = generateDataRows();
      const worksheet = XLSX.utils.json_to_sheet(dataRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

      // Generate buffer and trigger download
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `Srijan2026_${selectedEvent}_${selectedStatus}_${Date.now()}.xlsx`);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const dataRows = generateDataRows();
      const worksheet = XLSX.utils.json_to_sheet(dataRows);
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `Srijan2026_${selectedEvent}_${selectedStatus}_${Date.now()}.csv`);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-white/[0.06]">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Data Export Center
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            CSV & EXCEL
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate clean spreadsheets and comma-separated records for desk rosters, certificates, and event audits.
        </p>
      </div>

      {/* Export Config Card */}
      <div className="rounded-xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-sm p-6 space-y-6 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Filter size={16} className="text-cyan-400" />
          Export Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Event Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Competition
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500/50"
            >
              {EVENTS.map((ev) => (
                <option key={ev.code} value={ev.code} className="bg-slate-900 text-white">
                  {ev.name} ({ev.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Filter by Registration Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500/50"
            >
              <option value="ALL" className="bg-slate-900">All Statuses (Confirmed, Pending, Rejected)</option>
              <option value="confirmed" className="bg-slate-900">Confirmed Only</option>
              <option value="pending" className="bg-slate-900">Pending Review Only</option>
              <option value="rejected" className="bg-slate-900">Rejected Only</option>
            </select>
          </div>
        </div>

        {/* Options */}
        <div className="pt-4 border-t border-white/[0.06] space-y-3">
          <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeMembers}
              onChange={(e) => setIncludeMembers(e.target.checked)}
              className="rounded border-white/20 bg-slate-800 text-cyan-500 focus:ring-0"
            />
            <span>Include full team members roster in output column</span>
          </label>
        </div>

        {/* Summary Box */}
        <div className="p-4 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database size={20} className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-400">Total Records to Export</p>
              <p className="text-lg font-bold text-white">
                {loading ? 'Calculating...' : `${filtered.length} Registrations`}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-300">
            Target: {selectedEvent} | Status: {selectedStatus}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleExportExcel}
            disabled={filtered.length === 0 || exporting}
            className="flex-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={18} />
            <span>Download Excel Workbook (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0 || exporting}
            className="flex-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileText size={18} className="text-cyan-400" />
            <span>Download Comma-Separated (.csv)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
