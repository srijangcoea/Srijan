import React from 'react';
import Hero from '../components/Hero';
import EventGrid from '../components/EventGrid';
import CTASection from '../components/CTASection';
import EngineeringTimeline from '../components/EngineeringTimeline';
import Reveal from '../components/Reveal';
import PageTransition from '../components/PageTransition';
import { useCms } from '../contexts/CmsContext';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, HelpCircle, Award } from 'lucide-react';

export default function Home() {
  const { events, cms, resolveAssetUrl } = useCms();
  const prizesData = cms?.prizes;
  const faqData = cms?.faq;
  const sponsorsData = cms?.sponsors;

  return (
    <PageTransition>
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

      {/* 4. Dynamic CMS Prizes, FAQ & Sponsors (when published) */}
      {prizesData && Array.isArray(prizesData.items) && prizesData.items.filter((p) => p.visible !== false).length > 0 && (
        <section className="py-14 px-6 lg:px-12 border-t border-[#3b494c]/20 content-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#ffd799] uppercase tracking-widest">// PRIZES_AND_REWARDS</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-[#ffd799]" />
                  <span>{prizesData.sectionTitle || 'Prizes & Bounties'}</span>
                </h2>
              </div>
              {prizesData.totalPool && (
                <span className="font-mono text-sm sm:text-lg font-bold text-[#ffd799] bg-[#ffd799]/10 px-4 py-1.5 rounded-xl border border-[#ffd799]/30">
                  {prizesData.totalPool}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {prizesData.items.filter((p) => p.visible !== false).map((p, idx) => (
                <div key={p.id || idx} className="p-4 sm:p-5 rounded-2xl bg-[#151c26]/90 border border-[#ffd799]/25 space-y-1.5">
                  <div className="font-mono text-[10px] text-[#00daf3] uppercase">{p.position}</div>
                  <div className="font-display font-bold text-base sm:text-lg text-white">{p.eventName}</div>
                  <div className="font-display font-black text-xl sm:text-2xl text-[#ffd799]">{p.amount}</div>
                  <div className="text-xs text-[#bac9cc]">{p.reward}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqData && Array.isArray(faqData.items) && faqData.items.filter((f) => f.visible !== false).length > 0 && (
        <section className="py-14 px-6 lg:px-12 border-t border-[#3b494c]/20 bg-[#080f18]/50 content-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <span className="font-mono text-xs text-[#00daf3] uppercase tracking-widest">// KNOWLEDGE_BASE</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-[#00daf3]" />
                <span>{faqData.sectionTitle || 'Frequently Asked Questions'}</span>
              </h2>
            </div>
            <div className="space-y-3">
              {faqData.items.filter((f) => f.visible !== false).map((f, idx) => (
                <div key={f.id || idx} className="p-4 sm:p-5 rounded-xl bg-[#151c26] border border-[#3b494c]/35">
                  <h3 className="font-display font-bold text-sm sm:text-base text-white">{f.question}</h3>
                  <p className="font-sans text-xs sm:text-sm text-[#bac9cc] mt-1.5 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {sponsorsData && Array.isArray(sponsorsData.items) && sponsorsData.items.filter((s) => s.visible !== false).length > 0 && (
        <section className="py-12 px-6 lg:px-12 border-t border-[#3b494c]/20 content-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <span className="font-mono text-xs text-[#00daf3] uppercase tracking-widest">// PARTNERS_AND_SPONSORS</span>
              <h2 className="font-display text-2xl font-bold text-white mt-1 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#00daf3]" />
                <span>{sponsorsData.sectionTitle || 'Sponsors & Partners'}</span>
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {sponsorsData.items.filter((s) => s.visible !== false).map((s, idx) => (
                <a
                  key={s.id || idx}
                  href={s.website || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#151c26] border border-[#00e5ff]/25 hover:border-[#00e5ff] flex items-center gap-3 transition-colors"
                >
                  {s.logo && <img src={resolveAssetUrl(s.logo)} alt={s.name} className="w-8 h-8 object-contain rounded" />}
                  <div>
                    <div className="font-display font-bold text-sm text-white">{s.name}</div>
                    <div className="font-mono text-[10px] text-[#00daf3] uppercase">{s.category}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Ready to Create CTA */}
      <div className="content-auto">
        <CTASection />
      </div>
    </div>
    </PageTransition>
  );
}
