// Audio synthesis using standard Web Audio API (no external MP3 required, zero latency)
let audioCtx = null;
let musicMasterGain = null;
let activeMusicOscillators = [];
let activeMusicInterval = null;
let activeMusicTimeouts = [];
let isMusicPlaying = false;
let currentActiveStage = 1;
let currentActiveTheme = 'flores-amarillas';
const musicListeners = new Set();

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function getMusicMasterGain(ctx) {
  if (!musicMasterGain) {
    musicMasterGain = ctx.createGain();
    musicMasterGain.gain.setValueAtTime(1.0, ctx.currentTime);
    musicMasterGain.connect(ctx.destination);
  }
  return musicMasterGain;
}

/**
 * Stop and purge all active music notes and intervals immediately.
 * Guaranteed zero overlap.
 */
export function stopAllMusicAudio() {
  if (activeMusicInterval) {
    clearInterval(activeMusicInterval);
    activeMusicInterval = null;
  }

  activeMusicTimeouts.forEach((t) => clearTimeout(t));
  activeMusicTimeouts = [];

  activeMusicOscillators.forEach((osc) => {
    try {
      osc.stop(0);
      osc.disconnect();
    } catch (e) {}
  });
  activeMusicOscillators = [];

  if (audioCtx && musicMasterGain) {
    try {
      const now = audioCtx.currentTime;
      musicMasterGain.gain.cancelScheduledValues(now);
      musicMasterGain.gain.setValueAtTime(0, now);
      musicMasterGain.gain.setValueAtTime(1.0, now + 0.02);
    } catch (e) {}
  }
}

/**
 * Play an acoustic note with warm celesta/guitar harmonic envelope
 */
function playAcousticNote(ctx, freq, time, duration = 0.8, volume = 0.05, type = 'sine') {
  if (!isMusicPlaying) return;

  try {
    const masterGain = getMusicMasterGain(ctx);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(volume, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    osc.start(time);
    osc.stop(time + duration);

    activeMusicOscillators.push(osc);
    osc.onended = () => {
      activeMusicOscillators = activeMusicOscillators.filter((o) => o !== osc);
      try {
        osc.disconnect();
        gain.disconnect();
        filter.disconnect();
      } catch (e) {}
    };
  } catch (err) {
    console.warn('Note play error:', err);
  }
}

/**
 * Play a magical harp-like blooming arpeggio
 */
export function playBloomSound(stage = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    let notes;
    if (stage === 1) {
      notes = [523.25, 659.25, 783.99, 1046.50];
    } else if (stage === 2) {
      notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
    } else if (stage === 3) {
      notes = [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98, 2093.00];
    } else {
      notes = [293.66, 440.00, 587.33, 783.99, 880.00, 1174.66, 1567.98, 2093.00];
    }

    const now = ctx.currentTime;
    const speed = stage >= 3 ? 0.055 : 0.075;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * speed);

      gain.gain.setValueAtTime(0, now + index * speed);
      gain.gain.linearRampToValueAtTime(0.18, now + index * speed + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * speed + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * speed);
      osc.stop(now + index * speed + 1.3);
    });
  } catch (err) {
    console.warn('Audio playback error:', err);
  }
}

/**
 * Soft paper rustle / envelope open sound
 */
export function playPaperSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(580, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (err) {
    console.warn('Audio paper sound error:', err);
  }
}

/**
 * Soft card flip sound
 */
export function playFlipSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (err) {
    console.warn('Audio flip sound error:', err);
  }
}

/**
 * Track info helper
 */
export function getTrackInfo(stage = 1, theme = 'flores-amarillas') {
  if (theme === 'cumpleanos') {
    return {
      movie: 'Cumpleaños Feliz',
      title: 'Sweet Birthday Melody',
      subtitle: 'Campanas y celesta dulce',
      vinylColor: '#F472B6',
      tag: '🎂 Velas & Deseos'
    };
  }
  if (theme === 'logro-profesional') {
    return {
      movie: 'Logro & Éxito',
      title: 'Fanfarria del Triunfo',
      subtitle: 'Himno de orgullo y victoria',
      vinylColor: '#10B981',
      tag: '🎓 Laureles de Victoria'
    };
  }
  if (theme === 'aniversario') {
    return {
      movie: 'Aniversario de Amor',
      title: 'Balada de Eterna Complicidad',
      subtitle: 'Acordes cálidos y cuerdas románticas',
      vinylColor: '#F43F5E',
      tag: '💖 Amor Incondicional'
    };
  }

  // Default: Flores Amarillas
  const tracks = [
    { movie: 'Primavera en Flor', title: 'Flores Amarillas (Vals de Primavera)', subtitle: 'Campanas y celesta suave', vinylColor: '#FACC15', tag: '🌼 Dientes de León & Sol' },
    { movie: 'Luz de Septiembre', title: 'Arpegio de los Girasoles', subtitle: 'Arpa y acordes cálidos de amor', vinylColor: '#F97316', tag: '🌻 Girasoles & Rosas' },
    { movie: 'Jardín Silvestre', title: 'Sonrisa de Primavera', subtitle: 'Guitarra acústica y brisa cálida', vinylColor: '#84CC16', tag: '🌿 Follaje & Margaritas' },
    { movie: 'Eterna Primavera', title: 'El Florecer de la Esperanza', subtitle: 'Melodía triunfal de luz y alegría', vinylColor: '#EAB308', tag: '✨ Primavera Dorada' }
  ];
  return tracks[stage - 1] || tracks[0];
}

export function isAudioCurrentlyPlaying() {
  return isMusicPlaying;
}

export function getCurrentStageTrack() {
  return currentActiveStage;
}

export function getCurrentMusicTheme() {
  return currentActiveTheme;
}

export function subscribeMusicState(fn) {
  musicListeners.add(fn);
  fn(isMusicPlaying, currentActiveStage, currentActiveTheme);
  return () => musicListeners.delete(fn);
}

function notifyMusicListeners() {
  musicListeners.forEach((fn) => fn(isMusicPlaying, currentActiveStage, currentActiveTheme));
}

/**
 * Render one iteration of the selected melody according to theme & stage
 */
function playStageMelody(stage, theme = 'flores-amarillas') {
  if (!isMusicPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // 1. CUMPLEAÑOS
  if (theme === 'cumpleanos') {
    // Happy Birthday in G Major / D
    const birthdayNotes = [
      { f: 293.66, t: 0.0, d: 0.45, v: 0.06 }, // D4
      { f: 293.66, t: 0.5, d: 0.35, v: 0.06 }, // D4
      { f: 329.63, t: 0.9, d: 0.70, v: 0.07 }, // E4
      { f: 293.66, t: 1.7, d: 0.70, v: 0.07 }, // D4
      { f: 392.00, t: 2.5, d: 0.80, v: 0.08 }, // G4
      { f: 369.99, t: 3.4, d: 1.30, v: 0.07 }, // F#4
      // Second phrase
      { f: 293.66, t: 4.8, d: 0.45, v: 0.06 }, // D4
      { f: 293.66, t: 5.3, d: 0.35, v: 0.06 }, // D4
      { f: 329.63, t: 5.7, d: 0.70, v: 0.07 }, // E4
      { f: 293.66, t: 6.5, d: 0.70, v: 0.07 }, // D4
      { f: 440.00, t: 7.3, d: 0.80, v: 0.08 }, // A4
      { f: 392.00, t: 8.2, d: 1.50, v: 0.08 }  // G4
    ];
    playAcousticNote(ctx, 196.00, now, 8.5, 0.03, 'triangle'); // Bass G
    birthdayNotes.forEach((n) => playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine'));
    return;
  }

  // 2. LOGRO PROFESIONAL
  if (theme === 'logro-profesional') {
    // Triumphant, inspiring ascending melody (Victory & Pride)
    const successNotes = [
      { f: 261.63, t: 0.0, d: 0.8, v: 0.06 }, // C4
      { f: 329.63, t: 0.7, d: 0.8, v: 0.06 }, // E4
      { f: 392.00, t: 1.4, d: 0.9, v: 0.07 }, // G4
      { f: 523.25, t: 2.2, d: 1.2, v: 0.08 }, // C5
      { f: 493.88, t: 3.4, d: 0.6, v: 0.06 }, // B4
      { f: 523.25, t: 4.1, d: 0.6, v: 0.07 }, // C5
      { f: 587.33, t: 4.8, d: 0.7, v: 0.07 }, // D5
      { f: 659.25, t: 5.6, d: 1.6, v: 0.09 }  // E5
    ];
    playAcousticNote(ctx, 130.81, now, 6.5, 0.04, 'triangle'); // Bass C
    successNotes.forEach((n) => playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine'));
    return;
  }

  // 3. ANIVERSARIO & AMOR
  if (theme === 'aniversario') {
    // Romantic warm love chords and gentle acoustic melody
    const loveNotes = [
      { f: 329.63, t: 0.0, d: 0.9, v: 0.06 }, // E4
      { f: 392.00, t: 0.7, d: 0.8, v: 0.06 }, // G4
      { f: 440.00, t: 1.4, d: 1.0, v: 0.07 }, // A4
      { f: 392.00, t: 2.3, d: 0.8, v: 0.06 }, // G4
      { f: 329.63, t: 3.0, d: 0.9, v: 0.06 }, // E4
      { f: 293.66, t: 3.8, d: 0.8, v: 0.05 }, // D4
      { f: 261.63, t: 4.5, d: 1.8, v: 0.07 }  // C4
    ];
    playAcousticNote(ctx, 130.81, now, 6.0, 0.035, 'sine'); // Soft warm base
    loveNotes.forEach((n) => playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine'));
    return;
  }

  // 4. FLORES AMARILLAS & PRIMAVERA (Original Vals)
  if (stage === 1) {
    const notes = [
      { f: 293.66, t: 0.0, d: 0.9, v: 0.055 },
      { f: 369.99, t: 0.6, d: 0.8, v: 0.055 },
      { f: 440.00, t: 1.2, d: 1.1, v: 0.065 },
      { f: 493.88, t: 1.8, d: 0.8, v: 0.055 },
      { f: 440.00, t: 2.3, d: 1.0, v: 0.060 },
      { f: 369.99, t: 3.0, d: 0.9, v: 0.050 },
      { f: 329.63, t: 3.6, d: 0.8, v: 0.050 },
      { f: 293.66, t: 4.2, d: 1.4, v: 0.065 },
    ];
    playAcousticNote(ctx, 146.83, now, 4.5, 0.03, 'triangle');
    notes.forEach((n) => playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine'));
  } else if (stage === 2) {
    const notes = [
      { f: 246.94, t: 0.0, d: 0.7, v: 0.05 },
      { f: 293.66, t: 0.5, d: 0.7, v: 0.05 },
      { f: 369.99, t: 1.0, d: 0.8, v: 0.06 },
      { f: 440.00, t: 1.6, d: 1.2, v: 0.07 },
      { f: 392.00, t: 2.6, d: 0.8, v: 0.06 },
      { f: 329.63, t: 3.4, d: 0.9, v: 0.06 },
      { f: 293.66, t: 4.2, d: 1.5, v: 0.07 },
    ];
    playAcousticNote(ctx, 196.00, now, 5.0, 0.03, 'triangle');
    notes.forEach((n) => playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine'));
  } else if (stage === 3) {
    const notes = [
      { f: 329.63, t: 0.0, d: 0.7, v: 0.05 },
      { f: 392.00, t: 0.6, d: 0.8, v: 0.06 },
      { f: 493.88, t: 1.2, d: 0.9, v: 0.065 },
      { f: 440.00, t: 1.9, d: 0.7, v: 0.06 },
      { f: 392.00, t: 2.5, d: 0.8, v: 0.06 },
      { f: 329.63, t: 3.2, d: 1.3, v: 0.07 },
    ];
    playAcousticNote(ctx, 164.81, now, 4.5, 0.03, 'triangle');
    notes.forEach((n) => playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine'));
  } else {
    const notes = [
      { f: 293.66, t: 0.0, d: 0.7, v: 0.05 },
      { f: 369.99, t: 0.5, d: 0.7, v: 0.055 },
      { f: 440.00, t: 1.0, d: 0.8, v: 0.06 },
      { f: 587.33, t: 1.6, d: 1.2, v: 0.075 },
      { f: 493.88, t: 2.6, d: 0.7, v: 0.06 },
      { f: 440.00, t: 3.2, d: 0.8, v: 0.065 },
      { f: 369.99, t: 3.9, d: 0.7, v: 0.055 },
      { f: 293.66, t: 4.6, d: 1.6, v: 0.07 },
    ];
    playAcousticNote(ctx, 146.83, now, 5.5, 0.035, 'triangle');
    notes.forEach((n) => playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine'));
  }
}

/**
 * Start or switch music track for the given stage and theme.
 */
export function startMovieMusic(stage = 1, theme = null, onStateChange = null) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    stopAllMusicAudio();

    currentActiveStage = stage;
    if (theme) currentActiveTheme = theme;
    isMusicPlaying = true;

    playStageMelody(currentActiveStage, currentActiveTheme);

    const intervalTime = currentActiveTheme === 'cumpleanos' ? 9500 : 6200;
    activeMusicInterval = setInterval(() => {
      if (!isMusicPlaying) return;
      stopAllMusicAudio();
      isMusicPlaying = true;
      playStageMelody(currentActiveStage, currentActiveTheme);
    }, intervalTime);

    if (onStateChange) onStateChange(true);
    notifyMusicListeners();
    return true;
  } catch (err) {
    console.warn('Start movie music error:', err);
    return false;
  }
}

export function stopMovieMusic(onStateChange = null) {
  isMusicPlaying = false;
  stopAllMusicAudio();
  if (onStateChange) onStateChange(false);
  notifyMusicListeners();
  return false;
}

export function toggleMovieMusic(stage = 1, theme = null, onStateChange = null) {
  if (isMusicPlaying) {
    return stopMovieMusic(onStateChange);
  } else {
    return startMovieMusic(stage, theme, onStateChange);
  }
}

export function switchMovieStageMusic(nextStage, theme = null, onStateChange = null) {
  currentActiveStage = nextStage;
  if (theme) currentActiveTheme = theme;
  if (isMusicPlaying) {
    startMovieMusic(nextStage, currentActiveTheme, onStateChange);
  } else {
    notifyMusicListeners();
  }
}
