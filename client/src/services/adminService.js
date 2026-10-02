/**
 * SRIJAN 2026 ADMIN — SERVICE LAYER
 * All API calls centralized here so the backend can be swapped later.
 * ============================================================================
 */

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

// ─── Auth ──────────────────────────────────────────────
export const adminLogin = async (email, password) => {
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
export const getDashboardStats = async () => {
  const res = await fetch(`${API_BASE}/admin/dashboard`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ─── Registrations ─────────────────────────────────────
export const getAllRegistrations = async (filters = {}) => {
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
  return handleResponse(res);
};

export const bulkUpdateStatus = async (ids, status, rejectionReason) => {
  const res = await fetch(`${API_BASE}/admin/registrations/bulk-status`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids, status, rejectionReason }),
  });
  return handleResponse(res);
};

export const bulkDeleteRegistrations = async (ids) => {
  const res = await fetch(`${API_BASE}/admin/registrations/bulk-delete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ids }),
  });
  return handleResponse(res);
};

export const deleteRegistration = async (id) => {
  const res = await fetch(`${API_BASE}/registrations/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ─── Attendance ────────────────────────────────────────
export const markAttendance = async (registrationId, present = true) => {
  const res = await fetch(`${API_BASE}/admin/attendance/mark`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ registrationId, present }),
  });
  return handleResponse(res);
};

export const getAttendance = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.eventId) params.set('eventId', filters.eventId);
  if (filters.search) params.set('search', filters.search);

  const res = await fetch(`${API_BASE}/admin/attendance?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

export const getAttendanceStats = async () => {
  const res = await fetch(`${API_BASE}/admin/attendance/stats`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ─── Activity Log ──────────────────────────────────────
export const getActivityLog = async (page = 1, limit = 50) => {
  const res = await fetch(`${API_BASE}/admin/activity-log?page=${page}&limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};

// ─── Event Management ──────────────────────────────────
export const getAdminEvents = async () => {
  try {
    const res = await fetch(`${API_BASE}/events`, {
      headers: getAuthHeaders(),
    });
    return await handleResponse(res);
  } catch (err) {
    console.warn('API getEvents failed, fallback to local config', err);
    const { events } = await import('../data/events.js');
    return { success: true, data: events };
  }
};

export const updateAdminEvent = async (id, data) => {
  const res = await fetch(`${API_BASE}/events/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};
