import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import {
  ensureStarterDeckForUser,
  isUnregisteredProfile,
  saveAccountToRoster,
  setActiveTabUserProfile,
  SovereignUserProfile,
} from './multiplayerEngine';

const DECK_CODE_PREFIX = 'CPDECK1-';
const SAVE_CODE_PREFIX = 'CPSAVE1-';

const EXCLUDED_LOCAL_KEYS = new Set([
  'chromatic_pact_accounts_roster_v2',
  'chromatic_pact_mp_rooms_v2',
  'chromatic_pact_active_battle_v1',
  'chromatic_pact_app_nav_state_v1',
  'chromatic_pact_supabase_url_v1',
  'chromatic_pact_supabase_key_v1',
]);

function fnv1aHex(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function utf8ToBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToUtf8(b64url: string): string {
  const norm = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = norm.length % 4 === 0 ? '' : '='.repeat(4 - (norm.length % 4));
  const binary = atob(norm + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

// ============================================================================
// 1. SHAREABLE GRIMOIRE DECK CODES (CPDECK1-...)
// ============================================================================

const CARD_ID_TO_INDEX: Record<string, number> = {};
ALL_CARDS.forEach((c, idx) => {
  CARD_ID_TO_INDEX[c.id] = idx;
});

export interface DecodedDeckPayload {
  name: string;
  cardIds: string[];
}

export function encodeDeckCode(name: string, cardIds: string[]): string {
  const counts = new Map<number, number>();
  for (const cid of cardIds) {
    const idx = CARD_ID_TO_INDEX[cid];
    if (idx === undefined) continue;
    counts.set(idx, (counts.get(idx) ?? 0) + 1);
  }
  const pairs: string[] = [];
  for (const [idx, cnt] of Array.from(counts.entries()).sort((a, b) => a[0] - b[0])) {
    pairs.push(cnt === 1 ? idx.toString(36) : `${idx.toString(36)}.${cnt}`);
  }
  const cleanName = (name || 'Grimório Compartilhado').trim().slice(0, 48);
  const body = JSON.stringify({ n: cleanName, p: pairs.join(',') });
  const sum = fnv1aHex(body).slice(0, 6);
  return `${DECK_CODE_PREFIX}${sum}-${utf8ToBase64Url(body)}`;
}

export function decodeDeckCode(rawInput: string): {
  ok: true;
  data: DecodedDeckPayload;
} | {
  ok: false;
  error: string;
} {
  const trimmed = (rawInput || '').trim();
  if (!trimmed.startsWith(DECK_CODE_PREFIX)) {
    return {
      ok: false,
      error: 'Código inválido: o código de Grimório deve começar com CPDECK1-.',
    };
  }
  const rest = trimmed.slice(DECK_CODE_PREFIX.length);
  const dashIdx = rest.indexOf('-');
  if (dashIdx !== 6) {
    return { ok: false, error: 'Formato do código de Grimório corrompido.' };
  }
  const expectedSum = rest.slice(0, 6);
  const encodedBody = rest.slice(7);

  try {
    const body = base64UrlToUtf8(encodedBody);
    const actualSum = fnv1aHex(body).slice(0, 6);
    if (actualSum !== expectedSum) {
      return { ok: false, error: 'Assinatura do código inválida (texto incompleto ou truncado).' };
    }
    const parsed = JSON.parse(body) as { n?: string; p?: string };
    const cardIds: string[] = [];
    const tokens = (parsed.p || '').split(',').filter(Boolean);
    for (const tok of tokens) {
      const [idx36, cntStr] = tok.split('.');
      const idx = parseInt(idx36, 36);
      const cnt = Math.max(1, Math.min(4, cntStr ? parseInt(cntStr, 10) : 1));
      const card = ALL_CARDS[idx];
      if (card && CARDS_BY_ID[card.id]) {
        for (let k = 0; k < cnt; k++) {
          cardIds.push(card.id);
        }
      }
    }
    if (cardIds.length === 0) {
      return { ok: false, error: 'Nenhuma carta válida encontrada neste código.' };
    }
    return {
      ok: true,
      data: {
        name: (parsed.n || 'Grimório Importado').trim(),
        cardIds,
      },
    };
  } catch {
    return { ok: false, error: 'Não foi possível decodificar o código de Grimório.' };
  }
}

// ============================================================================
// 2. PORTABLE SOVEREIGN SAVE SNAPSHOT (PC <-> SMARTPHONE)
// ============================================================================

export interface PortableSaveEnvelope {
  v: 1;
  exportedAt: number;
  profile: SovereignUserProfile;
  localState: Record<string, string>;
}

function collectPortableLocalState(): Record<string, string> {
  const out: Record<string, string> = {};
  if (typeof window === 'undefined') return out;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (EXCLUDED_LOCAL_KEYS.has(key)) continue;
      if (key.startsWith('chromatic_pact_ads_')) continue;
      if (key.startsWith('chromatic_pact_') || key.startsWith('cp_ow_')) {
        const val = localStorage.getItem(key);
        if (val !== null) {
          out[key] = val;
        }
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return out;
}

export function exportSovereignSaveCode(profile: SovereignUserProfile): string {
  const envelope: PortableSaveEnvelope = {
    v: 1,
    exportedAt: Date.now(),
    profile,
    localState: collectPortableLocalState(),
  };
  const json = JSON.stringify(envelope);
  const sum = fnv1aHex(json);
  return `${SAVE_CODE_PREFIX}${sum}-${utf8ToBase64Url(json)}`;
}

export function downloadSovereignSaveFile(profile: SovereignUserProfile): void {
  const code = exportSovereignSaveCode(profile);
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (profile.username || 'soberano').replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateTag = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `chromatic-pact-${safeName}-${dateTag}.cpsave.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importSovereignSaveCode(rawInput: string): {
  ok: true;
  profile: SovereignUserProfile;
  restoredKeysCount: number;
} | {
  ok: false;
  error: string;
} {
  const trimmed = (rawInput || '').trim();
  if (!trimmed.startsWith(SAVE_CODE_PREFIX)) {
    return {
      ok: false,
      error: 'Código inválido: o Códice de Save deve começar com CPSAVE1-.',
    };
  }
  const rest = trimmed.slice(SAVE_CODE_PREFIX.length);
  const dashIdx = rest.indexOf('-');
  if (dashIdx !== 8) {
    return { ok: false, error: 'Formato do Códice de Save corrompido.' };
  }
  const expectedSum = rest.slice(0, 8);
  const encodedBody = rest.slice(9);

  try {
    const json = base64UrlToUtf8(encodedBody);
    const actualSum = fnv1aHex(json);
    if (actualSum !== expectedSum) {
      return {
        ok: false,
        error: 'Checksum inválido: o Códice de Save foi copiado pela metade ou alterado.',
      };
    }
    const parsed = JSON.parse(json) as Partial<PortableSaveEnvelope>;
    if (!parsed || parsed.v !== 1 || !parsed.profile || isUnregisteredProfile(parsed.profile)) {
      return { ok: false, error: 'O Códice de Save não contém um perfil de Soberano registrado.' };
    }

    let restoredKeysCount = 0;
    if (parsed.localState && typeof parsed.localState === 'object') {
      for (const [k, v] of Object.entries(parsed.localState)) {
        if (
          typeof v === 'string' &&
          !EXCLUDED_LOCAL_KEYS.has(k) &&
          (k.startsWith('chromatic_pact_') || k.startsWith('cp_ow_'))
        ) {
          try {
            localStorage.setItem(k, v);
            restoredKeysCount += 1;
          } catch {
            // Ignore quota errors
          }
        }
      }
    }

    const ensuredProfile = ensureStarterDeckForUser(parsed.profile);
    saveAccountToRoster(ensuredProfile);
    setActiveTabUserProfile(ensuredProfile);

    return {
      ok: true,
      profile: ensuredProfile,
      restoredKeysCount,
    };
  } catch {
    return { ok: false, error: 'Falha ao restaurar o Códice de Save.' };
  }
}
