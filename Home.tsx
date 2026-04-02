/**
 * USE STREAK NOTIFICATIONS HOOK
 * Manages streak-based notification logic and triggers
 */
import { useEffect, useRef } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useEco } from '@/contexts/EcoContext';
import { getTodayString } from '@/lib/ecoStore';
import {
  createStreakWarningNotification,
  createStreakLostNotification,
  createMilestoneNotification,
  createDailyReminderNotification,
} from '@/lib/notifications';

const NOTIFICATION_SHOWN_KEY = 'eco_tracker_notifications_shown_v1';

interface NotificationShownRecord {
  date: string;
  types: string[];
}

/**
 * Get the notification record for today
 */
function getTodayNotificationRecord(): NotificationShownRecord {
  try {
    const stored = localStorage.getItem(NOTIFICATION_SHOWN_KEY);
    const record = stored ? JSON.parse(stored) : { date: '', types: [] };
    const today = getTodayString();

    // Reset if it's a new day
    if (record.date !== today) {
      return { date: today, types: [] };
    }

    return record;
  } catch {
    return { date: getTodayString(), types: [] };
  }
}

/**
 * Save notification record to localStorage
 */
function saveNotificationRecord(record: NotificationShownRecord): void {
  try {
    localStorage.setItem(NOTIFICATION_SHOWN_KEY, JSON.stringify(record));
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Check if a notification type has already been shown today
 */
function hasShownNotificationToday(type: string): boolean {
  const record = getTodayNotificationRecord();
  return record.types.includes(type);
}

/**
 * Mark a notification type as shown today
 */
function markNotificationAsShown(type: string): void {
  const record = getTodayNotificationRecord();
  if (!record.types.includes(type)) {
    record.types.push(type);
    saveNotificationRecord(record);
  }
}

export function useStreakNotifications() {
  const { addNotification } = useNotifications();
  const { state } = useEco();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run once per component mount
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const today = getTodayString();
    const todayLog = state.logs.find((l) => l.date === today);
    const currentStreak = state.goal?.streakCount || 0;

    // 1. Check if user hasn't logged today and has an active streak
    if (!todayLog && currentStreak > 0 && state.goal) {
      // Show streak warning notification
      if (!hasShownNotificationToday('streak_warning')) {
        // Add a small delay to avoid notification spam on page load
        const timer = setTimeout(() => {
          addNotification(createStreakWarningNotification(currentStreak));
          markNotificationAsShown('streak_warning');
        }, 500);

        return () => clearTimeout(timer);
      }
    }

    // 2. Check for milestone achievements (only on log submission, handled elsewhere)
    // This is a safety check for milestone notifications
    if (todayLog && !hasShownNotificationToday('milestone')) {
      const milestoneDays = [7, 14, 30, 60, 100];
      if (milestoneDays.includes(currentStreak)) {
        addNotification(createMilestoneNotification(currentStreak));
        markNotificationAsShown('milestone');
      }
    }

    // 3. Show daily reminder (once per day, in the morning)
    if (!hasShownNotificationToday('daily_reminder') && !todayLog) {
      const now = new Date();
      const hour = now.getHours();

      // Show reminder between 8 AM and 9 AM
      if (hour >= 8 && hour < 9) {
        const timer = setTimeout(() => {
          addNotification(createDailyReminderNotification());
          markNotificationAsShown('daily_reminder');
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [state.logs, state.goal, addNotification]);
}
