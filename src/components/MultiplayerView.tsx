import React, { useState, useEffect, useMemo } from 'react';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import { createInitialGameState } from '../engine/gameEngine';
import { playSfx } from '../utils/soundEngine';
import {
  authenticateSovereignAccount,
  createNewSovereignAccount,
  deleteSovereignAccount,
  generateRoomCode,
  getActiveRoomsList,
  getActiveTabUserProfile,
  getAvatarHonorificTitle,
  getRoomByCode,
  getSavedAccountsRoster,
  getSelectableAvatarCards,
  isUnregisteredProfile,
  MONOCHROMATIC_STARTER_DECKS,
  MultiplayerRoom,
  publishMpMessage,
  recoverAndResetPassword,
  setActiveTabUserProfile,
  SovereignUserProfile,
  subscribeMultiplayerBus,
  updateSovereignAccountProfile,
} from '../utils/multiplayerEngine';
import { CustomSavedDeck } from './BattleArena';

export type AccountModalTab = 'profile' | 'login' | 'create';

interface AvatarCreaturePickerProps {
  selectedCardId: string;
  onSelectCardId: (cardId: string) => void;
}

const DOMAIN_FILTERS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'red', label: '🔴 Fogo' },
  { id: 'blue', label: '🔵 Gelo' },
  { id: 'purple', label: '🟣 Sombra' },
  { id: 'green', label: '🟢 Vida' },
  { id: 'gold', label: '🟡 Sol' },
  { id: 'neutral', label: '⚪ Neutro' },
];

const AvatarCreaturePicker: React.FC<AvatarCreaturePickerProps> = ({
  selectedCardId,
  onSelectCardId,
}) => {
  const [poolMode, setPoolMode] = useState<'legendary' | 'all_creatures'>('legendary');
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const availableCards = useMemo(() => {
    const base = getSelectableAvatarCards(poolMode);
    const q = searchQuery.trim().toLowerCase();
    return base.filter((c) => {
      if (domainFilter !== 'all' && c.domain !== domainFilter) return false;
      if (q) {
        const honorific = getAvatarHonorificTitle(c.id).toLowerCase();
        return c.name.toLowerCase().includes(q) || honorific.includes(q);
      }
      return true;
    });
  }, [poolMode, domainFilter, searchQuery]);

  const selectedCard = CARDS_BY_ID[selectedCardId] ?? ALL_CARDS[0];
  const boundHonorificTitle = getAvatarHonorificTitle(selectedCardId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
      {/* Live Automatic Honorific Title Preview Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          padding: '0.7rem 0.9rem',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.16), rgba(15, 23, 42, 0.9))',
          border: '1px solid rgba(250, 204, 21, 0.5)',
        }}
      >
        {selectedCard?.imagePath && (
          <img
            src={`${selectedCard.imagePath}?v=12`}
            alt={selectedCard.name}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              border: '2px solid #fde047',
              objectFit: 'contain',
              background: '#050811',
              flexShrink: 0,
            }}
          />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="aaa-stat-label" style={{ color: '#fde047' }}>
            👑 TÍTULO HONORÍFICO (VINCULADO AUTOMATICAMENTE AO AVATAR)
          </div>
          <div
            className="font-cinzel gold-gradient-text"
            style={{ fontSize: '1.02rem', fontWeight: 900, marginTop: '2px' }}
          >
            {boundHonorificTitle}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            Carta de Avatar: {selectedCard?.name}
          </div>
        </div>
      </div>

      {/* Filter Bar: [Lendárias vs Todas as Criaturas] + Search */}
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className={`aaa-btn ${
            poolMode === 'legendary' ? 'aaa-btn-primary' : 'aaa-btn-secondary'
          }`}
          style={{ padding: '4px 10px', fontSize: '0.72rem' }}
          onClick={() => setPoolMode('legendary')}
        >
          ★ Criaturas Lendárias
        </button>
        <button
          type="button"
          className={`aaa-btn ${
            poolMode === 'all_creatures' ? 'aaa-btn-primary' : 'aaa-btn-secondary'
          }`}
          style={{ padding: '4px 10px', fontSize: '0.72rem' }}
          onClick={() => setPoolMode('all_creatures')}
        >
          🐉 Todas as Criaturas
        </button>
        <input
          type="text"
          className="myth-search-compact"
          placeholder="Buscar criatura ou título..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: '150px', padding: '4px 10px', fontSize: '0.76rem' }}
        />
      </div>

      {/* Domain Filter Pills */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {DOMAIN_FILTERS.map((df) => (
          <button
            key={df.id}
            type="button"
            onClick={() => setDomainFilter(df.id)}
            style={{
              padding: '3px 8px',
              borderRadius: '999px',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer',
              background:
                domainFilter === df.id ? 'rgba(250, 204, 21, 0.22)' : 'rgba(15, 23, 42, 0.75)',
              border:
                domainFilter === df.id
                  ? '1px solid #fde047'
                  : '1px solid rgba(255,255,255,0.12)',
              color: domainFilter === df.id ? '#fef08a' : '#cbd5e1',
            }}
          >
            {df.label}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#94a3b8', alignSelf: 'center' }}>
          {availableCards.length} avatares
        </span>
      </div>

      {/* Scrollable Avatar Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))',
          gap: '0.5rem',
          maxHeight: '250px',
          overflowY: 'auto',
          padding: '0.45rem',
          borderRadius: '8px',
          background: 'rgba(5, 8, 17, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {availableCards.map((card) => {
          const selected = selectedCardId === card.id;
          const honorific = getAvatarHonorificTitle(card.id);
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onSelectCardId(card.id)}
              title={honorific}
              style={{
                padding: '7px 6px',
                borderRadius: '8px',
                background: selected
                  ? 'linear-gradient(145deg, rgba(212, 175, 55, 0.28), rgba(30, 22, 48, 0.9))'
                  : 'rgba(15, 23, 42, 0.82)',
                border: selected ? '1.5px solid #fde047' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                textAlign: 'center',
              }}
            >
              {card.imagePath && (
                <img
                  src={`${card.imagePath}?v=12`}
                  alt={card.name}
                  loading="lazy"
                  style={{ width: '52px', height: '52px', objectFit: 'contain' }}
                />
              )}
              <span
                style={{
                  fontSize: '0.64rem',
                  fontWeight: 700,
                  color: selected ? '#fef08a' : '#e2e8f0',
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {honorific}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface SovereignAccountModalProps {
  currentUser: SovereignUserProfile;
  customDecks?: CustomSavedDeck[];
  onUserChange: (profile: SovereignUserProfile) => void;
  onClose: () => void;
  initialTab?: AccountModalTab;
  onNeedsDeckSetup?: () => void;
}

export const SovereignAccountModal: React.FC<SovereignAccountModalProps> = ({
  currentUser,
  customDecks = [],
  onUserChange,
  onClose,
  initialTab = 'profile',
  onNeedsDeckSetup,
}) => {
  const isUnregistered = isUnregisteredProfile(currentUser);
  const [tab, setTab] = useState<AccountModalTab>(
    isUnregistered && initialTab === 'profile' ? 'create' : initialTab
  );
  const [accountsRoster, setAccountsRoster] = useState<SovereignUserProfile[]>(() =>
    getSavedAccountsRoster()
  );

  // 1. Profile Edit State (Everything editable EXCEPT Nickname)
  const [editEmail, setEditEmail] = useState<string>(currentUser.email || '');
  const [editNewPassword, setEditNewPassword] = useState<string>('');
  const [editAvatarId, setEditAvatarId] = useState<string>(currentUser.avatarCardId);
  const [editDeckId, setEditDeckId] = useState<string>(
    currentUser.preferredDeckId || PREBUILT_DECKS[0]?.id || ''
  );
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);

  // Sync edit state if currentUser changes
  useEffect(() => {
    setEditEmail(currentUser.email || '');
    setEditNewPassword('');
    setEditAvatarId(currentUser.avatarCardId);
    setEditDeckId(currentUser.preferredDeckId || PREBUILT_DECKS[0]?.id || '');
  }, [currentUser]);

  // 2. Login by Nickname/Email + Password state
  const [loginNickname, setLoginNickname] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Password Recovery state
  const [showRecoveryForm, setShowRecoveryForm] = useState<boolean>(false);
  const [recUsername, setRecUsername] = useState<string>('');
  const [recEmail, setRecEmail] = useState<string>('');
  const [recNewPassword, setRecNewPassword] = useState<string>('');
  const [recMessage, setRecMessage] = useState<{ ok: boolean; text: string } | null>(null);

  // 3. Create new account state
  const [newUsername, setNewUsername] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [newAvatarId, setNewAvatarId] = useState<string>('neutral_10_valkyra_pentacromatica');

  const allAvailableDecks = useMemo(
    () =>
      customDecks.length > 0
        ? customDecks.map((cd) => ({
            id: cd.id,
            name: `★ ${cd.name}`,
            subtitle: 'Grimório Autoral (100 Cartas)',
          }))
        : MONOCHROMATIC_STARTER_DECKS.map((d) => ({
            id: d.id,
            name: d.name,
            subtitle: d.subtitle,
          })),
    [customDecks]
  );

  const handleSaveProfileChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = updateSovereignAccountProfile(currentUser, {
      email: editEmail,
      newPassword: editNewPassword.trim() ? editNewPassword : undefined,
      avatarCardId: editAvatarId,
      preferredDeckId: editDeckId,
    });
    setEditNewPassword('');
    setAccountsRoster(getSavedAccountsRoster());
    onUserChange(updated);
    playSfx('ascend');
    setProfileSavedMsg('✓ Perfil atualizado e sincronizado na nuvem!');
    setTimeout(() => setProfileSavedMsg(null), 3000);
  };

  const handleSelectExisting = (acc: SovereignUserProfile) => {
    setActiveTabUserProfile(acc);
    onUserChange(acc);
    playSfx('channel');
    onClose();
    if (!acc.customDecks || acc.customDecks.length === 0) {
      onNeedsDeckSetup?.();
    }
  };

  const handleDeleteAccount = async (acc: SovereignUserProfile, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const remaining = await deleteSovereignAccount(acc);
    setAccountsRoster(remaining);
    const nextActive = getActiveTabUserProfile();
    onUserChange(nextActive);
    if (isUnregisteredProfile(nextActive)) {
      setTab('create');
    }
  };

  const handleCloudLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginNickname.trim() || !loginPassword.trim()) return;
    setLoginLoading(true);
    setLoginError(null);
    const res = await authenticateSovereignAccount(loginNickname, loginPassword);
    setLoginLoading(false);
    if (res.ok && res.profile) {
      setAccountsRoster(getSavedAccountsRoster());
      onUserChange(res.profile);
      playSfx('ascend');
      onClose();
      if (!res.profile.customDecks || res.profile.customDecks.length === 0) {
        onNeedsDeckSetup?.();
      }
    } else {
      setLoginError(res.error || 'Falha na autenticação.');
    }
  };

  const handleRecoverPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecMessage(null);
    setLoginLoading(true);
    const res = await recoverAndResetPassword(recUsername, recEmail, recNewPassword);
    setLoginLoading(false);
    if (res.ok && res.profile) {
      const recoveredProfile = res.profile;
      setAccountsRoster(getSavedAccountsRoster());
      onUserChange(recoveredProfile);
      playSfx('ascend');
      setRecMessage({
        ok: true,
        text: `✓ Senha redefinida com sucesso para ${recoveredProfile.username}! Você já está conectado.`,
      });
      setTimeout(() => {
        onClose();
        if (!recoveredProfile.customDecks || recoveredProfile.customDecks.length === 0) {
          onNeedsDeckSetup?.();
        }
      }, 1200);
    } else {
      setRecMessage({
        ok: false,
        text: res.error || 'Não foi possível redefinir a senha.',
      });
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!newUsername.trim()) return;
    if (!newEmail.trim()) {
      setCreateError('Informe um E-mail válido para recuperação de senha.');
      return;
    }
    if (newPassword.trim().length < 4) {
      setCreateError('A senha deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setCreateError('As duas senhas digitadas não conferem.');
      return;
    }
    const created = createNewSovereignAccount({
      username: newUsername,
      email: newEmail,
      password: newPassword,
      avatarCardId: newAvatarId,
      preferredDeckId: editDeckId || MONOCHROMATIC_STARTER_DECKS[0]?.id || '',
    });
    setAccountsRoster(getSavedAccountsRoster());
    onUserChange(created);
    playSfx('ascend');
    onClose();
    onNeedsDeckSetup?.();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        style={{ maxWidth: '680px', width: '95vw', maxHeight: '92vh', overflowY: 'auto' }}
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
          style={{ fontSize: '1.35rem', margin: '0.2rem 0 0.85rem' }}
        >
          IDENTIDADE & PERFIL DO SOBERANO
        </h3>

        {/* 3 Tabs: Meu Perfil | Entrar / Trocar Conta | Criar Nova Conta */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.45rem',
            marginBottom: '1rem',
          }}
        >
          <button
            type="button"
            className={`aaa-btn ${tab === 'profile' ? 'aaa-btn-primary' : 'aaa-btn-secondary'}`}
            onClick={() => setTab('profile')}
          >
            Meu Perfil
          </button>
          <button
            type="button"
            className={`aaa-btn ${tab === 'login' ? 'aaa-btn-primary' : 'aaa-btn-secondary'}`}
            onClick={() => setTab('login')}
          >
            Entrar / Trocar
          </button>
          <button
            type="button"
            className={`aaa-btn ${tab === 'create' ? 'aaa-btn-primary' : 'aaa-btn-secondary'}`}
            onClick={() => setTab('create')}
          >
            Criar Nova Conta
          </button>
        </div>

        {tab === 'profile' && (
          isUnregistered ? (
            <div
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px dashed rgba(250, 204, 21, 0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div className="font-cinzel gold-gradient-text" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                NENHUM PERFIL ATIVO NESTE DISPOSITIVO
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', maxWidth: '420px' }}>
                Crie sua conta escolhendo seu Nickname e qualquer Criatura ou Lendária como Avatar, ou entre com um Nickname já salvo na nuvem.
              </p>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary"
                  onClick={() => setTab('create')}
                >
                  Criar Nova Conta
                </button>
                <button
                  type="button"
                  className="aaa-btn aaa-btn-secondary"
                  onClick={() => setTab('login')}
                >
                  Entrar com Nickname
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSaveProfileChanges}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
            >
              {profileSavedMsg && (
                <div
                  style={{
                    padding: '0.6rem 0.9rem',
                    borderRadius: '6px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid #34d399',
                    color: '#a7f3d0',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {profileSavedMsg}
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.85rem',
                  alignItems: 'end',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                    🔒 NICKNAME (IMUTÁVEL)
                  </label>
                  <input
                    type="text"
                    className="myth-search-compact"
                    value={currentUser.username}
                    disabled
                    readOnly
                    title="O Nickname de um Soberano é perpétuo e não pode ser alterado."
                    style={{
                      width: '100%',
                      height: '38px',
                      boxSizing: 'border-box',
                      opacity: 0.72,
                      cursor: 'not-allowed',
                      background: 'rgba(15, 23, 42, 0.5)',
                      borderColor: 'rgba(148, 163, 184, 0.25)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                    E-MAIL DO SOBERANO
                  </label>
                  <input
                    type="email"
                    className="myth-search-compact"
                    placeholder="seu@email.com"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.85rem',
                  alignItems: 'end',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                    NOVA SENHA (DEIXE EM BRANCO P/ MANTER)
                  </label>
                  <input
                    type="password"
                    className="myth-search-compact"
                    placeholder="••••••••"
                    value={editNewPassword}
                    onChange={(e) => setEditNewPassword(e.target.value)}
                    style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                    GRIMÓRIO PREFERIDO PARA DUELOS
                  </label>
                  <select
                    className="myth-select-compact"
                    value={editDeckId}
                    onChange={(e) => setEditDeckId(e.target.value)}
                    style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                  >
                    {allAvailableDecks.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} — {d.subtitle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="aaa-stat-label" style={{ marginBottom: '0.35rem', display: 'block' }}>
                  ALTERAR AVATAR E TÍTULO HONORÍFICO (ESCOLHA QUALQUER CRIATURA OU LENDÁRIA)
                </label>
                <AvatarCreaturePicker
                  selectedCardId={editAvatarId}
                  onSelectCardId={setEditAvatarId}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.35rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <button
                  type="button"
                  className="aaa-btn aaa-btn-ghost"
                  style={{ color: '#fca5a5', borderColor: 'rgba(248, 113, 113, 0.35)' }}
                  onClick={() => handleDeleteAccount(currentUser)}
                >
                  Excluir Este Perfil
                </button>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button type="button" className="aaa-btn aaa-btn-ghost" onClick={onClose}>
                    Fechar
                  </button>
                  <button type="submit" className="aaa-btn aaa-btn-primary">
                    Salvar Alterações do Perfil
                  </button>
                </div>
              </div>
            </form>
          )
        )}

        {tab === 'login' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!showRecoveryForm ? (
              <form
                onSubmit={handleCloudLogin}
                style={{
                  padding: '0.95rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.78)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div className="aaa-kicker">AUTENTICAÇÃO DO SOBERANO</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.85rem',
                    alignItems: 'end',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                      NICKNAME OU E-MAIL *
                    </label>
                    <input
                      type="text"
                      className="myth-search-compact"
                      placeholder="Ex: tsm81 ou seu@email.com"
                      value={loginNickname}
                      onChange={(e) => setLoginNickname(e.target.value)}
                      required
                      style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                      SENHA *
                    </label>
                    <input
                      type="password"
                      className="myth-search-compact"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                {loginError && (
                  <div style={{ fontSize: '0.76rem', color: '#fca5a5' }}>{loginError}</div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-ghost"
                    style={{ fontSize: '0.72rem', color: '#fde047', padding: '4px 8px' }}
                    onClick={() => {
                      setRecUsername(loginNickname);
                      setShowRecoveryForm(true);
                    }}
                  >
                    🔄 Esqueceu sua senha? Recuperar / Redefinir Senha
                  </button>

                  <button
                    type="submit"
                    className="aaa-btn aaa-btn-primary"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Autenticando...' : '🔑 Entrar na Conta →'}
                  </button>
                </div>
              </form>
            ) : (
              <form
                onSubmit={handleRecoverPassword}
                style={{
                  padding: '0.95rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.86)',
                  border: '1.5px solid rgba(250, 204, 21, 0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="aaa-kicker" style={{ color: '#fde047' }}>
                    🔄 RECUPERAÇÃO E REDEFINIÇÃO DE SENHA
                  </div>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-ghost"
                    style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                    onClick={() => {
                      setShowRecoveryForm(false);
                      setRecMessage(null);
                    }}
                  >
                    ← Voltar ao Login
                  </button>
                </div>

                <p style={{ fontSize: '0.76rem', color: '#cbd5e1', margin: 0 }}>
                  Informe seu <strong>Nickname</strong> e o <strong>E-mail cadastrado</strong> na
                  sua conta para validar sua identidade e definir uma nova senha imediatamente:
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.85rem',
                    alignItems: 'end',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                      NICKNAME DA CONTA *
                    </label>
                    <input
                      type="text"
                      className="myth-search-compact"
                      placeholder="Ex: tsm81"
                      value={recUsername}
                      onChange={(e) => setRecUsername(e.target.value)}
                      required
                      style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                      E-MAIL CADASTRADO *
                    </label>
                    <input
                      type="email"
                      className="myth-search-compact"
                      placeholder="seu@email.com"
                      value={recEmail}
                      onChange={(e) => setRecEmail(e.target.value)}
                      required
                      style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                    NOVA SENHA * (MÍN. 4 CARACTERES)
                  </label>
                  <input
                    type="password"
                    className="myth-search-compact"
                    placeholder="Digite sua nova senha..."
                    value={recNewPassword}
                    onChange={(e) => setRecNewPassword(e.target.value)}
                    required
                    style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                  />
                </div>

                {recMessage && (
                  <div
                    style={{
                      fontSize: '0.78rem',
                      color: recMessage.ok ? '#a7f3d0' : '#fca5a5',
                      fontWeight: 700,
                    }}
                  >
                    {recMessage.text}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    className="aaa-btn aaa-btn-primary"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Validando...' : '✓ Redefinir Senha & Entrar'}
                  </button>
                </div>
              </form>
            )}

            {/* Saved Accounts on this Browser */}
            <div>
              <div className="aaa-stat-label" style={{ marginBottom: '0.5rem' }}>
                CONTAS SALVAS NESTE DISPOSITIVO
              </div>
              {accountsRoster.length === 0 ? (
                <div
                  style={{
                    padding: '1.1rem',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: '1px dashed rgba(255,255,255,0.12)',
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                  }}
                >
                  Nenhum perfil salvo neste navegador. Clique em <strong>"✨ Criar Nova Conta"</strong> acima para criar seu perfil!
                </div>
              ) : (
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
                              {getAvatarHonorificTitle(acc.avatarCardId)} • 🏆 {acc.eloRating} Reputação (
                              {acc.pvpWins}V / {acc.pvpLosses}D)
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span className="aaa-btn aaa-btn-secondary" style={{ padding: '4px 10px' }}>
                            {isCurrent ? '✓ Conectado' : 'Usar Conta'}
                          </span>
                          <button
                            type="button"
                            className="aaa-btn aaa-btn-ghost"
                            style={{ padding: '4px 8px', color: '#fca5a5' }}
                            title="Excluir este perfil"
                            onClick={(e) => handleDeleteAccount(acc, e)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'create' && (
          <form
            onSubmit={handleCreateAccount}
            style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}
          >
            {createError && (
              <div
                style={{
                  padding: '0.55rem 0.85rem',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.18)',
                  border: '1px solid rgba(248, 113, 113, 0.45)',
                  color: '#fca5a5',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
              >
                {createError}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem',
                alignItems: 'end',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                  NICKNAME * (IMUTÁVEL)
                </label>
                <input
                  type="text"
                  className="myth-search-compact"
                  placeholder="Ex: tsm81"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                  E-MAIL * (PARA RECUPERAÇÃO)
                </label>
                <input
                  type="email"
                  className="myth-search-compact"
                  placeholder="seu@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.85rem',
                alignItems: 'end',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                  SENHA * (MÍN. 4 CARACTERES)
                </label>
                <input
                  type="password"
                  className="myth-search-compact"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                  CONFIRMAR SENHA *
                </label>
                <input
                  type="password"
                  className="myth-search-compact"
                  placeholder="••••••••"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  required
                  style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label className="aaa-stat-label" style={{ marginBottom: '0.35rem', display: 'block' }}>
                ESCOLHA SEU AVATAR (QUALQUER CRIATURA OU LENDÁRIA DEFINE SEU TÍTULO HONORÍFICO)
              </label>
              <AvatarCreaturePicker
                selectedCardId={newAvatarId}
                onSelectCardId={setNewAvatarId}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.65rem',
                marginTop: '0.35rem',
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
  onOpenAccountModal: (tab: AccountModalTab) => void;
  onRequireDeckSetup?: () => void;
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
  onRequireDeckSetup,
}) => {
  const isGuest = isUnregisteredProfile(currentUser);
  const needsDeckSetup = !isGuest && customDecks.length === 0;
  const [accountsRoster, setAccountsRoster] = useState<SovereignUserProfile[]>(() =>
    getSavedAccountsRoster()
  );
  const [rooms, setRooms] = useState<MultiplayerRoom[]>(() => getActiveRoomsList());
  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    customDecks[0]?.id || currentUser.preferredDeckId || MONOCHROMATIC_STARTER_DECKS[0]?.id || ''
  );
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [hostedRoomCode, setHostedRoomCode] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  useEffect(() => {
    setAccountsRoster(getSavedAccountsRoster());
    if (customDecks.length > 0 && !customDecks.some((d) => d.id === selectedDeckId)) {
      setSelectedDeckId(customDecks[0].id);
    } else if (currentUser.preferredDeckId) {
      setSelectedDeckId(currentUser.preferredDeckId);
    }
  }, [currentUser, customDecks, selectedDeckId]);

  const allAvailableDecks = useMemo(
    () =>
      customDecks.length > 0
        ? customDecks.map((cd) => ({
            id: cd.id,
            name: `★ ${cd.name}`,
            subtitle: 'Grimório Autoral (100 Cartas)',
            coverCardId: cd.cardIds[0] ?? 'neutral_10_valkyra_pentacromatica',
            cardIds: cd.cardIds,
          }))
        : MONOCHROMATIC_STARTER_DECKS.map((d) => ({
            id: d.id,
            name: d.name,
            subtitle: d.subtitle,
            coverCardId: d.coverCardId,
            cardIds: d.cardIds,
          })),
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
    setSelectedDeckId(acc.preferredDeckId || MONOCHROMATIC_STARTER_DECKS[0]?.id || '');
    playSfx('channel');
    setStatusBanner(`Sessão alterada para ${acc.username} (${acc.eloRating} Reputação).`);
    if (!acc.customDecks || acc.customDecks.length === 0) {
      onRequireDeckSetup?.();
    }
  };

  const handleCreateRoom = (isPublicQueue: boolean) => {
    if (isUnregisteredProfile(currentUser)) {
      setStatusBanner('Crie ou entre na sua conta de Soberano antes de abrir uma sala 1x1!');
      onOpenAccountModal('create');
      return;
    }
    if (needsDeckSetup) {
      setStatusBanner('Monte e salve seu Grimório de Combate (100 cartas) antes de duelar 1x1!');
      onRequireDeckSetup?.();
      return;
    }
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
        title: getAvatarHonorificTitle(currentUser.avatarCardId),
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
    if (isUnregisteredProfile(currentUser)) {
      setStatusBanner('Crie ou entre na sua conta de Soberano antes de aceitar um duelo 1x1!');
      onOpenAccountModal('create');
      return;
    }
    if (needsDeckSetup) {
      setStatusBanner('Monte e salve seu Grimório de Combate (100 cartas) antes de aceitar um duelo 1x1!');
      onRequireDeckSetup?.();
      return;
    }
    if (!selectedDeckObj) return;

    if (room.host.id === currentUser.id || room.host.username === currentUser.username) {
      setStatusBanner(
        'Para testar contra si mesmo em outra aba, crie ou selecione um 2º usuário diferente do anfitrião!'
      );
      onOpenAccountModal('create');
      return;
    }
    const activeGuest = currentUser;

    const hostCards = resolveDeckCards(room.host.cardIds);
    const guestCards = resolveDeckCards(selectedDeckObj.cardIds);

    const canonicalState = createInitialGameState(hostCards, guestCards, {
      playerName: room.host.username,
      aiName: activeGuest.username,
      aiTitle: `${getAvatarHonorificTitle(activeGuest.avatarCardId)} (${activeGuest.eloRating} Reputação)`,
      aiAvatarCardId: activeGuest.avatarCardId,
    });
    canonicalState.player.title = `${getAvatarHonorificTitle(room.host.avatarCardId)} (${room.host.eloRating} Reputação)`;
    canonicalState.player.avatarCardId = room.host.avatarCardId;

    const updatedRoom: MultiplayerRoom = {
      ...room,
      status: 'playing',
      guest: {
        id: activeGuest.id,
        username: activeGuest.username,
        title: getAvatarHonorificTitle(activeGuest.avatarCardId),
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
  const currentHonorific = getAvatarHonorificTitle(currentUser.avatarCardId);
  const waitingRooms = rooms.filter((r) => r.status === 'waiting');

  return (
    <div className="aaa-page-shell">
      {/* Header: Sovereign Account & Online Status */}
      <div className="aaa-page-header">
        <div>
          <div className="aaa-kicker">
            SERVIDORES DOS CINCO DOMÍNIOS • SINCRONIZAÇÃO EM TEMPO REAL
          </div>
          <h1 className="aaa-page-title font-cinzel">Conclave Multiplayer 1×1</h1>
        </div>

        <div className="aaa-header-actions">
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            onClick={() => onOpenAccountModal('profile')}
          >
            Meu Perfil
          </button>
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            onClick={() => onOpenAccountModal('login')}
          >
            Trocar Usuário
          </button>
          <button
            type="button"
            className="aaa-btn aaa-btn-primary"
            onClick={() => onOpenAccountModal('create')}
          >
            Criar Nova Conta
          </button>
        </div>
      </div>

      {isUnregisteredProfile(currentUser) ? (
        <div className="aaa-status-callout is-guest">
          <div className="aaa-callout-copy">
            <span className="aaa-callout-kicker">MODO VISITANTE • NAVEGAÇÃO LIVRE</span>
            <span className="aaa-callout-title">Conclave Multiplayer 1×1</span>
            <p className="aaa-callout-text">
              Você pode visualizar as salas abertas no lobby. Para disputar duelos 1×1 ranqueados e ganhar <strong>+10 Ouro por vitória</strong>, entre ou crie sua Conta de Soberano.
            </p>
          </div>
          <button
            type="button"
            className="aaa-btn aaa-btn-primary"
            onClick={() => onOpenAccountModal('create')}
          >
            Entrar / Criar Conta
          </button>
        </div>
      ) : needsDeckSetup ? (
        <div className="aaa-status-callout is-onboarding">
          <div className="aaa-callout-copy">
            <span className="aaa-callout-kicker">ETAPA OBRIGATÓRIA • JORNADA DO SOBERANO</span>
            <span className="aaa-callout-title">Grimório de Combate Necessário</span>
            <p className="aaa-callout-text">
              Antes de abrir ou aceitar salas 1×1, monte e salve seu Grimório de 100 cartas na seção <strong>Grimório</strong>.
            </p>
          </div>
          {onRequireDeckSetup && (
            <button type="button" className="aaa-btn aaa-btn-primary" onClick={onRequireDeckSetup}>
              Montar Meu Grimório (100 Cartas) →
            </button>
          )}
        </div>
      ) : null}

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
          <div className="aaa-kicker">PERFIL DO SOBERANO CONECTADO</div>
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
              onClick={() => onOpenAccountModal('profile')}
              title="Clique para trocar seu Avatar"
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
                cursor: 'pointer',
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
              <div style={{ fontSize: '0.78rem', color: '#fde047', marginBottom: '0.4rem' }}>
                {currentHonorific}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="tg-role-pill" style={{ flex: 'none' }}>
                  {currentUser.eloRating} Reputação
                </span>
                <span className="tg-cost-pill">
                  {currentUser.pvpWins}V • {currentUser.pvpLosses}D
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                onClick={() => onOpenAccountModal('profile')}
              >
                Editar Perfil
              </button>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                onClick={() => onOpenAccountModal('login')}
              >
                Trocar / Criar
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
          <div className="aaa-kicker">PAREAMENTO & SALAS DE DUELO</div>
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
              BUSCAR PARTIDA 1×1 (FILA RÁPIDA)
            </button>
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary aaa-btn-lg"
              onClick={() => handleCreateRoom(false)}
            >
              CRIAR SALA PRIVADA
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
              ENTRAR POR CÓDIGO
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
                  Copiar Código ({hostedRoomCode})
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
                        {getAvatarHonorificTitle(room.host.avatarCardId)} • 🏆 {room.host.eloRating}{' '}
                        Reputação
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
