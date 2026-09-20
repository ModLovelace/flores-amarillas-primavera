import React, { useState, useEffect } from 'react';
import PetalsCanvas from './components/PetalsCanvas';
import Hero from './components/Hero';
import InteractiveBouquet from './components/InteractiveBouquet';
import MusicPlayer from './components/MusicPlayer';
import ShareModal from './components/ShareModal';
import { getInitialDedication } from './utils/urlParams';
import { Heart, Sparkles, Share2 } from 'lucide-react';

export default function App() {
  const [dedication, setDedication] = useState(getInitialDedication);
  const [isPersonalizerOpen, setIsPersonalizerOpen] = useState(false);
  const [bloomStage, setBloomStage] = useState(1);

  // Sync title with recipient
  useEffect(() => {
    document.title = `🌻 Flores Amarillas para ${dedication.to} | Día de la Primavera`;
  }, [dedication.to]);

  return (
    <div className="relative min-h-screen flex flex-col font-sans selection:bg-sunflower-300 selection:text-stone-900">
      {/* Interactive Floating Petals Canvas */}
      <PetalsCanvas />

      {/* Aesthetic Top Navigation Bar */}
      <nav className="sticky top-0 z-30 w-full bg-cream-100/80 backdrop-blur-md border-b border-amber-200/50 px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">🌻</span>
            <span className="font-serif font-bold text-lg sm:text-xl text-stone-800 tracking-tight">
              Flores Amarillas
            </span>
            <span className="hidden sm:inline-block font-handwriting text-lg text-amber-700 ml-1">
              · 21 de Septiembre
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsPersonalizerOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-sunflower-300 hover:bg-sunflower-400 text-sunflower-950 text-xs sm:text-sm font-semibold transition-all shadow-sm hover:scale-105 active:scale-95"
              title="Personalizar nombres y dedicatoria"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Personalizar & Enviar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="flex-1 z-10 space-y-8 sm:space-y-16">
        {/* Section 1: Hero */}
        <Hero
          recipientName={dedication.to}
          onOpenPersonalizer={() => setIsPersonalizerOpen(true)}
        />

        {/* Section 2: Interactive Bouquet (The Hunger Games Edition) */}
        <section id="ramo" className="scroll-mt-16">
          <InteractiveBouquet
            recipientName={dedication.to}
            bloomStage={bloomStage}
            onStageChange={setBloomStage}
          />
        </section>
      </main>

      {/* Aesthetic Footer */}
      <footer className="relative z-10 mt-16 py-10 border-t border-amber-200/60 bg-cream-200/50 text-center text-stone-600 text-xs sm:text-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-amber-800 font-serif text-base font-semibold">
            <span>🌻</span>
            <span>Feliz Día de la Primavera & Flores Amarillas</span>
            <span>🌻</span>
          </div>
          <p className="font-handwriting text-xl text-stone-700 max-w-md">
            "Que cada día de tu vida tenga el color, la luz y la calidez del sol primaveral."
          </p>
          <div className="pt-2 text-stone-400 text-xs flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>para {dedication.to}</span>
          </div>
        </div>
      </footer>

      {/* Floating Retro Vinyl Audio Player (Sincronizado dinámicamente con las canciones) */}
      <MusicPlayer bloomStage={bloomStage} />

      {/* Modal for Personalizing Names and Link Sharing */}
      <ShareModal
        isOpen={isPersonalizerOpen}
        onClose={() => setIsPersonalizerOpen(false)}
        dedication={dedication}
        onUpdateDedication={setDedication}
      />
    </div>
  );
}
