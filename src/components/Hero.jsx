import React from 'react';
import { Heart, Sparkles, Mail, ArrowDown, Edit3 } from 'lucide-react';

export default function Hero({ recipientName, onOpenPersonalizer }) {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center text-center">
      {/* Aesthetic Top Tag with Sunflowers */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sunflower-100/90 border border-sunflower-300 text-sunflower-900 text-xs sm:text-sm font-sans font-semibold tracking-wide uppercase shadow-sm mb-6 animate-pulse">
        <span className="text-base">🌻</span>
        <span>21 de Septiembre · Día de las Flores Amarillas</span>
        <Sparkles className="w-3.5 h-3.5 text-sunflower-600" />
      </div>

      {/* Main Hero Title */}
      <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-stone-800 font-bold tracking-tight leading-tight max-w-3xl">
        Que nunca te falten tus{' '}
        <span className="relative inline-block text-sunflower-600 underline decoration-sunflower-300 decoration-wavy underline-offset-8">
          flores amarillas
        </span>
      </h1>

      {/* Dedicated to the Girl */}
      <div className="mt-4 flex items-center gap-2">
        <span className="font-serif italic text-stone-500 text-lg sm:text-xl">
          Especialmente dedicadas a:
        </span>
        <span className="font-handwriting text-3xl sm:text-4xl text-amber-900 font-bold tracking-wide">
          {recipientName} 💛
        </span>
      </div>

      {/* Warm Subtitle */}
      <p className="mt-5 text-base sm:text-lg md:text-xl text-stone-600 font-serif max-w-2xl leading-relaxed">
        Porque la primavera no empieza en el calendario, empieza cuando personas tan maravillosas como tú iluminan los días con su sonrisa.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => scrollToSection('ramo')}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-sunflower-400 hover:bg-sunflower-500 text-stone-900 font-sans font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <span>🌻 Ver mi Ramo Floral</span>
          <ArrowDown className="w-4 h-4 text-stone-900" />
        </button>

        <button
          onClick={() => scrollToSection('carta')}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white hover:bg-amber-50 text-stone-800 border border-amber-300 font-sans font-medium text-sm sm:text-base shadow-sm hover:shadow hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Mail className="w-4 h-4 text-amber-700" />
          <span>Abrir Carta Secreta</span>
        </button>

        <button
          onClick={onOpenPersonalizer}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-amber-100/90 hover:bg-amber-200/90 text-amber-950 border border-amber-300 font-sans font-medium text-sm sm:text-base shadow-sm hover:shadow hover:scale-105 active:scale-95 transition-all duration-200"
          title="Personalizar nombres y mensaje para regalar"
        >
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Personalizar</span>
        </button>
      </div>
    </header>
  );
}
