/**
 * SRIJAN 2026 - REGISTRATION STORAGE & API SERVICE
 * 
 * Architecture:
 * - Direct integration with Express + MongoDB endpoint (/api/registrations).
 * - Generates unique Registration ID: SRJ-<EVENT_CODE>-<4-digit sequence>.
 * - Blocks duplicate registrations (same leader email + same event code).
 * - Can be swapped with Supabase client seamlessly using the SQL schema below.
 * 
 * ==============================================================================
 * SUPABASE (POSTGRESQL) SCHEMA SPECIFICATION:
 * ==============================================================================
 * CREATE TABLE IF NOT EXISTS public.registrations (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   registration_id TEXT UNIQUE NOT NULL,
 *   event_code TEXT NOT NULL,
 *   team_name TEXT,
 *   team_size INTEGER NOT NULL DEFAULT 1,
 *   leader JSONB NOT NULL,
 *   members JSONB DEFAULT '[]'::jsonb,
 *   status TEXT DEFAULT 'pending',
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 * 
 * -- Duplicate check index (event_code + leader email):
 * CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_event_leader 
 * ON public.registrations (event_code, (leader->>'email'));
 * ==============================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:9000/api';
const LOCAL_STORAGE_KEY = 'srijan_2026_registrations_v1';

/**
 * Generate standard Registration ID: SRJ-<EVENT_CODE>-<4-digit sequence>
 * e.g. SRJ-HACK-1042
 */
export function generateRegistrationId(eventCode = 'GEN') {
  const cleanCode = eventCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `SRJ-${cleanCode}-${seq}`;
}

/**
 * Get all cached local registrations for offline fallback & duplicate checking
 */
export function getLocalRegistrations() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not read local registrations:', err);
    return [];
  }
}

/**
 * Check if the leader email is already registered for this event
 */
export async function checkDuplicateRegistration(eventCode, leaderEmail) {
  const normEmail = leaderEmail.trim().toLowerCase();
  const normCode = eventCode.toUpperCase();

  // 1. Check local cache
  const localList = getLocalRegistrations();
  const existsLocally = localList.some(
    (r) =>
      r.eventCode?.toUpperCase() === normCode &&
      r.leader?.email?.toLowerCase() === normEmail
  );

  if (existsLocally) {
    return {
      isDuplicate: true,
      message: `Operator with email "${leaderEmail}" is already registered for event ${normCode}.`,
    };
  }

  // 2. Check remote MongoDB/Express API if reachable
  try {
    const response = await fetch(
      `${API_BASE_URL}/registrations/check?eventId=${normCode}&email=${encodeURIComponent(normEmail)}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (response.ok) {
      const data = await response.json();
      if (data.isDuplicate) {
        return {
          isDuplicate: true,
          message: data.message || `Operator with email "${leaderEmail}" is already registered for event ${normCode}.`,
        };
      }
    }
  } catch {
    // Server check silently falls through to allow offline/local resilience
  }

  return { isDuplicate: false };
}

/**
 * Submit Registration Payload to Storage Layer (MongoDB / Supabase / Local Fallback)
 * 
 * @param {Object} rawData - validated form submission
 * @param {Object} eventConfig - event data object from events.js
 */
export async function submitRegistration(rawData, eventConfig) {
  const eventCode = (eventConfig.code || 'GEN').toUpperCase();
  const registrationId = generateRegistrationId(eventCode);
  const isTeam = (eventConfig.maxTeamSize || 1) > 1;

  // 1. Pre-flight duplicate check
  const duplicateCheck = await checkDuplicateRegistration(eventCode, rawData.leader.email);
  if (duplicateCheck.isDuplicate) {
    throw new Error(duplicateCheck.message);
  }

  // 2. Format standard document payload (compatible with MongoDB and Supabase)
  const registrationPayload = {
    registrationId,
    eventId: eventConfig.id,
    eventCode,
    eventName: eventConfig.name,
    registrationType: isTeam ? 'team' : 'individual',
    teamName: isTeam ? rawData.teamName : null,
    teamSize: isTeam ? rawData.teamSize : 1,
    leader: {
      name: rawData.leader.name.trim(),
      email: rawData.leader.email.trim().toLowerCase(),
      phone: rawData.leader.phone.trim(),
      department: rawData.leader.department.trim(),
      year: rawData.leader.year,
    },
    members: isTeam && Array.isArray(rawData.members)
      ? rawData.members.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
          phone: m.phone.trim(),
          department: m.department.trim(),
          year: m.year,
        }))
      : [],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  // 3. Attempt transmission to Express / MongoDB backend
  let serverSuccess = false;
  let serverData = null;

  try {
    const mongoPayload = {
      eventId: eventConfig.id,
      registrationType: isTeam ? 'team' : 'individual',
      teamName: registrationPayload.teamName,
      teamLeader: {
        name: registrationPayload.leader.name,
        email: registrationPayload.leader.email,
        phone: registrationPayload.leader.phone,
        branch: registrationPayload.leader.department,
        year: registrationPayload.leader.year,
        college: 'Government College of Engineering, Amravati',
      },
      participant: !isTeam
        ? {
            name: registrationPayload.leader.name,
            email: registrationPayload.leader.email,
            phone: registrationPayload.leader.phone,
            branch: registrationPayload.leader.department,
            year: registrationPayload.leader.year,
            college: 'Government College of Engineering, Amravati',
          }
        : undefined,
      members: registrationPayload.members.map((m) => ({
        name: m.name,
        email: m.email,
        phone: m.phone,
        branch: m.department,
        year: m.year,
        college: 'Government College of Engineering, Amravati',
      })),
      termsAccepted: true,
    };

    const res = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mongoPayload),
    });

    const json = await res.json();
    if (res.ok && json.success) {
      serverSuccess = true;
      serverData = json.data;
      if (serverData?.registrationId) {
        registrationPayload.registrationId = serverData.registrationId;
      }
      registrationPayload.status = 'confirmed';
    } else {
      console.warn('Backend responded with error, caching locally:', json.message);
    }
  } catch (netErr) {
    console.warn('Network error reaching backend server. Storing locally:', netErr.message);
  }

  // 4. Save to client-side localStorage ledger
  try {
    const currentList = getLocalRegistrations();
    currentList.unshift(registrationPayload);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentList.slice(0, 50)));
  } catch (storageErr) {
    console.warn('Local storage write warning:', storageErr);
  }

  return {
    success: true,
    data: registrationPayload,
    serverConnected: serverSuccess,
  };
}
