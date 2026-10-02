import React from 'react';
import { THEMES, THEME_KEYS } from '../config/themes';
import { Sparkles, X, Check } from 'lucide-react';

/**
 * Pinterest-inspired Theme Tabs (Horizontal pills for quick switching)
 */
export function ThemeTabs({ activeThemeId, onSelectTheme }) {
  return (
    <div className="w-full flex items-center justify-center py-2 px-2">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-full bg-white/70 backdrop-blur-md border border-stone-200/80 shadow-xs max-w-full overflow-x-auto scrollbar-none">
        {THEME_KEYS.map((key) => {
          const theme = THEMES[key];
          const isActive = activeThemeId === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectTheme(key)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 select-none ${
                isActive
                  ? `${theme.palette.activeTab} scale-[1.02]`
                  : 'bg-transparent hover:bg-stone-100/70 text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="text-sm sm:text-base">{theme.emoji}</span>
              <span className="font-sans whitespace-nowrap">{theme.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Full Welcome / Theme Picker Modal (Pinterest visual cards)
 */
export function ThemeModal({ isOpen, onClose, activeThemeId, onSelectTheme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-5 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Elige tu Ocasión Especial</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            ¿Qué celebramos hoy?
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-sans mt-1">
            Personaliza la experiencia, música, ramo y dedicatoria según el momento que deseas conmemorar.
          </p>
        </div>

        {/* 4 Occasion Cards (Grid 2x2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 font-sans">
          {THEME_KEYS.map((key) => {
            const theme = THEMES[key];
            const isSelected = activeThemeId === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  onSelectTheme(key);
                  onClose();
                }}
                className={`relative text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between group hover:scale-[1.02] active:scale-98 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/60 shadow-md ring-2 ring-amber-300/40'
                    : 'border-stone-200/90 hover:border-amber-300 bg-stone-50/40 hover:bg-amber-50/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl p-2 rounded-2xl bg-white shadow-xs group-hover:scale-110 transition-transform">
                      {theme.emoji}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-2xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>Activo</span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug">
                    {theme.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    {theme.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/70 flex items-center justify-between text-xs font-medium text-stone-600">
                  <span className="text-[11px] text-amber-800 font-semibold">
                    {theme.badgeText.split('·')[0]}
                  </span>
                  <span className="text-amber-700 underline underline-offset-2 text-xs">
                    Seleccionar →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 text-center text-xs text-stone-400 font-sans">
          Puedes cambiar de tema en cualquier momento desde la barra superior 🌻
        </div>
      </div>
    </div>
  );
}
