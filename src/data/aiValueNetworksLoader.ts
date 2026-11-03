import type { Domain } from '../types/game';
import type { SerializedValueMlp } from '../engine/aiValueNetwork';
import type { BicolorArchetypeId } from './aiBicolorMasteryData';
import type { PolycolorArchetypeId } from './aiPolycolorMasteryData';

export const CACHED_DOMAIN_VALUE_NETWORKS: Partial<Record<Domain, SerializedValueMlp>> = {};
export const CACHED_BICOLOR_VALUE_NETWORKS: Partial<
  Record<BicolorArchetypeId, SerializedValueMlp>
> = {};
export const CACHED_POLYCOLOR_VALUE_NETWORKS: Partial<
  Record<PolycolorArchetypeId, SerializedValueMlp>
> = {};

let isLoaded = false;
let loadPromise: Promise<void> | null = null;
let idleScheduled = false;

export function isAiValueNetworksLoaded(): boolean {
  return isLoaded;
}

export function ensureAiValueNetworksLoaded(): Promise<void> {
  if (isLoaded) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = import('./aiValueNetworksData')
    .then((mod) => {
      Object.assign(CACHED_DOMAIN_VALUE_NETWORKS, mod.DOMAIN_VALUE_NETWORKS);
      Object.assign(CACHED_BICOLOR_VALUE_NETWORKS, mod.BICOLOR_VALUE_NETWORKS);
      Object.assign(CACHED_POLYCOLOR_VALUE_NETWORKS, mod.POLYCOLOR_VALUE_NETWORKS);
      isLoaded = true;
    })
    .catch(() => {
      loadPromise = null;
    });

  return loadPromise;
}

/**
 * Schedules background loading of the Value MLP weights after first paint / idle time
 * so initial boot on 4G mobile is never blocked by the 340 KB gzipped neural weights chunk.
 */
export function scheduleAiValueNetworksPreload(): void {
  if (isLoaded || loadPromise || idleScheduled) return;
  if (typeof window === 'undefined') {
    void ensureAiValueNetworksLoaded();
    return;
  }

  idleScheduled = true;
  const trigger = () => {
    idleScheduled = false;
    void ensureAiValueNetworksLoaded();
  };

  const win = window as Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  };
  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(trigger, { timeout: 900 });
  } else {
    window.setTimeout(trigger, 220);
  }
}
