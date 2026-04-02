/**
 * NOTIFICATIONS CONTEXT — Eco Tracker
 * Manages in-app notifications state and lifecycle
 */
import React, { createContext, useCallback, useContext, useState } from 'react';
import type { Notification } from '@/lib/notifications';

interface NotificationsContextValue {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);

    // Auto-dismiss after 6 seconds for non-action notifications
    if (!notification.action) {
      const timer = setTimeout(() => {
        dismissNotification(notification.id);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, dismissedAt: Date.now() } : notif
      )
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ notifications, addNotification, dismissNotification, clearNotifications }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
