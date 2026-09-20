import React, { useState, useEffect } from 'react';
import { Play, Pause, Music2, Disc3, Sparkles } from 'lucide-react';
import {
  toggleMovieMusic,
  stopMovieMusic,
  subscribeMusicState,
  MOVIE_TRACKS,
} from '../utils/audioChimes';

export default function MusicPlayer({ bloomStage = 1 }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Active track corresponding to current bloom stage
  const currentTrack = MOVIE_TRACKS[bloomStage - 1] || MOVIE_TRACKS[0];

  // Subscribe to audio state so auto-play on bloom immediately starts vinyl spinning & indicator
  useEffect(() => {
    const unsubscribe = subscribeMusicState((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsubscribe();
      stopMovieMusic();
    };
  }, []);

  const handleToggle = () => {
    const nextState = toggleMovieMusic(bloomStage, (state) => {
      setIsPlaying(state);
    });
    setIsPlaying(nextState);
  };

  return (
    <aside
      aria-label="Banda Sonora de Los Juegos del Hambre"
      className="fixed bottom-4 right-3 sm:bottom-5 sm:right-6 z-40 flex items-center gap-2.5 sm:gap-3 bg-white/95 backdrop-blur-md pl-2.5 pr-3 sm:pl-3 sm:pr-4 py-2 sm:py-2.5 rounded-full border border-amber-300 shadow-polaroid hover:shadow-xl transition-all duration-300 max-w-[calc(100vw-1.5rem)] sm:max-w-none"
    >
      {/* Vinyl Disc Icon with spin & stage color */}
      <div
        className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-stone-900 border-2 flex items-center justify-center cursor-pointer transition-all duration-500 shadow-md shrink-0 ${
          isPlaying ? 'animate-spin-slow' : 'animate-spin-paused'
        }`}
        style={{ borderColor: currentTrack.vinylColor }}
        onClick={handleToggle}
        title={isPlaying ? 'Pausar música' : `Reproducir tema de ${currentTrack.movie}`}
      >
        <div
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-stone-800 flex items-center justify-center transition-colors duration-500"
          style={{ backgroundColor: currentTrack.vinylColor }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-stone-950" />
        </div>
      </div>

      {/* Info & Sound Bars */}
      <div className="flex flex-col pr-1 cursor-pointer select-none overflow-hidden" onClick={handleToggle}>
        <div className="flex items-center gap-1.5">
          <span className="font-handwriting text-sm sm:text-base font-bold text-amber-950 truncate max-w-[130px] min-[390px]:max-w-[170px] sm:max-w-[200px]">
            {currentTrack.title}
          </span>
          {isPlaying && (
            <span className="flex items-end gap-0.5 h-3 ml-0.5">
              <span className="w-0.5 h-2 bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3.5 bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-1.5 bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-stone-500 font-sans">
          <span className="font-semibold text-amber-800">{currentTrack.movie}</span>
          <span>•</span>
          <span className="italic">{isPlaying ? 'Sonando en vivo' : 'Toca para escuchar'}</span>
        </div>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handleToggle}
        className="p-2.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors shadow-xs"
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-amber-900 ml-0.5" />}
      </button>
    </aside>
  );
}
