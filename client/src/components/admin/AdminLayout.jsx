import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, ClipboardCheck, Download,
  Activity, LogOut, Menu, X, ChevronRight, Search, Command, Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navItems = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/registrations', label: 'Registrations', icon: Users },
  { path: '/admin/events', label: 'Event Management', icon: Calendar },
  { path: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
  { path: '/admin/export', label: 'Export Data', icon: Download },
  { path: '/admin/activity', label: 'Activity Log', icon: Activity },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const cmdInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

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
    logout();
    navigate('/admin');
  };

  // Get breadcrumb from current path
  const getBreadcrumb = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  };

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`${mobile ? 'fixed inset-0 z-50' : 'relative'} flex`}
    >
      {mobile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}
      <div
        className={`${mobile ? 'relative z-10' : ''} flex flex-col bg-slate-950 border-r border-white/[0.06] ${sidebarOpen || mobile ? 'w-64' : 'w-[72px]'} transition-all duration-300 h-full`}
      >
        {/* Logo area */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            {(sidebarOpen || mobile) && (
              <div>
                <span className="text-sm font-bold text-white tracking-wider">SRIJAN</span>
                <span className="text-[10px] text-cyan-400 ml-1 font-mono">ADMIN</span>
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                  ${active
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
              >
                <Icon size={18} className={active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'} />
                {(sidebarOpen || mobile) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/[0.06]">
          {(sidebarOpen || mobile) && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xs font-bold text-white">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate font-medium">{admin?.name || 'Admin'}</p>
                <p className="text-[10px] text-slate-500 truncate">{admin?.role || 'admin'}</p>
              </div>
            </div>
          )}
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
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden h-full">
          <Sidebar mobile />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-white/[0.06] bg-slate-950/95 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
            >
              <Menu size={20} />
            </button>
            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
            >
              <Menu size={20} />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500">
              {getBreadcrumb().map((crumb, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <ChevronRight size={12} />}
                  <span className={i === getBreadcrumb().length - 1 ? 'text-slate-300' : ''}>{crumb}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Command palette trigger */}
          <button
            onClick={() => { setCmdOpen(true); setCmdQuery(''); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.05] transition-colors"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] font-mono text-slate-500">
              <Command size={10} /> K
            </kbd>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {/* Command Palette Modal */}
      {cmdOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCmdOpen(false)} />
          <div className="relative w-full max-w-lg mx-4 bg-slate-900 border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
              <Search size={16} className="text-slate-500" />
              <input
                ref={cmdInputRef}
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Search pages or registration IDs..."
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
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Icon size={16} className="text-slate-500" />
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
