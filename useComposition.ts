/**
 * SHARE MODAL — Biophilic Minimalism
 * Modal for selecting social platform to share milestone achievements
 */
import { X } from 'lucide-react';
import { shareAchievement, getPlatformInfo, type SocialPlatform } from '@/lib/socialSharing';

const PLATFORMS: SocialPlatform[] = ['twitter', 'facebook', 'whatsapp', 'copy'];

interface ShareModalProps {
  streak: number;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ streak, isOpen, onClose }: ShareModalProps) {
  if (!isOpen) return null;

  const handleShare = (platform: SocialPlatform) => {
    shareAchievement(streak, platform);
    // Show success feedback
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full bg-card text-card-foreground rounded-t-3xl p-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Fraunces'] font-bold text-xl">Share Your Achievement 🎉</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-6">
          You've reached a {streak}-day streak! Share your eco-friendly journey and inspire others.
        </p>

        {/* Platform Buttons */}
        <div className="space-y-3">
          {PLATFORMS.map((platform) => {
            const info = getPlatformInfo(platform);
            return (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 transition-all duration-200 active:scale-95"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg font-semibold"
                  style={{
                    background: `${info.color}18`,
                    color: info.color,
                  }}
                >
                  {info.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{info.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {platform === 'copy' ? 'Copy to clipboard' : `Share on ${info.label}`}
                  </p>
                </div>
                <span className="text-muted-foreground text-lg">→</span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
