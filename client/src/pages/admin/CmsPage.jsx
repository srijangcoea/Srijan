import React, { useState, useEffect } from 'react';
import {
  Globe,
  Home,
  Info,
  Calendar,
  Trophy,
  HelpCircle,
  Award,
  Users,
  PhoneCall,
  Megaphone,
  Save,
  Eye,
  UploadCloud,
  EyeOff,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  CheckCircle,
  Clock,
  Sparkles,
  Edit2,
  X,
} from 'lucide-react';
import {
  getAdminCms,
  saveCmsDraft,
  publishCmsSection,
  unpublishCmsSection,
  resetCmsDraft,
  getAdminEvents,
  createAdminEvent,
  updateAdminEvent,
  deleteAdminEvent,
} from '../../services/adminService';
import { useCms } from '../../contexts/CmsContext';
import CmsImageUploader from '../../components/admin/CmsImageUploader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { notify } from '../../utils/toast';

const SECTIONS = [
  { id: 'homepage', label: 'Homepage & Hero', icon: Home, previewPath: '/?preview=1' },
  { id: 'about', label: 'About & Vision', icon: Info, previewPath: '/about?preview=1' },
  { id: 'events', label: 'Events (CRUD)', icon: Sparkles, previewPath: '/events?preview=1' },
  { id: 'schedule', label: 'Schedule', icon: Calendar, previewPath: '/schedule?preview=1' },
  { id: 'prizes', label: 'Prizes & Rewards', icon: Trophy, previewPath: '/?preview=1' },
  { id: 'faq', label: 'FAQ', icon: HelpCircle, previewPath: '/?preview=1' },
  { id: 'sponsors', label: 'Sponsors', icon: Award, previewPath: '/?preview=1' },
  { id: 'team', label: 'Team', icon: Users, previewPath: '/ourteam?preview=1' },
  { id: 'footer', label: 'Footer & Contact', icon: PhoneCall, previewPath: '/?preview=1' },
  { id: 'notices', label: 'Notices & Alerts', icon: Megaphone, previewPath: '/?preview=1' },
];

const inputCls =
  'w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-500/50 transition-colors';
const labelCls = 'block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5';

const moveItem = (arr, index, dir) => {
  const next = [...arr];
  const target = index + dir;
  if (target < 0 || target >= next.length) return arr;
  [next[index], next[target]] = [next[target], next[index]];
  return next.map((item, i) => ({ ...item, order: i + 1 }));
};

export default function CmsPage() {
  const { refreshCms } = useCms();
  const [activeSection, setActiveSection] = useState('homepage');
  const [cmsMap, setCmsMap] = useState({});
  const [drafts, setDrafts] = useState({});
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Event modal state (for 'events' tab)
  const [eventModal, setEventModal] = useState(null); // null or event object
  const [isNewEvent, setIsNewEvent] = useState(false);

  // Confirm Dialog
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    variant: 'danger',
    onConfirm: () => {},
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [cmsRes, evRes] = await Promise.all([getAdminCms(), getAdminEvents()]);
      if (cmsRes.success && Array.isArray(cmsRes.data)) {
        const map = {};
        const dMap = {};
        cmsRes.data.forEach((doc) => {
          map[doc.section] = doc;
          dMap[doc.section] = structuredClone(doc.draftData || doc.publishedData || {});
        });
        setCmsMap(map);
        setDrafts(dMap);
      }
      if (evRes.success && Array.isArray(evRes.data)) {
        setEventsList(evRes.data);
      }
    } catch (err) {
      notify.error('Load Failed', err.message || 'Could not load CMS data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const currentMeta = cmsMap[activeSection] || { status: 'published', hasUnpublishedChanges: false };
  const currentDraft = drafts[activeSection] || {};

  const updateDraft = (updater) => {
    setDrafts((prev) => {
      const current = prev[activeSection] || {};
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      return { ...prev, [activeSection]: next };
    });
  };

  // ── SiteContent Actions ──
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await saveCmsDraft(activeSection, currentDraft);
      if (res.success && res.data) {
        setCmsMap((prev) => ({ ...prev, [activeSection]: res.data }));
        notify.success('Draft Saved', `Saved draft for ${activeSection}. Click Preview or Publish when ready.`);
      }
    } catch (err) {
      notify.error('Save Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      const res = await publishCmsSection(activeSection, currentDraft);
      if (res.success && res.data) {
        setCmsMap((prev) => ({ ...prev, [activeSection]: res.data }));
        await refreshCms();
        notify.success('Published Live', `"${activeSection}" is now live on the public website!`);
      }
    } catch (err) {
      notify.error('Publish Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = () => {
    setConfirmDialog({
      open: true,
      title: `Unpublish "${activeSection}"?`,
      message: 'This section will be hidden from the public website until published again.',
      variant: 'warning',
      onConfirm: async () => {
        setConfirmDialog((p) => ({ ...p, open: false }));
        setSaving(true);
        try {
          const res = await unpublishCmsSection(activeSection);
          if (res.success && res.data) {
            setCmsMap((prev) => ({ ...prev, [activeSection]: res.data }));
            await refreshCms();
            notify.info('Unpublished', `"${activeSection}" moved to draft.`);
          }
        } catch (err) {
          notify.error('Action Failed', err.message);
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const handleResetDraft = async () => {
    setSaving(true);
    try {
      const res = await resetCmsDraft(activeSection);
      if (res.success && res.data) {
        setCmsMap((prev) => ({ ...prev, [activeSection]: res.data }));
        setDrafts((prev) => ({ ...prev, [activeSection]: structuredClone(res.data.draftData || {}) }));
        notify.info('Draft Reverted', 'Reverted to the currently published version.');
      }
    } catch (err) {
      notify.error('Reset Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = async () => {
    // Save draft first so preview reflects latest edits
    await saveCmsDraft(activeSection, currentDraft);
    const meta = SECTIONS.find((s) => s.id === activeSection);
    window.open(meta?.previewPath || '/?preview=1', '_blank', 'noopener,noreferrer');
  };

  // ── Events CRUD Actions ──
  const openNewEventModal = () => {
    setIsNewEvent(true);
    setEventModal({
      name: '',
      code: '',
      slug: '',
      category: 'Technical Competition',
      tagline: '',
      description: '',
      fullDescription: '',
      registrationType: 'team',
      minTeamSize: 1,
      maxTeamSize: 4,
      registrationOpen: true,
      prizePool: '₹20,000',
      date: '21 December 2026',
      venue: 'GCOEA Campus',
      registrationLink: '',
      image: '',
      rules: ['Carry a valid college ID card.'],
      status: 'published',
      visible: true,
      order: eventsList.length + 1,
    });
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventModal.name || !eventModal.code || !eventModal.description) {
      notify.error('Validation Error', 'Name, Code, and Description are required.');
      return;
    }
    setSaving(true);
    try {
      if (isNewEvent) {
        const res = await createAdminEvent(eventModal);
        if (res.success && res.data) {
          setEventsList((prev) => [...prev, res.data]);
          notify.success('Event Created', `"${res.data.name}" added.`);
        }
      } else {
        const id = eventModal._id || eventModal.slug || eventModal.code;
        const res = await updateAdminEvent(id, eventModal);
        if (res.success && res.data) {
          setEventsList((prev) =>
            prev.map((ev) => ((ev._id || ev.slug) === (res.data._id || res.data.slug) ? res.data : ev))
          );
          notify.success('Event Updated', `"${res.data.name}" saved.`);
        }
      }
      await refreshCms();
      setEventModal(null);
    } catch (err) {
      notify.error('Event Save Failed', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = (ev) => {
    setConfirmDialog({
      open: true,
      title: `Delete "${ev.name}"?`,
      message: 'This will permanently remove this event from the database and public website.',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmDialog((p) => ({ ...p, open: false }));
        try {
          await deleteAdminEvent(ev._id || ev.slug || ev.code);
          setEventsList((prev) => prev.filter((item) => (item._id || item.slug) !== (ev._id || ev.slug)));
          await refreshCms();
          notify.info('Event Deleted', `"${ev.name}" removed.`);
        } catch (err) {
          notify.error('Delete Failed', err.message);
        }
      },
    });
  };

  const toggleEventStatus = async (ev) => {
    const nextStatus = ev.status === 'draft' ? 'published' : 'draft';
    try {
      const res = await updateAdminEvent(ev._id || ev.slug || ev.code, { status: nextStatus });
      if (res.success) {
        setEventsList((prev) =>
          prev.map((item) => ((item._id || item.slug) === (ev._id || ev.slug) ? { ...item, status: nextStatus } : item))
        );
        await refreshCms();
        notify.success('Status Updated', `"${ev.name}" is now ${nextStatus}.`);
      }
    } catch (err) {
      notify.error('Update Failed', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6 text-cyan-400" />
            <span>Website Content Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Edit, preview, draft, and publish all public website sections directly to MongoDB.
          </p>
        </div>

        <button
          onClick={loadAll}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-cyan-400' : ''} />
          <span>Sync DB</span>
        </button>
      </div>

      {/* Main Layout: Section Sidebar + Editor Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section Tabs */}
        <aside className="lg:col-span-3 flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const active = activeSection === sec.id;
            const meta = cmsMap[sec.id];
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.12)]'
                    : 'bg-slate-900/50 border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className={active ? 'text-cyan-400' : 'text-slate-500'} />
                  <span>{sec.label}</span>
                </div>
                {meta && (
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      meta.status === 'published'
                        ? meta.hasUnpublishedChanges
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                        : 'bg-slate-500'
                    }`}
                    title={meta.status === 'published' ? 'Published' : 'Draft / Unpublished'}
                  />
                )}
              </button>
            );
          })}
        </aside>

        {/* Editor Area */}
        <div className="lg:col-span-9 space-y-5">
          {/* Action Toolbar (for SiteContent sections) */}
          {activeSection !== 'events' && (
            <div className="rounded-xl bg-slate-900/70 border border-white/[0.08] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${
                    currentMeta.status === 'published'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 border-white/10'
                  }`}
                >
                  {currentMeta.status === 'published' ? <CheckCircle size={12} /> : <Clock size={12} />}
                  <span>{currentMeta.status === 'published' ? 'PUBLISHED' : 'DRAFT / UNPUBLISHED'}</span>
                </span>
                {currentMeta.hasUnpublishedChanges && (
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Unpublished Draft
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetDraft}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors"
                  title="Discard unpublished changes"
                >
                  <RotateCcw size={13} />
                  <span>Revert</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-white/10 text-xs text-white hover:bg-slate-700 transition-colors"
                >
                  <Save size={13} />
                  <span>Save Draft</span>
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-medium transition-colors"
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>
                {currentMeta.status === 'published' && (
                  <button
                    type="button"
                    onClick={handleUnpublish}
                    disabled={saving}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-300 hover:bg-red-500/20 text-xs font-medium transition-colors"
                  >
                    <EyeOff size={13} />
                    <span>Unpublish</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all"
                >
                  <UploadCloud size={14} />
                  <span>{saving ? 'Publishing...' : 'Publish Live'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="rounded-xl bg-slate-900/50 border border-white/[0.06] p-12 text-center text-xs text-slate-400">
              Loading CMS content from database...
            </div>
          ) : (
            <div className="rounded-xl bg-slate-900/60 border border-white/[0.08] p-5 sm:p-6 space-y-5">
              {/* ── 1. HOMEPAGE & HERO ── */}
              {activeSection === 'homepage' && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.06] pb-2">
                    Homepage & Hero Configuration
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Hero Title</label>
                      <input className={inputCls} value={currentDraft.title || ''} onChange={(e) => updateDraft({ title: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Edition Year</label>
                      <input className={inputCls} value={currentDraft.edition || ''} onChange={(e) => updateDraft({ edition: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Top Badge</label>
                      <input className={inputCls} value={currentDraft.badge || ''} onChange={(e) => updateDraft({ badge: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Subtitle</label>
                      <input className={inputCls} value={currentDraft.subtitle || ''} onChange={(e) => updateDraft({ subtitle: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Tagline</label>
                      <input className={inputCls} value={currentDraft.tagline || ''} onChange={(e) => updateDraft({ tagline: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Hero Description</label>
                    <textarea rows={3} className={inputCls} value={currentDraft.description || ''} onChange={(e) => updateDraft({ description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Event Dates Chip</label>
                      <input className={inputCls} value={currentDraft.eventDateText || ''} onChange={(e) => updateDraft({ eventDateText: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Venue Chip</label>
                      <input className={inputCls} value={currentDraft.venueText || ''} onChange={(e) => updateDraft({ venueText: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Events Count Chip</label>
                      <input className={inputCls} value={currentDraft.eventsCountText || ''} onChange={(e) => updateDraft({ eventsCountText: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Countdown Title</label>
                      <input className={inputCls} value={currentDraft.countdownTitle || ''} onChange={(e) => updateDraft({ countdownTitle: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Countdown Target (ISO)</label>
                      <input className={inputCls} value={currentDraft.countdownTarget || ''} onChange={(e) => updateDraft({ countdownTarget: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Primary CTA Label</label>
                      <input className={inputCls} value={currentDraft.primaryCtaLabel || ''} onChange={(e) => updateDraft({ primaryCtaLabel: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Primary CTA Link</label>
                      <input className={inputCls} value={currentDraft.primaryCtaLink || ''} onChange={(e) => updateDraft({ primaryCtaLink: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Secondary CTA Label</label>
                      <input className={inputCls} value={currentDraft.secondaryCtaLabel || ''} onChange={(e) => updateDraft({ secondaryCtaLabel: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Secondary CTA Link</label>
                      <input className={inputCls} value={currentDraft.secondaryCtaLink || ''} onChange={(e) => updateDraft({ secondaryCtaLink: e.target.value })} />
                    </div>
                  </div>
                  <CmsImageUploader
                    label="Hero Banner Image (Optional)"
                    value={currentDraft.bannerImage || ''}
                    onChange={(url) => updateDraft({ bannerImage: url })}
                  />
                  <div className="pt-3 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Bottom CTA Headline</label>
                      <input className={inputCls} value={currentDraft.ctaSectionTitle || ''} onChange={(e) => updateDraft({ ctaSectionTitle: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Bottom CTA Prize Pool</label>
                      <input className={inputCls} value={currentDraft.ctaPrizePool || ''} onChange={(e) => updateDraft({ ctaPrizePool: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── 2. ABOUT, VISION & MISSION ── */}
              {activeSection === 'about' && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.06] pb-2">
                    About, Vision & Mission
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Section Badge</label>
                      <input className={inputCls} value={currentDraft.badge || ''} onChange={(e) => updateDraft({ badge: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Main Heading</label>
                      <input className={inputCls} value={currentDraft.heading || ''} onChange={(e) => updateDraft({ heading: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Festival Description</label>
                    <textarea rows={3} className={inputCls} value={currentDraft.description || ''} onChange={(e) => updateDraft({ description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={labelCls}>Vision Title</label>
                      <input className={inputCls} value={currentDraft.visionTitle || ''} onChange={(e) => updateDraft({ visionTitle: e.target.value })} />
                      <label className={labelCls}>Vision Statement</label>
                      <textarea rows={3} className={inputCls} value={currentDraft.visionText || ''} onChange={(e) => updateDraft({ visionText: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className={labelCls}>Mission Title</label>
                      <input className={inputCls} value={currentDraft.missionTitle || ''} onChange={(e) => updateDraft({ missionTitle: e.target.value })} />
                      <label className={labelCls}>Mission Statement</label>
                      <textarea rows={3} className={inputCls} value={currentDraft.missionText || ''} onChange={(e) => updateDraft({ missionText: e.target.value })} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── 3. EVENTS CRUD ── */}
              {activeSection === 'events' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div>
                      <h2 className="text-base font-bold text-white">Events Manager ({eventsList.length})</h2>
                      <p className="text-xs text-slate-400">Add, edit, delete, draft/publish competitions synced to MongoDB.</p>
                    </div>
                    <button
                      type="button"
                      onClick={openNewEventModal}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-colors"
                    >
                      <Plus size={14} />
                      <span>Add Event</span>
                    </button>
                  </div>

                  {eventsList.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400">No events found. Click "Add Event" to create one.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {eventsList.map((ev) => (
                        <div key={ev._id || ev.slug || ev.code} className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.08] space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-xs font-bold text-cyan-400">{ev.code}</span>
                              <h3 className="font-semibold text-sm text-white truncate">{ev.name}</h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleEventStatus(ev)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                                ev.status === 'draft'
                                  ? 'bg-slate-800 text-slate-300 border-white/10'
                                  : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              }`}
                            >
                              {ev.status === 'draft' ? 'DRAFT' : 'PUBLISHED'}
                            </button>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/[0.06]">
                            <span>{ev.prizePool || '₹20,000'} · {ev.venue || 'TBA'}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => { setIsNewEvent(false); setEventModal(structuredClone(ev)); }}
                                className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                                title="Edit"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEvent(ev)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── 4. SCHEDULE ── */}
              {activeSection === 'schedule' && (
                <div className="space-y-5">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.06] pb-2">
                    Schedule & Day-wise Timings
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Header Dates</label>
                      <input className={inputCls} value={currentDraft.headerDates || ''} onChange={(e) => updateDraft({ headerDates: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Header Duration</label>
                      <input className={inputCls} value={currentDraft.headerDuration || ''} onChange={(e) => updateDraft({ headerDuration: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Header Venue</label>
                      <input className={inputCls} value={currentDraft.headerVenue || ''} onChange={(e) => updateDraft({ headerVenue: e.target.value })} />
                    </div>
                  </div>

                  {(currentDraft.days || []).map((dayObj, dIdx) => (
                    <div key={dayObj.id || dIdx} className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-cyan-400">{dayObj.day} — {dayObj.date}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextDays = [...(currentDraft.days || [])];
                            nextDays[dIdx] = {
                              ...dayObj,
                              events: [
                                ...(dayObj.events || []),
                                { id: `slot-${Date.now()}`, time: '10:00 AM – 12:00 PM', code: '#01', title: 'New Slot', venue: 'Main Auditorium', badge: 'COMPETITION', eventId: '', isBreak: false, desc: '' },
                              ],
                            };
                            updateDraft({ days: nextDays });
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/15 text-cyan-300 text-xs font-medium"
                        >
                          <Plus size={12} /> Add Slot
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          className={inputCls}
                          placeholder="Date (e.g. 21 DECEMBER 2026)"
                          value={dayObj.date || ''}
                          onChange={(e) => {
                            const nextDays = [...currentDraft.days];
                            nextDays[dIdx] = { ...dayObj, date: e.target.value };
                            updateDraft({ days: nextDays });
                          }}
                        />
                        <input
                          className={inputCls}
                          placeholder="Window (e.g. 11:00 AM – 05:00 PM)"
                          value={dayObj.window || ''}
                          onChange={(e) => {
                            const nextDays = [...currentDraft.days];
                            nextDays[dIdx] = { ...dayObj, window: e.target.value };
                            updateDraft({ days: nextDays });
                          }}
                        />
                        <input
                          className={inputCls}
                          placeholder="Day Title"
                          value={dayObj.title || ''}
                          onChange={(e) => {
                            const nextDays = [...currentDraft.days];
                            nextDays[dIdx] = { ...dayObj, title: e.target.value };
                            updateDraft({ days: nextDays });
                          }}
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        {(dayObj.events || []).map((slot, sIdx) => (
                          <div key={slot.id || sIdx} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            <input
                              className={`${inputCls} sm:col-span-3`}
                              value={slot.time || ''}
                              placeholder="Time"
                              onChange={(e) => {
                                const nextDays = [...currentDraft.days];
                                const evts = [...dayObj.events];
                                evts[sIdx] = { ...slot, time: e.target.value };
                                nextDays[dIdx] = { ...dayObj, events: evts };
                                updateDraft({ days: nextDays });
                              }}
                            />
                            <input
                              className={`${inputCls} sm:col-span-4`}
                              value={slot.title || ''}
                              placeholder="Event Title"
                              onChange={(e) => {
                                const nextDays = [...currentDraft.days];
                                const evts = [...dayObj.events];
                                evts[sIdx] = { ...slot, title: e.target.value };
                                nextDays[dIdx] = { ...dayObj, events: evts };
                                updateDraft({ days: nextDays });
                              }}
                            />
                            <input
                              className={`${inputCls} sm:col-span-3`}
                              value={slot.venue || ''}
                              placeholder="Venue"
                              onChange={(e) => {
                                const nextDays = [...currentDraft.days];
                                const evts = [...dayObj.events];
                                evts[sIdx] = { ...slot, venue: e.target.value };
                                nextDays[dIdx] = { ...dayObj, events: evts };
                                updateDraft({ days: nextDays });
                              }}
                            />
                            <div className="sm:col-span-2 flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextDays = [...currentDraft.days];
                                  nextDays[dIdx] = { ...dayObj, events: moveItem(dayObj.events, sIdx, -1) };
                                  updateDraft({ days: nextDays });
                                }}
                                className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-white"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextDays = [...currentDraft.days];
                                  nextDays[dIdx] = {
                                    ...dayObj,
                                    events: dayObj.events.filter((_, i) => i !== sIdx),
                                  };
                                  updateDraft({ days: nextDays });
                                }}
                                className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── 5. PRIZES & REWARDS ── */}
              {activeSection === 'prizes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <h2 className="text-base font-bold text-white">Prizes & Rewards</h2>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft({
                          items: [
                            ...(currentDraft.items || []),
                            { id: `p-${Date.now()}`, eventName: 'New Event', position: '1st Place', amount: '₹10,000', reward: 'Trophy + Certificate', visible: true },
                          ],
                        })
                      }
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-medium"
                    >
                      <Plus size={13} /> Add Prize
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Section Title</label>
                      <input className={inputCls} value={currentDraft.sectionTitle || ''} onChange={(e) => updateDraft({ sectionTitle: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Total Prize Pool</label>
                      <input className={inputCls} value={currentDraft.totalPool || ''} onChange={(e) => updateDraft({ totalPool: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    {(currentDraft.items || []).map((item, idx) => (
                      <div key={item.id || idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                        <input
                          className={`${inputCls} sm:col-span-3`}
                          placeholder="Event Name"
                          value={item.eventName || ''}
                          onChange={(e) => {
                            const next = [...currentDraft.items];
                            next[idx] = { ...item, eventName: e.target.value };
                            updateDraft({ items: next });
                          }}
                        />
                        <input
                          className={`${inputCls} sm:col-span-3`}
                          placeholder="Position"
                          value={item.position || ''}
                          onChange={(e) => {
                            const next = [...currentDraft.items];
                            next[idx] = { ...item, position: e.target.value };
                            updateDraft({ items: next });
                          }}
                        />
                        <input
                          className={`${inputCls} sm:col-span-2`}
                          placeholder="Amount"
                          value={item.amount || ''}
                          onChange={(e) => {
                            const next = [...currentDraft.items];
                            next[idx] = { ...item, amount: e.target.value };
                            updateDraft({ items: next });
                          }}
                        />
                        <input
                          className={`${inputCls} sm:col-span-2`}
                          placeholder="Rewards"
                          value={item.reward || ''}
                          onChange={(e) => {
                            const next = [...currentDraft.items];
                            next[idx] = { ...item, reward: e.target.value };
                            updateDraft({ items: next });
                          }}
                        />
                        <div className="sm:col-span-2 flex items-center justify-end gap-1">
                          <button type="button" onClick={() => updateDraft({ items: moveItem(currentDraft.items, idx, -1) })} className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-white"><ArrowUp size={12} /></button>
                          <button type="button" onClick={() => updateDraft({ items: moveItem(currentDraft.items, idx, 1) })} className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-white"><ArrowDown size={12} /></button>
                          <button type="button" onClick={() => updateDraft({ items: currentDraft.items.filter((_, i) => i !== idx) })} className="p-1.5 rounded bg-red-500/10 text-red-400"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 6. FAQ ── */}
              {activeSection === 'faq' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <h2 className="text-base font-bold text-white">Frequently Asked Questions</h2>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft({
                          items: [
                            ...(currentDraft.items || []),
                            { id: `faq-${Date.now()}`, question: 'New Question?', answer: '', category: 'General', visible: true },
                          ],
                        })
                      }
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-medium"
                    >
                      <Plus size={13} /> Add Question
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(currentDraft.items || []).map((faq, idx) => (
                      <div key={faq.id || idx} className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            className={`${inputCls} font-semibold`}
                            placeholder="Question"
                            value={faq.question || ''}
                            onChange={(e) => {
                              const next = [...currentDraft.items];
                              next[idx] = { ...faq, question: e.target.value };
                              updateDraft({ items: next });
                            }}
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <button type="button" onClick={() => updateDraft({ items: moveItem(currentDraft.items, idx, -1) })} className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-white"><ArrowUp size={13} /></button>
                            <button type="button" onClick={() => updateDraft({ items: moveItem(currentDraft.items, idx, 1) })} className="p-1.5 rounded bg-white/5 text-slate-400 hover:text-white"><ArrowDown size={13} /></button>
                            <button type="button" onClick={() => updateDraft({ items: currentDraft.items.filter((_, i) => i !== idx) })} className="p-1.5 rounded bg-red-500/10 text-red-400"><Trash2 size={13} /></button>
                          </div>
                        </div>
                        <textarea
                          rows={2}
                          className={inputCls}
                          placeholder="Answer"
                          value={faq.answer || ''}
                          onChange={(e) => {
                            const next = [...currentDraft.items];
                            next[idx] = { ...faq, answer: e.target.value };
                            updateDraft({ items: next });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 7. SPONSORS ── */}
              {activeSection === 'sponsors' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <h2 className="text-base font-bold text-white">Sponsors & Partners</h2>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft({
                          items: [
                            ...(currentDraft.items || []),
                            { id: `sp-${Date.now()}`, name: 'Sponsor Name', category: 'Title Sponsor', logo: '', website: 'https://', visible: true },
                          ],
                        })
                      }
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-medium"
                    >
                      <Plus size={13} /> Add Sponsor
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(currentDraft.items || []).map((sp, idx) => (
                      <div key={sp.id || idx} className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            className={inputCls}
                            placeholder="Sponsor Name"
                            value={sp.name || ''}
                            onChange={(e) => {
                              const next = [...currentDraft.items];
                              next[idx] = { ...sp, name: e.target.value };
                              updateDraft({ items: next });
                            }}
                          />
                          <input
                            className={inputCls}
                            placeholder="Category (e.g. Title Sponsor)"
                            value={sp.category || ''}
                            onChange={(e) => {
                              const next = [...currentDraft.items];
                              next[idx] = { ...sp, category: e.target.value };
                              updateDraft({ items: next });
                            }}
                          />
                          <div className="flex items-center gap-2">
                            <input
                              className={inputCls}
                              placeholder="Website URL"
                              value={sp.website || ''}
                              onChange={(e) => {
                                const next = [...currentDraft.items];
                                next[idx] = { ...sp, website: e.target.value };
                                updateDraft({ items: next });
                              }}
                            />
                            <button type="button" onClick={() => updateDraft({ items: currentDraft.items.filter((_, i) => i !== idx) })} className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0"><Trash2 size={14} /></button>
                          </div>
                        </div>
                        <CmsImageUploader
                          label="Sponsor Logo"
                          value={sp.logo || ''}
                          onChange={(url) => {
                            const next = [...currentDraft.items];
                            next[idx] = { ...sp, logo: url };
                            updateDraft({ items: next });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 8. TEAM ── */}
              {activeSection === 'team' && (
                <div className="space-y-6">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.06] pb-2">
                    Organizing Team Roster
                  </h2>
                  {[
                    { key: 'convenors', title: 'Convenors' },
                    { key: 'developers', title: 'Engineering & Development' },
                    { key: 'core', title: 'Core Committee' },
                  ].map((group) => (
                    <div key={group.key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">{group.title}</h3>
                        <button
                          type="button"
                          onClick={() =>
                            updateDraft({
                              [group.key]: [
                                ...(currentDraft[group.key] || []),
                                { id: `tm-${Date.now()}`, name: 'Member Name', role: 'Coordinator', badge: 'CORE', category: group.title.toUpperCase(), bio: '', email: '', linkedin: '', img: '', visible: true },
                              ],
                            })
                          }
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-500/15 text-cyan-300 text-xs"
                        >
                          <Plus size={12} /> Add Member
                        </button>
                      </div>
                      {(currentDraft[group.key] || []).map((m, idx) => (
                        <div key={m.id || idx} className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.08] space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              className={inputCls}
                              placeholder="Name"
                              value={m.name || ''}
                              onChange={(e) => {
                                const next = [...(currentDraft[group.key] || [])];
                                next[idx] = { ...m, name: e.target.value };
                                updateDraft({ [group.key]: next });
                              }}
                            />
                            <input
                              className={inputCls}
                              placeholder="Role"
                              value={m.role || ''}
                              onChange={(e) => {
                                const next = [...(currentDraft[group.key] || [])];
                                next[idx] = { ...m, role: e.target.value };
                                updateDraft({ [group.key]: next });
                              }}
                            />
                            <div className="flex items-center gap-2">
                              <input
                                className={inputCls}
                                placeholder="LinkedIn URL"
                                value={m.linkedin || ''}
                                onChange={(e) => {
                                  const next = [...(currentDraft[group.key] || [])];
                                  next[idx] = { ...m, linkedin: e.target.value };
                                  updateDraft({ [group.key]: next });
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => updateDraft({ [group.key]: currentDraft[group.key].filter((_, i) => i !== idx) })}
                                className="p-2 rounded-lg bg-red-500/10 text-red-400 shrink-0"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <CmsImageUploader
                            label="Member Photo"
                            value={m.img || ''}
                            onChange={(url) => {
                              const next = [...(currentDraft[group.key] || [])];
                              next[idx] = { ...m, img: url };
                              updateDraft({ [group.key]: next });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* ── 9. FOOTER & CONTACT ── */}
              {activeSection === 'footer' && (
                <div className="space-y-4">
                  <h2 className="text-base font-bold text-white border-b border-white/[0.06] pb-2">
                    Footer, Contact & Social Links
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Brand Title</label>
                      <input className={inputCls} value={currentDraft.brandTitle || ''} onChange={(e) => updateDraft({ brandTitle: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Edition Text</label>
                      <input className={inputCls} value={currentDraft.editionText || ''} onChange={(e) => updateDraft({ editionText: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Contact Email</label>
                      <input className={inputCls} value={currentDraft.email || ''} onChange={(e) => updateDraft({ email: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Contact Phone</label>
                      <input className={inputCls} value={currentDraft.phone || ''} onChange={(e) => updateDraft({ phone: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Campus Address</label>
                    <input className={inputCls} value={currentDraft.address || ''} onChange={(e) => updateDraft({ address: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={labelCls}>Instagram URL</label>
                      <input className={inputCls} value={currentDraft.instagram || ''} onChange={(e) => updateDraft({ instagram: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>LinkedIn URL</label>
                      <input className={inputCls} value={currentDraft.linkedin || ''} onChange={(e) => updateDraft({ linkedin: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>GitHub URL</label>
                      <input className={inputCls} value={currentDraft.github || ''} onChange={(e) => updateDraft({ github: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Copyright Text</label>
                    <input className={inputCls} value={currentDraft.copyright || ''} onChange={(e) => updateDraft({ copyright: e.target.value })} />
                  </div>
                </div>
              )}

              {/* ── 10. NOTICES & ANNOUNCEMENTS ── */}
              {activeSection === 'notices' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                    <h2 className="text-base font-bold text-white">Announcements & Important Notices</h2>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(currentDraft.enabled)}
                        onChange={(e) => updateDraft({ enabled: e.target.checked })}
                        className="rounded border-white/20 bg-slate-800 text-cyan-500"
                      />
                      <span>Show Live Banner on Website</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft({
                        items: [
                          ...(currentDraft.items || []),
                          { id: `n-${Date.now()}`, title: 'Important Update', type: 'info', link: '/events', visible: true },
                        ],
                      })
                    }
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-300 text-xs font-medium"
                  >
                    <Plus size={13} /> Add Notice
                  </button>
                  <div className="space-y-2.5">
                    {(currentDraft.items || []).map((n, idx) => (
                      <div key={n.id || idx} className="p-3 rounded-xl bg-slate-950/60 border border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                        <input
                          className={`${inputCls} sm:col-span-6`}
                          placeholder="Notice text"
                          value={n.title || ''}
                          onChange={(e) => {
                            const next = [...currentDraft.items];
                            next[idx] = { ...n, title: e.target.value };
                            updateDraft({ items: next });
                          }}
                        />
                        <input
                          className={`${inputCls} sm:col-span-4`}
                          placeholder="Link (e.g. /register)"
                          value={n.link || ''}
                          onChange={(e) => {
                            const next = [...currentDraft.items];
                            next[idx] = { ...n, link: e.target.value };
                            updateDraft({ items: next });
                          }}
                        />
                        <div className="sm:col-span-2 flex items-center justify-end gap-1">
                          <button type="button" onClick={() => updateDraft({ items: currentDraft.items.filter((_, i) => i !== idx) })} className="p-1.5 rounded bg-red-500/10 text-red-400"><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Add / Edit Modal */}
      {eventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEventModal(null)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/[0.1] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-lg font-bold text-white">
                {isNewEvent ? 'Create New Event' : `Edit Event: ${eventModal.name}`}
              </h3>
              <button onClick={() => setEventModal(null)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Event Name *</label>
                  <input required className={inputCls} value={eventModal.name || ''} onChange={(e) => setEventModal({ ...eventModal, name: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Short Code *</label>
                  <input required className={inputCls} value={eventModal.code || ''} onChange={(e) => setEventModal({ ...eventModal, code: e.target.value.toUpperCase() })} />
                </div>
                <div>
                  <label className={labelCls}>Prize Pool</label>
                  <input className={inputCls} value={eventModal.prizePool || ''} onChange={(e) => setEventModal({ ...eventModal, prizePool: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Category</label>
                  <input className={inputCls} value={eventModal.category || ''} onChange={(e) => setEventModal({ ...eventModal, category: e.target.value })} />
                </div>
                <div>
                  <label className={labelCls}>Venue</label>
                  <input className={inputCls} value={eventModal.venue || ''} onChange={(e) => setEventModal({ ...eventModal, venue: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Short Description *</label>
                <textarea required rows={2} className={inputCls} value={eventModal.description || ''} onChange={(e) => setEventModal({ ...eventModal, description: e.target.value })} />
              </div>
              <CmsImageUploader
                label="Event Cover Image"
                value={eventModal.image || ''}
                onChange={(url) => setEventModal({ ...eventModal, image: url })}
              />
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.08]">
                <button type="button" onClick={() => setEventModal(null)} className="px-4 py-2 rounded-lg border border-white/10 text-xs text-slate-300">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400">
                  {saving ? 'Saving...' : isNewEvent ? 'Create Event' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}
