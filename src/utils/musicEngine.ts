import { Domain } from '../types/game';
import { isMuted, registerMuteListener } from './soundEngine';

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

const STAGE_LABELS: Record<MusicIntensityStage, string> = {
  sanctuary: 'Santuário Cromático',
  tactical: 'Abertura Tática',
  battle: 'Guerra de Formações',
  domain_clash: 'Expansão de Domínio',
  climax: 'CLÍMAX: Beira do Abismo',
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

const STAGE_TARGET_VOLUMES: Record<MusicIntensityStage, number> = {
  sanctuary: 0.72,
  tactical: 0.76,
  battle: 0.82,
  domain_clash: 0.88,
  climax: 0.95,
};

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

// ============================================================================
// REAL ORCHESTRAL MP3 ENGINE WITH SMOOTH CROSSFADE
// ============================================================================
const audioElements: Partial<Record<MusicIntensityStage, HTMLAudioElement>> = {};
let activeStage: MusicIntensityStage | null = null;
let fadeTimer: number | null = null;

function getOrCreateAudio(stage: MusicIntensityStage): HTMLAudioElement {
  let el = audioElements[stage];
  if (!el) {
    el = new Audio(STAGE_MP3_PATHS[stage]);
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0;
    audioElements[stage] = el;
  }
  return el;
}

function runCrossfadeTick(): void {
  if (typeof window === 'undefined') return;
  const muted = isMuted();
  const targetStage = currentDescriptor.stage;
  let anyStillFading = false;

  (Object.keys(STAGE_MP3_PATHS) as MusicIntensityStage[]).forEach((st) => {
    const el = audioElements[st];
    if (!el) return;

    const desiredVol = !muted && st === targetStage ? STAGE_TARGET_VOLUMES[st] : 0;
    const diff = desiredVol - el.volume;

    if (Math.abs(diff) > 0.02) {
      anyStillFading = true;
      const step = diff > 0 ? 0.045 : -0.055;
      el.volume = Math.max(0, Math.min(1, el.volume + step));
    } else {
      el.volume = desiredVol;
      if (desiredVol === 0 && !el.paused && st !== targetStage) {
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
  if (targetEl.paused && !isMuted()) {
    targetEl.play().catch(() => {
      // Wait for user interaction if blocked by browser autoplay policy
    });
  }
  activeStage = stage;

  if (fadeTimer === null) {
    fadeTimer = window.setInterval(runCrossfadeTick, 60);
  }
}

export function syncMusicMuteState(muted: boolean): void {
  if (typeof window === 'undefined') return;
  const targetStage = currentDescriptor.stage;
  const el = getOrCreateAudio(targetStage);

  if (!muted && el.paused) {
    el.play().catch(() => {});
  }

  if (fadeTimer === null) {
    fadeTimer = window.setInterval(runCrossfadeTick, 60);
  }
}

registerMuteListener(syncMusicMuteState);

export function startAdaptiveMusic(): void {
  if (typeof window === 'undefined') return;
  const stage = currentDescriptor.stage;
  const el = getOrCreateAudio(stage);
  if (!isMuted() && el.paused) {
    el.volume = STAGE_TARGET_VOLUMES[stage];
    el.play().catch(() => {});
  }
  triggerCrossfadeTo(stage);
}

export function setMusicState(
  stage: MusicIntensityStage,
  domain: Domain = 'neutral',
  isBossMatch = false
): void {
  const stageLabel = STAGE_LABELS[stage];
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

  if (stageChanged) {
    triggerCrossfadeTo(stage);
  }
}
