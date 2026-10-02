import React from 'react';
import { Sparkles, Mail, ArrowDown, Palette } from 'lucide-react';
import { ThemeTabs } from './ThemeSelector';

export default function Hero({
  theme,
  recipientName,
  onOpenPersonalizer,
  onOpenBrag,
  onOpenThemeModal,
  onSelectTheme
}) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCenterpieceButtonLabel = () => {
    if (theme.id === 'cumpleanos') return '🎂 Ver Pastel & Velas';
    if (theme.id === 'logro-profesional') return '🏆 Ver Homenaje & Triunfo';
    if (theme.id === 'aniversario') return '🌹 Ver Ramo de Amor';
    return '🌻 Ver mi Ramo Floral';
  };

  return (
    <header className="relative pt-6 pb-8 sm:pt-14 sm:pb-12 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
      {/* 1. Pinterest Quick Theme Switcher Pills */}
      <div className="mb-4 w-full flex flex-col items-center">
        <ThemeTabs activeThemeId={theme.id} onSelectTheme={onSelectTheme} />
      </div>

      {/* 2. Occasion Badge */}
      <button
        onClick={onOpenThemeModal}
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-sans font-semibold tracking-wide uppercase shadow-xs mb-5 transition-transform hover:scale-105 active:scale-95 ${theme.palette.heroTagBg}`}
        title="Haz clic para cambiar de temática"
      >
        <span className="text-base">{theme.badgeIcon}</span>
        <span>{theme.badgeText}</span>
        <Palette className="w-3.5 h-3.5 opacity-70 ml-0.5" />
      </button>

      {/* 3. Main Dynamic Hero Headline */}
      <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-800 font-bold tracking-tight leading-tight max-w-3xl">
        {theme.headlinePrefix}{' '}
        <span className={`relative inline-block ${theme.palette.accentColor} underline decoration-amber-300 decoration-wavy underline-offset-8`}>
          {theme.headlineHighlight}
        </span>{' '}
        {theme.headlineSuffix}
      </h1>

      {/* 4. Dedicated to Recipient */}
      <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
        <span className="font-serif italic text-stone-500 text-base sm:text-xl">
          Especialmente para:
        </span>
        <span
          className="text-2xl sm:text-4xl text-amber-950 font-bold tracking-wide"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          {recipientName} {theme.emoji}
        </span>
      </div>

      {/* 5. Subtitle */}
      <p className="mt-4 text-sm sm:text-lg md:text-xl text-stone-600 font-serif max-w-2xl leading-relaxed">
        {theme.subtitle}
      </p>

      {/* 6. Action CTAs */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 font-sans">
        <button
          onClick={() => scrollToSection('centro')}
          className={`inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 ${theme.palette.buttonBg}`}
        >
          <span>{getCenterpieceButtonLabel()}</span>
          <ArrowDown className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenBrag}
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-rose-600 hover:from-amber-600 hover:via-pink-600 hover:to-rose-700 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          title="Presumir este momento en TikTok e Instagram"
        >
          <Sparkles className="w-4 h-4 text-yellow-200" />
          <span>Presumir</span>
        </button>

        <button
          onClick={() => scrollToSection('carta')}
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 font-medium text-sm sm:text-base shadow-xs hover:shadow hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Mail className="w-4 h-4 text-amber-700" />
          <span>Carta Secreta</span>
        </button>

        <button
          onClick={onOpenPersonalizer}
          className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-3 rounded-full bg-amber-100/90 hover:bg-amber-200 text-amber-950 border border-amber-300 font-medium text-xs sm:text-sm shadow-xs hover:shadow hover:scale-105 active:scale-95 transition-all duration-200"
          title="Personalizar nombres, mensaje u ocasión"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Personalizar</span>
        </button>
      </div>
    </header>
  );
}
