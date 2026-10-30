import React, { useMemo } from 'react';
import { VAELORIA_REGIONAL_MAPS } from '../data/vaeloriaMultimapData';
import {
  OverworldEventChoiceDef,
  OverworldExplorationMode,
  OverworldLandmarkEventDef,
  ResolvedOverworldChoicePreview,
  resolveLandmarkChoicePreview,
} from '../data/vaeloriaOverworldEvents';
import { playSfx } from '../utils/soundEngine';

export interface OverworldEventModalProps {
  eventDef: OverworldLandmarkEventDef;
  mode: OverworldExplorationMode;
  alreadyExplored: boolean;
  cooldownSeasonsLeft?: number;
  onSelectChoice: (
    choice: OverworldEventChoiceDef,
    preview: ResolvedOverworldChoicePreview
  ) => void;
  onClose: () => void;
}

export const OverworldEventModal: React.FC<OverworldEventModalProps> = ({
  eventDef,
  mode,
  alreadyExplored,
  cooldownSeasonsLeft = 0,
  onSelectChoice,
  onClose,
}) => {
  const realmDef = VAELORIA_REGIONAL_MAPS[eventDef.realm];

  const choicePreviews = useMemo(
    () =>
      eventDef.choices.map((ch) => ({
        choice: ch,
        preview: resolveLandmarkChoicePreview(eventDef, ch, mode),
      })),
    [eventDef, mode]
  );

  return (
    <div
      className="modal-backdrop ow-event-backdrop"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="modal-panel ow-event-modal"
        style={
          {
            '--ow-accent': realmDef.accentColor,
          } as React.CSSProperties
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ow-event-header">
          <div className="ow-event-realm-pill" style={{ borderColor: `${realmDef.accentColor}88` }}>
            <span>{realmDef.icon}</span>
            <span style={{ color: realmDef.accentColor }}>{eventDef.kicker}</span>
          </div>
          <button
            type="button"
            className="ow-event-close-btn"
            onClick={onClose}
            aria-label="Fechar evento"
          >
            ✕
          </button>
        </div>

        <h3 className="font-cinzel ow-event-title">{eventDef.title}</h3>
        <p className="ow-event-lore">{eventDef.loreParagraph}</p>

        {alreadyExplored ? (
          <div className="ow-event-explored-box">
            <strong>✓ Marco já explorado</strong>
            <span>
              {mode === 'conquest' && cooldownSeasonsLeft > 0
                ? `Novas provisões estarão disponíveis neste marco em ${cooldownSeasonsLeft} estação(ões).`
                : mode === 'expedition'
                ? 'Você já reivindicou a dádiva deste marco nesta Expedição.'
                : 'A crônica e o espólio deste marco já foram integrados à sua jornada.'}
            </span>
            <button type="button" className="aaa-btn aaa-btn-secondary" onClick={onClose}>
              Continuar Marcha
            </button>
          </div>
        ) : (
          <div className="ow-event-choices-grid">
            {choicePreviews.map(({ choice, preview }) => (
              <button
                key={choice.id}
                type="button"
                className="ow-event-choice-card"
                onClick={() => {
                  playSfx('landmark_discover');
                  onSelectChoice(choice, preview);
                }}
              >
                <div className="ow-choice-top">
                  <span className="ow-choice-icon">{choice.icon}</span>
                  <strong className="font-cinzel ow-choice-title">{choice.title}</strong>
                </div>
                <p className="ow-choice-desc">{choice.flavorOutcome}</p>
                <div className="ow-choice-reward-pill">{preview.rewardBadge}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
