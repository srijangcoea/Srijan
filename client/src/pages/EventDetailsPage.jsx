import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { events } from '../data/events';
import EventDetails from '../components/EventDetails';
import BrochureModal from '../components/BrochureModal';
import { ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';

const TAG_MAP = {
  'event-1': 'CODE // 24HR',
  'event-2': 'QUIZ // STAGE',
  'event-3': 'HARDWARE // LAB',
  'event-4': 'DESIGN // 3D',
  'event-5': 'CIVIL // STRENGTH',
  'event-6': 'ANALOG // DIGITAL',
};

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [selectedEventForBrochure, setSelectedEventForBrochure] = useState(null);

  // Find matching event from centralized data
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="pt-36 pb-24 text-center max-w-xl mx-auto px-6 min-h-[60vh] text-[#dce3f0]">
        <div className="inline-block p-4 rounded-2xl bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[#00daf3] mb-6 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
          <Sparkles className="w-8 h-8 mx-auto" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-3">Event Not Found</h1>
        <p className="text-[#bac9cc] text-sm mb-8 leading-relaxed">
          The requested event schematic could not be located in the catalog. Please browse our active technical competitions.
        </p>
        <Link
          to="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-xs uppercase font-bold text-[#00363d] bg-[#00e5ff] hover:bg-[#00daf3] shadow-[0_0_16px_rgba(0,229,255,0.4)] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Competitions</span>
        </Link>
      </div>
    );
  }

  // Find other events
  const otherEvents = events.filter((e) => e.id !== event.id);

  return (
    <div className="pt-28 sm:pt-32 pb-24 min-h-screen bg-[#0d141d] bg-circuit-grid text-[#dce3f0]">
      {/* Event Details Content */}
      <EventDetails
        event={event}
        onOpenBrochure={(ev) => setSelectedEventForBrochure(ev)}
      />

      {/* Quick Navigation to Other Competitions */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 mt-16 pt-12 border-t border-[#3b494c]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#00daf3] font-semibold">
              // DISCOVER_MORE // EXPLORE_ARENA
            </span>
            <h3 className="text-2xl font-display font-bold text-white mt-1">
              Explore Other Srijan Competitions
            </h3>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-[#00daf3] hover:text-white transition-colors"
          >
            <span>View All Competitions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherEvents.map((oe) => {
            const tag = TAG_MAP[oe.id] || `EVENT ${oe.number}`;
            return (
              <Link
                key={oe.id}
                to={`/events/${oe.id}`}
                className="p-5 rounded-xl bg-[#19202a] hover:bg-[#242a34] border border-[#3b494c]/30 hover:border-[#00e5ff]/40 transition-all duration-300 group hover:shadow-[0_4px_20px_rgba(0,229,255,0.12)] hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-mono text-[#ffd799] font-semibold bg-[#0d141d] px-2 py-0.5 rounded border border-[#ffd799]/20">
                    {tag}
                  </span>
                  <span className="text-xs font-mono text-[#bac9cc]">
                    {oe.teamSize}
                  </span>
                </div>
                <h4 className="text-base font-display font-bold text-white group-hover:text-[#00daf3] transition-colors truncate">
                  {oe.name}
                </h4>
                <p className="text-xs text-[#bac9cc] line-clamp-2 mt-1.5 leading-relaxed">
                  {oe.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Brochure Coming Soon Modal */}
      <BrochureModal
        isOpen={Boolean(selectedEventForBrochure)}
        onClose={() => setSelectedEventForBrochure(null)}
        event={selectedEventForBrochure}
      />
    </div>
  );
}
