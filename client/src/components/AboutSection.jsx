import React from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Cpu,
  Layers,
  Flag,
  Trophy,
  Rocket,
  CheckCircle2,
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import sMarkImg from '../assets/srijan-s-mark.png';

/**
 * AboutSection Component
 * Recreates the Cybernetic Telemetry / Engineering Blueprint layout precisely
 * from the specification image, styled to Srijan 2026's dark navy & cyan theme.
 */
export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative w-full py-12 sm:py-16 text-[#e8f1f8] font-sans overflow-hidden">
      {/* Ambient Blueprint Grid & Glow Effects */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#22e5ff12 1px, transparent 1px), linear-gradient(90deg, #22e5ff12 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(75% 75% at 50% 30%, #000 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(75% 75% at 50% 30%, #000 40%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#22e5ff]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#ffb400]/8 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8"
      >
        {/* 1. TOP HEADER AREA */}
        <motion.div variants={itemVariants} className="space-y-2">
          {/* Main Title + Edition Badge + S Mark Logo */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#081522] border border-[#22e5ff]/40 p-2 flex items-center justify-center shadow-[0_0_20px_rgba(34,229,255,0.3)] flex-shrink-0 group hover:border-[#22e5ff] transition-all">
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22e5ff] shadow-[0_0_8px_#22e5ff] border-2 border-[#030a14]" />
              <img
                src={sMarkImg}
                alt="Srijan S Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,180,0,0.6)] group-hover:scale-110 transition-transform"
              />
            </div>
            <h1 className="font-mono font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase">
              ABOUT <span className="bg-gradient-to-r from-white via-[#e8f1f8] to-[#22e5ff] bg-clip-text text-transparent">SRIJAN</span>
            </h1>
            <span className="px-2.5 py-1 rounded-md bg-[#0a1d2c] border border-[#22e5ff]/40 text-[#ffb400] text-xs font-mono font-bold tracking-wider shadow-[0_0_12px_rgba(255,180,0,0.2)]">
              EDITION 2026
            </span>
          </div>

          {/* Subtitle: Together, We Create. | Association */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm sm:text-base font-mono">
            <span className="font-bold text-white text-base sm:text-lg">
              Together, We Create.
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-[#93a4b8] text-xs sm:text-sm tracking-widest uppercase">
              ELECTRONICS &amp; TELECOMMUNICATION ASSOCIATION OF STUDENTS // GCOEA
            </span>
          </div>
        </motion.div>

        {/* 2. TOP CARD: SYNTHESIS STATEMENT // VER 2.6 */}
        <motion.div
          variants={itemVariants}
          className="relative rounded-2xl bg-[#06101c]/90 border border-[#22e5ff]/25 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] group hover:border-[#22e5ff]/50 transition-all duration-300 overflow-hidden"
        >
          {/* Top subtle cyan accent border */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#22e5ff]/70 to-transparent" />

          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#22e5ff]/15 pb-4 mb-5 font-mono text-xs">
            <div className="flex items-center gap-2 text-[#22e5ff]">
              <span className="p-1 rounded bg-[#22e5ff]/10 border border-[#22e5ff]/30">
                <Terminal className="w-3.5 h-3.5 text-[#22e5ff]" />
              </span>
              <span className="font-bold tracking-wider">
                SYNTHESIS STATEMENT // VER 2.6
              </span>
            </div>

            <div className="text-[11px] text-[#93a4b8] tracking-widest">
              SYS_PAR: 06_FLAGSHIP_NODES
            </div>
          </div>

          {/* Content Statement */}
          <p className="text-slate-200 text-sm sm:text-base md:text-lg leading-relaxed font-sans max-w-5xl">
            Srijan 2026 is an engineering symposium uniting ambitious student builders, thinkers, and innovators across six flagship technical arenas to collaborate, engineer real-world prototypes, and shape tomorrow's technological frontier together.
          </p>
        </motion.div>

        {/* 3. TWO-COLUMN GRID: CHRONICLE TRACE & SCHEMATIC CAD-FRAME */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: CHRONICLE TRACE (lg: 7 cols) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 flex flex-col justify-between rounded-2xl bg-[#06101c]/90 border border-[#22e5ff]/25 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] group hover:border-[#22e5ff]/50 transition-all duration-300 relative overflow-hidden"
          >
            {/* Ambient inner glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#22e5ff]/5 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#22e5ff]/15 pb-4 mb-6 font-mono text-xs">
                <span className="text-[#22e5ff] font-bold tracking-wider">
                  CHRONICLE TRACE // [TXT_FDID_01]
                </span>
                <span className="flex items-center gap-1.5 text-[#ffb400] font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#ffb400] animate-pulse" />
                  STATUS: VERIFIED
                </span>
              </div>

              {/* 3 Narrative Sections */}
              <div className="space-y-6">
                {/* 01. Origin & Identity */}
                <div className="space-y-2 group/node">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#22e5ff] tracking-wider">
                    <Flag className="w-3.5 h-3.5 text-[#22e5ff]" />
                    <span>01. ORIGIN &amp; IDENTITY</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-5 border-l border-[#22e5ff]/20">
                    Srijan 2026 stands as the premier inaugural technical symposium conceived and orchestrated by the Electronics &amp; Telecommunication Association of Students. Engineered from the ground up, Srijan represents a convergence platform where classroom theory meets raw engineering execution.
                  </p>
                </div>

                {/* 02. Challenge & Craft */}
                <div className="space-y-2 group/node">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#ffb400] tracking-wider">
                    <Trophy className="w-3.5 h-3.5 text-[#ffb400]" />
                    <span>02. CHALLENGE &amp; CRAFT</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-5 border-l border-[#ffb400]/20">
                    Across two intensive days of competition, engineering minds unite to tackle real-world challenges in decentralized software, precision circuit fabrication, 3D mechanical synthesis, and structural stress physics.
                  </p>
                </div>

                {/* 03. Vision & Impact */}
                <div className="space-y-2 group/node">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#22e5ff] tracking-wider">
                    <Rocket className="w-3.5 h-3.5 text-[#22e5ff]" />
                    <span>03. VISION &amp; IMPACT</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed pl-5 border-l border-[#22e5ff]/20">
                    More than a fest, Srijan is a crucible for builders and visionary creators. Through hands-on problem solving and collaborative pressure, we empower undergraduates and faculty to architect the next technological era.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="flex items-center justify-between pt-6 mt-8 border-t border-[#22e5ff]/15 font-mono text-[11px]">
              <span className="text-[#93a4b8] tracking-widest">
                PAR_COUNT: 03
              </span>
              <span className="text-[#22e5ff] font-bold tracking-wider">
                [ EXECUTION_CYCLE: ACTIVE ]
              </span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: SCHEMATIC CAD-FRAME & AFFILIATION METADATA (lg: 5 cols) */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-[#06101c]/90 border border-[#22e5ff]/25 p-6 sm:p-8 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] group hover:border-[#22e5ff]/50 transition-all duration-300 relative overflow-hidden"
          >
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between border-b border-[#22e5ff]/15 pb-4 mb-6 font-mono text-xs">
                <div className="flex items-center gap-2 text-[#22e5ff]">
                  <span className="p-1 rounded bg-[#22e5ff]/10 border border-[#22e5ff]/30">
                    <Layers className="w-3.5 h-3.5 text-[#22e5ff]" />
                  </span>
                  <span className="font-bold tracking-wider">
                    SCHEMATIC CAD-FRAME
                  </span>
                </div>
                <span className="text-[11px] text-[#93a4b8] tracking-widest">
                  REV: 2.6.A
                </span>
              </div>

              {/* 3 Blueprint Micro-cards */}
              <div className="space-y-3.5">
                {/* 01 */}
                <div className="p-4 rounded-xl bg-[#081726]/80 border border-[#22e5ff]/15 hover:border-[#22e5ff]/40 transition-all text-xs sm:text-sm text-slate-300 leading-relaxed group/card">
                  <span className="font-mono font-bold text-[#22e5ff] mr-2">01/</span>
                  A multi-disciplinary crucible uniting coders, circuit designers, and architects across six flagship arenas.
                </div>

                {/* 02 */}
                <div className="p-4 rounded-xl bg-[#081726]/80 border border-[#22e5ff]/15 hover:border-[#22e5ff]/40 transition-all text-xs sm:text-sm text-slate-300 leading-relaxed group/card">
                  <span className="font-mono font-bold text-[#22e5ff] mr-2">02/</span>
                  Where rigorous engineering methodology transforms conceptual blueprints into verifiable prototypes.
                </div>

                {/* 03 */}
                <div className="p-4 rounded-xl bg-[#081726]/80 border border-[#22e5ff]/15 hover:border-[#22e5ff]/40 transition-all text-xs sm:text-sm text-slate-300 leading-relaxed group/card">
                  <span className="font-mono font-bold text-[#22e5ff] mr-2">03/</span>
                  Fostering inter-collegiate collaboration between visionary engineering students and distinguished academic mentors.
                </div>
              </div>
            </div>

            {/* Affiliation Metadata Card at bottom */}
            <div className="mt-8 pt-5 border-t border-[#22e5ff]/15 space-y-3">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-widest text-[#93a4b8]">
                <span>AFFILIATION METADATA</span>
                <span className="text-[#ffb400] font-bold">NODE: GCOEA</span>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm sm:text-base">
                  Government College of Engineering, Amravati
                </h4>
                <p className="text-xs font-mono text-[#93a4b8] mt-0.5">
                  ETAS Secretariat // Dept of Electronics &amp; Telecommunication
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-[#93a4b8] font-bold">
                  TELEMETRY STATE:
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#22e5ff]/15 border border-[#22e5ff]/40 text-[#22e5ff] text-[10px] font-mono font-bold shadow-[0_0_12px_rgba(34,229,255,0.25)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22e5ff] animate-ping" />
                  INSPECTION ACTIVE
                </span>
              </div>
            </div>
          </motion.div>

        </div>

        {/* 4. BOTTOM ACTION STRIP */}
        <motion.div variants={itemVariants} className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[#22e5ff]/15">
          <div className="text-xs font-mono text-[#93a4b8]">
            Srijan 2026 Symposium Framework · ETAS GCOEA
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-[#0a1c2b] hover:bg-[#0e273d] border border-[#22e5ff]/30 hover:border-[#22e5ff] transition-all"
            >
              <span>EXPLORE ALL ARENAS</span>
              <ArrowRight className="w-4 h-4 text-[#22e5ff]" />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-[#00131c] bg-[#22e5ff] hover:bg-[#52eeff] shadow-[0_0_20px_rgba(34,229,255,0.5)] transition-all"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>REGISTER NOW</span>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
