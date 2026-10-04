import React from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StarfieldCanvas from './components/StarfieldCanvas';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

import Home from './pages/Home';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import AboutPage from './pages/AboutPage';
import Registration from './pages/Registration';
import NotFoundPage from './pages/NotFoundPage';

// Admin imports
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import DashboardPage from './pages/admin/DashboardPage';
import RegistrationsPage from './pages/admin/RegistrationsPage';
import EventManagementPage from './pages/admin/EventManagementPage';
import AttendancePage from './pages/admin/AttendancePage';
import ExportPage from './pages/admin/ExportPage';
import ActivityLogPage from './pages/admin/ActivityLogPage';
import Ourteam from './pages/Ourteam';

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
          <Routes>
            {/* Public Festival Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailsPage />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/register/:eventId" element={<Registration />} />
            <Route path="/about" element={<AboutPage />} />
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
        </main>

        {/* Persistent Brand Footer (public pages only) */}
        {!isAdminRoute && <Footer />}
      </div>
    </AuthProvider>
  );
}
