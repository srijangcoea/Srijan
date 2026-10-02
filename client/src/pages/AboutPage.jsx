import React from 'react';
import AboutSection from '../components/AboutSection';
import CTASection from '../components/CTASection';

/**
 * AboutPage
 * Dedicated route for /about displaying the Cybernetic Telemetry
 * About Srijan engineering framework and symposium chronicle.
 */
export default function AboutPage() {
  return (
    <div className="pt-24 sm:pt-28 pb-16 min-h-screen bg-[#030a14] selection:bg-[#22e5ff]/25 selection:text-[#22e5ff]">
      {/* Central About Section matching the exact design specification */}
      <AboutSection />

      {/* Conversion / Challenge Selector Section */}
      <div className="mt-12">
        <CTASection />
      </div>
    </div>
  );
}
