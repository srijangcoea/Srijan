/**
 * Srijan Backend API Client
 */

const rawApiUrl = import.meta.env.VITE_API_URL;

const formatApiBase = (url) => {
  if (!url || !url.trim()) return '/api';
  const clean = url.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

const API_BASE = formatApiBase(rawApiUrl);

async function safeJsonParse(res) {
  const contentType = res.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return await res.json();
  }

  await res.text().catch(() => '');

  if (res.status === 502 || res.status === 503 || res.status === 504) {
    throw new Error('Backend server is temporarily unavailable. Please try again in a few moments.');
  }

  if (res.status === 404) {
    throw new Error('API endpoint not found.');
  }

  throw new Error(`Unexpected server response (HTTP ${res.status}).`);
}

/**
 * Submit individual or team registration
 */
export async function submitRegistration(payload) {
  let res;
  try {
    res = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`Unable to connect to server at ${API_BASE}. Please ensure backend is running.`);
  }

  const data = await safeJsonParse(res);

  if (!res.ok) {
    throw new Error(data.message || `Registration failed with status ${res.status}`);
  }

  return data;
}

/**
 * Get registration details by Registration ID
 */
export async function getRegistrationDetails(registrationId) {
  let res;
  try {
    res = await fetch(`${API_BASE}/registrations/${registrationId}`);
  } catch (error) {
    throw new Error('Unable to connect to server.');
  }

  const data = await safeJsonParse(res);

  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch registration');
  }

  return data;
}

/**
 * Admin: Fetch registrations with optional filters
 * @param {Object} filters { eventId, search, type }
 */
export async function fetchAdminRegistrations(filters = {}) {
  const params = new URLSearchParams();
  if (filters.eventId && filters.eventId !== 'all') params.append('eventId', filters.eventId);
  if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);

  const query = params.toString() ? `?${params.toString()}` : '';

  let res;
  try {
    res = await fetch(`${API_BASE}/registrations${query}`);
  } catch (error) {
    throw new Error('Failed to connect to backend server.');
  }

  const data = await safeJsonParse(res);
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch registrations.');
  }

  return data;
}

/**
 * Admin: Fetch aggregated registration statistics per competition
 */
export async function fetchRegistrationStats() {
  let res;
  try {
    res = await fetch(`${API_BASE}/registrations/stats`);
  } catch (error) {
    throw new Error('Failed to connect to backend server.');
  }

  const data = await safeJsonParse(res);
  if (!res.ok) {
    throw new Error(data.message || 'Failed to fetch stats.');
  }

  return data;
}

/**
 * Admin: Delete a registration
 */
export async function deleteRegistrationById(registrationId) {
  let res;
  try {
    res = await fetch(`${API_BASE}/registrations/${registrationId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    throw new Error('Failed to delete registration.');
  }

  const data = await safeJsonParse(res);
  if (!res.ok) {
    throw new Error(data.message || 'Delete operation failed.');
  }

  return data;
}

/**
 * Check backend health
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return { status: 'offline', databaseConnected: false };
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { status: 'offline', databaseConnected: false };
    }
    return await res.json();
  } catch (e) {
    return { status: 'offline', databaseConnected: false };
  }
}
