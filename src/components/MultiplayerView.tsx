import React, { useState, useEffect, useMemo } from 'react';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { PREBUILT_DECKS } from '../data/decks';
import { INITIAL_PLAYER_ELO } from '../data/eloDivisions';
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
  isAdminProfile,
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
import {
  downloadSovereignSaveFile,
  exportSovereignSaveCode,
  importSovereignSaveCode,
} from '../utils/portableCodex';
import {
  getPwaInstallState,
  PwaInstallState,
  subscribePwaInstallState,
  triggerPwaInstallPrompt,
} from '../utils/pwaInstall';
import { CustomSavedDeck } from './BattleArena';
import {
  getPersonalMatchHistory,
  PersonalMatchHistoryEntry,
} from '../utils/personalMatchHistoryEngine';

export type AccountModalTab = 'profile' | 'replays' | 'login' | 'create';

interface AvatarCreaturePickerProps {
  selectedCardId: string;
  onSelectCardId: (cardId: string) => void;
}

const DOMAIN_FILTERS: Array<{ id: string; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'red', label: 'Chama' },
  { id: 'blue', label: 'Tempestade' },
  { id: 'purple', label: 'Abismo' },
  { id: 'green', label: 'Selva' },
  { id: 'gold', label: 'Ordem' },
  { id: 'neutral', label: 'Axial' },
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
            Título honorífico vinculado ao avatar
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
          Criaturas Lendárias
        </button>
        <button
          type="button"
          className={`aaa-btn ${
            poolMode === 'all_creatures' ? 'aaa-btn-primary' : 'aaa-btn-secondary'
          }`}
          style={{ padding: '4px 10px', fontSize: '0.72rem' }}
          onClick={() => setPoolMode('all_creatures')}
        >
          Todas as Criaturas
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
  onAccountSuccess?: (profile: SovereignUserProfile) => void;
  onClose: () => void;
  initialTab?: AccountModalTab;
  bonusStarterGold?: number;
  contextNotice?: string;
  onNeedsDeckSetup?: () => void;
  onOpenAdminPanel?: () => void;
  onOpenPwaInstall?: () => void;
  onLaunchPersonalReplay?: (entry: PersonalMatchHistoryEntry) => void;
}

const STARTER_DOMAIN_SHORT_LABELS: Record<string, string> = {
  red: 'Chama',
  blue: 'Tempestade',
  purple: 'Abismo',
  green: 'Selva',
  gold: 'Ordem',
};

export const SovereignAccountModal: React.FC<SovereignAccountModalProps> = ({
  currentUser,
  customDecks = [],
  onUserChange,
  onAccountSuccess,
  onClose,
  initialTab = 'profile',
  bonusStarterGold = 0,
  contextNotice,
  onNeedsDeckSetup,
  onOpenAdminPanel,
  onOpenPwaInstall,
  onLaunchPersonalReplay,
}) => {
  const isUnregistered = isUnregisteredProfile(currentUser);
  const [tab, setTab] = useState<AccountModalTab>(
    isUnregistered && initialTab === 'profile' ? 'create' : initialTab
  );
  const [personalReplays] = useState<PersonalMatchHistoryEntry[]>(() =>
    getPersonalMatchHistory()
  );
  const [accountsRoster, setAccountsRoster] = useState<SovereignUserProfile[]>(() =>
    getSavedAccountsRoster()
  );

  // 1. Profile Edit State (Everything editable EXCEPT Nickname)
  const [editEmail, setEditEmail] = useState<string>(currentUser.email || '');
  const [editNewPassword, setEditNewPassword] = useState<string>('');
  const [editAvatarId, setEditAvatarId] = useState<string>(currentUser.avatarCardId);
  const [editDeckId, setEditDeckId] = useState<string>(
    currentUser.preferredDeckId || customDecks[0]?.id || ''
  );
  const [profileSavedMsg, setProfileSavedMsg] = useState<string | null>(null);

  // PWA & Portable Codex Sync State (PC <-> Smartphone)
  const [pwaState, setPwaState] = useState<PwaInstallState>(() => getPwaInstallState());
  const [showPortableRestore, setShowPortableRestore] = useState<boolean>(false);
  const [portableCodeInput, setPortableCodeInput] = useState<string>('');
  const [portableFeedback, setPortableFeedback] = useState<{
    kind: 'ok' | 'err';
    text: string;
  } | null>(null);

  useEffect(() => subscribePwaInstallState(setPwaState), []);

  const handleCopyPortableSave = () => {
    if (isUnregistered) return;
    const code = exportSovereignSaveCode(currentUser);
    navigator.clipboard.writeText(code).catch(() => undefined);
    playSfx('channel');
    setPortableFeedback({
      kind: 'ok',
      text: 'Códice de Save copiado. Cole-o no seu smartphone ou outro navegador para sincronizar tudo.',
    });
  };

  const handleRestorePortableSave = (rawCode: string) => {
    const res = importSovereignSaveCode(rawCode);
    if (!res.ok) {
      setPortableFeedback({ kind: 'err', text: res.error });
      return;
    }
    playSfx('victory');
    setAccountsRoster(getSavedAccountsRoster());
    onUserChange(res.profile);
    setTab('profile');
    setShowPortableRestore(false);
    setPortableCodeInput('');
    setPortableFeedback({
      kind: 'ok',
      text: `✓ Conta "${res.profile.username}" e ${res.restoredKeysCount} registros de progresso restaurados!`,
    });
  };

  const handleUploadSaveFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleRestorePortableSave(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Sync edit state if currentUser changes
  useEffect(() => {
    setEditEmail(currentUser.email || '');
    setEditNewPassword('');
    setEditAvatarId(currentUser.avatarCardId);
    setEditDeckId(currentUser.preferredDeckId || customDecks[0]?.id || '');
  }, [currentUser, customDecks]);

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
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [selectedStarterTemplateId, setSelectedStarterTemplateId] = useState<string>(
    () => MONOCHROMATIC_STARTER_DECKS[0]?.id || ''
  );
  const [hasCustomAvatarPick, setHasCustomAvatarPick] = useState<boolean>(false);
  const [newAvatarId, setNewAvatarId] = useState<string>(
    () => MONOCHROMATIC_STARTER_DECKS[0]?.coverCardId || 'neutral_10_valkyra_pentacromatica'
  );

  const allAvailableDecks = useMemo(
    () =>
      customDecks.map((cd) => ({
        id: cd.id,
        name: cd.name,
        subtitle: 'Grimório Autoral (100 Cartas)',
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
    onAccountSuccess?.(acc);
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
      onAccountSuccess?.(res.profile);
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
      onAccountSuccess?.(recoveredProfile);
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
    const created = createNewSovereignAccount({
      username: newUsername,
      email: newEmail,
      password: newPassword,
      avatarCardId: newAvatarId,
      preferredDeckId: selectedStarterTemplateId || editDeckId || MONOCHROMATIC_STARTER_DECKS[0]?.id || '',
      starterTemplateDeckId: selectedStarterTemplateId || MONOCHROMATIC_STARTER_DECKS[0]?.id,
      bonusGold: bonusStarterGold,
    });
    setAccountsRoster(getSavedAccountsRoster());
    onUserChange(created);
    onAccountSuccess?.(created);
    playSfx('ascend');
    onClose();
    if (!created.customDecks || created.customDecks.length === 0) {
      onNeedsDeckSetup?.();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel"
        style={{ maxWidth: '680px', width: '95vw', maxHeight: '92vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-sticky-close-bar">
          <div className="aaa-kicker">CONTA DO SOBERANO • CHROMATIC PACT ONLINE</div>
          <button
            type="button"
            className="btn-fantasy btn-fantasy-danger"
            style={{ padding: '4px 10px', fontSize: '0.74rem' }}
            onClick={onClose}
          >
            ✕ Fechar
          </button>
        </div>

        <h3
          className="font-cinzel gold-gradient-text"
          style={{ fontSize: '1.35rem', margin: '0.2rem 0 0.85rem' }}
        >
          IDENTIDADE & PERFIL DO SOBERANO
        </h3>

        {/* 4 Tabs: Meu Perfil | Partidas | Entrar / Trocar | Criar Nova Conta */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(128px, 1fr))',
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
            className={`aaa-btn ${tab === 'replays' ? 'aaa-btn-primary' : 'aaa-btn-secondary'}`}
            onClick={() => setTab('replays')}
          >
            Partidas{personalReplays.length > 0 ? ` (${personalReplays.length})` : ''}
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
              {isAdminProfile(currentUser) && onOpenAdminPanel && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.22), rgba(15, 23, 42, 0.92))',
                    border: '1px solid rgba(251, 191, 36, 0.75)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fde047' }}>
                      Credencial de Administrador ({currentUser.username})
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#e2e8f0' }}>
                      Gerencie contas, Ouro, coleção de 500 cartas, visitantes e salas 1×1.
                    </div>
                  </div>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-primary"
                    onClick={() => {
                      onClose();
                      onOpenAdminPanel();
                    }}
                  >
                    Abrir Painel Admin
                  </button>
                </div>
              )}

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
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: '0.85rem',
                  alignItems: 'end',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                    NICKNAME (IMUTÁVEL)
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
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
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
                  {allAvailableDecks.length > 0 ? (
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
                  ) : (
                    <button
                      type="button"
                      className="aaa-btn aaa-btn-secondary"
                      style={{
                        width: '100%',
                        height: '38px',
                        fontSize: '0.75rem',
                        color: '#fde047',
                        borderColor: 'rgba(250, 204, 21, 0.55)',
                      }}
                      onClick={() => {
                        onClose();
                        onNeedsDeckSetup?.();
                      }}
                    >
                      Sem Grimório (0/100) — Escolher Meu 1º Grimório
                    </button>
                  )}
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
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
                    Esqueceu sua senha? Recuperar / Redefinir
                  </button>

                  <button
                    type="submit"
                    className="aaa-btn aaa-btn-primary"
                    disabled={loginLoading}
                  >
                    {loginLoading ? 'Autenticando...' : 'Entrar na Conta'}
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
                    RECUPERAÇÃO E REDEFINIÇÃO DE SENHA
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
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
                  Nenhum perfil salvo neste navegador. Clique em <strong>"Criar Nova Conta"</strong> acima para criar seu perfil.
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
                                  (Ativo)
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                              {getAvatarHonorificTitle(acc.avatarCardId)} · {acc.eloRating} ELO (
                              {acc.pvpWins}V / {acc.pvpLosses}D)
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <span className="aaa-btn aaa-btn-secondary" style={{ padding: '4px 10px' }}>
                            {isCurrent ? 'Conectado' : 'Usar Conta'}
                          </span>
                          <button
                            type="button"
                            className="aaa-btn aaa-btn-ghost"
                            style={{ padding: '4px 8px', color: '#fca5a5', fontSize: '0.72rem' }}
                            title="Excluir este perfil"
                            onClick={(e) => handleDeleteAccount(acc, e)}
                          >
                            Excluir
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
            style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
          >
            {/* Nota sóbria de Boas-Vindas */}
            <div
              style={{
                padding: '0.65rem 0.9rem',
                borderRadius: '8px',
                background: 'rgba(15, 23, 42, 0.72)',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fde68a' }}>
                {contextNotice || 'Bônus inicial de Soberano'}
              </div>
              <div style={{ fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                Inclui <strong>+{160 + Math.max(0, bonusStarterGold)} Ouro inicial</strong> e{' '}
                <strong>Grimório completo de 100 cartas pronto para jogar</strong> (editável a qualquer momento).
              </div>
            </div>

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
                gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))',
                gap: '0.75rem',
                alignItems: 'end',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                  Apelido * (imutável)
                </label>
                <input
                  type="text"
                  className="myth-search-compact"
                  placeholder="Ex: Valerius"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  style={{ width: '100%', height: '38px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                  E-mail * (para recuperação)
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label className="aaa-stat-label" style={{ whiteSpace: 'nowrap' }}>
                  Senha * (mín. 4 caracteres)
                </label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="myth-search-compact"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ flex: 1, minWidth: 0, height: '38px', boxSizing: 'border-box' }}
                  />
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-ghost"
                    onClick={() => setShowNewPassword((v) => !v)}
                    style={{ height: '38px', padding: '0 10px', fontSize: '0.74rem', flexShrink: 0 }}
                  >
                    {showNewPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Escolha em 1 clique do Grimório Inicial de 100 cartas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="aaa-stat-label">
                Grimório Inicial (100 cartas prontas para duelos e torneios)
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                  gap: '6px',
                }}
              >
                {MONOCHROMATIC_STARTER_DECKS.map((deck) => {
                  const dom = deck.domains[0] ?? 'red';
                  const active = selectedStarterTemplateId === deck.id;
                  return (
                    <button
                      key={deck.id}
                      type="button"
                      onClick={() => {
                        setSelectedStarterTemplateId(deck.id);
                        if (!hasCustomAvatarPick && deck.coverCardId) {
                          setNewAvatarId(deck.coverCardId);
                        }
                      }}
                      style={{
                        padding: '7px 4px',
                        borderRadius: '6px',
                        border: active
                          ? '1px solid rgba(212, 175, 55, 0.75)'
                          : '1px solid rgba(148, 163, 184, 0.16)',
                        background: active ? 'rgba(212, 175, 55, 0.14)' : 'rgba(15, 23, 42, 0.6)',
                        color: active ? '#fde68a' : '#cbd5e1',
                        fontSize: '0.76rem',
                        fontWeight: active ? 700 : 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {STARTER_DOMAIN_SHORT_LABELS[dom] ?? dom}
                    </button>
                  );
                })}
              </div>
              {(() => {
                const chosen =
                  MONOCHROMATIC_STARTER_DECKS.find((d) => d.id === selectedStarterTemplateId) ??
                  MONOCHROMATIC_STARTER_DECKS[0];
                return chosen ? (
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                    {chosen.name} — 100 cartas desbloqueadas na sua coleção
                  </div>
                ) : null;
              })()}
            </div>

            {/* Revelação Progressiva para personalização opcional de Avatar */}
            <details
              style={{
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.14)',
                background: 'rgba(15, 23, 42, 0.45)',
                padding: '0.45rem 0.7rem',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  fontSize: '0.76rem',
                  color: '#cbd5e1',
                  fontWeight: 600,
                  userSelect: 'none',
                }}
              >
                Personalizar avatar e título honorífico (opcional)
              </summary>
              <div style={{ marginTop: '0.6rem' }}>
                <AvatarCreaturePicker
                  selectedCardId={newAvatarId}
                  onSelectCardId={(cid) => {
                    setHasCustomAvatarPick(true);
                    setNewAvatarId(cid);
                  }}
                />
              </div>
            </details>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.65rem',
                marginTop: '0.2rem',
              }}
            >
              <button type="button" className="aaa-btn aaa-btn-ghost" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="aaa-btn aaa-btn-primary">
                Criar Conta e Entrar
              </button>
            </div>
          </form>
        )}

        {tab === 'replays' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            {personalReplays.length === 0 ? (
              <div
                style={{
                  padding: '1.35rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  textAlign: 'center',
                  color: '#94a3b8',
                  fontSize: '0.84rem',
                }}
              >
                Suas últimas batalhas completas aparecerão automaticamente aqui para rever na mesa ou gravar em Modo Cinema.
              </div>
            ) : (
              <div
                style={{
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  overflow: 'hidden',
                }}
              >
                {personalReplays.map((item, idx) => {
                  const oppCard = CARDS_BY_ID[item.opponentAvatarCardId];
                  const resultLabel =
                    item.didWin === true
                      ? 'Vitória'
                      : item.didWin === false
                      ? 'Derrota'
                      : 'Empate';
                  const resultColor =
                    item.didWin === true
                      ? '#34d399'
                      : item.didWin === false
                      ? '#94a3b8'
                      : '#fbbf24';
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        padding: '0.6rem 0.85rem',
                        borderBottom:
                          idx < personalReplays.length - 1
                            ? '1px solid rgba(148, 163, 184, 0.12)'
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            background: '#0b0f19',
                            border: '1px solid rgba(148, 163, 184, 0.22)',
                            flexShrink: 0,
                          }}
                        >
                          {oppCard?.imagePath ? (
                            <img
                              src={oppCard.imagePath}
                              alt={item.opponentName}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : null}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              fontSize: '0.84rem',
                              fontWeight: 700,
                              color: '#f1f5f9',
                            }}
                          >
                            <span
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              vs {item.opponentName}
                            </span>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: resultColor,
                                flexShrink: 0,
                              }}
                            >
                              {resultLabel}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '0.71rem',
                              color: '#94a3b8',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.modeLabel.replace('Arena de Combate', 'Arena')} · T{item.turns} ({item.finalPlayerHp}–{item.finalOpponentHp})
                          </div>
                        </div>
                      </div>

                      {onLaunchPersonalReplay && (
                        <button
                          type="button"
                          className="aaa-btn aaa-btn-secondary"
                          style={{
                            padding: '4px 12px',
                            fontSize: '0.75rem',
                            flexShrink: 0,
                          }}
                          onClick={() => {
                            onClose();
                            onLaunchPersonalReplay(item);
                          }}
                        >
                          Rever
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PWA App Install + Portable Save Codex (PC <-> Smartphone Sync) */}
        <div className="portable-codex-panel">
          <div className="portable-codex-top">
            <div>
              <div className="portable-codex-kicker">
                Aplicativo & Sincronia Portátil (PC / Smartphone)
              </div>
              <div className="portable-codex-sub">
                {pwaState.isStandalone
                  ? 'Executando como aplicativo instalado em tela cheia.'
                  : 'Transfira Ouro, coleção, Campanha, Conquista e Crisol entre dispositivos ou instale o aplicativo.'}
              </div>
            </div>

            <div className="portable-codex-actions">
              {pwaState.shouldPromoteInstall && (
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary"
                  onClick={async () => {
                    if (pwaState.canInstall) {
                      const res = await triggerPwaInstallPrompt();
                      if (res === 'unavailable' && onOpenPwaInstall) {
                        onClose();
                        onOpenPwaInstall();
                      }
                    } else if (onOpenPwaInstall) {
                      onClose();
                      onOpenPwaInstall();
                    }
                  }}
                >
                  Instalar App
                </button>
              )}
              {!isUnregistered && (
                <>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary"
                    onClick={handleCopyPortableSave}
                    title="Copia o código completo de backup desta conta e campanhas locais"
                  >
                    Copiar Save
                  </button>
                  <button
                    type="button"
                    className="aaa-btn aaa-btn-secondary"
                    onClick={() => {
                      downloadSovereignSaveFile(currentUser);
                      setPortableFeedback({
                        kind: 'ok',
                        text: 'Arquivo .cpsave.txt baixado com sucesso.',
                      });
                    }}
                    title="Baixa um arquivo .cpsave.txt para guardar ou enviar ao celular"
                  >
                    Baixar .cpsave
                  </button>
                </>
              )}
              <button
                type="button"
                className="aaa-btn aaa-btn-ghost"
                onClick={() => setShowPortableRestore((v) => !v)}
              >
                {showPortableRestore ? 'Fechar Restauração' : 'Importar Save'}
              </button>
            </div>
          </div>

          {showPortableRestore && (
            <div className="portable-codex-restore-box">
              <input
                type="text"
                className="myth-search-compact"
                placeholder="Cole aqui seu código CPSAVE1-..."
                value={portableCodeInput}
                onChange={(e) => setPortableCodeInput(e.target.value)}
              />
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                onClick={() => handleRestorePortableSave(portableCodeInput)}
              >
                Restaurar Código
              </button>
              <label className="aaa-btn aaa-btn-secondary portable-file-label">
                Abrir .cpsave
                <input
                  type="file"
                  accept=".txt,.cpsave,.json"
                  style={{ display: 'none' }}
                  onChange={handleUploadSaveFile}
                />
              </label>
            </div>
          )}

          {portableFeedback && (
            <div className={`portable-codex-msg is-${portableFeedback.kind}`}>
              {portableFeedback.text}
            </div>
          )}
        </div>

        {onOpenAdminPanel && !isAdminProfile(currentUser) && (
          <div className="account-admin-footer-row">
            <button
              type="button"
              className="account-admin-footer-link"
              onClick={() => {
                onClose();
                onOpenAdminPanel();
              }}
              title="Acessar Painel Administrativo"
            >
              Painel Administrativo
            </button>
          </div>
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
  onOpenGlobalLeaderboard?: () => void;
  onChallengeMatchedSovereign?: (playerDeckIds: string[], playerDeckId: string) => void;
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
  onOpenGlobalLeaderboard,
  onChallengeMatchedSovereign,
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
  const [isSearchingQueue, setIsSearchingQueue] = useState<boolean>(false);
  const [queueElapsedSec, setQueueElapsedSec] = useState<number>(0);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  useEffect(() => {
    setAccountsRoster(getSavedAccountsRoster());
    if (customDecks.length > 0 && !customDecks.some((d) => d.id === selectedDeckId)) {
      setSelectedDeckId(customDecks[0].id);
    } else if (currentUser.preferredDeckId) {
      setSelectedDeckId(currentUser.preferredDeckId);
    }
  }, [currentUser, customDecks, selectedDeckId]);

  useEffect(() => {
    if (!hostedRoomCode || !isSearchingQueue) {
      setQueueElapsedSec(0);
      return;
    }
    const timer = window.setInterval(() => {
      setQueueElapsedSec((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [hostedRoomCode, isSearchingQueue]);

  const allAvailableDecks = useMemo(
    () =>
      customDecks.length > 0
        ? customDecks.map((cd) => ({
            id: cd.id,
            name: cd.name,
            subtitle: 'Grimório Autoral (100 Cartas)',
            coverCardId: cd.cardIds[0] ?? 'neutral_10_valkyra_pentacromatica',
            cardIds: cd.cardIds,
          }))
        : isGuest
        ? MONOCHROMATIC_STARTER_DECKS.map((d) => ({
            id: d.id,
            name: d.name,
            subtitle: d.subtitle,
            coverCardId: d.coverCardId,
            cardIds: d.cardIds,
          }))
        : [],
    [customDecks, isGuest]
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
          setIsSearchingQueue(false);
          playSfx('ascend');
          onStartOnlineMatch(r, 'host');
        }
      }
    });
    return () => unsub();
  }, [currentUser.id, currentUser.username, hostedRoomCode, onStartOnlineMatch]);

  // Keep hosted waiting room alive & automatically remove it if host closes tab while waiting
  useEffect(() => {
    if (!hostedRoomCode) return;

    const interval = window.setInterval(() => {
      publishMpMessage({
        type: 'HEARTBEAT_PING',
        roomCode: hostedRoomCode,
        role: 'host',
        actorId: currentUser.id,
        timestamp: Date.now(),
      });
    }, 15000);

    const handleTabCloseWhileWaiting = () => {
      const currentRoom = getRoomByCode(hostedRoomCode);
      if (!currentRoom || currentRoom.status === 'waiting') {
        publishMpMessage({ type: 'ROOM_REMOVE', roomCode: hostedRoomCode });
      }
    };

    window.addEventListener('beforeunload', handleTabCloseWhileWaiting);
    window.addEventListener('pagehide', handleTabCloseWhileWaiting);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('beforeunload', handleTabCloseWhileWaiting);
      window.removeEventListener('pagehide', handleTabCloseWhileWaiting);
    };
  }, [hostedRoomCode, currentUser.id]);

  const handleSwitchAccount = (acc: SovereignUserProfile) => {
    setActiveTabUserProfile(acc);
    onUserChange(acc);
    setSelectedDeckId(acc.preferredDeckId || MONOCHROMATIC_STARTER_DECKS[0]?.id || '');
    playSfx('channel');
    setStatusBanner(`Sessão alterada para ${acc.username} (${acc.eloRating} ELO).`);
    if (!acc.customDecks || acc.customDecks.length === 0) {
      onRequireDeckSetup?.();
    }
  };

  const handleCreateRoom = (isPublicQueue: boolean) => {
    if (isUnregisteredProfile(currentUser)) {
      setStatusBanner('Crie ou entre na sua conta antes de iniciar um duelo 1×1.');
      onOpenAccountModal('create');
      return;
    }
    if (needsDeckSetup) {
      setStatusBanner('Monte e salve seu Grimório de 100 cartas antes de duelar.');
      onRequireDeckSetup?.();
      return;
    }
    if (!selectedDeckObj) return;
    if (hostedRoomCode) {
      publishMpMessage({ type: 'ROOM_REMOVE', roomCode: hostedRoomCode });
    }
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
    setIsSearchingQueue(isPublicQueue);
    publishMpMessage({ type: 'ROOM_UPSERT', room });
    playSfx('summon');
    if (!isPublicQueue) {
      setStatusBanner(`Sala privada ${code} criada. Envie o código ao seu oponente.`);
    }
  };

  const handleJoinRoom = (room: MultiplayerRoom) => {
    if (isUnregisteredProfile(currentUser)) {
      setStatusBanner('Crie ou entre na sua conta antes de aceitar um duelo 1×1.');
      onOpenAccountModal('create');
      return;
    }
    if (needsDeckSetup) {
      setStatusBanner('Monte e salve seu Grimório de 100 cartas antes de duelar.');
      onRequireDeckSetup?.();
      return;
    }
    if (!selectedDeckObj) return;

    if (room.host.id === currentUser.id || room.host.username === currentUser.username) {
      setStatusBanner(
        'Para testar contra si mesmo em outra aba, selecione ou crie uma segunda conta.'
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
      aiTitle: `${getAvatarHonorificTitle(activeGuest.avatarCardId)} (${activeGuest.eloRating} ELO)`,
      aiAvatarCardId: activeGuest.avatarCardId,
    });
    canonicalState.player.title = `${getAvatarHonorificTitle(room.host.avatarCardId)} (${room.host.eloRating} ELO)`;
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
    setIsSearchingQueue(false);
    playSfx('ascend');
    onStartOnlineMatch(updatedRoom, 'guest');
  };

  const handleQuickMatchmaking = () => {
    const myElo = currentUser.eloRating ?? INITIAL_PLAYER_ELO;
    const candidates = rooms
      .filter((r) => r.status === 'waiting' && r.isPublicQueue && r.host.id !== currentUser.id)
      .sort(
        (a, b) =>
          Math.abs((a.host.eloRating ?? INITIAL_PLAYER_ELO) - myElo) -
          Math.abs((b.host.eloRating ?? INITIAL_PLAYER_ELO) - myElo)
      );
    if (candidates.length > 0) {
      handleJoinRoom(candidates[0]);
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
      setStatusBanner(`Sala "${clean}" não encontrada.`);
      return;
    }
    handleJoinRoom(found);
  };

  const handleCancelHostedRoom = () => {
    if (hostedRoomCode) {
      publishMpMessage({ type: 'ROOM_REMOVE', roomCode: hostedRoomCode });
    }
    setHostedRoomCode(null);
    setIsSearchingQueue(false);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const avatarCard = CARDS_BY_ID[currentUser.avatarCardId] ?? ALL_CARDS[0];
  const currentHonorific = getAvatarHonorificTitle(currentUser.avatarCardId);
  const waitingRooms = rooms.filter((r) => r.status === 'waiting');

  return (
    <div
      className="aaa-page-shell"
      style={{ maxWidth: '1040px', margin: '0 auto', padding: '1.1rem 1rem 3rem' }}
    >
      {/* 1. CLEAN MINIMAL HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          marginBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h1
            className="font-cinzel"
            style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}
          >
            Salas 1×1
          </h1>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Duelos diretos entre jogadores valendo ELO
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
          {onOpenGlobalLeaderboard && (
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary"
              style={{ padding: '6px 11px', fontSize: '0.75rem' }}
              onClick={onOpenGlobalLeaderboard}
            >
              Ranking Geral
            </button>
          )}
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            style={{ padding: '6px 11px', fontSize: '0.75rem' }}
            onClick={() => setRooms(getActiveRoomsList())}
          >
            Atualizar
          </button>
        </div>
      </header>

      {statusBanner && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.9rem',
            marginBottom: '0.8rem',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.78)',
            border: '1px solid rgba(148, 163, 184, 0.22)',
            fontSize: '0.78rem',
            color: '#e2e8f0',
          }}
        >
          <span>{statusBanner}</span>
          <button
            type="button"
            className="aaa-btn aaa-btn-ghost"
            style={{ padding: '2px 7px', fontSize: '0.7rem' }}
            onClick={() => setStatusBanner(null)}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. COMPACT SINGLE-LINE PROFILE & DECK BAR */}
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          padding: '0.75rem 1rem',
          marginBottom: '0.9rem',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.58)',
          border: '1px solid rgba(148, 163, 184, 0.16)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: '210px' }}>
          <button
            type="button"
            onClick={() => onOpenAccountModal('profile')}
            title="Editar perfil e avatar"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              border: '1.5px solid rgba(234, 179, 8, 0.65)',
              background: '#0f172a',
              overflow: 'hidden',
              padding: 0,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {avatarCard?.imagePath && (
              <img
                src={`${avatarCard.imagePath}?v=12`}
                alt={currentUser.username}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
                {currentUser.username}
              </span>
              <span
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#eab308',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {currentUser.eloRating} ELO
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '1px' }}>
              {currentHonorific} · {currentUser.pvpWins}V {currentUser.pvpLosses}D
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label
            htmlFor="pvp-deck-select"
            style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}
          >
            Grimório:
          </label>
          <select
            id="pvp-deck-select"
            value={selectedDeckId}
            onChange={(e) => {
              setSelectedDeckId(e.target.value);
              const nextProfile = { ...currentUser, preferredDeckId: e.target.value };
              setActiveTabUserProfile(nextProfile);
              onUserChange(nextProfile);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '7px',
              background: '#0b0f19',
              border: '1px solid rgba(148, 163, 184, 0.24)',
              color: '#e2e8f0',
              fontSize: '0.78rem',
              maxWidth: '220px',
            }}
          >
            {allAvailableDecks.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            style={{ padding: '6px 11px', fontSize: '0.75rem' }}
            onClick={() => onOpenAccountModal('profile')}
          >
            Perfil
          </button>
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            style={{ padding: '6px 11px', fontSize: '0.75rem' }}
            onClick={() => onOpenAccountModal('login')}
          >
            Trocar Conta
          </button>
        </div>
      </section>

      {accountsRoster.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
            marginBottom: '0.85rem',
          }}
        >
          {accountsRoster.map((acc) => {
            const isCurrent = acc.id === currentUser.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSwitchAccount(acc)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: isCurrent ? 'rgba(234, 179, 8, 0.14)' : 'rgba(15, 23, 42, 0.55)',
                  border: isCurrent
                    ? '1px solid rgba(234, 179, 8, 0.45)'
                    : '1px solid rgba(148, 163, 184, 0.16)',
                  color: isCurrent ? '#fef08a' : '#94a3b8',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                }}
              >
                {acc.username} ({acc.eloRating})
              </button>
            );
          })}
        </div>
      )}

      {/* 3. 1-CLICK QUICK MATCH QUEUE & PRIVATE ROOM CONTROLS */}
      <section
        style={{
          padding: '0.95rem 1.05rem',
          marginBottom: '0.95rem',
          borderRadius: '10px',
          background: 'rgba(15, 23, 42, 0.58)',
          border: '1px solid rgba(148, 163, 184, 0.16)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {!hostedRoomCode ? (
              <button
                type="button"
                className="aaa-btn aaa-btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
                onClick={handleQuickMatchmaking}
              >
                Buscar Oponente 1×1
              </button>
            ) : (
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                onClick={handleCancelHostedRoom}
              >
                Sair da Fila ({formatTimer(queueElapsedSec)})
              </button>
            )}

            <button
              type="button"
              className="aaa-btn aaa-btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.78rem' }}
              onClick={() => handleCreateRoom(false)}
            >
              Criar Sala Privada
            </button>
          </div>

          <form
            onSubmit={handleJoinByCode}
            style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="Código da sala (ex: PACT-4829)"
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
              style={{
                padding: '7px 10px',
                borderRadius: '7px',
                background: '#0b0f19',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                color: '#f8fafc',
                fontSize: '0.76rem',
                letterSpacing: '0.04em',
                width: '205px',
              }}
            />
            <button
              type="submit"
              className="aaa-btn aaa-btn-secondary"
              style={{ padding: '7px 12px', fontSize: '0.76rem' }}
            >
              Entrar
            </button>
          </form>
        </div>

        {/* Active Queue / Hosted Room Status Strip */}
        {hostedRoomCode && (
          <div
            style={{
              marginTop: '0.8rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(148, 163, 184, 0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.65rem',
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
              {isSearchingQueue ? (
                <>
                  Procurando jogador online há{' '}
                  <strong style={{ color: '#f8fafc', fontVariantNumeric: 'tabular-nums' }}>
                    {formatTimer(queueElapsedSec)}
                  </strong>{' '}
                  · Código direto: <strong style={{ color: '#eab308' }}>{hostedRoomCode}</strong>
                </>
              ) : (
                <>
                  Sala privada aberta: <strong style={{ color: '#eab308' }}>{hostedRoomCode}</strong>{' '}
                  · Aguardando convidado
                </>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
              {isSearchingQueue && onChallengeMatchedSovereign && selectedDeckObj && (
                <button
                  type="button"
                  className="aaa-btn aaa-btn-primary"
                  style={{ padding: '5px 12px', fontSize: '0.74rem' }}
                  onClick={() => {
                    const deckIds = selectedDeckObj.cardIds;
                    const deckId = selectedDeckObj.id;
                    handleCancelHostedRoom();
                    onChallengeMatchedSovereign(deckIds, deckId);
                  }}
                >
                  Desafiar Soberano de mesmo ELO agora
                </button>
              )}
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '5px 11px', fontSize: '0.74rem' }}
                onClick={() => {
                  navigator.clipboard?.writeText(hostedRoomCode);
                  setStatusBanner(`Código ${hostedRoomCode} copiado para a área de transferência.`);
                }}
              >
                Copiar código
              </button>
              <button
                type="button"
                className="aaa-btn aaa-btn-secondary"
                style={{ padding: '5px 11px', fontSize: '0.74rem' }}
                onClick={handleCancelHostedRoom}
              >
                Encerrar sala
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. SINGLE CLEAN TABLE SURFACE FOR OPEN ROOMS */}
      <section
        aria-label="Salas abertas"
        style={{
          borderRadius: '10px',
          background: 'rgba(11, 15, 25, 0.78)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.6rem 1rem',
            borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#64748b',
          }}
        >
          <span>Salas Abertas ({waitingRooms.length})</span>
          <span>Ação</span>
        </div>

        {waitingRooms.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '0.82rem',
            }}
          >
            Nenhuma sala aguardando desafiante no momento. Clique em{' '}
            <strong style={{ color: '#cbd5e1' }}>Buscar Oponente 1×1</strong> acima para iniciar.
          </div>
        ) : (
          <div>
            {waitingRooms.map((room, idx) => {
              const hostAvatar = CARDS_BY_ID[room.host.avatarCardId] ?? ALL_CARDS[0];
              const isOwnRoom = room.host.id === currentUser.id;
              return (
                <div
                  key={room.code}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.65rem 1rem',
                    borderBottom:
                      idx < waitingRooms.length - 1
                        ? '1px solid rgba(148, 163, 184, 0.08)'
                        : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                    {hostAvatar.imagePath && (
                      <img
                        src={`${hostAvatar.imagePath}?v=12`}
                        alt={room.host.username}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          border: '1px solid rgba(148, 163, 184, 0.28)',
                          background: '#0f172a',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: '#f1f5f9',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {room.host.username}{' '}
                        <span style={{ color: '#eab308', fontVariantNumeric: 'tabular-nums' }}>
                          ({room.host.eloRating} ELO)
                        </span>
                      </div>
                      <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '1px' }}>
                        {room.isPublicQueue ? 'Fila rápida 1×1' : 'Sala privada'} · Código {room.code}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={isOwnRoom ? 'aaa-btn aaa-btn-secondary' : 'aaa-btn aaa-btn-primary'}
                    style={{ padding: '6px 13px', fontSize: '0.75rem', flexShrink: 0 }}
                    onClick={() => handleJoinRoom(room)}
                  >
                    {isOwnRoom ? 'Testar em 2ª conta' : 'Aceitar duelo'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
