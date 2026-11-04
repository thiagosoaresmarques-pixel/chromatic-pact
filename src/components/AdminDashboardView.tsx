import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { CAMPAIGN_BOSSES } from '../data/decks';
import { ELO_SCHEMA_VERSION, INITIAL_PLAYER_ELO } from '../data/eloDivisions';
import { GRAND_CAMPAIGN_BOSSES } from '../data/vaeloriaGrandCampaign';
import {
  adminDeleteCloudProfile,
  adminDeleteCloudRoom,
  adminSaveCloudProfile,
  authenticateSovereignAccount,
  buildFullUnlockedCollectionMap,
  clearCloudVisitorTelemetryForAdmin,
  CloudVisitorSessionEntry,
  fetchAllCloudProfilesForAdmin,
  fetchAllCloudRoomsForAdmin,
  GlobalAdminAnnouncement,
  hashPassword,
  isAdminProfile,
  MASTER_ADMIN_USERNAMES,
  MultiplayerRoom,
  publishGlobalAdminAnnouncement,
  SovereignUserProfile,
} from '../utils/multiplayerEngine';
import {
  classifyVisitorChannel,
  getLocalAdsAuditEvents,
  GOOGLE_ADS_SIGNUP_CONVERSION_SEND_TO,
  GOOGLE_ADS_TAG_ID,
  isBotOrInternalTelemetrySession,
  isEngagedVisitorSession,
  isReturningVisitorSession,
  TrafficChannelId,
} from '../utils/adsTelemetry';
import {
  fetchCommunityDiscordConfigFromCloud,
  getCommunityDiscordConfig,
  postDiscordWebhookTestPing,
  saveCommunityDiscordConfigToCloud,
} from '../utils/discordCommunityEngine';
import {
  fetchSharedPersonalReplay,
  fetchUserMatchHistoryForInspection,
  type PersonalMatchHistoryEntry,
  type UserInspectableMatchItem,
} from '../utils/personalMatchHistoryEngine';

interface AdminDashboardViewProps {
  currentUser: SovereignUserProfile;
  onUpdateCurrentUser: (updated: SovereignUserProfile) => void;
  onOpenAccountModal: () => void;
  onNotify: (item: { kicker: string; title: string; message: string }) => void;
  onWatchUserReplay?: (entry: PersonalMatchHistoryEntry) => void;
}

type AdminSectionTab = 'overview' | 'users' | 'telemetry' | 'rooms' | 'system';

const ALL_CAMPAIGN_BOSS_IDS = Array.from(
  new Set([...CAMPAIGN_BOSSES.map((b) => b.id), ...GRAND_CAMPAIGN_BOSSES.map((b) => b.id)])
);

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  currentUser,
  onUpdateCurrentUser,
  onOpenAccountModal,
  onNotify,
  onWatchUserReplay,
}) => {
  const [section, setSection] = useState<AdminSectionTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [profiles, setProfiles] = useState<SovereignUserProfile[]>([]);
  const [visitorSessions, setVisitorSessions] = useState<CloudVisitorSessionEntry[]>([]);
  const [cloudRooms, setCloudRooms] = useState<
    Array<{
      code: string;
      status: string;
      isPublicQueue: boolean;
      updatedAt: string;
      room: MultiplayerRoom | null;
    }>
  >([]);
  const [announcement, setAnnouncement] = useState<GlobalAdminAnnouncement | null>(null);
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [cloudError, setCloudError] = useState<string | undefined>(undefined);
  const [lastSyncAt, setLastSyncAt] = useState<number>(Date.now());

  // User management filters & selected user inspector
  const [userSearch, setUserSearch] = useState<string>('');
  const [userSort, setUserSort] = useState<'recent' | 'gold' | 'elo' | 'wins'>('recent');
  const [selectedUser, setSelectedUser] = useState<SovereignUserProfile | null>(null);
  const [selectedUserMatches, setSelectedUserMatches] = useState<UserInspectableMatchItem[]>([]);
  const [loadingSelectedUserMatches, setLoadingSelectedUserMatches] = useState<boolean>(false);
  const [loadingAdminReplayId, setLoadingAdminReplayId] = useState<string | null>(null);
  const [customGoldInput, setCustomGoldInput] = useState<string>('');
  const [customEloInput, setCustomEloInput] = useState<string>('');
  const [resetPassInput, setResetPassInput] = useState<string>('');
  const [busyAction, setBusyAction] = useState<string | null>(null);

  // Global announcement form
  const [annKicker, setAnnKicker] = useState<string>('COMUNICADO OFICIAL • ADMINISTRAÇÃO');
  const [annTitle, setAnnTitle] = useState<string>('');
  const [annMessage, setAnnMessage] = useState<string>('');
  const [adminLoginId, setAdminLoginId] = useState<string>('tsm81');
  const [adminLoginPass, setAdminLoginPass] = useState<string>('');
  const [adminLoginError, setAdminLoginError] = useState<string>('');

  useEffect(() => {
    if (!selectedUser) {
      setSelectedUserMatches([]);
      setLoadingSelectedUserMatches(false);
      return;
    }
    let cancelled = false;
    setLoadingSelectedUserMatches(true);
    const isCurrent =
      selectedUser.username.trim().toLowerCase() === currentUser.username.trim().toLowerCase();
    void fetchUserMatchHistoryForInspection(selectedUser, isCurrent).then((items) => {
      if (!cancelled) {
        setSelectedUserMatches(items);
        setLoadingSelectedUserMatches(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedUser, currentUser.username]);
  const [adminLoginBusy, setAdminLoginBusy] = useState<boolean>(false);

  // Social & Multi-channel marketing tools state
  const [channelFilter, setChannelFilter] = useState<'all' | TrafficChannelId>('all');
  const [telemetryPeriod, setTelemetryPeriod] = useState<
    'post_optimizations' | '24h' | '7d' | 'all'
  >('post_optimizations');
  const [hideBotsAndInternal, setHideBotsAndInternal] = useState<boolean>(true);
  const [customUtmSource, setCustomUtmSource] = useState<string>('tiktok');
  const [customUtmMedium, setCustomUtmMedium] = useState<string>('video_organico');
  const [customUtmCampaign, setCustomUtmCampaign] = useState<string>('desafio_xequemate');

  // Discord Community & Sunday PIX configuration (Cloud-persisted)
  const [discordInviteInput, setDiscordInviteInput] = useState<string>(
    () => getCommunityDiscordConfig().inviteUrl
  );
  const [discordWebhookInput, setDiscordWebhookInput] = useState<string>(
    () => getCommunityDiscordConfig().webhookUrl
  );
  const [sundayPixBrlInput, setSundayPixBrlInput] = useState<string>(() =>
    String(getCommunityDiscordConfig().sundayPixBrl)
  );
  const [discordBusy, setDiscordBusy] = useState<boolean>(false);

  useEffect(() => {
    void fetchCommunityDiscordConfigFromCloud().then((cfg) => {
      setDiscordInviteInput(cfg.inviteUrl);
      setDiscordWebhookInput(cfg.webhookUrl);
      setSundayPixBrlInput(String(cfg.sundayPixBrl));
    });
  }, []);

  const isAuthorizedAdmin = isAdminProfile(currentUser);

  const refreshCloudData = useCallback(async () => {
    setLoading(true);
    const [profData, roomsData] = await Promise.all([
      fetchAllCloudProfilesForAdmin(),
      fetchAllCloudRoomsForAdmin(),
    ]);
    setProfiles(profData.profiles);
    setVisitorSessions(profData.visitorSessions);
    setAnnouncement(profData.announcement);
    setLatencyMs(profData.latencyMs);
    setCloudError(profData.error);
    setCloudRooms(roomsData);
    setLastSyncAt(Date.now());
    setLoading(false);

    if (selectedUser) {
      const updatedSelected = profData.profiles.find(
        (p) => p.username.toLowerCase() === selectedUser.username.toLowerCase()
      );
      if (updatedSelected) {
        setSelectedUser(updatedSelected);
      }
    }
  }, [selectedUser]);

  useEffect(() => {
    refreshCloudData();
    const interval = window.setInterval(() => {
      refreshCloudData();
    }, 12000);
    return () => window.clearInterval(interval);
  }, [refreshCloudData]);

  const activeTelemetrySessions = useMemo(() => {
    const now = Date.now();
    const POST_OPT_CUTOFF_MS = Date.parse('2026-11-03T12:20:00Z'); // v52 (03/11 09:20 BRT)
    const minFirstSeenMs =
      telemetryPeriod === '24h'
        ? now - 24 * 3600 * 1000
        : telemetryPeriod === '7d'
        ? now - 7 * 24 * 3600 * 1000
        : telemetryPeriod === 'post_optimizations'
        ? POST_OPT_CUTOFF_MS
        : 0;

    // Detect synthetic multi-viewport scanner bursts (>=3 zero-duration non-paid hits within 5s)
    const burstSessionIds = new Set<string>();
    if (hideBotsAndInternal) {
      for (let i = 0; i < visitorSessions.length; i++) {
        const s = visitorSessions[i];
        if (s.gclid || s.lastSeenAt - s.firstSeenAt > 0) continue;
        const cluster = visitorSessions.filter(
          (x) =>
            !x.gclid &&
            x.lastSeenAt - x.firstSeenAt === 0 &&
            Math.abs(x.firstSeenAt - s.firstSeenAt) <= 5000
        );
        if (cluster.length >= 3) {
          cluster.forEach((c) => burstSessionIds.add(c.sessionId));
        }
      }
    }

    return visitorSessions.filter((s) => {
      const seenInWindow =
        minFirstSeenMs === 0 || s.firstSeenAt >= minFirstSeenMs || s.lastSeenAt >= minFirstSeenMs;
      if (!seenInWindow) return false;
      if (hideBotsAndInternal) {
        if (isBotOrInternalTelemetrySession(s)) return false;
        if (burstSessionIds.has(s.sessionId)) return false;
      }
      return true;
    });
  }, [visitorSessions, telemetryPeriod, hideBotsAndInternal]);

  // Derived statistics
  const stats = useMemo(() => {
    const totalUsers = profiles.length;
    const totalAdmins = profiles.filter((p) => isAdminProfile(p)).length;
    const usersWithEmail = profiles.filter((p) => Boolean(p.email)).length;
    const totalGold = profiles.reduce((acc, p) => acc + (p.gold ?? 0), 0);
    const totalPvpMatches = profiles.reduce((acc, p) => acc + (p.pvpWins ?? 0) + (p.pvpLosses ?? 0), 0);
    const totalArenaWins = profiles.reduce((acc, p) => acc + (p.arenaWins ?? 0), 0);
    const totalCustomDecks = profiles.reduce((acc, p) => acc + (p.customDecks?.length ?? 0), 0);

    const totalVisitors = activeTelemetrySessions.length;
    const rawTotalVisitors = visitorSessions.length;
    const filteredOutCount = Math.max(0, rawTotalVisitors - totalVisitors);
    const adsVisitors = activeTelemetrySessions.filter(
      (s) => Boolean(s.gclid || s.utmSource || s.utmCampaign || s.utmTerm)
    ).length;
    const engagedSessions = activeTelemetrySessions.filter((s) =>
      isEngagedVisitorSession(s)
    ).length;
    const returningSessions = activeTelemetrySessions.filter((s) =>
      isReturningVisitorSession(s)
    ).length;
    const spectateSessions = activeTelemetrySessions.filter((s) =>
      s.events.includes('spectate_match')
    ).length;
    const quickPlaySessions = activeTelemetrySessions.filter((s) =>
      s.events.includes('quick_play_clicked')
    ).length;
    const startedDuelSessions = activeTelemetrySessions.filter(
      (s) => s.events.includes('start_duel') || s.events.includes('start_campaign_boss')
    ).length;
    const firstCardSessions = activeTelemetrySessions.filter((s) =>
      s.events.includes('first_card_played')
    ).length;
    const victorySessions = activeTelemetrySessions.filter((s) =>
      s.events.includes('match_victory')
    ).length;
    const registeredFromSessions = activeTelemetrySessions.filter(
      (s) => s.events.includes('register_account') || Boolean(s.registeredUsername)
    ).length;
    const joinedTournamentSessions = activeTelemetrySessions.filter((s) =>
      s.events.includes('join_tournament')
    ).length;

    const buildChannelMetric = (ch: TrafficChannelId) => {
      const list = activeTelemetrySessions.filter((s) => classifyVisitorChannel(s) === ch);
      const visitors = list.length;
      const quickPlay = list.filter((s) => s.events.includes('quick_play_clicked')).length;
      const duels = list.filter(
        (s) => s.events.includes('start_duel') || s.events.includes('start_campaign_boss')
      ).length;
      const victories = list.filter((s) => s.events.includes('match_victory')).length;
      const signups = list.filter(
        (s) => s.events.includes('register_account') || Boolean(s.registeredUsername)
      ).length;
      const convRate = visitors > 0 ? Math.round((signups / visitors) * 100) : 0;
      return { visitors, quickPlay, duels, victories, signups, convRate };
    };

    const channelBreakdown = {
      google_ads: buildChannelMetric('google_ads'),
      tiktok: buildChannelMetric('tiktok'),
      instagram: buildChannelMetric('instagram'),
      discord: buildChannelMetric('discord'),
      organic: buildChannelMetric('organic'),
    };

    return {
      totalUsers,
      totalAdmins,
      usersWithEmail,
      totalGold,
      totalPvpMatches,
      totalArenaWins,
      totalCustomDecks,
      totalVisitors,
      rawTotalVisitors,
      filteredOutCount,
      adsVisitors,
      engagedSessions,
      returningSessions,
      spectateSessions,
      quickPlaySessions,
      startedDuelSessions,
      firstCardSessions,
      victorySessions,
      registeredFromSessions,
      joinedTournamentSessions,
      channelBreakdown,
    };
  }, [profiles, visitorSessions, activeTelemetrySessions]);

  const filteredProfiles = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    const list = profiles.filter((p) => {
      if (!q) return true;
      return (
        p.username.toLowerCase().includes(q) ||
        (p.email && p.email.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q))
      );
    });
    return [...list].sort((a, b) => {
      // Master admin tsm81 always on top if tied
      if (userSort === 'gold') return (b.gold ?? 0) - (a.gold ?? 0);
      if (userSort === 'elo') return (b.eloRating ?? INITIAL_PLAYER_ELO) - (a.eloRating ?? INITIAL_PLAYER_ELO);
      if (userSort === 'wins')
        return (b.pvpWins ?? 0) + (b.arenaWins ?? 0) - ((a.pvpWins ?? 0) + (a.arenaWins ?? 0));
      return (b.lastActiveAt ?? b.createdAt ?? 0) - (a.lastActiveAt ?? a.createdAt ?? 0);
    });
  }, [profiles, userSearch, userSort]);

  const handleSaveModifiedUser = async (
    updated: SovereignUserProfile,
    toastTitle: string,
    toastMsg: string
  ) => {
    setBusyAction(updated.username);
    const res = await adminSaveCloudProfile(updated);
    setBusyAction(null);
    if (res.ok) {
      if (updated.username.toLowerCase() === currentUser.username.toLowerCase()) {
        onUpdateCurrentUser(updated);
      }
      setSelectedUser(updated);
      setProfiles((prev) =>
        prev.map((p) =>
          p.username.toLowerCase() === updated.username.toLowerCase() ? updated : p
        )
      );
      onNotify({
        kicker: 'ADMINISTRAÇÃO SOBERANA',
        title: toastTitle,
        message: toastMsg,
      });
    } else {
      onNotify({
        kicker: 'ERRO DE SINCRONIZAÇÃO',
        title: 'Falha ao salvar no Supabase',
        message: res.error || 'Verifique a conexão de rede.',
      });
    }
  };

  const handleMasterSelfBoost = async (mode: 'gold' | 'cards' | 'bosses') => {
    if (mode === 'gold') {
      const nextGold = (currentUser.gold ?? 0) + 5000;
      const updated: SovereignUserProfile = {
        ...currentUser,
        isAdmin: true,
        gold: nextGold,
      };
      await handleSaveModifiedUser(
        updated,
        '+5.000 Ouro Concedidos',
        `O saldo de ${currentUser.username} agora é de ${nextGold} Ouro.`
      );
    } else if (mode === 'cards') {
      const fullMap = buildFullUnlockedCollectionMap();
      const updated: SovereignUserProfile = {
        ...currentUser,
        isAdmin: true,
        extraUnlockedCards: fullMap,
      };
      await handleSaveModifiedUser(
        updated,
        `Códice Completo Desbloqueado (${ALL_CARDS.length} Cartas)`,
        `Todas as ${ALL_CARDS.length} cartas foram liberadas na conta ${currentUser.username}.`
      );
    } else if (mode === 'bosses') {
      const updated: SovereignUserProfile = {
        ...currentUser,
        isAdmin: true,
        defeatedBossIds: ALL_CAMPAIGN_BOSS_IDS,
      };
      await handleSaveModifiedUser(
        updated,
        'Campanha & Expedição Liberadas',
        `Todos os chefes da Campanha foram marcados como vencidos para ${currentUser.username}.`
      );
    }
  };

  const handlePublishAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annMessage.trim()) return;
    setBusyAction('announcement');
    const nextAnn: GlobalAdminAnnouncement = {
      id: `ann_${Date.now()}`,
      kicker: annKicker.trim() || 'COMUNICADO OFICIAL',
      title: annTitle.trim(),
      message: annMessage.trim(),
      createdAt: Date.now(),
      author: currentUser.username,
    };
    const ok = await publishGlobalAdminAnnouncement(nextAnn);
    setBusyAction(null);
    if (ok) {
      setAnnouncement(nextAnn);
      setAnnTitle('');
      setAnnMessage('');
      onNotify({
        kicker: nextAnn.kicker,
        title: nextAnn.title,
        message: nextAnn.message,
      });
    }
  };

  const handleClearAnnouncement = async () => {
    setBusyAction('clear_announcement');
    const ok = await publishGlobalAdminAnnouncement(null);
    setBusyAction(null);
    if (ok) {
      setAnnouncement(null);
      onNotify({
        kicker: 'ADMINISTRAÇÃO SOBERANA',
        title: 'Comunicado Global Removido',
        message: 'O aviso global foi retirado do mural de notificações.',
      });
    }
  };

  const handleExportBackupJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: currentUser.username,
      stats,
      profiles,
      visitorSessions,
      cloudRooms,
      announcement,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chromatic-pact-admin-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthorizedAdmin) {
    const handleQuickAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setAdminLoginError('');
      setAdminLoginBusy(true);
      const res = await authenticateSovereignAccount(adminLoginId.trim() || 'tsm81', adminLoginPass);
      setAdminLoginBusy(false);
      if (!res.ok || !res.profile) {
        setAdminLoginError(res.error || 'Falha ao autenticar administrador.');
        return;
      }
      if (!isAdminProfile(res.profile)) {
        setAdminLoginError(`A conta "${res.profile.username}" não possui privilégios de Administrador.`);
        return;
      }
      onUpdateCurrentUser(res.profile);
      onNotify({
        kicker: 'CONSELHO SUPREMO DE VAELORIA',
        title: `Bem-vindo, Administrador ${res.profile.username}!`,
        message: 'Acesso total ao Painel de Administração liberado.',
      });
    };

    return (
      <div className="aaa-page-shell" style={{ maxWidth: '640px', margin: '2.5rem auto' }}>
        <div
          style={{
            background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 18, 45, 0.94))',
            border: '1px solid rgba(245, 158, 11, 0.55)',
            borderRadius: '18px',
            padding: '2.25rem 2rem',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
          }}
        >
          <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>👑</div>
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.16em',
              color: '#fbbf24',
              textTransform: 'uppercase',
              marginBottom: '0.4rem',
            }}
          >
            ACESSO RESTRITO • CONSELHO SUPREMO DE VAELORIA
          </div>
          <h2 style={{ fontSize: '1.55rem', color: '#f8fafc', marginBottom: '0.6rem' }}>
            Painel de Administração (`tsm81`)
          </h2>
          <p
            style={{
              color: '#cbd5e1',
              fontSize: '0.9rem',
              maxWidth: '500px',
              margin: '0 auto 1.25rem',
              lineHeight: 1.55,
            }}
          >
            Informe a senha da sua conta <strong>tsm81</strong> abaixo para desbloquear todas as
            telas de administração do site:
          </p>

          <form
            onSubmit={handleQuickAdminLogin}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              maxWidth: '380px',
              margin: '0 auto 1.1rem',
              textAlign: 'left',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#fbbf24',
                  marginBottom: '0.3rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Usuário / E-mail Administrador
              </label>
              <input
                type="text"
                value={adminLoginId}
                onChange={(e) => setAdminLoginId(e.target.value)}
                placeholder="tsm81"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#fbbf24',
                  marginBottom: '0.3rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Senha da Conta `tsm81`
              </label>
              <input
                type="password"
                value={adminLoginPass}
                onChange={(e) => setAdminLoginPass(e.target.value)}
                placeholder="Digite sua senha..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(251, 191, 36, 0.4)',
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            {adminLoginError && (
              <div
                style={{
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.16)',
                  border: '1px solid rgba(239, 68, 68, 0.45)',
                  color: '#fca5a5',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                {adminLoginError}
              </div>
            )}

            <button
              type="submit"
              className="aaa-btn aaa-btn-primary"
              disabled={adminLoginBusy}
              style={{ width: '100%', justifyContent: 'center', marginTop: '0.25rem' }}
            >
              {adminLoginBusy ? 'Autenticando...' : '👑 Desbloquear Painel de Administração'}
            </button>
          </form>

          <button
            type="button"
            className="btn-fantasy"
            onClick={onOpenAccountModal}
            style={{ fontSize: '0.72rem', opacity: 0.85 }}
          >
            Ou abrir Gerenciador de Contas / Recuperar Senha
          </button>
        </div>
      </div>
    );
  }

  const localAuditEvents = getLocalAdsAuditEvents();

  return (
    <div className="aaa-page-shell" style={{ maxWidth: '1420px', margin: '0 auto', padding: '1.25rem 1.5rem 3rem' }}>
      {/* Top Admin Hero Banner */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(17, 24, 39, 0.96) 0%, rgba(49, 27, 78, 0.92) 55%, rgba(69, 26, 3, 0.9) 100%)',
          border: '1px solid rgba(251, 191, 36, 0.5)',
          borderRadius: '18px',
          padding: '1.35rem 1.65rem',
          marginBottom: '1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 18px 48px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#0f172a',
                fontWeight: 900,
                fontSize: '0.68rem',
                letterSpacing: '0.12em',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                textTransform: 'uppercase',
              }}
            >
              👑 ADMINISTRADOR MESTRE: {currentUser.username.toUpperCase()}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                color: cloudError ? '#fca5a5' : '#6ee7b7',
                fontWeight: 700,
              }}
            >
              ● {cloudError ? `Erro Supabase (${cloudError})` : `Supabase Cloud Online (${latencyMs} ms)`}
            </span>
          </div>
          <h1
            style={{
              fontSize: '1.55rem',
              fontWeight: 900,
              color: '#f8fafc',
              margin: 0,
              letterSpacing: '0.02em',
            }}
          >
            Central de Administração do Pacto Cromático
          </h1>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
            Controle em tempo real de usuários, economia de Ouro, coleção de cartas, tráfego do Google Ads e salas 1×1.
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-fantasy"
            onClick={refreshCloudData}
            disabled={loading}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.76rem',
              fontWeight: 800,
              borderColor: 'rgba(251, 191, 36, 0.6)',
              color: '#fde68a',
            }}
          >
            {loading ? '⏳ Sincronizando...' : '🔄 Atualizar Agora'}
          </button>
          <button
            type="button"
            className="btn-fantasy"
            onClick={handleExportBackupJson}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.76rem',
              fontWeight: 800,
              borderColor: 'rgba(56, 189, 248, 0.55)',
              color: '#bae6fd',
            }}
          >
            📥 Exportar Backup (.JSON)
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
          paddingBottom: '0.75rem',
        }}
      >
        {(
          [
            { id: 'overview', icon: '📊', label: 'Visão Geral & Poderes Mestre' },
            { id: 'users', icon: '👥', label: `Contas Cadastradas (${stats.totalUsers})` },
            { id: 'telemetry', icon: '📈', label: `Marketing: Ads, TikTok & Instagram (${stats.totalVisitors})` },
            { id: 'rooms', icon: '🌐', label: `Salas 1×1 (${cloudRooms.length})` },
            { id: 'system', icon: '📢', label: 'Comunicados & Sistema' },
          ] as Array<{ id: AdminSectionTab; icon: string; label: string }>
        ).map((tab) => {
          const active = section === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              style={{
                background: active
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.24), rgba(217, 119, 6, 0.14))'
                  : 'rgba(15, 23, 42, 0.78)',
                border: active
                  ? '1px solid rgba(251, 191, 36, 0.8)'
                  : '1px solid rgba(148, 163, 184, 0.25)',
                color: active ? '#fef08a' : '#cbd5e1',
                padding: '0.58rem 1.05rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: OVERVIEW & MASTER POWERS
         ===================================================================== */}
      {section === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* KPI Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.9rem',
            }}
          >
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(251, 191, 36, 0.35)',
                borderRadius: '14px',
                padding: '1rem 1.15rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                Contas Cadastradas
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#fbbf24', margin: '0.2rem 0' }}>
                {stats.totalUsers}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                {stats.usersWithEmail} com e-mail • {stats.totalAdmins} Admin(s)
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                borderRadius: '14px',
                padding: '1rem 1.15rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                Visitantes Reais ({telemetryPeriod === 'post_optimizations' ? 'Pós-03/11' : telemetryPeriod === '24h' ? '24h' : telemetryPeriod === '7d' ? '7d' : 'Total'})
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#38bdf8', margin: '0.2rem 0' }}>
                {stats.totalVisitors}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                {stats.adsVisitors} Ads · {stats.startedDuelSessions} duelos · {stats.returningSessions} retorno(s)
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(52, 211, 153, 0.35)',
                borderRadius: '14px',
                padding: '1rem 1.15rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                Combates & Vitórias
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#34d399', margin: '0.2rem 0' }}>
                {stats.totalArenaWins + stats.totalPvpMatches}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                {stats.totalArenaWins} vitórias contra Soberanos • {stats.totalPvpMatches} duelos PvP
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                borderRadius: '14px',
                padding: '1rem 1.15rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                Ouro em Circulação
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#c084fc', margin: '0.2rem 0' }}>
                {stats.totalGold.toLocaleString('pt-BR')}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                {stats.totalCustomDecks} Grimórios de 100 cartas salvos
              </div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(244, 63, 94, 0.35)',
                borderRadius: '14px',
                padding: '1rem 1.15rem',
              }}
            >
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>
                Salas 1×1 Ativas
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#fb7185', margin: '0.2rem 0' }}>
                {cloudRooms.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                Última sincronização:{' '}
                {new Date(lastSyncAt).toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </div>
            </div>
          </div>

          {/* Master Powers Box for tsm81 */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.92), rgba(15, 23, 42, 0.95))',
              border: '1px solid rgba(251, 191, 36, 0.45)',
              borderRadius: '16px',
              padding: '1.25rem 1.4rem',
            }}
          >
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 900,
                letterSpacing: '0.12em',
                color: '#fbbf24',
                textTransform: 'uppercase',
                marginBottom: '0.35rem',
              }}
            >
              ⚡ PODERES DE ADMINISTRADOR MESTRE ({currentUser.username.toUpperCase()})
            </div>
            <div style={{ fontSize: '0.88rem', color: '#e2e8f0', marginBottom: '0.95rem' }}>
              Aplique recursos instantaneamente na sua conta de Administrador Mestre (sincronizado na nuvem):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.7rem' }}>
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                disabled={busyAction !== null}
                onClick={() => handleMasterSelfBoost('gold')}
              >
                💰 Conceder +5.000 Ouro para {currentUser.username}
              </button>
              <button
                type="button"
                className="btn-fantasy"
                disabled={busyAction !== null}
                onClick={() => handleMasterSelfBoost('cards')}
                style={{
                  padding: '0.6rem 1.1rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  borderColor: 'rgba(168, 85, 247, 0.7)',
                  color: '#e9d5ff',
                }}
              >
                🃏 Desbloquear Todas as 500 Cartas (Coleção Completa)
              </button>
              <button
                type="button"
                className="btn-fantasy"
                disabled={busyAction !== null}
                onClick={() => handleMasterSelfBoost('bosses')}
                style={{
                  padding: '0.6rem 1.1rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  borderColor: 'rgba(52, 211, 153, 0.7)',
                  color: '#a7f3d0',
                }}
              >
                🏰 Liberar Todos os Chefes da Campanha
              </button>
            </div>
          </div>

          {/* Two-column Quick Summary: Latest Registered Accounts & Latest Visitor Sessions */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '1.1rem',
            }}
          >
            {/* Latest Accounts */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                borderRadius: '14px',
                padding: '1.15rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.8rem',
                }}
              >
                <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                  👥 Últimas Contas Registradas ({profiles.length})
                </span>
                <button
                  type="button"
                  className="nav-notif-mini-btn"
                  onClick={() => setSection('users')}
                >
                  Ver Todas →
                </button>
              </div>
              {profiles.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: '0.84rem', padding: '1rem 0' }}>
                  Nenhuma conta registrada na nuvem ainda.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {profiles.slice(0, 6).map((p) => (
                    <div
                      key={p.username}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        background: 'rgba(30, 41, 59, 0.65)',
                        border: '1px solid rgba(148, 163, 184, 0.14)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.86rem' }}>
                            {p.username}
                          </span>
                          {isAdminProfile(p) && (
                            <span
                              style={{
                                background: 'rgba(245, 158, 11, 0.22)',
                                border: '1px solid rgba(251, 191, 36, 0.6)',
                                color: '#fde047',
                                fontSize: '0.62rem',
                                fontWeight: 900,
                                padding: '0.08rem 0.42rem',
                                borderRadius: '999px',
                              }}
                            >
                              👑 ADMIN
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                          {p.email || 'Sem e-mail'} • Elo {p.eloRating} • {p.gold ?? 0} Ouro
                        </div>
                      </div>
                      <button
                        type="button"
                        className="nav-notif-mini-btn"
                        onClick={() => {
                          setSelectedUser(p);
                          setCustomGoldInput(String(p.gold ?? 0));
                          setCustomEloInput(String(p.eloRating ?? INITIAL_PLAYER_ELO));
                          setSection('users');
                        }}
                      >
                        Gerenciar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Latest Visitor Sessions */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.88)',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                borderRadius: '14px',
                padding: '1.15rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.8rem',
                }}
              >
                <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.95rem' }}>
                  Últimos Visitantes ({activeTelemetrySessions.length})
                </span>
                <button
                  type="button"
                  className="nav-notif-mini-btn"
                  onClick={() => setSection('telemetry')}
                >
                  Ver Funil →
                </button>
              </div>
              {activeTelemetrySessions.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: '0.84rem', padding: '1rem 0' }}>
                  Nenhuma sessão de visitante no filtro atual.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {activeTelemetrySessions.slice(0, 6).map((s) => {
                    const isAds = Boolean(s.gclid || s.utmSource || s.utmCampaign);
                    return (
                      <div
                        key={s.sessionId}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0.6rem 0.75rem',
                          borderRadius: '10px',
                          background: 'rgba(30, 41, 59, 0.65)',
                          border: '1px solid rgba(148, 163, 184, 0.14)',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                padding: '0.1rem 0.45rem',
                                borderRadius: '999px',
                                background: isAds
                                  ? 'rgba(56, 189, 248, 0.2)'
                                  : 'rgba(148, 163, 184, 0.2)',
                                color: isAds ? '#7dd3fc' : '#cbd5e1',
                              }}
                            >
                              {isAds ? '🎯 GOOGLE ADS' : '🌐 DIRETO / ORGÂNICO'}
                            </span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>
                              {s.registeredUsername
                                ? `Conta: ${s.registeredUsername}`
                                : `Visitante (${s.screenSize || 'Web'})`}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.18rem' }}>
                            Eventos: {s.events.join(' → ') || 'ads_visitor_landed'}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          {new Date(s.lastSeenAt).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: USER ACCOUNTS MANAGEMENT
         ===================================================================== */}
      {section === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Search & Sort Controls */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(148, 163, 184, 0.22)',
              padding: '0.9rem 1.1rem',
              borderRadius: '14px',
            }}
          >
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="🔍 Buscar por Nickname, E-mail ou Título..."
              style={{
                flex: '1 1 280px',
                background: 'rgba(2, 6, 23, 0.8)',
                border: '1px solid rgba(148, 163, 184, 0.35)',
                borderRadius: '10px',
                padding: '0.58rem 0.9rem',
                color: '#f8fafc',
                fontSize: '0.85rem',
              }}
            />
            <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Ordenar:</span>
              {(
                [
                  { id: 'recent', label: 'Mais Recentes' },
                  { id: 'gold', label: 'Mais Ouro' },
                  { id: 'elo', label: 'Maior Elo' },
                  { id: 'wins', label: 'Mais Vitórias' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className="nav-notif-mini-btn"
                  onClick={() => setUserSort(s.id)}
                  style={{
                    borderColor:
                      userSort === s.id ? 'rgba(251, 191, 36, 0.8)' : 'rgba(148, 163, 184, 0.25)',
                    color: userSort === s.id ? '#fde047' : '#cbd5e1',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Selected User Inspector Drawer/Card */}
          {selectedUser && (
            <div
              style={{
                background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.96), rgba(15, 23, 42, 0.98))',
                border: '1px solid rgba(251, 191, 36, 0.65)',
                borderRadius: '16px',
                padding: '1.25rem 1.4rem',
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.55)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc' }}>
                      Gerenciando Conta: {selectedUser.username}
                    </h3>
                    {isAdminProfile(selectedUser) && (
                      <span
                        style={{
                          background: 'rgba(245, 158, 11, 0.25)',
                          border: '1px solid rgba(251, 191, 36, 0.75)',
                          color: '#fde047',
                          fontSize: '0.68rem',
                          fontWeight: 900,
                          padding: '0.14rem 0.55rem',
                          borderRadius: '999px',
                        }}
                      >
                        👑 ADMINISTRADOR
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    E-mail: <strong>{selectedUser.email || 'Não informado'}</strong> • Título:{' '}
                    {selectedUser.title} • Grimórios: {selectedUser.customDecks?.length ?? 0} • Chefes
                    vencidos: {selectedUser.defeatedBossIds?.length ?? 0}
                  </div>
                </div>
                <button
                  type="button"
                  className="nav-notif-mini-btn"
                  onClick={() => setSelectedUser(null)}
                >
                  ✕ Fechar Editor
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1rem',
                }}
              >
                {/* Gold Control */}
                <div
                  style={{
                    background: 'rgba(2, 6, 23, 0.55)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '0.9rem',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.45rem' }}>
                    💰 SALDO DE OURO (ATUAL: {selectedUser.gold ?? 0})
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.55rem' }}>
                    {[100, 500, 1000, 5000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className="nav-notif-mini-btn"
                        onClick={() => {
                          const nextGold = (selectedUser.gold ?? 0) + amt;
                          setCustomGoldInput(String(nextGold));
                          handleSaveModifiedUser(
                            { ...selectedUser, gold: nextGold },
                            `+${amt} Ouro para ${selectedUser.username}`,
                            `Novo saldo: ${nextGold} Ouro.`
                          );
                        }}
                      >
                        +{amt}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <input
                      type="number"
                      value={customGoldInput}
                      onChange={(e) => setCustomGoldInput(e.target.value)}
                      placeholder="Saldo exato..."
                      style={{
                        flex: 1,
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(148, 163, 184, 0.35)',
                        borderRadius: '8px',
                        padding: '0.4rem 0.6rem',
                        color: '#f8fafc',
                        fontSize: '0.8rem',
                      }}
                    />
                    <button
                      type="button"
                      className="nav-notif-mini-btn"
                      onClick={() => {
                        const val = Math.max(0, parseInt(customGoldInput || '0', 10) || 0);
                        handleSaveModifiedUser(
                          { ...selectedUser, gold: val },
                          `Ouro Atualizado (${selectedUser.username})`,
                          `Saldo definido para ${val} Ouro.`
                        );
                      }}
                    >
                      Definir
                    </button>
                  </div>
                </div>

                {/* Elo & Collection Control */}
                <div
                  style={{
                    background: 'rgba(2, 6, 23, 0.55)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '0.9rem',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.45rem' }}>
                    🏆 REPUTAÇÃO ELO ({selectedUser.eloRating}) & COLEÇÃO
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.55rem' }}>
                    <input
                      type="number"
                      value={customEloInput}
                      onChange={(e) => setCustomEloInput(e.target.value)}
                      placeholder="Elo..."
                      style={{
                        flex: 1,
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(148, 163, 184, 0.35)',
                        borderRadius: '8px',
                        padding: '0.4rem 0.6rem',
                        color: '#f8fafc',
                        fontSize: '0.8rem',
                      }}
                    />
                    <button
                      type="button"
                      className="nav-notif-mini-btn"
                      onClick={() => {
                        const val = Math.max(
                          100,
                          parseInt(customEloInput || String(INITIAL_PLAYER_ELO), 10) || INITIAL_PLAYER_ELO
                        );
                        handleSaveModifiedUser(
                          { ...selectedUser, eloRating: val, eloBaseVersion: ELO_SCHEMA_VERSION },
                          `Elo Atualizado (${selectedUser.username})`,
                          `Reputação definida para ${val}.`
                        );
                      }}
                    >
                      Salvar Elo
                    </button>
                  </div>
                  <button
                    type="button"
                    className="nav-notif-mini-btn"
                    style={{ width: '100%', justifyContent: 'center', color: '#e9d5ff' }}
                    onClick={() => {
                      const fullMap = buildFullUnlockedCollectionMap();
                      handleSaveModifiedUser(
                        { ...selectedUser, extraUnlockedCards: fullMap },
                        `Coleção Completa Concedida`,
                        `Todas as 500 cartas foram desbloqueadas para ${selectedUser.username}.`
                      );
                    }}
                  >
                    🃏 Liberar Todas as 500 Cartas para {selectedUser.username}
                  </button>
                </div>

                {/* Password Reset & Admin Role */}
                <div
                  style={{
                    background: 'rgba(2, 6, 23, 0.55)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    padding: '0.9rem',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#a7f3d0', marginBottom: '0.45rem' }}>
                    🔑 SUPORTE DE SENHA & PERMISSÕES
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.55rem' }}>
                    <input
                      type="text"
                      value={resetPassInput}
                      onChange={(e) => setResetPassInput(e.target.value)}
                      placeholder="Nova senha para o usuário..."
                      style={{
                        flex: 1,
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid rgba(148, 163, 184, 0.35)',
                        borderRadius: '8px',
                        padding: '0.4rem 0.6rem',
                        color: '#f8fafc',
                        fontSize: '0.8rem',
                      }}
                    />
                    <button
                      type="button"
                      className="nav-notif-mini-btn"
                      onClick={() => {
                        if (resetPassInput.trim().length < 4) return;
                        const nextHash = hashPassword(resetPassInput.trim());
                        setResetPassInput('');
                        handleSaveModifiedUser(
                          { ...selectedUser, passwordHash: nextHash },
                          `Senha Redefinida (${selectedUser.username})`,
                          `A nova senha foi gravada na nuvem com sucesso.`
                        );
                      }}
                    >
                      Redefinir
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
                    {!MASTER_ADMIN_USERNAMES.includes(selectedUser.username.toLowerCase()) ? (
                      <button
                        type="button"
                        className="nav-notif-mini-btn"
                        onClick={() => {
                          const nextAdmin = !selectedUser.isAdmin;
                          handleSaveModifiedUser(
                            { ...selectedUser, isAdmin: nextAdmin },
                            nextAdmin ? 'Permissão Admin Concedida' : 'Permissão Admin Revogada',
                            `${selectedUser.username} agora ${
                              nextAdmin ? 'possui' : 'não possui mais'
                            } acesso de administrador.`
                          );
                        }}
                      >
                        {selectedUser.isAdmin ? 'Revogar Admin' : 'Tornar Admin'}
                      </button>
                    ) : (
                      <span />
                    )}
                    {selectedUser.username !== currentUser.username && (
                      <button
                        type="button"
                        className="nav-notif-mini-btn"
                        style={{ borderColor: 'rgba(248, 113, 113, 0.6)', color: '#fca5a5' }}
                        onClick={async () => {
                          if (
                            !window.confirm(
                              `Tem certeza que deseja excluir permanentemente a conta "${selectedUser.username}" do Supabase?`
                            )
                          ) {
                            return;
                          }
                          const ok = await adminDeleteCloudProfile(selectedUser.username);
                          if (ok) {
                            setProfiles((prev) =>
                              prev.filter((p) => p.username !== selectedUser.username)
                            );
                            setSelectedUser(null);
                            onNotify({
                              kicker: 'ADMINISTRAÇÃO SOBERANA',
                              title: 'Conta Excluída',
                              message: `A conta ${selectedUser.username} foi removida da nuvem.`,
                            });
                          }
                        }}
                      >
                        Excluir Conta
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Matches of Selected User */}
              <div
                style={{
                  marginTop: '1rem',
                  background: 'rgba(2, 6, 23, 0.55)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  padding: '0.9rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: '0.55rem',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>
                    Partidas recentes de {selectedUser.username}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {loadingSelectedUserMatches
                      ? 'Sincronizando...'
                      : `${selectedUserMatches.length} ${
                          selectedUserMatches.length === 1 ? 'partida' : 'partidas'
                        }`}
                  </span>
                </div>

                {loadingSelectedUserMatches ? (
                  <div style={{ fontSize: '0.78rem', color: '#64748b', padding: '0.6rem 0' }}>
                    Carregando histórico de partidas...
                  </div>
                ) : selectedUserMatches.length === 0 ? (
                  <div style={{ fontSize: '0.78rem', color: '#64748b', padding: '0.6rem 0' }}>
                    Nenhuma partida recente registrada nesta conta.
                  </div>
                ) : (
                  <div
                    style={{
                      borderRadius: '8px',
                      border: '1px solid rgba(148, 163, 184, 0.14)',
                      background: 'rgba(11, 15, 25, 0.72)',
                      maxHeight: '240px',
                      overflowY: 'auto',
                    }}
                  >
                    {selectedUserMatches.map((m, idx) => {
                      const oppCard = CARDS_BY_ID[m.opponentAvatarCardId];
                      const canWatch = Boolean(
                        onWatchUserReplay && (m.localReplay || m.shareId)
                      );
                      const outcomeLabel =
                        m.didWin === true
                          ? 'Vitória'
                          : m.didWin === false
                          ? 'Derrota'
                          : 'Empate';
                      const deltaStr =
                        typeof m.deltaElo === 'number'
                          ? ` (${m.deltaElo >= 0 ? `+${m.deltaElo}` : m.deltaElo} ELO)`
                          : '';
                      const dateFmt = new Date(m.playedAtMs).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const isOpening = loadingAdminReplayId === m.id;

                      return (
                        <div
                          key={m.id}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 0.75rem',
                            borderBottom:
                              idx < selectedUserMatches.length - 1
                                ? '1px solid rgba(148, 163, 184, 0.08)'
                                : 'none',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.6rem',
                              minWidth: 0,
                            }}
                          >
                            {oppCard?.imagePath ? (
                              <img
                                src={oppCard.imagePath}
                                alt={m.opponentName}
                                loading="lazy"
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '1px solid rgba(148, 163, 184, 0.28)',
                                  flexShrink: 0,
                                }}
                              />
                            ) : null}
                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '0.79rem',
                                  fontWeight: 600,
                                  color: '#f1f5f9',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                vs. {m.opponentName}
                              </div>
                              <div
                                style={{
                                  fontSize: '0.69rem',
                                  color:
                                    m.didWin === true
                                      ? '#6ee7b7'
                                      : m.didWin === false
                                      ? '#fca5a5'
                                      : '#cbd5e1',
                                }}
                              >
                                {outcomeLabel}
                                {deltaStr} ·{' '}
                                <span style={{ color: '#64748b' }}>
                                  {m.modeLabel} · {dateFmt}
                                </span>
                              </div>
                            </div>
                          </div>

                          {canWatch && onWatchUserReplay ? (
                            <button
                              type="button"
                              className="nav-notif-mini-btn"
                              disabled={isOpening}
                              style={{ flexShrink: 0 }}
                              onClick={async () => {
                                if (m.localReplay) {
                                  onWatchUserReplay(m.localReplay);
                                  return;
                                }
                                if (!m.shareId) return;
                                setLoadingAdminReplayId(m.id);
                                const fetched = await fetchSharedPersonalReplay(m.shareId);
                                setLoadingAdminReplayId(null);
                                if (fetched) {
                                  onWatchUserReplay(fetched);
                                }
                              }}
                            >
                              {isOpening ? 'Abrindo...' : 'Assistir'}
                            </button>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Full Accounts Table */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(148, 163, 184, 0.22)',
              borderRadius: '14px',
              overflowX: 'auto',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
                    color: '#94a3b8',
                    textAlign: 'left',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                  }}
                >
                  <th style={{ padding: '0.85rem 1rem' }}>Soberano (Nickname)</th>
                  <th style={{ padding: '0.85rem 0.75rem' }}>E-mail</th>
                  <th style={{ padding: '0.85rem 0.75rem' }}>Ouro</th>
                  <th style={{ padding: '0.85rem 0.75rem' }}>Elo</th>
                  <th style={{ padding: '0.85rem 0.75rem' }}>Combates (PvP / Soberanos)</th>
                  <th style={{ padding: '0.85rem 0.75rem' }}>Grimórios / Chefes</th>
                  <th style={{ padding: '0.85rem 0.75rem' }}>Última Atividade</th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                      Nenhuma conta encontrada para o filtro informado.
                    </td>
                  </tr>
                ) : (
                  filteredProfiles.map((p) => {
                    const avatarCard = CARDS_BY_ID[p.avatarCardId];
                    const isMaster = MASTER_ADMIN_USERNAMES.includes(p.username.toLowerCase());
                    return (
                      <tr
                        key={p.username}
                        style={{
                          borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
                          background:
                            selectedUser?.username.toLowerCase() === p.username.toLowerCase()
                              ? 'rgba(245, 158, 11, 0.1)'
                              : 'transparent',
                        }}
                      >
                        <td style={{ padding: '0.75rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            {avatarCard?.imagePath && (
                              <img
                                src={`${avatarCard.imagePath}?v=52`}
                                alt={p.username}
                                style={{
                                  width: '34px',
                                  height: '34px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '1px solid rgba(251, 191, 36, 0.5)',
                                  background: '#0b0f19',
                                }}
                              />
                            )}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <span style={{ fontWeight: 800, color: '#f8fafc' }}>{p.username}</span>
                                {isAdminProfile(p) && (
                                  <span
                                    style={{
                                      background: 'rgba(245, 158, 11, 0.22)',
                                      border: '1px solid rgba(251, 191, 36, 0.65)',
                                      color: '#fde047',
                                      fontSize: '0.6rem',
                                      fontWeight: 900,
                                      padding: '0.06rem 0.4rem',
                                      borderRadius: '999px',
                                    }}
                                  >
                                    {isMaster ? '👑 MASTER ADMIN' : '👑 ADMIN'}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{p.title}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                          {p.email || <span style={{ opacity: 0.5 }}>—</span>}
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 800, color: '#fbbf24' }}>
                          {(p.gold ?? 0).toLocaleString('pt-BR')}
                        </td>
                        <td style={{ padding: '0.75rem', fontWeight: 800, color: '#38bdf8' }}>
                          {p.eloRating ?? INITIAL_PLAYER_ELO}
                        </td>
                        <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                          {p.pvpWins ?? 0}V/{p.pvpLosses ?? 0}D PvP • {p.arenaWins ?? 0}V Soberanos
                        </td>
                        <td style={{ padding: '0.75rem', color: '#cbd5e1' }}>
                          {p.customDecks?.length ?? 0} deck(s) • {p.defeatedBossIds?.length ?? 0} chefes vencidos
                        </td>
                        <td style={{ padding: '0.75rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                          {p.lastActiveAt
                            ? new Date(p.lastActiveAt).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </td>
                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            className="nav-notif-mini-btn"
                            onClick={() => {
                              setSelectedUser(p);
                              setCustomGoldInput(String(p.gold ?? 0));
                              setCustomEloInput(String(p.eloRating ?? INITIAL_PLAYER_ELO));
                            }}
                          >
                            ⚙️ Editar / Suporte
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: TRAFFIC, VISITORS & GOOGLE ADS / TIKTOK / INSTAGRAM FUNNEL
         ===================================================================== */}
      {section === 'telemetry' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Cohort & Bot Filter Control Bar */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.65rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700 }}>
                Período:
              </span>
              {(
                [
                  { id: 'post_optimizations', label: 'Pós-ajustes (03/11+)' },
                  { id: '24h', label: 'Últimas 24h' },
                  { id: '7d', label: '7 dias' },
                  { id: 'all', label: 'Histórico completo' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="nav-notif-mini-btn"
                  onClick={() => setTelemetryPeriod(p.id)}
                  style={{
                    borderColor:
                      telemetryPeriod === p.id
                        ? 'rgba(212, 175, 55, 0.75)'
                        : 'rgba(148, 163, 184, 0.22)',
                    color: telemetryPeriod === p.id ? '#fde68a' : '#cbd5e1',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <label
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.76rem',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={hideBotsAndInternal}
                  onChange={(e) => setHideBotsAndInternal(e.target.checked)}
                />
                <span>Ocultar bots, localhost e admin</span>
              </label>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                Exibindo {stats.totalVisitors} de {stats.rawTotalVisitors} registros
              </span>
            </div>
          </div>

          {/* Multi-Channel Attribution Comparison Cards */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              borderRadius: '16px',
              padding: '1.15rem 1.35rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.6rem',
                marginBottom: '0.9rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase' }}>
                  📊 COMPARATIVO DE AQUISIÇÃO POR CANAL (GOOGLE ADS × TIKTOK × INSTAGRAM × ORGÂNICO)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                  Identifica automaticamente cliques com <code>gclid</code>, <code>ttclid</code>, <code>fbclid</code>, <code>utm_source</code> ou vindos da Bio do TikTok/Instagram.
                </div>
              </div>
              <a
                href="https://www.tiktok.com/@chromaticpact"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-notif-mini-btn"
                style={{
                  textDecoration: 'none',
                  borderColor: 'rgba(244, 63, 94, 0.65)',
                  color: '#fda4af',
                  fontWeight: 800,
                  fontSize: '0.74rem',
                  padding: '0.35rem 0.75rem',
                }}
              >
                🎵 TikTok Oficial: @chromaticpact ↗
              </a>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(225px, 1fr))',
                gap: '0.8rem',
              }}
            >
              {(
                [
                  {
                    id: 'google_ads' as TrafficChannelId,
                    title: '🎯 Google Ads (Pesquisa / Display)',
                    badgeColor: '#38bdf8',
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    data: stats.channelBreakdown.google_ads,
                  },
                  {
                    id: 'tiktok' as TrafficChannelId,
                    title: '🎵 TikTok (Vídeos & Link da Bio)',
                    badgeColor: '#f43f5e',
                    borderColor: 'rgba(244, 63, 94, 0.45)',
                    data: stats.channelBreakdown.tiktok,
                  },
                  {
                    id: 'instagram' as TrafficChannelId,
                    title: '📸 Instagram (Reels, Bio & Meta Ads)',
                    badgeColor: '#c084fc',
                    borderColor: 'rgba(192, 132, 252, 0.45)',
                    data: stats.channelBreakdown.instagram,
                  },
                  {
                    id: 'discord' as TrafficChannelId,
                    title: '💬 Discord (Comunidade & Webhook)',
                    badgeColor: '#818cf8',
                    borderColor: 'rgba(129, 140, 248, 0.45)',
                    data: stats.channelBreakdown.discord,
                  },
                  {
                    id: 'organic' as TrafficChannelId,
                    title: '🌐 Orgânico / Direto / Outros',
                    badgeColor: '#34d399',
                    borderColor: 'rgba(52, 211, 153, 0.35)',
                    data: stats.channelBreakdown.organic,
                  },
                ]
              ).map((ch) => (
                <div
                  key={ch.id}
                  style={{
                    background: 'rgba(2, 6, 23, 0.72)',
                    border: `1px solid ${ch.borderColor}`,
                    borderRadius: '12px',
                    padding: '0.9rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 900, color: ch.badgeColor }}>
                    {ch.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#f8fafc' }}>
                        {ch.data.visitors}
                      </span>
                      <span style={{ fontSize: '0.73rem', color: '#94a3b8', marginLeft: '0.35rem' }}>
                        visitante(s)
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 900,
                        padding: '0.12rem 0.48rem',
                        borderRadius: '999px',
                        background: 'rgba(251, 191, 36, 0.16)',
                        color: '#fde047',
                      }}
                    >
                      Conv. Conta: {ch.data.convRate}%
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.3rem 0.6rem',
                      fontSize: '0.73rem',
                      color: '#cbd5e1',
                      borderTop: '1px solid rgba(148, 163, 184, 0.14)',
                      paddingTop: '0.45rem',
                    }}
                  >
                    <div>⚡ 1-Clique: <strong>{ch.data.quickPlay}</strong></div>
                    <div>⚔️ Duelos: <strong>{ch.data.duels}</strong></div>
                    <div>🏆 Vitórias: <strong>{ch.data.victories}</strong></div>
                    <div>👑 Contas: <strong style={{ color: '#fbbf24' }}>{ch.data.signups}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cloud-Persisted Discord Server, Webhook & Sunday PIX Settings */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(129, 140, 248, 0.35)',
              borderRadius: '16px',
              padding: '1.15rem 1.35rem',
            }}
          >
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#a5b4fc' }}>
                INTEGRAÇÃO DISCORD OFICIAL &amp; PREMIAÇÃO DOMINICAL (SINCRONIZADO NA NUVEM)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                Cole o link de convite e o Webhook do Discord sem precisar alterar código: o botão
                no Salão de Torneios e os envios de súmula ativam instantaneamente para todos os
                jogadores.
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '0.75rem',
                marginBottom: '0.8rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Link Permanente de Convite (ex.: https://discord.gg/...)
                </div>
                <input
                  type="url"
                  value={discordInviteInput}
                  onChange={(e) => setDiscordInviteInput(e.target.value)}
                  placeholder="https://discord.gg/seu-servidor"
                  style={{
                    width: '100%',
                    background: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.32)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.65rem',
                    color: '#f8fafc',
                    fontSize: '0.8rem',
                  }}
                />
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  Webhook do Canal #torneios-e-resultados
                </div>
                <input
                  type="url"
                  value={discordWebhookInput}
                  onChange={(e) => setDiscordWebhookInput(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  style={{
                    width: '100%',
                    background: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.32)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.65rem',
                    color: '#f8fafc',
                    fontSize: '0.8rem',
                  }}
                />
              </div>

              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.3rem' }}>
                  PIX Campeão da Grande Copa Dominical (R$ · 0 desativa)
                </div>
                <input
                  type="number"
                  min={0}
                  step={5}
                  value={sundayPixBrlInput}
                  onChange={(e) => setSundayPixBrlInput(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(2, 6, 23, 0.9)',
                    border: '1px solid rgba(148, 163, 184, 0.32)',
                    borderRadius: '8px',
                    padding: '0.45rem 0.65rem',
                    color: '#f8fafc',
                    fontSize: '0.8rem',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="nav-notif-mini-btn"
                disabled={discordBusy}
                style={{
                  borderColor: 'rgba(251, 191, 36, 0.65)',
                  color: '#fde047',
                  fontWeight: 800,
                  padding: '0.4rem 0.85rem',
                }}
                onClick={() => {
                  void (async () => {
                    setDiscordBusy(true);
                    const pixVal = Math.max(0, parseInt(sundayPixBrlInput || '0', 10) || 0);
                    const res = await saveCommunityDiscordConfigToCloud({
                      inviteUrl: discordInviteInput,
                      webhookUrl: discordWebhookInput,
                      sundayPixBrl: pixVal,
                    });
                    setDiscordBusy(false);
                    onNotify({
                      kicker: res.ok ? 'CONFIGURAÇÃO SALVA NA NUVEM' : 'SALVO LOCALMENTE',
                      title: 'Discord & Premiação Dominical Atualizados',
                      message: res.ok
                        ? `Convite ${res.config.inviteUrl ? 'ativo' : 'vazio'} · PIX Dominical: R$ ${res.config.sundayPixBrl},00.`
                        : `Aviso Supabase: ${res.error ?? 'verifique a rede'}.`,
                    });
                  })();
                }}
              >
                {discordBusy ? 'Salvando...' : 'Salvar Configuração na Nuvem'}
              </button>

              <button
                type="button"
                className="nav-notif-mini-btn"
                disabled={discordBusy || !discordWebhookInput.trim()}
                style={{
                  borderColor: 'rgba(129, 140, 248, 0.55)',
                  color: '#c7d2fe',
                  fontWeight: 700,
                  padding: '0.4rem 0.85rem',
                }}
                onClick={() => {
                  void (async () => {
                    setDiscordBusy(true);
                    const res = await postDiscordWebhookTestPing(discordWebhookInput);
                    setDiscordBusy(false);
                    onNotify({
                      kicker: res.ok ? 'WEBHOOK CONECTADO' : 'FALHA NO WEBHOOK',
                      title: res.ok
                        ? 'Mensagem de boas-vindas enviada ao Discord!'
                        : 'Não foi possível enviar ao Discord',
                      message: res.ok
                        ? 'Verifique o canal do seu servidor Discord.'
                        : res.error || 'Confira a URL do Webhook.',
                    });
                  })();
                }}
              >
                Testar Envio no Webhook Discord
              </button>
            </div>
          </div>

          {/* 1-Click UTM Link Generator for TikTok & Instagram */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              borderRadius: '16px',
              padding: '1.15rem 1.35rem',
            }}
          >
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#fb7185', textTransform: 'uppercase' }}>
                🔗 GERADOR DE LINKS RASTREADOS (UTM) • COPIAR EM 1 CLIQUE PARA BIO & ANÚNCIOS
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                Use estes links no perfil do <strong>TikTok</strong>, na Bio do <strong>Instagram</strong> e nos botões de <strong>Reels / Meta Ads</strong> para separar exatamente de onde vem cada jogador:
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.65rem',
                marginBottom: '0.9rem',
              }}
            >
              {[
                {
                  badge: '🎵 TIKTOK BIO',
                  color: '#f43f5e',
                  label: 'Link Oficial da Bio do TikTok',
                  url: 'https://chromaticpact.com/?utm_source=tiktok&utm_medium=bio&utm_campaign=perfil_oficial',
                },
                {
                  badge: '🎵 TIKTOK VÍDEO',
                  color: '#fb7185',
                  label: 'Link para Vídeo de Problemas / Xeque-Mate',
                  url: 'https://chromaticpact.com/?utm_source=tiktok&utm_medium=video_organico&utm_campaign=puzzle_xequemate',
                },
                {
                  badge: '📸 INSTAGRAM BIO',
                  color: '#c084fc',
                  label: 'Link Oficial da Bio do Instagram',
                  url: 'https://chromaticpact.com/?utm_source=instagram&utm_medium=bio&utm_campaign=perfil_oficial',
                },
                {
                  badge: '📸 INSTAGRAM REELS / STORIES',
                  color: '#e879f9',
                  label: 'Link para Sticker de Stories / Reels',
                  url: 'https://chromaticpact.com/?utm_source=instagram&utm_medium=reels&utm_campaign=dominio_clash',
                },
                {
                  badge: '🎵 TIKTOK TORNEIO DIÁRIO',
                  color: '#fbbf24',
                  label: 'Link Direto p/ Salão de Torneios Premiados',
                  url: 'https://chromaticpact.com/?tab=tournaments&utm_source=tiktok&utm_medium=video_organico&utm_campaign=torneio_diario',
                },
                {
                  badge: '💬 DISCORD COMUNIDADE',
                  color: '#818cf8',
                  label: 'Link Fixado no Servidor do Discord',
                  url: 'https://chromaticpact.com/?tab=tournaments&utm_source=discord&utm_medium=canal_fixado&utm_campaign=conclave_diario',
                },
                {
                  badge: '🚀 META / IG ADS (PAGO)',
                  color: '#38bdf8',
                  label: 'Link para Tráfego Pago (Instagram / Facebook Ads)',
                  url: 'https://chromaticpact.com/?utm_source=instagram&utm_medium=paid_social&utm_campaign=meta_ads_conversao',
                },
              ].map((preset) => (
                <div
                  key={preset.url}
                  style={{
                    background: 'rgba(2, 6, 23, 0.75)',
                    border: '1px solid rgba(148, 163, 184, 0.22)',
                    borderRadius: '10px',
                    padding: '0.7rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.45rem',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          fontWeight: 900,
                          color: preset.color,
                          letterSpacing: '0.06em',
                        }}
                      >
                        {preset.badge}
                      </span>
                      <button
                        type="button"
                        className="nav-notif-mini-btn"
                        style={{ padding: '0.18rem 0.55rem', fontSize: '0.68rem', color: '#fde047', borderColor: 'rgba(251, 191, 36, 0.5)' }}
                        onClick={() => {
                          navigator.clipboard?.writeText(preset.url);
                          onNotify({
                            kicker: 'LINK RASTREADO COPIADO',
                            title: preset.label,
                            message: preset.url,
                          });
                        }}
                      >
                        📋 Copiar Link
                      </button>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                      {preset.label}
                    </div>
                  </div>
                  <code
                    style={{
                      fontSize: '0.66rem',
                      color: '#94a3b8',
                      background: 'rgba(15, 23, 42, 0.9)',
                      padding: '0.28rem 0.45rem',
                      borderRadius: '6px',
                      wordBreak: 'break-all',
                    }}
                  >
                    {preset.url}
                  </code>
                </div>
              ))}
            </div>

            {/* Custom UTM Link Builder */}
            <div
              style={{
                background: 'rgba(2, 6, 23, 0.65)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '10px',
                padding: '0.75rem 0.9rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '0.55rem',
              }}
            >
              <span style={{ fontSize: '0.73rem', fontWeight: 800, color: '#fde68a' }}>
                🛠️ Criar Link Personalizado:
              </span>
              <input
                type="text"
                value={customUtmSource}
                onChange={(e) => setCustomUtmSource(e.target.value.replace(/\s+/g, '_').toLowerCase())}
                placeholder="utm_source (ex: tiktok)"
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '7px',
                  padding: '0.35rem 0.6rem',
                  color: '#f8fafc',
                  fontSize: '0.74rem',
                  width: '130px',
                }}
              />
              <input
                type="text"
                value={customUtmMedium}
                onChange={(e) => setCustomUtmMedium(e.target.value.replace(/\s+/g, '_').toLowerCase())}
                placeholder="utm_medium (ex: reels)"
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '7px',
                  padding: '0.35rem 0.6rem',
                  color: '#f8fafc',
                  fontSize: '0.74rem',
                  width: '140px',
                }}
              />
              <input
                type="text"
                value={customUtmCampaign}
                onChange={(e) => setCustomUtmCampaign(e.target.value.replace(/\s+/g, '_').toLowerCase())}
                placeholder="utm_campaign (ex: video_01)"
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  borderRadius: '7px',
                  padding: '0.35rem 0.6rem',
                  color: '#f8fafc',
                  fontSize: '0.74rem',
                  width: '170px',
                }}
              />
              <button
                type="button"
                className="nav-notif-mini-btn"
                style={{ borderColor: 'rgba(56, 189, 248, 0.55)', color: '#7dd3fc', fontSize: '0.73rem' }}
                onClick={() => {
                  const built = `https://chromaticpact.com/?utm_source=${encodeURIComponent(
                    customUtmSource || 'tiktok'
                  )}&utm_medium=${encodeURIComponent(
                    customUtmMedium || 'social'
                  )}&utm_campaign=${encodeURIComponent(customUtmCampaign || 'campanha')}`;
                  navigator.clipboard?.writeText(built);
                  onNotify({
                    kicker: 'UTM PERSONALIZADO COPIADO',
                    title: 'Link copiado para a área de transferência',
                    message: built,
                  });
                }}
              >
                📋 Copiar UTM Personalizado
              </button>
            </div>
          </div>

          {/* Viral Scripts & Captions Kit for TikTok & Reels */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              borderRadius: '16px',
              padding: '1.15rem 1.35rem',
            }}
          >
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#e2e8f0' }}>
                Roteiros & Legendas Prontas para TikTok e Reels (12s a 20s)
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.15rem' }}>
                1ª linha curta (&lt;60 caracteres antes do &quot;... mais&quot;), pergunta final para gerar loop de comentários e 5 hashtags de nicho:
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
                gap: '0.75rem',
              }}
            >
              {[
                {
                  tag: 'Formato #1 · Comentários & Replay',
                  title: 'Desafio de Problema Tático (Letal em 1 Turno)',
                  hook: '0–3s: "Você acha a vitória em 1 turno aqui? Pausa a tela."',
                  scene: '3–14s: Abra um desafio da aba Problemas, mostre a Essência disponível, Vanguarda/Retaguarda e a mão, cortando antes da última carta.',
                  cta: '14–18s: "Comenta qual carta jogaria primeiro — ou teste a sequência direto no link da bio."',
                  caption: `Você acha a vitória em 1 turno aqui? Pausa a tela.

Olhe a Essência disponível, as linhas de Vanguarda e Retaguarda e a mão. Qual carta você jogaria primeiro para fechar o letal?

Comenta a sua sequência abaixo — ou teste a jogada direto no navegador pelo link da bio (chromaticpact.com).

#cardgamebrasil #tcgbrasil #jogosdeestrategia #xadrez #rpgbrasil`,
                },
                {
                  tag: 'Formato #2 · Impacto Visual (Modo Cinema)',
                  title: 'Colisão de Expansão de Domínio na Mesa',
                  hook: '0–3s: "Quando dois Domínios colidem, o próprio tabuleiro se divide."',
                  scene: '3–15s: Grave no Modo Cinema (tecla F na Arena) o momento em que dois Domínios dividem o campo de batalha ao meio.',
                  cta: '15–19s: "Qual Domínio você comandaria? Jogue grátis sem instalar nada no link da bio."',
                  caption: `Quando dois Domínios colidem, o próprio tabuleiro se divide.

Em Pacto Cromático, conquistar o campo altera as regras da arena inteira. Posicionamento em 6 colunas, reações ocultas e grimórios de 100 cartas.

Jogue grátis no celular ou PC sem instalar nada — link na bio. Qual Domínio você comandaria?

#cardgame #fantasiamedieval #jogosdecartas #indiegamebrasil #estrategia`,
                },
                {
                  tag: 'Formato #3 · Cliques na Bio (Zero Atrito)',
                  title: 'Entrada Instantânea no Celular ou PC (Turno 1 com 3 de Essência)',
                  hook: '0–3s: "Um card game tático completo direto no navegador (sem baixar 10 GB)."',
                  scene: '3–15s: Mostre tocar em "Jogar agora" no celular e já abrir no Turno 1 com a mão visível e 3 de Essência.',
                  cta: '15–19s: "Teste uma partida em 1 clique pelo link da bio: chromaticpact.com."',
                  caption: `Um card game tático completo direto no navegador (sem baixar 10 GB).

Turno 1 já na mesa com 3 de Essência, mais de 1.000 cartas originais, Campanha nos 5 Reinos de Vaeloria e duelos contra Soberanos ou 1x1.

Teste uma partida agora em 1 clique pelo link da bio: chromaticpact.com

#jogosgratis #jogosonline #browsergames #gamerbrasil #tcg`,
                },
                {
                  tag: 'Formato #4 · Público de TCG & Tabuleiro',
                  title: 'Xadrez com Cartas: Vanguarda, Retaguarda & Essência',
                  hook: '0–3s: "Não basta ter a carta forte — importa onde você posiciona."',
                  scene: '3–15s: Mostre uma unidade de Vanguarda protegendo um atirador na Retaguarda e canalizando uma carta da mão para ganhar Essência e Afinidade.',
                  cta: '15–19s: "Prefere grimório agressivo ou controle? Link para jogar na bio."',
                  caption: `Não basta ter a carta forte — importa onde você posiciona.

Vanguarda absorve o impacto, Retaguarda dispara à distância e qualquer carta da mão pode ser canalizada para gerar Essência e Afinidade. Zero sorte vazia, pura leitura de mesa.

Você prefere grimório agressivo ou controle? Link para jogar na bio.

#magicbrasil #jogosdetabuleiro #estrategia #rpgdemesa #cardgamebrasil`,
                },
                {
                  tag: 'Formato #5 · Engajamento de Comunidade',
                  title: 'Escolha de Facção: Os 5 Reinos de Vaeloria',
                  hook: '0–3s: "5 Reinos em guerra por Vaeloria. Qual seria o seu juramento?"',
                  scene: '3–15s: Passe pelas artes lendárias de Pyros, Vórtex, Veridia, Eclipse e Solária e abra um pacote no Relicário.',
                  cta: '15–20s: "Crie sua conta gratuita com 160 de Ouro (5 pacotes) e comenta o seu Domínio."',
                  caption: `5 Reinos em guerra por Vaeloria. Qual seria o seu juramento?

- Pyros (Chama & Fúria Dracônica)
- Vórtex (Gelo & Cronomancia)
- Veridia (Selva Ancestral)
- Eclipse (Abismo Astral & Sacrifício Vital)
- Solária (Ordem & Alvorada Dourada)

Crie sua conta gratuita e comece com 160 de Ouro (5 pacotes no Relicário) pelo link da bio. Comenta o seu Domínio!

#fantasia #lore #worldbuilding #rpgbrasil #jogosdecartas`,
                },
                {
                  tag: 'Formato #6 · Competitivo & Retenção',
                  title: 'Torneio Suíço Diário às 19h & Ranking ELO',
                  hook: '0–3s: "Torneio Suíço todo dia às 19h direto no navegador."',
                  scene: '3–15s: Mostre a tabela de Ranking desafiando ou assistindo a um Soberano ao vivo e a tela de inscrição do Torneio das 19h.',
                  cta: '15–19s: "Inscrição gratuita no link da bio. Qual seu ELO atual?"',
                  caption: `Torneio Suíço todo dia às 19h direto no navegador.

Suba no Ranking ELO desafiando os Soberanos de Vaeloria, assista às partidas da arena ao vivo e prepare seu grimório de 100 cartas para a disputa das 19h.

Inscrição gratuita no link da bio (chromaticpact.com). Qual seu ELO atual?

#esportsbrasil #competitivo #tcgbrasil #cardgame #jogosdeestrategia`,
                },
              ].map((script) => (
                <div
                  key={script.title}
                  style={{
                    background: 'rgba(11, 15, 25, 0.78)',
                    border: '1px solid rgba(148, 163, 184, 0.14)',
                    borderRadius: '12px',
                    padding: '0.85rem 0.95rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.55rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#d4af37' }}>
                      {script.tag}
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#f8fafc', margin: '0.18rem 0 0.45rem' }}>
                      {script.title}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#e2e8f0', marginBottom: '0.26rem', lineHeight: 1.4 }}>
                      <strong>Gancho:</strong> {script.hook}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.26rem', lineHeight: 1.4 }}>
                      <strong>Cena:</strong> {script.scene}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                      <strong>Chamada:</strong> {script.cta}
                    </div>
                    <details style={{ marginTop: '0.45rem' }}>
                      <summary style={{ fontSize: '0.7rem', color: '#94a3b8', cursor: 'pointer' }}>
                        Ver legenda completa
                      </summary>
                      <pre
                        style={{
                          margin: '0.35rem 0 0',
                          padding: '0.5rem',
                          borderRadius: '8px',
                          background: 'rgba(2, 6, 23, 0.85)',
                          border: '1px solid rgba(148, 163, 184, 0.14)',
                          color: '#cbd5e1',
                          fontSize: '0.68rem',
                          lineHeight: 1.4,
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'inherit',
                        }}
                      >
                        {script.caption}
                      </pre>
                    </details>
                  </div>

                  <button
                    type="button"
                    className="nav-notif-mini-btn"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      borderColor: 'rgba(212, 175, 55, 0.45)',
                      color: '#fef3c7',
                      padding: '0.4rem 0.6rem',
                      fontSize: '0.73rem',
                    }}
                    onClick={() => {
                      navigator.clipboard?.writeText(script.caption);
                      onNotify({
                        kicker: 'Legenda copiada',
                        title: script.title,
                        message: 'Legenda com quebras de linha e hashtags pronta para colar no TikTok ou Reels.',
                      });
                    }}
                  >
                    Copiar legenda pronta
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel Conversion Bars */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '16px',
              padding: '1.25rem 1.4rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>
                  🎯 FUNIL GLOBAL DE CONVERSÃO EM TEMPO REAL • TAG GOOGLE ADS: {GOOGLE_ADS_TAG_ID}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                  Snippet de Conversão de Inscrição: <code>{GOOGLE_ADS_SIGNUP_CONVERSION_SEND_TO}</code>
                </div>
              </div>
              {visitorSessions.length > 0 && (
                <button
                  type="button"
                  className="nav-notif-mini-btn"
                  onClick={async () => {
                    if (!window.confirm('Deseja limpar o histórico de sessões de visitantes em nuvem?')) return;
                    await clearCloudVisitorTelemetryForAdmin();
                    await refreshCloudData();
                  }}
                >
                  🧹 Limpar Sessões de Teste
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {[
                {
                  label: '1. Visitantes Reais no Período (ads_visitor_landed)',
                  count: stats.totalVisitors,
                  color: '#38bdf8',
                },
                {
                  label: '2. Engajamento Ativo (≥10s na página ou ação)',
                  count: stats.engagedSessions,
                  color: '#22d3ee',
                },
                {
                  label: '3. Visitantes Recorrentes / Retenção (2+ visitas ou dias)',
                  count: stats.returningSessions,
                  color: '#2dd4bf',
                },
                {
                  label: '4. Clicaram em "Jogar agora" na Vitrine (quick_play_clicked)',
                  count: stats.quickPlaySessions,
                  color: '#818cf8',
                },
                {
                  label: '5. Iniciaram Partida / Campanha (start_duel / start_campaign_boss)',
                  count: stats.startedDuelSessions,
                  color: '#a78bfa',
                },
                {
                  label: '6. Jogaram a 1ª Carta em Combate (first_card_played)',
                  count: stats.firstCardSessions,
                  color: '#f472b6',
                },
                {
                  label: '7. Venceram uma Partida (match_victory)',
                  count: stats.victorySessions,
                  color: '#34d399',
                },
                {
                  label: '8. Criaram Conta Soberana (register_account)',
                  count:
                    telemetryPeriod === 'all' && !hideBotsAndInternal
                      ? Math.max(stats.registeredFromSessions, stats.totalUsers)
                      : stats.registeredFromSessions,
                  color: '#fbbf24',
                },
                {
                  label: '9. Inscreveram-se em Torneio Diário (join_tournament)',
                  count: stats.joinedTournamentSessions,
                  color: '#f97316',
                },
              ].map((step) => {
                const denom = Math.max(1, stats.totalVisitors);
                const pct = Math.min(100, Math.round((step.count / denom) * 100));
                return (
                  <div key={step.label}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.8rem',
                        color: '#e2e8f0',
                        marginBottom: '0.22rem',
                      }}
                    >
                      <span>{step.label}</span>
                      <span style={{ fontWeight: 800 }}>
                        {step.count} ({pct}%)
                      </span>
                    </div>
                    <div
                      style={{
                        height: '9px',
                        borderRadius: '999px',
                        background: 'rgba(30, 41, 59, 0.85)',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(step.count > 0 ? 4 : 0, pct)}%`,
                          height: '100%',
                          background: step.color,
                          borderRadius: '999px',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visitor Sessions List with Channel Filter */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(148, 163, 184, 0.22)',
              borderRadius: '14px',
              padding: '1.15rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.6rem',
                marginBottom: '0.85rem',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc' }}>
                Sessões no Filtro Atual ({activeTelemetrySessions.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {(
                  [
                    { id: 'all', label: `Todos (${activeTelemetrySessions.length})` },
                    { id: 'google_ads', label: `🎯 Google Ads (${stats.channelBreakdown.google_ads.visitors})` },
                    { id: 'tiktok', label: `🎵 TikTok (${stats.channelBreakdown.tiktok.visitors})` },
                    { id: 'instagram', label: `📸 Instagram (${stats.channelBreakdown.instagram.visitors})` },
                    { id: 'discord', label: `💬 Discord (${stats.channelBreakdown.discord.visitors})` },
                    { id: 'organic', label: `🌐 Orgânico (${stats.channelBreakdown.organic.visitors})` },
                  ] as Array<{ id: 'all' | TrafficChannelId; label: string }>
                ).map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setChannelFilter(f.id)}
                    style={{
                      background:
                        channelFilter === f.id ? 'rgba(251, 191, 36, 0.22)' : 'rgba(2, 6, 23, 0.7)',
                      border:
                        channelFilter === f.id
                          ? '1px solid rgba(251, 191, 36, 0.75)'
                          : '1px solid rgba(148, 163, 184, 0.25)',
                      color: channelFilter === f.id ? '#fde047' : '#cbd5e1',
                      borderRadius: '999px',
                      padding: '0.24rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {activeTelemetrySessions.length === 0 ? (
              <div style={{ color: '#94a3b8', fontSize: '0.84rem' }}>
                Nenhuma sessão no filtro atual. Altere o período acima para consultar registros anteriores.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {activeTelemetrySessions
                  .filter((s) => channelFilter === 'all' || classifyVisitorChannel(s) === channelFilter)
                  .map((s) => {
                    const ch = classifyVisitorChannel(s);
                    const badgeMeta =
                      ch === 'tiktok'
                        ? {
                            label: '🎵 TIKTOK',
                            bg: 'rgba(244, 63, 94, 0.22)',
                            color: '#fda4af',
                          }
                        : ch === 'instagram'
                        ? {
                            label: '📸 INSTAGRAM',
                            bg: 'rgba(192, 132, 252, 0.22)',
                            color: '#e9d5ff',
                          }
                        : ch === 'discord'
                        ? {
                            label: '💬 DISCORD',
                            bg: 'rgba(129, 140, 248, 0.22)',
                            color: '#c7d2fe',
                          }
                        : ch === 'google_ads'
                        ? {
                            label: '🎯 GOOGLE ADS',
                            bg: 'rgba(56, 189, 248, 0.22)',
                            color: '#7dd3fc',
                          }
                        : {
                            label: '🌐 ACESSO DIRETO',
                            bg: 'rgba(148, 163, 184, 0.2)',
                            color: '#cbd5e1',
                          };
                    return (
                      <div
                        key={s.sessionId}
                        style={{
                          padding: '0.75rem 0.9rem',
                          borderRadius: '10px',
                          background: 'rgba(30, 41, 59, 0.6)',
                          border: '1px solid rgba(148, 163, 184, 0.16)',
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                          gap: '0.65rem',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: '0.65rem',
                                fontWeight: 900,
                                padding: '0.12rem 0.5rem',
                                borderRadius: '999px',
                                background: badgeMeta.bg,
                                color: badgeMeta.color,
                              }}
                            >
                              {badgeMeta.label}
                            </span>
                            <span style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.84rem' }}>
                              {s.registeredUsername
                                ? `Converteu Conta: ${s.registeredUsername}`
                                : `Sessão ${s.sessionId.slice(0, 14)}`}
                            </span>
                            {s.screenSize && (
                              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                                • Tela {s.screenSize}
                              </span>
                            )}
                          </div>
                          {(s.gclid || s.utmSource || s.utmMedium || s.utmCampaign || s.utmTerm) && (
                            <div style={{ fontSize: '0.72rem', color: '#7dd3fc', marginTop: '0.2rem' }}>
                              {s.gclid ? `GCLID: ${s.gclid} ` : ''}
                              {s.utmSource ? `| Fonte: ${s.utmSource} ` : ''}
                              {s.utmMedium ? `| Mídia: ${s.utmMedium} ` : ''}
                              {s.utmCampaign ? `| Campanha: ${s.utmCampaign} ` : ''}
                              {s.utmTerm ? `| Termo: ${s.utmTerm}` : ''}
                            </div>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                            {s.events.map((ev) => (
                              <span
                                key={ev}
                                style={{
                                  fontSize: '0.66rem',
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '6px',
                                  background: 'rgba(15, 23, 42, 0.85)',
                                  border: '1px solid rgba(148, 163, 184, 0.25)',
                                  color: '#e2e8f0',
                                }}
                              >
                                ✓ {ev}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.73rem', color: '#94a3b8' }}>
                          <div>
                            Último acesso:{' '}
                            {new Date(s.lastSeenAt).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                          <div style={{ color: '#cbd5e1', marginTop: '0.12rem' }}>
                            {(() => {
                              const sec =
                                s.engagedSec && s.engagedSec > 0
                                  ? s.engagedSec
                                  : Math.min(3600, Math.max(0, Math.round((s.lastSeenAt - s.firstSeenAt) / 1000)));
                              const ret = isReturningVisitorSession(s);
                              const visits = Math.max(s.visitCount ?? 1, s.activeDays?.length ?? 1);
                              return `${sec}s ativo${ret ? ` · Recorrente (${visits > 1 ? `${visits} visitas` : 'retorno'})` : ''}`;
                            })()}
                          </div>
                          <div style={{ opacity: 0.7, maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {s.landingUrl}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Local Browser Event Log */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(148, 163, 184, 0.22)',
              borderRadius: '14px',
              padding: '1.15rem',
            }}
          >
            <h3 style={{ margin: '0 0 0.65rem', fontSize: '0.95rem', color: '#f8fafc' }}>
              Eventos Disparados Neste Navegador ({localAuditEvents.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {localAuditEvents.slice(-15).map((ev, idx) => (
                <span
                  key={`${ev.eventName}_${idx}`}
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '8px',
                    background: 'rgba(30, 41, 59, 0.75)',
                    color: '#cbd5e1',
                  }}
                >
                  <strong>{ev.eventName}</strong> ({new Date(ev.timestamp).toLocaleTimeString('pt-BR')})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: MULTIPLAYER 1v1 ROOMS MONITOR
         ===================================================================== */}
      {section === 'rooms' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.88)',
            border: '1px solid rgba(148, 163, 184, 0.22)',
            borderRadius: '14px',
            padding: '1.2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc' }}>
                🌐 Salas 1×1 Ativas no Conclave ({cloudRooms.length})
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Inspecione ou encerre salas fantasmas/inativas diretamente no Supabase.
              </div>
            </div>
            {cloudRooms.length > 0 && (
              <button
                type="button"
                className="nav-notif-mini-btn"
                style={{ borderColor: 'rgba(248, 113, 113, 0.65)', color: '#fca5a5' }}
                onClick={async () => {
                  if (!window.confirm('Deseja remover todas as salas 1×1 listadas?')) return;
                  for (const r of cloudRooms) {
                    await adminDeleteCloudRoom(r.code);
                  }
                  await refreshCloudData();
                }}
              >
                🗑️ Limpar Todas as Salas ({cloudRooms.length})
              </button>
            )}
          </div>

          {cloudRooms.length === 0 ? (
            <div style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '1.5rem 0', textAlign: 'center' }}>
              Nenhuma sala 1×1 ativa na nuvem neste momento.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {cloudRooms.map((item) => {
                const rm = item.room;
                return (
                  <div
                    key={item.code}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      padding: '0.8rem 1rem',
                      borderRadius: '12px',
                      background: 'rgba(30, 41, 59, 0.65)',
                      border: '1px solid rgba(148, 163, 184, 0.18)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 900, color: '#fbbf24', fontSize: '0.9rem' }}>
                          {item.code}
                        </span>
                        <span
                          style={{
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '999px',
                            background: 'rgba(56, 189, 248, 0.18)',
                            color: '#7dd3fc',
                            textTransform: 'uppercase',
                          }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                        Anfitrião: <strong>{rm?.host?.username || '—'}</strong> vs Convidado:{' '}
                        <strong>{rm?.guest?.username || 'Aguardando oponente...'}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span style={{ fontSize: '0.73rem', color: '#94a3b8' }}>
                        Atualizado: {new Date(item.updatedAt).toLocaleTimeString('pt-BR')}
                      </span>
                      <button
                        type="button"
                        className="nav-notif-mini-btn"
                        style={{ borderColor: 'rgba(248, 113, 113, 0.6)', color: '#fca5a5' }}
                        onClick={async () => {
                          await adminDeleteCloudRoom(item.code);
                          await refreshCloudData();
                        }}
                      >
                        ✕ Encerrar Sala
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 5: GLOBAL ANNOUNCEMENTS & SYSTEM TOOLS
         ===================================================================== */}
      {section === 'system' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.88)',
              border: '1px solid rgba(251, 191, 36, 0.35)',
              borderRadius: '16px',
              padding: '1.3rem 1.45rem',
            }}
          >
            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.05rem', color: '#f8fafc' }}>
              📢 Publicar Comunicado Global para Todos os Jogadores
            </h3>
            <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#94a3b8' }}>
              O comunicado publicado aqui fica salvo na nuvem e aparece automaticamente na Central de
              Notificações (🔔 AVISOS) de todos os jogadores que entrarem no site.
            </p>

            {announcement && (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(251, 191, 36, 0.5)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 900, color: '#fbbf24' }}>
                    COMUNICADO ATIVO NO MOMENTO • POR {announcement.author.toUpperCase()}
                  </div>
                  <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.9rem' }}>
                    {announcement.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{announcement.message}</div>
                </div>
                <button
                  type="button"
                  className="nav-notif-mini-btn"
                  disabled={busyAction !== null}
                  onClick={handleClearAnnouncement}
                  style={{ borderColor: 'rgba(248, 113, 113, 0.6)', color: '#fca5a5' }}
                >
                  Remover Aviso
                </button>
              </div>
            )}

            <form
              onSubmit={handlePublishAnnouncement}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={annKicker}
                  onChange={(e) => setAnnKicker(e.target.value)}
                  placeholder="Categoria (ex: COMUNICADO OFICIAL)"
                  style={{
                    flex: '1 1 220px',
                    background: 'rgba(2, 6, 23, 0.85)',
                    border: '1px solid rgba(148, 163, 184, 0.35)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    color: '#f8fafc',
                    fontSize: '0.84rem',
                  }}
                />
                <input
                  type="text"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Título do comunicado (ex: Torneio de Vaeloria & Novas Cartas)"
                  style={{
                    flex: '2 1 340px',
                    background: 'rgba(2, 6, 23, 0.85)',
                    border: '1px solid rgba(148, 163, 184, 0.35)',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    color: '#f8fafc',
                    fontSize: '0.84rem',
                  }}
                />
              </div>
              <textarea
                rows={3}
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                placeholder="Mensagem que será exibida na Central de Notificações de todos os jogadores..."
                style={{
                  background: 'rgba(2, 6, 23, 0.85)',
                  border: '1px solid rgba(148, 163, 184, 0.35)',
                  borderRadius: '10px',
                  padding: '0.65rem 0.85rem',
                  color: '#f8fafc',
                  fontSize: '0.84rem',
                  resize: 'vertical',
                }}
              />
              <div>
                <button
                  type="submit"
                  className="aaa-btn aaa-btn-primary"
                  disabled={busyAction !== null || !annTitle.trim() || !annMessage.trim()}
                >
                  📢 Publicar Comunicado Global
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
