/**
 * SRIJAN 2026 ADMIN — SERVICE LAYER
 * Centralized API calls with in-memory + sessionStorage SWR caching,
 * request deduplication, and instant cache invalidation on mutations.
 * ============================================================================
 */

import { events as defaultEvents } from '../data/events.js';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000';
const API_BASE = (() => {
  const clean = (rawApiUrl || '').trim().replace(/\/+$/, '');
  if (!clean) return '/api';
  return clean.endsWith('/api') ? clean : `${clean}/api`;
})();

const getAuthHeaders = () => {
  const token = localStorage.getItem('srijan_admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
};

// ─── Lightweight SWR Cache & In-flight Deduplication ────────────────────────
const MEMORY_CACHE = new Map();
const IN_FLIGHT = new Map();
const CACHE_PREFIX = 'srijan_adm_v1_';
const DEFAULT_TTL_MS = 20_000; // Fresh window: 20s

function readSession(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeSession(key, entry) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // Ignore quota errors
  }
}

export function getCachedData(key) {
  const mem = MEMORY_CACHE.get(key);
  if (mem) return mem.data;
  const sess = readSession(key);
  if (sess) {
    MEMORY_CACHE.set(key, sess);
    return sess.data;
  }
  return null;
}

function setCachedData(key, data) {
  const entry = { data, ts: Date.now() };
  MEMORY_CACHE.set(key, entry);
  writeSession(key, entry);
}

export function invalidateAdminCache(...keys) {
  if (keys.length === 0) {
    MEMORY_CACHE.clear();
    try {
      Object.keys(sessionStorage).forEach((k) => {
        if (k.startsWith(CACHE_PREFIX)) sessionStorage.removeItem(k);
      });
    } catch {
      // Ignore
    }
    return;
  }
  keys.forEach((key) => {
    MEMORY_CACHE.delete(key);
    try {
      sessionStorage.removeItem(CACHE_PREFIX + key);
    } catch {
      // Ignore
    }
  });
}

async function cachedFetch(key, fetcher, { force = false, ttl = DEFAULT_TTL_MS } = {}) {
  const existing = MEMORY_CACHE.get(key) || readSession(key);
  if (!force && existing && Date.now() - existing.ts < ttl) {
    MEMORY_CACHE.set(key, existing);
    return existing.data;
  }

  if (!force && IN_FLIGHT.has(key)) {
    return IN_FLIGHT.get(key);
  }

  const promise = fetcher()
    .then((res) => {
      setCachedData(key, res);
      return res;
    })
    .finally(() => {
      IN_FLIGHT.delete(key);
    });

  IN_FLIGHT.set(key, promise);
  return promise;
}

// ─── Auth ──────────────────────────────────────────────
export const adminLogin = async (email, password) => {
  invalidateAdminCache();
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
};

export const getAdminProfile = async () => {
  const res = await fetch(`${API_BASE}/admin/me`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const seedAdmin = async () => {
  const res = await fetch(`${API_BASE}/admin/seed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(res);
};

// ─── Dashboard ─────────────────────────────────────────
export const getDashboardStats = (opts = {}) =>
  cachedFetch(
    'dashboard',
    async () => {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    opts
  );

// ─── Registrations ─────────────────────────────────────
export const getAllRegistrations = async (filters = {}, opts = {}) => {
  const hasFilters = Boolean(filters.eventId || filters.search || filters.type);
  if (!hasFilters) {
    return cachedFetch(
      'registrations',
      async () => {
        const res = await fetch(`${API_BASE}/registrations`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(res);
      },
      opts
    );
  }

  const params = new URLSearchParams();
  if (filters.eventId) params.set('eventId', filters.eventId);
  if (filters.search) params.set('search', filters.search);
  if (filters.type) params.set('type', filters.type);

  const res = await fetch(`${API_BASE}/registrations?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const getRegistrationById = async (id) => {
  const res = await fetch(`${API_BASE}/registrations/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const updateRegistrationStatus = async (id, status, rejectionReason) => {
  const res = await fetch(`${API_BASE}/admin/registrations/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, rejectionReason }),
  });
  const data = await handleResponse(res);
  invalidateAdminCache('registrations', 'dashboard');
  return data;
};

export const bulkUpdateStatus = async (ids, status, rejectionReason) => {
  const res = await fetch(`${API_BASE}/admin/registrations/bulk-status`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids, status, rejectionReason }),
  });
  const data = await handleResponse(res);
  invalidateAdminCache('registrations', 'dashboard');
  return data;
};

export const bulkDeleteRegistrations = async (ids) => {
  const res = await fetch(`${API_BASE}/admin/registrations/bulk-delete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids }),
  });
  const data = await handleResponse(res);
  // Optimistically prune deleted IDs from cached registrations
  const cachedRegs = getCachedData('registrations');
  if (cachedRegs?.data && Array.isArray(cachedRegs.data)) {
    const idSet = new Set(ids);
    setCachedData('registrations', {
      ...cachedRegs,
      data: cachedRegs.data.filter((r) => !idSet.has(r._id) && !idSet.has(r.registrationId)),
    });
  }
  invalidateAdminCache('dashboard', 'attendance');
  return data;
};

export const deleteRegistration = async (id) => {
  const res = await fetch(`${API_BASE}/registrations/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await handleResponse(res);
  const cachedRegs = getCachedData('registrations');
  if (cachedRegs?.data && Array.isArray(cachedRegs.data)) {
    setCachedData('registrations', {
      ...cachedRegs,
      data: cachedRegs.data.filter((r) => r._id !== id && r.registrationId !== id),
    });
  }
  invalidateAdminCache('dashboard', 'attendance');
  return data;
};

// ─── Attendance ────────────────────────────────────────
export const markAttendance = async (registrationId, present = true) => {
  const res = await fetch(`${API_BASE}/admin/attendance/mark`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ registrationId, present }),
  });
  const data = await handleResponse(res);
  // Patch cached attendance immediately so navigating away & back is instant
  const cachedAtt = getCachedData('attendance');
  if (cachedAtt?.data && Array.isArray(cachedAtt.data)) {
    const idx = cachedAtt.data.findIndex(
      (a) => a.registrationId === registrationId || a.registration_id === registrationId
    );
    const updatedList = [...cachedAtt.data];
    const nowIso = new Date().toISOString();
    if (idx >= 0) {
      updatedList[idx] = { ...updatedList[idx], present, markedAt: nowIso };
    } else {
      updatedList.push({ registrationId, present, markedAt: nowIso });
    }
    setCachedData('attendance', { ...cachedAtt, data: updatedList });
  }
  invalidateAdminCache('attendanceStats', 'dashboard');
  return data;
};

export const getAttendance = async (filters = {}, opts = {}) => {
  const hasFilters = Boolean(filters.eventId || filters.search);
  if (!hasFilters) {
    return cachedFetch(
      'attendance',
      async () => {
        const res = await fetch(`${API_BASE}/admin/attendance`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(res);
      },
      opts
    );
  }

  const params = new URLSearchParams();
  if (filters.eventId) params.set('eventId', filters.eventId);
  if (filters.search) params.set('search', filters.search);

  const res = await fetch(`${API_BASE}/admin/attendance?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const getAttendanceStats = (opts = {}) =>
  cachedFetch(
    'attendanceStats',
    async () => {
      const res = await fetch(`${API_BASE}/admin/attendance/stats`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(res);
    },
    opts
  );

// ─── Activity Log ──────────────────────────────────────
export const getActivityLog = async (page = 1, limit = 50, opts = {}) => {
  if (page === 1 && limit === 25) {
    return cachedFetch(
      'activityLog_p1',
      async () => {
        const res = await fetch(`${API_BASE}/admin/activity-log?page=1&limit=25`, {
          headers: getAuthHeaders(),
        });
        return handleResponse(res);
      },
      opts
    );
  }
  const res = await fetch(`${API_BASE}/admin/activity-log?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ─── Event Management ──────────────────────────────────
export const getAdminEvents = async (opts = {}) =>
  cachedFetch(
    'events',
    async () => {
      try {
        const res = await fetch(`${API_BASE}/events`, {
          headers: getAuthHeaders(),
        });
        return await handleResponse(res);
      } catch {
        return { success: true, data: defaultEvents };
      }
    },
    opts
  );

export const updateAdminEvent = async (id, data) => {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const result = await handleResponse(res);
  const cachedEvents = getCachedData('events');
  if (cachedEvents?.data && Array.isArray(cachedEvents.data)) {
    setCachedData('events', {
      ...cachedEvents,
      data: cachedEvents.data.map((ev) =>
        ev._id === id || ev.id === id || ev.code === id ? { ...ev, ...data } : ev
      ),
    });
  }
  return result;
};

// ─── Pre-warm all core admin datasets in parallel ───────────────────────────
export const prefetchAdminData = () => {
  Promise.allSettled([
    getDashboardStats(),
    getAllRegistrations(),
    getAdminEvents(),
    getAttendance(),
  ]);
};
