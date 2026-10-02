import React, { useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  Clock,
  Edit2,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Save,
  X,
  AlertCircle,
} from 'lucide-react';
import { getAdminEvents, updateAdminEvent } from '../../services/adminService';

export default function EventManagementPage() {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await getAdminEvents();
      if (res.success && res.data) {
        setEventsList(res.data);
      }
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleToggleRegistration = async (event) => {
    const newStatus = !event.registrationOpen;
    try {
      await updateAdminEvent(event._id || event.id || event.code, {
        registrationOpen: newStatus,
      });
      setEventsList((prev) =>
        prev.map((e) =>
          (e._id === event._id || e.code === event.code)
            ? { ...e, registrationOpen: newStatus }
            : e
        )
      );
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess('');
    try {
      const id = editingEvent._id || editingEvent.id || editingEvent.code;
      await updateAdminEvent(id, editingEvent);
      setEventsList((prev) =>
        prev.map((ev) =>
          (ev._id === editingEvent._id || ev.code === editingEvent.code)
            ? { ...ev, ...editingEvent }
            : ev
        )
      );
      setSaveSuccess(`Successfully updated configuration for "${editingEvent.name}"`);
      setTimeout(() => setSaveSuccess(''), 4000);
      setEditingEvent(null);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Event Management
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              6 CORE COMPETITIONS
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure dates, venues, prize pools, team constraints, deadlines, and registration status.
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {eventsList.map((event) => {
          const isOpen = event.registrationOpen ?? true;
          return (
            <div
              key={event.code || event.id}
              className="rounded-xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-sm p-5 space-y-4 hover:border-cyan-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
                      {event.code}
                    </span>
                    <h2 className="text-base font-bold text-white mt-1.5">{event.name}</h2>
                    <p className="text-xs text-slate-400">{event.tagline || event.category}</p>
                  </div>
                  <button
                    onClick={() => handleToggleRegistration(event)}
                    title={isOpen ? 'Click to close registrations' : 'Click to open registrations'}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      isOpen
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span>{isOpen ? 'Open' : 'Closed'}</span>
                  </button>
                </div>

                {/* Details List */}
                <div className="space-y-2 pt-2 border-t border-white/[0.06] text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <MapPin size={13} className="text-cyan-400" /> Venue:
                    </span>
                    <span className="font-medium text-right truncate max-w-[180px]">
                      {event.venue || 'To be announced'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Calendar size={13} className="text-cyan-400" /> Date:
                    </span>
                    <span className="font-medium text-right">
                      {event.date || 'To be announced'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Trophy size={13} className="text-amber-400" /> Prize Pool:
                    </span>
                    <span className="font-semibold text-amber-300">
                      {event.prizePool || 'To be announced'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Users size={13} className="text-blue-400" /> Team Size:
                    </span>
                    <span className="font-mono text-cyan-300">
                      {event.minTeamSize === event.maxTeamSize
                        ? `${event.minTeamSize} member`
                        : `${event.minTeamSize}–${event.maxTeamSize} members`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock size={13} className="text-purple-400" /> Deadline:
                    </span>
                    <span className="font-mono text-slate-400">
                      {event.registrationDeadline
                        ? new Date(event.registrationDeadline).toLocaleDateString()
                        : 'No deadline set'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit button */}
              <div className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => setEditingEvent({ ...event })}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs font-semibold text-white transition-colors"
                >
                  <Edit2 size={13} className="text-cyan-400" />
                  <span>Configure Settings</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditingEvent(null)}
          />
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Edit Event: {editingEvent.name}
                  <span className="text-xs font-mono text-cyan-400 font-normal">
                    [{editingEvent.code}]
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Update event logistics and operational constraints</p>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Date / Schedule
                  </label>
                  <input
                    type="text"
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    placeholder="e.g. October 24, 2026"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Venue Location
                  </label>
                  <input
                    type="text"
                    value={editingEvent.venue || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}
                    placeholder="e.g. Main Auditorium / Lab 3"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Prize Pool
                  </label>
                  <input
                    type="text"
                    value={editingEvent.prizePool || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, prizePool: e.target.value })}
                    placeholder="e.g. ₹25,000"
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Registration Deadline
                  </label>
                  <input
                    type="date"
                    value={
                      editingEvent.registrationDeadline
                        ? new Date(editingEvent.registrationDeadline).toISOString().split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, registrationDeadline: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Min Team Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingEvent.minTeamSize || 1}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, minTeamSize: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editingEvent.maxTeamSize || 1}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, maxTeamSize: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Registration Open Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <div>
                  <p className="text-xs font-semibold text-white">Accepting Registrations</p>
                  <p className="text-[11px] text-slate-400">
                    When closed, the public registration form will disable submissions for this event.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingEvent({
                      ...editingEvent,
                      registrationOpen: !editingEvent.registrationOpen,
                    })
                  }
                  className={`text-2xl transition-colors ${
                    editingEvent.registrationOpen ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                >
                  {editingEvent.registrationOpen ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 rounded-lg border border-white/[0.08] text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
