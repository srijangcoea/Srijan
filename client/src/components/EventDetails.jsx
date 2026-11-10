import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  FileText,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Trophy,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import DynamicIcon from './DynamicIcon';
import toast from 'react-hot-toast';

const PRIZE_MAP = {
  'event-1': '₹1,00,000',
  'event-2': '₹30,000',
  'event-3': '₹25,000',
  'event-4': '₹20,000',
  'event-5': '₹20,000',
  'event-6': '₹20,000',
};

const TAG_MAP = {
  'event-1': 'CODE // 24HR',
  'event-2': 'QUIZ // STAGE',
  'event-3': 'HARDWARE // LAB',
  'event-4': 'DESIGN // 3D',
  'event-5': 'CIVIL // STRENGTH',
  'event-6': 'ANALOG // DIGITAL',
};

export default function EventDetails({ event, onOpenBrochure }) {
  if (!event) return null;

  const prizeAmount =
    event.prizePool && event.prizePool !== 'To be announced'
      ? event.prizePool
      : PRIZE_MAP[event.id] || '₹20,000+';

  const categoryTag =
    TAG_MAP[event.id] || `${event.code || 'EVENT'} // ${event.category?.toUpperCase() || 'COMPETITION'}`;

  const handleBrochureClick = (e) => {
    e.preventDefault();
    if (event.brochureAvailable && event.brochure) {
      window.open(event.brochure, '_blank', 'noopener,noreferrer');
      toast.success(`Opening official rulebook for ${event.name}`);
    } else if (onOpenBrochure) {
      onOpenBrochure(event);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8 text-[#dce3f0]">
      
      {/* ==================================================================== */}
      {/* 1. TOP TELEMETRY BREADCRUMB                                         */}
      {/* ==================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#3b494c]/30">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#00daf3] hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Competitions Catalog</span>
        </Link>
        <div className="flex items-center gap-2 font-mono text-xs text-[#bac9cc]">
          <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
          <span>SPEC_SHEET // {event.code || 'ETAS'}_REV_02</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 2. MAIN SPECIFICATION HEADER HERO CARD                               */}
      {/* ==================================================================== */}
      <div className="relative rounded-2xl bg-[#151c26] border border-[#00e5ff]/25 p-6 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] mb-10 overflow-hidden">
        {/* Ambient background accent */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00e5ff]/5 rounded-bl-full pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff]/40 to-transparent" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="flex-1">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="font-mono text-xs font-bold text-[#ffd799] bg-[#0d141d] px-3 py-1 rounded border border-[#ffd799]/30 tracking-wider">
                {categoryTag}
              </span>
              <span className="font-mono text-xs text-[#c3f5ff] bg-[#19202a] px-3 py-1 rounded border border-[#3b494c]/40 uppercase tracking-wide">
                EVENT {event.number} // {event.category}
              </span>
              <span className="font-mono text-xs text-[#00daf3] bg-[#00e5ff]/10 px-3 py-1 rounded border border-[#00e5ff]/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                <span>REGISTRATION OPEN</span>
              </span>
            </div>

            {/* Competition Name */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold text-[#dce3f0] tracking-tight mb-2">
              {event.name}
            </h1>

            {/* Tagline */}
            {event.tagline && (
              <p className="text-sm sm:text-base font-mono text-[#ffd799] mb-5 tracking-wide">
                {event.tagline}
              </p>
            )}

            {/* Brief Description */}
            <p className="text-base sm:text-lg text-[#bac9cc] leading-relaxed max-w-3xl">
              {event.description}
            </p>
          </div>

          {/* Large Tech Icon Badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0d141d] border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] flex-shrink-0 shadow-[0_0_25px_rgba(0,229,255,0.2)]">
            <DynamicIcon name={event.icon} className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="mt-8 pt-8 border-t border-[#3b494c]/30 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Link
            to={`/register/${event.id}`}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-sm sm:text-base font-mono font-bold uppercase text-[#00363d] bg-[#00e5ff] hover:bg-[#00daf3] shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>REGISTER NOW</span>
          </Link>

          <button
            type="button"
            onClick={handleBrochureClick}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm sm:text-base font-mono font-medium text-[#c3f5ff] bg-[#19202a] hover:bg-[#242a34] border border-[#3b494c]/40 hover:border-[#00e5ff]/40 transition-colors"
          >
            <FileText className="w-4 h-4 text-[#00daf3]" />
            <span>{event.brochureAvailable ? 'Download Official Rulebook' : 'View Event Guidelines'}</span>
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. KEY SPECIFICATIONS GRID                                          */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {/* Prize Pool */}
        <div className="p-5 rounded-xl bg-[#19202a] border border-[#3b494c]/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#0d141d] border border-[#ffd799]/30 flex items-center justify-center text-[#ffd799] shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#bac9cc] mb-1">
              Prize Pool
            </div>
            <div className="text-lg font-mono font-bold text-[#ffd799]">
              {prizeAmount}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="p-5 rounded-xl bg-[#19202a] border border-[#3b494c]/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#0d141d] border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#bac9cc] mb-1">
              Symposium Date
            </div>
            <div className="text-base font-display font-semibold text-white">
              {event.date}
            </div>
          </div>
        </div>

        {/* Venue */}
        <div className="p-5 rounded-xl bg-[#19202a] border border-[#3b494c]/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#0d141d] border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#bac9cc] mb-1">
              Lab / Arena
            </div>
            <div className="text-base font-display font-semibold text-white truncate max-w-[170px]" title={event.venue}>
              {event.venue}
            </div>
          </div>
        </div>

        {/* Team Size */}
        <div className="p-5 rounded-xl bg-[#19202a] border border-[#3b494c]/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-[#0d141d] border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#bac9cc] mb-1">
              Team Structure
            </div>
            <div className="text-base font-display font-semibold text-white">
              {event.teamSize}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 4. MAIN DETAILS & RULES LAYOUT                                      */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        
        {/* Left Column (2/3 width): Overview, Rules, Schedule */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Overview */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#19202a] border border-[#3b494c]/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#00daf3]">
                // SPECIFICATION // OVERVIEW
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-4">
              Event Overview & Architecture
            </h3>
            <p className="text-sm sm:text-base text-[#bac9cc] leading-relaxed whitespace-pre-line">
              {event.fullDescription || event.description}
            </p>
          </div>

          {/* Rules & Guidelines */}
          <div className="p-6 sm:p-8 rounded-xl bg-[#19202a] border border-[#3b494c]/30">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#ffd799]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#ffd799]">
                // PROTOCOLS // RULES_AND_REGULATIONS
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-6">
              Rules & Evaluation Criteria
            </h3>

            {event.rules && event.rules.length > 0 ? (
              <div className="space-y-4">
                {event.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-3.5 p-3 rounded-lg bg-[#151c26]/60 border border-[#3b494c]/20">
                    <span className="font-mono text-xs text-[#00daf3] bg-[#0d141d] px-2 py-0.5 rounded border border-[#00daf3]/30 font-bold shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm sm:text-base text-[#dce3f0] leading-relaxed">
                      {rule}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#bac9cc] italic">
                Official rules will be provided during team briefing.
              </p>
            )}
          </div>

          {/* Schedule / Timeline (if available) */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="p-6 sm:p-8 rounded-xl bg-[#19202a] border border-[#3b494c]/30">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#00e5ff]" />
                <span className="font-mono text-xs uppercase tracking-widest text-[#00daf3]">
                  // TIMELINE // EVENT_MILESTONES
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-6">
                Rounds & Schedule
              </h3>
              <div className="space-y-3">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-lg bg-[#151c26] border border-[#3b494c]/20">
                    <span className="font-mono text-xs text-[#ffd799] font-bold">
                      {item.time}
                    </span>
                    <span className="text-sm text-[#dce3f0] font-medium">
                      {item.activity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1/3 width): Registration callout, coordinators, quick notes */}
        <div className="space-y-6">
          
          {/* Direct Registration Callout Box */}
          <div className="p-6 rounded-xl bg-gradient-to-b from-[#151c26] to-[#19202a] border border-[#00e5ff]/30 shadow-[0_0_24px_rgba(0,229,255,0.1)]">
            <div className="flex items-center gap-2 text-[#00daf3] font-mono text-xs font-bold uppercase mb-3">
              <ShieldCheck className="w-4 h-4 text-[#00e5ff]" />
              <span>Official Slot Reservation</span>
            </div>
            <h4 className="font-display font-bold text-lg text-white mb-2">
              Secure Your Entry
            </h4>
            <p className="text-xs sm:text-sm text-[#bac9cc] leading-relaxed mb-5">
              Registrations are processed through the ETAS encrypted gateway. Instant confirmation receipt generated upon submission.
            </p>
            <Link
              to={`/register/${event.id}`}
              className="w-full py-3 px-4 rounded-lg bg-[#00e5ff] hover:bg-[#00daf3] text-[#00363d] font-mono text-xs uppercase font-bold transition-all shadow-[0_0_14px_rgba(0,229,255,0.3)] flex items-center justify-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Proceed to Registration</span>
            </Link>
          </div>

          {/* Coordinators */}
          {event.coordinators && event.coordinators.length > 0 && (
            <div className="p-6 rounded-xl bg-[#19202a] border border-[#3b494c]/30">
              <div className="font-mono text-xs uppercase tracking-wider text-[#00daf3] font-semibold mb-4">
                // POINT_OF_CONTACT
              </div>
              <h4 className="font-display font-bold text-base text-white mb-4">
                Event Coordination Team
              </h4>
              <div className="space-y-3.5">
                {event.coordinators.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#151c26] border border-[#3b494c]/20">
                    <div className="text-sm font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-[#ffd799] font-mono mt-0.5">{c.contact}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Campus Guideline Notice */}
          <div className="p-5 rounded-xl bg-[#151c26] border border-[#3b494c]/30">
            <div className="flex items-center gap-2 text-[#ffd799] font-mono text-xs font-semibold mb-2">
              <AlertCircle className="w-4 h-4" />
              <span>PARTICIPANT BRIEFING</span>
            </div>
            <p className="text-xs text-[#bac9cc] leading-relaxed">
              All registered delegates must present valid college identification during morning registration. Component kits and testing apparatus will be issued at the department helpdesk.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
