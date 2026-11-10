import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';
import {
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Heart,
  Shield,
  Layers,
  Award,
  HelpCircle,
  Users,
  Instagram,
  Linkedin,
  Github
} from 'lucide-react';
import { events, siteConfig } from '../data/events';
import sMarkImg from '../assets/srijan-s-mark.png';

/**
 * Modern, Responsive & Feature-rich Footer Component for SRIJAN 2026
 * 
 * Includes:
 * 1. Register Now Call-to-Action hero banner with glowing neon gradients
 * 2. Sponsor & partner logo showcase strip
 * 3. Brand identity with interactive logo easter egg (5 clicks unlock secret HUD)
 * 4. Quick navigation links & event directory
 * 5. Hacker resources & guidelines
 * 6. Interactive newsletter subscription form with state feedback
 * 7. Verified social icons (Instagram, Twitter/X, LinkedIn, Discord, GitHub)
 * 8. Semantic footer with accessible aria-labels and smooth back-to-top
 * 9. Easter egg: Console ASCII art banner on mount
 */
export default function Footer() {
  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [newsletterError, setNewsletterError] = useState('');

  // Interactive Easter egg state (Clicking logo 5 times)
  const [clickCount, setClickCount] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);

  // Easter Egg 1: Console message on mount
  useEffect(() => {
    const consoleStyle = [
      'color: #22e5ff',
      'background: #070A18',
      'font-size: 13px',
      'font-family: monospace',
      'padding: 8px 14px',
      'border-left: 4px solid #22e5ff',
      'border-radius: 4px',
      'font-weight: bold'
    ].join(';');

    console.log(
      `%c⚡ [SRIJAN 2026] HACKATHON CONSOLE ACTIVE ⚡\n` +
      `"Build. Break. Ship. Together, we create."\n` +
      `💡 Pro-tip: Click the Srijan 'S' emblem 5 times in the footer to toggle Cyber Overdrive!`,
      consoleStyle
    );
  }, []);

  // Handle Logo Easter Egg click
  const handleLogoClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);

    if (nextCount === 5) {
      setEasterEggActive(true);
      setTimeout(() => {
        setEasterEggActive(false);
        setClickCount(0);
      }, 6000);
    }
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Newsletter submission handler
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setNewsletterError('Please enter a valid email address');
      return;
    }

    setNewsletterError('');
    setNewsletterStatus('loading');

    // Simulate API request delay
    setTimeout(() => {
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 5000);
    }, 800);
  };

  // Sponsor placeholder logos
  const sponsorPartners = [
    { name: 'Quantum Cloud', role: 'Title Sponsor' },
    { name: 'Apex AI Labs', role: 'Platform Partner' },
    { name: 'CyberShield', role: 'Security Partner' },
    { name: 'DevMatrix', role: 'Community Partner' },
    { name: 'Starlight Tech', role: 'Media Partner' }
  ];

  // Quick navigation links
  const quickLinks = [
    { label: 'About Fest', to: '/about' },
    { label: 'All Events & Tracks', to: '/events' },
    { label: 'Schedule & Timeline', to: '/schedule' },
    { label: 'Prizes & Rewards', to: '/events' },
    { label: 'FAQs & Support', to: '/about' },
  ];

  // Hacker resources
  const resourceLinks = [
    { label: 'Hackathon Rules', href: '#rules' },
    { label: 'Code of Conduct', href: '#conduct' },
    { label: 'Mentors & Judges', href: '#mentors' },
    { label: 'Past Highlights (2025)', href: '#past-winners' },
    { label: 'Campus Navigation & Stay', href: '#venue' },
  ];

  return (
    <footer
      role="contentinfo"
      aria-label="Footer"
      className="relative bg-[#030a14] text-slate-300 font-sans border-t border-[#22e5ff]/15 overflow-hidden content-auto"
    >
      {/* Background Radial Glow Effects */}
      <div
        className="absolute top-0 left-1/3 -translate-x-1/2 w-[500px] h-[300px] bg-[#22e5ff]/10 rounded-full blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 bg-[#22e5ff]/8 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Top Blue Highlight Border */}
      <div
        className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#22e5ff]/40 to-transparent"
        aria-hidden="true"
      />

      {/* Easter Egg Floating Cyber Banner */}
      {easterEggActive && (
        <div className="relative z-50 bg-gradient-to-r from-[#031a28] via-[#081522] to-[#031a28] text-[#22e5ff] px-4 py-3 text-center text-xs md:text-sm font-mono border-b border-[#22e5ff]/40 animate-pulse flex items-center justify-center gap-2">
          <Terminal className="w-4 h-4 text-[#22e5ff] animate-spin" />
          <span>🚀 [CYBER OVERDRIVE ACTIVATED] Root access granted. Welcome to Srijan 2026, Hacker!</span>
        </div>
      )}


      {/* 3. MAIN MULTI-COLUMN FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Col 1: Brand & Identity (lg: 4 cols) */}
          <Reveal delay={0} className="lg:col-span-4 space-y-5">
            {/* Logo + Tagline */}
            <div
              onClick={handleLogoClick}
              className="inline-flex items-center gap-3 cursor-pointer select-none group"
              title="Click 5 times for a secret easter egg!"
            >
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#22e5ff]/30 group-hover:border-[#22e5ff] transition-all bg-[#081522] flex-shrink-0 shadow-lg group-hover:shadow-[0_0_20px_rgba(34,229,255,0.3)]">
                <img
                  src={sMarkImg}
                  alt="Srijan S Emblem"
                  width="44"
                  height="44"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black tracking-wider text-2xl text-white group-hover:text-[#22e5ff] transition-colors">
                  {siteConfig.name} {siteConfig.edition}
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#22e5ff]">
                  {siteConfig.tagline} • BUILD. BREAK. SHIP.
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Central India's benchmark technical festival empowering visionary collegiate innovators, builders, and developers through intense hackathons, design sprints, and technical showdowns.
            </p>

            {/* Event Key Facts Pill Card */}
            <div className="p-3.5 rounded-xl bg-[#081522]/70 border border-[#22e5ff]/15 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-[#22e5ff] shrink-0" />
                <span className="font-mono">Annual Technical Edition 2026</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#22e5ff] shrink-0" />
                <span>GCOEA Campus, Amravati, Maharashtra</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400">
                <Shield className="w-4 h-4 text-[#22e5ff]/70 shrink-0" />
                <span>Organized by Government College of Engineering, Amravati</span>
              </div>
            </div>
          </Reveal>

          {/* Col 2: Quick Links (lg: 2 cols) */}
          <Reveal delay={90} className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#22e5ff] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22e5ff] shadow-[0_0_6px_#22e5ff]" />
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-2 text-slate-300 hover:text-[#22e5ff] transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#22e5ff] transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-[#22e5ff] font-medium hover:text-white transition-colors group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22e5ff] shadow-[0_0_6px_#22e5ff] group-hover:scale-125 transition-transform" />
                  <span>Register for Events</span>
                </Link>
              </li>
            </ul>
          </Reveal>

          {/* Col 3: Resources & Guidelines (lg: 2 cols) */}
          <Reveal delay={180} className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#22e5ff] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22e5ff] shadow-[0_0_6px_#22e5ff]" />
              Resources
            </h4>
            <ul className="space-y-2.5 text-sm">
              {resourceLinks.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    className="inline-flex items-center gap-2 text-slate-300 hover:text-[#22e5ff] transition-colors group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-[#22e5ff] transition-colors" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Col 4: Newsletter & Contact (lg: 4 cols) */}
          <Reveal delay={270} className="lg:col-span-4 space-y-5">
            <div>
              <h4 className="text-xs font-mono font-bold tracking-widest uppercase text-[#22e5ff] mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22e5ff] shadow-[0_0_6px_#22e5ff]" />
                Stay Updated
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Subscribe for problem statement releases, workshop schedules, and bounty announcements.
              </p>
            </div>

            {/* Newsletter Input */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="YourEmail@domain.com"
                    aria-label="Newsletter email address"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#081522] border border-[#22e5ff]/20 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#22e5ff] focus:ring-1 focus:ring-[#22e5ff] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading' || newsletterStatus === 'success'}
                  className="px-4 py-2.5 bg-[#22e5ff] hover:bg-[#00daf3] disabled:opacity-60 text-[#00363d] font-bold rounded-lg text-xs transition-all flex items-center justify-center shrink-0 shadow-md shadow-[#22e5ff]/20 hover:shadow-[0_0_20px_rgba(34,229,255,0.4)]"
                  aria-label="Subscribe to newsletter"
                >
                  {newsletterStatus === 'loading' ? (
                    <span className="w-4 h-4 border-2 border-[#00363d]/40 border-t-[#00363d] rounded-full animate-spin" />
                  ) : newsletterStatus === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00363d]" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>

              {newsletterError && (
                <p className="text-[11px] text-rose-400">{newsletterError}</p>
              )}

              {newsletterStatus === 'success' && (
                <p className="text-[11px] text-[#22e5ff] flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22e5ff]" />
                  You're registered for Srijan 2026 dispatches!
                </p>
              )}
            </form>

            {/* Contact Details & Social Icons Strip */}
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Connect & Socialize
                </p>
                <a
                  href={`mailto:${siteConfig.contactEmail || 'srijan.gcoea@gmail.com'}`}
                  className="text-xs text-[#22e5ff] hover:text-[#22e5ff]/80 transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{siteConfig.contactEmail || 'srijan.gcoea@gmail.com'}</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Instagram */}
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Srijan on Instagram"
                  className="w-9 h-9 rounded-lg bg-[#081522] border border-[#22e5ff]/20 hover:border-[#22e5ff] hover:text-[#22e5ff] hover:shadow-[0_0_12px_rgba(34,229,255,0.25)] flex items-center justify-center text-slate-400 transition-all hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Twitter / X */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Srijan on Twitter / X"
                  className="w-9 h-9 rounded-lg bg-[#081522] border border-[#22e5ff]/20 hover:border-[#22e5ff] hover:text-[#22e5ff] hover:shadow-[0_0_12px_rgba(34,229,255,0.25)] flex items-center justify-center text-slate-400 transition-all hover:scale-105"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect on LinkedIn"
                  className="w-9 h-9 rounded-lg bg-[#081522] border border-[#22e5ff]/20 hover:border-[#22e5ff] hover:text-[#22e5ff] hover:shadow-[0_0_12px_rgba(34,229,255,0.25)] flex items-center justify-center text-slate-400 transition-all hover:scale-105"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                {/* Discord */}
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Join Srijan Discord Server"
                  className="w-9 h-9 rounded-lg bg-[#081522] border border-[#22e5ff]/20 hover:border-[#22e5ff] hover:text-[#22e5ff] hover:shadow-[0_0_12px_rgba(34,229,255,0.25)] flex items-center justify-center text-slate-400 transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </a>

                {/* GitHub */}
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Srijan GitHub"
                  className="w-9 h-9 rounded-lg bg-[#081522] border border-[#22e5ff]/20 hover:border-[#22e5ff] hover:text-[#22e5ff] hover:shadow-[0_0_12px_rgba(34,229,255,0.25)] flex items-center justify-center text-slate-400 transition-all hover:scale-105"
                >
                  <Github className="w-4 h-4" />
                </a>

                {/* Email */}
                <a
                  href={`mailto:${siteConfig.contactEmail || 'srijan.gcoea@gmail.com'}`}
                  aria-label="Email Srijan Organizing Team"
                  className="w-9 h-9 rounded-lg bg-[#081522] border border-[#22e5ff]/20 hover:border-[#22e5ff] hover:text-[#22e5ff] hover:shadow-[0_0_12px_rgba(34,229,255,0.25)] flex items-center justify-center text-slate-400 transition-all hover:scale-105"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </Reveal>

        </div>
      </div>

      {/* 4. BOTTOM BAR */}
      <div className="border-t border-[#22e5ff]/15 bg-[#030a14] py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Copyright & Credit */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-center md:text-left">
            <span>&copy; {new Date().getFullYear()} {siteConfig.name} {siteConfig.edition}. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> by the Srijan Organizing Team
            </span>
          </div>

          {/* Right: Legal Links & Back to Top Button */}
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 font-mono text-[11px]">
            <a
              href="#privacy"
              className="hover:text-[#22e5ff] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="hover:text-[#22e5ff] transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href="#conduct"
              className="hover:text-[#22e5ff] transition-colors"
            >
              Code of Conduct
            </a>

            {/* Back to top button */}
            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#081522] border border-[#22e5ff]/20 text-slate-300 hover:text-white hover:border-[#22e5ff] hover:shadow-[0_0_12px_rgba(34,229,255,0.25)] transition-all"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform text-[#22e5ff]" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
}
