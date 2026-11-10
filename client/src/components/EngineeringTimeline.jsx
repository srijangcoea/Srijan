import React, { useEffect, useRef } from 'react';
import { Lightbulb, Wrench, Trophy, Palette } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_STEPS = [
  {
    step: '01',
    phase: 'PHASE 01 // DISCOVERY & IDEATION',
    title: 'Innovate',
    tagline: 'From Conceptualization to Architecture',
    description:
      'Brainstorm cutting-edge ideas in IoT, AI, and embedded systems to solve pressing contemporary issues.',
    icon: Lightbulb,
    tags: ['IoT & Embedded Systems', 'AI Architectures', 'Problem Discovery'],
    accentColor: '#00daf3',
    glowColor: 'rgba(0, 218, 243, 0.4)'
  },
  {
    step: '02',
    phase: 'PHASE 02 // PROTOTYPING LABS',
    title: 'Build',
    tagline: 'From Schematics to Tangible Hardware',
    description:
      'Translate schematics into working prototypes with access to state-of-the-art labs and hardware toolkits.',
    icon: Wrench,
    tags: ['Circuit Fabrication', 'Rapid Prototyping', 'Hardware Labs'],
    accentColor: '#22e5ff',
    glowColor: 'rgba(34, 229, 255, 0.4)'
  },
  {
    step: '03',
    phase: 'PHASE 03 // ARENA CHALLENGE',
    title: 'Compete',
    tagline: 'High-Stakes Technical Showdowns',
    description:
      'Go head-to-head against top engineering talent from across the country in high-stakes hackathons and quizzes.',
    icon: Trophy,
    tags: ['24HR Hackathons', 'Live Technical Quizzes', 'National Bounties'],
    accentColor: '#ffd799',
    glowColor: 'rgba(255, 215, 153, 0.4)'
  },
  {
    step: '04',
    phase: 'PHASE 04 // MASTERY & SHIP',
    title: 'Create',
    tagline: 'Engineering Mastery in Production',
    description:
      'Express technical mastery through robust structural design, clean circuit layouts, and creative presentations.',
    icon: Palette,
    tags: ['System Deployment', 'Structural CAD', 'Keynote Showcase'],
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.4)'
  }
];

export default function EngineeringTimeline() {
  const containerRef = useRef(null);
  const spineRef = useRef(null);
  const cardRefs = useRef([]);
  const nodeRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const raf = requestAnimationFrame(() => {
      const ctx = gsap.context(() => {

        // ── 1. Spine: simple fade-in + draw (no scale, just opacity) ──────
        if (spineRef.current) {
          gsap.set(spineRef.current, { opacity: 0, scaleY: 0, transformOrigin: 'top center' });
          gsap.to(spineRef.current, {
            opacity: 0.4,
            scaleY: 1,
            duration: 1.2,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          });
        }

        // ── 2. Each card + its node: single timeline per card ─────────────
        // One ScrollTrigger per card (not 3), combined into one gsap.timeline
        cardRefs.current.forEach((card, idx) => {
          if (!card) return;
          const node = nodeRefs.current[idx];
          const isMobile = window.innerWidth < 768;
          const isEven = idx % 2 === 1;

          // Soft initial state: only opacity + small y, NO x on mobile, NO scale
          gsap.set(card, {
            opacity: 0,
            y: 20,
            x: isMobile ? 0 : (isEven ? 30 : -30),
            force3D: true,
          });
          if (node) gsap.set(node, { opacity: 0, scale: 0.6, force3D: true });

          // Single ScrollTrigger drives a small timeline for card + node together
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              toggleActions: 'play none none none',
            },
          });

          tl.to(card, {
            opacity: 1,
            y: 0,
            x: 0,
            duration: 0.55,
            ease: 'power2.out',
            force3D: true,
          });

          // Node pops slightly after card — no separate ScrollTrigger needed
          if (node) {
            tl.to(node, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: 'back.out(1.4)',   // softer spring than back.out(2)
              force3D: true,
            }, '-=0.35');  // overlap: starts 0.35s into card animation
          }
        });

      }, containerRef);

      containerRef.current._gsapCtx = ctx;
    });

    return () => {
      cancelAnimationFrame(raf);
      if (containerRef.current && containerRef.current._gsapCtx) {
        containerRef.current._gsapCtx.revert();
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full py-4">
      {/* Circuit Spine */}
      <div
        ref={spineRef}
        aria-hidden="true"
        className="absolute left-6 md:left-1/2 top-6 bottom-6 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#22e5ff] via-[#00daf3] to-[#ffd799] pointer-events-none"
        style={{ transformOrigin: 'top center' }}
      />

      {/* Subtle pulse rings */}
      <div aria-hidden="true" className="absolute left-6 md:left-1/2 top-1/4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#22e5ff]/20 blur-[5px] pointer-events-none" />
      <div aria-hidden="true" className="absolute left-6 md:left-1/2 top-3/4 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ffd799]/20 blur-[5px] pointer-events-none" />

      {/* Timeline Steps */}
      <div className="flex flex-col gap-10 md:gap-14 relative z-10">
        {TIMELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isEven = idx % 2 === 1;

          return (
            <div
              key={step.title}
              className="relative flex flex-col md:flex-row items-start md:items-center w-full"
            >
              {/* Milestone Node */}
              <div
                ref={(el) => (nodeRefs.current[idx] = el)}
                className="absolute left-6 md:left-1/2 -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center"
              >
                <span
                  className="absolute w-11 h-11 rounded-xl animate-ping opacity-15"
                  style={{ backgroundColor: step.accentColor }}
                />
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#081522] border-2 flex items-center justify-center font-mono font-extrabold text-xs sm:text-sm tracking-wider hover:scale-105 transition-transform duration-200 cursor-default"
                  style={{
                    borderColor: step.accentColor,
                    color: step.accentColor,
                    boxShadow: `0 0 16px ${step.glowColor}`
                  }}
                >
                  {step.step}
                </div>
              </div>

              {/* Connecting Arm (Desktop only) */}
              <div
                aria-hidden="true"
                className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] pointer-events-none z-10 ${
                  isEven
                    ? 'left-1/2 w-10 bg-gradient-to-r from-transparent to-[#22e5ff]/35'
                    : 'right-1/2 w-10 bg-gradient-to-l from-transparent to-[#22e5ff]/35'
                }`}
              />

              {/* Content Card */}
              <div
                className={`w-full md:w-[calc(50%-2.5rem)] ${
                  isEven ? 'md:ml-auto pl-14 sm:pl-16 md:pl-0' : 'md:mr-auto pl-14 sm:pl-16 md:pl-0'
                }`}
                ref={(el) => (cardRefs.current[idx] = el)}
              >
                <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#151c26] via-[#19202a] to-[#151c26] border border-[#00e5ff]/20 hover:border-[#00e5ff]/50 transition-colors duration-300 group hover:shadow-[0_8px_30px_rgba(0,229,255,0.18)] hover:-translate-y-1.5 relative overflow-hidden" style={{ transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s' }}>
                  {/* Corner accent */}
                  <div
                    className="absolute top-0 right-0 w-14 h-14 pointer-events-none opacity-20 group-hover:opacity-45 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at top right, ${step.accentColor}, transparent 65%)` }}
                  />
                  {/* Top scanline */}
                  <div
                    className="absolute top-0 inset-x-0 h-[2px] opacity-25 group-hover:opacity-70 transition-opacity pointer-events-none"
                    style={{ background: `linear-gradient(to right, transparent, ${step.accentColor}, transparent)` }}
                  />

                  {/* Phase header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#00daf3] font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.accentColor }} />
                      {step.phase}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 font-bold bg-[#0d141d] px-2 py-0.5 rounded border border-white/5">
                      MILESTONE_{step.step}
                    </span>
                  </div>

                  {/* Icon + Title */}
                  <div className="flex items-center gap-3.5 mb-3">
                    <div
                      className="w-11 h-11 rounded-xl bg-[#0d141d] border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200"
                      style={{ borderColor: `${step.accentColor}55`, color: step.accentColor }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-[#22e5ff] transition-colors duration-200 leading-tight">
                        {step.title}
                      </h3>
                      <span className="font-sans text-xs text-[#ffd799] font-medium mt-0.5">
                        {step.tagline}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="font-sans text-xs sm:text-sm text-[#bac9cc] leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Capability Tags — no individual GSAP stagger, just CSS */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-3.5 border-t border-[#3b494c]/30">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md bg-[#0d141d] text-[#c3f5ff] border border-white/10 font-medium hover:border-[#22e5ff]/40 transition-colors duration-150"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
