import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getPublicCms, resolveAssetUrl } from '../services/adminService';
import { events as fallbackEvents } from '../data/events';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000';
const API_BASE = (() => {
  const clean = (rawApiUrl || '').trim().replace(/\/+$/, '');
  if (!clean) return '/api';
  return clean.endsWith('/api') ? clean : `${clean}/api`;
})();

const CmsContext = createContext({
  cms: {},
  events: fallbackEvents,
  loading: false,
  isPreview: false,
  refreshCms: () => {},
  resolveAssetUrl,
});

export function CmsProvider({ children }) {
  const [cms, setCms] = useState({});
  const [events, setEvents] = useState(fallbackEvents);
  const [loading, setLoading] = useState(true);
  const [isPreview, setIsPreview] = useState(false);

  const fetchAll = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const previewMode = params.get('preview') === '1';
    setIsPreview(previewMode);

    try {
      const [cmsRes, eventsRes] = await Promise.allSettled([
        getPublicCms(previewMode),
        fetch(`${API_BASE}/events${previewMode ? '?includeDrafts=true' : ''}`).then((r) => r.json()),
      ]);

      if (cmsRes.status === 'fulfilled' && cmsRes.value?.success && cmsRes.value?.data) {
        setCms(cmsRes.value.data);
      }

      if (eventsRes.status === 'fulfilled' && eventsRes.value?.success && Array.isArray(eventsRes.value?.data) && eventsRes.value.data.length > 0) {
        // Normalize backend Event documents so public UI components work seamlessly
        const normalized = eventsRes.value.data.map((ev) => ({
          ...ev,
          id: ev.slug || ev.id || ev._id,
          teamSize:
            ev.registrationType === 'team'
              ? `${ev.minTeamSize || 2}–${ev.maxTeamSize || 4} Members`
              : 'Solo Event',
        }));
        setEvents(normalized);
      }
    } catch (err) {
      console.warn('CMS sync using fallback defaults:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <CmsContext.Provider
      value={{
        cms,
        events,
        loading,
        isPreview,
        refreshCms: fetchAll,
        resolveAssetUrl,
      }}
    >
      {isPreview && (
        <div className="fixed bottom-4 right-4 z-[9999] px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-bold shadow-2xl border border-amber-300 flex items-center gap-2">
          <span>CMS PREVIEW MODE (DRAFT)</span>
          <a
            href={window.location.pathname}
            className="underline ml-1 text-slate-900"
          >
            Exit
          </a>
        </div>
      )}
      {children}
    </CmsContext.Provider>
  );
}

export const useCms = () => useContext(CmsContext);
export default CmsContext;
