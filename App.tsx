/**
 * NOTIFICATIONS SERVICE — Eco Tracker
 * Manages in-app notifications for streak reminders and engagement prompts
 */

export type NotificationType = 'streak_warning' | 'streak_lost' | 'daily_reminder' | 'milestone' | 'encouragement';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon: string;
  color: string;
  action?: {
    label: string;
    href: string;
  };
  shareAction?: {
    label: string;
    streak: number;
  };
  createdAt: number;
  dismissedAt?: number;
}

/**
 * Generate a unique ID for notifications
 */
function generateId(): string {
  return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create a streak warning notification (user hasn't logged today)
 */
export function createStreakWarningNotification(streak: number): Notification {
  return {
    id: generateId(),
    type: 'streak_warning',
    title: `Keep your ${streak}-day streak alive! 🔥`,
    message: 'You haven\'t logged your habits today. Log now to maintain your streak.',
    icon: '🔥',
    color: 'oklch(0.72 0.14 75)', // Amber/warning color
    action: {
      label: 'Log Now',
      href: '/log',
    },
    createdAt: Date.now(),
  };
}

/**
 * Create a streak lost notification
 */
export function createStreakLostNotification(previousStreak: number): Notification {
  return {
    id: generateId(),
    type: 'streak_lost',
    title: 'Streak lost 😢',
    message: `Your ${previousStreak}-day streak ended. Don't worry, every day is a fresh start!`,
    icon: '😢',
    color: 'oklch(0.577 0.245 27.325)', // Red/destructive
    action: {
      label: 'Start Fresh',
      href: '/log',
    },
    createdAt: Date.now(),
  };
}

/**
 * Create a daily reminder notification
 */
export function createDailyReminderNotification(): Notification {
  return {
    id: generateId(),
    type: 'daily_reminder',
    title: 'Time to log your habits 📝',
    message: 'Take 60 seconds to track your eco choices today.',
    icon: '📝',
    color: 'oklch(0.42 0.12 148)', // Primary green
    action: {
      label: 'Log Habits',
      href: '/log',
    },
    createdAt: Date.now(),
  };
}

/**
 * Create a milestone notification (7, 14, 30, 60, 100 days)
 */
export function createMilestoneNotification(streak: number): Notification {
  const milestoneMessages: Record<number, string> = {
    7: '🌱 You\'ve been eco-conscious for a week!',
    14: '🌿 Two weeks of sustainable choices!',
    30: '🌳 A full month of eco impact!',
    60: '🌲 60 days of making a difference!',
    100: '🏆 100 days! You\'re an eco champion!',
  };

  const message = milestoneMessages[streak] || `${streak} days of eco-friendly habits!`;

  return {
    id: generateId(),
    type: 'milestone',
    title: `Milestone: ${streak}-day streak! 🎉`,
    message,
    icon: '🎉',
    color: 'oklch(0.55 0.13 148)', // Success green
    shareAction: {
      label: 'Share Achievement',
      streak,
    },
    createdAt: Date.now(),
  };
}

/**
 * Create an encouragement notification
 */
export function createEncouragementNotification(): Notification {
  const messages = [
    {
      title: 'Small steps, big impact 🌍',
      message: 'Every eco-friendly choice you make helps protect our planet.',
    },
    {
      title: 'You\'re doing great! 💪',
      message: 'Your consistent logging shows real commitment to sustainability.',
    },
    {
      title: 'Keep the momentum! 🚀',
      message: 'Your daily habits are creating lasting change.',
    },
  ];

  const randomMsg = messages[Math.floor(Math.random() * messages.length)];

  return {
    id: generateId(),
    type: 'encouragement',
    title: randomMsg.title,
    message: randomMsg.message,
    icon: '✨',
    color: 'oklch(0.55 0.13 148)',
    createdAt: Date.now(),
  };
}

/**
 * Check if a notification should be dismissed (older than 7 days)
 */
export function shouldDismissNotification(notification: Notification): boolean {
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
  return Date.now() - notification.createdAt > sevenDaysInMs;
}
