export type SfxType =
  | 'draw'
  | 'channel'
  | 'summon'
  | 'spell'
  | 'attack'
  | 'hit'
  | 'heal'
  | 'freeze'
  | 'ascend'
  | 'domain_expand'
  | 'domain_clash'
  | 'domain_shatter'
  | 'wheel_domain_shatter'
  | 'dragon_armada'
  | 'victory'
  | 'defeat'
  | 'pack_open';

let muted = false;
let audioCtx: AudioContext | null = null;
let onMuteChangeCallback: ((isMuted: boolean) => void) | null = null;

export function registerMuteListener(cb: (isMuted: boolean) => void): void {
  onMuteChangeCallback = cb;
}

export function getSharedAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Ignore autoplay errors until user gesture
    });
  }
  return audioCtx;
}

let audioUnlockListenersAttached = false;
let onAudioUnlockedCallbacks: Array<() => void> = [];

export function onAudioUnlocked(cb: () => void): () => void {
  onAudioUnlockedCallbacks.push(cb);
  return () => {
    onAudioUnlockedCallbacks = onAudioUnlockedCallbacks.filter((fn) => fn !== cb);
  };
}

export function ensureGlobalAudioUnlockListeners(): void {
  if (typeof window === 'undefined' || audioUnlockListenersAttached) return;
  audioUnlockListenersAttached = true;

  const unlockHandler = () => {
    const ctx = getSharedAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx
        .resume()
        .then(() => {
          for (const cb of onAudioUnlockedCallbacks) {
            cb();
          }
        })
        .catch(() => {});
    } else if (ctx && ctx.state === 'running') {
      for (const cb of onAudioUnlockedCallbacks) {
        cb();
      }
    }
  };

  window.addEventListener('pointerdown', unlockHandler, { passive: true });
  window.addEventListener('touchstart', unlockHandler, { passive: true });
  window.addEventListener('keydown', unlockHandler, { passive: true });
  window.addEventListener('click', unlockHandler, { passive: true });
}

if (typeof window !== 'undefined') {
  ensureGlobalAudioUnlockListeners();
}

function getAudioContext(): AudioContext | null {
  return getSharedAudioContext();
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (onMuteChangeCallback) onMuteChangeCallback(muted);
}

export function toggleMute(): boolean {
  muted = !muted;
  if (onMuteChangeCallback) onMuteChangeCallback(muted);
  return muted;
}

function playTone(
  ctx: AudioContext,
  freqStart: number,
  freqEnd: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.14,
  delay = 0
): void {
  const startTime = ctx.currentTime + delay;
  const endTime = startTime + duration;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(Math.max(20, freqStart), startTime);
  if (freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), endTime);
  }

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + Math.min(0.025, duration * 0.25));
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(endTime + 0.01);
}

function playNoiseBurst(
  ctx: AudioContext,
  duration: number,
  filterFreq: number,
  gainPeak = 0.12,
  delay = 0
): void {
  const sampleRate = ctx.sampleRate;
  const frameCount = Math.max(1, Math.floor(sampleRate * duration));
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (frameCount * 0.45));
  }

  const startTime = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(filterFreq, startTime);
  filter.Q.setValueAtTime(1.4, startTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainPeak, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(startTime);
}

function dispatchSfxOnContext(ctx: AudioContext, type: SfxType): void {
  try {
    switch (type) {
      case 'draw': {
        playNoiseBurst(ctx, 0.09, 1800, 0.08, 0);
        playTone(ctx, 420, 680, 0.1, 'sine', 0.07, 0.01);
        break;
      }

      case 'channel': {
        playTone(ctx, 261.63, 523.25, 0.28, 'triangle', 0.12, 0);
        playTone(ctx, 329.63, 659.25, 0.3, 'sine', 0.1, 0.06);
        playTone(ctx, 392.0, 783.99, 0.34, 'sine', 0.09, 0.12);
        break;
      }

      case 'summon': {
        playTone(ctx, 110, 65, 0.24, 'sawtooth', 0.14, 0);
        playNoiseBurst(ctx, 0.16, 420, 0.12, 0);
        playTone(ctx, 220, 330, 0.22, 'triangle', 0.1, 0.08);
        break;
      }

      case 'spell': {
        playTone(ctx, 360, 880, 0.26, 'sine', 0.11, 0);
        playTone(ctx, 540, 1120, 0.24, 'triangle', 0.09, 0.05);
        playNoiseBurst(ctx, 0.18, 2400, 0.06, 0.04);
        break;
      }

      case 'attack': {
        playNoiseBurst(ctx, 0.12, 1100, 0.11, 0);
        playTone(ctx, 280, 110, 0.14, 'sawtooth', 0.11, 0);
        break;
      }

      case 'hit': {
        playNoiseBurst(ctx, 0.18, 350, 0.18, 0);
        playTone(ctx, 140, 45, 0.2, 'square', 0.14, 0);
        break;
      }

      case 'heal': {
        playTone(ctx, 440, 587.33, 0.18, 'sine', 0.1, 0);
        playTone(ctx, 587.33, 880, 0.25, 'sine', 0.11, 0.09);
        break;
      }

      case 'freeze': {
        playTone(ctx, 1200, 1950, 0.14, 'sine', 0.09, 0);
        playTone(ctx, 1600, 2400, 0.16, 'triangle', 0.08, 0.05);
        playNoiseBurst(ctx, 0.14, 3800, 0.07, 0.02);
        break;
      }

      case 'ascend': {
        const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
        notes.forEach((n, idx) => {
          playTone(ctx, n, n * 1.03, 0.25, 'triangle', 0.11, idx * 0.06);
        });
        break;
      }

      case 'domain_expand': {
        // 1. Deep Sub-Bass Tectonic Drop & Reality Seal Release (0.0s - 0.65s)
        playNoiseBurst(ctx, 0.42, 320, 0.26, 0);
        playTone(ctx, 110, 36.71, 0.62, 'sine', 0.3, 0);
        playTone(ctx, 146.83, 73.42, 0.52, 'sawtooth', 0.15, 0.02);

        // 2. Ascending Sovereign Sanctuary Choir & Brass Swell (0.12s - 1.15s)
        const chord = [
          { freq: 146.83, delay: 0.1, dur: 0.95, type: 'sawtooth' as OscillatorType, gain: 0.14 }, // D3
          { freq: 220.0, delay: 0.16, dur: 0.9, type: 'triangle' as OscillatorType, gain: 0.16 },  // A3
          { freq: 293.66, delay: 0.22, dur: 0.88, type: 'triangle' as OscillatorType, gain: 0.18 }, // D4
          { freq: 369.99, delay: 0.28, dur: 0.85, type: 'sine' as OscillatorType, gain: 0.15 },     // F#4
          { freq: 440.0, delay: 0.34, dur: 0.82, type: 'triangle' as OscillatorType, gain: 0.17 },  // A4
          { freq: 587.33, delay: 0.42, dur: 0.9, type: 'sine' as OscillatorType, gain: 0.2 },       // D5
        ];
        chord.forEach((c) => {
          playTone(ctx, c.freq * 0.98, c.freq, c.dur, c.type, c.gain, c.delay);
        });
        playNoiseBurst(ctx, 0.28, 2600, 0.12, 0.35);
        break;
      }

      case 'domain_clash': {
        // Dual opposing barrier impact + high-voltage faultline crackle
        playNoiseBurst(ctx, 0.36, 420, 0.28, 0);
        playTone(ctx, 130.81, 41.2, 0.48, 'sawtooth', 0.26, 0);
        playNoiseBurst(ctx, 0.32, 2800, 0.18, 0.14);
        playTone(ctx, 196.0, 293.66, 0.55, 'square', 0.14, 0.12);
        playTone(ctx, 277.18, 440.0, 0.65, 'sawtooth', 0.16, 0.2);
        playTone(ctx, 587.33, 587.33, 0.78, 'triangle', 0.18, 0.28);
        break;
      }

      case 'domain_shatter': {
        // Crystalline polygonal barrier fracture + heavy collapse boom
        playNoiseBurst(ctx, 0.35, 320, 0.3, 0);
        playTone(ctx, 140, 34, 0.48, 'sine', 0.3, 0);
        playNoiseBurst(ctx, 0.24, 3200, 0.22, 0.04);
        playNoiseBurst(ctx, 0.28, 1850, 0.18, 0.12);
        playTone(ctx, 880, 220, 0.32, 'triangle', 0.15, 0.06);
        break;
      }

      case 'wheel_domain_shatter': {
        // 1. Sacred Eight-Spoke Wheel Mechanical Ratchet & Astral Lock (0.0s - 0.34s)
        const wheelClicks = [880.0, 1046.5, 1318.51, 1760.0];
        wheelClicks.forEach((freq, idx) => {
          const t = idx * 0.075;
          playNoiseBurst(ctx, 0.045, 2900 + idx * 350, 0.14, t);
          playTone(ctx, freq, freq * 1.04, 0.11, 'triangle', 0.15, t);
        });

        // 2. Cataclysmic Reality Barrier Implosion & Polygonal Crystal Shatter (0.31s - 1.15s)
        playNoiseBurst(ctx, 0.44, 280, 0.32, 0.31);
        playTone(ctx, 174.61, 30.87, 0.62, 'sine', 0.34, 0.31);
        playTone(ctx, 293.66, 73.42, 0.48, 'sawtooth', 0.18, 0.33);
        playNoiseBurst(ctx, 0.28, 3600, 0.24, 0.34);
        playNoiseBurst(ctx, 0.32, 2150, 0.2, 0.42);
        // Resonant Celestial Judgement Bell Sustain
        playTone(ctx, 587.33, 587.33, 0.72, 'triangle', 0.16, 0.36);
        playTone(ctx, 1174.66, 587.33, 0.45, 'sine', 0.13, 0.36);
        break;
      }

      case 'dragon_armada': {
        // 1. Sky-Darkening Squadron Wingbeat Gusts (0.0s - 0.65s)
        playNoiseBurst(ctx, 0.26, 260, 0.24, 0);
        playNoiseBurst(ctx, 0.26, 340, 0.22, 0.16);
        playNoiseBurst(ctx, 0.28, 440, 0.2, 0.32);

        // 2. Draconic Brass Warhorn & Multi-Dragon Roar Swell (0.06s - 1.05s)
        playTone(ctx, 98.0, 65.41, 0.68, 'sawtooth', 0.22, 0.04);
        playTone(ctx, 146.83, 130.81, 0.72, 'sawtooth', 0.16, 0.12);
        playTone(ctx, 220.0, 293.66, 0.65, 'triangle', 0.17, 0.18);
        playTone(ctx, 440.0, 587.33, 0.55, 'triangle', 0.13, 0.26);
        playNoiseBurst(ctx, 0.34, 1850, 0.16, 0.24);
        break;
      }

      case 'victory': {
        // 1. Initial Enemy Bastion Shatter Boom (0.0s - 0.45s)
        playNoiseBurst(ctx, 0.38, 280, 0.28, 0);
        playTone(ctx, 130, 32, 0.42, 'sine', 0.28, 0);
        playNoiseBurst(ctx, 0.28, 2200, 0.16, 0.08); // Crystal shatter

        // 2. Heroic Ascending Brass & Chime Fanfare (0.35s - 2.4s)
        const fanfare = [
          { freq: 293.66, delay: 0.35, dur: 0.35 }, // D4
          { freq: 440.0,  delay: 0.52, dur: 0.35 }, // A4
          { freq: 587.33, delay: 0.70, dur: 0.42 }, // D5
          { freq: 659.25, delay: 0.92, dur: 0.35 }, // E5
          { freq: 739.99, delay: 1.12, dur: 0.40 }, // F#5
          { freq: 880.0,  delay: 1.35, dur: 1.15 }, // A5 Final sustain
        ];
        fanfare.forEach((n) => {
          playTone(ctx, n.freq, n.freq, n.dur, 'triangle', 0.18, n.delay);
          playTone(ctx, n.freq * 0.5, n.freq * 0.5, n.dur * 1.1, 'sine', 0.15, n.delay);
        });
        // Final Triumphant D-Major Chord Swell at 1.35s
        playTone(ctx, 146.83, 146.83, 1.25, 'sawtooth', 0.11, 1.35); // D3
        playTone(ctx, 293.66, 293.66, 1.25, 'triangle', 0.14, 1.35); // D4
        playTone(ctx, 369.99, 369.99, 1.25, 'triangle', 0.12, 1.35); // F#4
        break;
      }

      case 'defeat': {
        // 1. Bastion Collapse & Heavy Impact Boom (0.0s - 0.5s)
        playNoiseBurst(ctx, 0.45, 210, 0.3, 0);
        playTone(ctx, 110, 26, 0.52, 'sine', 0.3, 0);
        playNoiseBurst(ctx, 0.32, 1450, 0.16, 0.06);

        // 2. Gothic Abyssal Bell Toll & Descending Minor Dirge (0.35s - 2.5s)
        playTone(ctx, 146.83, 144.0, 1.8, 'sine', 0.22, 0.32);     // Deep D3 Bell Fundamental
        playTone(ctx, 440.0, 436.0, 1.4, 'triangle', 0.12, 0.32);  // Bell Overtone
        const dirge = [
          { freq: 329.63, delay: 0.45, dur: 0.48 }, // E4
          { freq: 311.13, delay: 0.82, dur: 0.48 }, // Eb4
          { freq: 293.66, delay: 1.20, dur: 0.55 }, // D4
          { freq: 220.0,  delay: 1.62, dur: 1.10 }, // A3 Abyssal Resolve
        ];
        dirge.forEach((n) => {
          playTone(ctx, n.freq, n.freq * 0.98, n.dur, 'sawtooth', 0.12, n.delay);
          playTone(ctx, n.freq * 0.5, n.freq * 0.49, n.dur * 1.15, 'sine', 0.18, n.delay);
        });
        break;
      }

      case 'pack_open': {
        playNoiseBurst(ctx, 0.14, 1600, 0.1, 0);
        const sparkle = [392.0, 493.88, 587.33, 783.99, 987.77];
        sparkle.forEach((n, idx) => {
          playTone(ctx, n, n * 1.05, 0.22, 'sine', 0.1, 0.05 + idx * 0.05);
        });
        break;
      }
    }
  } catch {
    // Ignore Web Audio errors in headless environments
  }
}

export function playSfx(type: SfxType): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx
      .resume()
      .then(() => {
        if (!muted && ctx.state === 'running') {
          dispatchSfxOnContext(ctx, type);
        }
      })
      .catch(() => {});
    return;
  }

  dispatchSfxOnContext(ctx, type);
}
