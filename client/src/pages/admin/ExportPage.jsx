import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileCheck2,
  Database,
  Filter,
} from 'lucide-react';
import { getAllRegistrations, getAttendance } from '../../services/adminService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { notify } from '../../utils/toast';
import { generatePdf } from '../../utils/pdfExport';

const EVENTS = [
  { code: 'ALL', name: 'All Events (Combined)' },
  { code: 'HACK', name: 'Hackathon' },
  { code: 'KBC', name: 'KBC Quiz' },
  { code: 'PCB', name: 'PCB Designing' },
  { code: 'CAD', name: 'CAD Modeling' },
  { code: 'BRG', name: 'Bridge Making' },
  { code: 'CIRCUIT', name: 'Circuit Making' },
];

const REPORT_TYPES = [
  { value: 'registration', label: 'Registration Report' },
  { value: 'participant', label: 'Participant Report' },
  { value: 'event', label: 'Event-wise Report' },
  { value: 'team', label: 'Team Report' },
  { value: 'attendance', label: 'Attendance Report' },
  { value: 'certificate', label: 'Certificate Eligibility Report' },
];

export default function ExportPage() {
  const [registrations, setRegistrations] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('registration');
  const [includeMembers, setIncludeMembers] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    Promise.all([
      getAllRegistrations().catch(() => ({ success: false, data: [] })),
      getAttendance().catch(() => ({ success: false, data: [] })),
    ])
      .then(([regRes, attRes]) => {
        if (regRes.success && Array.isArray(regRes.data)) {
          setRegistrations(regRes.data);
        }
        if (attRes.success && Array.isArray(attRes.data)) {
          setAttendance(attRes.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const inDateRange = (dateVal) => {
    if (!startDate && !endDate) return true;
    if (!dateVal) return false;
    const d = new Date(dateVal);
    if (isNaN(d)) return false;
    if (startDate) {
      const s = new Date(startDate);
      s.setHours(0, 0, 0, 0);
      if (d < s) return false;
    }
    if (endDate) {
      const e = new Date(endDate);
      e.setHours(23, 59, 59, 999);
      if (d > e) return false;
    }
    return true;
  };

  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const code = (r.eventCode || r.event_code || r.eventId || '').toUpperCase();
      if (selectedEvent !== 'ALL' && !code.includes(selectedEvent)) return false;
      if (!inDateRange(r.createdAt)) return false;
      return true;
    });
  }, [registrations, selectedEvent, startDate, endDate]);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((a) => {
      const code = (a.eventId || a.eventCode || a.eventName || '').toUpperCase();
      if (selectedEvent !== 'ALL' && !code.includes(selectedEvent)) return false;
      if (!inDateRange(a.markedAt || a.updatedAt || a.createdAt)) return false;
      return true;
    });
  }, [attendance, selectedEvent, startDate, endDate]);

  const generateDataRows = () => {
    return filtered.map((r, idx) => {
      const lead = r.teamLeader || r.participant || r.leader;
      const membersText = (r.members || [])
        .map((m, i) => `${i + 1}. ${m.name} (${m.email || ''}, ${m.phone || m.mobile || ''}, ${m.branch || m.department || ''})`)
        .join(' | ');

      const row = {
        'Sl No': idx + 1,
        'Registration ID': r.registrationId || r.registration_id || r._id,
        'Event Code': r.eventCode || r.event_code || r.eventId,
        'Event Name': r.eventName || '',
        'Team Name': r.teamName || r.team_name || 'Individual',
        'Team Size': r.teamSize || r.team_size || (r.members ? r.members.length + 1 : 1),
        'Leader / Participant Name': lead?.name || r.name || '',
        'Leader / Participant Email': lead?.email || r.email || '',
        'Leader / Participant Mobile': lead?.phone || lead?.mobile || r.phone || '',
        Department: lead?.department || lead?.branch || r.department || '',
        Year: lead?.year || r.year || '',
        College: lead?.college || r.college || 'Government College of Engineering, Amravati',
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
      if (dataRows.length === 0) {
        notify.warning('No Records', 'No registrations match your export criteria');
        return;
      }
      const worksheet = XLSX.utils.json_to_sheet(dataRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

      // Generate buffer and trigger download
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `Srijan2026_${selectedEvent}_${Date.now()}.xlsx`);
      notify.success('Excel Generated', `Exported ${dataRows.length} records successfully`);
    } catch (err) {
      notify.error('Export Failed', err.message || 'Could not export Excel file');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const dataRows = generateDataRows();
      if (dataRows.length === 0) {
        notify.warning('No Records', 'No registrations match your export criteria');
        return;
      }
      const worksheet = XLSX.utils.json_to_sheet(dataRows);
      const csvOutput = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `Srijan2026_${selectedEvent}_${Date.now()}.csv`);
      notify.success('CSV Generated', `Exported ${dataRows.length} records successfully`);
    } catch (err) {
      notify.error('Export Failed', err.message || 'Could not export CSV file');
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    const hasData = reportType === 'attendance' ? filteredAttendance.length > 0 : filtered.length > 0;
    if (!hasData) {
      notify.warning('No Records', 'No records match your selected filters');
      return;
    }
    setPdfGenerating(true);
    try {
      await generatePdf(
        reportType,
        { registrations: filtered, attendance: filteredAttendance },
        { event: selectedEvent, startDate, endDate }
      );
      notify.success('PDF Generated', 'Official Srijan 2026 PDF report downloaded');
    } catch (err) {
      notify.error('PDF Export Failed', err.message || 'Could not generate PDF report');
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-white/[0.06]">
        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Data Export Center
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            PDF, CSV &amp; EXCEL
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate official printable PDF reports, Excel workbooks, and CSV records for desk rosters, attendance, and certificates.
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

          {/* PDF Report Type Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              PDF Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500/50"
            >
              {REPORT_TYPES.map((rt) => (
                <option key={rt.value} value={rt.value} className="bg-slate-900 text-white">
                  {rt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filters */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              From Date (Optional)
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              To Date (Optional)
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white outline-none focus:border-cyan-500/50"
            />
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
            <span>Include full team members roster in Excel/CSV output column</span>
          </label>
        </div>

        {/* Summary Box */}
        <div className="p-4 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database size={20} className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-400">Total Records to Export</p>
              <p className="text-lg font-bold text-white">
                {loading
                  ? 'Calculating...'
                  : reportType === 'attendance'
                    ? `${filteredAttendance.length} Attendance Records`
                    : `${filtered.length} Registrations`}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-300">
            Target: {selectedEvent}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={handleExportPDF}
            disabled={
              loading ||
              pdfGenerating ||
              (reportType === 'attendance' ? filteredAttendance.length === 0 : filtered.length === 0)
            }
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileCheck2 size={18} />
            <span>{pdfGenerating ? 'Generating PDF...' : 'Download PDF Report (.pdf)'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            disabled={filtered.length === 0 || exporting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-teal-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet size={18} />
            <span>Excel Workbook (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0 || exporting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileText size={18} className="text-cyan-400" />
            <span>Comma-Separated (.csv)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
