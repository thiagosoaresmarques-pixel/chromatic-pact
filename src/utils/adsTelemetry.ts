/**
 * Telemetria e Rastreamento de Conversões do Google Ads para Pacto Cromático (Chromatic Pact).
 * Captura parâmetros de atribuição (GCLID / UTM) e despacha eventos de funil para gtag / dataLayer.
 */

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
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  landedAt: number;
  landingUrl: string;
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
const ATTRIBUTION_STORAGE_KEY = 'chromatic_pact_ads_attribution_v1';
const EVENTS_AUDIT_STORAGE_KEY = 'chromatic_pact_ads_events_v1';
const SESSION_LANDED_KEY = 'chromatic_pact_ads_session_landed_v1';
const MAX_AUDIT_EVENTS = 50;

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

      // Compatibilidade com conversão "Automaticamente sem código" do Google Ads (URL /inscricao)
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
    const utmSource = searchParams.get('utm_source') ?? undefined;
    const utmMedium = searchParams.get('utm_medium') ?? undefined;
    const utmCampaign = searchParams.get('utm_campaign') ?? undefined;
    const utmTerm = searchParams.get('utm_term') ?? undefined;

    const hasUrlParams = Boolean(gclid || utmSource || utmMedium || utmCampaign || utmTerm);
    let attribution = getAdsAttribution();

    if (hasUrlParams) {
      attribution = {
        gclid: gclid ?? attribution?.gclid,
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
    if (!alreadyTrackedSession && (hasUrlParams || attribution)) {
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
