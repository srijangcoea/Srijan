import React from 'react';
import { events } from '../data/events';
import RegistrationForm from '../components/RegistrationForm';

/**
 * Registration Page
 * Mounts the Cyber-Command Common Registration Portal.
 */
export default function Registration() {
  return (
    <div className="pt-24 sm:pt-28 pb-20 min-h-screen bg-[#030a14] selection:bg-[#22e5ff]/25 selection:text-[#22e5ff] relative overflow-hidden">
      {/* Background Ambient Grid & Radial Lighting */}
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
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#22e5ff]/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-[#ffb400]/8 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <RegistrationForm eventsList={events} />
      </div>
    </div>
  );
}