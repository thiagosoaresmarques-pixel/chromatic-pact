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
const AUDIO_MUTED_STORAGE_KEY = 'chromatic_pact_audio_muted_v1';

let muted = (() => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(AUDIO_MUTED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
})();

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
const muteListeners = new Set<(isMuted: boolean) => void>();
const audioSettingsListeners = new Set<() => void>();
let musicDuckHandler: ((ratio: number, holdMs: number) => void) | null = null;
let lastHoverFoleyAtMs = 0;

interface CachedNoiseBank {
  white: AudioBuffer;
  pink: AudioBuffer;
}

const noiseBankByCtx = new WeakMap<AudioContext, CachedNoiseBank>();

export function notifyAudioSettingsChanged(): void {
  for (const fn of audioSettingsListeners) {
    fn();
  }
}

export function subscribeAudioSettings(cb: () => void): () => void {
  audioSettingsListeners.add(cb);
  return () => {
    audioSettingsListeners.delete(cb);
  };
}

export function registerMuteListener(cb: (isMuted: boolean) => void): () => void {
  muteListeners.add(cb);
  return () => {
    muteListeners.delete(cb);
  };
}

export function registerMusicDuckHandler(fn: (ratio: number, holdMs: number) => void): void {
  musicDuckHandler = fn;
}

export function getSfxVolume(): number {
  return sfxVolume;
}

function computeSfxBusGain(vol: number, isAudioMuted: boolean): number {
  if (isAudioMuted || vol <= 0.004) return 0;
  // Makeup gain calibrated so procedural Web Audio transients match -14 LUFS orchestral MP3s
  return Math.pow(vol, 1.08) * 2.35;
}

export function setSfxVolume(vol: number): void {
  sfxVolume = Math.max(0, Math.min(1, Number.isFinite(vol) ? vol : 0.85));
  if (sfxMasterGain && audioCtx) {
    sfxMasterGain.gain.setTargetAtTime(
      computeSfxBusGain(sfxVolume, muted),
      audioCtx.currentTime,
      0.02
    );
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(SFX_VOL_STORAGE_KEY, sfxVolume.toFixed(2));
    } catch {
      // Ignore storage restrictions
    }
  }
  notifyAudioSettingsChanged();
}

function ensureMasterBus(ctx: AudioContext): AudioNode {
  if (!sfxMasterGain || !sfxCompressor) {
    sfxCompressor = ctx.createDynamicsCompressor();
    // Transparent brickwall peak limiter: protects 0 dBFS while preserving full transient punch
    sfxCompressor.threshold.setValueAtTime(-3.5, ctx.currentTime);
    sfxCompressor.knee.setValueAtTime(6, ctx.currentTime);
    sfxCompressor.ratio.setValueAtTime(12, ctx.currentTime);
    sfxCompressor.attack.setValueAtTime(0.001, ctx.currentTime);
    sfxCompressor.release.setValueAtTime(0.085, ctx.currentTime);

    sfxMasterGain = ctx.createGain();
    sfxMasterGain.gain.setValueAtTime(computeSfxBusGain(sfxVolume, muted), ctx.currentTime);

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
    pData[i] = Math.max(-1, Math.min(1, (b0 + b1 + b2 + wn * 0.1848) * 0.56));
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
  muted = Boolean(value);
  if (sfxMasterGain && audioCtx) {
    sfxMasterGain.gain.setTargetAtTime(
      computeSfxBusGain(sfxVolume, muted),
      audioCtx.currentTime,
      0.015
    );
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(AUDIO_MUTED_STORAGE_KEY, muted ? '1' : '0');
    } catch {
      // Ignore storage restrictions
    }
  }
  for (const cb of muteListeners) {
    cb(muted);
  }
  notifyAudioSettingsChanged();
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
  const effectiveGain = Math.max(0.0002, Math.min(0.95, gainPeak * gScale * randSpread(0.04)));
  if (effectiveGain <= 0.0003) return;

  const startTime = ctx.currentTime + delay;
  const endTime = startTime + duration;
  const attackEnd = startTime + Math.min(0.012, duration * 0.16);
  const holdEnd = startTime + Math.max(Math.min(0.014, duration * 0.18), duration * 0.44);

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  const f0 = Math.max(20, freqStart * pitchMul);
  const f1 = Math.max(20, freqEnd * pitchMul);
  osc.frequency.setValueAtTime(f0, startTime);
  if (Math.abs(f1 - f0) > 0.05) {
    osc.frequency.exponentialRampToValueAtTime(f1, endTime);
  }

  // 3-stage transient envelope: crisp attack -> audible body sustain -> smooth exponential tail
  gain.gain.setValueAtTime(0.0002, startTime);
  gain.gain.linearRampToValueAtTime(effectiveGain, attackEnd);
  if (holdEnd < endTime - 0.006) {
    gain.gain.linearRampToValueAtTime(effectiveGain * 0.7, holdEnd);
  }
  gain.gain.exponentialRampToValueAtTime(0.0006, endTime);

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
  osc.stop(endTime + 0.015);
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
  const filterType = params?.filterType ?? 'bandpass';
  const qVal = params?.q ?? 1.25;
  // Compensate narrow bandpass insertion loss so physical impacts/whooshes retain full body
  const qMakeup = filterType === 'bandpass' ? 1 + Math.min(1.65, qVal * 0.62) : 1.0;
  const effectiveGain = Math.max(
    0.0002,
    Math.min(0.95, gainPeak * gScale * qMakeup * randSpread(0.05))
  );
  if (effectiveGain <= 0.0003) return;

  const bank = getNoiseBank(ctx);
  const buf = params?.color === 'pink' ? bank.pink : bank.white;

  const startTime = ctx.currentTime + delay;
  const endTime = startTime + duration;
  const attackEnd = startTime + Math.min(0.009, duration * 0.15);
  const holdEnd = startTime + Math.max(Math.min(0.011, duration * 0.18), duration * 0.42);

  const source = ctx.createBufferSource();
  source.buffer = buf;

  const filter = ctx.createBiquadFilter();
  filter.type = filterType;
  const fStart = Math.max(60, filterFreq * randSpread(0.06));
  filter.frequency.setValueAtTime(fStart, startTime);
  if (params?.filterEndFreq) {
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(60, params.filterEndFreq * randSpread(0.05)),
      endTime
    );
  }
  filter.Q.setValueAtTime(qVal, startTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0002, startTime);
  gain.gain.linearRampToValueAtTime(effectiveGain, attackEnd);
  if (holdEnd < endTime - 0.006) {
    gain.gain.linearRampToValueAtTime(effectiveGain * 0.68, holdEnd);
  }
  gain.gain.exponentialRampToValueAtTime(0.0006, endTime);

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

    // Automatic musical ducking so combat impacts & dramatic moments always cut cleanly through the orchestra
    if (musicDuckHandler && g >= 0.55 && sfxVolume > 0.03) {
      if (type === 'victory' || type === 'defeat') {
        musicDuckHandler(0.22, 2150);
      } else if (
        type === 'domain_expand' ||
        type === 'domain_clash' ||
        type === 'wheel_domain_shatter' ||
        type === 'dragon_armada'
      ) {
        musicDuckHandler(0.32, 1180);
      } else if (type === 'domain_shatter') {
        musicDuckHandler(0.36, 860);
      } else if (type === 'ascend') {
        musicDuckHandler(0.48, 760);
      } else if (type === 'summon' && options?.rarity === 'legendary') {
        musicDuckHandler(0.52, 680);
      } else if (
        type === 'attack' ||
        type === 'hit' ||
        type === 'trap_flip' ||
        type === 'shield_shatter'
      ) {
        musicDuckHandler(options?.isHeavy ? 0.62 : 0.72, 260);
      }
    }

    switch (type) {
      case 'card_hover': {
        // Gentle linen cardstock whisper (audible yet polite)
        playNoiseBurst(ctx, 0.048, 2800, 0.042, 0, {
          filterEndFreq: 1850,
          q: 1.5,
          pan,
          gainScale: g,
        });
        playTone(ctx, 540, 680, 0.042, 'triangle', 0.028, 0.004, {
          filterFreq: 2200,
          pan,
          pitchSpread: 0.05,
          gainScale: g,
        });
        break;
      }

      case 'card_select': {
        // Crisp cardstock lift + oak snap
        playNoiseBurst(ctx, 0.068, 2350, 0.105, 0, {
          filterEndFreq: 1450,
          q: 1.35,
          pan,
          gainScale: g,
        });
        playTone(ctx, 360, 560, 0.088, 'triangle', 0.115, 0.006, {
          filterFreq: 2400,
          pan,
          pitchSpread: 0.035,
          gainScale: g,
        });
        break;
      }

      case 'draw': {
        // Crisp parchment slide off the Grimoire stack + snap flick
        playNoiseBurst(ctx, 0.105, 2250, 0.145, 0, {
          filterEndFreq: 1320,
          q: 1.3,
          pan,
          gainScale: g,
        });
        playNoiseBurst(ctx, 0.075, 920, 0.105, 0.02, {
          color: 'pink',
          q: 1.1,
          pan,
          gainScale: g,
        });
        playTone(ctx, 430, 720, 0.105, 'triangle', 0.115, 0.012, {
          filterFreq: 2600,
          pan,
          pitchSpread: 0.04,
          gainScale: g,
        });
        break;
      }

      case 'channel': {
        playNoiseBurst(ctx, 0.13, 1750, 0.125, 0, {
          filterEndFreq: 2950,
          q: 1.4,
          pan,
          gainScale: g,
        });
        playTone(ctx, 261.63, 523.25, 0.26, 'triangle', 0.175, 0, {
          filterFreq: 2600,
          pan,
          pitchSpread: 0.015,
          gainScale: g,
        });
        playTone(ctx, 329.63, 659.25, 0.28, 'triangle', 0.15, 0.055, {
          filterFreq: 2800,
          pan,
          pitchSpread: 0.015,
          gainScale: g,
        });
        playTone(ctx, 392.0, 783.99, 0.32, 'sine', 0.14, 0.11, {
          pan,
          pitchSpread: 0.015,
          gainScale: g,
        });
        playDomainSignatureLayer(ctx, domain, 'channel', pan, g * 1.15);
        break;
      }

      case 'summon': {
        const isLegendary = options?.rarity === 'legendary';
        // Crisp cardstock-on-oak slap (midrange snap audible on all speakers) + deep wooden resonance
        playNoiseBurst(ctx, isLegendary ? 0.14 : 0.1, 1650, isLegendary ? 0.21 : 0.165, 0, {
          filterEndFreq: 760,
          q: 1.2,
          pan,
          gainScale: g,
        });
        playNoiseBurst(ctx, isLegendary ? 0.22 : 0.16, 480, isLegendary ? 0.24 : 0.185, 0, {
          color: 'pink',
          filterEndFreq: 220,
          q: 1.1,
          pan,
          gainScale: g,
        });
        playTone(
          ctx,
          isLegendary ? 196 : 175,
          isLegendary ? 58 : 72,
          isLegendary ? 0.32 : 0.22,
          'triangle',
          isLegendary ? 0.26 : 0.21,
          0,
          {
            filterFreq: 1600,
            pan,
            pitchSpread: 0.035,
            gainScale: g,
          }
        );
        playTone(ctx, 261.63, 392.0, 0.22, 'triangle', 0.155, 0.055, {
          filterFreq: 2200,
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        if (isLegendary) {
          // Brushed-gold sovereign resonance tail for Legendary arrivals
          playTone(ctx, 293.66, 440.0, 0.4, 'sawtooth', 0.165, 0.075, {
            filterFreq: 2500,
            pan,
            pitchSpread: 0.01,
            gainScale: g,
          });
          playTone(ctx, 587.33, 880.0, 0.44, 'triangle', 0.15, 0.13, {
            pan,
            pitchSpread: 0.01,
            gainScale: g,
          });
        }
        playDomainSignatureLayer(ctx, domain, 'summon', pan, g * 1.15);
        break;
      }

      case 'row_slide': {
        // Tactile felt-and-oak board slide + wooden slot settle
        playNoiseBurst(ctx, 0.16, 980, 0.155, 0, {
          color: 'pink',
          filterEndFreq: 1650,
          q: 1.25,
          pan,
          gainScale: g,
        });
        playTone(ctx, 260, 145, 0.14, 'triangle', 0.155, 0.07, {
          filterFreq: 1500,
          pan,
          pitchSpread: 0.04,
          gainScale: g,
        });
        break;
      }

      case 'trap_arm': {
        // Concealed placement + crisp mechanical obsidian lock click
        playNoiseBurst(ctx, 0.11, 950, 0.145, 0, {
          color: 'pink',
          filterEndFreq: 480,
          q: 1.2,
          pan,
          gainScale: g,
        });
        playTone(ctx, 240, 146.83, 0.17, 'triangle', 0.155, 0.012, {
          filterFreq: 1400,
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        playTone(ctx, 1174.66, 880.0, 0.085, 'triangle', 0.12, 0.07, {
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        break;
      }

      case 'trap_flip': {
        // Crisp 180-deg card whip + dramatic ambush sting
        playNoiseBurst(ctx, 0.12, 2600, 0.22, 0, {
          filterEndFreq: 1350,
          q: 1.3,
          pan,
          gainScale: g,
        });
        playTone(ctx, 293.66, 587.33, 0.22, 'sawtooth', 0.18, 0.018, {
          filterFreq: 2600,
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        playTone(ctx, 880.0, 1174.66, 0.26, 'triangle', 0.185, 0.06, {
          pan,
          pitchSpread: 0.015,
          gainScale: g,
        });
        playDomainSignatureLayer(ctx, domain, 'spell', pan, g * 1.15);
        break;
      }

      case 'spell': {
        playNoiseBurst(ctx, 0.19, 2200, 0.15, 0.015, {
          filterEndFreq: 3500,
          q: 1.35,
          pan,
          gainScale: g,
        });
        playTone(ctx, 360, 880, 0.26, 'triangle', 0.185, 0, {
          filterFreq: 3000,
          pan,
          pitchSpread: 0.028,
          gainScale: g,
        });
        playTone(ctx, 540, 1174.66, 0.25, 'sawtooth', 0.145, 0.045, {
          filterFreq: 2900,
          pan,
          pitchSpread: 0.028,
          gainScale: g,
        });
        playDomainSignatureLayer(ctx, domain, 'spell', pan, g * 1.15);
        break;
      }

      case 'attack': {
        if (options?.isRanged) {
          // Taut bowstring / arcane snap + high-velocity projectile flight whoosh
          playNoiseBurst(ctx, 0.075, 3200, 0.21, 0, {
            filterEndFreq: 1800,
            q: 1.3,
            pan,
            gainScale: g,
          });
          playTone(ctx, 1280, 420, 0.105, 'triangle', 0.22, 0, {
            filterFreq: 3400,
            pan,
            pitchSpread: 0.04,
            gainScale: g,
          });
          playNoiseBurst(ctx, 0.18, 1550, 0.21, 0.025, {
            filterEndFreq: 3500,
            q: 1.35,
            pan,
            gainScale: g,
          });
          playTone(ctx, 660, 1080, 0.16, 'sine', 0.145, 0.03, {
            pan,
            pitchSpread: 0.035,
            gainScale: g,
          });
        } else {
          // Visceral melee lunge: air-cleave whip + tempered steel slash + chest body punch
          playNoiseBurst(ctx, 0.15, 2500, 0.23, 0, {
            filterEndFreq: 860,
            q: 1.2,
            pan,
            gainScale: g,
          });
          playTone(ctx, 980, 310, 0.125, 'triangle', 0.195, 0.005, {
            filterFreq: 3400,
            pan,
            pitchSpread: 0.04,
            gainScale: g,
          });
          playTone(ctx, 520, 155, 0.16, 'sawtooth', 0.21, 0, {
            filterFreq: 2600,
            pan,
            pitchSpread: 0.04,
            gainScale: g,
          });
          playTone(ctx, 210, 76, 0.17, 'triangle', 0.22, 0.01, {
            pan,
            pitchSpread: 0.035,
            gainScale: g,
          });
        }
        playDomainSignatureLayer(ctx, domain, 'combat', pan, g * 1.1);
        break;
      }

      case 'hit': {
        const heavy = Boolean(options?.isHeavy);
        // 1. Crisp armor/shield impact crack (cuts cleanly through any speaker)
        playNoiseBurst(ctx, heavy ? 0.14 : 0.105, heavy ? 2200 : 1950, heavy ? 0.28 : 0.22, 0, {
          filterEndFreq: 780,
          q: 1.15,
          pan,
          gainScale: g,
        });
        playTone(
          ctx,
          heavy ? 480 : 410,
          heavy ? 105 : 125,
          heavy ? 0.17 : 0.135,
          'triangle',
          heavy ? 0.27 : 0.215,
          0,
          {
            filterFreq: 2600,
            pan,
            pitchSpread: 0.04,
            gainScale: g,
          }
        );
        // 2. Heavy physical body thud
        playNoiseBurst(ctx, heavy ? 0.24 : 0.17, heavy ? 460 : 520, heavy ? 0.29 : 0.22, 0, {
          color: 'pink',
          filterEndFreq: 180,
          q: 1.05,
          pan,
          gainScale: g,
        });
        playTone(
          ctx,
          heavy ? 168 : 178,
          heavy ? 44 : 56,
          heavy ? 0.27 : 0.2,
          'sine',
          heavy ? 0.29 : 0.225,
          0,
          {
            pan,
            pitchSpread: 0.04,
            gainScale: g,
          }
        );
        if (heavy) {
          playTone(ctx, 320, 82, 0.2, 'sawtooth', 0.21, 0.012, {
            filterFreq: 2300,
            pan,
            pitchSpread: 0.035,
            gainScale: g,
          });
        }
        playDomainSignatureLayer(ctx, domain, 'combat', pan, g * 1.15);
        break;
      }

      case 'heal': {
        playTone(ctx, 440, 587.33, 0.2, 'triangle', 0.165, 0, {
          filterFreq: 2600,
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        playTone(ctx, 587.33, 880, 0.27, 'sine', 0.18, 0.08, {
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        break;
      }

      case 'freeze': {
        playNoiseBurst(ctx, 0.16, 3600, 0.165, 0.01, {
          filterEndFreq: 2200,
          q: 1.5,
          pan,
          gainScale: g,
        });
        playTone(ctx, 1180, 1960, 0.16, 'triangle', 0.165, 0, {
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        playTone(ctx, 1580, 2480, 0.18, 'sine', 0.145, 0.045, {
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        break;
      }

      case 'shield_shatter': {
        // Crystalline golden Escudo Divino fracture + 3 sparkling glass shards
        playNoiseBurst(ctx, 0.16, 3600, 0.22, 0, {
          filterEndFreq: 1900,
          q: 1.4,
          pan,
          gainScale: g,
        });
        playTone(ctx, 680, 290, 0.14, 'sawtooth', 0.15, 0, {
          filterFreq: 2800,
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        const shards = [1567.98, 2093.0, 2793.83];
        shards.forEach((freq, idx) => {
          playTone(ctx, freq, freq * 0.91, 0.16, 'triangle', 0.145, idx * 0.034, {
            pan,
            pitchSpread: 0.03,
            gainScale: g,
          });
        });
        break;
      }

      case 'reborn_rise': {
        // Rising emerald-gold phoenix breath (Renascer)
        playNoiseBurst(ctx, 0.24, 1150, 0.15, 0, {
          color: 'pink',
          filterEndFreq: 2500,
          q: 1.3,
          pan,
          gainScale: g,
        });
        const notes = [293.66, 440.0, 587.33, 739.99];
        notes.forEach((freq, idx) => {
          playTone(ctx, freq * 0.98, freq, 0.24, 'triangle', 0.155, idx * 0.045, {
            filterFreq: 2800,
            pan,
            pitchSpread: 0.015,
            gainScale: g,
          });
        });
        break;
      }

      case 'lifedrain': {
        // Velvet siphon draw + emerald arrival chime (Dreno de Vida)
        playNoiseBurst(ctx, 0.16, 1350, 0.12, 0, {
          color: 'pink',
          filterEndFreq: 2200,
          q: 1.3,
          pan,
          gainScale: g,
        });
        playTone(ctx, 261.63, 523.25, 0.23, 'triangle', 0.165, 0, {
          filterFreq: 2400,
          pan,
          pitchSpread: 0.02,
          gainScale: g,
        });
        playTone(ctx, 587.33, 880.0, 0.26, 'triangle', 0.16, 0.13, {
          filterFreq: 2800,
          pan: 0,
          pitchSpread: 0.018,
          gainScale: g,
        });
        break;
      }

      case 'molten_burst': {
        // Searing magma hiss + ember blast (Pele Incandescente)
        playNoiseBurst(ctx, 0.19, 1650, 0.2, 0, {
          color: 'pink',
          filterEndFreq: 680,
          q: 1.3,
          pan,
          gainScale: g,
        });
        playTone(ctx, 340.0, 110.0, 0.18, 'sawtooth', 0.185, 0.008, {
          filterFreq: 2100,
          pan,
          pitchSpread: 0.035,
          gainScale: g,
        });
        break;
      }

      case 'fury_surge': {
        // Crimson war-drum punch + rising brass fifth (Fúria Crescente)
        playTone(ctx, 196.0, 82.41, 0.18, 'triangle', 0.21, 0, {
          filterFreq: 1800,
          pan,
          pitchSpread: 0.03,
          gainScale: g,
        });
        playTone(ctx, 261.63, 392.0, 0.22, 'sawtooth', 0.175, 0.028, {
          filterFreq: 2200,
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
