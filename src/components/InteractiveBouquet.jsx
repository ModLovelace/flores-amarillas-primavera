import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Flower2, Droplets } from 'lucide-react';
import { playBloomSound } from '../utils/audioChimes';

export default function InteractiveBouquet({ recipientName }) {
  const [bloomStage, setBloomStage] = useState(1);
  const [bloomCount, setBloomCount] = useState(0);
  const [floatingNotes, setFloatingNotes] = useState([]);

  const loveNotes = [
    '✨ Eres el sol de mis días',
    '🌻 Para la chica más hermosa',
    '💛 Tu sonrisa ilumina todo',
    '🌼 Que nunca te falten flores',
    '🌷 Contigo siempre es primavera',
    '💫 Mereces todas las flores del mundo',
    '🌟 Eres magia pura'
  ];

  const triggerBloom = () => {
    playBloomSound();
    setBloomStage((prev) => (prev >= 3 ? 1 : prev + 1));
    setBloomCount((prev) => prev + 1);

    // Add a floating romantic note
    const note = loveNotes[Math.floor(Math.random() * loveNotes.length)];
    const newNote = {
      id: Date.now() + Math.random(),
      text: note,
      x: (Math.random() - 0.5) * 160,
    };
    setFloatingNotes((prev) => [...prev.slice(-4), newNote]);

    // Flower confetti explosion with warm sunflower tones
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FDE047', '#FACC15', '#EAB308', '#FEF08A', '#FEF9C3'],
      shapes: ['circle'],
      scalar: 1.2,
      ticks: 200,
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-10 px-4">
      {/* Background soft ambient halo */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-sunflower-200/40 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />

      {/* Aesthetic Ribbon Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunflower-100/90 border border-sunflower-300 text-sunflower-800 text-xs sm:text-sm font-sans tracking-wide uppercase font-semibold shadow-sm mb-6">
        <Sparkles className="w-4 h-4 text-sunflower-600 animate-spin-slow" />
        <span>Ramo de Flores Amarillas Interactivo</span>
      </div>

      {/* The Bouquet Graphic Container */}
      <div className="relative w-72 h-80 sm:w-84 sm:h-96 flex items-center justify-center transition-all duration-700">
        
        {/* Floating Messages Popups */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
          {floatingNotes.map((item) => (
            <div
              key={item.id}
              className="absolute animate-float-slow px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-sunflower-900 text-xs sm:text-sm font-handwriting text-lg border border-sunflower-200 shadow-polaroid"
              style={{
                transform: `translateX(${item.x}px) translateY(-90px)`,
                animation: 'fadeUp 2.8s ease-out forwards',
              }}
            >
              {item.text}
            </div>
          ))}
        </div>

        {/* SVG Illustrated Bouquet */}
        <svg
          viewBox="0 0 400 450"
          className={`w-full h-full filter transition-all duration-500 cursor-pointer ${
            bloomStage === 1
              ? 'scale-95 drop-shadow-md'
              : bloomStage === 2
              ? 'scale-105 drop-shadow-xl filter brightness-105'
              : 'scale-110 drop-shadow-2xl filter brightness-110'
          }`}
          onClick={triggerBloom}
          title="Haz clic para regar y hacer florecer"
        >
          <defs>
            <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>

            <linearGradient id="goldPetal1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            <linearGradient id="goldPetal2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="70%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>

            <radialGradient id="sunflowerCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#451A03" />
              <stop offset="70%" stopColor="#78350F" />
              <stop offset="95%" stopColor="#92400E" />
              <stop offset="100%" stopColor="#B45309" />
            </radialGradient>

            <radialGradient id="wrapPaper" cx="30%" cy="20%" r="90%">
              <stop offset="0%" stopColor="#FAF5FF" />
              <stop offset="100%" stopColor="#F3E8FF" />
            </radialGradient>
          </defs>

          {/* Wrapper Paper (Kraft/Pastel lilac vintage paper wrap) */}
          <g id="wrapper">
            {/* Back Paper */}
            <polygon
              points="140,240 200,430 260,240 330,220 70,220"
              fill="#F5EBE1"
              stroke="#D7C4B7"
              strokeWidth="2"
            />
            {/* Main Stems */}
            <path d="M190 230 Q195 330 198 400" stroke="url(#stemGrad)" strokeWidth="6" strokeLinecap="round" />
            <path d="M210 230 Q205 330 202 400" stroke="url(#stemGrad)" strokeWidth="6" strokeLinecap="round" />
            <path d="M175 220 Q190 320 196 390" stroke="url(#stemGrad)" strokeWidth="5" strokeLinecap="round" />
            <path d="M225 220 Q210 320 204 390" stroke="url(#stemGrad)" strokeWidth="5" strokeLinecap="round" />

            {/* Lush Foliage Leaves */}
            <path d="M130 240 Q100 210 120 180 Q150 200 130 240" fill="#22C55E" opacity="0.85" />
            <path d="M270 240 Q300 210 280 180 Q250 200 270 240" fill="#22C55E" opacity="0.85" />
            <path d="M160 270 Q110 280 130 320 Q170 300 160 270" fill="#16A34A" opacity="0.9" />
            <path d="M240 270 Q290 280 270 320 Q230 300 240 270" fill="#16A34A" opacity="0.9" />

            {/* Front wrapping paper folds */}
            <path
              d="M130 250 L200 420 L270 250 Q200 290 130 250 Z"
              fill="#EEDDCB"
              stroke="#D7C4B7"
              strokeWidth="2"
            />
            <path
              d="M140 270 L200 420 L220 280 Z"
              fill="#E4CEB9"
              opacity="0.6"
            />

            {/* Satin Yellow Ribbon & Bow */}
            <g id="ribbon" transform="translate(200, 340)">
              <ellipse cx="0" cy="0" rx="20" ry="12" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
              {/* Left bow loop */}
              <path
                d="M-15 0 C-40 -20 -45 15 -10 5 Z"
                fill="#FDE047"
                stroke="#EAB308"
                strokeWidth="1.5"
              />
              {/* Right bow loop */}
              <path
                d="M15 0 C40 -20 45 15 10 5 Z"
                fill="#FDE047"
                stroke="#EAB308"
                strokeWidth="1.5"
              />
              {/* Ribbon tails */}
              <path d="M-8 8 Q-25 45 -20 70" stroke="#EAB308" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M8 8 Q25 45 20 70" stroke="#EAB308" strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>
          </g>

          {/* FLOWER 1: Top Left - Blooming Sunflower */}
          <g id="flower-left" transform="translate(130, 150) rotate(-12)">
            {/* Petals */}
            {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg) => (
              <path
                key={deg}
                d="M0 0 C-10 -25 -6 -50 0 -60 C6 -50 10 -25 0 0"
                fill="url(#goldPetal1)"
                stroke="#CA8A04"
                strokeWidth="0.8"
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Inner smaller petal ring */}
            {[12, 36, 60, 84, 108, 132, 156, 180, 204, 228, 252, 276, 300, 324, 348].map((deg) => (
              <path
                key={deg}
                d="M0 0 C-8 -20 -4 -42 0 -48 C4 -42 8 -20 0 0"
                fill="url(#goldPetal2)"
                transform={`rotate(${deg})`}
                opacity="0.95"
              />
            ))}
            {/* Center Core */}
            <circle cx="0" cy="0" r="22" fill="url(#sunflowerCore)" />
            <circle cx="0" cy="0" r="18" fill="none" stroke="#CA8A04" strokeDasharray="3 2" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="11" fill="none" stroke="#FACC15" strokeDasharray="2 2" strokeWidth="1" />
          </g>

          {/* FLOWER 2: Top Right - Golden Rose / Yellow Tulip */}
          <g id="flower-right" transform="translate(270, 155) rotate(15)">
            {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg) => (
              <path
                key={deg}
                d="M0 0 C-10 -25 -6 -50 0 -60 C6 -50 10 -25 0 0"
                fill="url(#goldPetal1)"
                stroke="#CA8A04"
                strokeWidth="0.8"
                transform={`rotate(${deg})`}
              />
            ))}
            {[12, 36, 60, 84, 108, 132, 156, 180, 204, 228, 252, 276, 300, 324, 348].map((deg) => (
              <path
                key={deg}
                d="M0 0 C-7 -18 -3 -40 0 -45 C3 -40 7 -18 0 0"
                fill="url(#goldPetal2)"
                transform={`rotate(${deg})`}
              />
            ))}
            <circle cx="0" cy="0" r="20" fill="url(#sunflowerCore)" />
            <circle cx="0" cy="0" r="16" fill="none" stroke="#CA8A04" strokeDasharray="2 2" strokeWidth="1.2" />
          </g>

          {/* FLOWER 3: Big Center Glorious Sunflower */}
          <g id="flower-center" transform="translate(200, 110)">
            {/* Halo shine */}
            <circle cx="0" cy="0" r="65" fill="#FEF08A" opacity={bloomStage > 1 ? 0.4 : 0.2} filter="blur(6px)" />
            
            {/* Outer Petals */}
            {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((deg) => (
              <path
                key={deg}
                d="M0 0 C-12 -30 -8 -65 0 -76 C8 -65 12 -30 0 0"
                fill="url(#goldPetal1)"
                stroke="#EAB308"
                strokeWidth="0.8"
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Middle Layer Petals */}
            {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330, 350].map((deg) => (
              <path
                key={deg}
                d="M0 0 C-10 -25 -5 -54 0 -62 C5 -54 10 -25 0 0"
                fill="url(#goldPetal2)"
                stroke="#CA8A04"
                strokeWidth="0.5"
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Central Sun Disc with texture */}
            <circle cx="0" cy="0" r="28" fill="url(#sunflowerCore)" />
            <circle cx="0" cy="0" r="23" fill="none" stroke="#D97706" strokeDasharray="3 2" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="16" fill="none" stroke="#FBBF24" strokeDasharray="2 2" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="8" fill="#451A03" />
          </g>

          {/* FLOWER 4 & 5: Lower Sweet Daisies / Accent Blossoms */}
          <g id="daisy-left" transform="translate(155, 205)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <ellipse key={deg} cx="0" cy="-22" rx="6" ry="14" fill="#FEF9C3" stroke="#FACC15" strokeWidth="0.6" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="10" fill="#EAB308" />
          </g>

          <g id="daisy-right" transform="translate(245, 205)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <ellipse key={deg} cx="0" cy="-22" rx="6" ry="14" fill="#FEF9C3" stroke="#FACC15" strokeWidth="0.6" transform={`rotate(${deg})`} />
            ))}
            <circle cx="0" cy="0" r="10" fill="#EAB308" />
          </g>

          {/* Baby's Breath / Gypsophila white stars */}
          {[[110, 100], [290, 100], [90, 180], [310, 180], [200, 30]].map(([bx, by], idx) => (
            <g key={idx} transform={`translate(${bx}, ${by})`}>
              <circle cx="0" cy="0" r="4" fill="#FFFFFF" opacity="0.9" />
              <circle cx="-5" cy="-4" r="3" fill="#FFFBEB" opacity="0.8" />
              <circle cx="5" cy="-2" r="3" fill="#FFFBEB" opacity="0.8" />
            </g>
          ))}
        </svg>
      </div>

      {/* Interactive Action Button */}
      <div className="mt-4 flex flex-col items-center gap-3 z-10">
        <button
          onClick={triggerBloom}
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-sunflower-400 via-amber-400 to-sunflower-500 text-stone-900 font-sans font-semibold text-base shadow-lg shadow-sunflower-400/30 hover:shadow-sunflower-400/50 hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <Droplets className="w-5 h-5 text-amber-900 animate-bounce" />
          <span>¡Hacer florecer este ramo! 🌻</span>
          <Sparkles className="w-5 h-5 text-amber-900 group-hover:rotate-12 transition-transform" />
        </button>

        <p className="text-xs sm:text-sm text-stone-600 font-handwriting text-lg text-center">
          {bloomCount === 0 ? (
            'Toca el botón o el ramo para regarlo con amor y magia'
          ) : (
            <span className="text-amber-800 font-semibold">
              🌻 Has hecho florecer este ramo {bloomCount} {bloomCount === 1 ? 'vez' : 'veces'} para {recipientName}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
