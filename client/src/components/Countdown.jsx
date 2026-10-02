import React, { useState, useEffect } from 'react';
import { Calendar, BellRing, CheckCircle2 } from 'lucide-react';

/**
 * Countdown Component
 * Shows a "Dates to be announced" pill with a reminder toggle,
 * or switches to a live countdown when a targetDate string is provided.
 */
export default function Countdown({ targetDate = null }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  // Mode 1: Dates to be announced (Default State)
  if (!targetDate) {
    return (
      <div className="inline-flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 p-2 sm:pr-4 rounded-2xl bg-[#091528]/80 border border-[#00E5FF]/20 backdrop-blur-md shadow-[0_0_25px_rgba(0,229,255,0.08)]">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-mono font-medium tracking-wide">
          <Calendar className="w-4 h-4 text-[#00E5FF]" />
          <span>SCHEDULE: DATES TO BE ANNOUNCED</span>
        </div>

        <button
          type="button"
          onClick={() => setNotified(true)}
          className="inline-flex items-center gap-1.5 text-xs text-[#E2E8F0] hover:text-[#00E5FF] transition-colors py-1 px-2 font-mono group"
        >
          {notified ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Reminder Set!</span>
            </>
          ) : (
            <>
              <BellRing className="w-3.5 h-3.5 text-[#FFB300] group-hover:rotate-12 transition-transform" />
              <span>Notify Me on Release</span>
            </>
          )}
        </button>
      </div>
    );
  }

  // Mode 2: Live Active Countdown
  const timeBlocks = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINS', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-2xl bg-[#091528]/90 border border-[#00E5FF]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.15)]">
      {timeBlocks.map((block, idx) => (
        <div key={idx} className="flex items-center">
          <div className="flex flex-col items-center px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#050B14] border border-[#00E5FF]/15 min-w-[54px] sm:min-w-[62px]">
            <span className="text-base sm:text-lg font-mono font-bold text-[#00E5FF]">
              {block.value}
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#94A3B8]">
              {block.label}
            </span>
          </div>
          {idx < timeBlocks.length - 1 && (
            <span className="text-[#00E5FF]/40 font-mono font-bold mx-1 sm:mx-1.5">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
