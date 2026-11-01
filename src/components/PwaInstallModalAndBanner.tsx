import React, { useEffect, useState } from 'react';
import {
  applyPwaUpdate,
  PwaInstallState,
  PwaPlatformKind,
  snoozePwaBanner,
  triggerPwaInstallPrompt,
} from '../utils/pwaInstall';

interface PwaInstallBannerProps {
  pwaState: PwaInstallState;
  onOpenGuideModal: () => void;
  onInstalled?: () => void;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  pwaState,
  onOpenGuideModal,
  onInstalled,
}) => {
  const [installing, setInstalling] = useState(false);

  const showUpdate = pwaState.updateAvailable;
  const showInstall = pwaState.shouldPromoteInstall && !pwaState.isBannerSnoozed;

  if (!showUpdate && !showInstall) return null;

  const handleInstallClick = async () => {
    if (pwaState.canInstall) {
      setInstalling(true);
      const outcome = await triggerPwaInstallPrompt();
      setInstalling(false);
      if (outcome === 'accepted') {
        onInstalled?.();
        return;
      }
      if (outcome === 'unavailable') {
        onOpenGuideModal();
      }
    } else {
      onOpenGuideModal();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        marginBottom: 10,
      }}
    >
      {showUpdate && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            padding: '10px 16px',
            borderRadius: 12,
            background:
              'linear-gradient(135deg, rgba(6, 78, 59, 0.88) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(52, 211, 153, 0.55)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220, flex: 1 }}>
            <span style={{ fontSize: '1.25rem' }}>✨</span>
            <div>
              <div
                className="font-cinzel"
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: '#6ee7b7',
                }}
              >
                NOVA VERSÃO DE VAELORIA PRONTA
              </div>
              <div style={{ fontSize: '0.78rem', color: '#e2e8f0', opacity: 0.92 }}>
                Uma atualização com os ajustes mais recentes de cartas, Campeões IA e modos já foi
                baixada em segundo plano.
              </div>
            </div>
          </div>

          <button
            type="button"
            className="aaa-btn aaa-btn-primary"
            style={{
              padding: '7px 14px',
              fontSize: '0.76rem',
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
            onClick={() => applyPwaUpdate()}
          >
            🔄 Atualizar Jogo Agora
          </button>
        </div>
      )}

      {showInstall && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            padding: '10px 16px',
            borderRadius: 12,
            background:
              'linear-gradient(135deg, rgba(30, 22, 8, 0.94) 0%, rgba(13, 18, 32, 0.96) 65%, rgba(28, 19, 46, 0.92) 100%)',
            border: '1px solid rgba(234, 179, 8, 0.52)',
            boxShadow: '0 10px 28px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(254, 240, 138, 0.16)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 240, flex: 1 }}>
            <img
              src="/icons/icon-192.png"
              alt="Chromatic Pact App"
              width={40}
              height={40}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                flexShrink: 0,
                boxShadow: '0 0 14px rgba(234, 179, 8, 0.35)',
              }}
            />
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <span
                  className="font-cinzel"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    color: '#fde047',
                  }}
                >
                  📲 JOGUE NO APLICATIVO OFICIAL (PWA EM TELA CHEIA)
                </span>
                <span
                  style={{
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: 999,
                    background: 'rgba(234, 179, 8, 0.18)',
                    border: '1px solid rgba(234, 179, 8, 0.42)',
                    color: '#fef08a',
                  }}
                >
                  LEVE • SEM LOJA • 100% GRÁTIS
                </span>
              </div>
              <div style={{ fontSize: '0.77rem', color: '#cbd5e1', marginTop: 2 }}>
                Instale o <strong>Chromatic Pact</strong> na sua Tela Inicial ou Área de Trabalho
                para ganhar <strong>100% de tela útil sem barras do navegador</strong>, carregamento
                instantâneo de artes e atalho direto.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="aaa-btn aaa-btn-primary"
              disabled={installing}
              style={{
                padding: '8px 15px',
                fontSize: '0.77rem',
                fontWeight: 800,
                whiteSpace: 'nowrap',
              }}
              onClick={handleInstallClick}
            >
              {installing
                ? '⏳ Abrindo instalador...'
                : pwaState.canInstall
                ? '📲 Instalar App (1 Clique)'
                : '📲 Instalar App'}
            </button>
            <button
              type="button"
              className="aaa-btn aaa-btn-secondary"
              style={{
                padding: '7px 11px',
                fontSize: '0.73rem',
                opacity: 0.86,
              }}
              onClick={() => snoozePwaBanner(18)}
              title="Ocultar lembrete por hoje (o botão 📲 App continuará disponível no topo)"
            >
              Lembrar amanhã
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface PwaInstallGuideModalProps {
  open: boolean;
  pwaState: PwaInstallState;
  onClose: () => void;
  onInstalled?: () => void;
}

export const PwaInstallGuideModal: React.FC<PwaInstallGuideModalProps> = ({
  open,
  pwaState,
  onClose,
  onInstalled,
}) => {
  const [selectedTab, setSelectedTab] = useState<PwaPlatformKind>(pwaState.platform);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedTab(pwaState.platform);
    }
  }, [open, pwaState.platform]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleNativeInstall = async () => {
    setInstalling(true);
    const outcome = await triggerPwaInstallPrompt();
    setInstalling(false);
    if (outcome === 'accepted') {
      onInstalled?.();
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Instalar Aplicativo Chromatic Pact"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9600,
        background: 'rgba(3, 6, 14, 0.84)',
        backdropFilter: 'blur(7px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 16,
          background:
            'linear-gradient(165deg, rgba(17, 24, 39, 0.98) 0%, rgba(7, 10, 18, 0.99) 100%)',
          border: '1px solid rgba(234, 179, 8, 0.55)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.82)',
          padding: '20px 22px',
          color: '#f8fafc',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingBottom: 14,
            borderBottom: '1px solid rgba(234, 179, 8, 0.22)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/icons/icon-192.png"
              alt="Chromatic Pact"
              width={48}
              height={48}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                boxShadow: '0 0 18px rgba(234, 179, 8, 0.4)',
              }}
            />
            <div>
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.09em',
                  color: '#facc15',
                }}
              >
                APLICATIVO OFICIAL • TELA CHEIA NATIVA
              </div>
              <h3
                className="font-cinzel"
                style={{ margin: '2px 0 0', fontSize: '1.12rem', color: '#fef9c3' }}
              >
                Instalar Chromatic Pact
              </h3>
            </div>
          </div>

          <button
            type="button"
            className="nav-notif-mini-btn"
            onClick={onClose}
            style={{ fontSize: '0.9rem', padding: '4px 10px' }}
          >
            ✕
          </button>
        </div>

        {/* Benefits Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 8,
            marginTop: 14,
          }}
        >
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(30, 41, 59, 0.52)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fde047' }}>
              🖥️ 100% Tela Cheia
            </div>
            <div style={{ fontSize: '0.73rem', color: '#cbd5e1', marginTop: 3 }}>
              Sem barras de endereço ou abas ocupando espaço na Arena e nos Mapas.
            </div>
          </div>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(30, 41, 59, 0.52)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8' }}>
              ⚡ Cache Instantâneo
            </div>
            <div style={{ fontSize: '0.73rem', color: '#cbd5e1', marginTop: 3 }}>
              Artes das 1.038 cartas e tabuleiros abrem imediatamente e atualizam sozinhos.
            </div>
          </div>
          <div
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              background: 'rgba(30, 41, 59, 0.52)',
              border: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#4ade80' }}>
              👑 Save Intacto
            </div>
            <div style={{ fontSize: '0.73rem', color: '#cbd5e1', marginTop: 3 }}>
              Sua conta, Ouro, Grimórios e Campanha continuam sincronizados automaticamente.
            </div>
          </div>
        </div>

        {/* Direct 1-click native button when available */}
        {pwaState.canInstall && (
          <div
            style={{
              marginTop: 14,
              padding: '12px 14px',
              borderRadius: 12,
              background: 'rgba(234, 179, 8, 0.14)',
              border: '1px solid rgba(234, 179, 8, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#fef08a', fontWeight: 700 }}>
              ✨ Instalação direta disponível neste navegador!
            </div>
            <button
              type="button"
              className="aaa-btn aaa-btn-primary"
              disabled={installing}
              onClick={handleNativeInstall}
              style={{ fontWeight: 800, padding: '8px 16px' }}
            >
              {installing ? '⏳ Confirmando...' : '📲 Instalar em 1 Clique Agora'}
            </button>
          </div>
        )}

        {/* Device Tabs for Manual / Universal Installation */}
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              color: '#94a3b8',
              marginBottom: 8,
            }}
          >
            PASSO A PASSO RÁPIDO (10 SEGUNDOS):
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {(
              [
                { id: 'android', label: '🤖 Android (Chrome)' },
                { id: 'ios', label: '🍎 iPhone / iPad (Safari)' },
                { id: 'desktop', label: '💻 PC / Mac (Chrome / Edge)' },
              ] as const
            ).map((tab) => {
              const active = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedTab(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: active ? 'rgba(234, 179, 8, 0.24)' : 'rgba(15, 23, 42, 0.8)',
                    border: active
                      ? '1px solid rgba(250, 204, 21, 0.75)'
                      : '1px solid rgba(148, 163, 184, 0.25)',
                    color: active ? '#fef08a' : '#cbd5e1',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {selectedTab === 'android' && (
            <ol
              style={{
                margin: 0,
                padding: '12px 16px 12px 32px',
                borderRadius: 12,
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                fontSize: '0.82rem',
                lineHeight: 1.65,
                color: '#e2e8f0',
              }}
            >
              <li>
                Toque no menu <strong>⋮ (três pontos)</strong> no canto superior direito do Chrome
                (ou Samsung Internet).
              </li>
              <li>
                Selecione <strong>&ldquo;Instalar aplicativo&rdquo;</strong> ou{' '}
                <strong>&ldquo;Adicionar à tela inicial&rdquo;</strong>.
              </li>
              <li>
                Confirme em <strong>Instalar</strong> — o ícone dourado do{' '}
                <strong>Chromatic Pact</strong> aparecerá junto aos seus apps!
              </li>
            </ol>
          )}

          {selectedTab === 'ios' && (
            <ol
              style={{
                margin: 0,
                padding: '12px 16px 12px 32px',
                borderRadius: 12,
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                fontSize: '0.82rem',
                lineHeight: 1.65,
                color: '#e2e8f0',
              }}
            >
              <li>
                No <strong>Safari</strong> (ou Chrome no iOS), toque no botão{' '}
                <strong>Compartilhar (ícone ⬆️ quadrado com seta para cima)</strong> na barra
                inferior ou superior.
              </li>
              <li>
                Role a lista e toque em <strong>&ldquo;Adicionar à Tela de Início&rdquo;</strong>.
              </li>
              <li>
                Toque em <strong>Adicionar</strong> no canto superior direito para jogar em{' '}
                <strong>Tela Cheia</strong>!
              </li>
            </ol>
          )}

          {selectedTab === 'desktop' && (
            <ol
              style={{
                margin: 0,
                padding: '12px 16px 12px 32px',
                borderRadius: 12,
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                fontSize: '0.82rem',
                lineHeight: 1.65,
                color: '#e2e8f0',
              }}
            >
              <li>
                No <strong>Chrome, Edge ou Brave</strong>, clique no ícone de{' '}
                <strong>Instalar Chromatic Pact (🖥️ com seta para baixo)</strong> no lado direito da
                barra de endereços.
              </li>
              <li>
                Ou abra o menu <strong>⋮ / ⋯</strong> do navegador e clique em{' '}
                <strong>
                  &ldquo;Salvar e compartilhar → Instalar Chromatic Pact como aplicativo&rdquo;
                </strong>
                .
              </li>
              <li>
                O jogo abrirá em <strong>janela dedicada sem barras</strong> e poderá ser fixado na
                Barra de Tarefas!
              </li>
            </ol>
          )}
        </div>

        <div
          style={{
            marginTop: 16,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
          }}
        >
          <button
            type="button"
            className="aaa-btn aaa-btn-secondary"
            onClick={onClose}
            style={{ padding: '7px 16px', fontSize: '0.78rem' }}
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
