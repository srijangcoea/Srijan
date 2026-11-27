import React from 'react';
import { X, User, Mail, Phone, Building, BookOpen, Calendar } from 'lucide-react';

export default function DetailDrawer({ registration, onClose }) {
  if (!registration) return null;

  const reg = registration;
  const isTeam = reg.registrationType === 'team';
  const leader = isTeam ? reg.teamLeader : reg.participant;
  const members = reg.members || [];

  const PersonCard = ({ person, label }) => (
    <div className="bg-white/[0.03] rounded-lg p-4 border border-white/[0.05]">
      <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-3">{label}</p>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <User size={14} className="text-slate-500" />
          <span className="text-white">{person?.name || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Mail size={14} className="text-slate-500" />
          <span className="text-slate-300">{person?.email || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone size={14} className="text-slate-500" />
          <span className="text-slate-300">{person?.phone || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Building size={14} className="text-slate-500" />
          <span className="text-slate-300">{person?.college || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <BookOpen size={14} className="text-slate-500" />
          <span className="text-slate-300">{person?.branch || person?.department || '—'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-slate-500" />
          <span className="text-slate-300">{person?.year || '—'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-950 border-l border-white/[0.06] z-50 overflow-y-auto shadow-2xl animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-slate-950/95 backdrop-blur-sm border-b border-white/[0.06] p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-bold text-white">{reg.registrationId}</h2>
            <p className="text-sm text-slate-400">{reg.eventName}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Submission Timestamp */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-semibold text-slate-500">Submitted On</span>
            <span className="font-mono text-slate-300">
              {new Date(reg.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </span>
          </div>

          {/* Team info */}
          {isTeam && (
            <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Team</p>
              <p className="text-white font-medium mt-1">{reg.teamName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{members.length + 1} members</p>
            </div>
          )}

          {/* Leader / Participant */}
          <PersonCard person={leader} label={isTeam ? 'Team Leader' : 'Participant'} />

          {/* Team Members */}
          {isTeam && members.length > 0 && (
            <div className="space-y-3">
              {members.map((m, idx) => (
                <PersonCard key={idx} person={m} label={`Member ${idx + 2}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
