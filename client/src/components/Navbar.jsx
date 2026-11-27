import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import sMarkImg from '../assets/srijan-s-mark.png';

/**
 * High-Tech Cyber Navbar for Srijan 2026
 * Styled precisely to the cyber-command telemetry design.
 * Features:
 * - Geometric S emblem in glowing corner-dot badge
 * - "SRIJAN v26.0" title with "ETAS • E&TC DEPT" subtext
 * - Desktop nav links (mobile navigation handled by MobileBottomNav)
 * - Active underline indicator for current route
 * - Circular Admin Portal profile action on all screen sizes
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'About', path: '/about' },
    { name: 'Our Team', path: '/ourteam' },
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

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`py-1 text-sm font-medium tracking-wide transition-colors border-b-2 ${
                    active
                      ? 'text-[#22e5ff] border-[#22e5ff] shadow-[0_2px_10px_rgba(34,229,255,0.25)]'
                      : 'text-[#93a4b8] border-transparent hover:text-white hover:border-[#22e5ff]/40'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Admin Portal Icon Button (All screen sizes) */}
          <div className="flex items-center">
            <Link
              to="/admin"
              aria-label="Admin Portal"
              className="w-10 h-10 rounded-full bg-[#0a1c2b] border border-[#22e5ff]/40 text-[#22e5ff] hover:text-white hover:border-[#22e5ff] hover:bg-[#0e273d] hover:shadow-[0_0_15px_rgba(34,229,255,0.35)] flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22e5ff]"
              title="Admin Portal"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
