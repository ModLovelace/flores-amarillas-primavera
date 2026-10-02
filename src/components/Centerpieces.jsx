import React from 'react';

/**
 * 🌻 Flores Amarillas Bouquet SVG Centerpiece
 */
export function SunflowerBouquetSVG({ bloomStage = 1 }) {
  return (
    <svg
      viewBox="0 0 520 620"
      className="w-full h-full drop-shadow-xl select-none transition-all duration-700 overflow-visible"
    >
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FACC15" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldStem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803D" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id="goldPetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="60%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      {/* Ambient Sunburst */}
      <circle cx="260" cy="270" r="180" fill="url(#sunGlow)" className="animate-pulse" />

      {/* Main Bouquet Stems */}
      <g stroke="url(#goldStem)" strokeWidth="4.5" strokeLinecap="round">
        <path d="M260 520 Q240 420 220 320" />
        <path d="M260 520 Q275 420 300 320" />
        <path d="M260 520 Q255 400 260 270" />
        <path d="M260 520 Q215 450 170 340" />
        <path d="M260 520 Q305 450 350 340" />
      </g>

      {/* Botanical Leaves */}
      <g fill="#22C55E" opacity="0.9">
        <path d="M230 420 Q170 380 150 430 Q200 460 230 420 Z" />
        <path d="M290 420 Q350 380 370 430 Q320 460 290 420 Z" />
        <path d="M245 360 Q190 320 180 370 Q225 390 245 360 Z" />
        <path d="M275 360 Q330 320 340 370 Q295 390 275 360 Z" />
      </g>

      {/* Left Sunflower */}
      <g transform="translate(180, 290) scale(0.9)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-32"
            rx="8"
            ry="24"
            fill="url(#goldPetal)"
            stroke="#CA8A04"
            strokeWidth="0.8"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="22" fill="#78350F" stroke="#CA8A04" strokeWidth="2" />
        <circle cx="0" cy="0" r="16" fill="#451A03" />
      </g>

      {/* Right Sunflower */}
      <g transform="translate(340, 290) scale(0.9)">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-32"
            rx="8"
            ry="24"
            fill="url(#goldPetal)"
            stroke="#CA8A04"
            strokeWidth="0.8"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="22" fill="#78350F" stroke="#CA8A04" strokeWidth="2" />
        <circle cx="0" cy="0" r="16" fill="#451A03" />
      </g>

      {/* Grand Central Sunflower */}
      <g transform="translate(260, 230) scale(1.15)">
        {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-40"
            rx="10"
            ry="30"
            fill="url(#goldPetal)"
            stroke="#CA8A04"
            strokeWidth="1"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="28" fill="#78350F" stroke="#EAB308" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="20" fill="#451A03" />
        <circle cx="-5" cy="-5" r="4" fill="#CA8A04" opacity="0.7" />
      </g>

      {/* Stage 3+: Fluttering Golden Butterfly */}
      {bloomStage >= 3 && (
        <g transform="translate(370, 150) rotate(15)" className="animate-bounce">
          <ellipse cx="-10" cy="-8" rx="10" ry="16" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" transform="rotate(-30 -10 -8)" />
          <ellipse cx="10" cy="-8" rx="10" ry="16" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" transform="rotate(30 10 -8)" />
          <ellipse cx="0" cy="0" rx="3" ry="12" fill="#78350F" />
        </g>
      )}

      {/* Ribbon Bow */}
      <g transform="translate(260, 480)">
        <ellipse cx="-20" cy="0" rx="20" ry="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" transform="rotate(-15 -20 0)" />
        <ellipse cx="20" cy="0" rx="20" ry="10" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" transform="rotate(15 20 0)" />
        <circle cx="0" cy="0" r="8" fill="#EAB308" stroke="#78350F" strokeWidth="1.5" />
        <path d="M-8 8 Q-25 35 -15 50" stroke="#CA8A04" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M8 8 Q25 35 15 50" stroke="#CA8A04" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/**
 * 🎂 Feliz Cumpleaños Aesthetic Cake SVG Centerpiece
 */
export function BirthdayCakeSVG({ bloomStage = 1 }) {
  const isCandleLit = bloomStage >= 2;
  const isSparklers = bloomStage >= 3;

  return (
    <svg
      viewBox="0 0 520 620"
      className="w-full h-full drop-shadow-xl select-none transition-all duration-700 overflow-visible"
    >
      <defs>
        <radialGradient id="cakeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FBCFE8" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#F472B6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="candleFlame" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FDE047" />
          <stop offset="80%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* Ambient Birthday Glow */}
      <circle cx="260" cy="280" r="190" fill="url(#cakeGlow)" className="animate-pulse" />

      {/* Decorative Plate Stand */}
      <ellipse cx="260" cy="510" rx="190" ry="24" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="3" />
      <path d="M220 515 L200 545 L320 545 L300 515 Z" fill="#CBD5E1" />

      {/* BOTTOM TIER (Strawberry & Vanilla Cake) */}
      <g>
        <rect x="130" y="380" width="260" height="110" rx="14" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="2.5" />
        {/* Frosting Drips */}
        <path
          d="M130 395 Q145 425 160 395 Q175 430 190 395 Q210 435 230 395 Q250 430 270 395 Q290 435 310 395 Q330 425 350 395 Q370 430 390 395 L390 380 L130 380 Z"
          fill="#FB7185"
        />
        {/* Strawberry Pearls */}
        {[160, 200, 240, 280, 320, 360].map((x, i) => (
          <circle key={i} cx={x} cy="450" r="7" fill="#E11D48" stroke="#FFF" strokeWidth="1" />
        ))}
      </g>

      {/* TOP TIER */}
      <g>
        <rect x="175" y="270" width="170" height="110" rx="12" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="2.5" />
        {/* Top Frosting Waves */}
        <path
          d="M175 285 Q190 310 205 285 Q220 315 235 285 Q255 315 275 285 Q295 315 315 285 Q330 310 345 285 L345 270 L175 270 Z"
          fill="#FDE047"
        />
        {/* Fresh Raspberries / Cherries on Top Tier */}
        {[205, 235, 265, 295, 325].map((x, i) => (
          <circle key={i} cx={x} cy="335" r="5.5" fill="#EC4899" />
        ))}
      </g>

      {/* Edible Macaron & Floral Decor */}
      <ellipse cx="160" cy="380" rx="14" ry="9" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1" />
      <ellipse cx="360" cy="380" rx="14" ry="9" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
      <circle cx="260" cy="270" r="10" fill="#F43F5E" />

      {/* CANDLES */}
      {[-45, 0, 45].map((offX, idx) => (
        <g key={idx} transform={`translate(${260 + offX}, 200)`}>
          {/* Candle stick with cute stripes */}
          <rect x="-5" y="10" width="10" height="60" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
          <line x1="-5" y1="25" x2="5" y2="30" stroke="#F43F5E" strokeWidth="2" />
          <line x1="-5" y1="45" x2="5" y2="50" stroke="#F43F5E" strokeWidth="2" />
          {/* Wick */}
          <line x1="0" y1="10" x2="0" y2="3" stroke="#451A03" strokeWidth="1.5" />

          {/* Flame (lights up on stage >= 2) */}
          {isCandleLit && (
            <g className="animate-pulse" style={{ animationDuration: `${0.8 + idx * 0.2}s` }}>
              <ellipse cx="0" cy="-8" rx="6" ry="12" fill="url(#candleFlame)" />
              <circle cx="0" cy="-5" r="3" fill="#FFFFFF" />
            </g>
          )}
        </g>
      ))}

      {/* Stage 3+: Sparklers & Fireworks */}
      {isSparklers && (
        <g>
          {/* Sparkler stars around cake */}
          {[
            { x: 120, y: 220, s: 14, color: '#FACC15' },
            { x: 400, y: 220, s: 14, color: '#F472B6' },
            { x: 160, y: 150, s: 16, color: '#38BDF8' },
            { x: 360, y: 150, s: 16, color: '#FBBF24' },
          ].map((st, i) => (
            <g key={i} transform={`translate(${st.x}, ${st.y})`} className="animate-bounce">
              <path
                d={`M0 -${st.s} Q0 0 ${st.s} 0 Q0 0 0 ${st.s} Q0 0 -${st.s} 0 Q0 0 0 -${st.s} Z`}
                fill={st.color}
              />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

/**
 * 🎓 Logro Profesional & Triunfo Trophy SVG Centerpiece
 */
export function TrophyLaurelSVG({ bloomStage = 1 }) {
  return (
    <svg
      viewBox="0 0 520 620"
      className="w-full h-full drop-shadow-xl select-none transition-all duration-700 overflow-visible"
    >
      <defs>
        <radialGradient id="trophyGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#34D399" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#059669" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="goldTrophy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="40%" stopColor="#FDE047" />
          <stop offset="80%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>

      {/* Ambient Success Glow */}
      <circle cx="260" cy="270" r="190" fill="url(#trophyGlow)" className="animate-pulse" />

      {/* Laurel Wreath Crown (Left and Right Leaves) */}
      <g fill="#10B981" stroke="#047857" strokeWidth="1.5">
        {/* Left Laurel Leaves */}
        {[-80, -50, -20, 10, 40, 70, 100].map((deg, i) => (
          <ellipse
            key={`l-${i}`}
            cx={150 + Math.sin(deg * 0.02) * 40}
            cy={260 - deg * 1.5}
            rx="12"
            ry="24"
            transform={`rotate(${deg * 0.4} 150 260)`}
          />
        ))}
        {/* Right Laurel Leaves */}
        {[-80, -50, -20, 10, 40, 70, 100].map((deg, i) => (
          <ellipse
            key={`r-${i}`}
            cx={370 - Math.sin(deg * 0.02) * 40}
            cy={260 - deg * 1.5}
            rx="12"
            ry="24"
            transform={`rotate(${-deg * 0.4} 370 260)`}
          />
        ))}
      </g>

      {/* Pedestal Base */}
      <g>
        <rect x="180" y="470" width="160" height="40" rx="6" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
        <rect x="200" y="440" width="120" height="30" rx="4" fill="#334155" />
        <rect x="220" y="410" width="80" height="30" fill="url(#goldTrophy)" />
      </g>

      {/* Trophy Cup Body */}
      <path
        d="M170 190 Q170 350 260 380 Q350 350 350 190 Z"
        fill="url(#goldTrophy)"
        stroke="#CA8A04"
        strokeWidth="3"
      />

      {/* Cup Handles */}
      <path
        d="M175 220 Q120 220 125 290 Q130 340 185 320"
        stroke="url(#goldTrophy)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M345 220 Q400 220 395 290 Q390 340 335 320"
        stroke="url(#goldTrophy)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />

      {/* Central Star on Cup */}
      <g transform="translate(260, 260) scale(1.3)">
        <polygon
          points="0,-16 4.9,-4.9 16.8,-4.9 7.4,2.5 10.5,14 0,7.2 -10.5,14 -7.4,2.5 -16.8,-4.9 -4.9,-4.9"
          fill="#FFFBEB"
          stroke="#78350F"
          strokeWidth="1"
        />
      </g>

      {/* Graduation Scroll / Diploma in Foreground */}
      <g transform="translate(260, 485) rotate(-5)">
        <rect x="-60" y="-12" width="120" height="24" rx="10" fill="#FFFDF5" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="-8" y="-14" width="16" height="28" fill="#E11D48" rx="2" />
      </g>

      {/* Stage 3+: Sparkling Constellations */}
      {bloomStage >= 3 && (
        <g>
          {[
            { x: 190, y: 120, s: 15 },
            { x: 330, y: 120, s: 15 },
            { x: 260, y: 90, s: 20 },
          ].map((st, i) => (
            <g key={i} transform={`translate(${st.x}, ${st.y})`} className="animate-pulse">
              <path
                d={`M0 -${st.s} Q0 0 ${st.s} 0 Q0 0 0 ${st.s} Q0 0 -${st.s} 0 Q0 0 0 -${st.s} Z`}
                fill="#FBBF24"
              />
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}

/**
 * 💖 Aniversario & Amor Bouquet of Roses SVG Centerpiece
 */
export function RosesBouquetSVG({ bloomStage = 1 }) {
  return (
    <svg
      viewBox="0 0 520 620"
      className="w-full h-full drop-shadow-xl select-none transition-all duration-700 overflow-visible"
    >
      <defs>
        <radialGradient id="roseGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FECDD3" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#F43F5E" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#E11D48" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="crimsonRose" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FB7185" />
          <stop offset="50%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>
      </defs>

      {/* Romantic Pink Glow */}
      <circle cx="260" cy="270" r="190" fill="url(#roseGlow)" className="animate-pulse" />

      {/* Stems */}
      <g stroke="#15803D" strokeWidth="4.5" strokeLinecap="round">
        <path d="M260 520 Q240 430 210 340" />
        <path d="M260 520 Q275 430 310 340" />
        <path d="M260 520 Q255 400 260 280" />
        <path d="M260 520 Q220 460 160 360" />
        <path d="M260 520 Q300 460 360 360" />
      </g>

      {/* Deep Green Leaves */}
      <g fill="#166534">
        <path d="M220 430 Q160 400 150 440 Q190 470 220 430 Z" />
        <path d="M300 430 Q360 400 370 440 Q330 470 300 430 Z" />
      </g>

      {/* Rose 1 (Left Pink Peony/Rose) */}
      <g transform="translate(190, 310) scale(0.95)">
        <circle cx="0" cy="0" r="38" fill="#F43F5E" />
        <path d="M-20 -10 Q0 -30 20 -10 Q25 15 0 25 Q-25 15 -20 -10 Z" fill="#E11D48" />
        <circle cx="0" cy="0" r="18" fill="#FB7185" />
        <circle cx="0" cy="0" r="10" fill="#FFE4E6" />
      </g>

      {/* Rose 2 (Right Crimson Rose) */}
      <g transform="translate(330, 310) scale(0.95)">
        <circle cx="0" cy="0" r="38" fill="#BE123C" />
        <path d="M-20 -10 Q0 -30 20 -10 Q25 15 0 25 Q-25 15 -20 -10 Z" fill="#9F1239" />
        <circle cx="0" cy="0" r="18" fill="#E11D48" />
        <circle cx="0" cy="0" r="10" fill="#FECDD3" />
      </g>

      {/* Main Center Rose (Grand Crimson Rose) */}
      <g transform="translate(260, 240) scale(1.2)">
        <circle cx="0" cy="0" r="44" fill="url(#crimsonRose)" stroke="#881337" strokeWidth="2" />
        <path d="M-26 -12 Q0 -36 26 -12 Q32 20 0 32 Q-32 20 -26 -12 Z" fill="#881337" />
        <circle cx="0" cy="0" r="24" fill="#E11D48" />
        <circle cx="0" cy="0" r="14" fill="#FB7185" />
        <circle cx="0" cy="0" r="6" fill="#FFF1F2" />
      </g>

      {/* Floating Golden Heart / Butterflies */}
      {bloomStage >= 2 && (
        <g transform="translate(360, 160)" className="animate-bounce">
          <path
            d="M0 6 Q-12 -10 0 -18 Q12 -10 0 6 Z"
            fill="#FACC15"
            stroke="#CA8A04"
            strokeWidth="1.5"
            transform="scale(1.5)"
          />
        </g>
      )}

      {/* Satin Ribbon & Bow */}
      <g transform="translate(260, 480)">
        <ellipse cx="-22" cy="0" rx="22" ry="11" fill="#E11D48" stroke="#881337" strokeWidth="2" transform="rotate(-15 -22 0)" />
        <ellipse cx="22" cy="0" rx="22" ry="11" fill="#E11D48" stroke="#881337" strokeWidth="2" transform="rotate(15 22 0)" />
        <circle cx="0" cy="0" r="9" fill="#BE123C" stroke="#FFF" strokeWidth="1.5" />
        <path d="M-8 8 Q-30 35 -18 55" stroke="#E11D48" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M8 8 Q30 35 18 55" stroke="#E11D48" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}
