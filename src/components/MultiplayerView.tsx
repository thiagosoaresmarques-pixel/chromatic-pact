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
  getActiveTabUserProfile,
  getRoomByCode,
  getSavedAccountsRoster,
  getSupabaseConfig,
  MultiplayerRoom,
  publishMpMessage,
  saveSupabaseConfig,
  setActiveTabUserProfile,
  SovereignUserProfile,
  subscribeMultiplayerBus,
  TITLE_OPTIONS,
} from '../utils/multiplayerEngine';
import { CustomSavedDeck } from './BattleArena';

interface MultiplayerViewProps {
  customDecks: CustomSavedDeck[];
  currentUser: SovereignUserProfile;
  onUserChange: (profile: SovereignUserProfile) => void;
  onStartOnlineMatch: (room: MultiplayerRoom, role: 'host' | 'guest') => void;
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

  // Account creation / edit modal state
  const [showAccountModal, setShowAccountModal] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>(TITLE_OPTIONS[0]);
  const [newAvatarId, setNewAvatarId] = useState<string>(AVATAR_OPTIONS[0].cardId);

  // Cloud Config modal state
  const [showCloudModal, setShowCloudModal] = useState<boolean>(false);
  const [supaUrl, setSupaUrl] = useState<string>(() => getSupabaseConfig().url);
  const [supaKey, setSupaKey] = useState<string>(() => getSupabaseConfig().anonKey);
  const cloudConfigured = getSupabaseConfig().isConfigured;

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

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    const created = createNewSovereignAccount({
      username: newUsername,
      email: newEmail,
      title: newTitle,
      avatarCardId: newAvatarId,
      preferredDeckId: selectedDeckId,
    });
    setAccountsRoster(getSavedAccountsRoster());
    onUserChange(created);
    setShowAccountModal(false);
    setNewUsername('');
    setNewEmail('');
    playSfx('ascend');
    setStatusBanner(`Novo Soberano consagrado: ${created.username}!`);
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
        ? `Na Fila 1x1 (Sala ${code})! Abra uma 2ª aba ou envie o código ao oponente.`
        : `Sala Privada ${code} criada! Envie o código ao seu oponente.`
    );
  };

  const handleJoinRoom = (room: MultiplayerRoom) => {
    if (!selectedDeckObj) return;

    // If user is trying to join their own room from the same account, automatically switch to a 2nd test account so they can test 1v1 effortlessly!
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

    // Create canonical GameState from Host's perspective ('player' = Host, 'ai' = Guest)
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
      {/* Header: Sovereign Account & Cloud Status */}
      <div className="aaa-page-header">
        <div>
          <div className="aaa-kicker">
            ARENA ONLINE 1x1 • {cloudConfigured ? '🟢 SUPABASE CLOUD ATIVO' : '⚡ MODO TESTE MULTI-ABA / LAN ATIVO'}
          </div>
          <h1 className="aaa-page-title">CONCLAVE MULTIPLAYER 1x1</h1>
        </div>

        <div className="aaa-header-actions">
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            onClick={() => setShowAccountModal(true)}
          >
            👤 Criar / Novo Usuário
          </button>
          <button
            type="button"
            className="aaa-btn aaa-btn-ghost"
            onClick={() => setShowCloudModal(true)}
          >
            ☁️ Configurar Supabase + Cloudflare
          </button>
        </div>
      </div>

      {statusBanner && (
        <div className="aaa-toast-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

      {/* Top Grid: [Active Sovereign User Card + Quick Account Switcher] | [Deck Picker & Matchmaking Actions] */}
      <div className="tg-grid-layout">
        {/* Left Panel: Sovereign Account & Quick Test Account Switcher */}
        <div className="tg-panel">
          <div className="aaa-kicker">PERFIL DO SOBERANO (ISOLADO POR ABA PARA TESTE 1x1)</div>
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
          </div>

          <div className="aaa-kicker" style={{ marginTop: '0.5rem' }}>
            TROCA RÁPIDA DE USUÁRIO DE TESTE (USE CONTAS DIFERENTES EM CADA ABA)
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

          <div
            style={{
              marginTop: '0.4rem',
              padding: '0.75rem 0.9rem',
              borderRadius: '6px',
              background: 'rgba(14, 116, 144, 0.14)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              fontSize: '0.76rem',
              color: '#bae6fd',
              lineHeight: 1.5,
            }}
          >
            💡 <strong>Como testar o 1x1 agora mesmo:</strong> Crie uma sala ao lado e clique em{' '}
            <strong>"Abrir 2ª Aba (Jogador 2)"</strong>. Na segunda aba, clique em{' '}
            <strong>"Entrar no Duelo"</strong> — cada aba verá o tabuleiro da sua própria perspectiva!
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
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.16), rgba(15, 23, 42, 0.92))',
                border: '1.5px solid #fde047',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-cinzel" style={{ color: '#fef08a', fontWeight: 900, fontSize: '0.92rem' }}>
                  ⏳ AGUARDANDO OPONENTE NA SALA: <strong style={{ color: '#fff' }}>{hostedRoomCode}</strong>
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
                  🪟 Abrir 2ª Aba (Jogador 2) para Testar Agora
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
                        Sala <span style={{ color: '#fff' }}>{room.code}</span> • {room.host.username}
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

      {/* Modal: Create New Sovereign User Account */}
      {showAccountModal && (
        <div className="modal-backdrop" onClick={() => setShowAccountModal(false)}>
          <div
            className="modal-panel"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aaa-kicker">CADASTRO DE SOBERANO • PERFIL MULTIPLAYER</div>
            <h3 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '1rem' }}>
              CRIAR NOVO USUÁRIO
            </h3>

            <form onSubmit={handleCreateAccount} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
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
                <label className="aaa-stat-label">E-MAIL (OPCIONAL NO MODO TESTE)</label>
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
                <label className="aaa-stat-label">AVATAR DO SOBERANO</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '6px' }}>
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
                          background: selected ? 'rgba(212, 175, 55, 0.22)' : 'rgba(15, 23, 42, 0.8)',
                          border: selected ? '1.5px solid #fde047' : '1px solid rgba(255,255,255,0.12)',
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
                        <span style={{ fontSize: '0.62rem', color: '#e2e8f0', textAlign: 'center' }}>
                          {av.label.split(',')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-ghost"
                  onClick={() => setShowAccountModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="aaa-btn aaa-btn-primary">
                  ✓ Criar & Entrar com este Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cloud Configuration (Supabase + Cloudflare Pages) */}
      {showCloudModal && (
        <div className="modal-backdrop" onClick={() => setShowCloudModal(false)}>
          <div
            className="modal-panel"
            style={{ maxWidth: '600px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aaa-kicker">ARQUITETURA CUSTO ZERO • SUPABASE + CLOUDFLARE PAGES</div>
            <h3 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.3rem', marginBottom: '0.6rem' }}>
              CONEXÃO COM SUPABASE CLOUD
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.55, marginBottom: '1rem' }}>
              Para testes locais ou na mesma rede Wi-Fi, o servidor embutido do Vite já sincroniza as
              partidas 1x1 automaticamente. Para jogar online pela internet via{' '}
              <strong>Supabase + Cloudflare Pages</strong>, cole abaixo a URL e a Anon Key do seu
              projeto gratuito no Supabase (ou defina <code>VITE_SUPABASE_URL</code> e{' '}
              <code>VITE_SUPABASE_ANON_KEY</code> no arquivo <code>.env</code>). O script SQL já está
              salvo na raiz do projeto em <code>supabase_schema.sql</code>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label className="aaa-stat-label">SUPABASE PROJECT URL</label>
                <input
                  type="url"
                  className="myth-search-compact"
                  placeholder="https://seu-projeto.supabase.co"
                  value={supaUrl}
                  onChange={(e) => setSupaUrl(e.target.value)}
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div>
                <label className="aaa-stat-label">SUPABASE ANON PUBLIC KEY</label>
                <input
                  type="text"
                  className="myth-search-compact"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supaKey}
                  onChange={(e) => setSupaKey(e.target.value)}
                  style={{ width: '100%', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-ghost"
                  onClick={() => setShowCloudModal(false)}
                >
                  Fechar
                </button>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary"
                  onClick={() => {
                    saveSupabaseConfig(supaUrl, supaKey);
                    setShowCloudModal(false);
                    setStatusBanner('Configuração do Supabase salva!');
                  }}
                >
                  Salvar Conexão Supabase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
