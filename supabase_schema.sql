-- ============================================================================
-- SRIJAN 2026 — SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Includes Tables, Constraints, Indexes, and Strict Row-Level Security (RLS)
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. TABLE DEFINITIONS
-- ============================================================================

-- A. ADMINS TABLE (Role-Based Access Control)
-- Links directly to Supabase Auth users (auth.users)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'coordinator')),
    assigned_event_code TEXT CHECK (assigned_event_code IN ('HACK', 'KBC', 'PCB', 'CAD', 'BRG', 'CIRCUIT') OR assigned_event_code IS NULL),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- B. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id VARCHAR(50) UNIQUE NOT NULL,
    event_code VARCHAR(20) NOT NULL CHECK (event_code IN ('HACK', 'KBC', 'PCB', 'CAD', 'BRG', 'CIRCUIT')),
    team_name VARCHAR(120),
    team_size INT DEFAULT 1 CHECK (team_size >= 1),
    leader JSONB NOT NULL,
    -- Structure of leader JSONB:
    -- {
    --   "name": "Jane Doe",
    --   "email": "jane@example.com",
    --   "mobile": "9876543210",
    --   "department": "CSE",
    --   "year": "3rd",
    --   "college_id": "GCOEA2023001"
    -- }
    members JSONB DEFAULT '[]'::jsonb,
    -- Array of members: [ { "name": "...", "email": "...", "mobile": "..." } ]
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled', 'attended')),
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- C. ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id VARCHAR(50) NOT NULL REFERENCES public.registrations(registration_id) ON DELETE CASCADE,
    present BOOLEAN DEFAULT false NOT NULL,
    marked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    marked_by UUID REFERENCES public.admins(id) ON DELETE SET NULL
);

-- D. ADMIN ACTIVITY LOG TABLE (Audit Trail)
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    registration_id VARCHAR(50),
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 3. HIGH PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_registrations_event_code ON public.registrations(event_code);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_reg_id ON public.registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_reg_id ON public.attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_activity_admin_id ON public.admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON public.admin_activity_log(created_at DESC);

-- ============================================================================
-- 4. SECURITY & ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current auth user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid() AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Check if current auth user is super_admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid() AND role = 'super_admin' AND is_active = true
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Get current user assigned event code
CREATE OR REPLACE FUNCTION public.get_admin_event()
RETURNS TEXT AS $$
  SELECT assigned_event_code FROM public.admins
  WHERE id = auth.uid() AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- POLICIES FOR: registrations
-- ----------------------------------------------------------------------------
-- 1. Public can ONLY insert new registrations (cannot read, update or delete)
CREATE POLICY "Public insert only policy"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Super Admins can select, update, and delete ALL registrations
CREATE POLICY "Super admin full access on registrations"
ON public.registrations
FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- 3. Event Coordinators can SELECT registrations for their assigned event
CREATE POLICY "Coordinator select assigned event registrations"
ON public.registrations
FOR SELECT
TO authenticated
USING (
  public.is_admin() AND (
    public.is_super_admin() OR event_code = public.get_admin_event()
  )
);

-- 4. Event Coordinators can UPDATE registrations for their assigned event
CREATE POLICY "Coordinator update assigned event registrations"
ON public.registrations
FOR UPDATE
TO authenticated
USING (
  public.is_admin() AND (
    public.is_super_admin() OR event_code = public.get_admin_event()
  )
)
WITH CHECK (
  public.is_admin() AND (
    public.is_super_admin() OR event_code = public.get_admin_event()
  )
);

-- ----------------------------------------------------------------------------
-- POLICIES FOR: attendance
-- ----------------------------------------------------------------------------
CREATE POLICY "Super admin full access on attendance"
ON public.attendance
FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

CREATE POLICY "Coordinator manage assigned attendance"
ON public.attendance
FOR ALL
TO authenticated
USING (
  public.is_admin() AND (
    public.is_super_admin() OR EXISTS (
      SELECT 1 FROM public.registrations r
      WHERE r.registration_id = attendance.registration_id
      AND r.event_code = public.get_admin_event()
    )
  )
)
WITH CHECK (
  public.is_admin() AND (
    public.is_super_admin() OR EXISTS (
      SELECT 1 FROM public.registrations r
      WHERE r.registration_id = attendance.registration_id
      AND r.event_code = public.get_admin_event()
    )
  )
);

-- ----------------------------------------------------------------------------
-- POLICIES FOR: admin_activity_log
-- ----------------------------------------------------------------------------
CREATE POLICY "Admins can view activity logs"
ON public.admin_activity_log
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can record activity logs"
ON public.admin_activity_log
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- POLICIES FOR: admins
-- ----------------------------------------------------------------------------
CREATE POLICY "Admins can view admin profiles"
ON public.admins
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Super admins can manage admins"
ON public.admins
FOR ALL
TO authenticated
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

-- ============================================================================
-- 5. INITIAL DEFAULT SUPER ADMIN SEED INSTRUCTIONS
-- ============================================================================
-- Step A: Sign up user in Supabase Auth Dashboard or via client:
--   Email: srijan.gcoea@gmail.com
--   Password: srijan2026
--
-- Step B: Insert into public.admins with matching UUID:
-- INSERT INTO public.admins (id, email, name, role, assigned_event_code)
-- VALUES (
--   '<AUTH_USER_UUID_FROM_AUTH_USERS>',
--   'srijan.gcoea@gmail.com',
--   'Srijan Super Admin',
--   'super_admin',
--   NULL
-- );
