import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function Watermark() {
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  return (
    <aside
      aria-label="Configurar tu propio regalo"
      className="fixed bottom-[88px] right-3 sm:bottom-5 sm:left-6 sm:right-auto z-40 pointer-events-none select-none w-fit"
    >
      <div className="pointer-events-auto w-fit backdrop-blur-md bg-white/95 hover:bg-amber-50/70 text-stone-700 border border-stone-300/80 hover:border-amber-400/60 shadow-xl rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 inline-flex items-center gap-2 text-[11px] font-mono transition-all duration-200 opacity-90 hover:opacity-100 group">
        {/* Enlace al Configurador Oficial */}
        <a
          href="https://regalaflores.modlovelace.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 transition-colors"
          title="Configura tu propio regalo en regalaflores.modlovelace.com"
        >
          <div className="w-4 h-4 rounded-full bg-amber-500/15 border border-amber-400/50 flex items-center justify-center text-amber-600 shrink-0">
            <Sparkles className="w-2.5 h-2.5" />
          </div>

          {!isMinimized ? (
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-stone-500">Hecho por</span>
              <span className="font-bold text-stone-900 group-hover:text-amber-600 transition-colors">
                ModLovelace
              </span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-800 font-medium flex items-center group-hover:text-amber-700">
                regalaflores.modlovelace.com
                <ArrowUpRight className="w-3 h-3 ml-0.5 text-stone-400 group-hover:text-amber-600" />
              </span>
            </div>
          ) : (
            <span className="font-bold text-stone-900 group-hover:text-amber-600 transition-colors text-[10px]">
              regalaflores.modlovelace.com ↗
            </span>
          )}
        </a>

        {/* Botón para minimizar/expandir */}
        <button
          type="button"
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-0.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          title={isMinimized ? 'Expandir créditos' : 'Minimizar créditos'}
          aria-label={isMinimized ? 'Expandir sello de autor' : 'Minimizar sello de autor'}
        >
          {isMinimized ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>
    </aside>
  );
}
