export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PwaInstallState {
  canInstall: boolean;
  isStandalone: boolean;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(state: PwaInstallState) => void>();

export function isRunningAsStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  const mediaStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false;
  const iosStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone
  );
  return mediaStandalone || iosStandalone;
}

export function getPwaInstallState(): PwaInstallState {
  const standalone = isRunningAsStandalonePwa();
  return {
    canInstall: !standalone && deferredPrompt !== null,
    isStandalone: standalone,
  };
}

function notifyListeners(): void {
  const current = getPwaInstallState();
  for (const cb of listeners) {
    cb(current);
  }
}

export function initPwaSupport(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyListeners();
  });

  const isLocalDev =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocalDev && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Ignore SW registration failure on unsupported browsers
      });
    });
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

export async function triggerPwaInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) return false;
  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notifyListeners();
    return choice.outcome === 'accepted';
  } catch {
    return false;
  }
}
