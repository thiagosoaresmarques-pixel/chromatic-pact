import React, { useCallback, useEffect, useState } from 'react';
import { BattleArena, CustomSavedDeck } from './BattleArena';
import {
  LiveArenaFeedItem,
  pickRandomLiveArenaMatchSync,
  refreshLiveArenaCloudPool,
} from '../utils/liveArenaFeedEngine';

export interface HomeLiveArenaViewProps {
  customDecks: CustomSavedDeck[];
  isGuest?: boolean;
  onPlayDuelNow: () => void;
}

export const HomeLiveArenaView: React.FC<HomeLiveArenaViewProps> = ({
  customDecks,
  isGuest = false,
  onPlayDuelNow,
}) => {
  const [activeFeedItem, setActiveFeedItem] = useState<LiveArenaFeedItem>(() =>
    pickRandomLiveArenaMatchSync()
  );

  useEffect(() => {
    void refreshLiveArenaCloudPool();
    const pollId = window.setInterval(() => {
      void refreshLiveArenaCloudPool();
    }, 20_000);
    return () => window.clearInterval(pollId);
  }, []);

  const handleCycleNextLiveMatch = useCallback(() => {
    setActiveFeedItem((prev) =>
      pickRandomLiveArenaMatchSync({ excludeFeedId: prev.feedId })
    );
  }, []);

  return (
    <div className="home-live-arena-shell">
      <BattleArena
        key={activeFeedItem.feedId}
        customDecks={customDecks}
        isGuest={isGuest}
        tournamentSpectatorContext={{
          tournament: activeFeedItem.tournament,
          pairing: activeFeedItem.pairing,
          variant: 'home_live',
          customTableBadge: activeFeedItem.tableBadge,
          livePvpRoom: activeFeedItem.livePvpRoom ?? null,
          onExitSpectator: onPlayDuelNow,
          onCycleNextLiveMatch: handleCycleNextLiveMatch,
          onPlayNowFromHome: onPlayDuelNow,
        }}
      />
    </div>
  );
};
