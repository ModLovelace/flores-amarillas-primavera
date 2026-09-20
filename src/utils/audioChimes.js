// Audio synthesis using standard Web Audio API (no external MP3 required, zero latency)
let audioCtx = null;
let musicMasterGain = null;
let activeMusicOscillators = [];
let activeMusicInterval = null;
let activeMusicTimeouts = [];
let isMusicPlaying = false;
let currentActiveStage = 1;
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
  // 1. Clear any recurring loop interval
  if (activeMusicInterval) {
    clearInterval(activeMusicInterval);
    activeMusicInterval = null;
  }

  // 2. Clear any pending timeouts
  activeMusicTimeouts.forEach((t) => clearTimeout(t));
  activeMusicTimeouts = [];

  // 3. Immediately stop and disconnect all scheduled oscillators
  activeMusicOscillators.forEach((osc) => {
    try {
      osc.stop(0);
      osc.disconnect();
    } catch (e) {
      // already stopped/disconnected
    }
  });
  activeMusicOscillators = [];

  // 4. Instantly cut off music master gain node so no lingering reverb or note tails bleed through
  if (audioCtx && musicMasterGain) {
    try {
      const now = audioCtx.currentTime;
      musicMasterGain.gain.cancelScheduledValues(now);
      musicMasterGain.gain.setValueAtTime(0, now);
      // Quickly restore gain for the new track
      musicMasterGain.gain.setValueAtTime(1.0, now + 0.02);
    } catch (e) {
      // ignore
    }
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
 * Play Rue's iconic 4-note Mockingjay whistle
 */
export function playRueWhistleAndBloom(stage = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const whistleNotes = [
      { freq: 392.00, time: 0.00, dur: 0.28 },
      { freq: 466.16, time: 0.26, dur: 0.30 },
      { freq: 440.00, time: 0.54, dur: 0.32 },
      { freq: 293.66, time: 0.84, dur: 0.55 },
    ];

    whistleNotes.forEach(({ freq, time, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.14, now + time + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });

    const t = setTimeout(() => {
      playBloomSound(stage);
    }, 850);
    activeMusicTimeouts.push(t);
  } catch (err) {
    console.warn('Rue whistle error:', err);
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
 * =========================================================================
 * MULTI-TRACK MOVIE SOUNDTRACK ENGINE (100% LIBRE DE PROBLEMAS DE AUTOR)
 * Síntesis acústica artesanal con Web Audio API de los temas icónicos de cada película.
 * =========================================================================
 */

export const MOVIE_TRACKS = [
  {
    stage: 1,
    movie: 'Los Juegos del Hambre',
    title: 'Deep in the Meadow (Rue\'s Lullaby)',
    subtitle: 'Nana acústica del Distrito 12',
    vinylColor: '#FACC15',
    tag: '🌼 Peeta & Prim'
  },
  {
    stage: 2,
    movie: 'En Llamas (Catching Fire)',
    title: 'Atlas & Arena Theme',
    subtitle: 'Arpegios de la Selva del Reloj',
    vinylColor: '#F97316',
    tag: '🌿 Selva & Rosa'
  },
  {
    stage: 3,
    movie: 'Balada de Pájaros Cantores',
    title: 'The Ballad of Lucy Gray Baird',
    subtitle: 'Guitarra folk de los Covey',
    vinylColor: '#84CC16',
    tag: '🐞 Ruda & Mariquita'
  },
  {
    stage: 4,
    movie: 'Sinsajo (Mockingjay)',
    title: 'The Hanging Tree (Renacer en Primavera)',
    subtitle: 'Himno de esperanza y dientes de león',
    vinylColor: '#EAB308',
    tag: '🏹 Sinsajo & Rebirth'
  },
];

export function isAudioCurrentlyPlaying() {
  return isMusicPlaying;
}

export function getCurrentStageTrack() {
  return currentActiveStage;
}

export function subscribeMusicState(fn) {
  musicListeners.add(fn);
  fn(isMusicPlaying, currentActiveStage);
  return () => musicListeners.delete(fn);
}

function notifyMusicListeners() {
  musicListeners.forEach((fn) => fn(isMusicPlaying, currentActiveStage));
}

/**
 * Render one iteration of the selected movie's melody
 */
function playStageMelody(stage) {
  if (!isMusicPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (stage === 1) {
    // 🌼 Movie 1: "Deep in the Meadow" (Rue's Lullaby) - Gentle lullaby celesta & harp
    const notes = [
      { f: 293.66, t: 0.0, d: 0.9, v: 0.055 }, // D4
      { f: 369.99, t: 0.6, d: 0.8, v: 0.055 }, // F#4
      { f: 440.00, t: 1.2, d: 1.1, v: 0.065 }, // A4
      { f: 493.88, t: 1.8, d: 0.8, v: 0.055 }, // B4
      { f: 440.00, t: 2.3, d: 1.0, v: 0.060 }, // A4
      { f: 369.99, t: 3.0, d: 0.9, v: 0.050 }, // F#4
      { f: 329.63, t: 3.6, d: 0.8, v: 0.050 }, // E4
      { f: 293.66, t: 4.2, d: 1.4, v: 0.065 }, // D4
    ];
    playAcousticNote(ctx, 146.83, now, 4.5, 0.03, 'triangle');
    notes.forEach((n) => playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine'));
  } else if (stage === 2) {
    // 🌿 Movie 2: "Atlas & Arena Theme" (En Llamas) - Flowing emotional chords
    const bmMid = [246.94, 293.66, 369.99, 440.00];
    const gMid = [196.00, 246.94, 293.66, 392.00];
    const dMid = [220.00, 293.66, 369.99, 440.00];
    const aMid = [220.00, 277.18, 329.63, 440.00];

    [bmMid, gMid, dMid, aMid].forEach((chord, cIdx) => {
      const cTime = now + cIdx * 1.2;
      chord.forEach((note, nIdx) => {
        playAcousticNote(ctx, note, cTime + nIdx * 0.22, 1.4, 0.045, 'triangle');
      });
    });
  } else if (stage === 3) {
    // 🐞 Movie 3: "The Ballad of Lucy Gray" (Balada de Pájaros Cantores) - Covey Folk guitar
    const folkChords = [
      [196.00, 246.94, 392.00, 587.33], // G
      [261.63, 329.63, 392.00, 523.25], // C
      [164.81, 246.94, 329.63, 493.88], // Em
      [220.00, 293.66, 440.00, 587.33], // D
    ];
    folkChords.forEach((chord, cIdx) => {
      const cTime = now + cIdx * 1.15;
      playAcousticNote(ctx, chord[0], cTime, 1.2, 0.05, 'triangle');
      chord.slice(1).forEach((note, nIdx) => {
        playAcousticNote(ctx, note, cTime + (nIdx + 1) * 0.24, 0.9, 0.04, 'sine');
      });
    });
  } else {
    // 🏹 Movie 4: "The Hanging Tree" (Sinsajo) - "Are you, are you, coming to the tree..."
    const hangingTree = [
      { f: 329.63, t: 0.0, d: 0.45, v: 0.06 }, // E4
      { f: 392.00, t: 0.5, d: 0.45, v: 0.06 }, // G4
      { f: 440.00, t: 1.0, d: 0.50, v: 0.07 }, // A4
      { f: 493.88, t: 1.5, d: 0.65, v: 0.07 }, // B4
      { f: 440.00, t: 2.2, d: 0.50, v: 0.06 }, // A4
      { f: 392.00, t: 2.7, d: 0.50, v: 0.06 }, // G4
      { f: 329.63, t: 3.2, d: 0.70, v: 0.06 }, // E4
      { f: 293.66, t: 3.9, d: 0.55, v: 0.05 }, // D4
      { f: 329.63, t: 4.5, d: 1.40, v: 0.07 }, // E4
    ];
    playAcousticNote(ctx, 164.81, now, 5.0, 0.035, 'triangle');
    hangingTree.forEach((n) => playAcousticNote(ctx, n.f, now + n.t, n.d, n.v, 'sine'));
  }
}

/**
 * Start or switch music track for the given movie stage.
 * Immediately terminates any playing audio before starting the new track.
 */
export function startMovieMusic(stage = 1, onStateChange = null) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    // 1. Immediately silence and clear ALL previous audio (ZERO OVERLAP)
    stopAllMusicAudio();

    currentActiveStage = stage;
    isMusicPlaying = true;

    // 2. Play new stage melody immediately from the start
    playStageMelody(currentActiveStage);

    // 3. Set loop interval, purging any previous notes on each loop
    const intervalTime = currentActiveStage === 4 ? 6400 : currentActiveStage === 2 ? 6000 : 5800;
    activeMusicInterval = setInterval(() => {
      if (!isMusicPlaying) return;
      stopAllMusicAudio();
      isMusicPlaying = true;
      playStageMelody(currentActiveStage);
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

export function toggleMovieMusic(stage = 1, onStateChange = null) {
  if (isMusicPlaying) {
    return stopMovieMusic(onStateChange);
  } else {
    return startMovieMusic(stage, onStateChange);
  }
}

/**
 * Smoothly transition current playing music when flower blooms to the next stage
 */
export function switchMovieStageMusic(nextStage, onStateChange = null) {
  currentActiveStage = nextStage;
  if (isMusicPlaying) {
    startMovieMusic(nextStage, onStateChange);
  } else {
    notifyMusicListeners();
  }
}


