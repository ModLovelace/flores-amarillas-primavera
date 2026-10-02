import React, { useState, useEffect } from 'react';
import PetalsCanvas from './components/PetalsCanvas';
import Hero from './components/Hero';
import InteractiveBouquet from './components/InteractiveBouquet';
import EnvelopeLetter from './components/EnvelopeLetter';
import MusicPlayer from './components/MusicPlayer';
import ShareModal from './components/ShareModal';
import BragModal from './components/BragModal';
import { ThemeModal } from './components/ThemeSelector';
import { getTheme } from './config/themes';
import { getInitialDedication, saveDedicationToStorage } from './utils/urlParams';
import { switchMovieStageMusic } from './utils/audioChimes';
import { Heart, Sparkles, Share2, Palette } from 'lucide-react';

export default function App() {
  const [dedication, setDedication] = useState(getInitialDedication);
  const [isPersonalizerOpen, setIsPersonalizerOpen] = useState(false);
  const [isBragModalOpen, setIsBragModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [bloomStage, setBloomStage] = useState(1);

  const currentTheme = getTheme(dedication.theme);

  // Sync title with recipient and current theme
  useEffect(() => {
    document.title = `${currentTheme.emoji} ${currentTheme.shortName} para ${dedication.to}`;
  }, [dedication.to, currentTheme]);

  const handleSelectTheme = (newThemeId) => {
    const newTheme = getTheme(newThemeId);
    setDedication((prev) => {
      const isDefaultMsg = prev.message === currentTheme.defaultMessage;
      const isDefaultDate = prev.date === currentTheme.defaultDate;
      const updated = {
        ...prev,
        theme: newThemeId,
        message: isDefaultMsg ? newTheme.defaultMessage : prev.message,
        date: isDefaultDate ? newTheme.defaultDate : prev.date
      };
      saveDedicationToStorage(updated);
      return updated;
    });
    // Switch music track to match new theme
    switchMovieStageMusic(bloomStage, newThemeId);
  };

  const handleUpdateDedication = (newData) => {
    setDedication(newData);
    saveDedicationToStorage(newData);
    if (newData.theme && newData.theme !== currentTheme.id) {
      switchMovieStageMusic(bloomStage, newData.theme);
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col font-sans transition-colors duration-700 selection:bg-amber-300 selection:text-stone-900 ${currentTheme.palette.bgGradient}`}>
      {/* Dynamic Floating Particles Canvas */}
      <PetalsCanvas themeId={currentTheme.id} />

      {/* Aesthetic Top Navigation Bar */}
      <nav className="sticky top-0 z-30 w-full bg-white/75 backdrop-blur-md border-b border-stone-200/60 px-4 sm:px-8 py-2.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo & Theme Picker Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs hover:scale-105 active:scale-95 group"
              title="Cambiar ocasión o temática"
            >
              <span className="text-base group-hover:scale-110 transition-transform">{currentTheme.emoji}</span>
              <span className="font-serif font-bold text-stone-900 tracking-tight">
                {currentTheme.shortName}
              </span>
              <Palette className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 ml-0.5" />
            </button>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsBragModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-rose-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:scale-105 active:scale-95"
              title="Presumir este momento en TikTok e Instagram"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>Presumir</span>
            </button>

            <button
              onClick={() => setIsPersonalizerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 text-xs sm:text-sm font-semibold transition-all shadow-xs hover:scale-105 active:scale-95"
              title="Personalizar nombres y dedicatoria"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Personalizar &</span>
              <span>Enviar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <main className="flex-1 z-10 space-y-8 sm:space-y-16">
        {/* Section 1: Hero with Occasion Pills */}
        <Hero
          theme={currentTheme}
          recipientName={dedication.to}
          onOpenPersonalizer={() => setIsPersonalizerOpen(true)}
          onOpenBrag={() => setIsBragModalOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onSelectTheme={handleSelectTheme}
        />

        {/* Section 2: Interactive Centerpiece (Flores / Pastel / Trofeo / Rosas) */}
        <section id="ramo" className="scroll-mt-16">
          <InteractiveBouquet
            recipientName={dedication.to}
            theme={currentTheme}
            bloomStage={bloomStage}
            onStageChange={setBloomStage}
            onOpenBrag={() => setIsBragModalOpen(true)}
          />
        </section>

        {/* Section 3: Wax Sealed Envelope with Letter */}
        <section id="carta" className="scroll-mt-16">
          <EnvelopeLetter
            theme={currentTheme}
            recipientName={dedication.to}
            senderName={dedication.from}
            message={dedication.message}
            date={dedication.date}
          />
        </section>
      </main>

      {/* Aesthetic Footer */}
      <footer className="relative z-10 mt-16 py-10 border-t border-stone-200/60 bg-white/40 text-center text-stone-600 text-xs sm:text-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-stone-800 font-serif text-base font-semibold">
            <span>{currentTheme.emoji}</span>
            <span>{currentTheme.name}</span>
            <span>{currentTheme.emoji}</span>
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

      {/* Floating Retro Vinyl Audio Player (Sincronizado dinámicamente) */}
      <MusicPlayer bloomStage={bloomStage} themeId={currentTheme.id} />

      {/* Modal for Selecting Occasion / Theme */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeThemeId={currentTheme.id}
        onSelectTheme={handleSelectTheme}
      />

      {/* Modal for Personalizing Names, Occasion and Link Sharing */}
      <ShareModal
        isOpen={isPersonalizerOpen}
        onClose={() => setIsPersonalizerOpen(false)}
        dedication={dedication}
        onUpdateDedication={handleUpdateDedication}
      />

      {/* Modal for Boasting on TikTok & Instagram */}
      <BragModal
        isOpen={isBragModalOpen}
        onClose={() => setIsBragModalOpen(false)}
        themeId={currentTheme.id}
        recipientName={dedication.to}
        senderName={dedication.from}
      />
    </div>
  );
}
