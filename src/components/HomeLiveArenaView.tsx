import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BattleArena, CustomSavedDeck } from './BattleArena';
import {
  buildShareKeyForLiveFeedItem,
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
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);
  const fadeTimersRef = useRef<number[]>([]);

  const clearPendingFadeTimers = useCallback(() => {
    for (const id of fadeTimersRef.current) {
      window.clearTimeout(id);
    }
    fadeTimersRef.current = [];
  }, []);

  useEffect(() => {
    void refreshLiveArenaCloudPool();
    const pollId = window.setInterval(() => {
      void refreshLiveArenaCloudPool();
    }, 20_000);
    return () => {
      window.clearInterval(pollId);
      clearPendingFadeTimers();
    };
  }, [clearPendingFadeTimers]);

  const handleCycleNextLiveMatch = useCallback(() => {
    clearPendingFadeTimers();
    setIsCrossfading(true);
    const swapTimer = window.setTimeout(() => {
      setActiveFeedItem((prev) =>
        pickRandomLiveArenaMatchSync({ excludeFeedId: prev.feedId })
      );
      const revealTimer = window.setTimeout(() => {
        setIsCrossfading(false);
      }, 90);
      fadeTimersRef.current.push(revealTimer);
    }, 240);
    fadeTimersRef.current.push(swapTimer);
  }, [clearPendingFadeTimers]);

  const spectatorContext = useMemo(
    () => ({
      tournament: activeFeedItem.tournament,
      pairing: activeFeedItem.pairing,
      variant: 'home_live' as const,
      customTableBadge: activeFeedItem.tableBadge,
      livePvpRoom: activeFeedItem.livePvpRoom ?? null,
      liveShareKey: buildShareKeyForLiveFeedItem(activeFeedItem) ?? undefined,
      onExitSpectator: onPlayDuelNow,
      onCycleNextLiveMatch: handleCycleNextLiveMatch,
      onPlayNowFromHome: onPlayDuelNow,
    }),
    [activeFeedItem, handleCycleNextLiveMatch, onPlayDuelNow]
  );

  return (
    <div
      className={`home-live-arena-shell ${
        isCrossfading ? 'is-crossfading-table' : ''
      }`}
    >
      <BattleArena
        key={activeFeedItem.feedId}
        customDecks={customDecks}
        isGuest={isGuest}
        tournamentSpectatorContext={spectatorContext}
      />
    </div>
  );
};
