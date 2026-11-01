export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export type PwaPlatformKind = 'ios' | 'android' | 'desktop';
export type PwaBrowserKind = 'safari' | 'chromium' | 'firefox' | 'other';

export interface PwaInstallState {
  /** Native Chromium/Edge/Android one-click install prompt is ready */
  canInstall: boolean;
  /** True whenever NOT running as an installed standalone PWA (100% of browser-tab visitors) */
  shouldPromoteInstall: boolean;
  /** True when already running inside the installed PWA window */
  isStandalone: boolean;
  /** True if the user temporarily snoozed the Home banner (re-encourages automatically next day) */
  isBannerSnoozed: boolean;
  /** True when a newer Service Worker / game build was activated in background */
  updateAvailable: boolean;
  platform: PwaPlatformKind;
  browser: PwaBrowserKind;
}

declare global {
  interface Window {
    __chromaticDeferredPwaPrompt?: BeforeInstallPromptEvent | null;
  }
}

const PWA_BANNER_SNOOZE_KEY = 'chromatic_pact_pwa_banner_snooze_until_v1';
const SW_AUTORELOAD_GUARD_KEY = 'chromatic_pact_sw_autoreload_ts_v1';
const DEFAULT_SNOOZE_HOURS = 18;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let updateAvailableFlag = false;
let swRegistration: ServiceWorkerRegistration | null = null;
let initialized = false;
let canSafeAutoReloadCheck: () => boolean = () => true;
const listeners = new Set<(state: PwaInstallState) => void>();

/**
 * Registers a guard (e.g., `() => activeTab !== 'arena'`) so when a new Service Worker
 * deploy takes control (`controllerchange`), the app reloads seamlessly without Ctrl+F5
 * whenever the player is NOT mid-combat!
 */
export function setPwaAutoReloadGuard(guardFn: () => boolean): void {
  canSafeAutoReloadCheck = guardFn;
}

export function detectPwaPlatform(): { platform: PwaPlatformKind; browser: PwaBrowserKind } {
  if (typeof navigator === 'undefined') {
    return { platform: 'desktop', browser: 'other' };
  }
  const ua = navigator.userAgent || '';
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const platform: PwaPlatformKind = isIOS ? 'ios' : isAndroid ? 'android' : 'desktop';

  let browser: PwaBrowserKind = 'other';
  if (/Firefox|FxiOS/i.test(ua)) {
    browser = 'firefox';
  } else if (/Edg|Chrome|CriOS|Chromium|OPR|SamsungBrowser/i.test(ua)) {
    browser = 'chromium';
  } else if (/Safari/i.test(ua)) {
    browser = 'safari';
  }
  return { platform, browser };
}

export function isRunningAsStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaStandalone =
    (window.matchMedia?.('(display-mode: standalone)').matches ?? false) ||
    (window.matchMedia?.('(display-mode: fullscreen)').matches ?? false) ||
    (window.matchMedia?.('(display-mode: minimal-ui)').matches ?? false);
  const iosStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone
  );
  return mediaStandalone || iosStandalone;
}

function isPwaBannerCurrentlySnoozed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(PWA_BANNER_SNOOZE_KEY);
    if (!raw) return false;
    const until = Number(raw);
    if (!Number.isFinite(until)) return false;
    return Date.now() < until;
  } catch {
    return false;
  }
}

export function snoozePwaBanner(hours: number = DEFAULT_SNOOZE_HOURS): void {
  if (typeof window === 'undefined') return;
  try {
    const until = Date.now() + Math.max(1, hours) * 60 * 60 * 1000;
    localStorage.setItem(PWA_BANNER_SNOOZE_KEY, String(until));
  } catch {
    // Ignore storage quota errors
  }
  notifyListeners();
}

export function clearPwaBannerSnooze(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PWA_BANNER_SNOOZE_KEY);
  } catch {
    // Ignore
  }
  notifyListeners();
}

export function getPwaInstallState(): PwaInstallState {
  if (typeof window !== 'undefined' && !deferredPrompt && window.__chromaticDeferredPwaPrompt) {
    deferredPrompt = window.__chromaticDeferredPwaPrompt;
  }
  const standalone = isRunningAsStandalonePwa();
  const { platform, browser } = detectPwaPlatform();
  return {
    canInstall: !standalone && deferredPrompt !== null,
    shouldPromoteInstall: !standalone,
    isStandalone: standalone,
    isBannerSnoozed: isPwaBannerCurrentlySnoozed(),
    updateAvailable: updateAvailableFlag,
    platform,
    browser,
  };
}

function notifyListeners(): void {
  const current = getPwaInstallState();
  for (const cb of listeners) {
    cb(current);
  }
}

export function initPwaSupport(): void {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  if (window.__chromaticDeferredPwaPrompt) {
    deferredPrompt = window.__chromaticDeferredPwaPrompt;
  }

  window.addEventListener('chromatic:pwa-prompt-captured', () => {
    if (window.__chromaticDeferredPwaPrompt) {
      deferredPrompt = window.__chromaticDeferredPwaPrompt;
      notifyListeners();
    }
  });

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    window.__chromaticDeferredPwaPrompt = deferredPrompt;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    window.__chromaticDeferredPwaPrompt = null;
    notifyListeners();
  });

  // React immediately if user installs or opens via display-mode media query change
  try {
    const mq = window.matchMedia?.('(display-mode: standalone)');
    mq?.addEventListener?.('change', () => notifyListeners());
  } catch {
    // Ignore older browsers
  }

  const isLocalDev =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocalDev && 'serviceWorker' in navigator) {
    const hadControllerAtBoot = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Only signal/auto-reload if there was already a previous SW controlling this returning user
      if (!hadControllerAtBoot) return;

      if (canSafeAutoReloadCheck()) {
        try {
          const lastReload = Number(sessionStorage.getItem(SW_AUTORELOAD_GUARD_KEY) || '0');
          if (Date.now() - lastReload > 30_000) {
            sessionStorage.setItem(SW_AUTORELOAD_GUARD_KEY, String(Date.now()));
            window.location.reload();
            return;
          }
        } catch {
          // Fall through to manual update banner if sessionStorage is blocked
        }
      }

      updateAvailableFlag = true;
      notifyListeners();
    });

    const registerSw = () => {
      navigator.serviceWorker
        .register('/sw.js', { updateViaCache: 'none' })
        .then((reg) => {
          swRegistration = reg;
          reg.update().catch(() => undefined);

          reg.addEventListener('updatefound', () => {
            const installing = reg.installing;
            if (!installing) return;
            installing.addEventListener('statechange', () => {
              if (installing.state === 'installed' && navigator.serviceWorker.controller) {
                updateAvailableFlag = true;
                notifyListeners();
              }
            });
          });
        })
        .catch(() => {
          // Ignore SW registration failure on unsupported browsers
        });
    };

    if (document.readyState === 'complete') {
      registerSw();
    } else {
      window.addEventListener('load', registerSw, { once: true });
    }

    // Whenever returning user brings the tab/PWA back to foreground (or every 4 min), check for new deploys!
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && swRegistration) {
        swRegistration.update().catch(() => undefined);
      }
    });
    window.setInterval(() => {
      if (document.visibilityState === 'visible' && swRegistration) {
        swRegistration.update().catch(() => undefined);
      }
    }, 4 * 60 * 1000);
  }
}

export function subscribePwaInstallState(
  callback: (state: PwaInstallState) => void
): () => void {
  listeners.add(callback);
  callback(getPwaInstallState());
  return () => {
    listeners.delete(callback);
  };
}

export async function triggerPwaInstallPrompt(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt && typeof window !== 'undefined' && window.__chromaticDeferredPwaPrompt) {
    deferredPrompt = window.__chromaticDeferredPwaPrompt;
  }
  if (!deferredPrompt) return 'unavailable';
  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      deferredPrompt = null;
      if (typeof window !== 'undefined') {
        window.__chromaticDeferredPwaPrompt = null;
      }
      notifyListeners();
      return 'accepted';
    }
    notifyListeners();
    return 'dismissed';
  } catch {
    return 'unavailable';
  }
}

export function applyPwaUpdate(): void {
  if (typeof window === 'undefined') return;
  try {
    swRegistration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  } catch {
    // Ignore
  }
  window.location.reload();
}
