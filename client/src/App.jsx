import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import StarfieldCanvas from './components/StarfieldCanvas';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

// Immediate critical render for fast Home LCP
import Home from './pages/Home';

// Lazy loaded below-the-fold & secondary routes for tiny initial bundle
const Footer = lazy(() => import('./components/Footer'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const EventDetailsPage = lazy(() => import('./pages/EventDetailsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const Registration = lazy(() => import('./pages/Registration'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const Ourteam = lazy(() => import('./pages/Ourteam'));
const SchedulePage = lazy(() => import('./pages/SchedulePage'));

// Lazy loaded Admin imports
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));
const RegistrationsPage = lazy(() => import('./pages/admin/RegistrationsPage'));
const EventManagementPage = lazy(() => import('./pages/admin/EventManagementPage'));
const AttendancePage = lazy(() => import('./pages/admin/AttendancePage'));
const ExportPage = lazy(() => import('./pages/admin/ExportPage'));
const ActivityLogPage = lazy(() => import('./pages/admin/ActivityLogPage'));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#22e5ff]/20 border-t-[#22e5ff] animate-spin" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        containerClassName="!z-[99999]"
        containerStyle={{
          top: 24,
          right: 24,
        }}
        toastOptions={{
          duration: 4000,
        }}
      />

      <div className="min-h-screen flex flex-col bg-void text-slate-100 relative selection:bg-amber-500/30 selection:text-amber-200">
        {/* Starfield Canvas (only for public pages) */}
        {!isAdminRoute && <StarfieldCanvas />}

        {/* Auto scroll-to-top on route navigation */}
        <ScrollToTop />

        {/* Persistent Navigation Bar (public pages only) */}
        {!isAdminRoute && <Navbar />}

        {/* Main Viewport Content */}
        <main className={`flex-grow relative ${isAdminRoute ? 'z-20' : 'z-10'}`}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Festival Pages */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:eventId" element={<EventDetailsPage />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/register/:eventId" element={<Registration />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/ourteam" element={<Ourteam />} />


              {/* Admin Authentication */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Protected Admin Console Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="/admin/dashboard" element={<DashboardPage />} />
                  <Route path="/admin/registrations" element={<RegistrationsPage />} />
                  <Route path="/admin/events" element={<EventManagementPage />} />
                  <Route path="/admin/attendance" element={<AttendancePage />} />
                  <Route path="/admin/export" element={<ExportPage />} />
                  <Route path="/admin/activity" element={<ActivityLogPage />} />
                </Route>
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Persistent Brand Footer (public pages only) */}
        {!isAdminRoute && (
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        )}
      </div>
    </AuthProvider>
  );
}
