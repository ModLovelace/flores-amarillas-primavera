import React from 'react';
import { ArrowDown } from 'lucide-react';

/**
 * Full-width section CTA / scroll guide banner.
 * Shared across Hero centerpiece scroll, Secret Letter scroll, and final Brag CTA.
 */
export default function ActionBanner({
  onClick,
  emoji,
  LeadingIcon,
  title,
  subtitle,
  TrailingIcon = ArrowDown,
  animateTrailing = true,
  className = '',
  chipClassName = 'bg-white/25',
  dataBanner,
  titleAttr,
}) {
  return (
    <button
      type="button"
      data-banner={dataBanner}
      onClick={onClick}
      title={titleAttr || title}
      className={`group w-full flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-sans shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer text-left ${className}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <span
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl backdrop-blur-xs flex items-center justify-center text-2xl shrink-0 transition-transform duration-200 group-hover:scale-110 ${chipClassName}`}
          aria-hidden="true"
        >
          {LeadingIcon ? <LeadingIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : emoji}
        </span>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-base sm:text-lg leading-snug truncate">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs sm:text-sm opacity-90 leading-snug">
              {subtitle}
            </span>
          )}
        </div>
      </div>

      <span
        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full backdrop-blur-xs flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-y-0.5 ${chipClassName}`}
        aria-hidden="true"
      >
        <TrailingIcon className={`w-5 h-5 ${animateTrailing ? 'arrow-guide-bounce' : ''}`} />
      </span>
    </button>
  );
}
