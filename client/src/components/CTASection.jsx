import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Layers, Cpu } from 'lucide-react';
import Reveal from './Reveal';

export default function CTASection() {
  return (
    <section id="register-cta" className="py-20 sm:py-28 px-6 lg:px-12 relative overflow-hidden">
      {/* Container Card with Reveal Animation & 6px Hover Lift */}
      <Reveal>
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-[#151c26] via-[#19202a] to-[#151c26] p-8 sm:p-12 lg:p-16 border border-[#00e5ff]/30 hover:border-[#00e5ff]/60 shadow-[0_0_50px_rgba(0,229,255,0.18)] hover:shadow-[0_12px_45px_rgba(0,229,255,0.25)] hover:-translate-y-1.5 transition-all duration-[250ms] ease-out relative overflow-hidden backdrop-blur-xl">
          
          {/* Ambient circuit background & glow flares */}
          <div className="absolute inset-0 bg-circuit-grid opacity-35 pointer-events-none" />
          <div className="absolute -top-24 -left-20 w-[500px] h-[300px] bg-[#00e5ff]/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-[350px] h-[250px] bg-[#ffd799]/10 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Top cyan scanline accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00e5ff]/60 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 lg:gap-14">
            
            {/* Left Column: Copy & Headings */}
            <div className="flex flex-col gap-4 max-w-2xl">
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#00daf3] bg-[#00e5ff]/10 px-3.5 py-1.5 rounded-lg border border-[#00e5ff]/30 shadow-[0_0_14px_rgba(0,229,255,0.2)] self-start">
                <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
                <span>Registrations live // Srijan 2026</span>
              </div>

              {/* Main Headline */}
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#dce3f0] tracking-tight leading-tight">
                Ready to{' '}
                <span className="bg-gradient-to-r from-[#00e5ff] via-[#c3f5ff] to-[#ffd799] bg-clip-text text-transparent">
                  Build, Break, and Ship?
                </span>
              </h2>

              {/* Description Subtext */}
              <p className="font-sans text-base sm:text-lg text-[#bac9cc] leading-relaxed">
                Join Central India's premier technical gathering. Turn bold ideas into functional prototypes, compete for grand bounties, and connect with ambitious builders and tech minds.
              </p>

              {/* Metrics Chips */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-4 mt-2 border-t border-[#3b494c]/30">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:-translate-y-1 transition-transform">
                  <div className="w-10 h-10 rounded-lg bg-[#0d141d] border border-[#00e5ff]/30 flex items-center justify-center text-[#00e5ff] shrink-0 shadow-inner">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-[#00daf3]">
                      06+
                    </div>
                    <div className="font-mono text-[11px] sm:text-xs text-[#bac9cc] uppercase tracking-wider">
                      Competition tracks
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg hover:-translate-y-1 transition-transform">
                  <div className="w-10 h-10 rounded-lg bg-[#0d141d] border border-[#ffd799]/30 flex items-center justify-center text-[#ffd799] shrink-0 shadow-inner">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono text-2xl sm:text-3xl font-bold text-[#ffd799]">
                      ∞
                    </div>
                    <div className="font-mono text-[11px] sm:text-xs text-[#bac9cc] uppercase tracking-wider">
                      Ideas waiting
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Impact Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-mono text-xs sm:text-sm uppercase font-bold text-[#00363d] bg-[#00e5ff] hover:bg-[#00daf3] shadow-[0_0_24px_rgba(0,229,255,0.45)] hover:shadow-[0_0_35px_rgba(0,229,255,0.65)] hover:-translate-y-1 transition-all tracking-wider text-center"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Register Now</span>
              </Link>

              <Link
                to="/events"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-mono text-xs sm:text-sm uppercase font-bold text-[#00daf3] hover:text-white bg-[#0d141d]/80 hover:bg-[#00e5ff]/10 border border-[#00e5ff]/40 hover:border-[#00e5ff] shadow-sm hover:shadow-[0_0_20px_rgba(0,229,255,0.25)] hover:-translate-y-1 transition-all tracking-wider text-center"
              >
                <span>Explore Tracks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </Reveal>
    </section>
  );
}
