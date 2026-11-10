import React from 'react';
import Hero from '../components/Hero';
import EventGrid from '../components/EventGrid';
import CTASection from '../components/CTASection';
import EngineeringTimeline from '../components/EngineeringTimeline';
import Reveal from '../components/Reveal';
import { events } from '../data/events';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen text-[#dce3f0]">
      {/* 1. Hero Section */}
      <Hero />

      {/* ==================================================================== */}
      {/* 2. ABOUT TEASER & 4 CORE PILLARS (ENGINEERING EXCELLENCE IN ACTION)  */}
      {/* ==================================================================== */}
      <section className="py-20 sm:py-28 px-6 lg:px-12 relative bg-[#080f18]/60 border-t border-[#3b494c]/20 content-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-16">
          
          {/* Header Row */}
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-2xl">
              <span className="font-mono text-xs sm:text-sm text-[#00daf3] uppercase tracking-widest font-semibold">
                // ETAS SYMPOSIUM OVERVIEW
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#dce3f0] font-bold tracking-tight">
                Engineering Excellence in Action
              </h2>
              <p className="font-sans text-base sm:text-lg text-[#bac9cc] leading-relaxed mt-2">
                Srijan is the annual national technical festival hosted by the Electronics and Telecommunication Association of Students (ETAS). For over two decades, we have provided a platform for sharp minds to push boundaries, build hardware and software solutions, and collaborate on real-world challenges.
              </p>
            </div>
            
            <div className="font-mono text-xs text-[#00daf3] bg-[#19202a] px-4 py-2.5 rounded-lg border border-[#3b494c]/40 self-start md:self-auto shrink-0 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-pulse" />
              <span>STATUS: VERIFIED_ACADEMIC_EVENT</span>
            </div>
          </Reveal>

          {/* 4 Core Pillars Milestone Timeline Stream with Scroll-Triggered Animation */}
          <EngineeringTimeline />

          <div className="text-center pt-2">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-sm font-mono text-[#00daf3] hover:text-white group transition-colors"
            >
              <span>Explore Srijan's legacy and symposium chronicle</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* 3. FLAGSHIP COMPETITIONS PREVIEW                                      */}
      {/* ==================================================================== */}
      <section id="events" className="py-20 sm:py-28 px-6 lg:px-12 relative scroll-mt-20 content-auto">
        <div className="max-w-7xl mx-auto flex flex-col gap-12 sm:gap-14">
          
          {/* Section Header */}
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs sm:text-sm text-[#00daf3] uppercase tracking-widest font-semibold">
                // FEATURED_EVENTS_CATALOG
              </span>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#dce3f0] font-bold tracking-tight">
                Flagship Competitions
              </h2>
            </div>
            
            <Link
              to="/events"
              className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-[#00daf3] hover:text-white uppercase tracking-wider font-bold transition-colors group self-start md:self-auto"
            >
              <span>View All 25+ Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>

          {/* Events Grid Component */}
          <EventGrid events={events} />
        </div>
      </section>

      {/* 4. Ready to Create CTA */}
      <div className="content-auto">
        <CTASection />
      </div>
    </div>
  );
}
