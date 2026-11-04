import type { Domain, Rarity } from '../types/game';

export type SfxType =
  | 'card_hover'
  | 'card_select'
  | 'draw'
  | 'channel'
  | 'summon'
  | 'row_slide'
  | 'trap_arm'
  | 'trap_flip'
  | 'spell'
  | 'attack'
  | 'hit'
  | 'heal'
  | 'freeze'
  | 'shield_shatter'
  | 'reborn_rise'
  | 'lifedrain'
  | 'molten_burst'
  | 'fury_surge'
  | 'ascend'
  | 'domain_expand'
  | 'domain_clash'
  | 'domain_shatter'
  | 'wheel_domain_shatter'
  | 'dragon_armada'
  | 'victory'
  | 'defeat'
  | 'pack_open'
  | 'portal_cross'
  | 'landmark_discover'
  | 'diplomacy_seal';

export interface SfxOptions {
  domain?: Domain;
  rarity?: Rarity;
  isHeavy?: boolean;
  isRanged?: boolean;
  /** Stereo tabletop position (-1 left .. +1 right); clamped internally to [-0.42, 0.42] */
  pan?: number;
  /** Optional contextual attenuation (e.g. 0.38 on Home showcase table) */
  volumeScale?: number;
}

const SFX_VOL_STORAGE_KEY = 'chromatic_pact_sfx_vol_v1';

let muted = false;
let sfxVolume = (() => {
  if (typeof window === 'undefined') return 0.85;
  try {
    const raw = window.localStorage.getItem(SFX_VOL_STORAGE_KEY);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        return Math.max(0, Math.min(1, parsed));
      }
    }
  } catch {
    // Ignore storage restrictions
  }
  return 0.85;
})();

let audioCtx: AudioContext | null = null;
let sfxMasterGain: GainNode | null = null;
let sfxCompressor: DynamicsCompressorNode | null = null;
let onMuteChangeCallback: ((isMuted: boolean) => void) | null = null;
let lastHoverFoleyAtMs = 0;

interface CachedNoiseBank {
  white: AudioBuffer;
  pink: AudioBuffer;
}

const noiseBankByCtx = new WeakMap<AudioContext, CachedNoiseBank>();

export function registerMuteListener(cb: (isMuted: boolean) => void): void {
  onMuteChangeCallback = cb;
}

export function getSfxVolume(): number {
  return sfxVolume;
}

export function setSfxVolume(vol: number): void {
  sfxVolume = Math.max(0, Math.min(1, Number.isFinite(vol) ? vol : 0.85));
  if (sfxMasterGain && audioCtx) {
    sfxMasterGain.gain.setTargetAtTime(muted ? 0 : sfxVolume, audioCtx.currentTime, 0.02);
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SFX_VOL_STORAGE_KEY, sfxVolume.toFixed(2));
    } catch {
      // Ignore storage restrictions
    }
  }
}

function ensureMasterBus(ctx: AudioContext): AudioNode {
  if (!sfxMasterGain || !sfxCompressor) {
    sfxCompressor = ctx.createDynamicsCompressor();
    sfxCompressor.threshold.setValueAtTime(-14, ctx.currentTime);
    sfxCompressor.knee.setValueAtTime(18, ctx.currentTime);
    sfxCompressor.ratio.setValueAtTime(4, ctx.currentTime);
    sfxCompressor.attack.setValueAtTime(0.003, ctx.currentTime);
    sfxCompressor.release.setValueAtTime(0.14, ctx.currentTime);

    sfxMasterGain = ctx.createGain();
    sfxMasterGain.gain.setValueAtTime(muted ? 0 : sfxVolume, ctx.currentTime);

    sfxMasterGain.connect(sfxCompressor);
    sfxCompressor.connect(ctx.destination);
  }
  return sfxMasterGain;
}

function getNoiseBank(ctx: AudioContext): CachedNoiseBank {
  const existing = noiseBankByCtx.get(ctx);
  if (existing) return existing;

  const sampleRate = ctx.sampleRate;
  const length = Math.max(4096, Math.floor(sampleRate * 1.1));

  const white = ctx.createBuffer(1, length, sampleRate);
  const wData = white.getChannelData(0);
  for (let i = 0; i < length; i++) {
    wData[i] = Math.random() * 2 - 1;
  }

  const pink = ctx.createBuffer(1, length, sampleRate);
  const pData = pink.getChannelData(0);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  for (let i = 0; i < length; i++) {
    const wn = Math.random() * 2 - 1;
    b0 = 0.99765 * b0 + wn * 0.099046;
    b1 = 0.963 * b1 + wn * 0.2965164;
    b2 = 0.57 * b2 + wn * 1.0526913;
    pData[i] = Math.max(-1, Math.min(1, (b0 + b1 + b2 + wn * 0.1848) * 0.22));
  }

  const bank = { white, pink };
  noiseBankByCtx.set(ctx, bank);
  return bank;
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
  if (sfxMasterGain && audioCtx) {
    sfxMasterGain.gain.setTargetAtTime(muted ? 0 : sfxVolume, audioCtx.currentTime, 0.015);
  }
  if (onMuteChangeCallback) onMuteChangeCallback(muted);
}

export function toggleMute(): boolean {
  setMuted(!muted);
  return muted;
}

/** Convert board slot column (0..5) into comfortable stereo micro-pan (-0.35 .. +0.35) */
export function slotIndexToStereoPan(slotIndex: number, totalCols = 6): number {
  if (totalCols <= 1) return 0;
  const norm = (slotIndex / (totalCols - 1)) * 2 - 1;
  return Math.max(-0.36, Math.min(0.36, Number((norm * 0.35).toFixed(2))));
}

function randSpread(spread: number): number {
  return 1 + (Math.random() * 2 - 1) * spread;
}

function routeToOutput(ctx: AudioContext, node: AudioNode, pan = 0): void {
  const bus = ensureMasterBus(ctx);
  const clampedPan = Math.max(-0.42, Math.min(0.42, pan));
  if (Math.abs(clampedPan) > 0.02 && typeof ctx.createStereoPanner === 'function') {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(clampedPan, ctx.currentTime);
    node.connect(panner);
    panner.connect(bus);
  } else {
    node.connect(bus);
  }
}

interface ToneParams {
  filterFreq?: number;
  filterType?: BiquadFilterType;
  pan?: number;
  pitchSpread?: number;
  gainScale?: number;
}

function playTone(
  ctx: AudioContext,
  freqStart: number,
  freqEnd: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.14,
  delay = 0,
  params?: ToneParams
): void {
  const pitchMul = params?.pitchSpread !== undefined ? randSpread(params.pitchSpread) : 1;
  const gScale = params?.gainScale ?? 1;
  const effectiveGain = Math.max(0.0002, gainPeak * gScale * randSpread(0.04));
  if (effectiveGain <= 0.0003) return;

  const startTime = ctx.currentTime + delay;
  const endTime = startTime + duration;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  const f0 = Math.max(20, freqStart * pitchMul);
  const f1 = Math.max(20, freqEnd * pitchMul);
  osc.frequency.setValueAtTime(f0, startTime);
  if (Math.abs(f1 - f0) > 0.05) {
    osc.frequency.exponentialRampToValueAtTime(f1, endTime);
  }

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(effectiveGain, startTime + Math.min(0.022, duration * 0.24));
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  if (params?.filterFreq) {
    const filter = ctx.createBiquadFilter();
    filter.type = params.filterType ?? 'lowpass';
    filter.frequency.setValueAtTime(params.filterFreq * randSpread(0.05), startTime);
    osc.connect(filter);
    filter.connect(gain);
  } else {
    osc.connect(gain);
  }

  routeToOutput(ctx, gain, params?.pan ?? 0);

  osc.start(startTime);
  osc.stop(endTime + 0.012);
}

interface NoiseParams {
  color?: 'white' | 'pink';
  filterType?: BiquadFilterType;
  filterEndFreq?: number;
  q?: number;
  pan?: number;
  gainScale?: number;
}

function playNoiseBurst(
  ctx: AudioContext,
  duration: number,
  filterFreq: number,
  gainPeak = 0.12,
  delay = 0,
  params?: NoiseParams
): void {
  const gScale = params?.gainScale ?? 1;
  const effectiveGain = Math.max(0.0002, gainPeak * gScale * randSpread(0.05));
  if (effectiveGain <= 0.0003) return;

  const bank = getNoiseBank(ctx);
  const buf = params?.color === 'pink' ? bank.pink : bank.white;

  const startTime = ctx.currentTime + delay;
  const source = ctx.createBufferSource();
  source.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = params?.filterType ?? 'bandpass';
  const fStart = Math.max(60, filterFreq * randSpread(0.06));
  filter.frequency.setValueAtTime(fStart, startTime);
  if (params?.filterEndFreq) {
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(60, params.filterEndFreq * randSpread(0.05)),
      startTime + duration
    );
  }
  filter.Q.setValueAtTime(params?.q ?? 1.4, startTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(effectiveGain, startTime + Math.min(0.012, duration * 0.18));
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  source.connect(filter);
  filter.connect(gain);
  routeToOutput(ctx, gain, params?.pan ?? 0);

  const maxOffset = Math.max(0, buf.duration - duration - 0.02);
  const randOffset = maxOffset > 0 ? Math.random() * maxOffset : 0;
  source.start(startTime, randOffset, duration + 0.015);
}

/**
 * Assinatura Acústica Sutil dos 5 Domínios Cromáticos:
 * Colore invocações, feitiços, canalizações e impactos com a matéria física de cada Reino.
 */
function playDomainSignatureLayer(
  ctx: AudioContext,
  domain: Domain | undefined,
  mode: 'summon' | 'spell' | 'channel' | 'combat',
  pan: number,
  gainScale: number
): void {
  if (!domain || domain === 'neutral') return;
  const s = gainScale * (mode === 'combat' ? 0.78 : 0.92);

  switch (domain) {
    case 'red': {
      // Pyros (Forja Rubra): Bigorna metálica temperada + crepitar de brasa vulcânica
      playNoiseBurst(ctx, 0.14, 920, 0.055, 0.015, {
        color: 'pink',
        filterEndFreq: 520,
        q: 1.8,
        pan,
        gainScale: s,
      });
      playTone(ctx, 587.33, 579.0, 0.2, 'triangle', 0.052, 0.02, {
        pan,
        pitchSpread: 0.025,
        gainScale: s,
      });
      if (mode === 'summon' || mode === 'spell') {
        playTone(ctx, 898.0, 882.0, 0.15, 'sine', 0.032, 0.035, {
          pan,
          pitchSpread: 0.02,
          gainScale: s,
        });
      }
      break;
    }

    case 'blue': {
      // Vortex (Véu Astral): Ressonância cristalina + escape horológico de precisão
      playTone(ctx, 1318.51, 1318.51, 0.09, 'triangle', 0.044, 0.015, {
        pan,
        pitchSpread: 0.018,
        gainScale: s,
      });
      playTone(ctx, 1975.53, 2093.0, 0.22, 'sine', 0.038, 0.055, {
        pan,
        pitchSpread: 0.018,
        gainScale: s,
      });
      if (mode === 'spell' || mode === 'channel') {
        playNoiseBurst(ctx, 0.12, 3400, 0.032, 0.03, {
          q: 2.4,
          pan,
          gainScale: s,
        });
      }
      break;
    }

    case 'purple': {
      // Eclipse (Abismo Púrpura): Sub-sino de obsidiana + sopro umbral grave
      playTone(ctx, 110.0, 103.83, 0.28, 'sine', 0.075, 0.01, {
        pan,
        pitchSpread: 0.02,
        gainScale: s,
      });
      playNoiseBurst(ctx, 0.18, 460, 0.05, 0.02, {
        color: 'pink',
        filterEndFreq: 280,
        q: 1.6,
        pan,
        gainScale: s,
      });
      if (mode !== 'combat') {
        playTone(ctx, 349.23, 329.63, 0.24, 'triangle', 0.04, 0.06, {
          filterFreq: 1100,
          pan,
          pitchSpread: 0.018,
          gainScale: s,
        });
      }
      break;
    }

    case 'green': {
      // Veridia (Raiz Ancestral): Tambor de madeira-ferro + quinta harmônica silvestre
      playTone(ctx, 146.83, 98.0, 0.18, 'sine', 0.072, 0.01, {
        pan,
        pitchSpread: 0.025,
        gainScale: s,
      });
      playNoiseBurst(ctx, 0.14, 1550, 0.036, 0.02, {
        color: 'pink',
        q: 1.3,
        pan,
        gainScale: s,
      });
      if (mode !== 'combat') {
        playTone(ctx, 440.0, 659.25, 0.22, 'triangle', 0.044, 0.05, {
          filterFreq: 1800,
          pan,
          pitchSpread: 0.018,
          gainScale: s,
        });
      }
      break;
    }

    case 'gold': {
      // Solaria (Coroa Solar): Quinta imperial luminosa + harmônico de sino dourado
      playTone(ctx, 329.63, 329.63, 0.22, 'triangle', 0.046, 0.015, {
        filterFreq: 2200,
        pan,
        pitchSpread: 0.012,
        gainScale: s,
      });
      playTone(ctx, 493.88, 659.25, 0.24, 'sine', 0.048, 0.05, {
        pan,
        pitchSpread: 0.012,
        gainScale: s,
      });
      if (mode === 'summon' || mode === 'spell') {
        playTone(ctx, 1318.51, 1318.51, 0.2, 'sine', 0.028, 0.07, {
          pan,
          pitchSpread: 0.01,
          gainScale: s,
        });
      }
      break;
    }
  }
}

function dispatchSfxOnContext(ctx: AudioContext, type: SfxType, options?: SfxOptions): void {
  try {
    const pan = options?.pan ?? 0;
    const g = Math.max(0.05, Math.min(1.25, options?.volumeScale ?? 1));
    const domain = options?.domain;

    switch (type) {
      case 'card_hover': {
        // Ultra-quiet linen cardstock whisper (never intrusive)
        playNoiseBurst(ctx, 0.042, 3100, 0.024, 0, {
          filterEndFreq: 2100,
          q: 1.9,
          pan,
          gainScale: g,
        });
        playTone(ctx, 520, 640, 0.038, 'sine', 0.014, 0.004, {
          pan,
          pitchSpread: 0.05,
          gainScale: g,
        });
        break;
      }

      case 'card_select': {
        // Crisp cardstock lift + subtle oak snap
        playNoiseBurst(ctx, 0.055, 2400, 0.052, 0, {
          filterEndFreq: 1500,
          q: 1.6,
          pan,
          gainScale: g,
        });
        playTone(ctx, 340, 510, 0.075, 'triangle', 0.05, 0.008, {
          filterFreq: 1900,
          pan,
          pitchSpread: 0.035,
          gainScale: g,
        });
        break;
      }

      case 'draw': {
        // Authentic parchment slide off the Grimoire stack + soft air flick
        playNoiseBurst(ctx, 0.085, 2200, 0.072, 0, {
          filterEndFreq: 1350,
          q: 1.5,
          pan,
          gainScale: g,
        });
        playNoiseBurst(ctx, 0.05, 950, 0.038, 0.022, {
          color: 'pink',
          q: 1.2,
          pan,
          gainScale: g,
        });
        playTone(ctx, 410, 660, 0.09, 'sine', 0.052, 0.012, {
          pan,
          pitchSpread: 0.04,
          gainScale: g,
        });
        break;
      }

      case 'channel': {
        playNoiseBurst(ctx, 0.11, 1650, 0.055, 0, {
          filterEndFreq: 2800,
          q: 1.7,
          pan,
          gainScale: g,
        });
        playTone(ctx, 261.63, 523.25, 0.26, 'triangle', 0.105, 0, {
          filterFreq: 2100,
          pan,
          pitchSpread: 0.015,
          gainScale: g,
        });
        playTone(ctx, 329.63, 659.25, 0.28, 'sine', 0.09, 0.055, {
          pan,
          pitchSpread: 0.015,
          gainScale: g,
        });
        playTone(ctx, 392.0, 783.99, 0.32, 'sine', 0.08, 0.11, {
          pan,
          pitchSpread: 0.015,
          gainScale: g,
        });
        playDomainSignatureLayer(ctx, domain, 'channel', pan, g);
        break;
      }

      case 'summon': {
        const isLegendary = options?.rarity === 'legendary';
        // Physical wooden tabletop thud + cardstock slam
        playTone(ctx, isLegendary ? 132 : 116, isLegendary ? 42 : 58, isLegendary ? 0.34 : 0.22, 'sine', isLegendary ? 0.2 : 0.145, 0, {
          pan,
          pitchSpread: 0.035,
          gainScale: g,
        });
        playNoiseBurst(ctx, isLegendary ? 0.2 : 0.14, 420, isLegendary ? 0.14 : 0.105, 0, {
          color: 'pink',
          filterEndFreq: 240,
          q: 1.3,
          pan,
          gainScale: g,
        });
        playTone(ctx, 220, 330, 0.2, 'triangle', 0.082, 0.065, {
          filterFreq: 1700,
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        if (isLegendary) {
          // Brushed-gold sovereign resonance tail for Legendary arrivals
          playTone(ctx, 293.66, 440.0, 0.38, 'triangle', 0.095, 0.08, {
            filterFreq: 2400,
            pan,
            pitchSpread: 0.01,
            gainScale: g,
          });
          playTone(ctx, 587.33, 880.0, 0.42, 'sine', 0.075, 0.14, {
            pan,
            pitchSpread: 0.01,
            gainScale: g,
          });
        }
        playDomainSignatureLayer(ctx, domain, 'summon', pan, g);
        break;
      }

      case 'row_slide': {
        // Tactile felt-and-oak board slide (Vanguard <-> Rearguard maneuver)
        playNoiseBurst(ctx, 0.15, 680, 0.078, 0, {
          color: 'pink',
          filterEndFreq: 1180,
          q: 1.5,
          pan,
          gainScale: g,
        });
        playTone(ctx, 138, 86, 0.12, 'sine', 0.075, 0.085, {
          pan,
          pitchSpread: 0.04,
          gainScale: g,
        });
        break;
      }

      case 'trap_arm': {
        // Hushed face-down placement + subtle obsidian lock click
        playNoiseBurst(ctx, 0.09, 780, 0.068, 0, {
          color: 'pink',
          filterEndFreq: 420,
          pan,
          gainScale: g,
        });
        playTone(ctx, 196, 130.81, 0.16, 'triangle', 0.072, 0.015, {
          filterFreq: 950,
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        playTone(ctx, 987.77, 783.99, 0.07, 'sine', 0.042, 0.075, {
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        break;
      }

      case 'trap_flip': {
        // Crisp 180-deg card whip + sharp reveal sting
        playNoiseBurst(ctx, 0.095, 2600, 0.11, 0, {
          filterEndFreq: 1400,
          q: 1.6,
          pan,
          gainScale: g,
        });
        playTone(ctx, 293.66, 587.33, 0.2, 'sawtooth', 0.085, 0.02, {
          filterFreq: 2200,
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        playTone(ctx, 880.0, 1174.66, 0.24, 'triangle', 0.09, 0.065, {
          pan,
          pitchSpread: 0.015,
          gainScale: g,
        });
        playDomainSignatureLayer(ctx, domain, 'spell', pan, g);
        break;
      }

      case 'spell': {
        playTone(ctx, 360, 880, 0.25, 'sine', 0.1, 0, {
          pan,
          pitchSpread: 0.028,
          gainScale: g,
        });
        playTone(ctx, 540, 1120, 0.23, 'triangle', 0.082, 0.048, {
          filterFreq: 2800,
          pan,
          pitchSpread: 0.028,
          gainScale: g,
        });
        playNoiseBurst(ctx, 0.17, 2300, 0.058, 0.035, {
          filterEndFreq: 3400,
          q: 1.7,
          pan,
          gainScale: g,
        });
        playDomainSignatureLayer(ctx, domain, 'spell', pan, g);
        break;
      }

      case 'attack': {
        if (options?.isRanged) {
          // Bowstring / arcane projectile release whoosh
          playNoiseBurst(ctx, 0.13, 1650, 0.095, 0, {
            filterEndFreq: 2900,
            q: 1.8,
            pan,
            gainScale: g,
          });
          playTone(ctx, 460, 240, 0.12, 'triangle', 0.085, 0.01, {
            pan,
            pitchSpread: 0.04,
            gainScale: g,
          });
        } else {
          // Physical melee lunge cleave
          playNoiseBurst(ctx, 0.12, 1080, 0.105, 0, {
            color: 'pink',
            filterEndFreq: 560,
            q: 1.4,
            pan,
            gainScale: g,
          });
          playTone(ctx, 270, 104, 0.14, 'sawtooth', 0.098, 0, {
            filterFreq: 1400,
            pan,
            pitchSpread: 0.04,
            gainScale: g,
          });
        }
        playDomainSignatureLayer(ctx, domain, 'combat', pan, g * 0.75);
        break;
      }

      case 'hit': {
        const heavy = Boolean(options?.isHeavy);
        playNoiseBurst(ctx, heavy ? 0.22 : 0.16, heavy ? 310 : 380, heavy ? 0.21 : 0.16, 0, {
          color: 'pink',
          filterEndFreq: 170,
          q: 1.2,
          pan,
          gainScale: g,
        });
        playTone(ctx, heavy ? 128 : 142, heavy ? 34 : 46, heavy ? 0.26 : 0.19, 'sine', heavy ? 0.22 : 0.155, 0, {
          pan,
          pitchSpread: 0.04,
          gainScale: g,
        });
        playTone(ctx, heavy ? 185 : 160, 58, 0.14, 'triangle', heavy ? 0.12 : 0.085, 0.01, {
          filterFreq: 900,
          pan,
          pitchSpread: 0.04,
          gainScale: g,
        });
        if (heavy) {
          playNoiseBurst(ctx, 0.11, 2100, 0.085, 0.015, {
            q: 1.6,
            pan,
            gainScale: g,
          });
        }
        playDomainSignatureLayer(ctx, domain, 'combat', pan, g * 0.85);
        break;
      }

      case 'heal': {
        playTone(ctx, 440, 587.33, 0.18, 'sine', 0.095, 0, {
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        playTone(ctx, 587.33, 880, 0.25, 'sine', 0.105, 0.085, {
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        break;
      }

      case 'freeze': {
        playTone(ctx, 1200, 1950, 0.14, 'sine', 0.088, 0, {
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        playTone(ctx, 1600, 2400, 0.16, 'triangle', 0.075, 0.05, {
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        playNoiseBurst(ctx, 0.14, 3800, 0.068, 0.02, {
          q: 2.2,
          pan,
          gainScale: g,
        });
        break;
      }

      case 'shield_shatter': {
        // Crystalline golden Escudo Divino fracture + 3 sparkling glass shards
        playNoiseBurst(ctx, 0.14, 3900, 0.115, 0, {
          filterEndFreq: 2200,
          q: 2.0,
          pan,
          gainScale: g,
        });
        const shards = [1760.0, 2349.32, 3135.96];
        shards.forEach((freq, idx) => {
          playTone(ctx, freq, freq * 0.92, 0.14, 'triangle', 0.068, idx * 0.032, {
            pan,
            pitchSpread: 0.03,
            gainScale: g,
          });
        });
        break;
      }

      case 'reborn_rise': {
        // Rising emerald-gold phoenix breath (Renascer)
        playNoiseBurst(ctx, 0.22, 1100, 0.065, 0, {
          color: 'pink',
          filterEndFreq: 2400,
          q: 1.5,
          pan,
          gainScale: g,
        });
        const notes = [293.66, 440.0, 587.33, 739.99];
        notes.forEach((freq, idx) => {
          playTone(ctx, freq * 0.98, freq, 0.22, 'triangle', 0.072, idx * 0.045, {
            filterFreq: 2600,
            pan,
            pitchSpread: 0.015,
            gainScale: g,
          });
        });
        break;
      }

      case 'lifedrain': {
        // Velvet siphon draw + emerald arrival chime (Dreno de Vida)
        playTone(ctx, 246.94, 493.88, 0.22, 'sine', 0.082, 0, {
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        playTone(ctx, 587.33, 880.0, 0.24, 'triangle', 0.075, 0.14, {
          filterFreq: 2400,
          pan: 0,
          pitchSpread: 0.018,
          gainScale: g,
        });
        break;
      }

      case 'molten_burst': {
        // Searing magma hiss + ember pop (Pele Incandescente)
        playNoiseBurst(ctx, 0.16, 1550, 0.088, 0, {
          color: 'pink',
          filterEndFreq: 680,
          q: 1.7,
          pan,
          gainScale: g,
        });
        playTone(ctx, 196.0, 92.5, 0.15, 'sawtooth', 0.078, 0.01, {
          filterFreq: 1100,
          pan,
          pitchSpread: 0.035,
          gainScale: g,
        });
        break;
      }

      case 'fury_surge': {
        // Tight crimson war-drum punch + rising brass fifth (Fúria Crescente)
        playTone(ctx, 130.81, 73.42, 0.16, 'sine', 0.11, 0, {
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        playTone(ctx, 220.0, 329.63, 0.2, 'sawtooth', 0.075, 0.03, {
          filterFreq: 1650,
          pan,
          pitchSpread: 0.025,
          gainScale: g,
        });
        break;
      }

      case 'ascend': {
        const notes = [261.63, 329.63, 392.0, 523.25, 659.25];
        notes.forEach((n, idx) => {
          playTone(ctx, n, n * 1.03, 0.25, 'triangle', 0.105, idx * 0.058, {
            filterFreq: 2800,
            pan,
            pitchSpread: 0.01,
            gainScale: g,
          });
        });
        playDomainSignatureLayer(ctx, domain, 'summon', pan, g);
        break;
      }

      case 'domain_expand': {
        // 1. Deep Sub-Bass Tectonic Drop & Reality Seal Release (0.0s - 0.65s)
        playNoiseBurst(ctx, 0.42, 320, 0.24, 0, { color: 'pink', gainScale: g });
        playTone(ctx, 110, 36.71, 0.62, 'sine', 0.28, 0, { gainScale: g });
        playTone(ctx, 146.83, 73.42, 0.52, 'sawtooth', 0.13, 0.02, {
          filterFreq: 1200,
          gainScale: g,
        });

        // 2. Ascending Sovereign Sanctuary Choir & Brass Swell (0.12s - 1.15s)
        const chord = [
          { freq: 146.83, delay: 0.1, dur: 0.95, type: 'sawtooth' as OscillatorType, gain: 0.12 },
          { freq: 220.0, delay: 0.16, dur: 0.9, type: 'triangle' as OscillatorType, gain: 0.15 },
          { freq: 293.66, delay: 0.22, dur: 0.88, type: 'triangle' as OscillatorType, gain: 0.17 },
          { freq: 369.99, delay: 0.28, dur: 0.85, type: 'sine' as OscillatorType, gain: 0.14 },
          { freq: 440.0, delay: 0.34, dur: 0.82, type: 'triangle' as OscillatorType, gain: 0.16 },
          { freq: 587.33, delay: 0.42, dur: 0.9, type: 'sine' as OscillatorType, gain: 0.18 },
        ];
        chord.forEach((c) => {
          playTone(ctx, c.freq * 0.985, c.freq, c.dur, c.type, c.gain, c.delay, {
            filterFreq: 2600,
            pitchSpread: 0.006,
            gainScale: g,
          });
        });
        playNoiseBurst(ctx, 0.28, 2600, 0.1, 0.35, { gainScale: g });
        playDomainSignatureLayer(ctx, domain, 'spell', 0, g);
        break;
      }

      case 'domain_clash': {
        playNoiseBurst(ctx, 0.36, 420, 0.26, 0, { color: 'pink', gainScale: g });
        playTone(ctx, 130.81, 41.2, 0.48, 'sawtooth', 0.24, 0, {
          filterFreq: 1400,
          gainScale: g,
        });
        playNoiseBurst(ctx, 0.32, 2800, 0.16, 0.14, { gainScale: g });
        playTone(ctx, 196.0, 293.66, 0.55, 'triangle', 0.14, 0.12, { gainScale: g });
        playTone(ctx, 277.18, 440.0, 0.65, 'sawtooth', 0.14, 0.2, {
          filterFreq: 2100,
          gainScale: g,
        });
        playTone(ctx, 587.33, 587.33, 0.78, 'triangle', 0.16, 0.28, { gainScale: g });
        break;
      }

      case 'domain_shatter': {
        playNoiseBurst(ctx, 0.35, 320, 0.28, 0, { color: 'pink', gainScale: g });
        playTone(ctx, 140, 34, 0.48, 'sine', 0.28, 0, { gainScale: g });
        playNoiseBurst(ctx, 0.24, 3200, 0.2, 0.04, { gainScale: g });
        playNoiseBurst(ctx, 0.28, 1850, 0.16, 0.12, { gainScale: g });
        playTone(ctx, 880, 220, 0.32, 'triangle', 0.14, 0.06, { gainScale: g });
        break;
      }

      case 'wheel_domain_shatter': {
        const wheelClicks = [880.0, 1046.5, 1318.51, 1760.0];
        wheelClicks.forEach((freq, idx) => {
          const t = idx * 0.075;
          playNoiseBurst(ctx, 0.045, 2900 + idx * 350, 0.13, t, { gainScale: g });
          playTone(ctx, freq, freq * 1.04, 0.11, 'triangle', 0.14, t, { gainScale: g });
        });

        playNoiseBurst(ctx, 0.44, 280, 0.29, 0.31, { color: 'pink', gainScale: g });
        playTone(ctx, 174.61, 30.87, 0.62, 'sine', 0.31, 0.31, { gainScale: g });
        playTone(ctx, 293.66, 73.42, 0.48, 'sawtooth', 0.16, 0.33, {
          filterFreq: 1600,
          gainScale: g,
        });
        playNoiseBurst(ctx, 0.28, 3600, 0.22, 0.34, { gainScale: g });
        playNoiseBurst(ctx, 0.32, 2150, 0.18, 0.42, { gainScale: g });
        playTone(ctx, 587.33, 587.33, 0.72, 'triangle', 0.15, 0.36, { gainScale: g });
        playTone(ctx, 1174.66, 587.33, 0.45, 'sine', 0.12, 0.36, { gainScale: g });
        break;
      }

      case 'dragon_armada': {
        playNoiseBurst(ctx, 0.26, 260, 0.22, 0, { color: 'pink', gainScale: g });
        playNoiseBurst(ctx, 0.26, 340, 0.2, 0.16, { color: 'pink', gainScale: g });
        playNoiseBurst(ctx, 0.28, 440, 0.18, 0.32, { color: 'pink', gainScale: g });

        playTone(ctx, 98.0, 65.41, 0.68, 'sawtooth', 0.2, 0.04, {
          filterFreq: 1100,
          gainScale: g,
        });
        playTone(ctx, 146.83, 130.81, 0.72, 'sawtooth', 0.15, 0.12, {
          filterFreq: 1400,
          gainScale: g,
        });
        playTone(ctx, 220.0, 293.66, 0.65, 'triangle', 0.16, 0.18, { gainScale: g });
        playTone(ctx, 440.0, 587.33, 0.55, 'triangle', 0.12, 0.26, { gainScale: g });
        playNoiseBurst(ctx, 0.34, 1850, 0.14, 0.24, { gainScale: g });
        break;
      }

      case 'victory': {
        playNoiseBurst(ctx, 0.38, 280, 0.26, 0, { color: 'pink', gainScale: g });
        playTone(ctx, 130, 32, 0.42, 'sine', 0.26, 0, { gainScale: g });
        playNoiseBurst(ctx, 0.28, 2200, 0.15, 0.08, { gainScale: g });

        const fanfare = [
          { freq: 293.66, delay: 0.35, dur: 0.35 },
          { freq: 440.0, delay: 0.52, dur: 0.35 },
          { freq: 587.33, delay: 0.7, dur: 0.42 },
          { freq: 659.25, delay: 0.92, dur: 0.35 },
          { freq: 739.99, delay: 1.12, dur: 0.4 },
          { freq: 880.0, delay: 1.35, dur: 1.15 },
        ];
        fanfare.forEach((n) => {
          playTone(ctx, n.freq, n.freq, n.dur, 'triangle', 0.17, n.delay, {
            pitchSpread: 0.004,
            gainScale: g,
          });
          playTone(ctx, n.freq * 0.5, n.freq * 0.5, n.dur * 1.1, 'sine', 0.14, n.delay, {
            pitchSpread: 0.004,
            gainScale: g,
          });
        });
        playTone(ctx, 146.83, 146.83, 1.25, 'sawtooth', 0.1, 1.35, {
          filterFreq: 1800,
          gainScale: g,
        });
        playTone(ctx, 293.66, 293.66, 1.25, 'triangle', 0.13, 1.35, { gainScale: g });
        playTone(ctx, 369.99, 369.99, 1.25, 'triangle', 0.11, 1.35, { gainScale: g });
        break;
      }

      case 'defeat': {
        playNoiseBurst(ctx, 0.45, 210, 0.28, 0, { color: 'pink', gainScale: g });
        playTone(ctx, 110, 26, 0.52, 'sine', 0.28, 0, { gainScale: g });
        playNoiseBurst(ctx, 0.32, 1450, 0.15, 0.06, { gainScale: g });

        playTone(ctx, 146.83, 144.0, 1.8, 'sine', 0.21, 0.32, { gainScale: g });
        playTone(ctx, 440.0, 436.0, 1.4, 'triangle', 0.11, 0.32, { gainScale: g });
        const dirge = [
          { freq: 329.63, delay: 0.45, dur: 0.48 },
          { freq: 311.13, delay: 0.82, dur: 0.48 },
          { freq: 293.66, delay: 1.2, dur: 0.55 },
          { freq: 220.0, delay: 1.62, dur: 1.1 },
        ];
        dirge.forEach((n) => {
          playTone(ctx, n.freq, n.freq * 0.98, n.dur, 'sawtooth', 0.11, n.delay, {
            filterFreq: 1400,
            gainScale: g,
          });
          playTone(ctx, n.freq * 0.5, n.freq * 0.49, n.dur * 1.15, 'sine', 0.17, n.delay, {
            gainScale: g,
          });
        });
        break;
      }

      case 'pack_open': {
        playNoiseBurst(ctx, 0.14, 1600, 0.095, 0, { pan, gainScale: g });
        const sparkle = [392.0, 493.88, 587.33, 783.99, 987.77];
        sparkle.forEach((n, idx) => {
          playTone(ctx, n, n * 1.05, 0.22, 'sine', 0.095, 0.05 + idx * 0.05, {
            pan,
            pitchSpread: 0.012,
            gainScale: g,
          });
        });
        break;
      }

      case 'portal_cross': {
        playNoiseBurst(ctx, 0.22, 1450, 0.078, 0, { pan, gainScale: g });
        playTone(ctx, 293.66, 440.0, 0.26, 'triangle', 0.105, 0, { pan, gainScale: g });
        playTone(ctx, 440.0, 659.25, 0.3, 'sine', 0.095, 0.08, { pan, gainScale: g });
        break;
      }

      case 'landmark_discover': {
        const chime = [329.63, 440.0, 554.37, 659.25];
        chime.forEach((f, idx) => {
          playTone(ctx, f, f * 1.02, 0.26, 'triangle', 0.095, idx * 0.055, {
            pan,
            pitchSpread: 0.01,
            gainScale: g,
          });
        });
        break;
      }

      case 'diplomacy_seal': {
        playNoiseBurst(ctx, 0.12, 650, 0.105, 0, { color: 'pink', pan, gainScale: g });
        playTone(ctx, 196.0, 293.66, 0.28, 'triangle', 0.115, 0.02, { pan, gainScale: g });
        playTone(ctx, 392.0, 587.33, 0.34, 'sine', 0.105, 0.09, { pan, gainScale: g });
        break;
      }
    }
  } catch {
    // Ignore Web Audio errors in headless environments
  }
}

/**
 * Sussurro tátil de papel-linho ao passar o cursor sobre cartas na mão ou tabuleiro.
 * Limitado a dispositivos com ponteiro fino (mouse) e com cooldown para nunca saturar.
 */
export function playCardHoverFoley(pan = 0): void {
  if (muted || typeof window === 'undefined') return;
  if (
    typeof window.matchMedia === 'function' &&
    !window.matchMedia('(pointer: fine)').matches
  ) {
    return;
  }
  const now = performance.now();
  if (now - lastHoverFoleyAtMs < 68) return;
  const ctx = audioCtx;
  if (!ctx || ctx.state !== 'running') return;
  lastHoverFoleyAtMs = now;
  dispatchSfxOnContext(ctx, 'card_hover', { pan });
}

/**
 * Assinatura Sonora Ambiental Regional (Web Audio API):
 * Dispara um motivo acústico distinto para cada um dos 12 Reinos e Fronteiras de Vaeloria
 * ao entrar em seu Mapa Regional ou cruzar um Portal de Fronteira.
 */
export function playRealmEntryMotif(
  realm:
    | 'veridia'
    | 'eclipse'
    | 'matrix'
    | 'solaria'
    | 'pyros'
    | 'vortex'
    | 'underforge'
    | 'astral_isles'
    | 'sunken_abyss'
    | 'deep_roots'
    | 'sky_bastions'
    | 'prismatic_crater'
    | 'sea_of_storms'
    | 'boreal_skyway'
    | 'capital_veridia'
    | 'capital_vortex'
    | 'capital_solaria'
    | 'capital_eclipse'
    | 'capital_pyros'
    | 'capital_axial'
    | 'world'
): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state !== 'running') return;

  try {
    switch (realm) {
      case 'veridia': {
        playNoiseBurst(ctx, 0.32, 920, 0.05, 0, { color: 'pink' });
        playTone(ctx, 293.66, 293.66, 0.38, 'sine', 0.09, 0.02);
        playTone(ctx, 440.0, 440.0, 0.42, 'triangle', 0.08, 0.1);
        playTone(ctx, 587.33, 659.25, 0.4, 'sine', 0.07, 0.18);
        break;
      }
      case 'pyros': {
        playNoiseBurst(ctx, 0.28, 380, 0.12, 0, { color: 'pink' });
        playTone(ctx, 98.0, 65.41, 0.48, 'sawtooth', 0.11, 0, { filterFreq: 1200 });
        playTone(ctx, 587.33, 580.0, 0.36, 'triangle', 0.08, 0.04);
        break;
      }
      case 'vortex': {
        playTone(ctx, 1318.51, 1318.51, 0.08, 'triangle', 0.07, 0);
        playTone(ctx, 1046.5, 1046.5, 0.08, 'triangle', 0.07, 0.12);
        playTone(ctx, 659.25, 987.77, 0.46, 'sine', 0.09, 0.18);
        playNoiseBurst(ctx, 0.25, 3100, 0.04, 0.05);
        break;
      }
      case 'solaria': {
        playTone(ctx, 329.63, 329.63, 0.36, 'triangle', 0.09, 0);
        playTone(ctx, 493.88, 493.88, 0.4, 'triangle', 0.09, 0.08);
        playTone(ctx, 659.25, 659.25, 0.48, 'sine', 0.08, 0.16);
        break;
      }
      case 'eclipse': {
        playTone(ctx, 146.83, 144.5, 0.62, 'sine', 0.12, 0);
        playTone(ctx, 349.23, 346.0, 0.48, 'triangle', 0.08, 0.08);
        playTone(ctx, 440.0, 415.3, 0.45, 'sine', 0.07, 0.16);
        break;
      }
      case 'matrix': {
        const seals = [261.63, 329.63, 392.0, 493.88, 587.33];
        seals.forEach((f, idx) => {
          playTone(ctx, f, f, 0.34, 'sine', 0.065, idx * 0.045);
        });
        break;
      }
      case 'underforge': {
        playNoiseBurst(ctx, 0.36, 240, 0.15, 0, { color: 'pink' });
        playTone(ctx, 73.42, 49.0, 0.56, 'sawtooth', 0.13, 0, { filterFreq: 1100 });
        playTone(ctx, 440.0, 434.0, 0.32, 'triangle', 0.09, 0.05);
        playTone(ctx, 587.33, 580.0, 0.36, 'triangle', 0.09, 0.19);
        break;
      }
      case 'astral_isles': {
        const stars = [783.99, 987.77, 1174.66, 1567.98];
        stars.forEach((f, idx) => {
          playTone(ctx, f, f * 1.01, 0.34, 'sine', 0.07, idx * 0.06);
        });
        playNoiseBurst(ctx, 0.28, 3600, 0.04, 0.04);
        break;
      }
      case 'sunken_abyss': {
        playNoiseBurst(ctx, 0.4, 310, 0.09, 0, { color: 'pink' });
        playTone(ctx, 110.0, 98.0, 0.65, 'sine', 0.14, 0);
        playTone(ctx, 261.63, 246.94, 0.52, 'triangle', 0.08, 0.12);
        break;
      }
      case 'deep_roots': {
        playTone(ctx, 130.81, 98.0, 0.42, 'sine', 0.12, 0);
        playTone(ctx, 392.0, 440.0, 0.44, 'triangle', 0.08, 0.09);
        playTone(ctx, 587.33, 783.99, 0.42, 'sine', 0.07, 0.18);
        break;
      }
      case 'sky_bastions': {
        playNoiseBurst(ctx, 0.32, 2200, 0.05, 0);
        playTone(ctx, 392.0, 392.0, 0.38, 'triangle', 0.09, 0.02);
        playTone(ctx, 587.33, 587.33, 0.42, 'triangle', 0.09, 0.1);
        playTone(ctx, 783.99, 783.99, 0.5, 'sine', 0.085, 0.18);
        break;
      }
      case 'prismatic_crater': {
        playNoiseBurst(ctx, 0.24, 1800, 0.08, 0);
        const rays = [220.0, 293.66, 369.99, 493.88, 659.25, 880.0];
        rays.forEach((f, idx) => {
          playTone(ctx, f * 0.99, f, 0.38, 'triangle', 0.065, idx * 0.04);
        });
        break;
      }
      case 'sea_of_storms': {
        playNoiseBurst(ctx, 0.48, 520, 0.11, 0, { color: 'pink' });
        playTone(ctx, 98.0, 92.5, 0.58, 'sawtooth', 0.1, 0.04, { filterFreq: 1100 });
        playTone(ctx, 196.0, 293.66, 0.44, 'triangle', 0.08, 0.16);
        break;
      }
      case 'boreal_skyway': {
        playNoiseBurst(ctx, 0.42, 2600, 0.06, 0);
        playTone(ctx, 440.0, 659.25, 0.38, 'sine', 0.085, 0.03);
        playTone(ctx, 659.25, 880.0, 0.45, 'triangle', 0.08, 0.12);
        playTone(ctx, 1174.66, 1318.51, 0.4, 'sine', 0.065, 0.2);
        break;
      }
      case 'capital_veridia': {
        playTone(ctx, 293.66, 440.0, 0.42, 'triangle', 0.1, 0);
        playTone(ctx, 587.33, 587.33, 0.48, 'sine', 0.09, 0.09);
        playTone(ctx, 880.0, 880.0, 0.44, 'sine', 0.075, 0.18);
        break;
      }
      case 'capital_vortex': {
        const ticks = [1567.98, 1318.51, 1975.53];
        ticks.forEach((f, idx) => {
          playTone(ctx, f, f, 0.12, 'triangle', 0.075, idx * 0.08);
        });
        playTone(ctx, 523.25, 1046.5, 0.52, 'sine', 0.09, 0.2);
        break;
      }
      case 'capital_solaria': {
        playTone(ctx, 329.63, 329.63, 0.4, 'sawtooth', 0.08, 0, { filterFreq: 2000 });
        playTone(ctx, 415.3, 415.3, 0.42, 'triangle', 0.09, 0.08);
        playTone(ctx, 493.88, 659.25, 0.54, 'triangle', 0.1, 0.16);
        break;
      }
      case 'capital_eclipse': {
        playTone(ctx, 110.0, 108.0, 0.72, 'sine', 0.14, 0);
        playTone(ctx, 329.63, 311.13, 0.54, 'triangle', 0.085, 0.1);
        playTone(ctx, 659.25, 622.25, 0.48, 'sine', 0.07, 0.22);
        break;
      }
      case 'capital_pyros': {
        playNoiseBurst(ctx, 0.26, 620, 0.13, 0, { color: 'pink' });
        playTone(ctx, 82.41, 55.0, 0.52, 'sawtooth', 0.13, 0, { filterFreq: 1100 });
        playTone(ctx, 523.25, 516.0, 0.28, 'triangle', 0.095, 0.06);
        playTone(ctx, 659.25, 650.0, 0.34, 'triangle', 0.09, 0.18);
        break;
      }
      case 'capital_axial': {
        const chord = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99];
        chord.forEach((f, idx) => {
          playTone(ctx, f, f, 0.42, 'triangle', 0.075, idx * 0.045);
        });
        break;
      }
      case 'world': {
        playTone(ctx, 220.0, 329.63, 0.26, 'triangle', 0.08, 0);
        playTone(ctx, 440.0, 440.0, 0.3, 'sine', 0.07, 0.08);
        break;
      }
    }
  } catch {
    // Ignore Web Audio errors
  }
}

export function playSfx(type: SfxType, options?: SfxOptions): void {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx
      .resume()
      .then(() => {
        if (!muted && ctx.state === 'running') {
          dispatchSfxOnContext(ctx, type, options);
        }
      })
      .catch(() => {});
    return;
  }

  dispatchSfxOnContext(ctx, type, options);
}
