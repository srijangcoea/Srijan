import React, { useState, useEffect, useMemo } from 'react';
import {
  FileCheck2,
  Database,
  Filter,
  Users,
  UserCheck,
  Trophy,
  ClipboardCheck,
  Award,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { getAllRegistrations, getAttendance, getCachedData } from '../../services/adminService';
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
  { value: 'registration', label: 'Registrations', desc: 'All entries & leaders', icon: Layers },
  { value: 'participant', label: 'Participants', desc: 'Full attendee directory', icon: Users },
  { value: 'event', label: 'Event-wise', desc: 'Breakdown per event', icon: Trophy },
  { value: 'team', label: 'Teams', desc: 'Team rosters & sizes', icon: UserCheck },
  { value: 'attendance', label: 'Attendance', desc: 'Desk check-in log', icon: ClipboardCheck },
  { value: 'certificate', label: 'Certificates', desc: 'Eligibility roster', icon: Award },
];

export default function ExportPage() {
  const cachedRegs = getCachedData('registrations')?.data;
  const cachedAtt = getCachedData('attendance')?.data;
  const [registrations, setRegistrations] = useState(Array.isArray(cachedRegs) ? cachedRegs : []);
  const [attendance, setAttendance] = useState(Array.isArray(cachedAtt) ? cachedAtt : []);
  const [loading, setLoading] = useState(!(Array.isArray(cachedRegs) && Array.isArray(cachedAtt)));
  const [selectedEvent, setSelectedEvent] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('registration');
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

  const activeCount = reportType === 'attendance' ? filteredAttendance.length : filtered.length;
  const activeReport = REPORT_TYPES.find((rt) => rt.value === reportType);
  const hasFilters = selectedEvent !== 'ALL' || startDate || endDate;

  return (
    <div className="space-y-4 max-w-3xl">
      {/* Header */}
      <div className="pb-2 border-b border-white/[0.07] flex items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            Data Export Center
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25">
              PDF
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Official A4 printable PDF reports for desk rosters, attendance &amp; certificates.
          </p>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setSelectedEvent('ALL');
              setStartDate('');
              setEndDate('');
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-slate-300 hover:text-amber-300 hover:border-amber-500/30 transition-colors shrink-0"
          >
            <RotateCcw size={11} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Export Config Card */}
      <div className="rounded-xl cosmic-glass p-4 sm:p-5 space-y-4 shadow-xl">
        {/* Report Type Selector Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-display text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Filter size={13} className="text-amber-400" />
              1. Choose Report Format
            </label>
            <span className="text-[10px] font-mono text-slate-500">A4 Printable</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {REPORT_TYPES.map((rt) => {
              const Icon = rt.icon;
              const active = reportType === rt.value;
              return (
                <button
                  key={rt.value}
                  type="button"
                  onClick={() => setReportType(rt.value)}
                  className={`text-left p-2.5 rounded-lg border transition-all flex items-start gap-2.5 ${
                    active
                      ? 'bg-gradient-to-br from-amber-500/15 to-orange-500/5 border-amber-500/40 shadow-[0_0_14px_-4px_rgba(245,158,11,0.3)]'
                      : 'bg-space-950/50 border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.03]'
                  }`}
                >
                  <div
                    className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                      active ? 'bg-amber-500/20 text-amber-400' : 'bg-white/[0.04] text-slate-400'
                    }`}
                  >
                    <Icon size={13} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold leading-tight truncate ${active ? 'text-amber-300' : 'text-slate-200'}`}>
                      {rt.label}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-tight mt-0.5 truncate">
                      {rt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters Row: Competition + Date Range */}
        <div className="pt-3 border-t border-white/[0.06]">
          <label className="block font-display text-xs font-bold text-white uppercase tracking-wider mb-2">
            2. Scope &amp; Date Filters
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Competition
              </label>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg bg-space-950/70 border border-white/[0.08] text-xs text-white outline-none focus:border-amber-500/50"
              >
                {EVENTS.map((ev) => (
                  <option key={ev.code} value={ev.code} className="bg-space-900 text-white">
                    {ev.name} ({ev.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg bg-space-950/70 border border-white/[0.08] text-xs text-white outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg bg-space-950/70 border border-white/[0.08] text-xs text-white outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Compact Summary Bar */}
        <div className="p-3 rounded-lg bg-amber-500/[0.05] border border-amber-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-md bg-amber-500/15 text-amber-400 shrink-0">
              <Database size={15} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Ready to Export</p>
              <p className="text-sm font-bold text-white truncate">
                {loading
                  ? 'Calculating...'
                  : `${activeCount} ${reportType === 'attendance' ? 'Attendance Records' : 'Registrations'}`}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-space-950/70 border border-amber-500/20 text-amber-300">
              {activeReport?.label} · {selectedEvent}
            </span>
          </div>
        </div>

        {/* Action Button — PDF only */}
        <button
          onClick={handleExportPDF}
          disabled={loading || pdfGenerating || activeCount === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-space-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-500 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FileCheck2 size={15} />
          <span>{pdfGenerating ? 'Generating PDF...' : `Download ${activeReport?.label || 'PDF'} Report (.pdf)`}</span>
        </button>
      </div>
    </div>
  );
}
