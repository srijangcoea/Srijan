import React from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Users,
  Zap,
  Terminal,
  Brain,
  Cpu,
  Box,
  Layers,
  ChevronRight
} from 'lucide-react';

const EVENT_CONFIGS = {
  'event-1': {
    tag: 'SOFTWARE // 24H HACK',
    number: '01',
    icon: Terminal,
    iconColor: '#22e5ff',
    prize: '₹1,00,000',
    prizeSubtitle: 'GRAND BOUNTY',
    team: '2–4 Members',
    chips: ['24H Code Sprint', 'National Bounties', 'Live Mentorship']
  },
  'event-2': {
    tag: 'RAPID FIRE // STAGE',
    number: '02',
    icon: Brain,
    iconColor: '#ffd799',
    prize: '₹30,000',
    prizeSubtitle: 'CASH REWARDS',
    team: '2 Members',
    chips: ['Buzzer Round', 'Tech & Logic', 'Live Arena']
  },
  'event-3': {
    tag: 'HARDWARE // FAB LAB',
    number: '03',
    icon: Cpu,
    iconColor: '#00daf3',
    prize: '₹25,000',
    prizeSubtitle: 'CASH REWARDS',
    team: '1–2 Members',
    chips: ['EDA Schematics', 'Trace Routing', 'Fabrication']
  },
  'event-4': {
    tag: '3D DESIGN // CAD',
    number: '04',
    icon: Box,
    iconColor: '#38bdf8',
    prize: '₹20,000',
    prizeSubtitle: 'CASH REWARDS',
    team: 'Solo Event',
    chips: ['Parametric CAD', 'Precision Specs', '3D Render']
  },
  'event-5': {
    tag: 'CIVIL // LOAD MATRIX',
    number: '05',
    icon: Layers,
    iconColor: '#ffd799',
    prize: '₹20,000',
    prizeSubtitle: 'CASH REWARDS',
    team: '2–3 Members',
    chips: ['Load Testing', 'Truss Design', 'Material Ratio']
  },
  'event-6': {
    tag: 'ANALOG & DIGI // LAB',
    number: '06',
    icon: Zap,
    iconColor: '#22e5ff',
    prize: '₹20,000',
    prizeSubtitle: 'CASH REWARDS',
    team: '1–2 Members',
    chips: ['Breadboard Test', 'Signal Tuning', 'Component Kit']
  }
};

/**
 * Enhanced High-Conversion EventCard Component for SRIJAN 2026
 * Precision-scaled to fit within 2-column mobile layouts and 3-column desktop layouts.
 */
export default function EventCard({ event }) {
  if (!event) return null;

  const config = EVENT_CONFIGS[event.id] || {
    tag: `${event.code || 'TECH'} // COMPETITION`,
    number: event.number || '00',
    icon: Terminal,
    iconColor: '#22e5ff',
    prize: event.prizePool && event.prizePool !== 'To be announced' ? event.prizePool : '₹20,000',
    prizeSubtitle: 'PRIZE POOL',
    team: event.teamSize || (event.registrationType === 'team' ? 'Team Event' : 'Solo Event'),
    chips: ['Official Trophy', 'Certificate', 'Networking']
  };

  const IconComponent = config.icon;

  return (
    <div className="relative group flex flex-col justify-between rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#151c26] via-[#121922] to-[#0c1219] border border-[#22e5ff]/20 hover:border-[#22e5ff] shadow-[0_4px_25px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_45px_rgba(34,229,255,0.28)] transition-all duration-300 hover:-translate-y-1.5 overflow-hidden h-full p-3 sm:p-5 md:p-6">
      
      {/* Top Cyber Scanline Beam */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#22e5ff] to-transparent opacity-40 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Ambient Corner Radial Flare */}
      <div
        className="absolute -top-16 -right-16 w-32 h-32 sm:w-36 sm:h-36 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-45 group-hover:scale-125 transition-all duration-500"
        style={{ backgroundColor: config.iconColor }}
      />

      {/* CARD TOP BODY */}
      <div className="flex flex-col gap-2 sm:gap-3.5 relative z-10 min-w-0">
        
        {/* Row 1: Thematic Icon + Category + Number */}
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          {/* Left: Icon Box + Category & Registration Status */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div
              className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#081522] border flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(34,229,255,0.2)] group-hover:scale-110 transition-transform duration-300"
              style={{
                borderColor: `${config.iconColor}66`,
                color: config.iconColor
              }}
            >
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-mono text-[8.5px] sm:text-[11px] text-[#00daf3] uppercase font-bold tracking-wider truncate">
                {config.tag}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22e5ff] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22e5ff]" />
                </span>
                <span className="font-mono text-[8px] sm:text-[10px] text-slate-300 tracking-wide font-medium truncate">
                  {config.team}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Metallic Cyber Index Badge */}
          <span className="font-mono text-[9px] sm:text-xs font-bold text-slate-400 group-hover:text-white bg-[#081522]/90 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg border border-white/10 shadow-inner transition-colors shrink-0">
            #{config.number}
          </span>
        </div>

        {/* Row 2: Event Title */}
        <div className="pt-0.5 min-w-0">
          <Link to={`/events/${event.id}`} className="block group/link">
            <h3 className="font-display text-sm sm:text-xl md:text-2xl font-bold text-white group-hover/link:text-[#22e5ff] transition-colors leading-tight truncate sm:line-clamp-none">
              {event.name}
            </h3>
          </Link>
          {event.tagline && (
            <p className="font-sans text-[10px] sm:text-xs text-[#ffd799] font-medium truncate mt-0.5">
              "{event.tagline}"
            </p>
          )}
        </div>

        {/* Row 3: Short Description */}
        <p className="font-sans text-[10.5px] sm:text-xs text-[#bac9cc] leading-relaxed line-clamp-2 sm:line-clamp-3">
          {event.description}
        </p>

        {/* Row 4: Specs Chips */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
          <span className="font-mono text-[8.5px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-[#0d141d] border border-white/10 text-slate-300 font-medium tracking-wide truncate max-w-full">
            {config.chips[0]}
          </span>
          <span className="hidden sm:inline font-mono text-[8.5px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-[#0d141d] border border-white/10 text-slate-300 font-medium tracking-wide">
            {config.chips[1]}
          </span>
          {config.chips[2] && (
            <span className="hidden md:inline font-mono text-[8.5px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-[#0d141d] border border-white/10 text-slate-300 font-medium tracking-wide">
              {config.chips[2]}
            </span>
          )}
        </div>
      </div>

      {/* CARD BOTTOM: PRIZE CALLOUT + DUAL CTA ACTIONS */}
      <div className="flex flex-col gap-2 sm:gap-3 pt-2.5 sm:pt-3.5 mt-2.5 sm:mt-3.5 border-t border-white/10 relative z-10">
        
        {/* Compact Glowing Grand Prize Showcase Box */}
        <div className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#ffd799]/15 via-[#ffb400]/10 to-[#ffd799]/5 border border-[#ffd799]/30 flex items-center justify-between gap-1 shadow-[0_0_12px_rgba(255,215,153,0.12)]">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#0d141d] border border-[#ffd799]/30 flex items-center justify-center text-[#ffd799] shrink-0">
              <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse" />
            </div>
            <span className="font-mono text-[8px] sm:text-[9.5px] uppercase tracking-wider text-[#ffd799] font-bold truncate">
              {config.prizeSubtitle}
            </span>
          </div>

          <span className="font-display font-black text-xs sm:text-base md:text-lg text-[#ffd799] tracking-tight drop-shadow-[0_0_8px_rgba(255,215,153,0.4)] shrink-0">
            {config.prize}
          </span>
        </div>

        {/* Dual Actions: 50/50 Grid so buttons never overflow on mobile */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full">
          <Link
            to={`/events/${event.id}`}
            className="py-1.5 sm:py-2 px-1 rounded-lg sm:rounded-xl font-mono text-[10px] sm:text-xs font-semibold text-slate-300 hover:text-white bg-[#0d141d] border border-white/10 hover:border-[#22e5ff]/50 transition-all text-center flex items-center justify-center gap-0.5 truncate"
          >
            <span>Details</span>
            <ChevronRight className="w-3 h-3 hidden sm:inline" />
          </Link>

          <Link
            to={`/register/${event.id}`}
            className="group/btn py-1.5 sm:py-2 px-1 rounded-lg sm:rounded-xl font-mono text-[10px] sm:text-xs uppercase font-bold text-[#00131c] bg-[#22e5ff] hover:bg-[#52eeff] shadow-[0_0_15px_rgba(34,229,255,0.45)] hover:shadow-[0_0_25px_rgba(34,229,255,0.75)] flex items-center justify-center gap-1 transition-all active:scale-95 text-center tracking-wider overflow-hidden relative truncate"
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[180%] -skew-x-[24deg] bg-white/40 transition-transform duration-700 group-hover/btn:translate-x-[450%]" />
            <Zap className="w-3 h-3 fill-current shrink-0" />
            <span className="truncate">Register</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
