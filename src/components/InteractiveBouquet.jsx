import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Droplets } from 'lucide-react';
import { switchMovieStageMusic } from '../utils/audioChimes';
import {
  SunflowerBouquetSVG,
  BirthdayCakeSVG,
  TrophyLaurelSVG,
  RosesBouquetSVG
} from './Centerpieces';

// Caché de formas temáticas para reutilizar instancias de canvas-confetti y alto rendimiento
const THEMATIC_SHAPES_CACHE = new Map();

function getThematicShapes(themeId) {
  if (THEMATIC_SHAPES_CACHE.has(themeId)) {
    return THEMATIC_SHAPES_CACHE.get(themeId);
  }

  const shapes = [];
  try {
    if (typeof confetti.shapeFromText === 'function') {
      if (themeId === 'cumpleanos') {
        shapes.push(
          'square',
          'circle',
          confetti.shapeFromText({ text: '🎉', scalar: 1.8 }),
          confetti.shapeFromText({ text: '🎂', scalar: 1.8 }),
          confetti.shapeFromText({ text: '✨', scalar: 1.4 })
        );
      } else if (themeId === 'flores-amarillas') {
        shapes.push(
          'circle',
          confetti.shapeFromText({ text: '🌻', scalar: 2.0 }),
          confetti.shapeFromText({ text: '🌼', scalar: 1.8 }),
          confetti.shapeFromText({ text: '✨', scalar: 1.4 })
        );
      } else if (themeId === 'logro-profesional') {
        shapes.push(
          'circle',
          confetti.shapeFromText({ text: '🎓', scalar: 2.0 }),
          confetti.shapeFromText({ text: '⭐', scalar: 1.8 }),
          confetti.shapeFromText({ text: '🏆', scalar: 2.0 }),
          confetti.shapeFromText({ text: '✨', scalar: 1.4 })
        );
      } else if (themeId === 'aniversario') {
        shapes.push(
          'circle',
          confetti.shapeFromText({ text: '💖', scalar: 2.0 }),
          confetti.shapeFromText({ text: '❤️', scalar: 1.8 }),
          confetti.shapeFromText({ text: '🌹', scalar: 2.0 }),
          confetti.shapeFromText({ text: '✨', scalar: 1.4 })
        );
      }
    }
  } catch (err) {
    // Si OffscreenCanvas no está soportado en algún navegador, degradación suave
  }

  if (shapes.length === 0) {
    shapes.push('circle', 'square');
  }

  THEMATIC_SHAPES_CACHE.set(themeId, shapes);
  return shapes;
}

export default function InteractiveBouquet({
  recipientName,
  theme,
  bloomStage: externalBloomStage,
  onStageChange,
  onOpenBrag,
}) {
  const [internalBloomStage, setInternalBloomStage] = useState(1);
  const bloomStage = externalBloomStage !== undefined ? externalBloomStage : internalBloomStage;
  const setBloomStage = (val) => {
    setInternalBloomStage(val);
    if (onStageChange) onStageChange(val);
  };

  const [bloomCount, setBloomCount] = useState(0);
  const [activeNote, setActiveNote] = useState(null);
  const noteTimeoutRef = useRef(null);
  const [showWaterSplash, setShowWaterSplash] = useState(false);
  const [showRippleWave, setShowRippleWave] = useState(false);
  const [isBloomingAnimation, setIsBloomingAnimation] = useState(false);

  const canvasRef = useRef(null);
  const cannonRef = useRef(null);
  const prevThemeIdRef = useRef(theme.id);

  useEffect(() => {
    return () => {
      if (noteTimeoutRef.current) {
        clearTimeout(noteTimeoutRef.current);
      }
      if (cannonRef.current) {
        cannonRef.current.reset();
        cannonRef.current = null;
      }
    };
  }, []);

  // Ráfaga de partículas confinada estrictamente al canvas local de la pieza central
  const fireThematicParticles = useCallback((themeId, stage = 1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        if (canvas.width !== rect.width || canvas.height !== rect.height) {
          canvas.width = rect.width;
          canvas.height = rect.height;
        }
      }

      if (!cannonRef.current) {
        cannonRef.current = confetti.create(canvas, {
          resize: true,
          useWorker: false,
        });
      }

      const shapes = getThematicShapes(themeId);
      const colors = theme.palette.particleColors || ['#FDE047', '#FACC15', '#FB7185'];

      cannonRef.current({
        particleCount: themeId === 'cumpleanos' ? 44 : 36,
        spread: themeId === 'cumpleanos' ? 68 : 58,
        startVelocity: themeId === 'cumpleanos' ? 32 : 28,
        origin: { x: 0.5, y: 0.72 },
        colors,
        shapes,
        gravity: themeId === 'cumpleanos' ? 0.95 : 0.8,
        ticks: 125,
        disableForReducedMotion: true,
      });
    } catch (err) {
      // safe fallback
    }
  }, [theme.palette.particleColors]);

  // Si cambia la temática desde las pestañas, emitir una ráfaga suave de bienvenida en la pieza central
  useEffect(() => {
    if (prevThemeIdRef.current !== theme.id) {
      prevThemeIdRef.current = theme.id;
      const t = setTimeout(() => {
        fireThematicParticles(theme.id, bloomStage);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [theme.id, bloomStage, fireThematicParticles]);

  const triggerBloom = () => {
    setShowRippleWave(true);
    setTimeout(() => setShowRippleWave(false), 900);

    setShowWaterSplash(true);
    setTimeout(() => setShowWaterSplash(false), 1150);

    const nextStage = bloomStage >= 4 ? 2 : bloomStage + 1;
    setBloomStage(nextStage);
    setBloomCount((prev) => prev + 1);
    setIsBloomingAnimation(true);
    setTimeout(() => setIsBloomingAnimation(false), 1350);

    // Switch melody for the active theme
    switchMovieStageMusic(nextStage, theme.id);

    // Disparo festivo temático confinado estrictamente al espacio de la flor / torta / trofeo / rosas
    fireThematicParticles(theme.id, nextStage);

    // Occasion pop-up note
    const randomQuote = theme.quotes[Math.floor(Math.random() * theme.quotes.length)].quote;
    setActiveNote(randomQuote);
    if (noteTimeoutRef.current) clearTimeout(noteTimeoutRef.current);
    noteTimeoutRef.current = setTimeout(() => {
      setActiveNote(null);
    }, 4500);
  };

  const currentStageInfo = theme.stageNames[bloomStage - 1] || theme.stageNames[0];
  const currentQuoteInfo = theme.quotes[bloomStage - 1] || theme.quotes[0];

  return (
    <div id="centro" className="relative flex flex-col items-center justify-center py-6 px-4 max-w-4xl mx-auto">
      {/* Background Glow */}
      <div
        className={`absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full blur-3xl -z-10 pointer-events-none transition-all duration-1000 ${
          theme.palette.bgGradient
        } ${bloomStage >= 3 ? 'scale-125 opacity-70 animate-pulse' : 'scale-100 opacity-50'}`}
      />

      {/* Header Tag */}
      <div className={`inline-flex items-center justify-center text-center gap-1.5 sm:gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-sans tracking-wide uppercase font-semibold shadow-xs mb-3 max-w-full flex-wrap ${theme.palette.heroTagBg}`}>
        <span className="text-base">{theme.badgeIcon}</span>
        <span>{theme.categoryBadge}</span>
        <span className="hidden sm:inline opacity-60">·</span>
        <span className="font-bold">{theme.name}</span>
      </div>

      {/* Stage Indicator Pill */}
      <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 mb-3 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-2xl sm:rounded-full border border-stone-200 text-xs text-stone-800 font-sans shadow-xs text-center">
        <div className="flex items-center gap-1.5 font-bold text-stone-900">
          <span className={`w-2 h-2 rounded-full ${theme.palette.accentBg} animate-ping`} />
          <span>Fase {bloomStage}:</span>
          <span>{currentStageInfo.name}</span>
        </div>
        <span className="hidden sm:inline text-stone-300">|</span>
        <span className="text-stone-500 italic">{currentStageInfo.desc}</span>
      </div>

      {/* Dynamic Stage Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mb-4 text-[11px] font-sans">
        {theme.stageNames.map((st, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full border transition-all duration-300 ${
              i + 1 <= bloomStage
                ? 'bg-amber-100 text-amber-950 border-amber-400 font-semibold shadow-xs scale-105'
                : 'bg-stone-100/60 text-stone-400 border-stone-200 opacity-60'
            }`}
          >
            {st.name.split('&')[0]}
          </span>
        ))}
      </div>

      {/* The Centerpiece SVG Container con Canvas de partículas confinado */}
      <div
        onClick={triggerBloom}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') triggerBloom();
        }}
        title="Toca para interactuar y florecer"
        className="relative w-full max-w-[340px] sm:max-w-[440px] h-[390px] sm:h-[460px] flex items-center justify-center transition-all duration-700 cursor-pointer overflow-hidden rounded-3xl select-none group"
      >
        {/* Canvas de partículas temáticas confinado estrictamente a la pieza central */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
        />
        
        {/* Render Centerpiece according to theme */}
        <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          {theme.id === 'cumpleanos' ? (
            <BirthdayCakeSVG bloomStage={bloomStage} />
          ) : theme.id === 'logro-profesional' ? (
            <TrophyLaurelSVG bloomStage={bloomStage} />
          ) : theme.id === 'aniversario' ? (
            <RosesBouquetSVG bloomStage={bloomStage} />
          ) : (
            <SunflowerBouquetSVG bloomStage={bloomStage} />
          )}
        </div>

        {/* Floating pop-up love note */}
        {activeNote && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-amber-300 text-stone-800 text-xs sm:text-sm font-serif italic text-center max-w-[85vw] sm:max-w-xs animate-in zoom-in-95 duration-200 pointer-events-none">
            {activeNote}
          </div>
        )}
      </div>

      {/* Occasion Quote Box */}
      <div className="mt-4 max-w-xl w-full text-center px-4 py-3 bg-white/70 backdrop-blur-sm rounded-2xl border border-stone-200/80 shadow-xs">
        <p className="font-serif italic text-sm sm:text-base text-stone-700 leading-relaxed">
          {currentQuoteInfo.quote}
        </p>
        <span className="block mt-1 text-[11px] font-sans font-semibold text-stone-400">
          {currentQuoteInfo.author}
        </span>
      </div>

      {/* Action Button & Ripple */}
      <div className="mt-6 flex flex-col items-center gap-3 z-10 relative">
        {showRippleWave && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-14 rounded-full border-2 border-amber-400 animate-forcefield-wave pointer-events-none" />
        )}

        <button
          onClick={triggerBloom}
          className={`group relative inline-flex items-center justify-center gap-2.5 sm:gap-3.5 px-6 sm:px-9 py-3.5 sm:py-4 rounded-full font-sans font-bold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden max-w-[92vw] ${theme.palette.buttonGradient}`}
        >
          <Droplets className="w-5 h-5 text-stone-900 animate-bounce group-hover:rotate-12 transition-transform" />
          <span className="relative z-10">{theme.actionButton}</span>
          <Sparkles className="w-5 h-5 text-stone-900 group-hover:rotate-45 transition-transform" />
        </button>

        <p className="text-xs sm:text-sm text-stone-500 font-sans text-center max-w-md">
          {bloomCount === 0 ? theme.actionSubtext : theme.counterText(bloomCount, recipientName)}
        </p>

        {/* Presumir CTA */}
        {onOpenBrag && (
          <button
            onClick={onOpenBrag}
            className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 text-xs sm:text-sm font-sans font-semibold shadow-xs hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
            title="Presumir este momento en TikTok e Instagram"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>✨ Presumir este momento</span>
          </button>
        )}
      </div>
    </div>
  );
}
