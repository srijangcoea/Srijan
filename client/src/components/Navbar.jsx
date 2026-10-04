import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, User } from 'lucide-react';
import sMarkImg from '../assets/srijan-s-mark.png';

/**
 * High-Tech Cyber Navbar for Srijan 2026
 * Styled precisely to the cyber-command telemetry design.
 * Features:
 * - Geometric S emblem in glowing corner-dot badge
 * - "SRIJAN v26.0" title with "ETAS • E&TC DEPT" subtext
 * - Cleaned nav links (sponsors and telemetry status tab removed)
 * - Active pill indicator for current route
 * - Electric cyan "⚡ REGISTER NOW" action button
 * - Circular profile/admin user action
 * - Fully responsive with animated mobile drawer
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'EVENTS', path: '/events' },
    { name: 'SCHEDULE', path: '/events' },
    { name: 'ABOUT', path: '/about' },
    { name: 'OUT TEAM', path: '/ourteam' },

  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#030a14]/95 backdrop-blur-xl border-b border-[#22e5ff]/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-2.5 sm:py-3'
          : 'bg-[#030a14]/80 backdrop-blur-md border-b border-[#22e5ff]/15 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT: S Emblem Badge + Brand Identity */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22e5ff] rounded-xl p-1 select-none"
            aria-label="Srijan Home"
          >
            {/* Logo Box with Top-Right Glowing Cyan Dot */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#081522] border border-[#22e5ff]/40 p-2 flex items-center justify-center shadow-[0_0_15px_rgba(34,229,255,0.25)] group-hover:border-[#22e5ff] group-hover:shadow-[0_0_20px_rgba(34,229,255,0.45)] transition-all flex-shrink-0">
              {/* Corner Cyan Status Light Dot */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22e5ff] shadow-[0_0_8px_#22e5ff] border-2 border-[#030a14]" />
              
              <img
                src={sMarkImg}
                alt="Srijan S Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,180,0,0.6)] group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Typography: SRIJAN v26.0 + ETAS • E&TC DEPT */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold tracking-wider text-lg sm:text-xl text-white group-hover:text-[#22e5ff] transition-colors leading-none">
                  SRIJAN
                </span>
                <span className="text-[10px] font-mono font-bold text-[#ffb400] bg-[#0c1f2e] border border-[#ffb400]/40 px-1.5 py-0.5 rounded tracking-wide shadow-[0_0_8px_rgba(255,180,0,0.2)]">
                  v26.0
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.22em] font-mono text-[#93a4b8] uppercase mt-1 group-hover:text-[#c4d3e2] transition-colors">
                ETAS • E&amp;TC DEPT
              </span>
            </div>
          </Link>

          {/* CENTER: Navigation Links (Sponsors & Status tab removed per request) */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-xs lg:text-[13px] font-mono font-bold tracking-wider transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22e5ff] ${
                    active
                      ? 'bg-[#0d2335] text-white border border-[#22e5ff]/50 shadow-[0_0_15px_rgba(34,229,255,0.2)]'
                      : 'text-[#93a4b8] hover:text-white hover:bg-[#0c1d2c]/60 border border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: REGISTER NOW Button + User Profile Icon */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Electric Cyan CTA Button */}
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono font-bold text-xs sm:text-sm text-[#00131c] bg-[#22e5ff] hover:bg-[#52eeff] shadow-[0_0_24px_rgba(34,229,255,0.6)] hover:shadow-[0_0_35px_rgba(34,229,255,0.85)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 tracking-wider focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#22e5ff]"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>REGISTER NOW</span>
            </Link>

            {/* Circular Profile Icon Button (links to admin/profile) */}
            <Link
              to="/admin"
              aria-label="Admin / User Profile"
              className="w-10 h-10 rounded-full bg-[#0a1c2b] border border-[#22e5ff]/40 text-[#22e5ff] hover:text-white hover:border-[#22e5ff] hover:bg-[#0e273d] hover:shadow-[0_0_15px_rgba(34,229,255,0.35)] flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22e5ff]"
              title="Admin & Dashboard"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>

          {/* MOBILE: Hamburger Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-lg font-mono font-bold text-xs text-[#00131c] bg-[#22e5ff] shadow-[0_0_12px_rgba(34,229,255,0.5)] flex items-center gap-1 sm:hidden"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>REGISTER</span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#22e5ff] hover:text-white bg-[#0a1c2b] border border-[#22e5ff]/30 focus:outline-none focus:ring-2 focus:ring-[#22e5ff]"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100 border-b border-[#22e5ff]/30 bg-[#030a14]/98 backdrop-blur-2xl' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`block px-4 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider transition-colors ${
                  active
                    ? 'text-white bg-[#0d2335] border border-[#22e5ff]/50 shadow-[0_0_12px_rgba(34,229,255,0.2)]'
                    : 'text-[#93a4b8] hover:text-white hover:bg-[#0c1d2c]/60'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-2 flex items-center gap-3">
            <Link
              to="/register"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl font-mono font-bold text-xs text-[#00131c] bg-[#22e5ff] shadow-[0_0_20px_rgba(34,229,255,0.5)] tracking-wider"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>REGISTER NOW</span>
            </Link>

            <Link
              to="/admin"
              className="p-3 rounded-xl bg-[#0a1c2b] border border-[#22e5ff]/40 text-[#22e5ff] hover:text-white flex items-center justify-center"
              aria-label="Admin Portal"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
