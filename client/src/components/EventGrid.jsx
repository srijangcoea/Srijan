import React, { useState } from 'react';
import EventCard from './EventCard';
import BrochureModal from './BrochureModal';
import Reveal from './Reveal';

export default function EventGrid({ events }) {
  const [selectedEventForBrochure, setSelectedEventForBrochure] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...new Set(events.map((e) => e.category))];

  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  return (
    <div className="w-full">
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

      {/* Grid of Events with Staggered Reveal (2 cards per row on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
        {filteredEvents.map((event, idx) => (
          <Reveal key={event.id} delay={idx * 90} className="h-full">
            <EventCard
              event={event}
              onOpenBrochure={(ev) => setSelectedEventForBrochure(ev)}
            />
          </Reveal>
        ))}
      </div>

      {/* Brochure Modal */}
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
