import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Layers, Cpu } from 'lucide-react';
import Reveal from './Reveal';

export default function CTASection() {
  return (
    <section id="register-cta" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
      <Reveal>
        <div className="max-w-5xl mx-auto rounded-2xl bg-gradient-to-r from-[#151c26] via-[#19202a] to-[#151c26] p-5 sm:p-8 lg:p-10 border border-[#00e5ff]/30 hover:border-[#00e5ff]/55 shadow-[0_0_30px_rgba(0,229,255,0.12)] hover:shadow-[0_8px_32px_rgba(0,229,255,0.2)] hover:-translate-y-1 transition-all duration-250 ease-out relative overflow-hidden">

          {/* Ambient glows */}
          <div className="absolute inset-0 bg-circuit-grid opacity-25 pointer-events-none" />
          <div className="absolute -top-16 -left-12 w-72 h-40 bg-[#00e5ff]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-56 h-36 bg-[#ffd799]/08 rounded-full blur-[70px] pointer-events-none" />

          {/* Top scanline */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff]/50 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8">

            {/* Left: Copy */}
            <div className="flex flex-col gap-2.5 min-w-0 flex-1">
              {/* Status Pill */}
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#00daf3] bg-[#00e5ff]/10 px-2.5 py-1 rounded-md border border-[#00e5ff]/25 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping shrink-0" />
                <span>Registrations Live · Srijan 2026</span>
              </div>

              {/* Headline */}
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-[#dce3f0] tracking-tight leading-tight">
                Ready to{' '}
                <span className="bg-gradient-to-r from-[#00e5ff] via-[#c3f5ff] to-[#ffd799] bg-clip-text text-transparent">
                  Build, Break & Ship?
                </span>
              </h2>

              {/* Sub-copy */}
              <p className="font-sans text-xs sm:text-sm text-[#bac9cc] leading-relaxed max-w-lg">
                Central India's premier tech fest. Compete, build, and connect with top engineering talent.
              </p>

              {/* Metrics row */}
              <div className="flex items-center gap-5 sm:gap-8 pt-2 mt-1 border-t border-[#3b494c]/25">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0d141d] border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] shrink-0">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-mono text-base sm:text-lg font-bold text-[#00daf3] leading-none">06+</div>
                    <div className="font-mono text-[9px] sm:text-[10px] text-[#bac9cc] uppercase tracking-wider">Tracks</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0d141d] border border-[#ffd799]/30 flex items-center justify-center text-[#ffd799] shrink-0">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-mono text-base sm:text-lg font-bold text-[#ffd799] leading-none">₹2L+</div>
                    <div className="font-mono text-[9px] sm:text-[10px] text-[#bac9cc] uppercase tracking-wider">Prize Pool</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Buttons */}
            <div className="flex flex-row sm:flex-col items-stretch gap-2.5 w-full sm:w-auto shrink-0">
              <Link
                to="/register"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-[11px] sm:text-xs uppercase font-bold text-[#00363d] bg-[#00e5ff] hover:bg-[#00daf3] shadow-[0_0_18px_rgba(0,229,255,0.4)] hover:shadow-[0_0_28px_rgba(0,229,255,0.6)] hover:-translate-y-0.5 transition-all tracking-wider text-center whitespace-nowrap"
              >
                <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
                <span>Register Now</span>
              </Link>

              <Link
                to="/events"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-[11px] sm:text-xs uppercase font-bold text-[#00daf3] hover:text-white bg-[#0d141d]/80 hover:bg-[#00e5ff]/10 border border-[#00e5ff]/35 hover:border-[#00e5ff] hover:-translate-y-0.5 transition-all tracking-wider text-center whitespace-nowrap"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>

          </div>
        </div>
      </Reveal>
    </section>
  );
}
