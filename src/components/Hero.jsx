import React from 'react';
import ActionBanner from './ActionBanner';

function getCenterpieceBannerMeta(themeId) {
  switch (themeId) {
    case 'cumpleanos':
      return {
        emoji: '🎂',
        title: 'Ver Pastel & Velas',
        subtitle: 'Baja para encender las velas y pedir tu deseo',
      };
    case 'logro-profesional':
      return {
        emoji: '🏆',
        title: 'Ver Homenaje & Triunfo',
        subtitle: 'Baja para celebrar tu esfuerzo y brindar por tu éxito',
      };
    case 'aniversario':
      return {
        emoji: '🌹',
        title: 'Ver Ramo de Amor',
        subtitle: 'Baja para iluminar nuestras rosas eternas',
      };
    case 'flores-amarillas':
    default:
      return {
        emoji: '🌻',
        title: 'Ver mi Ramo Floral',
        subtitle: 'Baja para regar y hacer florecer tu ramo',
      };
  }
}

export default function Hero({ theme, recipientName }) {
  const scrollToCenterpiece = () => {
    const el = document.getElementById('centro');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const bannerMeta = getCenterpieceBannerMeta(theme.id);

  return (
    <header className="relative pt-6 pb-4 sm:pt-12 sm:pb-6 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
      {/* 1. Occasion Badge (no editable para el destinatario) */}
      <div
        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-sans font-semibold tracking-wide uppercase shadow-xs mb-5 select-none ${theme.palette.heroTagBg}`}
      >
        <span className="text-base">{theme.badgeIcon}</span>
        <span>{theme.badgeText}</span>
      </div>

      {/* 2. Main Dynamic Hero Headline */}
      <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-stone-800 font-bold tracking-tight leading-tight max-w-3xl">
        {theme.headlinePrefix}{' '}
        <span className={`relative inline-block ${theme.palette.accentColor} underline decoration-amber-300 decoration-wavy underline-offset-8`}>
          {theme.headlineHighlight}
        </span>{' '}
        {theme.headlineSuffix}
      </h1>

      {/* 3. Dedicated to Recipient */}
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

      {/* 4. Primera Dedicatoria */}
      <p className="mt-4 text-sm sm:text-lg md:text-xl text-stone-600 font-serif max-w-2xl leading-relaxed">
        {theme.subtitle}
      </p>

      {/* 5. Full-width CTA Banner pointing down to Cake / Centerpiece */}
      <div className="mt-8 w-full">
        <ActionBanner
          dataBanner="centro"
          onClick={scrollToCenterpiece}
          emoji={bannerMeta.emoji}
          title={bannerMeta.title}
          subtitle={bannerMeta.subtitle}
          className={theme.palette.buttonBg}
          chipClassName={theme.id === 'flores-amarillas' ? 'bg-white/45 text-stone-900' : 'bg-white/20 text-white'}
        />
      </div>
    </header>
  );
}
