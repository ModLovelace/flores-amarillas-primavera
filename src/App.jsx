import React, { useState, useEffect } from 'react';
import PetalsCanvas from './components/PetalsCanvas';
import Hero from './components/Hero';
import InteractiveBouquet from './components/InteractiveBouquet';
import EnvelopeLetter from './components/EnvelopeLetter';
import MusicPlayer from './components/MusicPlayer';
import BragModal from './components/BragModal';
import Watermark from './components/Watermark';
import ActionBanner from './components/ActionBanner';
import { getTheme } from './config/themes';
import {
  getInitialDedication,
  getUnresolvedShortId,
  writeShortCache
} from './utils/urlParams';
import { setDynamicFavicon } from './utils/favicon';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [dedication, setDedication] = useState(getInitialDedication);
  const [isBragModalOpen, setIsBragModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has('brag') || params.has('presumir');
    }
    return false;
  });
  const [bloomStage, setBloomStage] = useState(1);

  const currentTheme = getTheme(dedication.theme);

  // Hydrate /s/:id from /api/s if accessed without server-injected HTML (e.g., local Vite dev)
  useEffect(() => {
    const shortId = getUnresolvedShortId();
    if (!shortId) return;

    let active = true;
    fetch(`/api/s?id=${encodeURIComponent(shortId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!active || !payload?.ok || !payload.dedication) return;
        writeShortCache(payload.dedication, `${window.location.origin}/s/${shortId}`);
        setDedication(payload.dedication);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // Sync title and favicon with recipient and current theme
  useEffect(() => {
    document.title = `${currentTheme.shortName} para ${dedication.to}`;
    setDynamicFavicon(currentTheme.id, currentTheme.emoji);
  }, [dedication.to, currentTheme]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`relative min-h-screen flex flex-col font-sans transition-colors duration-700 selection:bg-amber-300 selection:text-stone-900 ${currentTheme.palette.bgGradient}`}>
      {/* Dynamic Floating Particles Canvas */}
      <PetalsCanvas themeId={currentTheme.id} />

      {/* Clean Top Navigation Bar: ocasión actual + botón Presumir */}
      <nav className="sticky top-0 z-30 w-full bg-white/75 backdrop-blur-md border-b border-stone-200/60 px-4 sm:px-8 py-2.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 border border-stone-200/80 text-stone-800 text-xs sm:text-sm font-semibold shadow-2xs select-none">
            <span className="text-base">{currentTheme.emoji}</span>
            <span className="font-serif font-bold text-stone-900 tracking-tight">
              {currentTheme.shortName}
            </span>
          </div>

          <button
            onClick={() => setIsBragModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-pink-500 to-rose-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
            title="Presumir este momento en TikTok e Instagram"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
            <span>Presumir</span>
          </button>
        </div>
      </nav>

      {/* Main Content Sections in Sequential Narrative Order */}
      <main className="flex-1 z-10 space-y-6 sm:space-y-12">
        {/* Section 1: Primera Dedicatoria + Banner a lo ancho Ver Pastel & Velas */}
        <Hero
          theme={currentTheme}
          recipientName={dedication.to}
        />

        {/* Section 2: Pastel / Pieza Central Interactiva + Botón Encender Velas & Pedir Deseo */}
        <section id="ramo" className="scroll-mt-16">
          <InteractiveBouquet
            recipientName={dedication.to}
            theme={currentTheme}
            bloomStage={bloomStage}
            onStageChange={setBloomStage}
          />
        </section>

        {/* Banner a lo ancho para continuar bajando a la Carta Secreta */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
          <ActionBanner
            dataBanner="carta"
            onClick={() => scrollToSection('carta')}
            emoji="💌"
            title="Carta Secreta"
            subtitle="Sigue bajando para descubrir tus palabras especiales"
            className={currentTheme.palette.buttonGradient}
            chipClassName="bg-white/45 text-stone-900"
          />
        </div>

        {/* Section 3: Sobre con Sello de Cera y Animación para Abrir la Carta */}
        <EnvelopeLetter
          theme={currentTheme}
          recipientName={dedication.to}
          senderName={dedication.from}
          message={dedication.message}
          date={dedication.date}
        />

        {/* Final Full-width CTA: Presumir */}
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-2">
          <ActionBanner
            dataBanner="presumir"
            onClick={() => setIsBragModalOpen(true)}
            LeadingIcon={Sparkles}
            TrailingIcon={Sparkles}
            animateTrailing={false}
            title="Presumir"
            subtitle="Presume este detalle especial en TikTok e Instagram"
            titleAttr="Presumir este momento en TikTok e Instagram"
            className="bg-gradient-to-r from-amber-500 via-pink-500 to-rose-600 hover:from-amber-600 hover:via-pink-600 hover:to-rose-700 text-white"
            chipClassName="bg-white/20 text-yellow-200"
          />
        </div>
      </main>

      {/* Aesthetic Footer */}
      <footer className="relative z-10 mt-14 pt-10 pb-36 sm:pb-24 border-t border-stone-200/60 bg-white/40 text-center text-stone-600 text-xs sm:text-sm">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-stone-800 font-serif text-base font-semibold">
            <span>{currentTheme.emoji}</span>
            <span>{currentTheme.name}</span>
            <span>{currentTheme.emoji}</span>
          </div>
          <p className="font-handwriting text-xl text-stone-700 max-w-md">
            "{currentTheme.tagline}"
          </p>
          <div className="pt-2 text-stone-400 text-xs flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>para {dedication.to}</span>
          </div>
          <div className="pt-1 flex items-center justify-center text-stone-500 text-xs">
            <a
              href="https://modlovelace.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-900 underline underline-offset-4 decoration-blue-400 font-medium"
            >
              modlovelace.com
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Retro Vinyl Audio Player (Sincronizado dinámicamente) */}
      <MusicPlayer bloomStage={bloomStage} themeId={currentTheme.id} />

      {/* Floating Author Brand Pill */}
      <Watermark />

      {/* Modal for Boasting on TikTok & Instagram */}
      <BragModal
        isOpen={isBragModalOpen}
        onClose={() => setIsBragModalOpen(false)}
        themeId={currentTheme.id}
        recipientName={dedication.to}
        senderName={dedication.from}
        dedication={dedication}
      />
    </div>
  );
}
