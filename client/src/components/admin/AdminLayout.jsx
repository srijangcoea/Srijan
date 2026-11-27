import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, ClipboardCheck, Download,
  LogOut, Menu, X, ChevronRight, Search, Command, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { notify } from '../../utils/toast';
import { prefetchAdminData, invalidateAdminCache } from '../../services/adminService';
import sMarkImg from '../../assets/srijan-s-mark.png';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { path: '/admin/registrations', label: 'Registrations', shortLabel: 'Regs', icon: Users },
  { path: '/admin/events', label: 'Event Management', shortLabel: 'Events', icon: Calendar },
  { path: '/admin/attendance', label: 'Attendance', shortLabel: 'Attend', icon: ClipboardCheck },
  { path: '/admin/export', label: 'Export Data', shortLabel: 'Export', icon: Download },
];

// Preload lazy admin route chunks on idle so tab switching is instant
const preloadAdminChunks = () => {
  const loaders = [
    () => import('../../pages/admin/DashboardPage'),
    () => import('../../pages/admin/RegistrationsPage'),
    () => import('../../pages/admin/EventManagementPage'),
    () => import('../../pages/admin/AttendancePage'),
    () => import('../../pages/admin/ExportPage'),
  ];
  loaders.forEach((load) => load().catch(() => {}));
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const cmdInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  // Pre-warm admin data & JS chunks on mount for instant navigation
  useEffect(() => {
    prefetchAdminData();
    const timer = setTimeout(preloadAdminChunks, 250);
    return () => clearTimeout(timer);
  }, []);

  // Ctrl+K command palette
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
        setCmdQuery('');
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (cmdOpen && cmdInputRef.current) cmdInputRef.current.focus();
  }, [cmdOpen]);

  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(cmdQuery.toLowerCase())
  );

  const handleCmdSelect = (path) => {
    navigate(path);
    setCmdOpen(false);
  };

  const handleLogout = () => {
    invalidateAdminCache();
    logout();
    notify.info('Logged Out', 'You have been signed out of the console');
    navigate('/admin/login');
  };

  const getBreadcrumb = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  };

  const currentNav = navItems.find((n) => location.pathname.startsWith(n.path));

  const Sidebar = ({ mobile = false }) => (
    <aside className={`${mobile ? 'fixed inset-0 z-50' : 'relative'} flex`}>
      {mobile && (
        <div
          className="fixed inset-0 bg-void/75 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`${mobile ? 'relative z-10' : ''} flex flex-col bg-space-900/95 backdrop-blur-xl border-r border-white/[0.07] ${
          sidebarOpen || mobile ? 'w-64' : 'w-[72px]'
        } transition-all duration-200 h-full`}
      >
        {/* Brand Logo Area */}
        <div className="p-4 border-b border-white/[0.07] flex items-center justify-between h-14">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/40 bg-space-950 p-0.5 shrink-0 shadow-[0_0_12px_-2px_rgba(245,158,11,0.35)]">
              <img src={sMarkImg} alt="Srijan 2026" className="w-full h-full object-contain" />
            </div>
            {(sidebarOpen || mobile) && (
              <div className="truncate">
                <span className="font-display text-sm font-bold text-white tracking-wider">SRIJAN</span>
                <span className="text-[10px] text-gold-metallic ml-1.5 font-mono font-bold">2026 ADMIN</span>
              </div>
            )}
          </Link>
          {mobile && (
            <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => mobile && setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                  ${active
                    ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/5 text-amber-400 border border-amber-500/25 shadow-[0_0_18px_-6px_rgba(245,158,11,0.35)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
              >
                <Icon
                  size={18}
                  className={active ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-400/80 transition-colors'}
                />
                {(sidebarOpen || mobile) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User & Public Site Footer */}
        <div className="p-3 border-t border-white/[0.07] space-y-1">
          {(sidebarOpen || mobile) && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xs font-bold text-space-950 shrink-0 shadow-md shadow-amber-500/20">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate font-medium">{admin?.name || 'Admin'}</p>
                <p className="text-[10px] text-amber-400/80 font-mono uppercase truncate">{admin?.role || 'admin'}</p>
              </div>
            </div>
          )}

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-white/[0.04] hover:text-amber-300 transition-colors"
          >
            <ExternalLink size={16} />
            {(sidebarOpen || mobile) && <span>View Public Site</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut size={18} />
            {(sidebarOpen || mobile) && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-void relative overflow-hidden">
      {/* Subtle Cosmic Website Atmosphere */}
      <div className="pointer-events-none fixed inset-0 radial-nebula opacity-75" />
      <div className="pointer-events-none fixed inset-0 tech-grid-bg opacity-50" />

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full relative z-20">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden h-full">
          <Sidebar mobile />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Bar — Sleek Cosmic Mobile Header + Desktop Header */}
        <header className="relative h-14 lg:h-14 border-b border-amber-500/15 lg:border-white/[0.07] bg-space-900/90 lg:bg-space-900/80 backdrop-blur-xl flex items-center justify-between px-3.5 sm:px-4 shrink-0 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.65)]">
          {/* Subtle glowing hairline on mobile */}
          <div
            className="lg:hidden absolute bottom-0 left-6 right-6 h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.45), transparent)' }}
          />

          {/* Left: Mobile Brand + Active Page Title / Desktop Toggle + Breadcrumb */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Brand Emblem + Page Title */}
            <Link to="/admin/dashboard" className="lg:hidden flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-amber-500/40 bg-space-950 p-0.5 shrink-0 shadow-[0_0_14px_-2px_rgba(245,158,11,0.45)]">
                <img src={sMarkImg} alt="Srijan 2026" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-sm font-bold text-white tracking-wide truncate">
                    {currentNav?.label || 'Admin'}
                  </span>
                </div>
                <span className="block text-[9px] font-mono font-bold tracking-widest text-gold-metallic uppercase">
                  SRIJAN 2026 CONSOLE
                </span>
              </div>
            </Link>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Desktop Breadcrumb */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              {getBreadcrumb().map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight size={12} className="text-slate-600" />}
                  <span className={i === getBreadcrumb().length - 1 ? 'text-amber-400 font-semibold' : ''}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Jump Search */}
            <button
              onClick={() => { setCmdOpen(true); setCmdQuery(''); }}
              aria-label="Quick Jump"
              className="flex items-center gap-2 p-2 lg:px-3 lg:py-1.5 rounded-xl lg:rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-amber-300 hover:border-amber-500/35 hover:bg-amber-500/10 transition-all"
            >
              <Search size={15} className="text-amber-400/80 lg:text-current" />
              <span className="hidden lg:inline text-xs">Quick Jump...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono text-slate-500">
                <Command size={10} /> K
              </kbd>
            </button>

            {/* Mobile Menu Trigger (for Logout / Public Site / Profile) */}
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20 active:scale-95 transition-all"
            >
              <Menu size={17} />
            </button>
          </div>
        </header>

        {/* Page content — extra bottom padding on mobile for floating bottom nav */}
        <main className="flex-1 overflow-y-auto p-4 pb-24 lg:p-6 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          MOBILE-ONLY FLOATING BOTTOM NAVBAR (all admin pages)
      ════════════════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Admin mobile bottom navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-3 mb-2.5">
          <div
            className="relative grid grid-cols-5 items-center rounded-2xl px-1 py-1.5"
            style={{
              background: 'linear-gradient(135deg, rgba(7,10,24,0.96) 0%, rgba(11,16,36,0.98) 100%)',
              border: '1px solid rgba(245,158,11,0.22)',
              boxShadow: '0 -4px 28px rgba(0,0,0,0.65), 0 0 0 1px rgba(245,158,11,0.06), inset 0 1px 0 rgba(251,191,36,0.12)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Top glowing amber hairline */}
            <div
              className="absolute top-0 left-8 right-8 h-[1px] rounded-full pointer-events-none"
              style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.55), transparent)' }}
            />

            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  className="relative flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-all duration-150 active:scale-95"
                >
                  {active && (
                    <div
                      className="absolute inset-0.5 rounded-xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(180deg, rgba(245,158,11,0.16) 0%, rgba(234,88,12,0.06) 100%)',
                        border: '1px solid rgba(245,158,11,0.28)',
                      }}
                    />
                  )}

                  <div
                    className="relative flex items-center justify-center w-6 h-6"
                    style={{
                      filter: active ? 'drop-shadow(0 0 7px rgba(245,158,11,0.7))' : 'none',
                    }}
                  >
                    <Icon
                      size={18}
                      className="relative z-10 transition-colors"
                      style={{
                        color: active ? '#FBBF24' : 'rgba(148,163,184,0.7)',
                        strokeWidth: active ? 2.2 : 1.75,
                      }}
                    />
                  </div>

                  <span
                    className="relative z-10 font-mono text-[9px] font-bold uppercase tracking-wider leading-none"
                    style={{
                      color: active ? '#FBBF24' : 'rgba(148,163,184,0.65)',
                    }}
                  >
                    {item.shortLabel}
                  </span>

                  {active && (
                    <span
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1 rounded-full"
                      style={{ backgroundColor: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Command Palette Modal */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-void/70 backdrop-blur-sm" onClick={() => setCmdOpen(false)} />
          <div className="relative w-full max-w-lg mx-4 cosmic-glass-glow rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
              <Search size={16} className="text-amber-400" />
              <input
                ref={cmdInputRef}
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Jump to admin section..."
                className="flex-1 bg-transparent text-white placeholder:text-slate-500 text-sm outline-none"
              />
              <kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-slate-500 font-mono">ESC</kbd>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filteredNav.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleCmdSelect(item.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-amber-500/10 hover:text-amber-300 transition-colors"
                  >
                    <Icon size={16} className="text-amber-400/70" />
                    <span>{item.label}</span>
                    <ChevronRight size={14} className="ml-auto text-slate-600" />
                  </button>
                );
              })}
              {filteredNav.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-4">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
