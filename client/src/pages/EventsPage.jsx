import React from 'react';
import EventGrid from '../components/EventGrid';
import CTASection from '../components/CTASection';
import { events } from '../data/events';

export default function EventsPage() {
  return (
    <div className="pt-28 sm:pt-32 pb-20 min-h-screen text-[#dce3f0]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col gap-2 mb-10 sm:mb-12 border-b border-[#3b494c]/30 pb-8">
          <span className="font-mono text-xs sm:text-sm text-[#00daf3] uppercase tracking-widest font-semibold">
            // FEATURED_EVENTS_CATALOG
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#dce3f0] font-bold tracking-tight">
            Flagship Competitions
          </h1>
          <p className="font-sans text-base text-[#bac9cc] max-w-3xl leading-relaxed mt-1">
            Explore the flagship engineering events and technical challenges of Srijan 2026. Review criteria, prepare your schematics, and secure your registration.
          </p>
        </div>

        {/* Competition Grid */}
        <EventGrid events={events} />
      </div>

      <div className="mt-20">
        <CTASection />
      </div>
    </div>
  );
}
