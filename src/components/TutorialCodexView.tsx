import React, { useState } from 'react';
import { CardDefinition, Domain } from '../types/game';
import { ALL_CARDS, CARDS_BY_ID } from '../data/cards';
import { CardView, DOMAIN_META } from './CardView';

export interface TutorialCodexViewProps {
  isModal?: boolean;
  onClose?: () => void;
  onStartPracticeDuel?: () => void;
  onInspectCard?: (card: CardDefinition) => void;
}

type CodexSectionId =
  | 'walkthrough'
  | 'board_stacking'
  | 'domains'
  | 'weather_runes'
  | 'keywords'
  | 'controls';

interface WalkthroughStep {
  stepNumber: number;
  badge: string;
  title: string;
  subtitle: string;
  cardId: string;
  summary: string;
  keyPoints: { tag: string; title: string; detail: string }[];
  proTip: string;
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    stepNumber: 1,
    badge: 'FUNDAMENTOS DA PARTIDA',
    title: 'Os Soberanos & Condição de Vitória',
    subtitle: 'Reduza a Vida do Soberano rival de 40 a 0 ou esgote o grimório inimigo.',
    cardId: 'neutral_10_valkyra_pentacromatica',
    summary:
      'A partida ocorre em turnos alternados. Cada Soberano inicia com 40 pontos de Vida, 3 de Essência Máxima e 7 cartas na mão, com direito a um Mulligan inicial antes do Turno 1.',
    keyPoints: [
      {
        tag: 'RITUAL • 2 ESSÊNCIA',
        title: 'Poder do Soberano',
        detail:
          'Ativável uma vez por turno na barra inferior. Executa a habilidade assinatura do Domínio principal do seu grimório para causar dano, curar ou fortalecer aliados.',
      },
      {
        tag: 'RITUAL • 3 VIDA',
        title: 'Pacto de Sangue',
        detail:
          'Sacrifique 3 pontos de Vida uma vez por turno para receber +1 de Essência temporária imediata e acelerar uma invocação decisiva.',
      },
      {
        tag: 'PREPARAÇÃO • 30s',
        title: 'Mulligan Tático & Limite de 60s por Turno',
        detail:
          'Antes do 1º turno (30s), troque cartas pesadas da mão inicial de 7 cartas. Durante o combate, cada jogador tem 60 segundos por turno (⏱️ 60s) para agir antes que o turno passe automaticamente.',
      },
    ],
    proTip:
      'Sempre que encerrar o turno com 2 de Essência disponíveis, ative o Poder do Soberano para manter pressão constante.',
  },
  {
    stepNumber: 2,
    badge: 'ECONOMIA ELEMENTAL',
    title: 'Progressão de Essência & Afinidade',
    subtitle: 'Sua Essência cresce automaticamente a cada turno (+1 até 10) sem travar sua compra.',
    cardId: 'blue_36_tomo_infinito',
    summary:
      'No início de cada turno, sua Essência Máxima sobe em +1 (até 10), sua reserva é recarregada, sua Afinidade Elemental avança +1 e você compra 1 carta.',
    keyPoints: [
      {
        tag: 'ATALHO [C]',
        title: 'Canalizar Carta (1x por Turno)',
        detail:
          'Converta 1 carta da mão em Terreno Canalizado para ganhar +1 de Afinidade da cor dela e comprar +1 carta substituta imediatamente.',
      },
      {
        tag: 'IMPULSO EXTRA',
        title: 'Sacrificar Cartas Extras',
        detail:
          'Após canalizar, você pode descartar cartas adicionais da mão para a Cripta em troca de +1 de Essência temporária neste turno e +1 de Afinidade.',
      },
      {
        tag: 'PROGRESSÃO',
        title: 'Função da Afinidade Elemental',
        detail:
          'A Afinidade acumulada habilita cartas avançadas daquele Domínio e libera a Expansão de Domínio ao atingir o marco 6/6.',
      },
    ],
    proTip:
      'Nos três primeiros turnos, canalize uma carta de custo alto por rodada para ciclar sua mão gratuitamente e acelerar rumo ao marco 6/6.',
  },
  {
    stepNumber: 3,
    badge: 'POSICIONAMENTO TÁTICO',
    title: 'Mesa 6×4, Vanguarda & Pilhas 3x',
    subtitle: 'Seis colunas e quatro fileiras com suporte para até 3 unidades empilhadas por slot.',
    cardId: 'gold_07_dragao_ouro',
    summary:
      'O tabuleiro divide cada lado em Vanguarda (linha de frente) e Retaguarda (suporte e relíquias). O posicionamento concede bônus automáticos de combate.',
    keyPoints: [
      {
        tag: 'LINHA DE FRENTE [V]',
        title: 'Vanguarda, Invasão & Falange',
        detail:
          'Protege a coluna e o Soberano. Concede +1 ATQ de Invasão se a Vanguarda oposta estiver vazia e +1 de Armadura ao lado de um Guardião.',
      },
      {
        tag: 'SUPORTE [R]',
        title: 'Retaguarda & Cobertura',
        detail:
          'Abriga atiradores, voadores, Relíquias e Emboscadas. Enquanto houver aliado na Vanguarda da mesma coluna, recebe proteção terrestre e +1 ATQ.',
      },
      {
        tag: 'FORMAÇÃO',
        title: 'Empilhamento 3x vs. Área',
        detail:
          'Empilhe até 3 unidades atrás de um Guardião contra alvos únicos, mas espalhe suas forças em colunas separadas contra Dragões com Sopro.',
      },
    ],
    proTip:
      'Use a ação de Movimentação no seu turno para alternar unidades entre Vanguarda e Retaguarda na mesma coluna e salvar aliados feridos.',
  },
  {
    stepNumber: 4,
    badge: 'TIPOS DE CARTAS & EVOLUÇÃO',
    title: 'Invocações, Relíquias, Reações & Ascensão',
    subtitle: 'Combine criaturas, artefatos contínuos, feitiços, emboscadas e evoluções em campo.',
    cardId: 'green_40_licantropo_alfa',
    summary:
      'Durante o seu turno, você executa invocações e rituais na ordem que preferir, adaptando sua formação às ameaças visíveis no tabuleiro.',
    keyPoints: [
      {
        tag: 'PERMANENTES',
        title: 'Criaturas & Relíquias Contínuas',
        detail:
          'Criaturas combatem na Vanguarda ou Retaguarda. Relíquias são instaladas na Retaguarda e geram efeitos passivos ou de início de turno.',
      },
      {
        tag: 'TÁTICA',
        title: 'Feitiços & Emboscadas Ocultas',
        detail:
          'Feitiços têm efeito imediato. Cartas de Reação podem ser lançadas na hora ou posicionadas na Retaguarda como Emboscadas que disparam no turno rival.',
      },
      {
        tag: 'EVOLUÇÃO ★',
        title: 'Ascensão de Criatura',
        detail:
          'Unidades com a insígnia de Ascensão podem pagar seu custo de evolução em campo para assumir permanentemente uma forma superior.',
      },
    ],
    proTip:
      'Posicione Emboscadas na Retaguarda de colunas estratégicas para punir atacantes pesados do oponente no momento do golpe.',
  },
  {
    stepNumber: 5,
    badge: 'FLUXO DE COMBATE',
    title: 'Combate Direto & Prioridade de Alvos',
    subtitle: 'Ataque individualmente com precisão cirúrgica ou dispare ofensiva total.',
    cardId: 'gold_59_cavaleiro_grifo',
    summary:
      'Não há fases burocráticas: selecione qualquer unidade pronta para atacar um alvo válido na hora ou utilize o comando de ataque rápido na barra inferior.',
    keyPoints: [
      {
        tag: 'PRONTIDÃO',
        title: 'Preparação & Ímpeto',
        detail:
          'Unidades recém-invocadas entram em preparação e atacam no turno seguinte, exceto criaturas com Ímpeto, que atacam imediatamente.',
      },
      {
        tag: 'BLOQUEIO',
        title: 'Guardião, Voo & Alcance',
        detail:
          'Unidades com Guardião forçam ataques terrestres naquela coluna. Criaturas com Voo ou Alcance ignoram bloqueadores terrestres e atingem a Retaguarda.',
      },
      {
        tag: 'CONTROLE',
        title: 'Passar Turno [ESPAÇO]',
        detail:
          'Após canalizar, invocar e concluir seus ataques, encerre a rodada pelo botão da barra inferior ou pressionando a barra de espaço.',
      },
    ],
    proTip:
      'Use unidades de Alcance na Retaguarda para eliminar ameaças inimigas sem sofrer dano de contra-ataque.',
  },
  {
    stepNumber: 6,
    badge: 'EXPANSÃO DE DOMÍNIO',
    title: 'Transformação da Mesa & Choque 50/50',
    subtitle: 'Ao atingir 6/6 de Afinidade e pagar 3 de Essência, domine o campo por 3 rodadas.',
    cardId: 'purple_65_principe_mortos',
    summary:
      'A Expansão de Domínio substitui a mesa de madeira pelo santuário elemental do seu Domínio, fortalecendo suas tropas e habilitando ataques diretos.',
    keyPoints: [
      {
        tag: 'OFENSIVA TOTAL',
        title: 'Potencial 120% & Acerto Garantido',
        detail:
          'Suas unidades daquele Domínio recebem bônus de atributos, um pulso elemental por rodada e podem atacar o Soberano rival ignorando bloqueadores comuns.',
      },
      {
        tag: 'COLISÃO',
        title: 'Choque de Domínios 50/50',
        detail:
          'Se ambos os Soberanos expandirem com Afinidades iguais, o tabuleiro se divide ao meio e o Acerto Garantido de ambos é neutralizado.',
      },
      {
        tag: 'CONTRAMEDIDA',
        title: 'Domínio Simples & Quebra',
        detail:
          'Ative o Domínio Simples (2 de Essência) para anular o Acerto Garantido por 1 turno, ou cause 8+ de dano ao Soberano rival para estilhaçar o Domínio dele.',
      },
    ],
    proTip:
      'Guardar sua Expansão de Domínio para responder à Expansão inimiga permite iniciar um Choque 50/50 ou sobrepujá-la caso sua Afinidade seja maior.',
  },
  {
    stepNumber: 7,
    badge: 'CONSTRUÇÃO DE GRIMÓRIOS',
    title: 'Grimórios de 100 Cartas & Raridades',
    subtitle: 'Estrutura competitiva com limite de cópias escalonado (3× / 2× / 1×) e 890 cartas.',
    cardId: 'blue_06_dragao_azul',
    summary:
      'Os 30 Grimórios oficiais e os baralhos criados na Forja utilizam 100 cartas com regras de cópias por raridade para equilibrar consistência e variedade.',
    keyPoints: [
      {
        tag: 'PIRÂMIDE 3×/2×/1×',
        title: 'Limite por Raridade',
        detail:
          'Comuns e Incomuns permitem até 3 cópias; Raras permitem até 2 cópias; Lendárias são limitadas a 1 cópia única (máximo de 10 Lendárias por grimório).',
      },
      {
        tag: 'IDENTIDADE',
        title: 'Assimetria dos 5 Domínios',
        detail:
          'Cada Domínio possui proporções próprias: Verde foca em criaturas, Azul em magias e reações, Dourado em relíquias, Vermelho em agressão e Roxo na Cripta.',
      },
      {
        tag: 'CUSTOMIZAÇÃO',
        title: 'Forja de Grimórios & Pacotes',
        detail:
          'Abra pacotes no Santuário para expandir sua coleção ou edite qualquer lista na Forja de Grimórios com validação automática de regras.',
      },
    ],
    proTip:
      'Na Forja de Grimórios, mantenha cerca de 40% das suas cartas com custo entre 1 e 3 de Essência para garantir presença de mesa desde o Turno 1.',
  },
  {
    stepNumber: 8,
    badge: 'CONTA, MODOS & MULTIPLAYER 1×1',
    title: 'Identidade do Soberano & Conclave Online',
    subtitle: 'Perfil com Avatar Lendário, Campanha, Expedição Roguelite e Duelos 1×1 em tempo real.',
    cardId: 'red_08_dragao_vermelho',
    summary:
      'Sua Conta de Soberano sincroniza seu perfil, Reputação e histórico na nuvem, permitindo alternar entre modos solo e confrontos 1×1 online em tempo real.',
    keyPoints: [
      {
        tag: 'PERFIL SOBERANO',
        title: 'Avatar Lendário & Título Fixo',
        detail:
          'Escolha qualquer Criatura ou Lendária como Avatar no cadastro ou em Meu Perfil. O Título Honorífico vincula-se automaticamente à criatura escolhida.',
      },
      {
        tag: 'MULTIPLAYER 1×1',
        title: 'Fila Rápida & Salas PACT-XXXX',
        detail:
          'No Conclave Online, entre na Fila Rápida 1×1 para pareamento automático ou crie uma Sala Privada com código PACT-XXXX para desafiar um amigo.',
      },
      {
        tag: 'MODOS DE JOGO',
        title: 'Arena, Campanha & Expedição',
        detail:
          'Além do Multiplayer, enfrente os 5 atos da Campanha Histórica, monte um grimório de 40 cartas na Expedição Roguelite ou treine na Arena Rápida.',
      },
    ],
    proTip:
      'Seu Nickname é único e permanente no ranking de Reputação (calculado pela fórmula de xadrez/tênis conforme a Reputação do adversário), mas você pode alterar seu Avatar, Grimório favorito e Senha a qualquer momento na aba Meu Perfil.',
  },
];

interface KeywordEntry {
  icon: string;
  name: string;
  category: 'Ofensiva' | 'Defensiva' | 'Mobilidade' | 'Especial';
  color: string;
  description: string;
  tacticalTip: string;
  exampleCardId: string;
}

const KEYWORD_ENCYCLOPEDIA: KeywordEntry[] = [
  {
    icon: '⚡',
    name: 'Ímpeto',
    category: 'Ofensiva',
    color: '#ef4444',
    description:
      'Ignora o tempo de preparação e permite que a criatura ataque no mesmo turno em que entra em campo.',
    tacticalTip:
      'Ideal para abater ameaças recém-posicionadas ou finalizar o Soberano rival de surpresa.',
    exampleCardId: 'red_04_meio_dragao',
  },
  {
    icon: '🛡️',
    name: 'Guardião',
    category: 'Defensiva',
    color: '#facc15',
    description:
      'Obriga inimigos terrestres a atacarem esta unidade antes de outros alvos na coluna ou do Soberano. Concede +1 de Armadura a aliados adjacentes na Vanguarda.',
    tacticalTip:
      'Posicione na frente de uma pilha 3x para blindar atacantes frágeis ou proteger Relíquias na Retaguarda.',
    exampleCardId: 'gold_04_armadura_conjurada',
  },
  {
    icon: '🪽',
    name: 'Voo',
    category: 'Mobilidade',
    color: '#38bdf8',
    description:
      'Ignora bloqueadores terrestres sem Voo ou Alcance, podendo alvejar diretamente a Retaguarda inimiga ou o Soberano rival.',
    tacticalTip:
      'Excelente para destruir Relíquias e atiradores protegidos por muralhas de Guardiões.',
    exampleCardId: 'red_06_efreeti',
  },
  {
    icon: '🏹',
    name: 'Alcance',
    category: 'Mobilidade',
    color: '#60a5fa',
    description:
      'Ataca normalmente a partir da Retaguarda sem sofrer dano de contra-ataque e pode alvejar unidades com Voo.',
    tacticalTip:
      'Mantenha atrás de um aliado na Vanguarda para receber +1 ATQ de Cobertura e disparar em segurança.',
    exampleCardId: 'green_02_aranha_gigante',
  },
  {
    icon: '✨',
    name: 'Escudo Divino',
    category: 'Defensiva',
    color: '#fde047',
    description:
      'Anula completamente a primeira instância de dano que a unidade sofreria de qualquer fonte.',
    tacticalTip:
      'Remova o Escudo Divino inimigo com um efeito leve antes de usar seu ataque principal.',
    exampleCardId: 'gold_09_serafim_solar',
  },
  {
    icon: '☠️',
    name: 'Toque Letal',
    category: 'Ofensiva',
    color: '#a855f7',
    description:
      'Qualquer quantidade de dano de combate causada a uma criatura (não absorvida por Escudo Divino) destrói o alvo.',
    tacticalTip:
      'A resposta mais eficiente de custo baixo para eliminar colossos e Titãs de alta Vida.',
    exampleCardId: 'purple_02_sombra',
  },
  {
    icon: '🩸',
    name: 'Dreno de Vida',
    category: 'Especial',
    color: '#c084fc',
    description:
      'Sempre que esta unidade causa dano em combate, restaura 2 pontos de Vida ao seu Soberano.',
    tacticalTip:
      'Sustenta sua Vida ao longo da partida e compensa o uso frequente do Pacto de Sangue.',
    exampleCardId: 'purple_19_conde_vampiro',
  },
  {
    icon: '🔥',
    name: 'Fúria Crescente',
    category: 'Ofensiva',
    color: '#fb923c',
    description:
      'Sempre que esta criatura sobrevive a dano, recebe +2 de Ataque permanentemente.',
    tacticalTip:
      'Combine com curas ou Armadura para escalar o poder ofensivo da unidade a cada troca.',
    exampleCardId: 'red_16_orc_saqueador',
  },
  {
    icon: '⚰️',
    name: 'Renascer',
    category: 'Especial',
    color: '#e879f9',
    description:
      'Na primeira vez em que é destruída, retorna imediatamente ao campo com 1 ponto de Vida.',
    tacticalTip:
      'Exige dois ataques inimigos para liberar a coluna, mantendo sua Vanguarda ativa por mais tempo.',
    exampleCardId: 'purple_01_esqueleto',
  },
  {
    icon: '🦏',
    name: 'Atropelar',
    category: 'Ofensiva',
    color: '#22c55e',
    description:
      'Atinge todas as cartas empilhadas no slot defensor e transfere o dano excedente diretamente ao Soberano rival.',
    tacticalTip:
      'Pune formações empilhadas 3x e garante dano contínuo ao Soberano oponente.',
    exampleCardId: 'green_03_ursogrifo',
  },
  {
    icon: '🌋',
    name: 'Pele Incandescente',
    category: 'Defensiva',
    color: '#fb7185',
    description:
      'Ao sofrer um ataque corpo-a-corpo, causa +1 de dano de fogo extra de retorno ao atacante.',
    tacticalTip:
      'Posicione na Vanguarda para desgastar enxames de unidades de baixa Vida.',
    exampleCardId: 'red_05_salamandra',
  },
  {
    icon: '🐉',
    name: 'Sopro Elemental',
    category: 'Ofensiva',
    color: '#f97316',
    description:
      'Ao atacar, varre a fileira inimiga causando dano elemental a todas as unidades e pilhas daquela fileira.',
    tacticalTip:
      'A ferramenta definitiva para limpar tabuleiros cheios e pilhas de 3 unidades.',
    exampleCardId: 'red_08_dragao_vermelho',
  },
  {
    icon: '🧱',
    name: 'Armadura',
    category: 'Defensiva',
    color: '#cbd5e1',
    description:
      'Reduz todo dano sofrido de ataques e feitiços pelo valor de Armadura da unidade.',
    tacticalTip:
      'Unidades com 2 ou mais de Armadura neutralizam atacantes pequenos sem perder Vida.',
    exampleCardId: 'gold_05_automato_guardiao',
  },
  {
    icon: '🌿',
    name: 'Regeneração',
    category: 'Defensiva',
    color: '#4ade80',
    description:
      'No início de cada turno do seu controlador, restaura automaticamente 2 pontos de Vida.',
    tacticalTip:
      'Faça trocas parciais no seu turno para recuperar a integridade da criatura na rodada seguinte.',
    exampleCardId: 'green_07_troll',
  },
  {
    icon: '❄️',
    name: 'Congelar',
    category: 'Especial',
    color: '#38bdf8',
    description:
      'Impede a unidade atingida de atacar ou se mover até o final do próximo turno do seu controlador.',
    tacticalTip:
      'Neutralize o maior colosso inimigo por uma rodada inteira para abrir espaço para sua ofensiva.',
    exampleCardId: 'blue_06_dragao_azul',
  },
];

export const TutorialCodexView: React.FC<TutorialCodexViewProps> = ({
  isModal = false,
  onClose,
  onStartPracticeDuel,
  onInspectCard,
}) => {
  const [activeSection, setActiveSection] = useState<CodexSectionId>('walkthrough');
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [keywordFilter, setKeywordFilter] = useState<string>('all');

  const currentStep = WALKTHROUGH_STEPS[activeStepIndex] ?? WALKTHROUGH_STEPS[0];
  const stepCard = CARDS_BY_ID[currentStep.cardId] ?? ALL_CARDS[0];

  const filteredKeywords = KEYWORD_ENCYCLOPEDIA.filter(
    (k) => keywordFilter === 'all' || k.category === keywordFilter
  );

  const innerContent = (
    <div className={isModal ? 'tg-modal-inner' : 'aaa-page-shell'}>
      {/* HEADER CLEAN */}
      <header className="aaa-page-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="aaa-kicker">CÓDICE DE REGRAS & SISTEMAS DO JOGO</div>
          <h1 className="aaa-page-title font-cinzel" style={{ margin: 0 }}>
            Tutorial & Enciclopédia
          </h1>
        </div>

        <div className="aaa-header-actions" style={{ flexWrap: 'wrap', gap: '0.45rem' }}>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'walkthrough' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('walkthrough')}
          >
            Passo a Passo ({WALKTHROUGH_STEPS.length})
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'board_stacking' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('board_stacking')}
          >
            Mesa 6×4 & Formações
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'domains' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('domains')}
          >
            Os 5 Domínios
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'weather_runes' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('weather_runes')}
          >
            Expansão de Domínio
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'keywords' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('keywords')}
          >
            Palavras-Chave ({KEYWORD_ENCYCLOPEDIA.length})
          </button>
          <button
            type="button"
            className={`btn-fantasy ${activeSection === 'controls' ? 'btn-fantasy-primary' : ''}`}
            onClick={() => setActiveSection('controls')}
          >
            Interface & Atalhos
          </button>
          {isModal && onClose && (
            <button type="button" className="btn-fantasy btn-fantasy-danger" onClick={onClose}>
              Fechar
            </button>
          )}
        </div>
      </header>

      {/* =====================================================================
          SECTION 1: INTERACTIVE STEP-BY-STEP WALKTHROUGH
         ===================================================================== */}
      {activeSection === 'walkthrough' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {/* Step Progress Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.5rem',
            }}
          >
            {WALKTHROUGH_STEPS.map((st, idx) => {
              const isCurrent = idx === activeStepIndex;
              return (
                <button
                  key={st.stepNumber}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  style={{
                    textAlign: 'left',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isCurrent
                      ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(15, 23, 42, 0.95))'
                      : 'rgba(15, 23, 42, 0.72)',
                    border: isCurrent
                      ? '1px solid rgba(250, 204, 21, 0.7)'
                      : '1px solid rgba(148, 163, 184, 0.16)',
                    transition: 'all 0.16s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: isCurrent ? '#fde047' : '#64748b',
                      marginBottom: '0.2rem',
                    }}
                  >
                    LIÇÃO 0{st.stepNumber}
                  </div>
                  <div
                    className="font-cinzel"
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: isCurrent ? '#ffffff' : '#cbd5e1',
                      lineHeight: 1.25,
                    }}
                  >
                    {st.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Lesson Showcase Card */}
          <div className="aaa-codex-row" style={{ alignItems: 'stretch', gap: '1.5rem' }}>
            <div
              className="aaa-codex-card-preview"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                minWidth: '240px',
              }}
            >
              {stepCard && (
                <CardView
                  card={stepCard}
                  mode="gallery"
                  isPlayable={true}
                  onClick={() => onInspectCard?.(stepCard)}
                  onInspect={onInspectCard}
                />
              )}
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.03em' }}>
                Clique na carta para inspecionar em 3D
              </span>
            </div>

            <div
              className="aaa-codex-info"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div className="aaa-kicker" style={{ marginBottom: '0.25rem' }}>
                  LIÇÃO 0{currentStep.stepNumber} • {currentStep.badge}
                </div>
                <h2
                  className="font-cinzel aaa-codex-heading"
                  style={{ fontSize: '1.4rem', marginBottom: '0.35rem', color: '#f8fafc' }}
                >
                  {currentStep.title}
                </h2>
                <p
                  style={{
                    color: '#fde68a',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    marginBottom: '0.6rem',
                  }}
                >
                  {currentStep.subtitle}
                </p>
                <p
                  className="aaa-codex-p"
                  style={{
                    marginBottom: '1.1rem',
                    color: '#cbd5e1',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                  }}
                >
                  {currentStep.summary}
                </p>

                {/* Balanced 3-Column Key Points Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '0.85rem',
                    marginBottom: '1.1rem',
                  }}
                >
                  {currentStep.keyPoints.map((kp, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '0.95rem 1.05rem',
                        borderRadius: '10px',
                        background: 'rgba(15, 23, 42, 0.82)',
                        border: '1px solid rgba(212, 175, 55, 0.22)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        minHeight: '132px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          letterSpacing: '0.09em',
                          color: '#d4af37',
                          marginBottom: '0.3rem',
                          textTransform: 'uppercase',
                        }}
                      >
                        {kp.tag}
                      </div>
                      <div
                        className="font-cinzel"
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          marginBottom: '0.4rem',
                        }}
                      >
                        {kp.title}
                      </div>
                      <p
                        style={{
                          fontSize: '0.81rem',
                          color: '#cbd5e1',
                          lineHeight: 1.52,
                          margin: 0,
                        }}
                      >
                        {kp.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                {/* Clean Editorial Pro Tip Banner */}
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: 'rgba(30, 41, 59, 0.65)',
                    borderLeft: '3px solid #d4af37',
                    color: '#e2e8f0',
                    fontSize: '0.83rem',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: '#fde047', marginRight: '0.35rem' }}>Nota Tática:</strong>
                  {currentStep.proTip}
                </div>

                {/* Lesson Navigation Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingTop: '0.65rem',
                    borderTop: '1px solid rgba(148, 163, 184, 0.15)',
                  }}
                >
                  <button
                    type="button"
                    className="btn-fantasy"
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  >
                    ← Anterior
                  </button>

                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {activeStepIndex < WALKTHROUGH_STEPS.length - 1 ? (
                      <button
                        type="button"
                        className="btn-fantasy btn-fantasy-primary"
                        onClick={() =>
                          setActiveStepIndex((prev) =>
                            Math.min(WALKTHROUGH_STEPS.length - 1, prev + 1)
                          )
                        }
                      >
                        Próxima Lição ({activeStepIndex + 2}/{WALKTHROUGH_STEPS.length}) →
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn-fantasy"
                          onClick={() => setActiveSection('domains')}
                        >
                          Explorar os 5 Domínios →
                        </button>
                        {onStartPracticeDuel && (
                          <button
                            type="button"
                            className="btn-fantasy btn-fantasy-primary"
                            onClick={onStartPracticeDuel}
                          >
                            Praticar na Arena
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 2: BOARD 6x4 & FORMATIONS
         ===================================================================== */}
      {activeSection === 'board_stacking' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div className="aaa-kicker">GEOMETRIA DE COMBATE • 6 COLUNAS × 4 FILEIRAS</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Formações de Coluna & Empilhamento 3x
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              Cada metade da mesa possui 6 slots de Vanguarda e 6 slots de Retaguarda. Cada slot individual comporta até 3 unidades empilhadas, gerando bônus táticos automáticos conforme a formação.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '0.9rem',
            }}
          >
            {[
              {
                tag: 'FILEIRA FRONTAL [V]',
                title: 'Vanguarda, Invasão & Falange',
                color: '#f87171',
                desc: 'Unidades na Vanguarda bloqueiam ataques terrestres na coluna. Ganham +1 ATQ de Invasão quando a Vanguarda oposta está vazia e +1 de Armadura ao lado de um Guardião.',
              },
              {
                tag: 'FILEIRA DE SUPORTE [R]',
                title: 'Retaguarda & Cobertura',
                color: '#60a5fa',
                desc: 'Abriga atiradores de Alcance, Relíquias Contínuas e Emboscadas. Enquanto houver um aliado na Vanguarda da mesma coluna, recebe proteção terrestre e +1 ATQ.',
              },
              {
                tag: 'CONCENTRAÇÃO (ATÉ 3X)',
                title: 'Quando Empilhar no Mesmo Slot',
                color: '#4ade80',
                desc: 'Contra baralhos de dano focado ou abate individual, posicione 1 Guardião liderando o slot com até 2 atacantes ou suportes protegidos atrás dele.',
              },
              {
                tag: 'DISPERSÃO TÁTICA',
                title: 'Quando Espalhar Pelas Colunas',
                color: '#facc15',
                desc: 'Contra Dragões com Sopro, criaturas com Atropelar ou feitiços de área, distribua suas unidades em colunas diferentes para evitar dano triplo no mesmo slot.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.84)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.08em', color: item.color }}>
                  {item.tag}
                </div>
                <h3 className="font-cinzel" style={{ color: '#f8fafc', fontSize: '0.95rem', margin: 0 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 3: THE 5 ELEMENTAL DOMAINS
         ===================================================================== */}
      {activeSection === 'domains' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          {(
            [
              {
                domain: 'red' as Domain,
                sovereignPower: 'Chama Soberana (2 de Essência): Causa 2 de dano a um inimigo e 1 ao Soberano rival (ou 3 ao Soberano se o campo estiver vazio).',
                domainExpansion:
                  'Caldeira do Sol Carmesim: Concede +2 ATQ às unidades Rubras, Acerto Garantido e 2 de dano de queima por rodada.',
                archetype: 'Agressão explosiva, Ímpeto, Fúria Crescente, Dragões de Sopro e dano direto.',
                cardId: 'red_08_dragao_vermelho',
              },
              {
                domain: 'purple' as Domain,
                sovereignPower: 'Dreno Umbroso (2 de Essência): Causa 2 de dano a um alvo, restaura 2 de Vida ao seu Soberano e gera +1 Corrupção.',
                domainExpansion:
                  'Santuário Malevolente das Almas: Concede +2 ATQ e Dreno de Vida às unidades Umbrais, Acerto Garantido e drena 2 de Vida por rodada.',
                archetype: 'Reanimação da Cripta, Toque Letal, Dreno de Vida, Renascer e Pactos de Sangue.',
                cardId: 'purple_07_lich',
              },
              {
                domain: 'blue' as Domain,
                sovereignPower: 'Pulso Rúnico (2 de Essência): Congela um inimigo causando 2 de dano e concede +1/+1 a um aliado (ou compra 1 carta).',
                domainExpansion:
                  'Vazio Infinito de Cronos: Concede +1 ATQ e +1 ARM às unidades Azuis, Acerto Garantido, congela 1 inimigo e compra 1 carta por rodada.',
                archetype: 'Controle glacial, compra de cartas, Voo, Alcance e Reações de contra-ataque.',
                cardId: 'blue_06_dragao_azul',
              },
              {
                domain: 'green' as Domain,
                sovereignPower: 'Rugido Alfa (2 de Essência): Concede +1 ATQ e +2 de Vida ao aliado mais forte (ou restaura 3 de Vida ao Soberano).',
                domainExpansion:
                  'Mar de Árvores Primordial: Concede +2 ATQ, +1 ARM e Atropelar às unidades Verdes, Acerto Garantido e regenera +2 de Vida por rodada.',
                archetype: 'Supremacia de criaturas, Atropelar, Regeneração, aceleração de Afinidade e Ascensões.',
                cardId: 'green_09_hidra',
              },
              {
                domain: 'gold' as Domain,
                sovereignPower: 'Baluarte Imperial (2 de Essência): Concede +1 ARM e +2 de Vida ao aliado mais ferido (ou restaura 3 de Vida ao Soberano).',
                domainExpansion:
                  'Tribunal da Sentença Dourada: Concede +1 ATQ e +2 ARM às unidades Douradas, Escudo Divino ao maior aliado e -2 ATQ ao maior inimigo.',
                archetype: 'Guardiões, Escudo Divino, Armadura pesada e Cidadela de Relíquias na Retaguarda.',
                cardId: 'gold_09_serafim_solar',
              },
            ] as const
          ).map((d) => {
            const meta = DOMAIN_META[d.domain];
            const card = CARDS_BY_ID[d.cardId];
            return (
              <div
                key={d.domain}
                className="tg-panel"
                style={{
                  border: `1px solid ${meta.color}55`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.7rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.65rem', color: meta.color, fontWeight: 800, letterSpacing: '0.08em' }}>
                        DOMÍNIO ELEMENTAL
                      </div>
                      <h3 className="font-cinzel" style={{ fontSize: '1.12rem', color: '#ffffff', margin: 0 }}>
                        {meta.name}
                      </h3>
                    </div>
                    {card?.imagePath && (
                      <img
                        src={card.imagePath}
                        alt={card.name}
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: `1px solid ${meta.color}`,
                          cursor: 'pointer',
                        }}
                        onClick={() => card && onInspectCard?.(card)}
                      />
                    )}
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '0 0 0.65rem 0', lineHeight: 1.5 }}>
                    {d.archetype}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.82)',
                      border: '1px solid rgba(148, 163, 184, 0.16)',
                      color: '#e2e8f0',
                      lineHeight: 1.45,
                    }}
                  >
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: '#fde047', marginBottom: '0.15rem' }}>
                      PODER DO SOBERANO
                    </div>
                    {d.sovereignPower}
                  </div>

                  <div
                    style={{
                      fontSize: '0.78rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.75)',
                      border: `1px solid ${meta.color}44`,
                      color: '#f8fafc',
                      lineHeight: 1.45,
                    }}
                  >
                    <div style={{ fontSize: '0.62rem', fontWeight: 800, color: meta.color, marginBottom: '0.15rem' }}>
                      EXPANSÃO DE DOMÍNIO (6/6 AFINIDADE • 3 ESSÊNCIA)
                    </div>
                    {d.domainExpansion}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          SECTION 4: DOMAIN EXPANSION STATES & CLASH RULES
         ===================================================================== */}
      {activeSection === 'weather_runes' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div className="aaa-kicker">MECÂNICA SUPREMA DE CAMPO • MARCO 6/6 DE AFINIDADE</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Os 4 Estados da Expansão de Domínio
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
              Ao acumular 6 de Afinidade Elemental e pagar 3 de Essência, o Soberano manifesta seu santuário sobre a mesa de guerra por 3 rodadas. Conheça como as interações e colisões de Domínio funcionam:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '0.9rem',
            }}
          >
            {[
              {
                tag: 'ESTADO 01 • ATIVAÇÃO',
                name: 'Expansão Radial (3 Rodadas)',
                color: '#fb923c',
                desc: 'Concede Potencial 120% às unidades do Domínio, dispara um efeito elemental no início de cada rodada e libera Acerto Garantido direto contra o Soberano rival.',
              },
              {
                tag: 'ESTADO 02 • COLISÃO',
                name: 'Choque de Domínios 50/50',
                color: '#a855f7',
                desc: 'Se ambos os Soberanos expandirem com Afinidades empatadas, o campo se divide ao meio e o Acerto Garantido é anulado. Se uma Afinidade for maior, ela estilhaça o Domínio menor.',
              },
              {
                tag: 'ESTADO 03 • DEFESA',
                name: 'Domínio Simples (2 de Essência)',
                color: '#38bdf8',
                desc: 'Técnica defensiva de emergência que cria um perímetro pessoal por 1 rodada, desativando o Acerto Garantido da Expansão inimiga.',
              },
              {
                tag: 'ESTADO 04 • RUPTURA',
                name: 'Estilhaçamento Forçado',
                color: '#ef4444',
                desc: 'Causar 8 ou mais de dano ao Soberano controlador na mesma rodada (ou pagar o Sacrifício de Ruptura) estilhaça o Domínio ativo imediatamente.',
              },
            ].map((r, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: `1px solid ${r.color}55`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div style={{ fontSize: '0.64rem', fontWeight: 800, letterSpacing: '0.08em', color: r.color }}>
                  {r.tag}
                </div>
                <div className="font-cinzel" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                  {r.name}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.55, margin: 0 }}>
                  {r.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 5: KEYWORDS ENCYCLOPEDIA
         ===================================================================== */}
      {activeSection === 'keywords' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, marginRight: '0.35rem' }}>
              CATEGORIA:
            </span>
            {(['all', 'Ofensiva', 'Defensiva', 'Mobilidade', 'Especial'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn-fantasy ${keywordFilter === cat ? 'btn-fantasy-primary' : ''}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                onClick={() => setKeywordFilter(cat)}
              >
                {cat === 'all' ? `Todas (${KEYWORD_ENCYCLOPEDIA.length})` : cat}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {filteredKeywords.map((kw) => {
              const exCard = CARDS_BY_ID[kw.exampleCardId];
              return (
                <div
                  key={kw.name}
                  className="tg-panel"
                  style={{
                    border: `1px solid ${kw.color}44`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.65rem',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.4rem',
                      }}
                    >
                      <div
                        className="font-cinzel"
                        style={{
                          fontSize: '0.96rem',
                          fontWeight: 700,
                          color: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                        }}
                      >
                        <span>{kw.icon}</span>
                        <span>{kw.name}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.64rem',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: 'rgba(15, 23, 42, 0.9)',
                          border: `1px solid ${kw.color}55`,
                          color: kw.color,
                          fontWeight: 700,
                        }}
                      >
                        {kw.category}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.81rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '0.4rem' }}>
                      {kw.description}
                    </p>
                    <div style={{ fontSize: '0.75rem', color: '#fde68a', lineHeight: 1.45 }}>
                      <em>{kw.tacticalTip}</em>
                    </div>
                  </div>

                  {exCard && (
                    <div
                      onClick={() => onInspectCard?.(exCard)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.55rem',
                        padding: '0.4rem 0.6rem',
                        borderRadius: '8px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid rgba(148, 163, 184, 0.16)',
                        cursor: 'pointer',
                      }}
                    >
                      {exCard.imagePath && (
                        <img
                          src={exCard.imagePath}
                          alt={exCard.name}
                          style={{ width: '30px', height: '30px', borderRadius: '5px', objectFit: 'cover' }}
                        />
                      )}
                      <div style={{ flex: 1, fontSize: '0.73rem' }}>
                        <div style={{ color: '#ffffff', fontWeight: 700 }}>{exCard.name}</div>
                        <div style={{ color: '#94a3b8', fontSize: '0.67rem' }}>
                          Custo {exCard.cost} • Inspecionar carta
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          SECTION 6: INTERFACE, SHORTCUTS & ACCOUNT SYSTEM
         ===================================================================== */}
      {activeSection === 'controls' && (
        <div className="tg-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <div className="aaa-kicker">CONTROLES DE ARENA & NAVEGAÇÃO</div>
            <h2 className="font-cinzel gold-gradient-text" style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>
              Interface, Atalhos Rápidos & Conta do Soberano
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0 }}>
              Referência rápida dos comandos de teclado, barras retráteis da arena e recursos da sua conta:
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {[
              {
                key: 'Barra Superior ▾',
                title: 'Status do Oponente',
                desc: 'Exibe Vida, Essência, cartas na mão e Cripta do rival. Clique para inspecionar Terrenos Canalizados e Afinidades inimigas.',
              },
              {
                key: 'Barra Inferior ▴',
                title: 'Seu Soberano & Rituais',
                desc: 'Reúne sua Vida, Essência, Poder do Soberano, Pacto de Sangue e o progresso 6/6 para a Expansão de Domínio.',
              },
              {
                key: 'Gaveta MÃO',
                title: 'Mão Auto-Ocultável',
                desc: 'Passe o mouse para revelar suas cartas ou clique no botão MÃO para fixar a gaveta aberta durante o planejamento.',
              },
              {
                key: 'Tecla [C]',
                title: 'Canalizar / Sacrificar',
                desc: 'Canaliza 1 carta por turno (+1 Afinidade e compra 1 carta). Em usos extras no mesmo turno, sacrifica a carta por +1 de Essência temporária.',
              },
              {
                key: '[V] / [R]',
                title: 'Invocação Rápida de Fileira',
                desc: 'Com uma carta selecionada na mão, [V] posiciona na Vanguarda e [R] posiciona na Retaguarda.',
              },
              {
                key: '[ESPAÇO] • ⏱️ 60s',
                title: 'Passar Turno & Relógio de Combate',
                desc: 'Cada jogador possui 60 segundos por turno (com alerta nos últimos 15s). Ao zerar o relógio ou pressionar [ESPAÇO], o turno passa automaticamente.',
              },
              {
                key: 'Perfil Soberano',
                title: 'Avatar Lendário & Senha',
                desc: 'No botão do topo direito, gerencie sua conta: escolha qualquer Criatura/Lendária como Avatar (com Título automático) ou recupere sua senha.',
              },
              {
                key: 'Conclave 1×1',
                title: 'Fila Rápida & Código PACT',
                desc: 'No menu Conclave Online, jogue partidas ranqueadas na Fila Rápida 1×1 ou compartilhe um código PACT-XXXX para duelos diretos.',
              },
            ].map((sc, i) => (
              <div
                key={i}
                style={{
                  padding: '0.95rem',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.84)',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.4rem' }}>
                  <kbd
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(212, 175, 55, 0.16)',
                      border: '1px solid rgba(250, 204, 21, 0.5)',
                      color: '#fde047',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                    }}
                  >
                    {sc.key}
                  </kbd>
                  <span className="font-cinzel" style={{ color: '#ffffff', fontWeight: 700, fontSize: '0.88rem' }}>
                    {sc.title}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{sc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div
          className="modal-panel"
          style={{ maxWidth: '1140px', width: '95vw', maxHeight: '90vh', overflowY: 'auto' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-sticky-close-bar">
            <span className="font-cinzel gold-gradient-text" style={{ fontSize: '0.78rem', fontWeight: 800 }}>
              🎓 CÓDICE DE REGRAS & TUTORIAL
            </span>
            <button type="button" className="btn-fantasy btn-fantasy-danger" onClick={onClose}>
              ✕ Fechar Tutorial
            </button>
          </div>
          {innerContent}
        </div>
      </div>
    );
  }

  return innerContent;
};
