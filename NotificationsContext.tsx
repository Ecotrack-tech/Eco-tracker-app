/**
 * NOTIFICATION CENTER — Biophilic Minimalism
 * Displays stacked notifications with smooth animations
 */
import { useState } from 'react';
import { useNotifications } from '@/contexts/NotificationsContext';
import { X, Share2 } from 'lucide-react';
import { Link } from 'wouter';
import { ShareModal } from './ShareModal';

export function NotificationCenter() {
  const { notifications, dismissNotification } = useNotifications();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareStreak, setShareStreak] = useState(0);

  // Filter out dismissed notifications
  const activeNotifications = notifications.filter((n) => !n.dismissedAt);

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-24 right-4 left-4 max-w-sm mx-auto pointer-events-none z-40 space-y-3">
        {activeNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className="pointer-events-auto animate-slide-up"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div
            className="eco-card p-4 border-l-4 shadow-lg"
            style={{ borderLeftColor: notification.color }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                style={{
                  background: `${notification.color}18`,
                  color: notification.color,
                }}
              >
                {notification.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm leading-tight">
                  {notification.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {notification.message}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2.5">
                  {notification.action && (
                    <Link href={notification.action.href}>
                      <button
                        className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95"
                        style={{
                          background: notification.color,
                          color: 'white',
                        }}
                      >
                        {notification.action.label}
                      </button>
                    </Link>
                  )}
                  {notification.shareAction && (
                    <button
                      onClick={() => {
                        setShareStreak(notification.shareAction!.streak);
                        setShareModalOpen(true);
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95 flex items-center gap-1"
                      style={{
                        background: notification.color,
                        color: 'white',
                      }}
                    >
                      <Share2 size={12} />
                      {notification.shareAction.label}
                    </button>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => dismissNotification(notification.id)}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
        ))}
      </div>
      <ShareModal
        streak={shareStreak}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </>
  );
}
