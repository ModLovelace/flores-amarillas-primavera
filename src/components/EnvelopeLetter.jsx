import React, { useState } from 'react';
import { Mail, Heart, Sparkles, X, ChevronUp, Feather } from 'lucide-react';
import { playPaperSound } from '../utils/audioChimes';

export default function EnvelopeLetter({ recipientName, senderName, message, date }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    playPaperSound();
    setIsOpen(!isOpen);
  };

  return (
    <section id="carta" className="py-16 px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
      {/* Title & Introduction */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold tracking-wider uppercase mb-3">
          <Feather className="w-3.5 h-3.5" />
          <span>Palabras del Corazón</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-800 font-semibold">
          Una Carta Especial para Ti
        </h2>
        <p className="text-stone-600 font-handwriting text-xl sm:text-2xl mt-1">
          {isOpen ? 'Leída con todo el amor del mundo' : 'Haz clic en el sello de cera para abrirla'}
        </p>
      </div>

      {/* Envelope Container */}
      <div className="relative w-full max-w-lg flex flex-col items-center">
        
        {/* The Envelope Graphic */}
        <div 
          onClick={handleToggle}
          className="relative w-72 sm:w-96 h-48 sm:h-60 bg-[#F5EBE1] border-2 border-[#E3D3C4] rounded-lg shadow-paper cursor-pointer transition-transform duration-300 hover:scale-[1.02] flex items-center justify-center select-none overflow-visible"
        >
          {/* Top Washi Tape Deco */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-28 h-7 washi-tape rotate-[-1.5deg] z-20 rounded-sm opacity-90" />

          {/* Envelope Diagonal Lines (Fold lines) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            {/* Bottom fold */}
            <polygon points="0,240 192,130 384,240" fill="#EBDCCE" opacity="0.6" />
            {/* Left flap */}
            <polygon points="0,0 160,120 0,240" fill="#ECDDCF" opacity="0.4" />
            {/* Right flap */}
            <polygon points="384,0 224,120 384,240" fill="#ECDDCF" opacity="0.4" />
          </svg>

          {/* Letter Peeking out when closed */}
          {!isOpen && (
            <div className="absolute top-2 w-[85%] h-12 bg-amber-50/90 rounded-t border border-amber-200/50 shadow-sm flex items-center justify-center transition-all duration-500">
              <span className="font-handwriting text-stone-600 text-sm tracking-wider">
                De: {senderName} 💛
              </span>
            </div>
          )}

          {/* Wax Seal Button (Golden Sunflower) */}
          <div
            className={`absolute z-30 flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 border-4 border-amber-300/80 shadow-wax-seal transition-all duration-500 ${
              isOpen ? 'scale-75 opacity-70 -translate-y-8' : 'animate-pulse hover:scale-110'
            }`}
          >
            <div className="flex flex-col items-center text-amber-950 font-serif">
              <Sparkles className="w-5 h-5 text-amber-900" />
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-tighter">
                {isOpen ? 'CERRAR' : 'ABRIR'}
              </span>
            </div>
          </div>

          {/* Recipient Label on Envelope */}
          <div className="absolute bottom-4 left-6 right-6 text-left pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-sans block">Para:</span>
            <span className="font-handwriting text-xl sm:text-2xl text-stone-800 font-bold block truncate">
              {recipientName}
            </span>
          </div>
        </div>

        {/* The Letter Modal / Card (Slides out gracefully) */}
        {isOpen && (
          <div className="w-full mt-6 bg-[#FCFBF7] border border-amber-200/80 rounded-2xl p-6 sm:p-10 shadow-polaroid relative animate-in fade-in zoom-in-95 duration-500">
            {/* Scrapbook Details: Washi tapes */}
            <div className="absolute -top-3 left-8 w-24 h-6 washi-tape-sage rotate-[-2deg]" />
            <div className="absolute -top-3 right-8 w-24 h-6 washi-tape-pink rotate-[2deg]" />

            {/* Close cross button */}
            <button
              onClick={handleToggle}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-amber-100 text-stone-500 hover:text-stone-800 transition-colors"
              title="Guardar carta"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="border-b border-amber-200/60 pb-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="font-handwriting text-2xl sm:text-3xl text-amber-900 font-bold">
                  Querida {recipientName},
                </span>
                <span className="font-serif italic text-stone-500 text-sm">
                  {date} · Día de la Primavera
                </span>
              </div>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 font-serif text-base sm:text-lg text-stone-700 leading-relaxed">
              <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-amber-600 first-letter:mr-2 first-letter:float-left">
                Dicen que la primavera llega para despertar a la tierra con flores y colores, pero la verdad es que desde que estás aquí, contigo florece todo.
              </p>
              
              <p>
                Hoy, 21 de septiembre, la tradición cuenta que quien te regala flores amarillas te está prometiendo amor sincero, luz y un compromiso de cuidarte y verte sonreír siempre. Y tú te mereces no solo un ramo, sino un campo entero lleno de girasoles y luz.
              </p>

              <blockquote className="my-6 p-4 rounded-xl bg-amber-50/70 border-l-4 border-amber-400 font-handwriting text-xl sm:text-2xl text-amber-950 italic">
                &ldquo;Él la estaba esperando con una flor amarilla... y ella supo que los sueños más bonitos sí se cumplen cuando estás con la persona correcta.&rdquo;
              </blockquote>

              <p>
                {message}
              </p>
            </div>

            {/* Letter Footer / Signature */}
            <div className="mt-8 pt-6 border-t border-amber-200/60 flex flex-col items-end">
              <span className="font-serif italic text-sm text-stone-500">Con todo mi cariño,</span>
              <span className="font-handwriting text-2xl sm:text-3xl text-amber-900 font-bold mt-1">
                {senderName} 🌻💛
              </span>
            </div>

            {/* Close Action */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleToggle}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs sm:text-sm font-sans font-medium transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
                <span>Volver a guardar en el sobre</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
