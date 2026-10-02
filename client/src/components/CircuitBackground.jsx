import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Cpu, Cog, Box, Construction } from 'lucide-react';

/**
 * CircuitBackground Component
 * Renders an engineering blueprint grid with glowing PCB circuit traces
 * and floating engineering icons (Gear, Chip, Bridge, Cube).
 */
export default function CircuitBackground() {
  const shouldReduceMotion = useReducedMotion();

  // Floating engineering icons configuration
  const floatingIcons = [
    { Icon: Cpu, top: '16%', left: '8%', delay: 0, duration: 8, label: 'Microchip' },
    { Icon: Cog, top: '22%', right: '10%', delay: 1.5, duration: 9, label: 'Gear' },
    { Icon: Construction, bottom: '22%', left: '12%', delay: 1, duration: 10, label: 'Bridge Engineering' },
    { Icon: Box, bottom: '20%', right: '14%', delay: 2, duration: 8.5, label: 'CAD Cube' },
  ];

  return (
    <div 
      className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0" 
      aria-hidden="true"
    >
      {/* 1. Deep Space Navy Background Base */}
      <div className="absolute inset-0 bg-[#050B14]" />

      {/* 2. Blueprint Grid Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Small 24px grid */}
          <pattern id="smallGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="0.5"
              strokeOpacity="0.25"
            />
          </pattern>
          {/* Major 120px grid */}
          <pattern id="majorGrid" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#smallGrid)" />
            <path
              d="M 120 0 L 0 0 0 120"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#majorGrid)" />
      </svg>

      {/* 3. Ambient Radial Lighting Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#00E5FF]/10 blur-[130px] rounded-full" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-[#FFB300]/8 blur-[140px] rounded-full" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-[#00E5FF]/8 blur-[140px] rounded-full" />

      {/* 4. SVG Animated PCB Circuit Traces */}
      <svg
        className="absolute inset-0 w-full h-full opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Static PCB Trace Lines */}
        <g stroke="#00E5FF" strokeWidth="1.2" fill="none" strokeOpacity="0.25">
          {/* Top Left Circuit Line */}
          <path d="M 0 120 L 160 120 L 220 180 L 380 180" />
          <circle cx="380" cy="180" r="3.5" fill="#00E5FF" fillOpacity="0.5" />

          {/* Top Right Circuit Line */}
          <path d="M 1440 90 L 1260 90 L 1180 170 L 1020 170" />
          <circle cx="1020" cy="170" r="3.5" fill="#FFB300" fillOpacity="0.5" />

          {/* Bottom Left Circuit Line */}
          <path d="M 0 650 L 190 650 L 270 570 L 420 570" />
          <circle cx="420" cy="570" r="3.5" fill="#00E5FF" fillOpacity="0.5" />

          {/* Bottom Right Circuit Line */}
          <path d="M 1440 680 L 1280 680 L 1200 600 L 980 600" />
          <circle cx="980" cy="600" r="3.5" fill="#FFB300" fillOpacity="0.5" />
        </g>

        {/* Animated Traveling Pulses */}
        {!shouldReduceMotion && (
          <g>
            {/* Pulse 1: Top Left */}
            <circle r="3.5" fill="#00E5FF" filter="url(#glowEffect)">
              <animateMotion
                path="M 0 120 L 160 120 L 220 180 L 380 180"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Pulse 2: Top Right */}
            <circle r="3" fill="#FFB300" filter="url(#glowEffect)">
              <animateMotion
                path="M 1440 90 L 1260 90 L 1180 170 L 1020 170"
                dur="6.5s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Pulse 3: Bottom Left */}
            <circle r="3" fill="#00E5FF" filter="url(#glowEffect)">
              <animateMotion
                path="M 0 650 L 190 650 L 270 570 L 420 570"
                dur="7s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </svg>

      {/* 5. Floating Engineering Symbols */}
      {!shouldReduceMotion && (
        <div className="hidden lg:block">
          {floatingIcons.map(({ Icon, top, left, right, bottom, delay, duration, label }, idx) => (
            <motion.div
              key={idx}
              role="img"
              aria-label={label}
              style={{ top, left, right, bottom }}
              animate={{
                y: [0, -14, 0],
                rotate: [0, 8, -8, 0],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute p-3 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-[#00E5FF]/70 shadow-[0_0_15px_rgba(0,229,255,0.1)] backdrop-blur-[2px]"
            >
              <Icon className="w-6 h-6" />
            </motion.div>
          ))}
        </div>
      )}

      {/* 6. Subtle Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050B14]/40 to-[#050B14]" />
    </div>
  );
}
