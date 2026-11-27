import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Zap,
  Trophy,
  ChevronRight,
  Coffee,
  Terminal,
  Cpu,
  Radio,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Layers
} from 'lucide-react';
import CTASection from '../components/CTASection';
import PageTransition from '../components/PageTransition';
import Reveal from '../components/Reveal';

const SCHEDULE_DATA = [
  {
    day: 'Day 01',
    shortLabel: 'DAY 01 (21 DEC)',
    date: '21 DECEMBER 2026',
    window: '11:00 AM – 05:00 PM',
    duration: '6 Hours',
    competitionsCount: '3 Competitions',
    title: 'Physical Engineering Battles',
    theme: 'PHASE_01 // HARDWARE & QUIZ',
    accent: 'cyan',
    summary:
      'Hands-on structural bridge engineering, live technical quiz qualifiers & stage finale, and precision analog/digital circuit fabrication.',
    events: [
      {
        time: '11:00 AM – 01:00 PM',
        code: '#05',
        title: 'Bridge Making',
        venue: 'Civil Engineering Lab',
        category: 'STRUCTURAL',
        desc: 'Design and construct high-strength structural truss bridges tested for maximum load-to-weight efficiency.',
        eventId: 'event-5',
        badge: 'COMPETITION',
      },
      {
        time: '01:00 PM – 02:00 PM',
        code: '#02',
        title: 'KBC Tech Quiz – Preliminary',
        venue: 'Main Auditorium',
        category: 'QUIZ',
        desc: 'Rapid screening round testing technical aptitude, logical reasoning, electronics fundamentals, and general awareness.',
        eventId: 'event-2',
        badge: 'PRELIMS',
      },
      {
        time: '02:00 PM – 03:00 PM',
        code: 'BRK',
        title: 'Lunch Break',
        venue: 'Campus',
        category: 'BREAK',
        desc: 'Mid-day recharge, networking with fellow participants, and lab transition before afternoon sessions.',
        isBreak: true,
        badge: 'BREAK',
      },
      {
        time: '03:00 PM – 04:30 PM',
        code: '#06',
        title: 'Circuit Making',
        venue: 'Electronics Lab',
        category: 'HARDWARE',
        desc: 'Breadboard assembly, fault diagnosis, signal tuning, and live circuit output verification.',
        eventId: 'event-6',
        badge: 'COMPETITION',
      },
      {
        time: '04:30 PM – 05:00 PM',
        code: '#02',
        title: 'KBC Tech Quiz – Final',
        venue: 'Main Auditorium',
        category: 'QUIZ',
        desc: 'Top qualifying teams face off on the main stage in high-stakes buzzer and lifeline championship rounds.',
        eventId: 'event-2',
        badge: 'STAGE FINALE',
      },
    ],
  },
  {
    day: 'Day 02',
    shortLabel: 'DAY 02 (22 DEC)',
    date: '22 DECEMBER 2026',
    window: '10:00 AM – 05:00 PM',
    duration: '7 Hours',
    competitionsCount: '3 Competitions',
    title: 'Digital Design & Innovation',
    theme: 'PHASE_02 // DESIGN & SPRINT',
    accent: 'gold',
    summary:
      'Precision PCB schematic routing, 3D parametric CAD modeling, and the flagship 24-hour Hackathon sprint kicking off in parallel.',
    events: [
      {
        time: '10:00 AM – 12:00 PM',
        code: '#03',
        title: 'PCB Designing',
        venue: 'Electronics Computer Lab',
        category: 'EDA / PCB',
        desc: 'Design clean, DRC-verified printed circuit board schematics and multi-layer trace layouts using industrial EDA tools.',
        eventId: 'event-3',
        badge: 'COMPETITION',
      },
      {
        time: '12:00 PM – 01:00 PM',
        code: 'BRK',
        title: 'Lunch Break',
        venue: 'Campus',
        category: 'BREAK',
        desc: 'Mid-day break and refreshment before afternoon CAD modeling and Hackathon sprint checkpoints.',
        isBreak: true,
        badge: 'BREAK',
      },
      {
        time: '01:00 PM – 03:00 PM',
        code: '#04',
        title: 'CAD Modeling',
        venue: 'CAD / Mechanical Lab',
        category: '3D DESIGN',
        desc: 'Precision parametric 3D modeling, assembly constraints, and engineering drafting under timed specifications.',
        eventId: 'event-4',
        badge: 'COMPETITION',
      },
      {
        time: '03:00 PM – 05:00 PM',
        code: '#01',
        title: 'Hackathon – Development Sprint',
        venue: 'IT Computing Labs',
        category: '24HR HACK',
        desc: 'Dedicated afternoon development sprint & mentor checkpoints (part of the continuous 24-hour Hackathon running 22 Dec, 10 AM – 23 Dec, 10 AM).',
        eventId: 'event-1',
        badge: '24HR SPRINT',
      },
    ],
  },
];

const HACKATHON_MILESTONES = [
  {
    step: '01',
    time: '22 DEC 2026 · 10:00 AM',
    label: 'Hackathon Kickoff',
    detail: 'Problem statements live. Runs in parallel with PCB & CAD in a separate lab.',
  },
  {
    step: '02',
    time: '22 DEC, 10 AM – 23 DEC, 10 AM',
    label: 'Continuous 24-Hour Sprint',
    detail: 'Non-stop coding, prototyping, mentor reviews, and afternoon sprint block (3–5 PM).',
  },
  {
    step: '03',
    time: '23 DEC 2026 · 10:00 AM',
    label: 'Final Submission & Evaluation',
    detail: 'Code freeze, live jury demos, and final evaluation of working prototypes.',
  },
];

const DISTRIBUTION_ROWS = [
  { day: '21 December 2026', focus: 'Physical Engineering Battles', events: '3 competitions', duration: '6 hours' },
  { day: '22 December 2026', focus: 'Digital Design & Innovation', events: '3 competitions', duration: '7 hours' },
];

export default function SchedulePage() {
  const [activeDayIndex, setActiveDayIndex] = useState('all'); // 'all' | 0 | 1

  return (
    <PageTransition>
      <div className="pt-28 sm:pt-32 pb-24 min-h-screen bg-[#0d141d] bg-circuit-grid text-[#dce3f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">

          {/* ================================================================== */}
          {/* 1. TOP HEADER & TELEMETRY STATUS                                   */}
          {/* ================================================================== */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14 pb-8 border-b border-[#3b494c]/30">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#00daf3] tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-ping" />
                <span>SYS_CORE // SRIJAN_2026 // FINAL_SCHEDULE</span>
              </div>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#dce3f0] tracking-tight">
                Symposium Schedule
              </h1>
              <p className="font-sans text-sm sm:text-lg text-[#bac9cc] max-w-2xl leading-relaxed mt-1">
                All 6 flagship competitions arranged across two action-packed days — keeping core lab battles within daily timings while the 24-hour Hackathon runs continuously in parallel.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0 font-mono text-xs text-[#bac9cc]">
              <div className="bg-[#151c26] px-3.5 py-2 rounded-xl border border-[#ffd799]/30 shadow-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ffd799]" />
                <span className="text-[#ffd799] font-bold">21 – 22 DEC 2026</span>
              </div>
              <div className="bg-[#151c26] px-3.5 py-2 rounded-xl border border-[#00e5ff]/30 shadow-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00e5ff]" />
                <span className="text-[#c3f5ff] font-bold">13 HRS + 24HR HACK</span>
              </div>
              <div className="bg-[#151c26] px-3.5 py-2 rounded-xl border border-[#3b494c]/40 shadow-sm flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#00e5ff]" />
                <span>GCOEA CAMPUS</span>
              </div>
            </div>
          </div>

          {/* ================================================================== */}
          {/* 2. 2-DAY OVERVIEW CARDS                                            */}
          {/* ================================================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 mb-12 sm:mb-14">
            {SCHEDULE_DATA.map((dayItem, index) => {
              const isSelected = activeDayIndex === index;
              const isGold = dayItem.accent === 'gold';

              return (
                <Reveal key={dayItem.day} delay={index * 90}>
                  <button
                    type="button"
                    onClick={() => setActiveDayIndex(isSelected ? 'all' : index)}
                    className={`w-full text-left p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#151c26] via-[#19202a] to-[#121821] flex flex-col gap-4 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden border ${
                      isSelected
                        ? isGold
                          ? 'border-[#ffd799] shadow-[0_0_28px_rgba(255,215,153,0.2)]'
                          : 'border-[#00e5ff] shadow-[0_0_28px_rgba(0,229,255,0.22)]'
                        : 'border-[#3b494c]/35 hover:border-[#00daf3]/55'
                    } ${isGold ? 'border-t-4 border-t-[#ffd799]' : 'border-t-4 border-t-[#00e5ff]'}`}
                  >
                    {/* Top Glow Flare */}
                    <div
                      className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl opacity-15 group-hover:opacity-35 transition-opacity pointer-events-none"
                      style={{ backgroundColor: isGold ? '#ffd799' : '#00e5ff' }}
                    />

                    {/* Top Meta Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
                      <span
                        className={`font-mono text-xs font-bold uppercase tracking-wider ${
                          isGold ? 'text-[#ffd799]' : 'text-[#00daf3]'
                        }`}
                      >
                        {dayItem.day.toUpperCase()} // {dayItem.date}
                      </span>

                      <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#0d141d] border border-white/10 text-slate-200 flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${isGold ? 'text-[#ffd799]' : 'text-[#00e5ff]'}`} />
                        {dayItem.window}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div className="relative z-10">
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-[#c3f5ff] transition-colors">
                        {dayItem.title}
                      </h2>
                      <p className="font-sans text-xs sm:text-sm text-[#bac9cc] leading-relaxed mt-2">
                        {dayItem.summary}
                      </p>
                    </div>

                    {/* Footer Pills */}
                    <div className="mt-auto pt-4 border-t border-[#3b494c]/30 flex flex-wrap items-center justify-between gap-2 font-mono text-xs relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md bg-[#0d141d] border border-white/10 text-[#c3f5ff]">
                          {dayItem.competitionsCount}
                        </span>
                        <span className="px-2.5 py-1 rounded-md bg-[#0d141d] border border-white/10 text-[#ffd799]">
                          {dayItem.duration}
                        </span>
                      </div>

                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          isGold ? 'text-[#ffd799]' : 'text-[#00daf3]'
                        }`}
                      >
                        <span>{isSelected ? 'Showing Day' : 'Filter Day'}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* ================================================================== */}
          {/* 3. FILTER BAR & VERTICAL TIMELINE STREAM                           */}
          {/* ================================================================== */}
          <div className="mb-16">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveDayIndex('all')}
                  className={`font-mono text-xs font-semibold uppercase px-4 py-2 rounded-lg border transition-all duration-200 ${
                    activeDayIndex === 'all'
                      ? 'bg-[#00e5ff]/15 text-[#00e5ff] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                      : 'bg-[#151c26] text-[#bac9cc] border-[#3b494c]/30 hover:border-[#00daf3]/40 hover:text-white'
                  }`}
                >
                  All Days (21–22 Dec)
                </button>
                {SCHEDULE_DATA.map((d, idx) => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setActiveDayIndex(idx)}
                    className={`font-mono text-xs font-semibold uppercase px-4 py-2 rounded-lg border transition-all duration-200 ${
                      activeDayIndex === idx
                        ? d.accent === 'gold'
                          ? 'bg-[#ffd799]/15 text-[#ffd799] border-[#ffd799] shadow-[0_0_12px_rgba(255,215,153,0.25)]'
                          : 'bg-[#00e5ff]/15 text-[#00e5ff] border-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                        : 'bg-[#151c26] text-[#bac9cc] border-[#3b494c]/30 hover:border-[#00daf3]/40 hover:text-white'
                    }`}
                  >
                    {d.shortLabel}
                  </button>
                ))}
              </div>

              <span className="font-mono text-[11px] text-[#bac9cc] uppercase tracking-wider hidden sm:inline">
                [6 COMPETITIONS • PARALLEL 24HR HACKATHON]
              </span>
            </div>

            {/* Timeline Stream */}
            <div className="space-y-12">
              {SCHEDULE_DATA.filter((_, idx) => activeDayIndex === 'all' || activeDayIndex === idx).map(
                (dayData) => {
                  const isGold = dayData.accent === 'gold';
                  return (
                    <div key={dayData.day} className="space-y-6">
                      {/* Day Header Bar */}
                      <div className="flex flex-wrap items-center gap-3 bg-[#151c26] px-4 py-3.5 rounded-xl border border-[#3b494c]/40 shadow-md">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isGold ? 'bg-[#ffd799]' : 'bg-[#00e5ff]'
                          }`}
                        />
                        <span
                          className={`font-mono text-xs sm:text-sm font-bold uppercase ${
                            isGold ? 'text-[#ffd799]' : 'text-[#00daf3]'
                          }`}
                        >
                          {dayData.day} // {dayData.date}
                        </span>
                        <span className="text-slate-600 hidden sm:inline">|</span>
                        <span className="font-display font-bold text-white text-sm sm:text-base">
                          {dayData.title}
                        </span>
                        <span className="ml-auto font-mono text-[11px] text-[#c3f5ff] bg-[#0d141d] px-2.5 py-1 rounded-md border border-white/10">
                          {dayData.window}
                        </span>
                      </div>

                      {/* Vertical Timeline Items */}
                      <div className="relative pl-6 sm:pl-9 space-y-4">
                        {/* Vertical glowing spine */}
                        <div
                          aria-hidden="true"
                          className="absolute left-2 sm:left-3.5 top-3 bottom-3 w-[2px] bg-gradient-to-b from-[#00e5ff]/60 via-[#00daf3]/30 to-[#ffd799]/50"
                        />

                        {dayData.events.map((evt, eIdx) => (
                          <Reveal key={`${dayData.day}-${eIdx}`} delay={eIdx * 60}>
                            <div className="relative">
                              {/* Timeline Node Dot */}
                              <div
                                aria-hidden="true"
                                className={`absolute -left-[22px] sm:-left-[29px] top-6 w-3.5 h-3.5 rounded-full border-2 bg-[#0d141d] ${
                                  evt.isBreak
                                    ? 'border-slate-500'
                                    : isGold
                                    ? 'border-[#ffd799] shadow-[0_0_10px_rgba(255,215,153,0.6)]'
                                    : 'border-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                                }`}
                              />

                              <div
                                className={`p-4 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 group ${
                                  evt.isBreak
                                    ? 'bg-[#121821]/70 border-white/10 border-dashed'
                                    : 'bg-[#19202a] border-[#3b494c]/35 hover:border-[#00e5ff]/50 hover:shadow-[0_6px_26px_rgba(0,229,255,0.1)]'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-start gap-3.5 sm:gap-5 flex-1 min-w-0">
                                  {/* Time & Event Code Column */}
                                  <div className="sm:w-52 shrink-0 flex sm:flex-col items-center sm:items-start justify-between gap-2">
                                    <div className="font-mono text-xs font-bold text-[#ffd799] bg-[#0d141d] px-3 py-1.5 rounded-lg border border-[#ffd799]/25 inline-flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5 text-[#ffd799] shrink-0" />
                                      <span>{evt.time}</span>
                                    </div>
                                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#0d141d] text-slate-300 border border-white/10">
                                      {evt.isBreak ? 'INTERMISSION' : `EVENT ${evt.code}`}
                                    </span>
                                  </div>

                                  {/* Event Details */}
                                  <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={`font-mono text-[10px] px-2 py-0.5 rounded border font-semibold tracking-wider ${
                                          evt.isBreak
                                            ? 'text-slate-300 bg-white/5 border-white/10'
                                            : 'text-[#00daf3] bg-[#00e5ff]/10 border-[#00e5ff]/30'
                                        }`}
                                      >
                                        {evt.badge}
                                      </span>
                                      <span className="font-mono text-[11px] text-[#bac9cc] flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-[#00e5ff] shrink-0" />
                                        <span>{evt.venue}</span>
                                      </span>
                                    </div>

                                    <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-[#c3f5ff] transition-colors flex items-center gap-2">
                                      {evt.isBreak && <Coffee className="w-4 h-4 text-[#ffd799] shrink-0" />}
                                      <span>{evt.title}</span>
                                    </h3>

                                    <p className="font-sans text-xs sm:text-sm text-[#bac9cc] leading-relaxed">
                                      {evt.desc}
                                    </p>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="shrink-0 flex items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#3b494c]/25">
                                  {evt.eventId ? (
                                    <>
                                      <Link
                                        to={`/events/${evt.eventId}`}
                                        className="px-3.5 py-2 rounded-lg text-xs font-mono text-[#bac9cc] hover:text-white bg-[#0d141d] border border-[#3b494c]/40 hover:border-[#00daf3]/50 transition-colors"
                                      >
                                        Guidelines
                                      </Link>
                                      <Link
                                        to={`/register/${evt.eventId}`}
                                        className="px-4 py-2 rounded-lg bg-[#00e5ff] text-[#00131c] font-mono text-xs uppercase font-bold hover:bg-[#52eeff] shadow-[0_0_14px_rgba(34,229,255,0.35)] transition-all flex items-center gap-1.5"
                                      >
                                        <Zap className="w-3.5 h-3.5 fill-current" />
                                        <span>Register</span>
                                      </Link>
                                    </>
                                  ) : (
                                    <span className="font-mono text-[11px] text-slate-400 px-3 py-1.5 bg-[#0d141d] rounded-lg border border-white/10">
                                      Campus Recharge
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* ================================================================== */}
          {/* 4. SPECIAL 24-HOUR HACKATHON PARALLEL TRACK SPOTLIGHT              */}
          {/* ================================================================== */}
          <Reveal className="mb-16">
            <div className="rounded-3xl bg-gradient-to-br from-[#131d2b] via-[#16202d] to-[#0e1621] border border-[#00e5ff]/35 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.12)]">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff] to-transparent opacity-70" />
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-[#00e5ff]/10 blur-[90px] pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#ffd799] bg-[#ffd799]/10 px-3 py-1 rounded-lg border border-[#ffd799]/30">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>IMPORTANT // PARALLEL 24-HOUR HACKATHON</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Continuous 24-Hour Hackathon Arrangement
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#bac9cc] leading-relaxed">
                    Because a 24-hour hackathon cannot be completed inside the 3:00 PM – 5:00 PM slot alone, the Hackathon runs in parallel with PCB Designing &amp; CAD Modeling in a dedicated IT Computing Lab.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <Link
                    to="/events/event-1"
                    className="px-4 py-2.5 rounded-xl font-mono text-xs font-semibold text-[#c3f5ff] bg-[#0d141d] border border-[#00e5ff]/35 hover:border-[#00e5ff] transition-colors"
                  >
                    Hackathon Details
                  </Link>
                  <Link
                    to="/register/event-1"
                    className="px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-bold text-[#00131c] bg-[#22e5ff] hover:bg-[#52eeff] shadow-[0_0_18px_rgba(34,229,255,0.45)] transition-all flex items-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Register Team</span>
                  </Link>
                </div>
              </div>

              {/* 3-Step Progression */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {HACKATHON_MILESTONES.map((m) => (
                  <div
                    key={m.step}
                    className="p-5 rounded-2xl bg-[#0d141d]/90 border border-white/10 hover:border-[#00e5ff]/40 transition-colors flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-[#00daf3]">
                        {m.time}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-[#ffd799] bg-[#ffd799]/10 px-2 py-0.5 rounded border border-[#ffd799]/25">
                        STEP {m.step}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white">
                      {m.label}
                    </h3>
                    <p className="font-sans text-xs text-[#bac9cc] leading-relaxed">
                      {m.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ================================================================== */}
          {/* 5. FINAL EVENT DISTRIBUTION & BRIEFING CARDS                       */}
          {/* ================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {/* Final Event Distribution Summary */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#151c26] border border-[#00e5ff]/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#00daf3] font-mono text-xs font-bold uppercase mb-4">
                  <Layers className="w-4 h-4 text-[#00e5ff]" />
                  <span>FINAL EVENT DISTRIBUTION</span>
                </div>

                <div className="space-y-3">
                  {DISTRIBUTION_ROWS.map((row) => (
                    <div
                      key={row.day}
                      className="p-3 rounded-xl bg-[#0d141d] border border-white/10 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-mono text-xs font-bold text-white">{row.day}</div>
                        <div className="font-sans text-[11px] text-[#bac9cc]">{row.events}</div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#ffd799] bg-[#ffd799]/10 px-2.5 py-1 rounded border border-[#ffd799]/25">
                        {row.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-[#c3f5ff] font-bold">TOTAL: 6 COMPETITIONS</span>
                <span className="text-[#00e5ff] font-extrabold">13 HOURS</span>
              </div>
            </div>

            {/* Entry & Pass Verification */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#151c26] border border-[#3b494c]/35 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#00daf3] font-mono text-xs font-bold uppercase mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
                  <span>ENTRY &amp; SECURITY PROTOCOL</span>
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2">
                  Accreditation &amp; Pass Verification
                </h4>
                <p className="text-xs sm:text-sm text-[#bac9cc] leading-relaxed">
                  All registered participants must carry their physical college ID card alongside their registration confirmation pass. Reporting opens 30 minutes prior to each competition slot.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-[#00daf3] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GCOEA Campus, Amravati</span>
              </div>
            </div>

            {/* Live Round Notifications */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#151c26] border border-[#3b494c]/35 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[#ffd799] font-mono text-xs font-bold uppercase mb-3">
                  <Radio className="w-4 h-4 text-[#ffd799]" />
                  <span>REAL-TIME NOTIFICATIONS</span>
                </div>
                <h4 className="font-display font-bold text-lg text-white mb-2">
                  Live Round Announcements
                </h4>
                <p className="text-xs sm:text-sm text-[#bac9cc] leading-relaxed">
                  Lab allocations, KBC Tech Quiz qualifier shortlists, and Hackathon jury slots will be announced live at the Main Auditorium and ETAS Helpdesk.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[11px] text-[#ffd799] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Parallel Hackathon Support</span>
              </div>
            </div>
          </div>

        </div>

        {/* Call to action */}
        <CTASection />
      </div>
    </PageTransition>
  );
}
