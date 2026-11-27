/**
 * SRIJAN 2026 — Minimal Professional PDF Export Utility
 * Generates A4 PDF reports using jsPDF + jspdf-autotable
 * Design: Clean white background, dark navy (#1e3a5f) headings, subtle grey dividers,
 * summary cards, clean tables with navy headers & alternating light-grey rows,
 * insights summary, and branded footers with page numbers.
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import sMarkImg from '../assets/srijan-s-mark.png';

// ─── Design Tokens ───────────────────────────────────────────────────────────
const NAVY   = [30, 58, 95];     // #1e3a5f
const GREY   = [100, 116, 139];  // #64748b
const LGREY  = [246, 248, 250];  // #f6f8fa alternating row
const BORDER = [222, 226, 230];  // #dee2e6 subtle divider/border
const WHITE  = [255, 255, 255];
const BLACK  = [15, 23, 42];     // #0f172a
const GREEN  = [22, 163, 74];    // #16a34a
const RED    = [220, 38, 38];    // #dc2626

const PAGE_W = 210;              // A4 portrait mm
const PAGE_H = 297;
const MARGIN = 15;
const CONTENT_W = PAGE_W - MARGIN * 2; // 180mm
const HEADER_BOTTOM = 34;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const fmtDateTime = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const safe = (v) => (v === null || v === undefined || v === '' ? '—' : String(v));

const getEventLabel = (r) =>
  safe(r.eventCode || r.event_code || r.eventId || r.eventName);

const getLeader = (r) => r.teamLeader || r.participant || r.leader || {};

async function loadLogoBase64() {
  try {
    const res = await fetch(sMarkImg);
    if (!res.ok) throw new Error('Logo fetch failed');
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function buildFilterSubtitle(filters = {}) {
  const parts = [];
  if (filters.event && filters.event !== 'ALL') {
    parts.push(`Event: ${filters.event}`);
  } else {
    parts.push('All Events');
  }
  if (filters.startDate || filters.endDate) {
    const from = filters.startDate ? fmtDate(filters.startDate) : 'Start';
    const to = filters.endDate ? fmtDate(filters.endDate) : 'Present';
    parts.push(`Range: ${from} – ${to}`);
  }
  return parts.join('  |  ');
}

// ─── Header & Footer ─────────────────────────────────────────────────────────
function addHeader(doc, logo, reportTitle, reportSubtitle) {
  const y0 = 10;

  if (logo) {
    doc.addImage(logo, 'PNG', MARGIN, y0, 17, 17);
  }

  const textX = logo ? MARGIN + 21 : MARGIN;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...NAVY);
  doc.text('SRIJAN 2026', textX, y0 + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...GREY);
  doc.text('Electronics & Telecommunication Academic Society', textX, y0 + 11.5);
  doc.text('Government College of Engineering, Amravati', textX, y0 + 15.5);

  // Right side: Report Title + Generated timestamp + Filter context
  const genDate = fmtDateTime(new Date());
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...NAVY);
  doc.text(reportTitle, PAGE_W - MARGIN, y0 + 6.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text(`Generated: ${genDate}`, PAGE_W - MARGIN, y0 + 11.5, { align: 'right' });
  if (reportSubtitle) {
    doc.text(reportSubtitle, PAGE_W - MARGIN, y0 + 15.5, { align: 'right' });
  }

  // Subtle navy header divider
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 30, PAGE_W - MARGIN, 30);

  return HEADER_BOTTOM;
}

function addReportIntro(doc, y, title, description) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...NAVY);
  doc.text(title, MARGIN, y + 2);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...GREY);
  doc.text(description, MARGIN, y + 7);

  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y + 10, PAGE_W - MARGIN, y + 10);

  return y + 15;
}

function addFooters(doc, reportName) {
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    const y = PAGE_H - 9;
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y - 3.5, PAGE_W - MARGIN, y - 3.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GREY);
    doc.text(`SRIJAN 2026 — ${reportName}`, MARGIN, y);
    doc.text('GCOEA, Amravati', PAGE_W / 2, y, { align: 'center' });
    doc.text(`Page ${i} of ${total}`, PAGE_W - MARGIN, y, { align: 'right' });
  }
}

// ─── Summary Cards ────────────────────────────────────────────────────────────
function addSummaryCards(doc, startY, cards) {
  const cardCount = Math.min(cards.length, 4);
  const gap = 4;
  const cardW = (CONTENT_W - gap * (cardCount - 1)) / cardCount;
  const cardH = 16;
  let x = MARGIN;

  cards.slice(0, cardCount).forEach(({ label, value }) => {
    doc.setDrawColor(...BORDER);
    doc.setFillColor(250, 251, 252);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, startY, cardW, cardH, 1.5, 1.5, 'FD');

    // Clean top navy accent strip
    doc.setFillColor(...NAVY);
    doc.rect(x, startY, cardW, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(...NAVY);
    doc.text(String(value), x + cardW / 2, startY + 9.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...GREY);
    doc.text(label.toUpperCase(), x + cardW / 2, startY + 13.8, { align: 'center' });

    x += cardW + gap;
  });

  return startY + cardH + 7;
}

// ─── Section Title & Insights Box ─────────────────────────────────────────────
function addSectionTitle(doc, y, title) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...NAVY);
  doc.text(title.toUpperCase(), MARGIN, y);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y + 1.8, PAGE_W - MARGIN, y + 1.8);
  return y + 5.5;
}

function addInsightsSection(doc, logo, reportTitle, subtitle, insights = []) {
  if (!insights.length) return;
  let y = (doc.lastAutoTable?.finalY || 60) + 8;
  const boxH = 10 + insights.length * 5.2;

  if (y + boxH > PAGE_H - 18) {
    doc.addPage();
    y = addHeader(doc, logo, reportTitle, subtitle) + 2;
  }

  doc.setDrawColor(...BORDER);
  doc.setFillColor(248, 250, 252);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, boxH, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text('KEY INSIGHTS & SUMMARY', MARGIN + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...BLACK);
  insights.forEach((line, idx) => {
    doc.text(`•  ${line}`, MARGIN + 4, y + 10.5 + idx * 5);
  });
}

// ─── Shared AutoTable Options ─────────────────────────────────────────────────
function makeTableOptions(logo, reportTitle, subtitle, startY, columns, body, columnStyles, extra = {}) {
  return {
    startY,
    columns,
    body,
    columnStyles,
    theme: 'grid',
    showHead: 'everyPage',
    margin: { left: MARGIN, right: MARGIN, top: HEADER_BOTTOM + 2, bottom: 16 },
    tableLineColor: BORDER,
    tableLineWidth: 0.2,
    headStyles: {
      fillColor: NAVY,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 7.5,
      cellPadding: { top: 2.8, bottom: 2.8, left: 2.5, right: 2.5 },
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.2,
      textColor: BLACK,
      cellPadding: { top: 2.3, bottom: 2.3, left: 2.5, right: 2.5 },
      overflow: 'linebreak',
      valign: 'middle',
    },
    alternateRowStyles: {
      fillColor: LGREY,
    },
    didDrawPage: (data) => {
      if (data.pageNumber > 1) {
        addHeader(doc, logo, reportTitle, subtitle);
      }
    },
    ...extra,
  };
}

// ─── 1. Registration Report ───────────────────────────────────────────────────
function buildRegistrationReport(doc, logo, registrations, filters) {
  const subtitle = buildFilterSubtitle(filters);
  let y = addHeader(doc, logo, 'Registration Report', subtitle);
  y = addReportIntro(
    doc,
    y,
    'Registration Report',
    'Official roster of all competition registrations with team/leader contact details.'
  );

  const total = registrations.length;
  const teams = registrations.filter(
    (r) => r.registrationType === 'team' || r.teamSize > 1 || (r.members && r.members.length > 0)
  ).length;
  const individuals = total - teams;
  const totalParticipants = registrations.reduce(
    (sum, r) => sum + (r.teamSize || (r.members ? r.members.length + 1 : 1)),
    0
  );

  y = addSummaryCards(doc, y, [
    { label: 'Total Registrations', value: total },
    { label: 'Total Participants', value: totalParticipants },
    { label: 'Team Entries', value: teams },
    { label: 'Individual Entries', value: individuals },
  ]);

  y = addSectionTitle(doc, y, 'Registration Records');

  const columns = [
    { header: '#', dataKey: 'sl' },
    { header: 'Reg. ID', dataKey: 'regId' },
    { header: 'Event', dataKey: 'event' },
    { header: 'Team / Type', dataKey: 'team' },
    { header: 'Leader / Participant', dataKey: 'leader' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Phone', dataKey: 'phone' },
    { header: 'Registered', dataKey: 'date' },
  ];

  const rows = registrations.map((r, i) => {
    const lead = getLeader(r);
    return {
      sl: i + 1,
      regId: safe(r.registrationId || r.registration_id || r._id),
      event: getEventLabel(r),
      team: safe(r.teamName || r.team_name || 'Individual'),
      leader: safe(lead.name || r.name),
      email: safe(lead.email || r.email),
      phone: safe(lead.phone || lead.mobile || r.phone),
      date: fmtDate(r.createdAt),
    };
  });

  autoTable(
    doc,
    makeTableOptions(doc, logo, 'Registration Report', subtitle, y, columns, rows, {
      sl: { cellWidth: 8, halign: 'center' },
      regId: { cellWidth: 25 },
      event: { cellWidth: 16 },
      team: { cellWidth: 26 },
      leader: { cellWidth: 28 },
      email: { cellWidth: 37 },
      phone: { cellWidth: 21 },
      date: { cellWidth: 19 },
    })
  );

  // Insights
  const eventCounts = {};
  registrations.forEach((r) => {
    const ev = getEventLabel(r);
    eventCounts[ev] = (eventCounts[ev] || 0) + 1;
  });
  const topEvent = Object.entries(eventCounts).sort((a, b) => b[1] - a[1])[0];
  const insights = [
    `Total ${total} registrations representing ${totalParticipants} individual participants.`,
    `Team entries account for ${total ? Math.round((teams / total) * 100) : 0}% (${teams}) vs ${individuals} individual entries.`,
  ];
  if (topEvent) {
    insights.push(`Highest participation event in this export: ${topEvent[0]} (${topEvent[1]} registrations).`);
  }
  addInsightsSection(doc, logo, 'Registration Report', subtitle, insights);
}

// ─── 2. Participant Report ────────────────────────────────────────────────────
function buildParticipantReport(doc, logo, registrations, filters) {
  const subtitle = buildFilterSubtitle(filters);
  let y = addHeader(doc, logo, 'Participant Report', subtitle);
  y = addReportIntro(
    doc,
    y,
    'Participant Report',
    'Complete individual participant directory flattened across leaders and team members.'
  );

  const participants = [];
  registrations.forEach((r) => {
    const lead = getLeader(r);
    const eventCode = getEventLabel(r);

    participants.push({
      name: safe(lead.name || r.name),
      email: safe(lead.email || r.email),
      phone: safe(lead.phone || lead.mobile || r.phone),
      dept: safe(lead.department || lead.branch || r.department),
      year: safe(lead.year || r.year),
      event: eventCode,
      role: (r.members && r.members.length > 0) ? 'Leader' : 'Solo',
    });

    (r.members || []).forEach((m) => {
      participants.push({
        name: safe(m.name),
        email: safe(m.email),
        phone: safe(m.phone || m.mobile),
        dept: safe(m.department || m.branch),
        year: safe(m.year),
        event: eventCode,
        role: 'Member',
      });
    });
  });

  const leadersOrSolo = registrations.length;
  const membersCount = participants.length - leadersOrSolo;

  y = addSummaryCards(doc, y, [
    { label: 'Total Participants', value: participants.length },
    { label: 'Leaders / Solo', value: leadersOrSolo },
    { label: 'Team Members', value: membersCount },
    { label: 'Avg Team Size', value: leadersOrSolo ? (participants.length / leadersOrSolo).toFixed(1) : '0' },
  ]);

  y = addSectionTitle(doc, y, 'Participant Directory');

  const columns = [
    { header: '#', dataKey: 'sl' },
    { header: 'Participant Name', dataKey: 'name' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Phone', dataKey: 'phone' },
    { header: 'Department', dataKey: 'dept' },
    { header: 'Year', dataKey: 'year' },
    { header: 'Event', dataKey: 'event' },
    { header: 'Role', dataKey: 'role' },
  ];

  const rows = participants.map((p, i) => ({
    sl: i + 1,
    ...p,
  }));

  autoTable(
    doc,
    makeTableOptions(doc, logo, 'Participant Report', subtitle, y, columns, rows, {
      sl: { cellWidth: 8, halign: 'center' },
      name: { cellWidth: 32 },
      email: { cellWidth: 42 },
      phone: { cellWidth: 22 },
      dept: { cellWidth: 30 },
      year: { cellWidth: 12, halign: 'center' },
      event: { cellWidth: 18 },
      role: { cellWidth: 16, halign: 'center' },
    })
  );

  addInsightsSection(doc, logo, 'Participant Report', subtitle, [
    `Total ${participants.length} individual participants across ${leadersOrSolo} registrations.`,
    `${membersCount} additional team members included alongside ${leadersOrSolo} primary registrants.`,
  ]);
}

// ─── 3. Event-wise Report ─────────────────────────────────────────────────────
function buildEventWiseReport(doc, logo, registrations, filters) {
  const subtitle = buildFilterSubtitle(filters);
  let y = addHeader(doc, logo, 'Event-wise Report', subtitle);
  y = addReportIntro(
    doc,
    y,
    'Event-wise Report',
    'Competition-level summary and detailed registration breakdown per event.'
  );

  const grouped = {};
  registrations.forEach((r) => {
    const code = getEventLabel(r);
    const name = safe(r.eventName || code);
    if (!grouped[code]) grouped[code] = { code, name, regs: [] };
    grouped[code].regs.push(r);
  });

  const eventList = Object.values(grouped).sort((a, b) => b.regs.length - a.regs.length);
  const totalParticipants = registrations.reduce(
    (acc, r) => acc + (r.teamSize || 1 + (r.members?.length || 0)),
    0
  );

  y = addSummaryCards(doc, y, [
    { label: 'Active Events', value: eventList.length },
    { label: 'Total Registrations', value: registrations.length },
    { label: 'Total Participants', value: totalParticipants },
  ]);

  y = addSectionTitle(doc, y, 'Event Summary');

  autoTable(
    doc,
    makeTableOptions(
      doc,
      logo,
      'Event-wise Report',
      subtitle,
      y,
      [
        { header: 'Code', dataKey: 'code' },
        { header: 'Event Name', dataKey: 'name' },
        { header: 'Registrations', dataKey: 'regs' },
        { header: 'Participants', dataKey: 'parts' },
        { header: 'Teams', dataKey: 'teams' },
        { header: 'Individuals', dataKey: 'indivs' },
      ],
      eventList.map((ev) => {
        const teams = ev.regs.filter((r) => r.members?.length > 0 || r.teamSize > 1).length;
        const parts = ev.regs.reduce((a, r) => a + (r.teamSize || 1 + (r.members?.length || 0)), 0);
        return {
          code: ev.code,
          name: ev.name,
          regs: ev.regs.length,
          parts,
          teams,
          indivs: ev.regs.length - teams,
        };
      }),
      {
        code: { cellWidth: 22 },
        name: { cellWidth: 62 },
        regs: { cellWidth: 26, halign: 'center' },
        parts: { cellWidth: 26, halign: 'center' },
        teams: { cellWidth: 22, halign: 'center' },
        indivs: { cellWidth: 22, halign: 'center' },
      }
    )
  );

  // Per-event breakdown tables
  eventList.forEach((ev) => {
    y = (doc.lastAutoTable?.finalY || 60) + 8;
    if (y > PAGE_H - 42) {
      doc.addPage();
      y = addHeader(doc, logo, 'Event-wise Report', subtitle);
    }
    y = addSectionTitle(doc, y, `${ev.code} — ${ev.name} (${ev.regs.length})`);

    const rows = ev.regs.map((r, i) => {
      const lead = getLeader(r);
      return {
        sl: i + 1,
        regId: safe(r.registrationId || r.registration_id || r._id),
        team: safe(r.teamName || r.team_name || 'Individual'),
        leader: safe(lead.name || r.name),
        email: safe(lead.email || r.email),
        phone: safe(lead.phone || lead.mobile || r.phone),
        size: safe(r.teamSize || (r.members ? r.members.length + 1 : 1)),
        date: fmtDate(r.createdAt),
      };
    });

    autoTable(
      doc,
      makeTableOptions(
        doc,
        logo,
        'Event-wise Report',
        subtitle,
        y,
        [
          { header: '#', dataKey: 'sl' },
          { header: 'Reg. ID', dataKey: 'regId' },
          { header: 'Team / Type', dataKey: 'team' },
          { header: 'Leader', dataKey: 'leader' },
          { header: 'Email', dataKey: 'email' },
          { header: 'Phone', dataKey: 'phone' },
          { header: 'Size', dataKey: 'size' },
          { header: 'Date', dataKey: 'date' },
        ],
        rows,
        {
          sl: { cellWidth: 8, halign: 'center' },
          regId: { cellWidth: 25 },
          team: { cellWidth: 26 },
          leader: { cellWidth: 28 },
          email: { cellWidth: 38 },
          phone: { cellWidth: 22 },
          size: { cellWidth: 11, halign: 'center' },
          date: { cellWidth: 22 },
        }
      )
    );
  });
}

// ─── 4. Team Report ───────────────────────────────────────────────────────────
function buildTeamReport(doc, logo, registrations, filters) {
  const subtitle = buildFilterSubtitle(filters);
  const teams = registrations.filter(
    (r) => r.registrationType === 'team' || (r.members && r.members.length > 0) || r.teamSize > 1
  );
  const totalTeamMembers = teams.reduce(
    (sum, r) => sum + (r.teamSize || (r.members ? r.members.length + 1 : 1)),
    0
  );

  let y = addHeader(doc, logo, 'Team Report', subtitle);
  y = addReportIntro(
    doc,
    y,
    'Team Report',
    'Roster of registered teams, team sizes, leaders, and member lists.'
  );

  y = addSummaryCards(doc, y, [
    { label: 'Total Teams', value: teams.length },
    { label: 'Team Participants', value: totalTeamMembers },
    { label: 'Avg Team Size', value: teams.length ? (totalTeamMembers / teams.length).toFixed(1) : '0' },
    { label: 'Solo Entries Excluded', value: registrations.length - teams.length },
  ]);

  y = addSectionTitle(doc, y, 'Registered Teams');

  const rows = teams.map((r, i) => {
    const lead = getLeader(r);
    const memberNames = (r.members || []).map((m) => m.name || '—').join(', ') || '—';
    return {
      sl: i + 1,
      regId: safe(r.registrationId || r.registration_id || r._id),
      event: getEventLabel(r),
      team: safe(r.teamName || r.team_name),
      size: safe(r.teamSize || (r.members ? r.members.length + 1 : 1)),
      leader: safe(lead.name || r.name),
      members: memberNames,
      date: fmtDate(r.createdAt),
    };
  });

  autoTable(
    doc,
    makeTableOptions(
      doc,
      logo,
      'Team Report',
      subtitle,
      y,
      [
        { header: '#', dataKey: 'sl' },
        { header: 'Reg. ID', dataKey: 'regId' },
        { header: 'Event', dataKey: 'event' },
        { header: 'Team Name', dataKey: 'team' },
        { header: 'Size', dataKey: 'size' },
        { header: 'Leader', dataKey: 'leader' },
        { header: 'Team Members', dataKey: 'members' },
        { header: 'Date', dataKey: 'date' },
      ],
      rows,
      {
        sl: { cellWidth: 8, halign: 'center' },
        regId: { cellWidth: 23 },
        event: { cellWidth: 16 },
        team: { cellWidth: 26 },
        size: { cellWidth: 10, halign: 'center' },
        leader: { cellWidth: 26 },
        members: { cellWidth: 52 },
        date: { cellWidth: 19 },
      }
    )
  );

  addInsightsSection(doc, logo, 'Team Report', subtitle, [
    `${teams.length} registered teams comprising ${totalTeamMembers} total participants.`,
    `Average team size across filtered events: ${teams.length ? (totalTeamMembers / teams.length).toFixed(1) : '0'} members.`,
  ]);
}

// ─── 5. Attendance Report ─────────────────────────────────────────────────────
function buildAttendanceReport(doc, logo, attendanceData, registrations, filters) {
  const subtitle = buildFilterSubtitle(filters);
  let y = addHeader(doc, logo, 'Attendance Report', subtitle);
  y = addReportIntro(
    doc,
    y,
    'Attendance Report',
    'On-desk verification log of marked present and absent participants.'
  );

  const attended = attendanceData.filter(
    (a) => a.present === true || a.present === 'true' || a.attended === true
  );
  const absent = attendanceData.length - attended.length;
  const pct = attendanceData.length > 0 ? Math.round((attended.length / attendanceData.length) * 100) : 0;

  y = addSummaryCards(doc, y, [
    { label: 'Marked Records', value: attendanceData.length },
    { label: 'Present', value: attended.length },
    { label: 'Absent', value: absent },
    { label: 'Attendance Rate', value: `${pct}%` },
  ]);

  y = addSectionTitle(doc, y, 'Attendance Records');

  const rows = attendanceData.map((a, i) => {
    const reg =
      registrations.find(
        (r) => r._id === a.registrationId || r.registrationId === a.registrationId
      ) || {};
    const lead = getLeader(reg);
    const isPresent = a.present === true || a.present === 'true' || a.attended === true;

    return {
      sl: i + 1,
      regId: safe(a.registrationId),
      name: safe(a.participantName || a.name || lead.name || reg.name),
      event: safe(a.eventName || a.eventCode || a.eventId || getEventLabel(reg)),
      present: isPresent ? 'Present' : 'Absent',
      markedAt: fmtDateTime(a.markedAt || a.updatedAt || a.createdAt),
    };
  });

  autoTable(
    doc,
    makeTableOptions(
      doc,
      logo,
      'Attendance Report',
      subtitle,
      y,
      [
        { header: '#', dataKey: 'sl' },
        { header: 'Reg. ID', dataKey: 'regId' },
        { header: 'Participant / Leader', dataKey: 'name' },
        { header: 'Event', dataKey: 'event' },
        { header: 'Status', dataKey: 'present' },
        { header: 'Marked At', dataKey: 'markedAt' },
      ],
      rows,
      {
        sl: { cellWidth: 10, halign: 'center' },
        regId: { cellWidth: 30 },
        name: { cellWidth: 46 },
        event: { cellWidth: 36 },
        present: { cellWidth: 22, halign: 'center' },
        markedAt: { cellWidth: 36 },
      },
      {
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.dataKey === 'present') {
            const val = data.cell.raw;
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = val === 'Present' ? GREEN : RED;
          }
        },
      }
    )
  );

  addInsightsSection(doc, logo, 'Attendance Report', subtitle, [
    `${attended.length} of ${attendanceData.length} marked entries attended (${pct}% attendance rate).`,
    `${absent} entries were marked absent.`,
  ]);
}

// ─── 6. Certificate Eligibility Report ───────────────────────────────────────
function buildCertificateReport(doc, logo, registrations, attendanceData, filters) {
  const subtitle = buildFilterSubtitle(filters);
  let y = addHeader(doc, logo, 'Certificate Eligibility Report', subtitle);
  y = addReportIntro(
    doc,
    y,
    'Certificate Eligibility Report',
    'Eligibility determination cross-referenced against verified attendance records.'
  );

  const rows = registrations.map((r, i) => {
    const lead = getLeader(r);
    const att = attendanceData.find(
      (a) => a.registrationId === r._id || a.registrationId === r.registrationId
    );
    const isPresent = att
      ? att.present === true || att.present === 'true' || att.attended === true
      : false;

    return {
      sl: i + 1,
      regId: safe(r.registrationId || r.registration_id || r._id),
      name: safe(lead.name || r.name),
      email: safe(lead.email || r.email),
      event: getEventLabel(r),
      attended: isPresent ? 'Yes' : att ? 'No' : 'Not Marked',
      eligible: isPresent ? 'Eligible' : 'Not Eligible',
    };
  });

  const eligibleCount = rows.filter((r) => r.eligible === 'Eligible').length;
  const notMarkedCount = rows.filter((r) => r.attended === 'Not Marked').length;
  const notEligibleCount = rows.length - eligibleCount;

  y = addSummaryCards(doc, y, [
    { label: 'Total Registrations', value: rows.length },
    { label: 'Eligible', value: eligibleCount },
    { label: 'Not Eligible', value: notEligibleCount },
    { label: 'Attendance Pending', value: notMarkedCount },
  ]);

  y = addSectionTitle(doc, y, 'Eligibility Roster');

  autoTable(
    doc,
    makeTableOptions(
      doc,
      logo,
      'Certificate Eligibility Report',
      subtitle,
      y,
      [
        { header: '#', dataKey: 'sl' },
        { header: 'Reg. ID', dataKey: 'regId' },
        { header: 'Participant / Leader', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Event', dataKey: 'event' },
        { header: 'Attended', dataKey: 'attended' },
        { header: 'Eligibility', dataKey: 'eligible' },
      ],
      rows,
      {
        sl: { cellWidth: 8, halign: 'center' },
        regId: { cellWidth: 26 },
        name: { cellWidth: 34 },
        email: { cellWidth: 46 },
        event: { cellWidth: 20 },
        attended: { cellWidth: 22, halign: 'center' },
        eligible: { cellWidth: 24, halign: 'center' },
      },
      {
        didParseCell: (data) => {
          if (data.section === 'body') {
            if (data.column.dataKey === 'eligible') {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.textColor = data.cell.raw === 'Eligible' ? GREEN : RED;
            }
            if (data.column.dataKey === 'attended') {
              if (data.cell.raw === 'Yes') data.cell.styles.textColor = GREEN;
              else if (data.cell.raw === 'No') data.cell.styles.textColor = RED;
              else data.cell.styles.textColor = GREY;
            }
          }
        },
      }
    )
  );

  const eligPct = rows.length ? Math.round((eligibleCount / rows.length) * 100) : 0;
  addInsightsSection(doc, logo, 'Certificate Eligibility Report', subtitle, [
    `${eligibleCount} of ${rows.length} registrations (${eligPct}%) qualify for participation certificates.`,
    `${notMarkedCount} registrations do not yet have an attendance record marked.`,
  ]);
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────
export async function generatePdf(reportType, { registrations = [], attendance = [] }, filters = {}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const logo = await loadLogoBase64();

  const reportMeta = {
    registration: { name: 'Registration Report' },
    participant: { name: 'Participant Report' },
    event: { name: 'Event-wise Report' },
    team: { name: 'Team Report' },
    attendance: { name: 'Attendance Report' },
    certificate: { name: 'Certificate Eligibility' },
  };

  const meta = reportMeta[reportType] || reportMeta.registration;

  switch (reportType) {
    case 'registration':
      buildRegistrationReport(doc, logo, registrations, filters);
      break;
    case 'participant':
      buildParticipantReport(doc, logo, registrations, filters);
      break;
    case 'event':
      buildEventWiseReport(doc, logo, registrations, filters);
      break;
    case 'team':
      buildTeamReport(doc, logo, registrations, filters);
      break;
    case 'attendance':
      buildAttendanceReport(doc, logo, attendance, registrations, filters);
      break;
    case 'certificate':
      buildCertificateReport(doc, logo, registrations, attendance, filters);
      break;
    default:
      buildRegistrationReport(doc, logo, registrations, filters);
  }

  addFooters(doc, meta.name);

  const filename = `Srijan2026_${meta.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
  doc.save(filename);
  return filename;
}
