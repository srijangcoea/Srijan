import React from 'react';
import { Lightbulb, Wrench, Trophy, Palette, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';

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
    glowColor: 'rgba(0, 218, 243, 0.35)'
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
    glowColor: 'rgba(34, 229, 255, 0.35)'
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
    glowColor: 'rgba(255, 215, 153, 0.35)'
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
    glowColor: 'rgba(56, 189, 248, 0.35)'
  }
];

export default function EngineeringTimeline() {
  return (
    <div className="relative w-full py-4">
      {/* Central Glowing Circuit Spine */}
      {/* Mobile: Left at 24px (left-6). Desktop: Exactly in center (left-1/2) */}
      <div
        aria-hidden="true"
        className="absolute left-6 md:left-1/2 top-6 bottom-6 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#22e5ff] via-[#00daf3] to-[#ffd799] opacity-35 pointer-events-none"
      />

      {/* Floating subtle pulse rings down the line */}
      <div
        aria-hidden="true"
        className="absolute left-6 md:left-1/2 top-1/4 -translate-x-1/2 w-4 h-4 rounded-full bg-[#22e5ff]/20 blur-[6px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute left-6 md:left-1/2 top-3/4 -translate-x-1/2 w-4 h-4 rounded-full bg-[#ffd799]/20 blur-[6px] pointer-events-none"
      />

      {/* Timeline Milestones Stream */}
      <div className="flex flex-col gap-10 md:gap-14 relative z-10">
        {TIMELINE_STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isEven = idx % 2 === 1; // 0: Left, 1: Right, 2: Left, 3: Right

          return (
            <div
              key={step.title}
              className="relative flex flex-col md:flex-row items-start md:items-center w-full"
            >
              {/* Milestone Node on the Spine */}
              <div
                className="absolute left-6 md:left-1/2 -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 z-20 flex items-center justify-center"
              >
                {/* Outer Ping Halo */}
                <span
                  className="absolute w-12 h-12 rounded-xl animate-ping opacity-25"
                  style={{ backgroundColor: step.accentColor }}
                />

                {/* Central Step Badge */}
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#081522] border-2 flex items-center justify-center font-mono font-extrabold text-xs sm:text-sm tracking-wider shadow-lg transition-transform duration-300 hover:scale-110"
                  style={{
                    borderColor: step.accentColor,
                    color: step.accentColor,
                    boxShadow: `0 0 18px ${step.glowColor}`
                  }}
                >
                  {step.step}
                </div>
              </div>

              {/* Horizontal Connecting Arm (Desktop only) */}
              <div
                aria-hidden="true"
                className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] pointer-events-none z-10 ${
                  isEven
                    ? 'left-1/2 w-10 bg-gradient-to-r from-transparent to-[#22e5ff]/40'
                    : 'right-1/2 w-10 bg-gradient-to-l from-transparent to-[#22e5ff]/40'
                }`}
              />

              {/* Content Card with Scroll-Triggered Reveal Animation */}
              <div
                className={`w-full md:w-[calc(50%-2.5rem)] ${
                  isEven ? 'md:ml-auto pl-14 sm:pl-16 md:pl-0' : 'md:mr-auto pl-14 sm:pl-16 md:pl-0'
                }`}
              >
                <Reveal delay={idx * 100}>
                  <div
                    className="p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#151c26] via-[#19202a] to-[#151c26] border border-[#00e5ff]/20 hover:border-[#00e5ff]/50 transition-all duration-[250ms] ease-out group hover:shadow-[0_8px_30px_rgba(0,229,255,0.2)] hover:-translate-y-1.5 relative overflow-hidden backdrop-blur-xl"
                  >
                    {/* Corner Cyber Accent Tag */}
                    <div
                      className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                      style={{
                        background: `radial-gradient(circle at top right, ${step.accentColor}, transparent 70%)`
                      }}
                    />

                    {/* Phase Header Strip */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#00daf3] font-semibold flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: step.accentColor }}
                        />
                        {step.phase}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 font-bold bg-[#0d141d] px-2 py-0.5 rounded border border-white/5">
                        MILESTONE_{step.step}
                      </span>
                    </div>

                    {/* Icon + Title Header */}
                    <div className="flex items-center gap-3.5 mb-2.5">
                      <div
                        className="w-11 h-11 rounded-xl bg-[#0d141d] border flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-inner"
                        style={{
                          borderColor: `${step.accentColor}55`,
                          color: step.accentColor
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex flex-col">
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-[#22e5ff] transition-colors leading-tight">
                          {step.title}
                        </h3>
                        <span className="font-sans text-xs text-[#ffd799] font-medium mt-0.5">
                          {step.tagline}
                        </span>
                      </div>
                    </div>

                    {/* Step Description */}
                    <p className="font-sans text-xs sm:text-sm text-[#bac9cc] leading-relaxed mt-1">
                      {step.description}
                    </p>

                    {/* Capability Tags Row */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 pt-3.5 border-t border-[#3b494c]/30">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-md bg-[#0d141d] text-[#c3f5ff] border border-white/10 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
