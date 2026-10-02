import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, GraduationCap, Calendar } from 'lucide-react';

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
 * MemberFields Component
 * Renders individual dossier cards for complementary squad operators (Member 2 to 4)
 * with inline validation and cyber telemetry inputs.
 */
export default function MemberFields({ index, register, errors, setValue, watch }) {
  const memberNumber = index + 2; // Operator 02, Operator 03, etc.
  const currentYear = watch(`members.${index}.year`);
  const memberErrors = errors?.members?.[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -16, height: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="rounded-2xl bg-[#06101c]/90 border border-[#22e5ff]/20 p-5 sm:p-7 backdrop-blur-xl shadow-lg relative overflow-hidden"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#22e5ff]/15 pb-3.5 mb-5 font-mono text-xs">
        <div className="flex items-center gap-2 text-[#22e5ff] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#22e5ff] animate-ping" />
          <span>OPERATOR {String(memberNumber).padStart(2, '0')} DOSSIER</span>
        </div>
        <span className="text-[11px] text-[#93a4b8] tracking-widest">
          SLOT_POS: #{String(memberNumber).padStart(2, '0')}
        </span>
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
              placeholder="e.g. Devon Vance"
              {...register(`members.${index}.name`)}
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#091522] border text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                memberErrors?.name
                  ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/10'
                  : 'border-[#22e5ff]/25 focus:border-[#22e5ff] focus:ring-[#22e5ff]'
              }`}
            />
          </div>
          {memberErrors?.name && (
            <p className="mt-1 text-[11px] font-mono text-rose-400">
              {memberErrors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
            Institutional / Primary Email <span className="text-[#22e5ff]">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93a4b8]" />
            <input
              type="email"
              placeholder="devon.v@eng.edu"
              {...register(`members.${index}.email`)}
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#091522] border text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 transition-all ${
                memberErrors?.email
                  ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/10'
                  : 'border-[#22e5ff]/25 focus:border-[#22e5ff] focus:ring-[#22e5ff]'
              }`}
            />
          </div>
          {memberErrors?.email && (
            <p className="mt-1 text-[11px] font-mono text-rose-400">
              {memberErrors.email.message}
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
              placeholder="9812345670"
              {...register(`members.${index}.phone`)}
              className={`w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#091522] border text-xs sm:text-sm text-slate-100 placeholder-slate-600 font-mono focus:outline-none focus:ring-1 transition-all ${
                memberErrors?.phone
                  ? 'border-rose-500/80 focus:ring-rose-500 bg-rose-950/10'
                  : 'border-[#22e5ff]/25 focus:border-[#22e5ff] focus:ring-[#22e5ff]'
              }`}
            />
          </div>
          {memberErrors?.phone && (
            <p className="mt-1 text-[11px] font-mono text-rose-400">
              {memberErrors.phone.message}
            </p>
          )}
        </div>

        {/* Department */}
        <div>
          <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
            Academic Department <span className="text-[#22e5ff]">*</span>
          </label>
          <div className="relative">
            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#93a4b8] pointer-events-none" />
            <select
              {...register(`members.${index}.department`)}
              className={`w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#091522] border text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-1 transition-all appearance-none cursor-pointer ${
                memberErrors?.department
                  ? 'border-rose-500/80 focus:ring-rose-500'
                  : 'border-[#22e5ff]/25 focus:border-[#22e5ff] focus:ring-[#22e5ff]'
              }`}
            >
              <option value="" disabled className="bg-[#040a12] text-slate-500">
                Select Department Matrix
              </option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-[#040a12] text-slate-200">
                  {dept}
                </option>
              ))}
            </select>
          </div>
          {memberErrors?.department && (
            <p className="mt-1 text-[11px] font-mono text-rose-400">
              {memberErrors.department.message}
            </p>
          )}
        </div>

        {/* Academic Standing Year (Pill Selection) */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-mono tracking-wider text-[#93a4b8] uppercase mb-1.5">
            Academic Standing (Year) <span className="text-[#22e5ff]">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2 max-w-md">
            {YEAR_OPTIONS.map((yr) => {
              const selected = currentYear === yr.value;
              return (
                <button
                  key={yr.value}
                  type="button"
                  onClick={() => setValue(`members.${index}.year`, yr.value, { shouldValidate: true })}
                  className={`py-2 px-3 rounded-xl font-mono text-xs font-bold tracking-wider border transition-all ${
                    selected
                      ? 'bg-[#22e5ff] text-[#00131c] border-[#22e5ff] shadow-[0_0_15px_rgba(34,229,255,0.4)]'
                      : 'bg-[#091522] text-[#93a4b8] border-[#22e5ff]/20 hover:text-white hover:border-[#22e5ff]/50'
                  }`}
                >
                  {yr.label}
                </button>
              );
            })}
          </div>
          <input type="hidden" {...register(`members.${index}.year`)} />
          {memberErrors?.year && (
            <p className="mt-1.5 text-[11px] font-mono text-rose-400">
              {memberErrors.year.message}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
