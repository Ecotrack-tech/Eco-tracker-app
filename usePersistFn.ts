/**
 * AD CONTEXT — Eco Tracker
 * Manages ad state and rewards globally
 */
import React, { createContext, useCallback, useContext, useState } from 'react';

export interface AdReward {
  type: 'detailed_insights' | 'streak_protection';
  earnedAt: number;
}

interface AdContextValue {
  showRewardedAd: boolean;
  setShowRewardedAd: (show: boolean) => void;
  rewards: AdReward[];
  addReward: (reward: AdReward) => void;
  hasDetailedInsights: boolean;
  adsWatchedToday: number;
  recordAdWatched: () => void;
}

const AdContext = createContext<AdContextValue | null>(null);

const MAX_ADS_PER_SESSION = 2;
const DETAILED_INSIGHTS_KEY = 'eco_tracker_detailed_insights_v1';
const ADS_WATCHED_KEY = 'eco_tracker_ads_watched_v1';

export function AdProvider({ children }: { children: React.ReactNode }) {
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [rewards, setRewards] = useState<AdReward[]>(() => {
    try {
      const stored = localStorage.getItem(DETAILED_INSIGHTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [adsWatchedToday, setAdsWatchedToday] = useState(() => {
    try {
      const stored = localStorage.getItem(ADS_WATCHED_KEY);
      if (!stored) return 0;
      const data = JSON.parse(stored);
      const today = new Date().toDateString();
      return data.date === today ? data.count : 0;
    } catch {
      return 0;
    }
  });

  const addReward = useCallback((reward: AdReward) => {
    setRewards((prev: AdReward[]) => {
      const updated = [...prev, reward];
      try {
        localStorage.setItem(DETAILED_INSIGHTS_KEY, JSON.stringify(updated));
      } catch {
        // Silently fail if localStorage is unavailable
      }
      return updated;
    });
  }, []);

  const recordAdWatched = useCallback(() => {
    setAdsWatchedToday((prev: number) => {
      const updated = prev + 1;
      try {
        const today = new Date().toDateString();
        localStorage.setItem(ADS_WATCHED_KEY, JSON.stringify({ date: today, count: updated }));
      } catch {
        // Silently fail if localStorage is unavailable
      }
      return updated;
    });
  }, []);

  const hasDetailedInsights = rewards.some((r) => r.type === 'detailed_insights');

  return (
    <AdContext.Provider
      value={{
        showRewardedAd,
        setShowRewardedAd,
        rewards,
        addReward,
        hasDetailedInsights,
        adsWatchedToday,
        recordAdWatched,
      }}
    >
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const ctx = useContext(AdContext);
  if (!ctx) throw new Error('useAds must be used within AdProvider');
  return ctx;
}
