import { Domain } from '../types/game';
import {
  isMuted,
  notifyAudioSettingsChanged,
  registerMuteListener,
  registerMusicDuckHandler,
} from './soundEngine';

export type MusicIntensityStage =
  | 'sanctuary'     // 0: Home, Deckbuilder, Mythology, Codex (Medieval Lute, Cello & Harp)
  | 'tactical'      // 1: Early Battle Turns 1-3 (Tense Orchestral Strings & Subtle Percussion)
  | 'battle'        // 2: Mid Battle / Full Board Formation (Full Orchestral Crusade)
  | 'domain_clash'  // 3: Active Domain Expansion or Legendary (High-Energy Arcane Clash)
  | 'climax';       // 4: Low HP / Lethal Danger / Ascended Unit / Boss Climax (Epic Five Armies Finale)

export interface MusicStateDescriptor {
  stage: MusicIntensityStage;
  domain: Domain;
  isBossMatch?: boolean;
  label: string;
}

const MUSIC_VOL_STORAGE_KEY = 'chromatic_pact_music_vol_v1';

const STAGE_LABELS: Record<MusicIntensityStage, string> = {
  sanctuary: 'Santuário Cromático',
  tactical: 'Abertura Tática',
  battle: 'Guerra de Formações',
  domain_clash: 'Pressão Arcana',
  climax: 'Clímax: Expansão de Domínio',
};

const DOMAIN_MUSIC_TITLES: Record<Domain, string> = {
  neutral: 'Fronteira Cinzenta',
  red: 'Chamas de Pyros',
  blue: 'Véu Astral',
  purple: 'Cripta Umbral',
  green: 'Raízes Primordiais',
  gold: 'Zênite Solar',
};

const STAGE_MP3_PATHS: Record<MusicIntensityStage, string> = {
  sanctuary: '/assets/music/sanctuary.mp3',
  tactical: '/assets/music/tactical.mp3',
  battle: '/assets/music/battle.mp3',
  domain_clash: '/assets/music/domain_clash.mp3',
  climax: '/assets/music/climax.mp3',
};

export const STAGE_TARGET_VOLUMES: Record<MusicIntensityStage, number> = {
  sanctuary: 0.52,
  tactical: 0.58,
  battle: 0.65,
  domain_clash: 0.82,
  climax: 1.0,
};

let musicVolume = (() => {
  if (typeof window === 'undefined') return 0.75;
  try {
    const raw = window.localStorage.getItem(MUSIC_VOL_STORAGE_KEY);
    if (raw !== null) {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) {
        return Math.max(0, Math.min(1, parsed));
      }
    }
  } catch {
    // Ignore storage restrictions
  }
  return 0.75;
})();

let currentDescriptor: MusicStateDescriptor = {
  stage: 'sanctuary',
  domain: 'neutral',
  isBossMatch: false,
  label: 'Santuário Cromático',
};

let listeners: Array<(desc: MusicStateDescriptor) => void> = [];

function notifyListeners(): void {
  for (const fn of listeners) {
    fn(currentDescriptor);
  }
}

export function subscribeMusicState(fn: (desc: MusicStateDescriptor) => void): () => void {
  listeners.push(fn);
  fn(currentDescriptor);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export function getCurrentMusicState(): MusicStateDescriptor {
  return currentDescriptor;
}

export function getMusicVolume(): number {
  return musicVolume;
}

export function setMusicVolume(vol: number): void {
  musicVolume = Math.max(0, Math.min(1, Number.isFinite(vol) ? vol : 0.75));
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(MUSIC_VOL_STORAGE_KEY, musicVolume.toFixed(2));
    } catch {
      // Ignore storage restrictions
    }
    const targetStage = currentDescriptor.stage;
    const el = getOrCreateAudio(targetStage);
    if (!isMuted() && !isDocumentHidden() && musicVolume > 0.004 && el.paused) {
      el.play().catch(() => {});
    }
    ensureFadeLoop();
  }
  notifyAudioSettingsChanged();
}

// ============================================================================
// REAL ORCHESTRAL MP3 ENGINE WITH SMOOTH CROSSFADE, VISIBILITY & AUDIO DUCKING
// ============================================================================
const audioElements: Partial<Record<MusicIntensityStage, HTMLAudioElement>> = {};
let activeStage: MusicIntensityStage | null = null;
let fadeTimer: number | null = null;
let lastTickMs = 0;

// Dynamic ducking envelope (1.0 = full target volume, < 1.0 = ducked during dramatic SFX)
let duckTargetRatio = 1.0;
let duckHoldUntilMs = 0;
let currentDuckEnvelope = 1.0;

function isDocumentHidden(): boolean {
  return typeof document !== 'undefined' && document.visibilityState === 'hidden';
}

function safeSetElementVolume(el: HTMLAudioElement, nextVol: number): void {
  const clamped = Math.max(0, Math.min(1, Number.isFinite(nextVol) ? nextVol : 0));
  try {
    el.volume = clamped;
  } catch {
    // Read-only hardware volume on certain iOS builds — handled gracefully via play/pause
  }
}

function getOrCreateAudio(stage: MusicIntensityStage): HTMLAudioElement {
  let el = audioElements[stage];
  if (!el) {
    el = new Audio(STAGE_MP3_PATHS[stage]);
    el.loop = true;
    el.preload = 'auto';
    safeSetElementVolume(el, 0);
    audioElements[stage] = el;
  }
  return el;
}

function ensureFadeLoop(): void {
  if (typeof window === 'undefined') return;
  if (fadeTimer === null) {
    lastTickMs = performance.now();
    fadeTimer = window.setInterval(runCrossfadeTick, 40);
  }
}

export function duckMusic(ratio = 0.36, holdMs = 1000): void {
  if (typeof window === 'undefined') return;
  const clampedRatio = Math.max(0.18, Math.min(1, ratio));
  const now = performance.now();
  duckTargetRatio = Math.min(duckTargetRatio, clampedRatio);
  duckHoldUntilMs = Math.max(duckHoldUntilMs, now + Math.max(150, holdMs));
  ensureFadeLoop();
}

registerMusicDuckHandler(duckMusic);

function runCrossfadeTick(): void {
  if (typeof window === 'undefined') return;
  const now = performance.now();
  const dtSec = Math.max(0.015, Math.min(0.15, (now - lastTickMs) / 1000 || 0.04));
  lastTickMs = now;

  // Advance smooth ducking envelope
  let duckStillActive = false;
  if (now < duckHoldUntilMs) {
    duckStillActive = true;
    const attackAlpha = 1 - Math.exp(-dtSec * 14);
    currentDuckEnvelope += (duckTargetRatio - currentDuckEnvelope) * attackAlpha;
  } else {
    duckTargetRatio = 1.0;
    if (Math.abs(1.0 - currentDuckEnvelope) > 0.008) {
      duckStillActive = true;
      const releaseAlpha = 1 - Math.exp(-dtSec * 3.1);
      currentDuckEnvelope += (1.0 - currentDuckEnvelope) * releaseAlpha;
    } else {
      currentDuckEnvelope = 1.0;
    }
  }

  const muted = isMuted();
  const hidden = isDocumentHidden();
  const audiblyEnabled = !muted && !hidden && musicVolume > 0.004;
  const targetStage = currentDescriptor.stage;
  let anyStillFading = duckStillActive;

  (Object.keys(STAGE_MP3_PATHS) as MusicIntensityStage[]).forEach((st) => {
    const el = audioElements[st];
    if (!el) return;

    const isTarget = st === targetStage;
    const desiredVol =
      audiblyEnabled && isTarget
        ? Math.max(0, Math.min(1, STAGE_TARGET_VOLUMES[st] * musicVolume * currentDuckEnvelope))
        : 0;

    if (audiblyEnabled && isTarget && el.paused) {
      el.play().catch(() => {});
    }

    const currentVol = el.volume;
    const diff = desiredVol - currentVol;

    if (Math.abs(diff) > 0.008) {
      anyStillFading = true;
      // Exponential + linear floor for crisp, click-free organic crossfades
      const rate =
        diff > 0 ? (st === 'climax' ? 2.4 : 1.35) : hidden || muted ? 3.2 : 1.45;
      const maxStep = rate * dtSec;
      const nextVol =
        Math.abs(diff) <= maxStep
          ? desiredVol
          : currentVol + Math.sign(diff) * Math.max(maxStep * 0.45, Math.abs(diff) * Math.min(0.35, rate * dtSec * 1.4));
      safeSetElementVolume(el, nextVol);
    } else {
      safeSetElementVolume(el, desiredVol);
      if (desiredVol === 0 && !el.paused && (!isTarget || !audiblyEnabled)) {
        el.pause();
      }
    }
  });

  if (!anyStillFading && fadeTimer !== null) {
    window.clearInterval(fadeTimer);
    fadeTimer = null;
  }
}

function triggerCrossfadeTo(stage: MusicIntensityStage): void {
  if (typeof window === 'undefined') return;

  const targetEl = getOrCreateAudio(stage);
  const audiblyEnabled = !isMuted() && !isDocumentHidden() && musicVolume > 0.004;

  if (audiblyEnabled) {
    if (stage === 'climax') {
      const floorVol = Math.min(
        STAGE_TARGET_VOLUMES.climax * musicVolume * currentDuckEnvelope,
        0.28 * musicVolume
      );
      if (targetEl.volume < floorVol) {
        safeSetElementVolume(targetEl, floorVol);
      }
    }
    if (targetEl.paused) {
      targetEl.play().catch(() => {
        // Wait for user interaction if blocked by browser autoplay policy
      });
    }
  }
  activeStage = stage;
  ensureFadeLoop();
}

export function syncMusicMuteState(muted: boolean): void {
  if (typeof window === 'undefined') return;
  const targetStage = currentDescriptor.stage;
  const el = getOrCreateAudio(targetStage);

  if (!muted && !isDocumentHidden() && musicVolume > 0.004 && el.paused) {
    el.play().catch(() => {});
  }

  ensureFadeLoop();
}

registerMuteListener(syncMusicMuteState);

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!isDocumentHidden() && !isMuted() && musicVolume > 0.004 && activeStage) {
      const el = getOrCreateAudio(currentDescriptor.stage);
      if (el.paused) {
        el.play().catch(() => {});
      }
    }
    ensureFadeLoop();
  });
}

let allStagesPreloaded = false;

export function startAdaptiveMusic(): void {
  if (typeof window === 'undefined') return;
  if (!allStagesPreloaded) {
    allStagesPreloaded = true;
    (Object.keys(STAGE_MP3_PATHS) as MusicIntensityStage[]).forEach((st) => {
      getOrCreateAudio(st);
    });
  }
  const stage = currentDescriptor.stage;
  const el = getOrCreateAudio(stage);
  if (!isMuted() && !isDocumentHidden() && musicVolume > 0.004 && el.paused) {
    safeSetElementVolume(el, STAGE_TARGET_VOLUMES[stage] * musicVolume * currentDuckEnvelope);
    el.play().catch(() => {});
  }
  triggerCrossfadeTo(stage);
}

export function setMusicState(
  stage: MusicIntensityStage,
  domain: Domain = 'neutral',
  isBossMatch = false
): void {
  const stageLabel = STAGE_LABELS[stage].trim();
  const domTitle = domain !== 'neutral' ? ` • ${DOMAIN_MUSIC_TITLES[domain]}` : '';
  const nextLabel = `${stageLabel}${domTitle}`;

  const stageChanged = currentDescriptor.stage !== stage || activeStage !== stage;
  const domainChanged = currentDescriptor.domain !== domain;

  currentDescriptor = {
    stage,
    domain,
    isBossMatch,
    label: nextLabel,
  };

  if (stageChanged || domainChanged) {
    notifyListeners();
  }

  const targetEl = getOrCreateAudio(stage);
  const targetFullVol = STAGE_TARGET_VOLUMES[stage] * musicVolume;
  if (
    stageChanged ||
    (!isMuted() &&
      !isDocumentHidden() &&
      musicVolume > 0.004 &&
      (targetEl.paused || targetEl.volume < targetFullVol * currentDuckEnvelope - 0.03))
  ) {
    triggerCrossfadeTo(stage);
  }
}
