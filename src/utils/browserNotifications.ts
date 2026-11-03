const TOURNAMENT_BROWSER_ALERTS_KEY = 'chromatic_pact_trn_browser_alerts_v1';
const SENT_BROWSER_NOTIFS_KEY = 'chromatic_pact_sent_browser_notifs_v1';

export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getBrowserNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isBrowserNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

export function getTournamentBrowserAlertsEnabled(): boolean {
  if (!isBrowserNotificationSupported()) return false;
  if (Notification.permission !== 'granted') return false;
  try {
    return localStorage.getItem(TOURNAMENT_BROWSER_ALERTS_KEY) !== '0';
  } catch {
    return true;
  }
}

export async function toggleTournamentBrowserAlerts(): Promise<{
  enabled: boolean;
  permission: NotificationPermission | 'unsupported';
}> {
  if (!isBrowserNotificationSupported()) {
    return { enabled: false, permission: 'unsupported' };
  }

  if (Notification.permission === 'granted') {
    const currentlyEnabled = getTournamentBrowserAlertsEnabled();
    const nextEnabled = !currentlyEnabled;
    try {
      localStorage.setItem(TOURNAMENT_BROWSER_ALERTS_KEY, nextEnabled ? '1' : '0');
    } catch {
      // ignore
    }
    return { enabled: nextEnabled, permission: 'granted' };
  }

  try {
    const perm = await Notification.requestPermission();
    const enabled = perm === 'granted';
    if (enabled) {
      try {
        localStorage.setItem(TOURNAMENT_BROWSER_ALERTS_KEY, '1');
      } catch {
        // ignore
      }
    }
    return { enabled, permission: perm };
  } catch {
    return { enabled: false, permission: Notification.permission };
  }
}

function hasSentBrowserNotifKey(dedupKey: string): boolean {
  try {
    const raw = localStorage.getItem(SENT_BROWSER_NOTIFS_KEY);
    if (!raw) return false;
    const arr = JSON.parse(raw) as string[];
    return Array.isArray(arr) && arr.includes(dedupKey);
  } catch {
    return false;
  }
}

function markSentBrowserNotifKey(dedupKey: string): void {
  try {
    const raw = localStorage.getItem(SENT_BROWSER_NOTIFS_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    const safe = Array.isArray(arr) ? arr : [];
    if (!safe.includes(dedupKey)) {
      const next = [...safe, dedupKey].slice(-60);
      localStorage.setItem(SENT_BROWSER_NOTIFS_KEY, JSON.stringify(next));
    }
  } catch {
    // ignore
  }
}

export async function dispatchTournamentBrowserNotification(params: {
  dedupKey: string;
  title: string;
  body: string;
  url?: string;
}): Promise<boolean> {
  if (!getTournamentBrowserAlertsEnabled()) return false;
  if (hasSentBrowserNotifKey(params.dedupKey)) return false;
  markSentBrowserNotifKey(params.dedupKey);

  const targetUrl = params.url || '/?tab=tournaments';
  const options: NotificationOptions & { renotify?: boolean } = {
    body: params.body,
    icon: '/icons/icon-192.png?v=12',
    badge: '/icons/favicon-64.png?v=12',
    tag: params.dedupKey,
    data: { url: targetUrl },
  };

  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && typeof reg.showNotification === 'function') {
        await reg.showNotification(params.title, options);
        return true;
      }
    }
  } catch {
    // fallback to window Notification
  }

  try {
    const n = new Notification(params.title, options);
    n.onclick = () => {
      window.focus();
      if (targetUrl) {
        window.location.href = targetUrl;
      }
      n.close();
    };
    return true;
  } catch {
    return false;
  }
}
