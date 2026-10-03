import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Layers,
  User,
  Mail,
  Phone,
  GraduationCap,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { useRegistration } from '../hooks/useRegistration';
import MemberFields from './MemberFields';
import { notify } from '../utils/toast';

const DEPARTMENTS = [
  'Electronics & Telecommunication Engineering',
  'Computer Science & Engineering',
  'Information Technology',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Instrumentation Engineering',
  'Applied Science / Other',
];

const YEAR_OPTIONS = [
  { label: 'FY', value: 'FY' },
  { label: 'SY', value: 'SY' },
  { label: 'TY', value: 'TY' },
  { label: 'FINAL Y', value: 'Final Y' },
];

/**
 * Common Registration Portal Component
 * Recreates the Cybernetic Telemetry aesthetic from input_file_0.png.
 */
export default function RegistrationForm({ eventsList = [] }) {
  const {
    selectedEvent,
    isTeamEvent,
    minSlots,
    maxSlots,
    teamSize,
    isSubmitting,
    errorToast,
    setErrorToast,
    successData,
    handleSelectEvent,
    handleTeamSizeChange,
    onSubmit,
    handleRegisterAnother,
    register,
    setValue,
    watch,
    errors,
  } = useRegistration(eventsList);

  const [copied, setCopied] = React.useState(false);

  // Watch key inputs for live telemetry monitor readout
  const watchedTeamName = watch('teamName');
  const watchedLeaderName = watch('leader.name');
  const currentLeaderYear = watch('leader.year');

  const copyRegistrationId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    notify.info('Copied to Clipboard', `Registration ID: #${id}`);
    setTimeout(() => setCopied(false), 2500);
  };

  // ============================================================================
  // SUCCESS CONFIRMATION STATE
  // ============================================================================
  if (successData) {
    const isTeam = successData.registrationType === 'team';
    const leader = successData.leader || successData.teamLeader || successData.participant || {};
    const members = Array.isArray(successData.members) ? successData.members : [];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto rounded-3xl bg-[#06101c]/95 border border-[#22e5ff]/40 p-6 sm:p-10 md:p-12 backdrop-blur-2xl shadow-[0_0_50px_rgba(34,229,255,0.2)] text-[#e8f1f8] relative overflow-hidden"
      >
        {/* Top ambient highlight */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#22e5ff] to-transparent" />

        {/* Confirmation Header */}
        <div className="text-center space-y-3 pb-8 border-b border-[#22e5ff]/20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#22e5ff]/15 border border-[#22e5ff]/40 text-[#22e5ff] shadow-[0_0_25px_rgba(34,229,255,0.4)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="font-mono text-xs tracking-widest text-[#22e5ff] uppercase">
            TRANSMISSION VERIFIED // ENROLLMENT SECURED
          </div>

          <h2 className="text-3xl sm:text-4xl font-mono font-black text-white tracking-tight uppercase">
            REGISTRATION CONFIRMED
          </h2>

          <p className="text-slate-400 text-sm max-w-lg mx-auto font-mono">
            Candidate telemetry received and indexed in the Srijan 2026 technical roster.
          </p>
        </div>

        {/* Credentials / ID Strip */}
        <div className="py-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#091726] border border-[#22e5ff]/30">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#93a4b8] uppercase block">
                OFFICIAL REGISTRATION IDENTIFIER
              </span>
              <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#22e5ff] tracking-wider">
                {successData.registrationId}
              </span>
            </div>

            <button
              type="button"
              onClick={() => copyRegistrationId(successData.registrationId)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-[#0f283d] hover:bg-[#153855] border border-[#22e5ff]/30 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">COPIED TO CLIPBOARD</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#22e5ff]" />
                  <span>COPY ID</span>
                </>
              )}
            </button>
          </div>

          {/* Event & Team Roster Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-[#071320] border border-white/10 space-y-1">
              <span className="text-[#93a4b8] block">TARGET SCHEMATIC</span>
              <span className="text-white font-bold text-sm">
                {successData.eventName || 'Srijan Event'} {successData.eventCode ? `(${successData.eventCode})` : ''}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#071320] border border-white/10 space-y-1">
              <span className="text-[#93a4b8] block">MODALITY &amp; SQUAD</span>
              <span className="text-[#ffb400] font-bold text-sm">
                {isTeam ? `TEAM: ${successData.teamName || 'Team'}` : 'SOLO CANDIDATE'}
              </span>
            </div>
          </div>

          {/* Member Roster List */}
          <div className="p-5 rounded-2xl bg-[#071320] border border-white/10 space-y-3">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#93a4b8] border-b border-white/10 pb-2">
              <span>ENROLLED OPERATORS</span>
              <span>{isTeam ? `${successData.teamSize || members.length + 1} UNITS` : '1 UNIT'}</span>
            </div>

            <div className="space-y-2">
              {/* Leader / Participant */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#091829] text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#22e5ff]/15 text-[#22e5ff] font-mono text-[10px] font-bold">
                    {isTeam ? 'LEAD' : 'PARTICIPANT'}
                  </span>
                  <span className="font-bold text-white">{leader.name || 'Participant'}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                  {leader.email || ''} {leader.department || leader.branch ? `· ${leader.department || leader.branch}` : ''} {leader.year ? `(${leader.year})` : ''}
                </span>
              </div>

              {/* Members */}
              {members.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[#081522] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#ffb400]/15 text-[#ffb400] font-mono text-[10px] font-bold">
                      OP #{idx + 2}
                    </span>
                    <span className="text-slate-200">{m?.name || `Member ${idx + 2}`}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                    {m?.email || ''} {m?.department || m?.branch ? `· ${m?.department || m?.branch}` : ''} {m?.year ? `(${m.year})` : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={handleRegisterAnother}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono font-bold text-xs sm:text-sm text-[#00131c] bg-[#22e5ff] hover:bg-[#52eeff] shadow-[0_0_20px_rgba(34,229,255,0.6)] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REGISTER FOR ANOTHER EVENT</span>
          </button>
        </div>
      </motion.div>
    );
  }

  // ============================================================================
  // REGISTRATION FORM MAIN VIEWPORT
  // ============================================================================
  return (
    <div className="w-full text-[#e8f1f8] font-sans">
      {/* 1. PORTAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22e5ff]/20 pb-5 mb-8">
        <div>
          <h1 className="font-mono font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight uppercase flex items-center gap-3">
            <span>REGISTRATION PORTAL</span>
          </h1>
          <p className="text-[11px] sm:text-xs font-mono text-[#93a4b8] tracking-wider mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ffb400]" />
            <span>// SRIJAN 2026 CANDIDATE ENROLLMENT</span>
          </p>
        </div>

        {/* Step Indicator Badges */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#93a4b8]">
          <span className="px-2.5 py-1 rounded bg-[#0d2235] text-[#22e5ff] border border-[#22e5ff]/40 font-bold">
            01 SPEC
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-[#091522] border border-white/10">
            02 FILL
          </span>
          <span>→</span>
          <span className="px-2.5 py-1 rounded bg-[#091522] border border-white/10">
            03 CONFIRM
          </span>
        </div>
      </div>

      {/* ERROR TOAST BANNER */}
      {errorToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm font-mono flex items-center justify-between gap-3 shadow-lg shadow-rose-950/40"
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorToast(null)}
            className="text-xs text-rose-300 hover:text-white underline font-mono"
          >
            DISMISS
          </button>
        </motion.div>
      )}

      {/* FORM WRAPPER */}
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ================================================================== */}
          {/* LEFT COLUMN: SECTIONS 01, 02, 03 (lg: 8 cols) */}
          {/* ================================================================== */}
          <div className="lg:col-span-8 space-y-8">

            {/* ---------------------------------------------------------------- */}
            {/* SECTION 01: EVENT SPECIFICATION MATRIX */}
            {/* ---------------------------------------------------------------- */}
            <div className="rounded-2xl bg-[#06101c]/90 border border-[#22e5ff]/25 p-5 sm:p-7 backdrop-blur-xl shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#22e5ff]/15 pb-3.5 mb-5 font-mono text-xs">
                <div className="flex items-center gap-2 text-[#22e5ff] font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>01 REGISTER FOR EVENT</span>
                </div>
              </div>

              {/* 6 Event Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {eventsList.map((evt, idx) => {
                  const isSelected = selectedEvent?.id === evt.id;
                  const isTeam = (evt.maxTeamSize || 1) > 1;

                  return (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => handleSelectEvent(evt)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${isSelected
                          ? 'bg-[#0d2538] border-[#22e5ff] shadow-[0_0_15px_rgba(34,229,255,0.25)]'
                          : 'bg-[#091522] border-white/10 hover:border-[#22e5ff]/40 hover:bg-[#0c1c2b]'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-2 font-mono text-[10px]">
                        <span className={isSelected ? 'text-[#ffb400] font-bold' : 'text-[#93a4b8]'}>
                          ETAS-0{idx + 1}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isTeam
                              ? 'bg-[#22e5ff]/15 text-[#22e5ff] border border-[#22e5ff]/30'
                              : 'bg-white/10 text-slate-300'
                            }`}
                        >
                          {isTeam ? `TEAM [${evt.minTeamSize}-${evt.maxTeamSize}]` : 'SOLO [1]'}
                        </span>
                      </div>

                      <div className="font-bold text-white text-xs sm:text-sm tracking-wide group-hover:text-[#22e5ff] transition-colors truncate">
                        {evt.name.toUpperCase()}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        CODE: SRJ-{evt.code}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Channel Telemetry Banner */}
              <div className="p-3 rounded-xl bg-[#091726] border border-[#22e5ff]/20 font-mono text-[11px] flex flex-wrap items-center justify-between gap-2 mb-6">
                <div>
                  <span className="text-[#93a4b8]">ACTIVE CODE: </span>
                  <span className="text-[#22e5ff] font-bold">
                    {selectedEvent?.name?.toUpperCase()} (SRJ-{selectedEvent?.code})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#93a4b8]">
                    TEAM TYPE:{' '}
                    <span className="text-[#ffb400] font-bold">
                      {isTeamEvent ? 'TEAM SQUAD' : 'SOLO OPERATOR'}
                    </span>
                  </span>
                  <span className="text-[#93a4b8]">
                    CAPACITY:{' '}
                    <span className="text-white font-bold">
                      {isTeamEvent ? `${minSlots}-${maxSlots} OPERATORS` : '1 OPERATOR'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Team Event Exclusive Options (Callsign & Size selector) */}
              {isTeamEvent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2 border-t border-[#22e5ff]/15"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Team Callsign */}
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
                        Team  Name <span className="text-[#22e5ff]">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CyberVanguard-0x1"
                        {...register('teamName')}
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-[#091522] border text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${errors.teamName
                            ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/10'
                            : 'border-[#22e5ff]/25 focus:border-[#22e5ff] focus:ring-[#22e5ff]'
                          }`}
                      />
                      {errors.teamName && (
                        <p className="mt-1 text-[11px] font-mono text-rose-400">
                          {errors.teamName.message}
                        </p>
                      )}
                    </div>

                    {/* Team Size Selector (Driven strictly by minTeamSize & maxTeamSize) */}
                    <div>
                      <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
                        Team Size  <span className="text-[#22e5ff]">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        {Array.from(
                          { length: maxSlots - minSlots + 1 },
                          (_, idx) => minSlots + idx
                        ).map((size) => {
                          const isSelected = teamSize === size;
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => handleTeamSizeChange(size)}
                              className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${isSelected
                                  ? 'bg-[#22e5ff] text-[#00131c] border-[#22e5ff] shadow-[0_0_15px_rgba(34,229,255,0.4)]'
                                  : 'bg-[#091522] text-[#93a4b8] border-[#22e5ff]/20 hover:text-white hover:border-[#22e5ff]/50'
                                }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* SECTION 02: SQUAD LEADER / PARTICIPANT DOSSIER */}
            {/* ---------------------------------------------------------------- */}
            <div className="rounded-2xl bg-[#06101c]/90 border border-[#22e5ff]/25 p-5 sm:p-7 backdrop-blur-xl shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#22e5ff]/15 pb-3.5 mb-5 font-mono text-xs">
                <div className="flex items-center gap-2 text-[#22e5ff] font-bold">
                  <User className="w-4 h-4" />
                  <span>
                    02 // {isTeamEvent ? 'TEAM LEADER' : 'INDIVISUAL PARTICIPANT'}
                  </span>
                </div>
                
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
                    Full Name (First &amp; Last) <span className="text-[#22e5ff]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93a4b8]" />
                    <input
                      type="text"
                      placeholder="Alex J. Mercer"
                      {...register('leader.name')}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#091522] border text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${errors?.leader?.name
                          ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/10'
                          : 'border-[#22e5ff]/25 focus:border-[#22e5ff] focus:ring-[#22e5ff]'
                        }`}
                    />
                  </div>
                  {errors?.leader?.name && (
                    <p className="mt-1 text-[11px] font-mono text-rose-400">
                      {errors.leader.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
                    Email <span className="text-[#22e5ff]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93a4b8]" />
                    <input
                      type="email"
                      placeholder="alex.mercer@eng.edu"
                      {...register('leader.email')}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#091522] border text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${errors?.leader?.email
                          ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/10'
                          : 'border-[#22e5ff]/25 focus:border-[#22e5ff] focus:ring-[#22e5ff]'
                        }`}
                    />
                  </div>
                  {errors?.leader?.email && (
                    <p className="mt-1 text-[11px] font-mono text-rose-400">
                      {errors.leader.email.message}
                    </p>
                  )}
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
                    Mobile Number (10 Digits) <span className="text-[#22e5ff]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93a4b8]" />
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      {...register('leader.phone')}
                      className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#091522] border text-xs sm:text-sm text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:ring-1 transition-all ${errors?.leader?.phone
                          ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/10'
                          : 'border-[#22e5ff]/25 focus:border-[#22e5ff] focus:ring-[#22e5ff]'
                        }`}
                    />
                  </div>
                  {errors?.leader?.phone && (
                    <p className="mt-1 text-[11px] font-mono text-rose-400">
                      {errors.leader.phone.message}
                    </p>
                  )}
                </div>

                {/* Department Dropdown */}
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
                    Department <span className="text-[#22e5ff]">*</span>
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93a4b8] pointer-events-none" />
                    <select
                      {...register('leader.department')}
                      className={`w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#091522] border text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${errors?.leader?.department
                          ? 'border-rose-500/80 focus:ring-rose-500'
                          : 'border-[#22e5ff]/25 focus:border-[#22e5ff] focus:ring-[#22e5ff]'
                        }`}
                    >
                      <option value="" disabled className="bg-[#040a12] text-slate-500">
                        Select Department 
                      </option>
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept} className="bg-[#040a12] text-slate-200">
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors?.leader?.department && (
                    <p className="mt-1 text-[11px] font-mono text-rose-400">
                      {errors.leader.department.message}
                    </p>
                  )}
                </div>

                {/* Academic Standing (Year) */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
                    Academic Standing (Year) <span className="text-[#22e5ff]">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2 max-w-md">
                    {YEAR_OPTIONS.map((yr) => {
                      const selected = currentLeaderYear === yr.value;
                      return (
                        <button
                          key={yr.value}
                          type="button"
                          onClick={() => setValue('leader.year', yr.value, { shouldValidate: true })}
                          className={`py-2 px-3 rounded-xl font-mono text-xs font-bold tracking-wider border transition-all ${selected
                              ? 'bg-[#22e5ff] text-[#00131c] border-[#22e5ff] shadow-[0_0_15px_rgba(34,229,255,0.4)]'
                              : 'bg-[#091522] text-[#93a4b8] border-[#22e5ff]/20 hover:text-white hover:border-[#22e5ff]/50'
                            }`}
                        >
                          {yr.label}
                        </button>
                      );
                    })}
                  </div>
                  <input type="hidden" {...register('leader.year')} />
                  {errors?.leader?.year && (
                    <p className="mt-1.5 text-[11px] font-mono text-rose-400">
                      {errors.leader.year.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* SECTION 03: COMPLEMENTARY SQUAD OPERATORS (Team Only) */}
            {/* ---------------------------------------------------------------- */}
            {isTeamEvent && teamSize > 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono text-xs text-[#93a4b8] px-1">
                  <span className="text-[#ffb400] font-bold flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>03 // OTHER MEMBERS</span>
                  </span>
                </div>

                {errors?.members?.root && (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono">
                    {errors.members.root.message}
                  </div>
                )}

                {/* Render exactly teamSize - 1 member fields */}
                <div className="space-y-4">
                  <AnimatePresence>
                    {Array.from({ length: teamSize - 1 }).map((_, idx) => (
                      <MemberFields
                        key={idx}
                        index={idx}
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        watch={watch}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

          </div>

          {/* ================================================================== */}
          {/* RIGHT COLUMN: LIVE TELEMETRY & TRANSMIT ACTION (lg: 4 cols) */}
          {/* ================================================================== */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">

            {/* TELEMETRY MONITOR CARD */}
            

            {/* Animated ECG Pulse Wave Graphic */}
            <div className="p-3 rounded-xl bg-[#040c16] border border-[#22e5ff]/20 mb-5 relative overflow-hidden">
              <div className="flex items-center justify-between font-mono text-[9px] text-[#93a4b8] mb-1">
                <span>TX_FREQ: 142.50 MHz</span>
                <span className="text-[#22e5ff]">CARRIER_LOCK</span>
              </div>
              <svg className="w-full h-10 text-[#22e5ff]" viewBox="0 0 300 40">
                <path
                  d="M0,20 L50,20 L60,10 L70,30 L80,5 L90,35 L100,20 L180,20 L190,12 L200,28 L210,18 L220,20 L300,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="0; -50"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>


            {/* PRIMARY TRANSMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-mono font-bold text-xs sm:text-sm text-[#00131c] bg-[#22e5ff] hover:bg-[#52eeff] disabled:bg-slate-700 disabled:text-slate-400 shadow-[0_0_24px_rgba(34,229,255,0.6)] transition-all flex items-center justify-center gap-2 group tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#00131c]/30 border-t-[#00131c] rounded-full animate-spin" />
                  <span>ENCODING &amp; DISPATCHING...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current group-hover:scale-110 " />
                  <span>Register Now</span>
                </>
              )}
            </button>


            {/* TRANSMISSION PROTOCOLS CHECKLIST */}
            <div className="rounded-2xl bg-[#06101c]/90 border border-white/10 p-5 font-mono text-xs space-y-3">
              <div className="flex items-center gap-2 text-[#ffb400] font-bold border-b border-white/10 pb-2">
                <ShieldAlert className="w-4 h-4" />
                <span>REGISTRATION PROTOCOLS</span>
              </div>
              <ul className="space-y-2 text-[11px] text-[#93a4b8]">
                <li className="flex items-start gap-2">
                  <span className="text-[#22e5ff]">▪</span>
                  <span>Individual competitions accept precisely single-seated candidates.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#22e5ff]">▪</span>
                  <span>Hackathon rosters allow 2 to 4 validated crew records.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#22e5ff]">▪</span>
                  <span>Unique email and phone hash verified upon final relay dispatch.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}
