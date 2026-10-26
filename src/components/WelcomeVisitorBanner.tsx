import React from 'react';

export interface WelcomeVisitorBannerProps {
  onQuickPlayArena: () => void;
  onOpenCreateAccount: () => void;
  onOpenCampaign: () => void;
}

export const WelcomeVisitorBanner: React.FC<WelcomeVisitorBannerProps> = ({
  onQuickPlayArena,
  onOpenCreateAccount,
  onOpenCampaign,
}) => {
  return (
    <div
      className="welcome-visitor-banner"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '1.15rem 1.35rem',
        borderRadius: '12px',
        background:
          'linear-gradient(135deg, rgba(30, 18, 52, 0.94) 0%, rgba(15, 23, 42, 0.96) 55%, rgba(69, 26, 3, 0.88) 100%)',
        border: '1.5px solid rgba(250, 204, 21, 0.58)',
        boxShadow:
          '0 12px 32px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(254, 240, 138, 0.28), 0 0 24px rgba(212, 175, 55, 0.16)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}
    >
      {/* Top Badge / Kicker */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: 'rgba(250, 204, 21, 0.18)',
            border: '1px solid rgba(250, 204, 21, 0.55)',
            color: '#fef08a',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}
        >
          🎁 BÔNUS DE BOAS-VINDAS • ACESSO IMEDIATO NO NAVEGADOR
        </span>
        <span
          style={{
            fontSize: '0.72rem',
            color: '#cbd5e1',
            fontWeight: 600,
          }}
        >
          ⚡ Sem download • 100% Gratuito
        </span>
      </div>

      {/* Main Headline & Copy */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <h2
          className="font-cinzel gold-gradient-text welcome-visitor-title"
          style={{
            fontSize: 'clamp(1.08rem, 2.2vw, 1.38rem)',
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          Comece a Jogar Agora ou Resgate +160 Ouro Grátis (2 Pacotes no Relicário)
        </h2>
        <p
          className="welcome-visitor-desc"
          style={{
            margin: 0,
            fontSize: '0.84rem',
            color: '#e2e8f0',
            lineHeight: 1.5,
            maxWidth: '940px',
          }}
        >
          Você pode entrar na Arena imediatamente em 1 clique sem cadastro, ou criar sua Conta Gratuita de Soberano em 10 segundos para receber +160 Ouro inicial, 1 Grimório de 100 Cartas pronto para combate e salvar suas vitórias.
        </p>
      </div>

      {/* 3 Clear Action Buttons */}
      <div
        className="welcome-visitor-cta-row"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.65rem',
          alignItems: 'center',
          marginTop: '0.15rem',
        }}
      >
        <button
          type="button"
          className="aaa-btn aaa-btn-primary"
          onClick={onQuickPlayArena}
          style={{
            padding: '0.65rem 1.15rem',
            fontSize: '0.82rem',
            fontWeight: 900,
            letterSpacing: '0.04em',
            boxShadow: '0 0 18px rgba(250, 204, 21, 0.32)',
          }}
        >
          ⚔️ JOGAR AGORA (1 CLIQUE — SEM CADASTRO)
        </button>

        <button
          type="button"
          className="aaa-btn aaa-btn-secondary"
          onClick={onOpenCreateAccount}
          style={{
            padding: '0.65rem 1.15rem',
            fontSize: '0.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.24), rgba(15, 23, 42, 0.9))',
            border: '1.5px solid #34d399',
            color: '#a7f3d0',
          }}
        >
          🎁 CRIAR CONTA GRÁTIS (+160 OURO & DECK 100 CARTAS)
        </button>

        <button
          type="button"
          className="aaa-btn aaa-btn-ghost"
          onClick={onOpenCampaign}
          style={{
            padding: '0.62rem 1rem',
            fontSize: '0.78rem',
            fontWeight: 700,
            borderColor: 'rgba(250, 204, 21, 0.35)',
            color: '#fde047',
          }}
        >
          🏰 EXPLORAR CAMPANHA SOLO
        </button>
      </div>
    </div>
  );
};
