import React from 'react';
import { Hand } from 'lucide-react';

/**
 * Animated floating pill prompting the user to tap/click an interactive element.
 * Safari-safe: caller handles outer positioning (e.g. left-1/2 -translate-x-1/2)
 * so .tap-nudge-float transforms never conflict with centering transforms.
 */
export default function TapHintPill({ title, subtitle }) {
  return (
    <div className="tap-nudge-float inline-flex items-center gap-2.5 bg-white/95 backdrop-blur-md border border-amber-300/90 shadow-lg rounded-full px-3.5 py-2 text-stone-800 whitespace-nowrap">
      <span className="relative flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 shrink-0">
        <span className="absolute inset-0 rounded-full bg-amber-400/40 tap-ripple-ring" />
        <Hand className="w-4 h-4 tap-finger-press" />
      </span>
      <div className="flex flex-col text-left leading-tight">
        <span className="font-sans text-xs font-bold text-stone-900">
          {title}
        </span>
        {subtitle && (
          <span className="font-sans text-[10px] text-amber-700 font-medium">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
