import React from 'react';

/**
 * EventCardSkeleton Component
 * Matches the enhanced EventCard layout to prevent Layout Shift (CLS).
 */
export default function EventCardSkeleton() {
  return (
    <div
      className="relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#151c26] via-[#121922] to-[#0c1219] border border-white/5 p-4 sm:p-6 h-full min-h-[340px] animate-pulse"
      aria-hidden="true"
    >
      {/* Top Body Skeleton */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Row 1: Icon + Category + Number */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 shrink-0" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-24 bg-white/10 rounded" />
              <div className="h-2.5 w-16 bg-white/5 rounded" />
            </div>
          </div>
          <div className="h-6 w-8 bg-white/10 rounded-lg" />
        </div>

        {/* Row 2: Title */}
        <div className="h-7 w-3/4 bg-white/10 rounded mt-1" />

        {/* Row 3: Description */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-white/5 rounded" />
          <div className="h-3 w-5/6 bg-white/5 rounded" />
        </div>

        {/* Row 4: Chips */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <div className="h-5 w-20 bg-white/5 rounded" />
          <div className="h-5 w-24 bg-white/5 rounded" />
        </div>
      </div>

      {/* Bottom Skeleton: Prize Box + Buttons */}
      <div className="flex flex-col gap-3 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/5">
        <div className="h-11 w-full bg-white/10 rounded-xl" />
        <div className="flex items-center gap-2 w-full">
          <div className="h-9 w-1/3 sm:w-20 bg-white/5 rounded-xl" />
          <div className="h-9 flex-1 bg-[#22e5ff]/20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
