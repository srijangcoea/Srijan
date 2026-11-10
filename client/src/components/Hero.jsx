import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Zap,
  Radio,
  ArrowRight,
  UserCheck
} from 'lucide-react';

/**
 * Modern High-Impact Hero Section for SRIJAN '26
 * Engineered precisely to the cyber-command telemetry design specification.
 */
export default function Hero() {
  // Live Countdown targeting Dec 20, 2026 09:00:00 IST
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const targetDate = new Date('2026-12-20T09:00:00+05:30').getTime();

    const padZero = (num) => (num < 10 ? `0${num}` : `${num}`);

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: padZero(days),
        hours: padZero(hours),
        minutes: padZero(minutes),
        seconds: padZero(seconds)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col w-full relative overflow-hidden bg-[#030a14] text-[#dfe2ee]">
      {/* Component Styles & Animations */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(4deg); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(18px) rotate(-5deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.08); }
        }
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-float-1 { animation: floatSlow 7s ease-in-out infinite; }
        .anim-float-2 { animation: floatReverse 9s ease-in-out infinite 1s; }
        .anim-float-3 { animation: floatSlow 8.5s ease-in-out infinite 2s; }
        .anim-float-4 { animation: floatReverse 10s ease-in-out infinite 1.5s; }
        .anim-float-5 { animation: floatSlow 6.5s ease-in-out infinite 0.5s; }
        .anim-glow { animation: pulseGlow 8s ease-in-out infinite; }
        .anim-ticker { animation: tickerScroll 24s linear infinite; }
        .fade-seq-1 { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both 0.1s; }
        .fade-seq-2 { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both 0.2s; }
        .fade-seq-3 { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both 0.3s; }
        .fade-seq-4 { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both 0.4s; }
        .fade-seq-5 { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both 0.5s; }
        .fade-seq-6 { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both 0.6s; }
        .fade-seq-7 { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both 0.7s; }
      `}</style>

      {/* Ambient Backdrop & Vector Grid Circuit Canvas */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {/* Center Volumetric Lighting Spheres */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] bg-gradient-to-tr from-[#22e5ff]/20 via-[#38bdf8]/15 to-[#8ed5ff]/10 rounded-full blur-[120px] anim-glow" />
        <div className="absolute -top-32 right-10 w-[420px] h-[360px] bg-[#22e5ff]/15 rounded-full blur-[100px] anim-glow" />

        {/* Fine Tech Matrix Grid Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern height="48" id="srijan-circuit-grid" patternUnits="userSpaceOnUse" width="48">
              <path className="text-[#22e5ff]" d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.75" />
              <circle className="text-[#38bdf8]" cx="24" cy="24" fill="currentColor" fillOpacity="0.4" r="1" />
              <path className="text-[#22e5ff]" d="M 24 16 L 24 32 M 16 24 L 32 24" stroke="currentColor" strokeOpacity="0.15" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="grid-fade" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#000" stopOpacity="1" />
              <stop offset="85%" stopColor="#000" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </linearGradient>
            <mask id="fade-mask">
              <rect fill="url(#grid-fade)" height="100%" width="100%" />
            </mask>
          </defs>
          <rect fill="url(#srijan-circuit-grid)" height="100%" mask="url(#fade-mask)" width="100%" />
        </svg>

        {/* Edge-Pinned Geometric Scatter Glyphs */}
        {/* Top-Left Glyphs */}
        <div className="absolute top-32 lg:top-36 left-6 lg:left-14 flex items-center gap-2 opacity-30 anim-float-1">
          <span className="font-display text-2xl lg:text-3xl text-[#22e5ff] select-none drop-shadow-[0_0_12px_rgba(34,229,255,0.4)]">✎</span>
          <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest hidden md:inline">NODE_INCEPT.01</span>
        </div>

        {/* Top-Right Glyphs */}
        <div className="absolute top-36 lg:top-40 right-8 lg:right-16 flex flex-col items-end opacity-35 anim-float-2">
          <span className="font-display text-2xl lg:text-3xl text-[#8ed5ff] select-none drop-shadow-[0_0_16px_rgba(142,213,255,0.45)]">⚙</span>
          <span className="font-mono text-[#22e5ff] uppercase tracking-widest text-[9px] mt-1">SYS_ROT.SYNC</span>
        </div>

        {/* Mid-Left Glyph */}
        <div className="absolute top-[52%] left-4 lg:left-12 flex flex-col items-center opacity-30 anim-float-3">
          <span className="font-display text-2xl lg:text-3xl text-[#22e5ff] select-none drop-shadow-[0_0_14px_rgba(34,229,255,0.5)]">⚡</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#22e5ff]/40 to-transparent mt-2" />
        </div>

        {/* Mid-Right Glyph */}
        <div className="absolute top-[48%] right-6 lg:right-14 opacity-30 anim-float-4">
          <div className="p-1 rounded bg-[#0a1c2b]/60 backdrop-blur-md border border-[#22e5ff]/20">
            <span className="font-display text-2xl lg:text-3xl text-[#38bdf8] select-none drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]">◈</span>
          </div>
        </div>

        {/* Bottom-Left Accent Glyph */}
        <div className="absolute bottom-28 left-10 lg:left-24 opacity-35 anim-float-5">
          <span className="font-display text-2xl lg:text-3xl text-[#22e5ff] select-none drop-shadow-[0_0_18px_rgba(34,229,255,0.6)]">✦</span>
        </div>
      </div>

      {/* Primary Centered Hero Module Stack */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 md:pt-32 pb-0">
        <div className="w-full max-w-[1200px] mx-auto my-auto flex flex-col items-center text-center">
          
          {/* Item 1: Status Pill Badge */}
          <div className="fade-seq-1 mb-4 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#081522]/85 border border-[#22e5ff]/30 backdrop-blur-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:border-[#22e5ff]/60 transition-all duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22e5ff] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#22e5ff]" />
            </span>
            <span className="font-mono text-xs sm:text-[13px] text-slate-200 uppercase tracking-wider font-semibold">
              ETAS Presents · 1st Edition
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#22e5ff]/10 border border-[#22e5ff]/30 text-[#22e5ff] uppercase font-bold tracking-widest">
              2026
            </span>
          </div>

          {/* Item 2: Small Letter-Spaced Etymology Label */}
          <div className="fade-seq-2 mb-2">
            <p className="font-mono text-xs text-[#22e5ff] uppercase tracking-[0.28em] font-semibold">
              SANSKRIT FOR 'CREATION'
            </p>
          </div>

          {/* Item 3: Very Large Bold Display Headline */}
          <div className="fade-seq-3 max-w-[960px] mx-auto mb-4">
            <div className="flex flex-col items-center justify-center gap-1">
              <h1 className="font-display text-[3.25rem] sm:text-[4.75rem] lg:text-[5.5rem] font-bold tracking-tight uppercase leading-[1.02] text-white">
                <span className="bg-gradient-to-r from-[#38bdf8] via-[#22e5ff] to-[#bdc2ff] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(34,229,255,0.35)]">
                  SRIJAN
                </span>{' '}
                <span className="text-[#22e5ff]">'26</span>
              </h1>
              <h2 className="font-display text-xl sm:text-2xl lg:text-3xl font-medium text-slate-300 tracking-wide mt-1">
                Where Ideas <span className="text-[#22e5ff] font-semibold">Take Shape</span>
              </h2>
            </div>
          </div>

          {/* Item 4: Centered Contextual Lead Paragraph */}
          <div className="fade-seq-4 max-w-[700px] mx-auto mb-6">
            <p className="font-sans text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
              A multi-disciplinary technical fest bringing together coders, designers, and builders through 6 hands-on competitions. Organized by Electronics &amp; Telecommunication Academic Society at Government College of Engineering, Amravati (GCOEA).
            </p>
          </div>

          {/* Item 5: Row of 3 Translucent Info Chips */}
          <div className="fade-seq-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-8 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#081522]/75 border border-[#22e5ff]/25 backdrop-blur-md shadow-sm hover:border-[#22e5ff]/50 transition-colors">
              <Calendar className="w-4 h-4 text-[#22e5ff]" />
              <span className="font-sans text-xs sm:text-sm text-slate-200 font-medium">20–21 Dec 2026</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#081522]/75 border border-[#22e5ff]/25 backdrop-blur-md shadow-sm hover:border-[#22e5ff]/50 transition-colors">
              <MapPin className="w-4 h-4 text-[#38bdf8]" />
              <span className="font-sans text-xs sm:text-sm text-slate-200 font-medium">GCOEA Campus, Amravati</span>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#081522]/75 border border-[#22e5ff]/25 backdrop-blur-md shadow-sm hover:border-[#22e5ff]/50 transition-colors">
              <Zap className="w-4 h-4 text-[#22e5ff]" />
              <span className="font-sans text-xs sm:text-sm text-slate-200 font-medium">6 Technical Events</span>
            </div>
          </div>

          {/* Item 6: Live Telemetry Countdown Module */}
          <div className="fade-seq-6 w-full max-w-[560px] mx-auto mb-8 p-4 sm:p-5 rounded-2xl bg-[#081522]/85 border border-[#22e5ff]/30 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
            {/* Telemetry Header Strip */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#22e5ff] animate-pulse" />
                <span className="font-mono text-[10px] sm:text-xs text-slate-300 uppercase tracking-widest">
                  COUNTDOWN TO SRIJAN · 20–21 DEC 2026
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#22e5ff] bg-[#22e5ff]/10 border border-[#22e5ff]/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                LIVE CLOCK
              </span>
            </div>

            {/* 4 Numeric Segment Blocks */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 items-center">
              {/* Days Box */}
              <div className="flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-xl bg-[#030a14]/90 border border-white/5 shadow-inner">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#22e5ff] tracking-tight">
                  {timeLeft.days}
                </span>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">DAYS</span>
              </div>

              {/* Hours Box */}
              <div className="flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-xl bg-[#030a14]/90 border border-white/5 shadow-inner">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#22e5ff] tracking-tight">
                  {timeLeft.hours}
                </span>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">HRS</span>
              </div>

              {/* Minutes Box */}
              <div className="flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-xl bg-[#030a14]/90 border border-white/5 shadow-inner">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#22e5ff] tracking-tight">
                  {timeLeft.minutes}
                </span>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">MIN</span>
              </div>

              {/* Seconds Box */}
              <div className="flex flex-col items-center justify-center py-2.5 px-1 sm:px-2 rounded-xl bg-[#030a14]/90 border border-white/5 shadow-inner">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-[#22e5ff] tracking-tight">
                  {timeLeft.seconds}
                </span>
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">SEC</span>
              </div>
            </div>
          </div>

          {/* Item 7: Dual Elevated Action Buttons */}
          <div className="fade-seq-7 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-[460px] mx-auto mb-10">
            <Link
              to="/register"
              className="w-full sm:w-1/2 px-6 py-3.5 rounded-full bg-[#22e5ff] hover:bg-[#52eeff] text-[#00131c] font-sans text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_28px_rgba(34,229,255,0.45)] hover:shadow-[0_0_36px_rgba(34,229,255,0.7)] hover:-translate-y-0.5 active:translate-y-0 text-center"
            >
              <span>Register Now</span>
              <UserCheck className="w-4 h-4" />
            </Link>

            <Link
              to="/events"
              className="w-full sm:w-1/2 px-6 py-3.5 rounded-full bg-[#081522]/85 hover:bg-[#0c2033] border border-[#22e5ff]/35 hover:border-[#22e5ff] text-slate-100 font-sans text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 group text-center"
            >
              <span>Explore Events</span>
              <ArrowRight className="w-4 h-4 text-[#22e5ff] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>

        {/* Item 8: Edge Ticker Marquee with Visual Rhythm Separators */}
        <div className="w-full relative mt-4 bg-[#081522]/90 border-y border-[#22e5ff]/20 backdrop-blur-md overflow-hidden py-3">
          <div className="anim-ticker flex items-center whitespace-nowrap will-change-transform">
            {/* Loop Track 1 */}
            <div className="flex items-center gap-6 sm:gap-10 px-4 font-mono text-xs sm:text-sm tracking-[0.22em] text-slate-300 uppercase">
              <span className="text-white font-bold">CODE</span>
              <span className="text-[#22e5ff]">✦</span>
              <span className="text-white font-bold">DESIGN</span>
              <span className="text-[#38bdf8]">✦</span>
              <span className="text-white font-bold">BUILD</span>
              <span className="text-[#22e5ff]">✦</span>
              <span className="text-white font-bold">CREATE</span>
              <span className="text-[#8ed5ff]">✦</span>
              <span className="text-white font-bold">COMPETE</span>
              <span className="text-[#38bdf8]">✦</span>
              <span className="text-white font-bold">INNOVATE</span>
              <span className="text-[#22e5ff]">✦</span>
              <span className="text-white font-bold">SRIJAN '26</span>
              <span className="text-[#22e5ff]">✦</span>
            </div>

            {/* Loop Track 2 (Seamless Mirror) */}
            <div aria-hidden="true" className="flex items-center gap-6 sm:gap-10 px-4 font-mono text-xs sm:text-sm tracking-[0.22em] text-slate-300 uppercase">
              <span className="text-white font-bold">CODE</span>
              <span className="text-[#22e5ff]">✦</span>
              <span className="text-white font-bold">DESIGN</span>
              <span className="text-[#38bdf8]">✦</span>
              <span className="text-white font-bold">BUILD</span>
              <span className="text-[#22e5ff]">✦</span>
              <span className="text-white font-bold">CREATE</span>
              <span className="text-[#8ed5ff]">✦</span>
              <span className="text-white font-bold">COMPETE</span>
              <span className="text-[#38bdf8]">✦</span>
              <span className="text-white font-bold">INNOVATE</span>
              <span className="text-[#22e5ff]">✦</span>
              <span className="text-white font-bold">SRIJAN '26</span>
              <span className="text-[#22e5ff]">✦</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
