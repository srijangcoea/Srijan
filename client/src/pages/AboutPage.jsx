import React from 'react';
import AboutSection from '../components/AboutSection';
import CTASection from '../components/CTASection';
import PageTransition from '../components/PageTransition';

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="pt-24 sm:pt-28 pb-16 min-h-screen bg-[#030a14] selection:bg-[#22e5ff]/25 selection:text-[#22e5ff]">
        <AboutSection />
        <CTASection />
      </div>
    </PageTransition>
  );
}
