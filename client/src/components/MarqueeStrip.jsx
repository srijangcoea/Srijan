import React from 'react';
import { 
  Code2, 
  HelpCircle, 
  Cpu, 
  Box, 
  Construction, 
  Zap 
} from 'lucide-react';

/**
 * 6 Official Competitions for Srijan
 */
export const EVENT_LIST = [
  { name: 'Hackathon', icon: Code2, tag: '36H Sprint' },
  { name: 'KBC Quiz', icon: HelpCircle, tag: 'Tech Trivia' },
  { name: 'PCB Designing', icon: Cpu, tag: 'EDA Challenge' },
  { name: 'CAD Modeling', icon: Box, tag: '3D Prototyping' },
  { name: 'Bridge Making', icon: Construction, tag: 'Structural Design' },
  { name: 'Circuit Making', icon: Zap, tag: 'Hardware Hack' },
];

export default function MarqueeStrip() {
  // Duplicate list to achieve infinite seamless loop
  const marqueeItems = [...EVENT_LIST, ...EVENT_LIST, ...EVENT_LIST];

  return (
    <div 
      className="relative w-full overflow-hidden border-y border-[#00E5FF]/20 bg-[#091528]/80 backdrop-blur-md py-3.5 select-none"
      aria-label="Official competitions marquee"
    >
      {/* Side Vignette Fades */}
      <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-[#050B14] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-[#050B14] to-transparent z-10 pointer-events-none" />

      {/* Marquee Track */}
      <div className="flex items-center gap-8 whitespace-nowrap srijan-marquee hover:[animation-play-state:paused]">
        {marqueeItems.map((event, index) => {
          const Icon = event.icon;
          return (
            <div
              key={index}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#050B14]/80 border border-[#00E5FF]/20 text-[#E2E8F0] hover:border-[#00E5FF] hover:text-[#00E5FF] transition-all cursor-default group"
            >
              <div className="w-6 h-6 rounded-full bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
                <Icon className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-xs sm:text-sm tracking-wide">
                {event.name}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFB300]/10 text-[#FFB300] border border-[#FFB300]/20">
                {event.tag}
              </span>
              <span className="text-[#00E5FF]/40 text-xs ml-1">•</span>
            </div>
          );
        })}
      </div>

      {/* CSS Animation for smooth infinite scrolling */}
      <style>{`
        @keyframes srijanMarqueeKeyframes {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .srijan-marquee {
          display: flex;
          width: max-content;
          animation: srijanMarqueeKeyframes 30s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .srijan-marquee {
            animation: none;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}
