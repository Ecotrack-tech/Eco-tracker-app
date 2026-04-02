/**
 * ONBOARDING CONTEXT — Biophilic Minimalism
 * Manages first-time user onboarding state and completion.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface OnboardingContextValue {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

const ONBOARDING_KEY = 'eco_tracker_onboarding_v1';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    try {
      const stored = localStorage.getItem(ONBOARDING_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const completeOnboarding = useCallback(() => {
    setHasCompletedOnboarding(true);
    localStorage.setItem(ONBOARDING_KEY, 'true');
  }, []);

  const resetOnboarding = useCallback(() => {
    setHasCompletedOnboarding(false);
    localStorage.removeItem(ONBOARDING_KEY);
  }, []);

  return (
    <OnboardingContext.Provider value={{ hasCompletedOnboarding, completeOnboarding, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
