import React, { useState, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Droplets, MousePointerClick } from 'lucide-react';
import { startMovieMusic, isAudioCurrentlyPlaying } from '../utils/audioChimes';
import TapHintPill from './TapHintPill';
import {
  SunflowerBouquetSVG,
  BirthdayCakeSVG,
  TrophyLaurelSVG,
  RosesBouquetSVG
} from './Centerpieces';

// Caché de formas temáticas para reutilizar instancias de canvas-confetti y alto rendimiento
const THEMATIC_SHAPES_CACHE = new Map();

function createVectorShape(path, matrix) {
  try {
    if (typeof confetti.shapeFromPath === 'function') {
      return confetti.shapeFromPath({ path, matrix });
    }
  } catch {
    // Fallback abajo si Path2D no está disponible
  }
  return null;
}

function tryTextShape(text, scalar) {
  try {
    if (typeof confetti.shapeFromText !== 'function' || typeof OffscreenCanvas === 'undefined') {
      return null;
    }
    const shape = confetti.shapeFromText({ text, scalar });
    if (shape && shape.bitmap && shape.bitmap.width > 0 && shape.bitmap.height > 0) {
      return shape;
    }
  } catch {
    // Safari / navegadores sin soporte completo OffscreenCanvas
  }
  return null;
}

function getThematicShapes(themeId) {
  if (THEMATIC_SHAPES_CACHE.has(themeId)) {
    return THEMATIC_SHAPES_CACHE.get(themeId);
  }

  // En Safari/WebKit shapeFromText usa OffscreenCanvas + transferToImageBitmap y los emojis pueden fallar o frenar animación
  const isSafariWebKit =
    typeof navigator !== 'undefined' &&
    /^((?!chrome|chromium|android|crios|fxios).)*safari/i.test(navigator.userAgent);

  const sparkle = createVectorShape(
    'M10 0 Q10 10 20 10 Q10 10 10 20 Q10 10 0 10 Q10 10 10 0 Z',
    [0.55, 0, 0, 0.55, -5.5, -5.5]
  );
  const heart = createVectorShape(
    'M10 18 C10 18 1 12 1 6 C1 2.7 3.7 0.5 6.8 0.5 C8.5 0.5 9.5 1.4 10 2.6 C10.5 1.4 11.5 0.5 13.2 0.5 C16.3 0.5 19 2.7 19 6 C19 12 10 18 10 18 Z',
    [0.58, 0, 0, 0.58, -5.8, -5.5]
  );
  const petal = createVectorShape(
    'M10 0 C15 5 16 14 10 20 C4 14 5 5 10 0 Z',
    [0.55, 0, 0, 0.55, -5.5, -5.5]
  );
  const ribbon = createVectorShape(
    'M2 2 Q10 6 18 2 L20 7 Q10 11 0 7 Z',
    [0.55, 0, 0, 0.55, -5.5, -3]
  );

  const shapes = [];
  if (themeId === 'cumpleanos') {
    shapes.push('square', 'circle', 'star');
    if (sparkle) shapes.push(sparkle);
    if (ribbon) shapes.push(ribbon);
    if (!isSafariWebKit) {
      ['🎉', '🎂', '✨'].forEach((emoji, i) => {
        const s = tryTextShape(emoji, i === 2 ? 1.4 : 1.8);
        if (s) shapes.push(s);
      });
    }
  } else if (themeId === 'flores-amarillas') {
    shapes.push('circle');
    if (petal) shapes.push(petal);
    if (sparkle) shapes.push(sparkle);
    if (!isSafariWebKit) {
      ['🌻', '🌼', '✨'].forEach((emoji, i) => {
        const s = tryTextShape(emoji, i === 0 ? 2.0 : i === 1 ? 1.8 : 1.4);
        if (s) shapes.push(s);
      });
    }
  } else if (themeId === 'logro-profesional') {
    shapes.push('circle', 'star');
    if (sparkle) shapes.push(sparkle);
    if (ribbon) shapes.push(ribbon);
    if (!isSafariWebKit) {
      ['🎓', '⭐', '🏆', '✨'].forEach((emoji, i) => {
        const s = tryTextShape(emoji, i === 3 ? 1.4 : 1.9);
        if (s) shapes.push(s);
      });
    }
  } else if (themeId === 'aniversario') {
    shapes.push('circle');
    if (heart) shapes.push(heart);
    if (petal) shapes.push(petal);
    if (sparkle) shapes.push(sparkle);
    if (!isSafariWebKit) {
      ['💖', '❤️', '🌹', '✨'].forEach((emoji, i) => {
        const s = tryTextShape(emoji, i === 3 ? 1.4 : 1.9);
        if (s) shapes.push(s);
      });
    }
  }

  if (shapes.length === 0) {
    shapes.push('circle', 'square');
  }

  THEMATIC_SHAPES_CACHE.set(themeId, shapes);
  return shapes;
}

function getCenterpieceTapPrompt(themeId) {
  switch (themeId) {
    case 'cumpleanos':
      return {
        title: 'Toca el pastel',
        subtitle: 'Enciende las 4 velas y pide tu deseo',
      };
    case 'logro-profesional':
      return {
        title: 'Toca el trofeo',
        subtitle: 'Activa las 4 estrellas de tu triunfo',
      };
    case 'aniversario':
      return {
        title: 'Toca las rosas',
        subtitle: 'Ilumina cada momento especial',
      };
    case 'flores-amarillas':
    default:
      return {
        title: 'Toca el ramo',
        subtitle: 'Haz florecer sus 4 etapas',
      };
  }
}

export default function InteractiveBouquet({
  recipientName,
  theme,
  bloomStage: externalBloomStage,
  onStageChange,
}) {
  const [internalBloomStage, setInternalBloomStage] = useState(1);
  const bloomStage = externalBloomStage !== undefined ? externalBloomStage : internalBloomStage;
  const setBloomStage = (val) => {
    setInternalBloomStage(val);
    if (onStageChange) onStageChange(val);
  };

  const [bloomCount, setBloomCount] = useState(0);
  const [showWaterSplash, setShowWaterSplash] = useState(false);
  const [showRippleWave, setShowRippleWave] = useState(false);
  const [isBloomingAnimation, setIsBloomingAnimation] = useState(false);

  const canvasRef = useRef(null);
  const cannonRef = useRef(null);
  const prevThemeIdRef = useRef(theme.id);
  const bloomTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (bloomTimerRef.current) {
        clearTimeout(bloomTimerRef.current);
      }
      if (cannonRef.current) {
        cannonRef.current.reset();
        cannonRef.current = null;
      }
    };
  }, []);

  const playCenterpiecePulse = useCallback(() => {
    if (bloomTimerRef.current) {
      clearTimeout(bloomTimerRef.current);
    }
    setIsBloomingAnimation(false);
    requestAnimationFrame(() => {
      setIsBloomingAnimation(true);
      bloomTimerRef.current = setTimeout(() => setIsBloomingAnimation(false), 1150);
    });
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

    const nextStage = bloomStage >= 4 ? 1 : bloomStage + 1;
    setBloomStage(nextStage);
    setBloomCount((prev) => prev + 1);
    playCenterpiecePulse();

    // En cada toque verificar si la música ya está iniciada: solo iniciarla si aún no suena
    if (!isAudioCurrentlyPlaying()) {
      startMovieMusic(nextStage, theme.id);
    }

    // Disparo festivo temático confinado estrictamente al espacio de la flor / torta / trofeo / rosas
    fireThematicParticles(theme.id, nextStage);
  };

  const currentStageInfo = theme.stageNames[bloomStage - 1] || theme.stageNames[0];
  const tapPrompt = getCenterpieceTapPrompt(theme.id);

  return (
    <div id="centro" className="scroll-mt-16 relative flex flex-col items-center justify-center py-6 px-4 max-w-4xl mx-auto">
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
        className="safari-layer-clip relative w-full max-w-[340px] sm:max-w-[440px] h-[390px] sm:h-[460px] flex items-center justify-center transition-all duration-700 cursor-pointer overflow-hidden rounded-3xl select-none group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        {/* Canvas de partículas temáticas confinado estrictamente a la pieza central */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
        />

        {/* Indicador visual animado que invita al usuario a tocar el pastel o pieza central */}
        {bloomCount === 0 && (
          <div
            data-tap-hint
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center"
          >
            {/* Ondas concéntricas de invitación sobre la pieza central */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-2 border-amber-400/55 tap-ripple-ring" />
            <div
              className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-pink-400/45 tap-ripple-ring"
              style={{ animationDelay: '0.7s' }}
            />

            {/* Píldora flotante inferior con puntero animado haciendo gesto de toque */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-[92%]">
              <TapHintPill title={tapPrompt.title} subtitle={tapPrompt.subtitle} />
            </div>
          </div>
        )}

        {/* Sugerencia discreta tras el primer toque mientras queden etapas por activar */}
        {bloomCount > 0 && bloomStage < 4 && (
          <div
            data-tap-hint-next
            aria-hidden="true"
            className="absolute bottom-3 right-3 pointer-events-none z-20"
          >
            <div className="tap-nudge-float inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-amber-300/80 shadow-md rounded-full px-3 py-1 text-[11px] font-sans font-semibold text-stone-700">
              <MousePointerClick className="w-3.5 h-3.5 text-amber-600" />
              <span>Toca otra vez ({bloomStage}/4)</span>
            </div>
          </div>
        )}
        
        {/* Render Centerpiece according to theme */}
        <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          <div className={`w-full h-full flex items-center justify-center ${isBloomingAnimation ? 'animate-botanical-bloom' : ''}`}>
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
        </div>
      </div>

      {/* Action Button & Ripple */}
      <div className="mt-6 flex flex-col items-center gap-3 z-10 relative">
        <div className="relative inline-flex items-center justify-center">
          {showRippleWave && (
            <div className="absolute inset-0 rounded-full border-2 border-amber-400 animate-forcefield-wave pointer-events-none" />
          )}

          <button
            onClick={triggerBloom}
            className={`group relative inline-flex items-center justify-center gap-2.5 sm:gap-3.5 px-6 sm:px-9 py-3.5 sm:py-4 rounded-full font-sans font-bold text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden max-w-[92vw] ${theme.palette.buttonGradient}`}
          >
            <Droplets className="w-5 h-5 text-stone-900 animate-bounce group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">{theme.actionButton}</span>
            <Sparkles className="w-5 h-5 text-stone-900 group-hover:rotate-45 transition-transform" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-stone-500 font-sans text-center max-w-md">
          {bloomCount === 0 ? theme.actionSubtext : theme.counterText(bloomCount, recipientName)}
        </p>
      </div>
    </div>
  );
}
