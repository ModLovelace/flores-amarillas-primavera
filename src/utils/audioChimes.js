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

let userPaused = false;
let startRequestId = 0;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isUserPausedMusic() {
  return userPaused;
}

export function isAudioUnlocked() {
  return Boolean(audioCtx && audioCtx.state === 'running');
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
      musicMasterGain.gain.setValueAtTime(0.0001, now);
      musicMasterGain.gain.linearRampToValueAtTime(1.0, now + 0.03);
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
 * Return the full multi-phrase composition (melody + harmony accompaniment + exact loop duration)
 * so every theme plays a complete song before looping seamlessly.
 */
export function getMelodySequence(stage = 1, theme = 'flores-amarillas') {
  // 1. CUMPLEAÑOS FELIZ COMPLETA (Sol mayor, 4 frases completas con clímax D5 y cierre G4)
  if (theme === 'cumpleanos') {
    return {
      loopMs: 17400,
      accompaniment: [
        // Frase 1 (G -> D7)
        { f: 196.00, t: 0.72, d: 1.9, v: 0.030, type: 'triangle' }, // G3
        { f: 246.94, t: 0.72, d: 1.4, v: 0.018, type: 'sine' },     // B3
        { f: 146.83, t: 2.70, d: 1.3, v: 0.030, type: 'triangle' }, // D3
        { f: 220.00, t: 2.70, d: 1.1, v: 0.018, type: 'sine' },     // A3
        // Frase 2 (D7 -> G)
        { f: 146.83, t: 4.72, d: 1.9, v: 0.030, type: 'triangle' }, // D3
        { f: 261.63, t: 4.72, d: 1.4, v: 0.016, type: 'sine' },     // C4
        { f: 196.00, t: 6.70, d: 1.3, v: 0.030, type: 'triangle' }, // G3
        { f: 246.94, t: 6.70, d: 1.1, v: 0.018, type: 'sine' },     // B3
        // Frase 3 (G -> C)
        { f: 196.00, t: 8.72, d: 2.3, v: 0.032, type: 'triangle' }, // G3
        { f: 293.66, t: 8.72, d: 1.7, v: 0.018, type: 'sine' },     // D4
        { f: 130.81, t: 11.34, d: 1.3, v: 0.032, type: 'triangle' }, // C3
        { f: 261.63, t: 11.34, d: 1.1, v: 0.020, type: 'sine' },     // C4
        // Frase 4 (C -> G/D -> D7 -> G)
        { f: 130.81, t: 13.24, d: 1.3, v: 0.030, type: 'triangle' }, // C3
        { f: 146.83, t: 14.60, d: 0.8, v: 0.030, type: 'triangle' }, // D3
        { f: 196.00, t: 15.30, d: 1.7, v: 0.034, type: 'triangle' }, // G3
        { f: 246.94, t: 15.30, d: 1.5, v: 0.020, type: 'sine' },     // B3
      ],
      notes: [
        // Frase 1: "Cumpleaños feliz"
        { f: 293.66, t: 0.00, d: 0.40, v: 0.065 }, // D4
        { f: 293.66, t: 0.42, d: 0.28, v: 0.060 }, // D4
        { f: 329.63, t: 0.72, d: 0.62, v: 0.072 }, // E4
        { f: 293.66, t: 1.38, d: 0.62, v: 0.070 }, // D4
        { f: 392.00, t: 2.04, d: 0.64, v: 0.078 }, // G4
        { f: 369.99, t: 2.70, d: 1.15, v: 0.075 }, // F#4
        // Frase 2: "te deseamos a ti"
        { f: 293.66, t: 4.00, d: 0.40, v: 0.065 }, // D4
        { f: 293.66, t: 4.42, d: 0.28, v: 0.060 }, // D4
        { f: 329.63, t: 4.72, d: 0.62, v: 0.072 }, // E4
        { f: 293.66, t: 5.38, d: 0.62, v: 0.070 }, // D4
        { f: 440.00, t: 6.04, d: 0.64, v: 0.080 }, // A4
        { f: 392.00, t: 6.70, d: 1.15, v: 0.076 }, // G4
        // Frase 3: "cumpleaños querida..." (clímax agudo D5)
        { f: 293.66, t: 8.00, d: 0.40, v: 0.065 }, // D4
        { f: 293.66, t: 8.42, d: 0.28, v: 0.062 }, // D4
        { f: 587.33, t: 8.72, d: 0.68, v: 0.088 }, // D5
        { f: 493.88, t: 9.42, d: 0.62, v: 0.078 }, // B4
        { f: 392.00, t: 10.08, d: 0.60, v: 0.074 }, // G4
        { f: 369.99, t: 10.72, d: 0.58, v: 0.070 }, // F#4
        { f: 329.63, t: 11.34, d: 1.05, v: 0.075 }, // E4
        // Frase 4: "que los cumplas feliz!"
        { f: 523.25, t: 12.50, d: 0.42, v: 0.078 }, // C5
        { f: 523.25, t: 12.94, d: 0.28, v: 0.072 }, // C5
        { f: 493.88, t: 13.24, d: 0.64, v: 0.080 }, // B4
        { f: 392.00, t: 13.92, d: 0.64, v: 0.076 }, // G4
        { f: 440.00, t: 14.60, d: 0.66, v: 0.082 }, // A4
        { f: 392.00, t: 15.30, d: 1.65, v: 0.086 }, // G4
      ],
    };
  }

  // 2. LOGRO PROFESIONAL (Fanfarria del Triunfo completa A + B, Do mayor)
  if (theme === 'logro-profesional') {
    return {
      loopMs: 14400,
      accompaniment: [
        { f: 130.81, t: 0.0, d: 3.2, v: 0.036, type: 'triangle' },  // C3
        { f: 196.00, t: 3.4, d: 3.0, v: 0.034, type: 'triangle' },  // G3
        { f: 174.61, t: 6.8, d: 3.0, v: 0.034, type: 'triangle' },  // F3
        { f: 196.00, t: 10.0, d: 1.8, v: 0.034, type: 'triangle' }, // G3
        { f: 130.81, t: 12.0, d: 2.0, v: 0.038, type: 'triangle' }, // C3
      ],
      notes: [
        // Frase A
        { f: 261.63, t: 0.0, d: 0.65, v: 0.060 },
        { f: 329.63, t: 0.65, d: 0.65, v: 0.064 },
        { f: 392.00, t: 1.30, d: 0.80, v: 0.070 },
        { f: 523.25, t: 2.10, d: 1.15, v: 0.080 },
        { f: 493.88, t: 3.35, d: 0.60, v: 0.066 },
        { f: 523.25, t: 4.00, d: 0.60, v: 0.070 },
        { f: 587.33, t: 4.65, d: 0.70, v: 0.074 },
        { f: 659.25, t: 5.40, d: 1.25, v: 0.082 },
        // Frase B (Clímax victorioso y cierre)
        { f: 783.99, t: 6.80, d: 0.70, v: 0.080 }, // G5
        { f: 659.25, t: 7.50, d: 0.65, v: 0.072 }, // E5
        { f: 698.46, t: 8.20, d: 0.65, v: 0.074 }, // F5
        { f: 587.33, t: 8.90, d: 0.65, v: 0.070 }, // D5
        { f: 659.25, t: 9.60, d: 0.70, v: 0.074 }, // E5
        { f: 587.33, t: 10.35, d: 0.65, v: 0.070 }, // D5
        { f: 493.88, t: 11.05, d: 0.75, v: 0.072 }, // B4
        { f: 523.25, t: 11.90, d: 1.90, v: 0.088 }, // C5 cierre
      ],
    };
  }

  // 3. ANIVERSARIO & AMOR (Balada romántica completa A + B)
  if (theme === 'aniversario') {
    return {
      loopMs: 15200,
      accompaniment: [
        { f: 130.81, t: 0.0, d: 3.4, v: 0.032, type: 'sine' },  // C3
        { f: 220.00, t: 3.6, d: 3.0, v: 0.030, type: 'sine' },  // A3
        { f: 174.61, t: 6.9, d: 3.2, v: 0.032, type: 'sine' },  // F3
        { f: 196.00, t: 10.4, d: 2.2, v: 0.032, type: 'sine' }, // G3
        { f: 130.81, t: 12.8, d: 2.2, v: 0.034, type: 'sine' }, // C3
      ],
      notes: [
        // Frase A
        { f: 329.63, t: 0.0, d: 0.85, v: 0.060 },
        { f: 392.00, t: 0.75, d: 0.80, v: 0.064 },
        { f: 440.00, t: 1.50, d: 1.00, v: 0.072 },
        { f: 392.00, t: 2.45, d: 0.80, v: 0.064 },
        { f: 329.63, t: 3.30, d: 0.85, v: 0.060 },
        { f: 293.66, t: 4.15, d: 0.80, v: 0.056 },
        { f: 261.63, t: 4.95, d: 1.45, v: 0.068 },
        // Frase B (Respuesta emotiva)
        { f: 440.00, t: 6.80, d: 0.75, v: 0.068 }, // A4
        { f: 523.25, t: 7.55, d: 0.85, v: 0.076 }, // C5
        { f: 493.88, t: 8.40, d: 0.80, v: 0.072 }, // B4
        { f: 392.00, t: 9.20, d: 0.85, v: 0.066 }, // G4
        { f: 440.00, t: 10.10, d: 0.75, v: 0.070 }, // A4
        { f: 349.23, t: 10.85, d: 0.75, v: 0.064 }, // F4
        { f: 329.63, t: 11.60, d: 0.65, v: 0.062 }, // E4
        { f: 293.66, t: 12.25, d: 0.65, v: 0.060 }, // D4
        { f: 261.63, t: 12.90, d: 1.85, v: 0.076 }, // C4 cierre dulce
      ],
    };
  }

  // 4. FLORES AMARILLAS & PRIMAVERA (Vals completo A + B por cada etapa 1..4)
  if (stage === 1) {
    return {
      loopMs: 12800,
      accompaniment: [
        { f: 146.83, t: 0.0, d: 2.8, v: 0.030, type: 'triangle' },
        { f: 164.81, t: 3.0, d: 2.8, v: 0.028, type: 'triangle' },
        { f: 196.00, t: 6.2, d: 2.8, v: 0.030, type: 'triangle' },
        { f: 146.83, t: 9.2, d: 3.0, v: 0.032, type: 'triangle' },
      ],
      notes: [
        { f: 293.66, t: 0.0, d: 0.8, v: 0.058 },
        { f: 369.99, t: 0.6, d: 0.8, v: 0.060 },
        { f: 440.00, t: 1.2, d: 1.0, v: 0.068 },
        { f: 493.88, t: 1.9, d: 0.8, v: 0.062 },
        { f: 440.00, t: 2.6, d: 0.9, v: 0.064 },
        { f: 369.99, t: 3.4, d: 0.8, v: 0.056 },
        { f: 329.63, t: 4.1, d: 0.8, v: 0.056 },
        { f: 293.66, t: 4.8, d: 1.2, v: 0.066 },
        // Parte B
        { f: 369.99, t: 6.2, d: 0.7, v: 0.060 },
        { f: 440.00, t: 6.9, d: 0.7, v: 0.065 },
        { f: 587.33, t: 7.6, d: 1.0, v: 0.075 },
        { f: 554.37, t: 8.5, d: 0.7, v: 0.068 },
        { f: 493.88, t: 9.2, d: 0.7, v: 0.065 },
        { f: 440.00, t: 9.9, d: 0.8, v: 0.066 },
        { f: 369.99, t: 10.6, d: 0.7, v: 0.058 },
        { f: 293.66, t: 11.3, d: 1.3, v: 0.070 },
      ],
    };
  }

  if (stage === 2) {
    return {
      loopMs: 13000,
      accompaniment: [
        { f: 196.00, t: 0.0, d: 3.0, v: 0.030, type: 'triangle' },
        { f: 146.83, t: 3.2, d: 2.8, v: 0.028, type: 'triangle' },
        { f: 164.81, t: 6.2, d: 3.0, v: 0.030, type: 'triangle' },
        { f: 196.00, t: 9.4, d: 3.0, v: 0.032, type: 'triangle' },
      ],
      notes: [
        { f: 246.94, t: 0.0, d: 0.7, v: 0.056 },
        { f: 293.66, t: 0.55, d: 0.7, v: 0.058 },
        { f: 369.99, t: 1.10, d: 0.8, v: 0.064 },
        { f: 440.00, t: 1.75, d: 1.1, v: 0.072 },
        { f: 392.00, t: 2.75, d: 0.8, v: 0.064 },
        { f: 329.63, t: 3.50, d: 0.85, v: 0.062 },
        { f: 293.66, t: 4.30, d: 1.3, v: 0.070 },
        // Parte B
        { f: 392.00, t: 6.00, d: 0.7, v: 0.064 },
        { f: 493.88, t: 6.70, d: 0.75, v: 0.070 },
        { f: 587.33, t: 7.45, d: 0.95, v: 0.078 },
        { f: 659.25, t: 8.35, d: 0.85, v: 0.076 },
        { f: 587.33, t: 9.20, d: 0.75, v: 0.070 },
        { f: 493.88, t: 9.95, d: 0.75, v: 0.066 },
        { f: 440.00, t: 10.70, d: 0.70, v: 0.064 },
        { f: 392.00, t: 11.40, d: 1.40, v: 0.074 },
      ],
    };
  }

  if (stage === 3) {
    return {
      loopMs: 12600,
      accompaniment: [
        { f: 164.81, t: 0.0, d: 3.0, v: 0.030, type: 'triangle' },
        { f: 130.81, t: 3.1, d: 2.8, v: 0.028, type: 'triangle' },
        { f: 196.00, t: 6.0, d: 3.0, v: 0.030, type: 'triangle' },
        { f: 164.81, t: 9.2, d: 3.0, v: 0.032, type: 'triangle' },
      ],
      notes: [
        { f: 329.63, t: 0.0, d: 0.7, v: 0.056 },
        { f: 392.00, t: 0.6, d: 0.8, v: 0.064 },
        { f: 493.88, t: 1.3, d: 0.9, v: 0.068 },
        { f: 440.00, t: 2.1, d: 0.75, v: 0.064 },
        { f: 392.00, t: 2.8, d: 0.8, v: 0.064 },
        { f: 329.63, t: 3.6, d: 1.25, v: 0.070 },
        // Parte B
        { f: 392.00, t: 5.5, d: 0.7, v: 0.062 },
        { f: 493.88, t: 6.2, d: 0.75, v: 0.068 },
        { f: 587.33, t: 6.9, d: 0.85, v: 0.074 },
        { f: 523.25, t: 7.75, d: 0.75, v: 0.070 },
        { f: 493.88, t: 8.5, d: 0.75, v: 0.068 },
        { f: 440.00, t: 9.25, d: 0.75, v: 0.064 },
        { f: 392.00, t: 10.0, d: 0.75, v: 0.064 },
        { f: 329.63, t: 10.75, d: 1.5, v: 0.072 },
      ],
    };
  }

  return {
    loopMs: 13400,
    accompaniment: [
      { f: 146.83, t: 0.0, d: 3.2, v: 0.032, type: 'triangle' },
      { f: 196.00, t: 3.4, d: 2.8, v: 0.030, type: 'triangle' },
      { f: 220.00, t: 6.4, d: 3.2, v: 0.032, type: 'triangle' },
      { f: 146.83, t: 9.8, d: 3.2, v: 0.035, type: 'triangle' },
    ],
    notes: [
      { f: 293.66, t: 0.0, d: 0.7, v: 0.056 },
      { f: 369.99, t: 0.55, d: 0.7, v: 0.060 },
      { f: 440.00, t: 1.15, d: 0.8, v: 0.066 },
      { f: 587.33, t: 1.85, d: 1.1, v: 0.078 },
      { f: 493.88, t: 2.85, d: 0.7, v: 0.064 },
      { f: 440.00, t: 3.55, d: 0.75, v: 0.068 },
      { f: 369.99, t: 4.25, d: 0.7, v: 0.060 },
      { f: 293.66, t: 4.95, d: 1.3, v: 0.070 },
      // Parte B triunfal
      { f: 587.33, t: 6.4, d: 0.7, v: 0.076 },
      { f: 554.37, t: 7.1, d: 0.65, v: 0.070 },
      { f: 493.88, t: 7.75, d: 0.75, v: 0.068 },
      { f: 440.00, t: 8.5, d: 0.75, v: 0.068 },
      { f: 493.88, t: 9.25, d: 0.7, v: 0.070 },
      { f: 587.33, t: 9.95, d: 0.7, v: 0.076 },
      { f: 659.25, t: 10.65, d: 0.75, v: 0.080 },
      { f: 739.99, t: 11.4, d: 0.65, v: 0.078 },
      { f: 587.33, t: 12.05, d: 1.25, v: 0.082 },
    ],
  };
}

/**
 * Render one complete iteration of the selected melody according to theme & stage
 */
function playStageMelody(stage, theme = 'flores-amarillas') {
  if (!isMusicPlaying) return 14000;
  const ctx = getAudioContext();
  if (!ctx) return 14000;

  // Desfase breve tras el ramp del masterGain para evitar micro-clipping en Safari WebKit
  const now = ctx.currentTime + 0.035;
  const sequence = getMelodySequence(stage, theme);

  sequence.accompaniment.forEach((bass) => {
    playAcousticNote(ctx, bass.f, now + bass.t, bass.d, bass.v, bass.type || 'triangle');
  });
  sequence.notes.forEach((n) => {
    playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine');
  });

  return sequence.loopMs;
}

/**
 * Start or switch music track for the given stage and theme.
 */
function scheduleNextLoop(delayMs) {
  const timer = setTimeout(() => {
    if (!isMusicPlaying) return;
    stopAllMusicAudio();
    isMusicPlaying = true;
    const nextLoopMs = playStageMelody(currentActiveStage, currentActiveTheme);
    scheduleNextLoop(nextLoopMs);
  }, delayMs);
  activeMusicTimeouts.push(timer);
}

function beginPlaybackLoop(onStateChange = null) {
  stopAllMusicAudio();
  isMusicPlaying = true;

  const firstLoopMs = playStageMelody(currentActiveStage, currentActiveTheme);
  scheduleNextLoop(firstLoopMs);

  if (onStateChange) onStateChange(true);
  notifyMusicListeners();
  return true;
}

/**
 * Attempt automatic playback on page open.
 * Only marks playback active once AudioContext is genuinely running (never fakes state while suspended).
 */
export function attemptAutoplayMusic(stage = 1, theme = null, onStateChange = null) {
  try {
    currentActiveStage = stage;
    if (theme) currentActiveTheme = theme;
    if (userPaused || isMusicPlaying) return isMusicPlaying;

    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'running') {
      return beginPlaybackLoop(onStateChange);
    }

    const requestId = ++startRequestId;
    ctx
      .resume()
      .then(() => {
        if (requestId !== startRequestId || userPaused || isMusicPlaying) return;
        if (ctx.state === 'running') {
          beginPlaybackLoop(onStateChange);
        }
      })
      .catch(() => {});

    return false;
  } catch {
    return false;
  }
}

export function startMovieMusic(stage = 1, theme = null, onStateChange = null) {
  try {
    userPaused = false;
    currentActiveStage = stage;
    if (theme) currentActiveTheme = theme;

    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'running') {
      return beginPlaybackLoop(onStateChange);
    }

    const requestId = ++startRequestId;
    ctx
      .resume()
      .then(() => {
        if (requestId !== startRequestId || userPaused) return;
        if (ctx.state === 'running') {
          beginPlaybackLoop(onStateChange);
        }
      })
      .catch(() => {});

    return false;
  } catch (err) {
    console.warn('Start movie music error:', err);
    return false;
  }
}

export function stopMovieMusic(onStateChange = null, { byUser = false } = {}) {
  startRequestId++;
  if (byUser) userPaused = true;
  isMusicPlaying = false;
  stopAllMusicAudio();
  if (onStateChange) onStateChange(false);
  notifyMusicListeners();
  return false;
}

export function toggleMovieMusic(stage = 1, theme = null, onStateChange = null) {
  if (isMusicPlaying) {
    return stopMovieMusic(onStateChange, { byUser: true });
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
