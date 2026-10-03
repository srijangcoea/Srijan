/**
 * SRIJAN 2026 - REGISTRATION STORAGE & API SERVICE
 * 
 * Architecture:
 * - Direct integration with Express + MongoDB endpoint (/api/registrations).
 * - Saves complete participant/team dossiers to MongoDB Atlas.
 * - Enforces pre-flight server duplicate check & atomic registration ID generation.
 * - Stores local receipt for confirmation views and syncs pending offline submissions.
 */

const envApi = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL;
const rawApiUrl = envApi || (typeof process !== 'undefined' && process.env?.VITE_API_URL) || 'https://srijan-p9wu.onrender.com';

export const formatApiBase = (url) => {
  if (!url || !url.trim()) return '/api';
  const clean = url.trim().replace(/\/+$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

export const API_BASE_URL = formatApiBase(rawApiUrl);
const LOCAL_STORAGE_KEY = 'srijan_2026_registrations_v1';

/**
 * Generate standard fallback Registration ID: SRJ-<EVENT_CODE>-<4-digit sequence>
 */
export function generateRegistrationId(eventCode = 'GEN') {
  const cleanCode = eventCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `SRJ-${cleanCode}-${seq}`;
}

/**
 * Get all cached local registrations
 */
export function getLocalRegistrations() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read local registrations:', err);
    return [];
  }
}

/**
 * Clean phone number to 10 digits
 */
export function cleanPhoneNumber(phone) {
  let clean = phone ? String(phone).trim().replace(/\D/g, '') : '';
  if (clean.length === 12 && clean.startsWith('91')) {
    clean = clean.slice(2);
  } else if (clean.length === 11 && clean.startsWith('0')) {
    clean = clean.slice(1);
  }
  return clean;
}

/**
 * Check if the leader email is already registered for this event
 */
export async function checkDuplicateRegistration(eventCode, leaderEmail) {
  const normEmail = (leaderEmail || '').trim().toLowerCase();
  const normCode = (eventCode || 'GEN').toUpperCase();

  // Check remote MongoDB/Express API
  try {
    const response = await fetch(
      `${API_BASE_URL}/registrations/check?eventId=${encodeURIComponent(normCode)}&email=${encodeURIComponent(normEmail)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (response.ok) {
      const data = await response.json();
      if (data.isDuplicate) {
        return {
          isDuplicate: true,
          message: data.message || `Email "${leaderEmail}" is already registered for event ${normCode}.`,
        };
      }
    }
  } catch (err) {
    console.warn('Remote duplicate check warning:', err.message);
  }

  // Check local cache if confirmed
  const localList = getLocalRegistrations();
  const existsLocally = localList.some(
    (r) =>
      r.status === 'confirmed' &&
      (r.eventCode?.toUpperCase() === normCode || r.eventId?.toUpperCase() === normCode) &&
      (r.leader?.email?.toLowerCase() === normEmail || r.participant?.email?.toLowerCase() === normEmail || r.teamLeader?.email?.toLowerCase() === normEmail)
  );

  if (existsLocally) {
    return {
      isDuplicate: true,
      message: `Email "${leaderEmail}" is already registered for event ${normCode}.`,
    };
  }

  return { isDuplicate: false };
}

/**
 * Submit Registration Payload to MongoDB Atlas Database
 * 
 * @param {Object} rawData - validated form submission
 * @param {Object} eventConfig - event data object from events.js
 */
export async function submitRegistration(rawData, eventConfig) {
  const eventCode = (eventConfig.code || 'GEN').toUpperCase();
  const isTeam = (eventConfig.maxTeamSize || 1) > 1;

  // 1. Pre-flight duplicate check against remote DB
  const duplicateCheck = await checkDuplicateRegistration(eventCode, rawData.leader.email);
  if (duplicateCheck.isDuplicate) {
    throw new Error(duplicateCheck.message);
  }

  const cleanLeaderPhone = cleanPhoneNumber(rawData.leader.phone);
  const leaderDept = (rawData.leader.department || rawData.leader.branch || '').trim();
  const defaultCollege = (rawData.leader.college || 'Government College of Engineering, Amravati').trim();

  // 2. Prepare payload matching Express / MongoDB controller
  const mongoPayload = {
    eventId: eventConfig.id,
    eventCode,
    eventName: eventConfig.name,
    registrationType: isTeam ? 'team' : 'individual',
    teamName: isTeam ? rawData.teamName?.trim() : undefined,
    teamLeader: isTeam
      ? {
          name: rawData.leader.name.trim(),
          email: rawData.leader.email.trim().toLowerCase(),
          phone: cleanLeaderPhone,
          college: defaultCollege,
          branch: leaderDept,
          department: leaderDept,
          year: rawData.leader.year,
        }
      : undefined,
    participant: !isTeam
      ? {
          name: rawData.leader.name.trim(),
          email: rawData.leader.email.trim().toLowerCase(),
          phone: cleanLeaderPhone,
          college: defaultCollege,
          branch: leaderDept,
          department: leaderDept,
          year: rawData.leader.year,
        }
      : undefined,
    members: isTeam && Array.isArray(rawData.members)
      ? rawData.members.map((m) => {
          const mDept = (m.department || m.branch || leaderDept).trim();
          return {
            name: m.name.trim(),
            email: m.email.trim().toLowerCase(),
            phone: cleanPhoneNumber(m.phone),
            college: (m.college || defaultCollege).trim(),
            branch: mDept,
            department: mDept,
            year: m.year,
          };
        })
      : [],
    termsAccepted: true,
  };

  // 3. Transmit to Express / MongoDB backend
  let res;
  try {
    res = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mongoPayload),
    });
  } catch (netErr) {
    console.error('Failed to contact backend:', netErr);
    throw new Error(
      `Unable to reach registration server (${API_BASE_URL}). Please verify your internet connection and try again.`
    );
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.success) {
    const errorMsg = json.message || `Server rejected registration (HTTP ${res.status})`;
    throw new Error(errorMsg);
  }

  // Registration successfully stored in MongoDB Atlas!
  const savedData = json.data || {};

  const enrichedData = {
    ...savedData,
    registrationId: savedData.registrationId || generateRegistrationId(eventCode),
    eventId: savedData.eventId || eventConfig.id,
    eventCode: savedData.eventCode || eventCode,
    eventName: savedData.eventName || eventConfig.name,
    registrationType: isTeam ? 'team' : 'individual',
    teamName: isTeam ? (savedData.teamName || rawData.teamName?.trim()) : undefined,
    teamSize: isTeam ? (savedData.members?.length ? savedData.members.length + 1 : rawData.teamSize || 2) : 1,
    leader: {
      name: rawData.leader.name.trim(),
      email: rawData.leader.email.trim().toLowerCase(),
      phone: cleanLeaderPhone,
      department: leaderDept,
      branch: leaderDept,
      year: rawData.leader.year,
      college: defaultCollege,
    },
    members: isTeam && Array.isArray(rawData.members)
      ? rawData.members.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
          phone: cleanPhoneNumber(m.phone),
          department: (m.department || m.branch || leaderDept).trim(),
          branch: (m.department || m.branch || leaderDept).trim(),
          year: m.year,
          college: (m.college || defaultCollege).trim(),
        }))
      : (savedData.members || []),
    status: savedData.status || 'confirmed',
  };

  // 4. Save confirmed registration to client-side localStorage ledger
  try {
    const currentList = getLocalRegistrations();
    const filtered = currentList.filter(
      (r) => r.registrationId !== enrichedData.registrationId && r._id !== enrichedData._id
    );
    filtered.unshift(enrichedData);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered.slice(0, 50)));
    }
  } catch (storageErr) {
    console.warn('Local storage write warning:', storageErr);
  }

  return {
    success: true,
    data: enrichedData,
    serverConnected: true,
  };
}

/**
 * Auto-sync any pending/unsynced registrations from localStorage to MongoDB Atlas
 */
export async function syncLocalPendingRegistrations() {
  const localList = getLocalRegistrations();
  const unsynced = localList.filter((r) => r.status === 'pending' && !r._id);
  if (unsynced.length === 0) return 0;

  let syncedCount = 0;
  for (const reg of unsynced) {
    try {
      const isTeam = reg.registrationType === 'team' || (reg.members && reg.members.length > 0);
      const lead = reg.leader || reg.participant || reg.teamLeader;
      if (!lead?.email || !reg.eventId) continue;

      const payload = {
        eventId: reg.eventId,
        registrationType: isTeam ? 'team' : 'individual',
        teamName: isTeam ? reg.teamName : undefined,
        teamLeader: isTeam
          ? {
              name: lead.name,
              email: lead.email,
              phone: cleanPhoneNumber(lead.phone || lead.mobile),
              college: lead.college || 'Government College of Engineering, Amravati',
              branch: lead.department || lead.branch || 'Engineering',
              year: lead.year || 'FY',
            }
          : undefined,
        participant: !isTeam
          ? {
              name: lead.name,
              email: lead.email,
              phone: cleanPhoneNumber(lead.phone || lead.mobile),
              college: lead.college || 'Government College of Engineering, Amravati',
              branch: lead.department || lead.branch || 'Engineering',
              year: lead.year || 'FY',
            }
          : undefined,
        members: isTeam && Array.isArray(reg.members)
          ? reg.members.map((m) => ({
              name: m.name,
              email: m.email,
              phone: cleanPhoneNumber(m.phone || m.mobile),
              college: m.college || 'Government College of Engineering, Amravati',
              branch: m.department || m.branch || 'Engineering',
              year: m.year || 'FY',
            }))
          : [],
        termsAccepted: true,
      };

      const res = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        reg.status = 'confirmed';
        reg._id = data.data._id;
        reg.registrationId = data.data.registrationId;
        syncedCount++;
      }
    } catch (e) {
      console.warn('Sync attempt error for registration:', reg.registrationId, e);
    }
  }

  if (syncedCount > 0 && typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));
  }
  return syncedCount;
}
