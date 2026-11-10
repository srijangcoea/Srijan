import React, { useState } from 'react';
import {
  Users,
  Code2,
  ShieldCheck,
  Mail,
  Share2,
  Terminal,
  Headphones,
  Zap,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

// ==============================================================================
// SRIJAN 2026 — OUR TEAM ROSTER DATA
// Easily edit names, roles, descriptions, photos, and links here.
// ==============================================================================

const CONVENORS = [

  {
    name: "Vedant Chaware",
    role: "Convenor",
    badge: "CONVENOR",
    category: "STUDENT LEADERSHIP",
    bio: "Leading the Srijan 2026 mission with technical vision, execution strategy, and symposium-wide orchestration.",
    email: "vedant.chaware@college.edu",
    linkedin: "https://linkedin.com",
    img: "/team/convenor.png",
    fallbackImg: "",
  },
  {
    name: "Gayatri Phale",
    role: "Co-Convenor",
    badge: "CO-CONVENOR",
    category: "STUDENT LEADERSHIP",
    bio: "Driving coordination, event momentum, and student committee logistics across all technical tracks.",
    email: "gayatri.phale@college.edu",
    linkedin: "https://linkedin.com",
    img: "/team/coconvenor.png",
    fallbackImg: "",
  },
];

const DEVELOPERS = [
  {
    name: "Tejas Jalit",
    role: "Developer",
        badge: "DEVELOPER",
    category: "TECH ROSTER",
    bio: "Engineering real-time database architecture, administrative controllers, and event platform security.",
    skills: ["React.js", "APIs", "MongoDB", "Express"],
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "tejas@college.edu",
    img: "/team/Lead.jpeg",
    fallbackImg: "",
    },
    {
        name: "Samrudhi Take",
        role: "Developer",
        badge: "DEVELOPER",
        category: "TECH ROSTER",
        bio: "Architecting the core digital platform, high-performance telemetry interfaces, and secure registration infrastructure.",
        skills: ["Next.js", "TypeScript", "Tailwind CSS"],
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        email: "rohan.kulkarni@college.edu",
        img: "/team/fullstack1.png",
        fallbackImg: "/team/2.png",
    },
];

const CORE_MEMBERS = [
  {
    name: "-----",
    role: "Operations Lead",
    badge: "OPERATIONS",
    category: "CORE DIVISION",
    bio: "Supervising stage production, technical arena scheduling, and competition hall preparedness.",
    linkedin: "https://linkedin.com",
    email: "operations@srijan.org",
  },
  {
      name: "-----",
    role: "Public Relations Lead",
    badge: "PUBLIC RELATIONS",
    category: "CORE DIVISION",
    bio: "Connecting collegiate technical delegations, student chapters, and university outreach networks.",
    linkedin: "https://linkedin.com",
    email: "pr@srijan.org",
  },
  {
      name: "-----",
    role: "Technical Logistics",
    badge: "LOGISTICS",
    category: "CORE DIVISION",
    bio: "Managing testing benches, hardware stations, lab resources, and electronic measuring apparatus.",
    linkedin: "https://linkedin.com",
    email: "logistics@srijan.org",
  },
  {
      name: "-----",
    role: "Registration Coordinator",
    badge: "REGISTRATIONS",
    category: "CORE DIVISION",
    bio: "Managing on-ground delegate accreditation, verification credentials, and participant onboarding.",
    linkedin: "https://linkedin.com",
    email: "registrations@srijan.org",
  },
];

// Helper for image error handling with graceful fallback
function SafeImage({ src, fallback, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallback && imgSrc !== fallback) {
      setImgSrc(fallback);
      setHasError(true);
    } else {
      setHasError(true);
    }
  };

  if (hasError && (!imgSrc || imgSrc === fallback)) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#151c26] to-[#0d141d] text-slate-500 p-6 text-center">
        <Sparkles className="w-10 h-10 text-[#00daf3]/40 mb-2" />
        <span className="font-mono text-xs uppercase tracking-widest text-[#00daf3]/70">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      loading="lazy"
    />
  );
}

export default function Ourteam() {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'convenors' | 'developers' | 'core'

  const handleContactClick = (name, email) => {
    if (email) {
      window.location.href = `mailto:${email}?subject=Inquiry%20regarding%20Srijan%202026`;
    } else {
      toast.success(`Contact request noted for ${name}`);
    }
  };

  return (
    <div className="w-full pt-28 sm:pt-32 pb-24 bg-[#0d141d] bg-circuit-grid min-h-screen text-[#dce3f0]">
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* ==================================================================== */}
        {/* TOP SECTION HEADER                                                  */}
        {/* ==================================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-[#3b494c]/30">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-[#00daf3] tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e5ff] animate-ping" />
              <span> TEAM</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#dce3f0] tracking-tight">
              Our Team
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#bac9cc] max-w-2xl leading-relaxed mt-1">
              Meet the leadership and engineering core driving Srijan 2026. Dedicated minds orchestrating national technical excellence.
            </p>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* FILTER CONTROLS (OPTIONAL QUICK SWITCH)                              */}
        {/* ==================================================================== */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {[
            { id: 'all', label: 'ALL MEMBERS' },
            { id: 'convenors', label: 'CONVENORS' },
            { id: 'developers', label: 'DEVELOPERS' },
            // { id: 'core', label: 'OPERATIONS' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`font-mono text-xs font-semibold uppercase px-4 py-2 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00e5ff]/15 text-[#00e5ff] border-[#00e5ff] shadow-[0_0_14px_rgba(0,229,255,0.25)]'
                    : 'bg-[#151c26] text-[#bac9cc] border-[#3b494c]/30 hover:border-[#00daf3]/50 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ==================================================================== */}
        {/* SECTION 1: CONVENORS                                                 */}
        {/* ==================================================================== */}
        {(activeTab === 'all' || activeTab === 'convenors') && (
          <div className="mb-16 sm:mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-6 h-6 text-[#00daf3]" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#dce3f0]">Convenors</h2>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5 md:gap-6 max-w-3xl mx-auto">
              {CONVENORS.slice(0, 2).map((member) => (
                <div
                  key={member.name}
                  className="group relative bg-[#151c26] card-clip border border-[#ffd799]/40 hover:border-[#ffd799] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,153,0.2)] overflow-hidden flex flex-col"
                >
                  {/* Angled corner accent */}
                  <div className="absolute top-0 right-0 w-5 h-5 sm:w-8 sm:h-8 bg-[#ffd799]/20 pointer-events-none" />

                  {/* Member Photo */}
                  <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden bg-[#0d141d]">
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center gap-1 bg-[#0d141d]/85 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded border border-[#ffd799]/40 text-[#ffd799] font-mono text-[9px] sm:text-xs font-bold tracking-wider shadow-md">
                      <span>★</span> <span>{member.badge}</span>
                    </div>

                    <SafeImage
                      src={member.img}
                      fallback={member.fallbackImg}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#151c26] via-[#151c26]/40 to-transparent" />
                  </div>

                  {/* Details Overlay */}
                  <div className="p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-2 flex-1 justify-between -mt-6 sm:-mt-10 relative z-10 bg-gradient-to-t from-[#151c26] via-[#151c26] to-transparent pt-4 sm:pt-5">
                    <div>
                      <div className="font-mono text-[9px] sm:text-xs text-[#ffd799] tracking-widest uppercase">
                        {member.category}
                      </div>
                      <h3 className="font-display text-sm sm:text-xl md:text-2xl italic uppercase text-[#dce3f0] tracking-wide mt-0.5 sm:mt-1 font-bold line-clamp-1 sm:line-clamp-none">
                        {member.name}
                      </h3>
                      <p className="font-display text-xs sm:text-sm text-[#ffd799] mt-0.5 sm:mt-1 font-medium">
                        {member.role}
                      </p>
                      <p className="font-sans text-[11px] sm:text-xs text-[#bac9cc] mt-1.5 sm:mt-2 leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {member.bio}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t border-[#3b494c]/30 mt-2.5 sm:mt-3">
                      <button
                        type="button"
                        onClick={() => handleContactClick(member.name, member.email)}
                        className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs text-[#c3f5ff] hover:text-[#00daf3] transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#00daf3]" />
                        <span>Contact</span>
                      </button>

                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs text-[#bac9cc] hover:text-white transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Student Leadership (if present) */}
            {CONVENORS.length > 2 && (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6 md:gap-8 max-w-4xl mx-auto mt-6 sm:mt-8">
                {CONVENORS.slice(2).map((member) => (
                  <div
                    key={member.name}
                    className="group relative bg-[#151c26] card-clip border border-[#ffd799]/30 hover:border-[#ffd799] transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,215,153,0.15)] overflow-hidden flex flex-col"
                  >
                    <div className="absolute top-0 right-0 w-5 h-5 sm:w-8 sm:h-8 bg-[#ffd799]/20 pointer-events-none" />

                    <div className="relative w-full h-44 sm:h-72 md:h-80 overflow-hidden bg-[#0d141d]">
                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center gap-1 bg-[#0d141d]/85 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded border border-[#ffd799]/40 text-[#ffd799] font-mono text-[9px] sm:text-xs font-bold tracking-wider">
                        <span>★</span> <span>{member.badge}</span>
                      </div>

                      <SafeImage
                        src={member.img}
                        fallback={member.fallbackImg}
                        alt={member.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#151c26] via-[#151c26]/40 to-transparent" />
                    </div>

                    <div className="p-3 sm:p-6 flex flex-col gap-1.5 sm:gap-2 flex-1 justify-between -mt-6 sm:-mt-10 relative z-10 bg-gradient-to-t from-[#151c26] via-[#151c26] to-transparent pt-4 sm:pt-6">
                      <div>
                        <div className="font-mono text-[9px] sm:text-xs text-[#ffd799] tracking-widest uppercase">
                          {member.category}
                        </div>
                        <h3 className="font-display text-sm sm:text-xl md:text-2xl italic uppercase text-[#dce3f0] tracking-wide mt-0.5 sm:mt-1 font-bold line-clamp-1 sm:line-clamp-none">
                          {member.name}
                        </h3>
                        <p className="font-display text-xs sm:text-sm text-[#ffd799] mt-0.5 sm:mt-1 font-medium">
                          {member.role}
                        </p>
                        <p className="font-sans text-[11px] sm:text-sm text-[#bac9cc] mt-1.5 sm:mt-2 leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                          {member.bio}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-2.5 sm:pt-4 border-t border-[#3b494c]/30 mt-2.5 sm:mt-3">
                        <button
                          type="button"
                          onClick={() => handleContactClick(member.name, member.email)}
                          className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs text-[#c3f5ff] hover:text-[#00daf3] transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#00daf3]" />
                          <span>Contact</span>
                        </button>
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs text-[#bac9cc] hover:text-white transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 2: ENGINEERING & DEVELOPMENT                                */}
        {/* ==================================================================== */}
        {(activeTab === 'all' || activeTab === 'developers') && (
          <div className="mb-16 sm:mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Code2 className="w-6 h-6 text-[#00daf3]" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#dce3f0]">Engineering & Development</h2>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-5 md:gap-6 max-w-3xl mx-auto">
              {DEVELOPERS.map((dev) => (
                <div
                  key={dev.name}
                  className="group relative bg-[#151c26] card-clip border border-[#00e5ff]/40 hover:border-[#00e5ff] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,255,0.22)] overflow-hidden flex flex-col"
                >
                  {/* Top-right cyber block */}
                  <div className="absolute top-0 right-0 w-5 h-5 sm:w-8 sm:h-8 bg-[#00e5ff]/20 pointer-events-none" />

                  {/* Dev Photo */}
                  <div className="relative w-full h-44 sm:h-56 md:h-64 overflow-hidden bg-[#0d141d]">
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center gap-1 bg-[#0d141d]/85 backdrop-blur-md px-2 py-0.5 sm:px-3 sm:py-1 rounded border border-[#00e5ff]/40 text-[#00e5ff] font-mono text-[9px] sm:text-xs font-bold tracking-wider shadow-md">
                      <span>★</span> <span>{dev.badge}</span>
                    </div>

                    <SafeImage
                      src={dev.img}
                      fallback={dev.fallbackImg}
                      alt={dev.name}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#151c26] via-[#151c26]/40 to-transparent" />
                  </div>

                  {/* Dev Content Area */}
                  <div className="p-3 sm:p-5 flex flex-col gap-1.5 sm:gap-2 flex-1 justify-between -mt-6 sm:-mt-10 relative z-10 bg-gradient-to-t from-[#151c26] via-[#151c26] to-transparent pt-4 sm:pt-5">
                    <div>
                      <div className="font-mono text-[9px] sm:text-xs text-[#00daf3] tracking-widest uppercase">
                        {dev.category}
                      </div>
                      <h3 className="font-display text-sm sm:text-xl md:text-2xl italic uppercase text-[#dce3f0] tracking-wide mt-0.5 sm:mt-1 font-bold line-clamp-1 sm:line-clamp-none">
                        {dev.name}
                      </h3>
                      <p className="font-display text-xs sm:text-sm text-[#00daf3] mt-0.5 sm:mt-1 font-medium">
                        {dev.role}
                      </p>
                      <p className="font-sans text-[11px] sm:text-xs text-[#bac9cc] mt-1.5 sm:mt-2 leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {dev.bio}
                      </p>

                      {/* Tech stack chips */}
                      {dev.skills && dev.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 my-2 sm:my-3">
                          {dev.skills.map((skill) => (
                            <span
                              key={skill}
                              className="font-mono text-[9px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded bg-[#19202a] text-[#c3f5ff] border border-[#3b494c]/40 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2.5 sm:pt-3 border-t border-[#3b494c]/30 mt-2.5 sm:mt-3">
                      {dev.github && (
                        <a
                          href={dev.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs text-[#00daf3] hover:text-white transition-colors"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {dev.linkedin && (
                        <a
                          href={dev.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs text-[#bac9cc] hover:text-white transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {dev.email && (
                        <button
                          type="button"
                          onClick={() => handleContactClick(dev.name, dev.email)}
                          className="inline-flex items-center gap-1 font-mono text-[10px] sm:text-xs text-[#bac9cc] hover:text-[#00daf3] transition-colors sm:ml-auto"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Contact</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* SECTION 3: OPERATIONS & CORE COMMITTEE                               */}
        {/* ==================================================================== */}
        {(activeTab === 'all' || activeTab === 'core') && (
          <div className="mb-16 sm:mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Layers className="w-6 h-6 text-[#00daf3]" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#dce3f0]">Operations & Coordination</h2>
              <span className="font-mono text-xs text-[#ffd799] px-2.5 py-1 rounded bg-[#19202a] border border-[#ffd799]/20">
                [SECTION_OPERATIONS]
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {CORE_MEMBERS.map((member) => (
                <div
                  key={member.name}
                  className="bg-[#151c26]/90 rounded-2xl border border-[#3b494c]/30 hover:border-[#00daf3]/50 p-3.5 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="font-mono text-[9px] sm:text-[11px] text-[#ffba38] bg-[#19202a] px-1.5 sm:px-2 py-0.5 rounded border border-[#ffba38]/20 truncate max-w-[85%]">
                        {member.badge}
                      </span>
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00e5ff] shrink-0" />
                    </div>

                    <h4 className="font-display font-bold text-sm sm:text-lg text-white line-clamp-1 sm:line-clamp-none">
                      {member.name}
                    </h4>
                    <p className="font-mono text-[10px] sm:text-xs text-[#00daf3] mt-0.5 truncate">
                      {member.role}
                    </p>
                    <p className="font-sans text-[11px] sm:text-xs text-[#bac9cc] mt-1.5 sm:mt-2.5 leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-none">
                      {member.bio}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 sm:pt-4 border-t border-[#3b494c]/20 mt-2.5 sm:mt-4">
                    <button
                      type="button"
                      onClick={() => handleContactClick(member.name, member.email)}
                      className="font-mono text-[10px] sm:text-xs text-[#00daf3] hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      <span>Contact</span>
                    </button>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white transition-colors p-1"
                      >
                        <Share2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* BOTTOM BANNER / SUPPORT INFO                                         */}
        {/* ==================================================================== */}
        <div className="bg-[#19202a] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#3b494c]/30 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#242a34] flex items-center justify-center text-[#00e5ff] shrink-0 border border-[#3b494c]/40 shadow-inner">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-display font-semibold text-lg text-[#dce3f0]">
                Need assistance or technical support?
              </h4>
              <p className="font-sans text-sm text-[#bac9cc] mt-1">
                Our team is available through the official ETAS helpdesk console.
              </p>
            </div>
          </div>
          <a
            href="mailto:srijan@college.edu?subject=Srijan%202026%20Support%20Request"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-mono text-xs uppercase text-[#00363d] bg-[#00e5ff] shadow-[0_0_16px_rgba(0,229,255,0.4)] hover:bg-[#00daf3] transition-all font-bold tracking-wider shrink-0"
          >
            <Zap className="w-4 h-4 mr-1.5 fill-current" />
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}
