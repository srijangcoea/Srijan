# SRIJAN 2026 - COMMON REGISTRATION PORTAL SETUP

Production-ready, cyber-themed Common Registration Portal for Srijan 2026.

---

## 📁 File Structure

```text
client/src/
├── components/
│   ├── RegistrationForm.jsx     # Main portal UI (Telemetry monitor, event matrix, dossier inputs)
│   └── MemberFields.jsx         # Complementary operator dossier cards (animated via Framer Motion)
├── hooks/
│   └── useRegistration.js       # Core state hook (team sizing, buffer preservation, submission lifecycle)
├── services/
│   └── registrationService.js   # Storage layer (MongoDB / Supabase / Local storage duplicate check)
├── utils/
│   └── registrationSchema.js    # Dynamic Zod validation schema (unique email & 10-digit phone checks)
└── pages/
    └── Registration.jsx         # Registration page route (/register and /register/:eventId)
```

---

## 🛠️ Environment Variables (.env)

Add the following to your `client/.env`:

```env
# Express + MongoDB API Endpoint (Default)
VITE_API_URL=http://localhost:5000/api

# (Optional) Supabase Configuration if swapping storage layer
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 🗄️ Database Schemas

### 1. MongoDB (Express Backend)
The backend model is configured in `server/models/Registration.js` with indexes:
- `registrationId` (unique string, e.g. `SRJ-HACK-1042`)
- `eventId` + `teamLeader.email` (indexed for instant duplicate prevention)
- `participant` (solo events) / `teamLeader` + `members` array (team events)

### 2. Supabase (PostgreSQL) SQL Schema
If using Supabase, run this script in your Supabase SQL Editor:

```sql
-- 1. Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id TEXT UNIQUE NOT NULL,
  event_code TEXT NOT NULL,
  team_name TEXT,
  team_size INTEGER NOT NULL DEFAULT 1,
  leader JSONB NOT NULL,
  members JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create unique index for duplicate checking (Leader Email + Event Code)
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_event_leader 
ON public.registrations (event_code, (leader->>'email'));

-- 3. Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous insert:
CREATE POLICY "Allow public insert" 
ON public.registrations FOR INSERT 
WITH CHECK (true);

-- Allow admins to read registrations:
CREATE POLICY "Allow authenticated read" 
ON public.registrations FOR SELECT 
TO authenticated 
USING (true);
```

---

## ⚙️ How to Customize

1. **Change Team Sizes**:
   - Edit `minTeamSize` and `maxTeamSize` in `client/src/data/events.js`.
   - To make **Bridge Making (BRG)** a team event (e.g. 1 to 4 members), simply change:
     ```javascript
     registrationType: "team",
     minTeamSize: 1,
     maxTeamSize: 4,
     ```
   - The form will automatically render team callsign and slots dynamically!

2. **Pre-selecting Events via URL**:
   - Navigate to `/register?event=HACK` or `/register?event=PCB`.
   - The portal will automatically focus the event and configure team/solo inputs.
