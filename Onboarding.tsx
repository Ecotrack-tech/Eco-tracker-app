/**
 * ANALYTICS SERVICE — Eco Tracker
 * Tracks user engagement events: onboarding, goal selection, habit logging, etc.
 * Uses Umami analytics via the built-in VITE_ANALYTICS_ENDPOINT
 */

export type EventName =
  | 'onboarding_started'
  | 'onboarding_welcome_viewed'
  | 'onboarding_goal_viewed'
  | 'onboarding_goal_selected'
  | 'onboarding_tips_viewed'
  | 'onboarding_completed'
  | 'onboarding_skipped'
  | 'habit_log_started'
  | 'habit_log_completed'
  | 'habit_log_skipped'
  | 'goal_changed'
  | 'dashboard_viewed'
  | 'progress_viewed'
  | 'goals_viewed';

export interface EventData {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Track an analytics event
 * Uses Umami's event tracking API
 */
export function trackEvent(eventName: EventName, data?: EventData): void {
  try {
    // Umami tracks events via window.umami.track()
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(eventName, data || {});
    }
  } catch (error) {
    // Silently fail if analytics is not available
    console.debug('[Analytics] Event tracking failed:', eventName, error);
  }
}

/**
 * Track onboarding progress
 */
export const onboardingEvents = {
  started: () => trackEvent('onboarding_started'),
  welcomeViewed: () => trackEvent('onboarding_welcome_viewed'),
  goalScreenViewed: () => trackEvent('onboarding_goal_viewed'),
  goalSelected: (goalType: string) =>
    trackEvent('onboarding_goal_selected', { goal: goalType }),
  tipsScreenViewed: () => trackEvent('onboarding_tips_viewed'),
  completed: () => trackEvent('onboarding_completed'),
  skipped: () => trackEvent('onboarding_skipped'),
};

/**
 * Track habit logging
 */
export const habitEvents = {
  logStarted: () => trackEvent('habit_log_started'),
  logCompleted: (score: number, category: string) =>
    trackEvent('habit_log_completed', { score, category }),
  logSkipped: () => trackEvent('habit_log_skipped'),
};

/**
 * Track goal changes
 */
export const goalEvents = {
  changed: (goalType: string) =>
    trackEvent('goal_changed', { goal: goalType }),
};

/**
 * Track page views
 */
export const pageEvents = {
  dashboardViewed: () => trackEvent('dashboard_viewed'),
  progressViewed: () => trackEvent('progress_viewed'),
  goalsViewed: () => trackEvent('goals_viewed'),
};

// Extend window object to include umami
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: EventData) => void;
    };
  }
}
