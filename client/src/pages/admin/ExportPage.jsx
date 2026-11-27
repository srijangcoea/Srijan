import React, { useState, useEffect, useMemo } from 'react';
import {
  FileCheck2,
  Database,
  Filter,
} from 'lucide-react';
import { getAllRegistrations, getAttendance } from '../../services/adminService';
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
            PDF
          </span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate official printable PDF reports for desk rosters, attendance, and certificates.
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
              Report Type
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

        {/* Action Button — PDF only */}
        <button
          onClick={handleExportPDF}
          disabled={
            loading ||
            pdfGenerating ||
            (reportType === 'attendance' ? filteredAttendance.length === 0 : filtered.length === 0)
          }
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:from-indigo-400 hover:to-blue-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FileCheck2 size={18} />
          <span>{pdfGenerating ? 'Generating PDF...' : 'Download PDF Report (.pdf)'}</span>
        </button>
      </div>
    </div>
  );
}
