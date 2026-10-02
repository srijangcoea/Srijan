# SRIJAN 2026 — Modern Technical Fest Admin Console

A comprehensive, dark-themed, high-performance administrative panel built for **SRIJAN 2026** (Government College of Engineering, Amravati - ETAS).

Designed with a blueprint/circuit cyber aesthetic matching the Srijan visual identity, featuring role-based access control, real-time analytics, bulk operations, desk check-in verification, and multi-format exports.

---

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS (Dark Cyber/Void theme matching Srijan)
- **Routing**: React Router v7 with protected routes (`ProtectedRoute.jsx`)
- **Data Table Engine**: `@tanstack/react-table` (v8) with search, sorting, pagination, column toggles, and bulk selection
- **Visualizations**: `recharts` (Bar charts, Line timeline trends, Donut status distributions)
- **Icons**: `lucide-react`
- **Data Export**: `xlsx` + `file-saver` (Excel `.xlsx` and Comma-Separated `.csv`)
- **Backend Architecture**: Decoupled service layer (`services/adminService.js`) supporting:
  - **Option A**: Express.js + MongoDB backend (Included and running on port 9000)
  - **Option B**: Supabase PostgreSQL with Row Level Security (RLS) (Schema provided in `supabase_schema.sql`)

---

## 🔐 Default Admin Credentials

> **Email**: `srijan.gcoea@gmail.com`  
> **Password**: `srijan2026`  
> **Role**: `super_admin`

*Note: You can seed or reset this default super admin directly from the login page by clicking "First time? Click to create default admin account" or sending a POST to `/api/admin/seed`.*

---

## 📁 File Structure

```text
Srijan-2026/
├── supabase_schema.sql                <-- Complete Supabase PostgreSQL Tables + RLS Policies
├── README_ADMIN.md                   <-- This Documentation
├── client/
│   ├── .env.example                  <-- Client Environment Template
│   ├── src/
│   │   ├── components/
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx   <-- Collapsible sidebar, topbar, Ctrl+K command palette
│   │   │       ├── ProtectedRoute.jsx<-- Route guard checking authentication
│   │   │       ├── DataTable.jsx     <-- TanStack Table with pagination, search, column menu
│   │   │       ├── StatCard.jsx      <-- Glow KPI card with delta indicators
│   │   │       ├── ChartCard.jsx     <-- Styled chart wrapper card
│   │   │       ├── StatusBadge.jsx   <-- Color-coded interactive status chip
│   │   │       ├── DetailDrawer.jsx  <-- Slide-in registration & team details drawer
│   │   │       └── ConfirmDialog.jsx <-- Accessible confirmation modal for destructive actions
│   │   ├── pages/
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx    <-- Supabase / JWT email & password authentication
│   │   │       ├── DashboardPage.jsx <-- KPI metrics, Recharts charts, recent registrations
│   │   │       ├── RegistrationsPage.jsx <-- Main table, event tabs, bulk actions, inline status
│   │   │       ├── EventManagementPage.jsx <-- Date, venue, prize pool, team size, deadline editor
│   │   │       ├── AttendancePage.jsx<-- Desk scanner, check-in toggle, print attendance roster
│   │   │       ├── ExportPage.jsx    <-- Excel / CSV export center
│   │   │       └── ActivityLogPage.jsx<-- Immutable administrative audit log
│   │   ├── services/
│   │   │   └── adminService.js       <-- Centralized API and Supabase abstraction layer
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx       <-- Admin auth state management
│   │   └── App.jsx                   <-- Configured route tree
└── server/
    ├── controllers/
    │   ├── adminController.js         <-- Login, seed, and profile controllers
    │   ├── adminRegistrationController.js <-- Status updates, bulk actions, KPI calculations
    │   ├── attendanceController.js    <-- Check-in recording & stats
    │   └── eventController.js         <-- Event configuration updates
    ├── routes/
    │   ├── adminRoutes.js             <-- Protected admin endpoints
    │   └── eventRoutes.js             <-- Event read/update routes
    └── middleware/
        └── auth.js                    <-- JWT verification & role authorization
```

---

## 🖥️ Admin Panel Pages Overview

### 1. Login (`/admin/login`)
- Protected route entrance for authenticated admins.
- Email and password input with show/hide password toggle.
- First-time seed button to initialize the default super admin account (`srijan.gcoea@gmail.com` / `srijan2026`).

### 2. Dashboard (`/admin/dashboard`)
- **KPI Row**: Total Registrations, Total Participants (including team members), Confirmed, Pending Review, Rejected, Registrations Today.
- **Bar Chart**: Registrations across the 6 core competitions (Hackathon, KBC, PCB, CAD, Bridge, Circuit).
- **Donut Chart**: Real-time approval status proportion (Confirmed vs Pending vs Rejected).
- **Line Chart**: Registration trajectory timeline.
- **Capacity Trackers**: Progress bars tracking registrations against target capacity.
- **Recent Registrations List**: Clickable rows that open the right-side detail drawer.

### 3. Registrations (`/admin/registrations`)
- **TanStack Table Engine**:
  - Global search by Registration ID, Team Name, Leader Name, Email, or Mobile.
  - Granular filters: Event Code tabs, Status, Academic Year (1st–4th), Department (CSE, IT, ENTC, etc.), and Date Range.
  - Column Visibility menu to toggle table columns on and off.
  - Density toggle (Dense mode for compact data density on desktop).
  - Sticky headers and skeleton loading states.
- **Inline Status Cycle**: Click any status badge in the table to cycle: `Pending` ➔ `Confirmed` ➔ `Rejected` (with optional reason prompt).
- **Slide-In Detail Drawer**: View full leader information, college ID, all team members, and action buttons.
- **Bulk Actions**: Select multiple registrations to bulk Confirm, bulk Reject (with reason), bulk Delete, or Export selected.

### 4. Event Management (`/admin/events`)
- Cards for all 6 technical events:
  - **HACK**: Hackathon
  - **KBC**: KBC Quiz
  - **PCB**: PCB Designing
  - **CAD**: CAD Modeling
  - **BRG**: Bridge Making
  - **CIRCUIT**: Circuit Making
- Configure Date, Venue Location, Prize Pool, Min/Max Team Size, Registration Deadline, and one-click Registration Open/Closed toggle.

### 5. Attendance (`/admin/attendance`)
- Search by Registration ID or Participant Name.
- One-click check-in toggle button (Present / Absent) with optimistic updates.
- Real-time turnout KPI counters and event breakdown.
- **Print Attendance Sheet**: Dedicated print layout (`@media print`) that formats a clean paper roster with signature columns for desk verification.

### 6. Export Center (`/admin/export`)
- Event-wise and status-wise filtering.
- Option to include or exclude team member roster column.
- One-click export to **Excel (`.xlsx`)** and **CSV (`.csv`)**.

### 7. Activity Log (`/admin/activity`)
- Audit log of administrative actions (`LOGIN`, `STATUS_UPDATE`, `BULK_STATUS`, `BULK_DELETE`, `ATTENDANCE_MARK`, `EVENT_UPDATE`).
- Displays target registration ID, timestamp, and administrator name.

---

## 🛡️ Supabase Database & Security Setup

If using Supabase as your primary backend database:

1. Open your **Supabase Dashboard** -> **SQL Editor**.
2. Copy and execute the contents of [`supabase_schema.sql`](./supabase_schema.sql).
3. The SQL script creates:
   - `admins` table with role support:
     - `super_admin`: Full access to all events and admin management.
     - `coordinator`: Restricted by Row Level Security (RLS) to their `assigned_event_code`.
   - `registrations` table with JSONB `leader` and `members` array.
   - `attendance` table linked to registrations.
   - `admin_activity_log` table for audit recording.
   - High-performance indexes on `registration_id`, `event_code`, `status`, and timestamps.
   - Strict Row Level Security policies:
     - **Public**: Can only `INSERT` into `registrations`.
     - **Admins**: Can `SELECT`, `UPDATE`, `DELETE` according to their role.

---

## ⚡ Quick Start & Run Locally

### 1. Start the Backend API (Port 9000)
```bash
cd server
npm install
npm run dev
```

### 2. Start the Frontend Client (Port 5173)
```bash
cd client
npm install
npm run dev
```

### 3. Log In to Admin Panel
Open your browser to:
```text
http://localhost:5173/admin/login
```
Enter:
- **Email**: `srijan.gcoea@gmail.com`
- **Password**: `srijan2026`

Press **Sign In** to access the dashboard.
Keyboard shortcut: Press <kbd>Ctrl</kbd> + <kbd>K</kbd> anywhere in the admin console to open the quick navigation Command Palette.
