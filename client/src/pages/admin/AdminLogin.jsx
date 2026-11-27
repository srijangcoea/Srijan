import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { seedAdmin } from '../../services/adminService';
import { notify } from '../../utils/toast';
import sMarkImg from '../../assets/srijan-s-mark.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seedMsg, setSeedMsg] = useState('');

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      notify.success('Welcome back!', 'Signed into Srijan Admin Console');
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      const errMsg = err.message || 'Invalid credentials';
      setError(errMsg);
      notify.error('Authentication Failed', errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      const res = await seedAdmin();
      setSeedMsg(res.message);
      notify.success('Admin Initialized', res.message);
    } catch (err) {
      setSeedMsg(err.message);
      notify.error('Setup Error', err.message);
    }
  };

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-4 relative overflow-hidden">
      {/* Website Cosmic Atmosphere */}
      <div className="pointer-events-none absolute inset-0 radial-nebula" />
      <div className="pointer-events-none absolute inset-0 tech-grid-bg" />

      <div className="relative w-full max-w-md z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border border-amber-500/40 bg-space-900/90 p-1.5 mb-4 shadow-[0_0_25px_-4px_rgba(245,158,11,0.35)]">
            <img src={sMarkImg} alt="Srijan 2026" className="w-full h-full object-contain" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-wider">
            <span className="text-white">SRIJAN </span>
            <span className="text-gold-metallic">ADMIN</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Technical Fest Management Console</p>
        </div>

        {/* Login Card */}
        <div className="cosmic-glass-glow rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@srijan.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-space-950/70 border border-white/[0.08] text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/25 outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-space-950/70 border border-white/[0.08] text-white placeholder:text-slate-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/25 outline-none transition-colors text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 text-space-950 font-bold text-sm hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {seedMsg && (
            <p className="text-xs text-amber-400 mt-3 text-center">{seedMsg}</p>
          )}
        </div>

        {/* First-time setup hint */}
        <div className="text-center mt-6">
          <button
            onClick={handleSeed}
            className="text-xs text-slate-500 hover:text-amber-400 transition-colors underline decoration-dotted underline-offset-4"
          >
            First time? Click to create default admin account
          </button>
        </div>
      </div>
    </div>
  );
}
