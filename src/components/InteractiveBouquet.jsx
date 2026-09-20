import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Droplets, Sun, Feather, Star, Flame, Wind } from 'lucide-react';
import { startMovieMusic } from '../utils/audioChimes';

export default function InteractiveBouquet({
  recipientName,
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
  const [activeNote, setActiveNote] = useState(null);
  const noteTimeoutRef = useRef(null);
  const [showWaterSplash, setShowWaterSplash] = useState(false);
  const [showRippleWave, setShowRippleWave] = useState(false);
  const [isBloomingAnimation, setIsBloomingAnimation] = useState(false);

  useEffect(() => {
    return () => {
      if (noteTimeoutRef.current) {
        clearTimeout(noteTimeoutRef.current);
      }
    };
  }, []);

  const springLoveNotes = [
    '🌻 ¡Que nunca te falten flores amarillas en tu vida!',
    '✨ Eres la luz y la calidez más hermosa de esta primavera',
    '💛 Un ramo dorado para recordarte lo especial que eres',
    '🌼 Donde florecen las flores, florece la alegría y el amor',
    '🌷 Tu sonrisa ilumina el mundo como el sol primaveral',
    '💫 "Ella sabía que vendría a buscarla con sus flores amarillas..."',
    '🦋 Que cada pétalo te traiga momentos de felicidad',
    '🌟 Gracias por existir y llenar de color cada día'
  ];

  const stageDescriptions = [
    {
      movie: 'Fase 1',
      name: 'Primeros Brotes & Margaritas',
      desc: 'Dientes de león dorados y tiernas margaritas acariciadas por el sol',
      badge: '🌼 Diente de León & Margaritas'
    },
    {
      movie: 'Fase 2',
      name: 'Girasoles & Rosas Silvestres',
      desc: 'Girasoles radiantes, rosas doradas aterciopeladas y hojas en flor',
      badge: '🌻 Girasol & Rosa Silvestre'
    },
    {
      movie: 'Fase 3',
      name: 'Jardín de Amor & Follaje',
      desc: 'Flores silvestres doradas, mariquitas de la suerte y follaje esmeralda',
      badge: '🐞 Flores Silvestres & Mariquita'
    },
    {
      movie: 'Fase 4',
      name: 'Eterna Primavera Radiante',
      desc: 'Floración total con mariposas doradas, brillo solar y pétalos al viento',
      badge: '✨ Eterna Primavera'
    },
  ];

  const stageQuotes = [
    {
      stage: 1,
      tag: '21 de Septiembre · El Despertar del Sol',
      quote: '“Dicen que regalar flores amarillas el 21 de septiembre es prometer luz, alegría y desearle a quien las recibe que nunca le falte un motivo para sonreír.”',
      author: '— Tradición de Primavera'
    },
    {
      stage: 2,
      tag: 'Flores Amarillas · Promesa de Amor',
      quote: '“Ella sabía que él sabía, que algún día pasaría, que vendría a buscarla con sus flores amarillas... porque el cariño verdadero siempre encuentra el camino para florecer.”',
      author: '— Himno de las Flores Amarillas'
    },
    {
      stage: 3,
      tag: 'Jardín de Primavera · Esperanza y Vida',
      quote: '“El amarillo es el color de la luz, de la energía que renace y de la felicidad compartida. Donde florece una flor amarilla, siempre florece un nuevo comienzo lleno de dicha.”',
      author: '— Poesía Primaveral'
    },
    {
      stage: 4,
      tag: 'Plena Floración · Amor y Gratitud',
      quote: '“La primavera no empieza en una fecha del calendario; empieza cada vez que personas maravillosas llenan de color y calidez la vida de quienes las rodean.”',
      author: '— Celebración de la Primavera'
    },
  ];

  const triggerBloom = () => {
    // 1. Trigger ripple wave effect on button
    setShowRippleWave(true);
    setTimeout(() => setShowRippleWave(false), 900);

    // 2. Trigger water sprinkle effect
    setShowWaterSplash(true);
    setTimeout(() => setShowWaterSplash(false), 1150);

    // 3. Compute next stage
    const nextStage = bloomStage >= 4 ? 2 : bloomStage + 1;
    setBloomStage(nextStage);
    setBloomCount((prev) => prev + 1);
    setIsBloomingAnimation(true);
    setTimeout(() => setIsBloomingAnimation(false), 1350);

    // 4. Auto-reproducir inmediatamente la música de la película correspondiente sin efectos extra encima
    startMovieMusic(nextStage);

    // 5. Add single floating romantic quote (zero overlap guarantee)
    if (noteTimeoutRef.current) {
      clearTimeout(noteTimeoutRef.current);
    }
    const note = springLoveNotes[bloomCount % springLoveNotes.length];
    setActiveNote({
      id: Date.now(),
      text: note,
    });
    noteTimeoutRef.current = setTimeout(() => {
      setActiveNote(null);
    }, 3200);

    // 6. Vibrant flower confetti with gold, amber, white & ruby accents
    confetti({
      particleCount: nextStage === 4 ? 90 : 60,
      spread: nextStage === 4 ? 100 : 75,
      origin: { y: 0.62 },
      colors: ['#FDE047', '#FACC15', '#EAB308', '#FFFFFF', '#991B1B', '#F59E0B'],
      shapes: ['circle'],
      scalar: 1.25,
      ticks: 240,
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-12 px-4 select-none overflow-hidden">
      {/* Sunburst background rays */}
      <div
        className={`absolute w-[500px] h-[500px] sm:w-[620px] sm:h-[620px] -z-10 pointer-events-none transition-opacity duration-1000 ${
          bloomStage >= 2 ? 'opacity-40 animate-sunburst' : 'opacity-10'
        }`}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full text-sunflower-300">
          <g fill="currentColor" opacity="0.25">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <polygon
                key={deg}
                points="100,100 95,0 105,0"
                transform={`rotate(${deg} 100 100)`}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Ambient Pulsing Warm Glow */}
      <div
        className={`absolute w-80 h-80 sm:w-[480px] sm:h-[480px] bg-sunflower-300/35 rounded-full blur-3xl -z-10 transition-all duration-700 pointer-events-none ${
          bloomStage >= 3 ? 'scale-125 bg-amber-300/50 animate-pulse' : 'scale-100'
        }`}
      />

      {/* Header Tag */}
      <div className="inline-flex items-center justify-center text-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-100/95 border border-amber-300 text-amber-950 text-xs sm:text-sm font-sans tracking-wide uppercase font-semibold shadow-sm mb-3 max-w-full flex-wrap">
        <span className="text-base">🌻</span>
        <span>Ramo de Flores Amarillas</span>
        <span className="hidden sm:inline text-amber-600">·</span>
        <span className="text-sunflower-700 font-bold">21 de Septiembre · Día de la Primavera</span>
      </div>

      {/* Stage Indicator Pill with Movie Label */}
      <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-2 mb-3 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-2xl sm:rounded-full border border-amber-200 text-xs text-amber-950 font-sans shadow-xs text-center">
        <div className="flex items-center gap-1.5 font-bold text-amber-800">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>{stageDescriptions[bloomStage - 1].movie}:</span>
          <span>{stageDescriptions[bloomStage - 1].name}</span>
        </div>
        <span className="hidden sm:inline text-amber-300">|</span>
        <span className="text-stone-600 italic">{stageDescriptions[bloomStage - 1].desc}</span>
      </div>

      {/* Dynamic Flower Badges of the current stage */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mb-4 text-[11px] font-sans">
        {stageDescriptions.map((st, i) => (
          <span
            key={i}
            className={`px-3 py-1 rounded-full border transition-all duration-300 ${
              i + 1 <= bloomStage
                ? 'bg-amber-100 text-amber-950 border-amber-400 font-semibold shadow-xs scale-105'
                : 'bg-stone-100/60 text-stone-400 border-stone-200 opacity-60'
            }`}
          >
            {st.badge}
          </span>
        ))}
      </div>

      {/* The Bouquet Graphic Container */}
      <div className="relative w-full max-w-[340px] sm:max-w-[440px] h-[410px] sm:h-[480px] flex items-center justify-center transition-all duration-700">
        
        {/* 🌾 ANIMATION 3: Floating Dandelion Parachute Seeds (Vilanos) */}
        {bloomStage >= 2 && (
          <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
            {[
              { x: 90, r: 20, delay: '0s', left: '18%', top: '55%' },
              { x: -70, r: -35, delay: '1.2s', left: '75%', top: '45%' },
              { x: 110, r: 40, delay: '2.4s', left: '30%', top: '35%' },
              { x: -90, r: -25, delay: '3.6s', left: '60%', top: '65%' },
              { x: 80, r: 15, delay: '4.2s', left: '45%', top: '25%' },
            ].map((seed, idx) => (
              <div
                key={idx}
                className="absolute animate-dandelion-seed"
                style={{
                  left: seed.left,
                  top: seed.top,
                  animationDelay: seed.delay,
                  '--drift-x': `${seed.x}px`,
                  '--rot': `${seed.r}deg`,
                }}
              >
                {/* Dandelion seed fluff graphic */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-sunflower-300 drop-shadow-xs">
                  <line x1="12" y1="12" x2="12" y2="22" stroke="#CA8A04" strokeWidth="1" />
                  <circle cx="12" cy="22" r="1.5" fill="#78350F" />
                  {/* Fluffy white hairs */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
                    <line
                      key={a}
                      x1="12"
                      y1="12"
                      x2="12"
                      y2="3"
                      stroke="#FEF9C3"
                      strokeWidth="0.75"
                      strokeOpacity="0.85"
                      transform={`rotate(${a} 12 12)`}
                    />
                  ))}
                  <circle cx="12" cy="12" r="1.2" fill="#EAB308" />
                </svg>
              </div>
            ))}
          </div>
        )}

        {/* 🔥 ANIMATION 2: The Girl on Fire Embers & Sparkles */}
        {bloomStage >= 3 && (
          <div className="absolute inset-0 pointer-events-none z-20">
            {[-60, -30, 0, 35, 65].map((xOff, i) => (
              <div
                key={i}
                className="absolute animate-fire-ember flex items-center justify-center"
                style={{
                  left: `calc(50% + ${xOff}px)`,
                  bottom: '30%',
                  animationDelay: `${i * 0.5}s`,
                  '--ember-drift': `${(i % 2 === 0 ? 1 : -1) * 22}px`,
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_8px_#F59E0B] opacity-85" />
              </div>
            ))}
          </div>
        )}

        {/* 🦋 ANIMATION: Golden Butterfly Spiral Flight */}
        {bloomStage >= 4 && (
          <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
            <div className="animate-mockingjay-flight">
              <svg width="46" height="46" viewBox="0 0 64 64" className="filter drop-shadow-[0_0_12px_rgba(234,179,8,0.85)]">
                {/* Golden Butterfly with flapping wings */}
                <g transform="translate(32, 32)">
                  {/* Butterfly body */}
                  <ellipse cx="0" cy="0" rx="3" ry="12" fill="#78350F" />
                  <circle cx="0" cy="-14" r="3" fill="#451A03" />
                  {/* Antennae */}
                  <path d="M-1 -16 Q-7 -22 -11 -21" stroke="#451A03" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                  <path d="M1 -16 Q7 -22 11 -21" stroke="#451A03" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                  <circle cx="-11" cy="-21" r="1.2" fill="#F59E0B" />
                  <circle cx="11" cy="-21" r="1.2" fill="#F59E0B" />
                  {/* Left Wing Flapping */}
                  <g className="mj-wing-l">
                    <path d="M-2 -8 C-22 -26 -36 -6 -22 10 C-14 18 -4 4 -2 0 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
                    <path d="M-2 2 C-18 8 -22 22 -12 26 C-4 26 -2 12 -2 2 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
                    <circle cx="-16" cy="-4" r="3" fill="#F59E0B" opacity="0.8" />
                    <circle cx="-10" cy="14" r="2.2" fill="#F59E0B" opacity="0.8" />
                  </g>
                  {/* Right Wing Flapping */}
                  <g className="mj-wing-r">
                    <path d="M2 -8 C22 -26 36 -6 22 10 C14 18 4 4 2 0 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
                    <path d="M2 2 C18 8 22 22 12 26 C4 26 2 12 2 2 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="0.8" />
                    <circle cx="16" cy="-4" r="3" fill="#F59E0B" opacity="0.8" />
                    <circle cx="10" cy="14" r="2.2" fill="#F59E0B" opacity="0.8" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        )}

        {/* Animated Dewdrops on click */}
        {showWaterSplash && (
          <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
            {[-50, -25, 0, 25, 50].map((offset, i) => (
              <div
                key={i}
                className="absolute animate-dew-drop flex flex-col items-center"
                style={{
                  left: `calc(50% + ${offset}px)`,
                  top: '8%',
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="w-3.5 h-5 bg-sky-300 rounded-full blur-[0.5px] opacity-90 shadow-sm" />
                <Sparkles className="w-3 h-3 text-sky-200 -mt-1" />
              </div>
            ))}
          </div>
        )}

        {/* 🦋 Golden Butterfly Fluttering */}
        {bloomStage >= 3 && (
          <div className="absolute top-4 left-8 z-30 pointer-events-none animate-butterfly-1 perspective-1000">
            <div className="flex items-center transform-style-3d">
              <div className="w-4 h-5 bg-gradient-to-l from-amber-400 to-yellow-300 rounded-tl-full rounded-bl-lg shadow-sm butterfly-wing-l border border-amber-300/60" />
              <div className="w-1 h-4 bg-amber-900 rounded-full -mx-0.5 z-10" />
              <div className="w-4 h-5 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-tr-full rounded-br-lg shadow-sm butterfly-wing-r border border-amber-300/60" />
            </div>
          </div>
        )}

        {/* 💬 Single Floating Message Toast - Perfect centered mobile fit & zero overlap */}
        {activeNote && (
          <div
            key={activeNote.id}
            className="absolute top-1 sm:top-4 inset-x-0 mx-auto z-40 pointer-events-none w-full max-w-[340px] sm:max-w-[420px] px-3 flex justify-center"
          >
            <div className="animate-message-pop w-full px-4 py-2.5 sm:px-5 sm:py-3 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-300/90 shadow-polaroid text-center flex items-center justify-center">
              <p className="font-handwriting text-base sm:text-lg text-amber-950 font-bold leading-normal break-words text-center">
                {activeNote.text}
              </p>
            </div>
          </div>
        )}

        {/* ================= SVG LUSH SPRING BOUQUET ================= */}
        <div className="w-full h-full animate-gentle-breeze origin-bottom flex items-center justify-center">
          <svg
            viewBox="0 0 440 480"
            className={`w-full h-full filter transition-all duration-1000 ease-out cursor-pointer ${
              isBloomingAnimation ? 'animate-botanical-bloom' : ''
            } ${
              bloomStage === 1
                ? 'drop-shadow-md'
                : bloomStage === 2
                ? 'drop-shadow-xl brightness-105'
                : bloomStage === 3
                ? 'drop-shadow-2xl brightness-110'
                : 'drop-shadow-[0_0_35px_rgba(250,204,21,0.65)] brightness-115'
            }`}
            onClick={triggerBloom}
            title="Toca para regar y hacer florecer el ramo de flores amarillas"
          >
          <defs>
            {/* Gradients */}
            <linearGradient id="stemLushGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86EFAC" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>

            <linearGradient id="fernGreenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="50%" stopColor="#16A34A" />
              <stop offset="100%" stopColor="#14532D" />
            </linearGradient>

            <linearGradient id="danYellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="40%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>

            <linearGradient id="primroseSoftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="70%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#FACC15" />
            </linearGradient>

            <linearGradient id="whiteRoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>

            <linearGradient id="katWhiteGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#F1F5F9" />
            </linearGradient>

            <radialGradient id="katCrimsonGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7F1D1D" />
              <stop offset="60%" stopColor="#991B1B" />
              <stop offset="90%" stopColor="#B91C1C" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            <linearGradient id="posyKraftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EFE5D9" />
              <stop offset="60%" stopColor="#DFCBB6" />
              <stop offset="100%" stopColor="#CDB49C" />
            </linearGradient>
          </defs>

          {/* LAYER 1: Dense Background Ferns & Tropical Jungle Foliage (Catching Fire) */}
          <g id="lush-background-ferns" className="transition-all duration-1000 ease-out">
            {/* Left Big Fern Frond */}
            <g
              transform="translate(130, 200)"
              className={`transition-all duration-1200 ease-out origin-[130px_200px] ${
                bloomStage >= 2 ? 'opacity-100 scale-100 rotate-[-42deg]' : 'opacity-35 scale-70 rotate-[-56deg]'
              }`}
            >
              <path d="M0 0 Q-30 -80 -10 -150" stroke="url(#fernGreenGrad)" strokeWidth="3" fill="none" />
              {[-30, -50, -70, -90, -110, -130].map((y, idx) => (
                <g key={`lfern-${idx}`} transform={`translate(0, ${y})`}>
                  <ellipse cx="-16" cy="-2" rx="14" ry="4" fill="url(#fernGreenGrad)" transform="rotate(-15 -16 -2)" />
                  <ellipse cx="14" cy="-2" rx="12" ry="4" fill="url(#fernGreenGrad)" transform="rotate(15 14 -2)" />
                </g>
              ))}
            </g>

            {/* Right Big Fern Frond */}
            <g
              transform="translate(310, 200)"
              className={`transition-all duration-1200 ease-out origin-[310px_200px] ${
                bloomStage >= 2 ? 'opacity-100 scale-100 rotate-[42deg]' : 'opacity-35 scale-70 rotate-[56deg]'
              }`}
            >
              <path d="M0 0 Q30 -80 10 -150" stroke="url(#fernGreenGrad)" strokeWidth="3" fill="none" />
              {[-30, -50, -70, -90, -110, -130].map((y, idx) => (
                <g key={`rfern-${idx}`} transform={`translate(0, ${y})`}>
                  <ellipse cx="-14" cy="-2" rx="12" ry="4" fill="url(#fernGreenGrad)" transform="rotate(-15 -14 -2)" />
                  <ellipse cx="16" cy="-2" rx="14" ry="4" fill="url(#fernGreenGrad)" transform="rotate(15 16 -2)" />
                </g>
              ))}
            </g>

            {/* Center Top Meadow Grasses (Distrito 12 Meadow) */}
            <g
              transform="translate(220, 160)"
              className={`transition-all duration-700 ${bloomStage >= 2 ? 'opacity-90' : 'opacity-30'}`}
            >
              <path d="M-20 0 Q-40 -90 -30 -140" stroke="#86EFAC" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M0 0 Q0 -100 5 -155" stroke="#4ADE80" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M20 0 Q40 -90 30 -140" stroke="#86EFAC" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Seed spikes on grasses */}
              <circle cx="-30" cy="-140" r="3" fill="#FDE047" />
              <circle cx="5" cy="-155" r="3.5" fill="#FEF08A" />
              <circle cx="30" cy="-140" r="3" fill="#FDE047" />
            </g>
          </g>

          {/* LAYER 2: Wrapper Paper & Stems */}
          <g id="posy-wrap-structure">
            {/* Back Paper */}
            <polygon
              points="150,260 220,460 290,260 370,240 70,240"
              fill="url(#posyKraftGrad)"
              stroke="#BCA28B"
              strokeWidth="2"
            />

            {/* Main Stems Bundle */}
            <path d="M210 240 Q215 350 218 430" stroke="url(#stemLushGrad)" strokeWidth="6" strokeLinecap="round" />
            <path d="M230 240 Q225 350 222 430" stroke="url(#stemLushGrad)" strokeWidth="6" strokeLinecap="round" />
            <path d="M190 230 Q210 340 216 420" stroke="url(#stemLushGrad)" strokeWidth="5" strokeLinecap="round" />
            <path d="M250 230 Q230 340 224 420" stroke="url(#stemLushGrad)" strokeWidth="5" strokeLinecap="round" />

            {/* Dandelion Serrated Wild Leaves */}
            <path
              d="M140 260 L115 235 L132 225 L100 195 L122 190 L95 160 L125 175 L145 250 Z"
              fill="#16A34A"
              opacity="0.9"
              className="origin-[140px_260px] transition-transform duration-700"
            />
            <path
              d="M300 260 L325 235 L308 225 L340 195 L318 190 L345 160 L315 175 L295 250 Z"
              fill="#16A34A"
              opacity="0.9"
              className="origin-[300px_260px] transition-transform duration-700"
            />

            {/* Front wrapping folds */}
            <path
              d="M140 265 L220 455 L300 265 Q220 305 140 265 Z"
              fill="#E3D1BE"
              stroke="#BCA28B"
              strokeWidth="2"
            />
            <path d="M150 285 L220 455 L245 295 Z" fill="#D5BEA6" opacity="0.6" />

            {/* Posy Ribbon with Golden Daisy Brooch Knot */}
            <g id="posy-golden-ribbon" transform="translate(220, 365)">
              <ellipse cx="-20" cy="-2" rx="22" ry="12" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" transform="rotate(-15 -20 -2)" />
              <ellipse cx="20" cy="-2" rx="22" ry="12" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" transform="rotate(15 20 -2)" />
              
              <circle cx="0" cy="0" r="16" fill="#D97706" stroke="#FEF08A" strokeWidth="2.5" />

              {/* Golden Daisy Brooch Center */}
              <g transform="scale(0.85)">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <circle key={`ribbon-petal-${deg}`} cx="0" cy="-9" r="3.5" fill="#FEF9C3" stroke="#F59E0B" strokeWidth="0.5" transform={`rotate(${deg})`} />
                ))}
                <circle cx="0" cy="0" r="6" fill="#CA8A04" />
                <circle cx="0" cy="0" r="3" fill="#FEF08A" />
              </g>

              {/* Ribbon tails */}
              <path d="M-8 12 Q-30 50 -22 80" stroke="#CA8A04" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              <path d="M8 12 Q30 50 22 80" stroke="#CA8A04" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            </g>
          </g>

          {/* LAYER 3: FLOWER - La Rosa Blanca de Snow abrazada por hojas (Catching Fire) */}
          <g
            id="flower-white-rose"
            className={`transition-all duration-1200 ease-out origin-[165px_195px] ${
              bloomStage >= 2 ? 'opacity-100 scale-100 rotate-[-15deg]' : 'opacity-0 scale-35 rotate-[-35deg]'
            }`}
            transform="translate(165, 195)"
          >
            {/* White Rose Petals */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <ellipse key={`wrose-out-${deg}`} cx="0" cy="-18" rx="12" ry="16" fill="url(#whiteRoseGrad)" stroke="#CBD5E1" strokeWidth="0.8" transform={`rotate(${deg})`} />
            ))}
            {[30, 90, 150, 210, 270, 330].map((deg) => (
              <ellipse key={`wrose-mid-${deg}`} cx="0" cy="-12" rx="9" ry="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.6" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="7" fill="#FEF08A" opacity="0.9" />
            <circle cx="0" cy="0" r="4" fill="#FACC15" />
          </g>

          {/* LAYER 4: FLOWER - Margaritas Amarillas Silvestres */}
          <g
            id="flower-spring-daisy"
            className={`transition-all duration-1200 ease-out origin-[285px_195px] ${
              bloomStage >= 3 ? 'opacity-100 scale-100 rotate-[18deg]' : 'opacity-0 scale-35 rotate-[36deg]'
            }`}
            transform="translate(285, 195)"
          >
            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
              <ellipse key={`covey-${deg}`} cx="0" cy="-18" rx="5" ry="12" fill="#FEF9C3" stroke="#FACC15" strokeWidth="0.6" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="9" fill="#EAB308" />
            <circle cx="0" cy="0" r="5" fill="#CA8A04" />
          </g>

          {/* LAYER 5: FLOWER - Prímula Amarilla de Primavera */}
          <g
            id="flower-primrose"
            className="transition-all duration-1000 ease-out origin-[135px_140px]"
            transform={`translate(135, 140) rotate(${bloomStage >= 3 ? -16 : -10}) scale(${
              bloomStage === 1 ? 0.9 : bloomStage === 2 ? 1.0 : bloomStage === 3 ? 1.1 : 1.18
            })`}
          >
            {[0, 72, 144, 216, 288].map((deg) => (
              <g key={`prim-${deg}`} transform={`rotate(${deg})`}>
                <path
                  d="M0 0 C-18 -20 -30 -42 -12 -54 C-4 -60 0 -48 0 -45 C0 -48 4 -60 12 -54 C30 -42 18 -20 0 0 Z"
                  fill="url(#primroseSoftGrad)"
                  stroke="#EAB308"
                  strokeWidth="0.8"
                />
                <path d="M0 0 C-8 -15 -12 -28 0 -34 C12 -28 8 -15 0 0 Z" fill="#FEF08A" opacity="0.8" />
              </g>
            ))}
            <circle cx="0" cy="0" r="11" fill="#F59E0B" />
            <circle cx="0" cy="0" r="7" fill="#D97706" />
            <circle cx="0" cy="0" r="3" fill="#FEF08A" />
          </g>

          {/* LAYER 6: FLOWER - Flor Silvestre con Mariquita de la Suerte */}
          <g
            id="flower-wild-ladybug"
            className={`transition-all duration-1000 ease-out origin-[305px_145px] ${
              bloomStage >= 3 ? 'opacity-100' : 'opacity-85'
            }`}
            transform={`translate(305, 145) rotate(${bloomStage >= 3 ? 18 : 12}) scale(${
              bloomStage === 1 ? 0.9 : bloomStage === 2 ? 1.0 : bloomStage === 3 ? 1.1 : 1.18
            })`}
          >
            {[0, 90, 180, 270].map((deg) => (
              <g key={`rue-${deg}`} transform={`rotate(${deg})`}>
                <path
                  d="M0 0 C-14 -15 -20 -35 -10 -46 C-3 -52 0 -46 0 -42 C0 -46 3 -52 10 -46 C20 -35 14 -15 0 0 Z"
                  fill="#FBBF24"
                  stroke="#D97706"
                  strokeWidth="0.8"
                />
              </g>
            ))}
            <circle cx="0" cy="0" r="12" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1" />
            {[20, 65, 110, 155, 200, 245, 290, 335].map((deg) => (
              <line
                key={`stamen-${deg}`}
                x1="0"
                y1="0"
                x2="0"
                y2="-22"
                stroke="#FACC15"
                strokeWidth="1.5"
                strokeLinecap="round"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle cx="0" cy="0" r="6" fill="#65A30D" />

            {/* 🐞 LA MARIQUITA DE LA SUERTE */}
            <g
              id="spring-ladybug"
              className="transition-transform duration-1000"
              transform={`translate(${bloomStage >= 2 ? 15 : 6}, ${bloomStage >= 2 ? -18 : -8}) rotate(${
                bloomStage >= 3 ? 28 : 12
              }) scale(${bloomStage >= 2 ? 1.15 : 1})`}
            >
              <path d="M-2 -8 Q-5 -13 -7 -14" stroke="#1C1917" strokeWidth="1" fill="none" strokeLinecap="round" />
              <path d="M2 -8 Q5 -13 7 -14" stroke="#1C1917" strokeWidth="1" fill="none" strokeLinecap="round" />
              <circle cx="0" cy="-6" r="4" fill="#1C1917" />
              <circle cx="-1.5" cy="-7" r="0.8" fill="#FFFFFF" />
              <circle cx="1.5" cy="-7" r="0.8" fill="#FFFFFF" />
              <ellipse cx="0" cy="2" rx="9" ry="11" fill="#DC2626" stroke="#991B1B" strokeWidth="0.8" />
              <line x1="0" y1="-5" x2="0" y2="12" stroke="#1C1917" strokeWidth="1.2" />
              <circle cx="-4" cy="-1" r="2" fill="#1C1917" />
              <circle cx="4" cy="-1" r="2" fill="#1C1917" />
              <circle cx="-5" cy="5" r="1.8" fill="#1C1917" />
              <circle cx="5" cy="5" r="1.8" fill="#1C1917" />
              <circle cx="0" cy="8" r="1.8" fill="#1C1917" />
              <circle cx="-2" cy="-4" r="1.2" fill="#1C1917" />
              <circle cx="2" cy="-4" r="1.2" fill="#1C1917" />
              <ellipse cx="-3.5" cy="0" rx="2" ry="4" fill="#FFFFFF" opacity="0.4" transform="rotate(-15 -3.5 0)" />
            </g>
          </g>

          {/* LAYER 7: FLOWER CENTERPIECE - Girasol Radiante & Diente de León Dorado */}
          <g
            id="flower-sunflower-center"
            className="transition-all duration-1200 ease-out origin-[220px_105px]"
            transform={`translate(220, 105) scale(${
              bloomStage === 1 ? 0.92 : bloomStage === 2 ? 1.04 : bloomStage === 3 ? 1.16 : 1.25
            })`}
          >
            <circle
              cx="0"
              cy="0"
              r={bloomStage >= 3 ? 75 : 58}
              fill="#FEF08A"
              opacity={bloomStage >= 3 ? 0.6 : 0.35}
              filter="blur(8px)"
            />

            {/* 36 Outer Dandelion Florets */}
            {Array.from({ length: 36 }).map((_, idx) => {
              const deg = (idx * 360) / 36;
              const len = bloomStage === 1 ? 48 : 62;
              return (
                <path
                  key={`dan-out-${idx}`}
                  d={`M0 0 C-2.5 -${len * 0.4} -2 -${len * 0.8} 0 -${len} C2 -${len * 0.8} 2.5 -${len * 0.4} 0 0`}
                  fill="url(#danYellowGrad)"
                  stroke="#CA8A04"
                  strokeWidth="0.4"
                  transform={`rotate(${deg})`}
                />
              );
            })}

            {/* 28 Mid Ring */}
            {Array.from({ length: 28 }).map((_, idx) => {
              const deg = (idx * 360) / 28 + 6;
              const len = bloomStage === 1 ? 36 : 48;
              return (
                <path
                  key={`dan-mid-${idx}`}
                  d={`M0 0 C-3 -${len * 0.4} -2.5 -${len * 0.8} 0 -${len} C2.5 -${len * 0.8} 3 -${len * 0.4} 0 0`}
                  fill="#FDE047"
                  stroke="#EAB308"
                  strokeWidth="0.3"
                  transform={`rotate(${deg})`}
                />
              );
            })}

            {/* 18 Inner Ring */}
            {Array.from({ length: 18 }).map((_, idx) => {
              const deg = (idx * 360) / 18 + 10;
              const len = bloomStage === 1 ? 24 : 32;
              return (
                <path
                  key={`dan-inn-${idx}`}
                  d={`M0 0 C-2.5 -${len * 0.4} -2 -${len * 0.8} 0 -${len} C2 -${len * 0.8} 2.5 -${len * 0.4} 0 0`}
                  fill="#FEF08A"
                  transform={`rotate(${deg})`}
                />
              );
            })}

            <circle cx="0" cy="0" r="14" fill="#EAB308" />
            <circle cx="0" cy="0" r="10" fill="#CA8A04" />
            <circle cx="0" cy="0" r="5" fill="#A16207" />
          </g>

          {/* LAYER 8: FOREGROUND FLOWER - Lirio Silvestre Blanco & Oro */}
          <g
            id="flower-white-lily"
            className={`transition-all duration-1000 ease-out origin-[220px_230px] ${
              bloomStage >= 2 ? 'opacity-100' : 'opacity-85'
            }`}
            transform={`translate(220, 230) scale(${
              bloomStage === 1 ? 0.92 : bloomStage === 2 ? 1.02 : bloomStage === 3 ? 1.14 : 1.22
            })`}
          >
            {/* 3 Large Pure White Rounded Petals */}
            {[0, 120, 240].map((deg) => (
              <g key={`kat-${deg}`} transform={`rotate(${deg})`}>
                <path
                  d="M0 0 C-24 -16 -34 -44 -22 -58 C-9 -72 9 -72 22 -58 C34 -44 24 -16 0 0 Z"
                  fill="url(#katWhiteGrad)"
                  stroke="#CBD5E1"
                  strokeWidth="0.8"
                />
                <ellipse cx="0" cy="-20" rx="11" ry="15" fill="url(#katCrimsonGrad)" opacity="0.95" />
              </g>
            ))}
            <circle cx="0" cy="0" r="13" fill="#CA8A04" />
            <circle cx="0" cy="0" r="9" fill="#FACC15" />
            <circle cx="0" cy="0" r="5" fill="#451A03" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <circle key={`k-stam-${deg}`} cx="0" cy="-8" r="2" fill="#FEF08A" transform={`rotate(${deg})`} />
            ))}
          </g>
        </svg>
        </div>
      </div>

      {/* Dynamic Contextual Quote Banner for each movie/stage */}
      <div
        key={bloomStage}
        className="mt-4 max-w-lg w-full text-center px-5 py-3.5 rounded-2xl bg-amber-50/95 border border-amber-200 shadow-sm transition-all duration-500 animate-in fade-in zoom-in-95"
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200/70 text-amber-900 text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-wider mb-2">
          <span>📖</span>
          <span>{stageQuotes[bloomStage - 1].tag}</span>
        </div>
        <p className="font-serif italic text-sm sm:text-base text-amber-950 leading-relaxed transition-all duration-300">
          {stageQuotes[bloomStage - 1].quote}
        </p>
        <span className="block font-handwriting text-base text-amber-800 font-bold mt-1.5">
          {stageQuotes[bloomStage - 1].author}
        </span>
      </div>

      {/* Action Button Container with Ripple Forcefield Wave Effect */}
      <div className="mt-6 flex flex-col items-center gap-3 z-10 relative">
        {/* Forcefield wave ring on click */}
        {showRippleWave && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-14 rounded-full border-2 border-sunflower-400 animate-forcefield-wave pointer-events-none" />
        )}

        <button
          onClick={triggerBloom}
          className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3.5 px-6 sm:px-9 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-sunflower-400 via-amber-400 to-sunflower-500 text-stone-900 font-sans font-bold text-base sm:text-lg shadow-xl shadow-sunflower-400/40 hover:shadow-sunflower-400/60 hover:scale-105 active:scale-95 transition-all duration-300 overflow-hidden max-w-[92vw]"
        >
          {/* Subtle interior sheen */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Droplets icon animating */}
          <Droplets className="w-5 h-5 text-amber-950 animate-bounce group-hover:rotate-12 transition-transform" />
          
          <span className="relative z-10">¡Regar & Hacer Florecer! 🌻</span>
          
          <Sparkles className="w-5 h-5 text-amber-950 group-hover:rotate-45 transition-transform" />
        </button>

        <p className="text-sm sm:text-base text-stone-600 font-handwriting text-xl text-center">
          {bloomCount === 0 ? (
            'Toca para regar: las flores brotarán y comenzará a sonar una melodía primaveral'
          ) : (
            <span className="text-amber-900 font-semibold">
              🌻 Has hecho florecer este hermoso ramo {bloomCount} {bloomCount === 1 ? 'vez' : 'veces'} para {recipientName} 💛
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
