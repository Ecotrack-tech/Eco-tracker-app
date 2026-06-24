/**
 * NOTIFICATIONS FACTORY
 * Creates notification objects for streak and reminder events.
 */

export type NotificationType = 'warning' | 'error' | 'success' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
}

function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Warns the user their active streak is at risk if they don't log today.
 */
export function createStreakWarningNotification(streakCount: number): AppNotification {
  return {
    id: generateId(),
    type: 'warning',
    title: '🔥 Streak at Risk!',
    message: `You have a ${streakCount}-day streak going — log today's activities to keep it alive.`,
    timestamp: Date.now(),
  };
}

/**
 * Notifies the user that their streak has been lost.
 */
export function createStreakLostNotification(previousStreak: number): AppNotification {
  return {
    id: generateId(),
    type: 'error',
    title: 'Streak Lost',
    message:
      previousStreak > 0
        ? `Your ${previousStreak}-day streak has ended. Start a new one today!`
        : "Your streak has ended. Start a new one today!",
    timestamp: Date.now(),
  };
}

/**
 * Celebrates a milestone streak achievement.
 */
export function createMilestoneNotification(streakCount: number): AppNotification {
  const milestoneMessages: Record<number, string> = {
    7:   "One full week of eco-tracking — amazing start! 🌱",
    14:  "Two weeks strong! You're building a great habit. 🌿",
    30:  "30 days! A whole month of making a difference. 🌍",
    60:  "60-day streak — you're an eco champion! 🏆",
    100: "100 days! Extraordinary commitment to the planet. 🌟",
  };

  const message =
    milestoneMessages[streakCount] ??
    `${streakCount}-day streak milestone reached. Keep it up!`;

  return {
    id: generateId(),
    type: 'success',
    title: `🎉 ${streakCount}-Day Milestone!`,
    message,
    timestamp: Date.now(),
  };
}

/**
 * Sends a morning reminder to log today's eco activities.
 */
export function createDailyReminderNotification(): AppNotification {
  return {
    id: generateId(),
    type: 'info',
    title: '🌅 Daily Eco Check-in',
    message: "Good morning! Don't forget to log your eco activities for today.",
    timestamp: Date.now(),
  };
}
