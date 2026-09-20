import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { toggleAmbientMelody, stopAmbientMelody } from '../utils/audioChimes';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleToggle = () => {
    const nextState = toggleAmbientMelody((state) => {
      setIsPlaying(state);
    });
    setIsPlaying(nextState);
  };

  useEffect(() => {
    return () => {
      stopAmbientMelody();
    };
  }, []);

  return (
    <aside
      aria-label="Reproductor de música de fondo"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-3 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-amber-200/80 shadow-polaroid hover:shadow-lg transition-all duration-300"
    >
      {/* Vinyl Disc Icon with spin */}
      <div
        className={`relative w-10 h-10 rounded-full bg-stone-900 border-2 border-amber-400 flex items-center justify-center cursor-pointer transition-transform ${
          isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
        }`}
        onClick={handleToggle}
        title={isPlaying ? 'Pausar melodía' : 'Reproducir melodía romántica'}
      >
        <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-stone-900" />
        </div>
      </div>

      {/* Info & Sound Bars */}
      <div className="flex flex-col pr-1 cursor-pointer" onClick={handleToggle}>
        <div className="flex items-center gap-1.5">
          <span className="font-handwriting text-base font-bold text-amber-900">
            Flores Amarillas
          </span>
          {isPlaying && (
            <span className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-2 bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3 bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-1.5 bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </div>
        <span className="text-[10px] text-stone-500 font-sans">
          {isPlaying ? 'Melodía romántica sonando' : 'Toca para activar melodía'}
        </span>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handleToggle}
        className="p-2 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-amber-900 ml-0.5" />}
      </button>
    </aside>
  );
}
