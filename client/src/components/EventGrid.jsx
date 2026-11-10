import React, { useState, useRef, useEffect } from 'react';
import EventCard from './EventCard';
import BrochureModal from './BrochureModal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Globally configure GSAP for smoothness
gsap.config({ force3D: true });

export default function EventGrid({ events }) {
  const [selectedEventForBrochure, setSelectedEventForBrochure] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const gridRef = useRef(null);
  const ctxRef = useRef(null);
  const rafRef = useRef(null);

  const categories = ['All', ...new Set(events.map((e) => e.category))];
  const filteredEvents =
    selectedCategory === 'All' ? events : events.filter((e) => e.category === selectedCategory);

  useEffect(() => {
    // Skip for reduced-motion users
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Cancel any pending frame and kill previous context
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (ctxRef.current) { ctxRef.current.revert(); ctxRef.current = null; }

    rafRef.current = requestAnimationFrame(() => {
      if (!gridRef.current) return;
      const cards = Array.from(gridRef.current.querySelectorAll('[data-event-card]'));
      if (!cards.length) return;

      ctxRef.current = gsap.context(() => {
        // Hide all upfront — only opacity + translateY, NO scale (avoids layout recalc)
        gsap.set(cards, { opacity: 0, y: 24, force3D: true });

        // One ScrollTrigger batch for the whole grid — fires per viewport batch
        // Much cheaper than one trigger per card
        ScrollTrigger.batch(cards, {
          start: 'top 95%',
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.5,          // shorter = snappier, less jank
              stagger: 0.07,          // tight stagger: feels staggered but fast
              ease: 'power2.out',     // gentler than power3
              force3D: true,
              overwrite: 'auto',
            });
          },
        });
      }, gridRef);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (ctxRef.current) { ctxRef.current.revert(); ctxRef.current = null; }
    };
  }, [filteredEvents.length, selectedCategory]);

  return (
    <div className="w-full" ref={gridRef}>
      {/* Category Filter Pills */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2 mb-8 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 border ${
                selectedCategory === cat
                  ? 'bg-[#00e5ff]/15 text-[#00e5ff] border-[#00e5ff] font-bold shadow-[0_0_12px_rgba(0,229,255,0.25)]'
                  : 'bg-[#151c26] text-[#bac9cc] border-[#3b494c]/30 hover:border-[#00daf3]/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid — 2 cols mobile, 3 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
        {filteredEvents.map((event) => (
          <div key={event.id} data-event-card="true" className="h-full">
            <EventCard
              event={event}
              onOpenBrochure={(ev) => setSelectedEventForBrochure(ev)}
            />
          </div>
        ))}
      </div>

      {selectedEventForBrochure && (
        <BrochureModal
          isOpen={Boolean(selectedEventForBrochure)}
          onClose={() => setSelectedEventForBrochure(null)}
          event={selectedEventForBrochure}
        />
      )}
    </div>
  );
}
