/**
 * Telemetria e Rastreamento de Conversões do Google Ads para Pacto Cromático (Chromatic Pact).
 * Captura parâmetros de atribuição (GCLID / UTM) e despacha eventos de funil para gtag / dataLayer.
 */

import { CloudVisitorSessionEntry, syncVisitorSessionToCloud } from './multiplayerEngine';

export type AdsConversionEventName =
  | 'ads_visitor_landed'
  | 'quick_play_clicked'
  | 'start_duel'
  | 'start_campaign_boss'
  | 'first_card_played'
  | 'match_victory'
  | 'register_account'
  | 'open_pack'
  | 'save_deck';

export interface AdsAttributionData {
  gclid?: string;
  ttclid?: string;
  fbclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  landedAt: number;
  landingUrl: string;
}

export type TrafficChannelId = 'google_ads' | 'tiktok' | 'instagram' | 'organic';

/**
 * Classifica o canal de aquisição de uma sessão de visitante (Google Ads, TikTok, Instagram ou Orgânico/Direto).
 */
export function classifyVisitorChannel(session: {
  gclid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingUrl?: string;
}): TrafficChannelId {
  const src = (session.utmSource || '').toLowerCase();
  const med = (session.utmMedium || '').toLowerCase();
  const camp = (session.utmCampaign || '').toLowerCase();
  const url = (session.landingUrl || '').toLowerCase();

  if (
    src.includes('tiktok') ||
    src === 'tt' ||
    camp.includes('tiktok') ||
    url.includes('ttclid=') ||
    url.includes('utm_source=tiktok')
  ) {
    return 'tiktok';
  }

  if (
    src.includes('instagram') ||
    src.includes('insta') ||
    src === 'ig' ||
    src.includes('meta') ||
    med.includes('reels') ||
    camp.includes('instagram') ||
    camp.includes('reels') ||
    url.includes('fbclid=') ||
    url.includes('utm_source=instagram')
  ) {
    return 'instagram';
  }

  if (
    Boolean(session.gclid) ||
    src.includes('google') ||
    src.includes('adwords') ||
    url.includes('gclid=') ||
    url.includes('utm_source=google')
  ) {
    return 'google_ads';
  }

  return 'organic';
}

export interface AdsEventAuditEntry {
  eventName: AdsConversionEventName;
  timestamp: number;
  params: Record<string, string | number | boolean>;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | unknown[]>;
    gtag?: (
      command: 'event' | 'config' | 'js' | 'set',
      targetIdOrEventName: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}

export const GOOGLE_ADS_TAG_ID = 'AW-16651599167';
export const GOOGLE_ADS_SIGNUP_CONVERSION_SEND_TO = 'AW-16651599167/6l9iCM_rx6odEL_6jIQ-';
const ATTRIBUTION_STORAGE_KEY = 'chromatic_pact_ads_attribution_v1';
const EVENTS_AUDIT_STORAGE_KEY = 'chromatic_pact_ads_events_v1';
const SESSION_LANDED_KEY = 'chromatic_pact_ads_session_landed_v1';
const VISITOR_SESSION_STORAGE_KEY = 'chromatic_pact_visitor_session_v1';
const MAX_AUDIT_EVENTS = 50;

export function getLocalAdsAuditEvents(): AdsEventAuditEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(EVENTS_AUDIT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdsEventAuditEntry[]) : [];
  } catch {
    return [];
  }
}

function recordVisitorSessionEvent(
  eventName: AdsConversionEventName,
  params: Record<string, string | number | boolean>,
  attribution: AdsAttributionData | null
): void {
  if (typeof window === 'undefined') return;
  try {
    const now = Date.now();
    const raw = window.localStorage.getItem(VISITOR_SESSION_STORAGE_KEY);
    let session: CloudVisitorSessionEntry | null = raw ? JSON.parse(raw) : null;
    if (!session || !session.sessionId) {
      session = {
        sessionId: `vis_${now}_${Math.random().toString(36).slice(2, 8)}`,
        firstSeenAt: attribution?.landedAt ?? now,
        lastSeenAt: now,
        landingUrl: attribution?.landingUrl || window.location.href,
        gclid: attribution?.gclid,
        utmSource: attribution?.utmSource,
        utmMedium: attribution?.utmMedium,
        utmCampaign: attribution?.utmCampaign,
        utmTerm: attribution?.utmTerm,
        events: [],
        userAgentSummary: navigator.userAgent ? navigator.userAgent.slice(0, 90) : undefined,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
      };
    }
    session.lastSeenAt = now;
    if (attribution?.gclid) session.gclid = attribution.gclid;
    if (attribution?.utmSource) session.utmSource = attribution.utmSource;
    if (attribution?.utmMedium) session.utmMedium = attribution.utmMedium;
    if (attribution?.utmCampaign) session.utmCampaign = attribution.utmCampaign;
    if (attribution?.utmTerm) session.utmTerm = attribution.utmTerm;
    if (!session.events.includes(eventName)) {
      session.events = [...session.events, eventName];
    }
    if (eventName === 'register_account' && typeof params.username === 'string') {
      session.registeredUsername = params.username;
    }
    window.localStorage.setItem(VISITOR_SESSION_STORAGE_KEY, JSON.stringify(session));
    syncVisitorSessionToCloud(session);
  } catch {
    // Non-blocking
  }
}

/**
 * Lê os dados de atribuição do Google Ads salvos no localStorage.
 */
export function getAdsAttribution(): AdsAttributionData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdsAttributionData;
    if (parsed && typeof parsed.landedAt === 'number') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Verifica se o visitante atual chegou através de uma campanha do Google Ads ou link parametrizado.
 */
export function hasArrivedFromAds(): boolean {
  const attribution = getAdsAttribution();
  if (!attribution) return false;
  return Boolean(
    attribution.gclid ||
      attribution.utmSource ||
      attribution.utmMedium ||
      attribution.utmCampaign ||
      attribution.utmTerm
  );
}

/**
 * Registra um evento de conversão no Google Ads / Google Tag Manager (window.gtag e window.dataLayer)
 * e armazena no histórico local para auditoria de funil.
 */
export function trackAdsEvent(
  eventName: AdsConversionEventName,
  params: Record<string, string | number | boolean> = {}
): void {
  if (typeof window === 'undefined') return;

  const attribution = getAdsAttribution();
  const enrichedParams: Record<string, string | number | boolean> = {
    send_to: GOOGLE_ADS_TAG_ID,
    site_domain: 'chromaticpact.com',
    ...params,
    ...(attribution?.gclid ? { gclid: attribution.gclid } : {}),
    ...(attribution?.utmSource ? { utm_source: attribution.utmSource } : {}),
    ...(attribution?.utmMedium ? { utm_medium: attribution.utmMedium } : {}),
    ...(attribution?.utmCampaign ? { utm_campaign: attribution.utmCampaign } : {}),
    ...(attribution?.utmTerm ? { utm_term: attribution.utmTerm } : {}),
  };

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, enrichedParams);

      // Snippet oficial de conversão de Inscrição do Google Ads (exclusivo para chromaticpact.com)
      if (eventName === 'register_account') {
        window.gtag('event', 'conversion', {
          send_to: GOOGLE_ADS_SIGNUP_CONVERSION_SEND_TO,
          value: 1.0,
          currency: 'BRL',
        });
      }

      // Compatibilidade adicional com regra de URL /inscricao
      if (eventName === 'register_account' || eventName === 'quick_play_clicked') {
        window.gtag('event', 'page_view', {
          send_to: GOOGLE_ADS_TAG_ID,
          page_location: 'https://chromaticpact.com/inscricao',
          page_path: '/inscricao',
          page_title: 'Inscrição Concluída — Pacto Cromático',
        });
      }
    }
  } catch {
    // Ignora falhas de bloqueadores de anúncio
  }

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...enrichedParams,
    });
  } catch {
    // Ignora falhas de dataLayer
  }

  try {
    const rawAudit = window.localStorage.getItem(EVENTS_AUDIT_STORAGE_KEY);
    const currentAudit: AdsEventAuditEntry[] = rawAudit ? JSON.parse(rawAudit) : [];
    const nextEntry: AdsEventAuditEntry = {
      eventName,
      timestamp: Date.now(),
      params: enrichedParams,
    };
    const updated = [...currentAudit, nextEntry].slice(-MAX_AUDIT_EVENTS);
    window.localStorage.setItem(EVENTS_AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignora erros de quota de armazenamento
  }

  recordVisitorSessionEvent(eventName, params, attribution);
}

/**
 * Inicializa a telemetria de anúncios na entrada do aplicativo.
 * Captura parâmetros de URL (gclid, utm_source, utm_medium, utm_campaign, utm_term),
 * salva no localStorage e dispara o evento inicial `ads_visitor_landed` uma vez por sessão.
 */
export function initAdsTelemetry(): AdsAttributionData | null {
  if (typeof window === 'undefined') return null;

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const gclid = searchParams.get('gclid') ?? undefined;
    const ttclid = searchParams.get('ttclid') ?? undefined;
    const fbclid = searchParams.get('fbclid') ?? undefined;
    let utmSource = searchParams.get('utm_source') ?? undefined;
    let utmMedium = searchParams.get('utm_medium') ?? undefined;
    const utmCampaign = searchParams.get('utm_campaign') ?? undefined;
    const utmTerm = searchParams.get('utm_term') ?? undefined;

    // Fallback inteligente para cliques vindos da Bio/Vídeo do TikTok ou Instagram mesmo sem UTM manual
    const ref = (typeof document !== 'undefined' ? document.referrer || '' : '').toLowerCase();
    if (!utmSource) {
      if (ttclid || ref.includes('tiktok.com')) {
        utmSource = 'tiktok';
        if (!utmMedium) utmMedium = ttclid ? 'paid_social' : 'bio_referral';
      } else if (fbclid || ref.includes('instagram.com')) {
        utmSource = 'instagram';
        if (!utmMedium) utmMedium = fbclid ? 'paid_social' : 'bio_referral';
      } else if (gclid) {
        utmSource = 'google_ads';
        if (!utmMedium) utmMedium = 'cpc';
      }
    }

    const hasUrlParams = Boolean(
      gclid || ttclid || fbclid || utmSource || utmMedium || utmCampaign || utmTerm
    );
    let attribution = getAdsAttribution();

    if (hasUrlParams) {
      attribution = {
        gclid: gclid ?? attribution?.gclid,
        ttclid: ttclid ?? attribution?.ttclid,
        fbclid: fbclid ?? attribution?.fbclid,
        utmSource: utmSource ?? attribution?.utmSource,
        utmMedium: utmMedium ?? attribution?.utmMedium,
        utmCampaign: utmCampaign ?? attribution?.utmCampaign,
        utmTerm: utmTerm ?? attribution?.utmTerm,
        landedAt: Date.now(),
        landingUrl: window.location.href,
      };
      window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    }

    const alreadyTrackedSession = window.sessionStorage.getItem(SESSION_LANDED_KEY);
    if (!alreadyTrackedSession) {
      window.sessionStorage.setItem(SESSION_LANDED_KEY, '1');
      trackAdsEvent('ads_visitor_landed', {
        direct_landing: hasUrlParams,
        returning_attributed: !hasUrlParams && Boolean(attribution),
      });
    }

    return attribution;
  } catch {
    return null;
  }
}
