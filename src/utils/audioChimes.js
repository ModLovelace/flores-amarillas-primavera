// Audio synthesis using standard Web Audio API (no external MP3 required, zero latency)
let audioCtx = null;

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

/**
 * Play a magical harp-like blooming arpeggio
 */
export function playBloomSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Frequencies for a warm, magical pentatonic chime (E5, G#5, B5, E6, G#6)
    const notes = [659.25, 830.61, 987.77, 1318.51, 1661.22];
    const now = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);

      // Gentle bell envelope
      gain.gain.setValueAtTime(0, now + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.9);
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
    // Low frequency warm pop followed by soft harmonic shimmer
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
 * Ambient romantic acoustic chord progression synth
 */
let ambientInterval = null;
let isPlayingAmbient = false;

export function toggleAmbientMelody(onStateChange) {
  if (isPlayingAmbient) {
    stopAmbientMelody();
    if (onStateChange) onStateChange(false);
    return false;
  } else {
    startAmbientMelody();
    if (onStateChange) onStateChange(true);
    return true;
  }
}

export function startAmbientMelody() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    isPlayingAmbient = true;
    // Chords inspired by romantic acoustic warmth (D major, A major, B minor, G major)
    const chords = [
      [293.66, 369.99, 440.00, 587.33], // D maj
      [220.00, 277.18, 329.63, 440.00], // A maj
      [246.94, 293.66, 369.99, 493.88], // B min
      [196.00, 246.94, 293.66, 392.00]  // G maj
    ];

    let chordIndex = 0;

    const playChord = () => {
      if (!isPlayingAmbient) return;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      const now = ctx.currentTime;
      currentChord.forEach((freq, noteIdx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + noteIdx * 0.15);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        // Soft slow attack & release
        gain.gain.setValueAtTime(0, now + noteIdx * 0.15);
        gain.gain.linearRampToValueAtTime(0.04, now + noteIdx * 0.15 + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + noteIdx * 0.15 + 2.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + noteIdx * 0.15);
        osc.stop(now + noteIdx * 0.15 + 2.9);
      });
    };

    playChord();
    ambientInterval = setInterval(playChord, 3000);
  } catch (err) {
    console.warn('Ambient melody error:', err);
  }
}

export function stopAmbientMelody() {
  isPlayingAmbient = false;
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
}
