import React, { useState, useEffect, useMemo } from 'react';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import { createInitialGameState } from '../engine/gameEngine';
import { playSfx } from '../utils/soundEngine';
import {
  AVATAR_OPTIONS,
  createNewSovereignAccount,
  generateRoomCode,
  getActiveRoomsList,
  getRoomByCode,
  getSavedAccountsRoster,
  loginOrFetchAccountFromSupabase,
  MultiplayerRoom,
  publishMpMessage,
  setActiveTabUserProfile,
  SovereignUserProfile,
  subscribeMultiplayerBus,
  TITLE_OPTIONS,
} from '../utils/multiplayerEngine';
import { CustomSavedDeck } from './BattleArena';

interface SovereignAccountModalProps {
  currentUser: SovereignUserProfile;
  onUserChange: (profile: SovereignUserProfile) => void;
  onClose: () => void;
  initialTab?: 'login' | 'create';
}

export const SovereignAccountModal: React.FC<SovereignAccountModalProps> = ({
  currentUser,
  onUserChange,
  onClose,
  initialTab = 'login',
}) => {
  const [tab, setTab] = useState<'login' | 'create'>(initialTab);
  const [accountsRoster, setAccountsRoster] = useState<SovereignUserProfile[]>(() =>
    getSavedAccountsRoster()
  );

  // Login by nickname state
  const [loginNickname, setLoginNickname] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Create new account state
  const [newUsername, setNewUsername] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>(TITLE_OPTIONS[0]);
  const [newAvatarId, setNewAvatarId] = useState<string>(AVATAR_OPTIONS[0].cardId);

  const handleSelectExisting = (acc: SovereignUserProfile) => {
    setActiveTabUserProfile(acc);
    onUserChange(acc);
    playSfx('channel');
    onClose();
  };

  const handleCloudLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginNickname.trim()) return;
    setLoginLoading(true);
    setLoginError(null);
    const found = await loginOrFetchAccountFromSupabase(loginNickname);
    setLoginLoading(false);
    if (found) {
      setAccountsRoster(getSavedAccountsRoster());
      onUserChange(found);
      playSfx('ascend');
      onClose();
    } else {
      setLoginError(
        `Usuário "${loginNickname.trim()}" ainda não encontrado. Clique na aba "✨ Criar Nova Conta" acima para registrá-lo!`
      );
      setNewUsername(loginNickname.trim());
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    const created = createNewSovereignAccount({
      username: newUsername,
      email: newEmail,
      title: newTitle,
      avatarCardId: newAvatarId,
      preferredDeckId: currentUser.preferredDeckId || PREBUILT_DECKS[0]?.id || '',
    });
    setAccountsRoster(getSavedAccountsRoster());
    onUserChange(created);
    playSfx('ascend');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        style={{ maxWidth: '560px', width: '94vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="aaa-kicker">CONTA DO SOBERANO • CHROMATIC PACT ONLINE</div>
          <button
            type="button"
            className="aaa-btn aaa-btn-ghost"
            style={{ padding: '4px 10px' }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <h3
          className="font-cinzel gold-gradient-text"
          style={{ fontSize: '1.4rem', margin: '0.25rem 0 0.9rem' }}
        >
          IDENTIDADE DO SOBERANO
        </h3>

        {/* Tabs: Entrar / Trocar Conta vs Criar Nova Conta */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            marginBottom: '1.1rem',
          }}
        >
          <button
            type="button"
            className={`aaa-btn ${tab === 'login' ? 'aaa-btn-primary' : 'aaa-btn-secondary'}`}
            onClick={() => setTab('login')}
          >
            🔑 Entrar / Trocar Conta
          </button>
          <button
            type="button"
            className={`aaa-btn ${tab === 'create' ? 'aaa-btn-primary' : 'aaa-btn-secondary'}`}
            onClick={() => setTab('create')}
          >
            ✨ Criar Nova Conta
          </button>
        </div>

        {tab === 'login' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Cloud Login by Nickname */}
            <form
              onSubmit={handleCloudLogin}
              style={{
                padding: '0.9rem',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.78)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
              }}
            >
              <label className="aaa-stat-label">
                ENTRAR COM NICKNAME JÁ CADASTRADO NA NUVEM
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="myth-search-compact"
                  placeholder="Digite seu Nickname (ex: Thiago_Arconte)..."
                  value={loginNickname}
                  onChange={(e) => setLoginNickname(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="aaa-btn aaa-btn-primary"
                  disabled={loginLoading}
                >
                  {loginLoading ? 'Buscando...' : 'Entrar →'}
                </button>
              </div>
              {loginError && (
                <div style={{ fontSize: '0.76rem', color: '#fca5a5', marginTop: '0.2rem' }}>
                  {loginError}
                </div>
              )}
            </form>

            {/* Saved Accounts on this Browser */}
            <div>
              <div className="aaa-stat-label" style={{ marginBottom: '0.5rem' }}>
                CONTAS SALVAS NESTE DISPOSITIVO (CLIQUE PARA ATIVAR)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {accountsRoster.map((acc) => {
                  const isCurrent = acc.id === currentUser.id;
                  const card = CARDS_BY_ID[acc.avatarCardId] ?? ALL_CARDS[0];
                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleSelectExisting(acc)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.9rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: isCurrent
                          ? 'rgba(212, 175, 55, 0.18)'
                          : 'rgba(15, 23, 42, 0.75)',
                        border: isCurrent
                          ? '1.5px solid #fde047'
                          : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {card?.imagePath && (
                          <img
                            src={`${card.imagePath}?v=12`}
                            alt={acc.username}
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              border: '1px solid #fde047',
                              objectFit: 'contain',
                              background: '#050811',
                            }}
                          />
                        )}
                        <div>
                          <div
                            className="font-cinzel"
                            style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.92rem' }}
                          >
                            {acc.username}{' '}
                            {isCurrent && (
                              <span style={{ color: '#fde047', fontSize: '0.72rem' }}>
                                (ATIVO)
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                            {acc.title} • 🏆 {acc.eloRating} ELO ({acc.pvpWins}V / {acc.pvpLosses}D)
                          </div>
                        </div>
                      </div>
                      <span className="aaa-btn aaa-btn-secondary" style={{ padding: '4px 10px' }}>
                        {isCurrent ? '✓ Conectado' : 'Usar Conta'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleCreateAccount}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
          >
            <div>
              <label className="aaa-stat-label">NICKNAME DO SOBERANO *</label>
              <input
                type="text"
                className="myth-search-compact"
                placeholder="Ex: Thiago_Arconte"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                style={{ width: '100%', marginTop: '4px' }}
              />
            </div>

            <div>
              <label className="aaa-stat-label">E-MAIL (OPCIONAL)</label>
              <input
                type="email"
                className="myth-search-compact"
                placeholder="seu@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                style={{ width: '100%', marginTop: '4px' }}
              />
            </div>

            <div>
              <label className="aaa-stat-label">TÍTULO HONORÍFICO</label>
              <select
                className="myth-select-compact"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{ width: '100%', marginTop: '4px' }}
              >
                {TITLE_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="aaa-stat-label">ESCOLHA SEU BRASÃO / AVATAR</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem',
                  marginTop: '6px',
                }}
              >
                {AVATAR_OPTIONS.map((av) => {
                  const card = CARDS_BY_ID[av.cardId];
                  const selected = newAvatarId === av.cardId;
                  return (
                    <button
                      key={av.cardId}
                      type="button"
                      onClick={() => setNewAvatarId(av.cardId)}
                      style={{
                        padding: '6px',
                        borderRadius: '6px',
                        background: selected
                          ? 'rgba(212, 175, 55, 0.22)'
                          : 'rgba(15, 23, 42, 0.8)',
                        border: selected
                          ? '1.5px solid #fde047'
                          : '1px solid rgba(255,255,255,0.12)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {card?.imagePath && (
                        <img
                          src={`${card.imagePath}?v=12`}
                          alt={av.label}
                          style={{ width: '44px', height: '44px', objectFit: 'contain' }}
                        />
                      )}
                      <span
                        style={{ fontSize: '0.62rem', color: '#e2e8f0', textAlign: 'center' }}
                      >
                        {av.label.split(',')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.65rem',
                marginTop: '0.5rem',
              }}
            >
              <button type="button" className="aaa-btn aaa-btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="aaa-btn aaa-btn-primary">
                ✓ Criar & Entrar com este Usuário
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface MultiplayerViewProps {
  customDecks: CustomSavedDeck[];
  currentUser: SovereignUserProfile;
  onUserChange: (profile: SovereignUserProfile) => void;
  onStartOnlineMatch: (room: MultiplayerRoom, role: 'host' | 'guest') => void;
  onOpenAccountModal: (tab: 'login' | 'create') => void;
}

function resolveDeckCards(cardIds: string[]) {
  const result = [];
  for (const id of cardIds) {
    const found = CARDS_BY_ID[id];
    if (found) result.push(found);
  }
  if (result.length < 30) {
    return ALL_CARDS.slice(0, 40);
  }
  return result;
}

export const MultiplayerView: React.FC<MultiplayerViewProps> = ({
  customDecks,
  currentUser,
  onUserChange,
  onStartOnlineMatch,
  onOpenAccountModal,
}) => {
  const [accountsRoster, setAccountsRoster] = useState<SovereignUserProfile[]>(() =>
    getSavedAccountsRoster()
  );
  const [rooms, setRooms] = useState<MultiplayerRoom[]>(() => getActiveRoomsList());
  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    currentUser.preferredDeckId || PREBUILT_DECKS[0]?.id || ''
  );
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [hostedRoomCode, setHostedRoomCode] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  useEffect(() => {
    setAccountsRoster(getSavedAccountsRoster());
  }, [currentUser]);

  const allAvailableDecks = useMemo(
    () => [
      ...PREBUILT_DECKS.map((d) => ({
        id: d.id,
        name: d.name,
        subtitle: d.subtitle,
        coverCardId: d.coverCardId,
        cardIds: d.cardIds,
      })),
      ...customDecks.map((cd) => ({
        id: cd.id,
        name: `★ ${cd.name}`,
        subtitle: 'Grimório Autoral',
        coverCardId: cd.cardIds[0] ?? 'neutral_10_valkyra_pentacromatica',
        cardIds: cd.cardIds,
      })),
    ],
    [customDecks]
  );

  const selectedDeckObj = useMemo(
    () => allAvailableDecks.find((d) => d.id === selectedDeckId) ?? allAvailableDecks[0],
    [allAvailableDecks, selectedDeckId]
  );

  // Subscribe to real-time room & match events
  useEffect(() => {
    const unsub = subscribeMultiplayerBus((msg) => {
      setRooms(getActiveRoomsList());

      if (msg.type === 'ROOM_UPSERT') {
        const r = msg.room;
        // If we are hosting this room and a guest just joined -> start the match automatically!
        if (
          r.status === 'playing' &&
          r.canonicalState &&
          r.host.id === currentUser.id &&
          (hostedRoomCode === r.code || r.host.username === currentUser.username)
        ) {
          playSfx('ascend');
          onStartOnlineMatch(r, 'host');
        }
      }
    });
    return () => unsub();
  }, [currentUser.id, currentUser.username, hostedRoomCode, onStartOnlineMatch]);

  const handleSwitchAccount = (acc: SovereignUserProfile) => {
    setActiveTabUserProfile(acc);
    onUserChange(acc);
    setSelectedDeckId(acc.preferredDeckId || PREBUILT_DECKS[0]?.id || '');
    playSfx('channel');
    setStatusBanner(`Sessão alterada para ${acc.username} (${acc.eloRating} ELO).`);
  };

  const handleCreateRoom = (isPublicQueue: boolean) => {
    if (!selectedDeckObj) return;
    const code = generateRoomCode();
    const room: MultiplayerRoom = {
      code,
      status: 'waiting',
      isPublicQueue,
      createdAt: Date.now(),
      host: {
        id: currentUser.id,
        username: currentUser.username,
        title: currentUser.title,
        avatarCardId: currentUser.avatarCardId,
        eloRating: currentUser.eloRating,
        deckId: selectedDeckObj.id,
        cardIds: selectedDeckObj.cardIds,
      },
      stateVersion: 1,
    };

    setHostedRoomCode(code);
    publishMpMessage({ type: 'ROOM_UPSERT', room });
    playSfx('summon');
    setStatusBanner(
      isPublicQueue
        ? `Na Fila 1x1 (Sala ${code})! Aguardando desafiante ou envie o código a um amigo.`
        : `Sala Privada ${code} criada! Envie o código ao seu oponente.`
    );
  };

  const handleJoinRoom = (room: MultiplayerRoom) => {
    if (!selectedDeckObj) return;

    let activeGuest = currentUser;
    if (room.host.id === currentUser.id) {
      const altAccount =
        accountsRoster.find((a) => a.id !== room.host.id) ??
        createNewSovereignAccount({
          username: 'Arconte_Desafiante',
          title: 'Oráculo do Véu Glacial',
          avatarCardId: 'neutral_54_dragao_etereo',
          preferredDeckId: selectedDeckObj.id,
        });
      setActiveTabUserProfile(altAccount);
      onUserChange(altAccount);
      setAccountsRoster(getSavedAccountsRoster());
      activeGuest = altAccount;
    }

    const hostCards = resolveDeckCards(room.host.cardIds);
    const guestCards = resolveDeckCards(selectedDeckObj.cardIds);

    const canonicalState = createInitialGameState(hostCards, guestCards, {
      playerName: room.host.username,
      aiName: activeGuest.username,
      aiTitle: `${activeGuest.title} (${activeGuest.eloRating} ELO)`,
      aiAvatarCardId: activeGuest.avatarCardId,
    });
    canonicalState.player.title = `${room.host.title} (${room.host.eloRating} ELO)`;
    canonicalState.player.avatarCardId = room.host.avatarCardId;

    const updatedRoom: MultiplayerRoom = {
      ...room,
      status: 'playing',
      guest: {
        id: activeGuest.id,
        username: activeGuest.username,
        title: activeGuest.title,
        avatarCardId: activeGuest.avatarCardId,
        eloRating: activeGuest.eloRating,
        deckId: selectedDeckObj.id,
        cardIds: selectedDeckObj.cardIds,
      },
      canonicalState,
      stateVersion: room.stateVersion + 1,
      lastActorId: activeGuest.id,
    };

    publishMpMessage({ type: 'ROOM_UPSERT', room: updatedRoom });
    playSfx('ascend');
    onStartOnlineMatch(updatedRoom, 'guest');
  };

  const handleQuickMatchmaking = () => {
    const waitingPublic = rooms.find(
      (r) => r.status === 'waiting' && r.isPublicQueue && r.host.id !== currentUser.id
    );
    if (waitingPublic) {
      handleJoinRoom(waitingPublic);
    } else {
      handleCreateRoom(true);
    }
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = joinCodeInput.trim().toUpperCase();
    if (!clean) return;
    const found = getRoomByCode(clean) ?? rooms.find((r) => r.code === clean);
    if (!found) {
      setStatusBanner(`Sala "${clean}" não encontrada. Verifique o código ou crie uma nova sala.`);
      return;
    }
    handleJoinRoom(found);
  };

  const handleCancelHostedRoom = () => {
    if (!hostedRoomCode) return;
    publishMpMessage({ type: 'ROOM_REMOVE', roomCode: hostedRoomCode });
    setHostedRoomCode(null);
    setStatusBanner('Sala encerrada.');
  };

  const avatarCard = CARDS_BY_ID[currentUser.avatarCardId] ?? ALL_CARDS[0];
  const waitingRooms = rooms.filter((r) => r.status === 'waiting');

  return (
    <div className="aaa-page-shell">
      {/* Header: Sovereign Account & Online Status */}
      <div className="aaa-page-header">
        <div>
          <div className="aaa-kicker">
            🟢 SERVIDORES DOS CINCO DOMÍNIOS • ONLINE EM TEMPO REAL
          </div>
          <h1 className="aaa-page-title">CONCLAVE MULTIPLAYER 1x1</h1>
        </div>

        <div className="aaa-header-actions">
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            onClick={() => onOpenAccountModal('login')}
          >
            🔑 Entrar / Trocar Usuário
          </button>
          <button
            type="button"
            className="aaa-btn aaa-btn-primary"
            onClick={() => onOpenAccountModal('create')}
          >
            ✨ Criar Nova Conta
          </button>
        </div>
      </div>

      {statusBanner && (
        <div
          className="aaa-toast-banner"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <span>{statusBanner}</span>
          <button
            type="button"
            className="aaa-btn aaa-btn-ghost"
            style={{ padding: '2px 8px', fontSize: '0.68rem' }}
            onClick={() => setStatusBanner(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Grid: [Active Sovereign User Card] | [Deck Picker & Matchmaking Actions] */}
      <div className="tg-grid-layout">
        {/* Left Panel: Sovereign Account */}
        <div className="tg-panel">
          <div className="aaa-kicker">CONTA CONECTADA NESTA SESSÃO</div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.9rem 1rem',
              background: 'rgba(15, 23, 42, 0.82)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                border: '2px solid #fde047',
                background: '#070a12',
                overflow: 'hidden',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {avatarCard?.imagePath && (
                <img
                  src={`${avatarCard.imagePath}?v=12`}
                  alt={currentUser.username}
                  style={{ width: '92%', height: '92%', objectFit: 'contain' }}
                />
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="font-cinzel gold-gradient-text"
                style={{ fontSize: '1.2rem', fontWeight: 900 }}
              >
                {currentUser.username}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.4rem' }}>
                {currentUser.title}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="tg-role-pill" style={{ flex: 'none' }}>
                  🏆 {currentUser.eloRating} ELO
                </span>
                <span className="tg-cost-pill">
                  ⚔️ {currentUser.pvpWins}V - {currentUser.pvpLosses}D
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                onClick={() => onOpenAccountModal('create')}
              >
                ✨ Criar Conta
              </button>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                onClick={() => onOpenAccountModal('login')}
              >
                🔑 Trocar Conta
              </button>
            </div>
          </div>

          <div className="aaa-kicker" style={{ marginTop: '0.5rem' }}>
            ALTERNAR PERFIL SALVO NESTE DISPOSITIVO
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {accountsRoster.map((acc) => {
              const isCurrent = acc.id === currentUser.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  className={`aaa-btn ${isCurrent ? 'aaa-btn-primary' : 'aaa-btn-secondary'}`}
                  onClick={() => handleSwitchAccount(acc)}
                >
                  {isCurrent ? '✓ ' : ''}
                  {acc.username} ({acc.eloRating})
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Deck Selection, Quick Queue & Room Creation */}
        <div className="tg-panel">
          <div className="aaa-kicker">ESCOLHA SEU GRIMÓRIO PARA O DUELO 1x1</div>
          <div className="aaa-deck-selector-box" style={{ padding: '0.55rem 0.85rem' }}>
            <span className="aaa-stat-label">GRIMÓRIO ATIVO (100 CARTAS)</span>
            <select
              className="aaa-select"
              value={selectedDeckId}
              onChange={(e) => {
                setSelectedDeckId(e.target.value);
                const nextProfile = { ...currentUser, preferredDeckId: e.target.value };
                setActiveTabUserProfile(nextProfile);
                onUserChange(nextProfile);
              }}
              style={{ fontSize: '0.88rem', padding: '4px 0' }}
            >
              {allAvailableDecks.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.subtitle}
                </option>
              ))}
            </select>
          </div>

          {/* Primary 1v1 Matchmaking & Room Creation CTAs */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
            <button
              type="button"
              className="aaa-btn aaa-btn-primary aaa-btn-lg"
              style={{ flex: 1 }}
              onClick={handleQuickMatchmaking}
            >
              ⚔️ BUSCAR PARTIDA 1x1 (FILA RÁPIDA)
            </button>
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary aaa-btn-lg"
              onClick={() => handleCreateRoom(false)}
            >
              🏰 CRIAR SALA COM CÓDIGO
            </button>
          </div>

          {/* Join by Room Code Form */}
          <form
            onSubmit={handleJoinByCode}
            style={{
              display: 'flex',
              gap: '0.6rem',
              marginTop: '0.35rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <input
              type="text"
              className="myth-search-compact"
              placeholder="Digite o código da sala (ex: PACT-4829)..."
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              style={{ textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em' }}
            />
            <button type="submit" className="aaa-btn aaa-btn-primary">
              🔑 ENTRAR POR CÓDIGO
            </button>
          </form>

          {/* Active Hosted Room Waiting Banner */}
          {hostedRoomCode && (
            <div
              style={{
                marginTop: '0.45rem',
                padding: '0.95rem 1.1rem',
                borderRadius: '8px',
                background:
                  'linear-gradient(135deg, rgba(212, 175, 55, 0.16), rgba(15, 23, 42, 0.92))',
                border: '1.5px solid #fde047',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  className="font-cinzel"
                  style={{ color: '#fef08a', fontWeight: 900, fontSize: '0.92rem' }}
                >
                  ⏳ AGUARDANDO OPONENTE NA SALA:{' '}
                  <strong style={{ color: '#fff' }}>{hostedRoomCode}</strong>
                </span>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-ghost"
                  style={{ padding: '3px 9px', fontSize: '0.66rem' }}
                  onClick={handleCancelHostedRoom}
                >
                  Cancelar Sala
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary"
                  onClick={() => {
                    navigator.clipboard?.writeText(hostedRoomCode);
                    setStatusBanner(`Código ${hostedRoomCode} copiado!`);
                  }}
                >
                  📋 Copiar Código ({hostedRoomCode})
                </button>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-secondary"
                  onClick={() => window.open(window.location.href, '_blank')}
                >
                  🪟 Abrir 2ª Aba para Testar 1x1
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Panel: Live Waiting Rooms List */}
      <div className="tg-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="aaa-kicker">
            SALAS 1x1 ABERTAS AO VIVO ({waitingRooms.length} AGUARDANDO DESAFIANTE)
          </div>
          <button
            type="button"
            className="aaa-btn aaa-btn-ghost"
            style={{ padding: '4px 10px', fontSize: '0.68rem' }}
            onClick={() => setRooms(getActiveRoomsList())}
          >
            🔄 Atualizar Lobby
          </button>
        </div>

        {waitingRooms.length === 0 ? (
          <div
            style={{
              padding: '1.75rem',
              textAlign: 'center',
              color: '#94a3b8',
              border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: '6px',
              fontSize: '0.84rem',
            }}
          >
            Nenhuma sala aguardando no momento. Clique em <strong>"Buscar Partida 1x1"</strong> ou{' '}
            <strong>"Criar Sala com Código"</strong> acima para abrir um duelo!
          </div>
        ) : (
          <div className="exp-achievements-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {waitingRooms.map((room) => {
              const hostAvatar = CARDS_BY_ID[room.host.avatarCardId] ?? ALL_CARDS[0];
              const isOwnRoom = room.host.id === currentUser.id;
              return (
                <div
                  key={room.code}
                  className="exp-achievement-card is-unlocked"
                  style={{ justifyContent: 'space-between', padding: '1rem 1.15rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={`${hostAvatar.imagePath}?v=12`}
                      alt={room.host.username}
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: '1.5px solid #fde047',
                        background: '#070a12',
                        objectFit: 'contain',
                      }}
                    />
                    <div>
                      <div className="font-cinzel exp-ach-title" style={{ fontSize: '0.9rem' }}>
                        Sala <span style={{ color: '#fff' }}>{room.code}</span> •{' '}
                        {room.host.username}
                      </div>
                      <div className="exp-ach-desc">
                        {room.host.title} • 🏆 {room.host.eloRating} ELO
                      </div>
                      <div className="exp-ach-prog">
                        {room.isPublicQueue ? '🌐 Fila Pública 1x1' : '🔒 Sala com Código'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="aaa-btn aaa-btn-primary"
                    onClick={() => handleJoinRoom(room)}
                  >
                    {isOwnRoom ? '⚔️ Testar como P2 →' : '⚔️ Entrar no Duelo →'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
