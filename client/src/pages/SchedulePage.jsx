import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Flag,
  Zap,
  Trophy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  ChevronRight,
  Layers,
  Wrench,
  Radio
} from 'lucide-react';
import CTASection from '../components/CTASection';

const SCHEDULE_DATA = [
  {
    day: 'Day 1',
    date: 'MARCH 15, 2026',
    title: 'Inauguration & Hackathons',
    theme: 'LAUNCH // PHASE_01',
    color: 'cyan',
    summary:
      'Grand opening ceremony featuring keynote speeches from industry leaders, followed by the kickoff of the 24-hour National Hackathon and preliminary quiz rounds.',
    events: [
      {
        time: '08:30 AM - 09:30 AM',
        title: 'Delegate Accreditation & Registration',
        venue: 'Main Reception & ETAS Helpdesk',
        category: 'ACCREDITATION',
        desc: 'Participant check-in, verification of credentials, and distribution of official Srijan delegate kits.',
        badge: 'GENERAL',
      },
      {
        time: '09:30 AM - 10:45 AM',
        title: 'Grand Inauguration & Keynote Address',
        venue: 'Main Auditorium (Sir Visvesvaraya Hall)',
        category: 'CEREMONY',
        desc: 'Lamp lighting ceremony, welcome addresses by department heads, and an opening keynote on Next-Gen Embedded Tech.',
        badge: 'KEYNOTE',
      },
      {
        time: '11:00 AM',
        title: 'National Hackathon Kickoff (24-Hour Sprint)',
        venue: 'IT & Computing Center (Labs 01-04)',
        category: 'HACKATHON',
        desc: 'Release of problem statements, team workspace allocation, and start of the 24-hour non-stop software sprint.',
        eventId: 'event-1',
        badge: 'FLAGSHIP',
      },
      {
        time: '02:00 PM - 04:00 PM',
        title: 'KBC Tech Quiz: Preliminary Screening Rounds',
        venue: 'Seminar Hall 01',
        category: 'QUIZ',
        desc: 'Rapid-fire written and digital aptitude rounds testing electronic circuits, logical reasoning, and computing fundamentals.',
        eventId: 'event-2',
        badge: 'COMPETITION',
      },
      {
        time: '05:30 PM - 07:00 PM',
        title: 'Hackathon Milestone Checkpoint 01',
        venue: 'IT Center',
        category: 'HACKATHON',
        desc: 'Architectural evaluation and mentorship rounds with industry technology mentors.',
        eventId: 'event-1',
        badge: 'MENTORSHIP',
      },
    ],
  },
  {
    day: 'Day 2',
    date: 'MARCH 16, 2026',
    title: 'Hardware & Design Battles',
    theme: 'CORE // PHASE_02',
    color: 'gold',
    summary:
      'Intensive PCB designing, CAD modeling challenges, and circuit debugging contests in department laboratories. Expert workshops on AI & IoT.',
    events: [
      {
        time: '09:30 AM - 12:30 PM',
        title: 'Circuit Making & Breadboard Debugging',
        venue: 'Electronic Devices & Circuits Lab',
        category: 'CIRCUITS',
        desc: 'Hands-on breadboard assembly, faulty circuit diagnosis, oscilloscope waveform matching, and output accuracy vetting.',
        eventId: 'event-6',
        badge: 'HARDWARE',
      },
      {
        time: '10:00 AM - 01:00 PM',
        title: 'CAD Modeling 3D Engineering Sprint',
        venue: 'CAD / CAM Laboratory',
        category: 'CAD',
        desc: 'Precision parametric rendering of mechanical assemblies, isometric constraints, and 3D digital fabrication drafts.',
        eventId: 'event-4',
        badge: 'DESIGN',
      },
      {
        time: '01:30 PM - 04:30 PM',
        title: 'PCB Designing: Schematic to Gerber Routing',
        venue: 'Advanced VLSI & Embedded Lab',
        category: 'PCB',
        desc: 'High-density multi-layer routing, thermal via optimization, and DRC verification using industrial EDA suites.',
        eventId: 'event-3',
        badge: 'HARDWARE',
      },
      {
        time: '03:00 PM - 05:00 PM',
        title: 'Expert Tech Workshop: Edge AI on Silicon',
        venue: 'Auditorium Audio-Visual Hall',
        category: 'WORKSHOP',
        desc: 'Guest industrial lecture and live demonstration of deploying lightweight neural network models to low-power microcontrollers.',
        badge: 'MASTERCLASS',
      },
      {
        time: '11:00 PM',
        title: 'Hackathon Final Code Freeze Warning',
        venue: 'IT Center',
        category: 'HACKATHON',
        desc: 'Final checkpoint and repository preparation for automated test harness evaluation.',
        eventId: 'event-1',
        badge: 'DEADLINE',
      },
    ],
  },
  {
    day: 'Day 3',
    date: 'MARCH 17, 2026',
    title: 'Finals & Valedictory',
    theme: 'FINALE // PHASE_03',
    color: 'cyan',
    summary:
      'Project presentations, final rounds of KBC Tech Quiz, bridge load testing, and the grand valedictory function with prize distribution.',
    events: [
      {
        time: '10:00 AM - 01:00 PM',
        title: 'Bridge Making: Load & Structural Stress Tests',
        venue: 'Civil Engineering Testing Arena',
        category: 'STRUCTURAL',
        desc: 'Hydraulic load bearing analysis and structural stress assessment to determine strength-to-weight champion prototypes.',
        eventId: 'event-5',
        badge: 'COMPETITION',
      },
      {
        time: '11:00 AM - 01:30 PM',
        title: 'KBC Tech Quiz: The Grand Stage Finale',
        venue: 'Main Auditorium',
        category: 'QUIZ',
        desc: 'The top 6 qualifying teams battle in the grand buzzer and lifeline rounds on stage before a live audience.',
        eventId: 'event-2',
        badge: 'STAGE_FINALE',
      },
      {
        time: '01:30 PM - 03:30 PM',
        title: 'National Hackathon: Jury Pitch & Demos',
        venue: 'IT Center & Seminar Hall 02',
        category: 'HACKATHON',
        desc: 'Finalist teams present live working prototypes to an executive panel of industry CTOs and venture engineers.',
        eventId: 'event-1',
        badge: 'JURY_REVIEW',
      },
      {
        time: '04:00 PM - 06:30 PM',
        title: 'Grand Valedictory Ceremony & Awards Gala',
        venue: 'Main Auditorium',
        category: 'CEREMONY',
        desc: 'Felicitation of winners, distribution of ₹5,00,000+ in prize awards, trophy presentation, and concluding remarks.',
        badge: 'AWARDS',
      },
    ],
  },
];

export default function SchedulePage() {
  const [activeDayIndex, setActiveDayIndex] = useState(0); // 0, 1, 2 or 'all'

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen bg-[#0d141d] bg-circuit-grid text-[#dce3f0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* ==================================================================== */}
        {/* 1. TOP HEADER & TELEMETRY STATUS                                     */}
        {/* ==================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-[#3b494c]/30">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#00daf3] tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-ping" />
              <span>SYS_CORE // DIRECTORY_03 // FESTIVAL_TIMELINE</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#dce3f0] tracking-tight">
              Symposium Schedule
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#bac9cc] max-w-2xl leading-relaxed mt-1">
              Explore the master 3-day technical itinerary of Srijan 2026. Non-stop coding sprints, hardware battles, expert keynotes, and stage championship rounds.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 self-start md:self-auto font-mono text-xs text-[#bac9cc]">
            <div className="bg-[#151c26] px-4 py-2.5 rounded-lg border border-[#3b494c]/30 shadow-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#ffd799]" />
              <span className="text-[#ffd799] font-bold">MARCH 15-17, 2026</span>
            </div>
            <div className="bg-[#151c26] px-4 py-2.5 rounded-lg border border-[#3b494c]/30 shadow-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00e5ff]" />
              <span>MAIN AUDITORIUM &amp; DEPT LABS</span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 2. 3-DAY OVERVIEW CARDS (DIRECT MATCH TO SPECIFICATION)              */}
        {/* ==================================================================== */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-[#00daf3]" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#dce3f0]">
                3-Day Technical Itinerary
              </h2>
              <span className="font-mono text-xs text-[#ffd799] px-2.5 py-1 rounded bg-[#19202a] border border-[#ffd799]/20 hidden sm:inline-block">
                [TIMELINE_PHASES]
              </span>
            </div>
            <span className="font-mono text-xs text-[#bac9cc] uppercase tracking-wider">
              VENUE: MAIN AUDITORIUM &amp; DEPT LABS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {SCHEDULE_DATA.map((dayItem, index) => {
              const isSelected = activeDayIndex === index;
              const isDay2 = index === 1;

              return (
                <div
                  key={dayItem.day}
                  onClick={() => setActiveDayIndex(index)}
                  className={`p-6 sm:p-8 rounded-xl bg-[#19202a] flex flex-col gap-4 transition-all duration-300 cursor-pointer group hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:-translate-y-1 relative overflow-hidden border ${
                    isSelected
                      ? isDay2
                        ? 'border-[#ffd799] shadow-[0_0_25px_rgba(255,215,153,0.18)]'
                        : 'border-[#00e5ff] shadow-[0_0_25px_rgba(0,229,255,0.2)]'
                      : 'border-[#3b494c]/30 hover:border-[#00daf3]/50'
                  } ${isDay2 ? 'border-t-4 border-t-[#ffd799]' : 'border-t-4 border-t-[#00e5ff]'}`}
                >
                  {/* Top Day Header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-xs font-bold uppercase tracking-wider ${
                        isDay2 ? 'text-[#ffd799]' : 'text-[#00daf3]'
                      }`}
                    >
                      {dayItem.day.toUpperCase()} // {dayItem.date}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isDay2
                          ? 'bg-[#ffd799]/10 text-[#ffd799] border border-[#ffd799]/30'
                          : 'bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30'
                      }`}
                    >
                      {index === 0 && <Flag className="w-4 h-4" />}
                      {index === 1 && <Zap className="w-4 h-4" />}
                      {index === 2 && <Trophy className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-[#c3f5ff] transition-colors">
                    {dayItem.title}
                  </h3>

                  <p className="font-sans text-sm text-[#bac9cc] leading-relaxed">
                    {dayItem.summary}
                  </p>

                  {/* Quick Highlights Footer */}
                  <div className="mt-auto pt-4 border-t border-[#3b494c]/30 font-mono text-xs text-[#bac9cc] flex items-center justify-between">
                    <span>{dayItem.events.length} Programmed Milestones</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        isDay2 ? 'text-[#ffd799]' : 'text-[#00daf3]'
                      }`}
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 3. DETAILED EVENT TIMELINE                                          */}
        {/* ==================================================================== */}
        <div className="mb-20">
          {/* Day Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#bac9cc] uppercase tracking-wider mr-2">
                FILTER TIMELINE:
              </span>
              {['DAY 01 (MAR 15)', 'DAY 02 (MAR 16)', 'DAY 03 (MAR 17)'].map((tabLabel, idx) => {
                const isActive = activeDayIndex === idx;
                return (
                  <button
                    key={tabLabel}
                    type="button"
                    onClick={() => setActiveDayIndex(idx)}
                    className={`font-mono text-xs font-semibold uppercase px-4 py-2 rounded-lg border transition-all duration-200 ${
                      isActive
                        ? 'bg-[#00e5ff]/15 text-[#00e5ff] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                        : 'bg-[#151c26] text-[#bac9cc] border-[#3b494c]/30 hover:border-[#00daf3]/40 hover:text-white'
                    }`}
                  >
                    {tabLabel}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setActiveDayIndex('all')}
              className={`font-mono text-xs font-semibold uppercase px-4 py-2 rounded-lg border transition-all duration-200 ${
                activeDayIndex === 'all'
                  ? 'bg-[#ffd799]/15 text-[#ffd799] border-[#ffd799] shadow-[0_0_12px_rgba(255,215,153,0.25)]'
                  : 'bg-[#151c26] text-[#bac9cc] border-[#3b494c]/30 hover:text-white'
              }`}
            >
              SHOW COMPLETE 3-DAY TIMELINE
            </button>
          </div>

          {/* Timeline Stream */}
          <div className="space-y-12">
            {SCHEDULE_DATA.filter((_, idx) => activeDayIndex === 'all' || activeDayIndex === idx).map(
              (dayData) => (
                <div key={dayData.day} className="space-y-6">
                  {/* Day Divider Bar */}
                  <div className="flex items-center gap-4 bg-[#151c26] p-4 rounded-xl border border-[#3b494c]/30">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff]" />
                    <span className="font-mono text-xs sm:text-sm font-bold uppercase text-[#00daf3]">
                      {dayData.day} // {dayData.date}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">|</span>
                    <span className="font-display font-bold text-white text-sm sm:text-base hidden sm:inline">
                      {dayData.title}
                    </span>
                    <span className="ml-auto font-mono text-xs text-[#ffd799] bg-[#0d141d] px-2.5 py-0.5 rounded border border-[#ffd799]/30">
                      {dayData.theme}
                    </span>
                  </div>

                  {/* List of Scheduled Events */}
                  <div className="grid grid-cols-1 gap-4">
                    {dayData.events.map((evt, eIdx) => (
                      <div
                        key={eIdx}
                        className="p-5 sm:p-6 rounded-xl bg-[#19202a] border border-[#3b494c]/30 hover:border-[#00e5ff]/40 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-[0_4px_20px_rgba(0,229,255,0.08)]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
                          {/* Time Column */}
                          <div className="sm:w-48 shrink-0 font-mono text-xs font-bold text-[#ffd799] bg-[#0d141d] px-3 py-2 rounded-lg border border-[#ffd799]/20 self-start">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#ffd799]" />
                              <span>{evt.time}</span>
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-mono text-[10px] text-[#00daf3] bg-[#00e5ff]/10 px-2 py-0.5 rounded border border-[#00e5ff]/30 font-semibold tracking-wider">
                                {evt.badge}
                              </span>
                              <span className="font-mono text-[10px] text-[#bac9cc] flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#00e5ff]" />
                                <span>{evt.venue}</span>
                              </span>
                            </div>

                            <h4 className="font-display font-bold text-lg text-white group-hover:text-[#c3f5ff] transition-colors">
                              {evt.title}
                            </h4>

                            <p className="font-sans text-xs sm:text-sm text-[#bac9cc] leading-relaxed">
                              {evt.desc}
                            </p>
                          </div>
                        </div>

                        {/* Event Action Button */}
                        <div className="shrink-0 flex items-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#3b494c]/20">
                          {evt.eventId ? (
                            <>
                              <Link
                                to={`/events/${evt.eventId}`}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#bac9cc] hover:text-white border border-[#3b494c]/40 hover:border-[#00daf3]/50 transition-colors"
                              >
                                Guidelines
                              </Link>
                              <Link
                                to={`/register/${evt.eventId}`}
                                className="px-4 py-1.5 rounded-lg bg-[#00e5ff] text-[#00363d] font-mono text-xs uppercase font-bold hover:bg-[#00daf3] shadow-[0_0_12px_rgba(0,229,255,0.3)] transition-all flex items-center gap-1.5"
                              >
                                <Zap className="w-3 h-3 fill-current" />
                                <span>Register</span>
                              </Link>
                            </>
                          ) : (
                            <span className="font-mono text-xs text-[#bac9cc]/60 px-3 py-1 bg-[#151c26] rounded border border-[#3b494c]/20">
                              Open Admission
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* 4. SYMPOSIUM BRIEFING & VENUE ACCESS                                 */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="p-6 sm:p-8 rounded-xl bg-[#151c26] border border-[#3b494c]/30">
            <div className="flex items-center gap-2 text-[#00daf3] font-mono text-xs font-bold uppercase mb-3">
              <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
              <span>ENTRY &amp; SECURITY PROTOCOL</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white mb-2">
              Accreditation &amp; Pass Verification
            </h4>
            <p className="text-sm text-[#bac9cc] leading-relaxed">
              All registered student participants must carry their physical college ID card alongside the electronic registration QR pass issued at the time of online entry. Entry gates open at 08:00 AM on each symposium day.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-xl bg-[#151c26] border border-[#3b494c]/30">
            <div className="flex items-center gap-2 text-[#ffd799] font-mono text-xs font-bold uppercase mb-3">
              <Radio className="w-4 h-4 text-[#ffd799]" />
              <span>REAL-TIME NOTIFICATIONS</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white mb-2">
              Live Round Announcements
            </h4>
            <p className="text-sm text-[#bac9cc] leading-relaxed">
              Live schedule updates, room switches, and round qualification lists will be broadcast across the central lobby telemetry displays and through the official ETAS notification channel.
            </p>
          </div>
        </div>

      </div>

      {/* Call to action */}
      <CTASection />
    </div>
  );
}
