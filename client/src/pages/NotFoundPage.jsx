import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutDashboard, ArrowLeft } from 'lucide-react';
import sMarkImg from '../assets/srijan-s-mark.png';
import PageTransition from '../components/PageTransition';

export default function NotFoundPage() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <PageTransition>
      <div
        className={`min-h-screen flex items-center justify-center px-4 ${
          isAdminPath
            ? 'bg-[#0a0f1e]'
            : 'pt-28 pb-16'
        }`}
      >
        <div
          className={`max-w-md w-full text-center p-8 rounded-3xl border backdrop-blur-xl shadow-2xl ${
            isAdminPath
              ? 'bg-white/[0.03] border-white/[0.08]'
              : 'bg-space-900/80 border-white/10'
          }`}
        >
          {/* Logo */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl overflow-hidden border border-amber-500/40 bg-black/40 p-1.5">
            <img src={sMarkImg} alt="Srijan 2026" className="w-full h-full object-contain" />
          </div>

          {/* Error code */}
          <div className="text-6xl font-mono font-bold mb-2 bg-gradient-to-br from-amber-400 to-orange-500 bg-clip-text text-transparent">
            404
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            {isAdminPath ? 'Admin Page Not Found' : 'Page Not Found'}
          </h1>

          <p className="text-sm text-slate-400 mb-2 font-mono break-all">
            {location.pathname}
          </p>

          <p className="text-sm text-slate-400 mb-8">
            {isAdminPath
              ? 'This admin route does not exist. Use the sidebar to navigate.'
              : 'The requested path does not exist in this sector. Navigate back to explore Srijan competitions and events.'}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            {isAdminPath ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-orange-500/25 hover:opacity-90 transition-opacity"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
