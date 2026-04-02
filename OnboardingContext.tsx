/**
 * REWARDED AD MODAL — Biophilic Minimalism
 * Displays rewarded ad offer after habit logging
 * Users can choose to watch for deeper insights
 */
import { useState } from 'react';
import { X, Zap, Eye } from 'lucide-react';
import { showRewardedAd, trackAdImpression, trackAdCompletion } from '@/lib/admob';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned: () => void;
}

export function RewardedAdModal({ isOpen, onClose, onRewardEarned }: RewardedAdModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);

  if (!isOpen) return null;

  const handleWatchAd = async () => {
    setIsLoading(true);
    trackAdImpression('rewarded');

    try {
      setIsWatching(true);
      await showRewardedAd(
        () => {
          // Reward earned
          trackAdCompletion('rewarded');
          onRewardEarned();
          setIsWatching(false);
          setIsLoading(false);
          // Auto-close after reward
          setTimeout(() => onClose(), 1000);
        },
        () => {
          // Ad closed
          setIsWatching(false);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error showing ad:', error);
      setIsWatching(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm mx-4 bg-card text-card-foreground rounded-2xl p-6 shadow-2xl animate-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
            <Zap size={24} className="text-amber-600" />
          </div>
          <h2 className="font-['Fraunces'] font-bold text-lg">Unlock Deeper Insights</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Watch a quick ad to get detailed eco impact analysis
          </p>
        </div>

        {/* Benefits */}
        <div className="space-y-2 mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <Eye size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground">
              <span className="font-semibold">Detailed breakdown</span> of your eco impact by category
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Zap size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground">
              <span className="font-semibold">Personalized tips</span> to improve your score next week
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleWatchAd}
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isLoading ? 'oklch(0.55 0.13 148 / 0.7)' : 'oklch(0.55 0.13 148)',
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span>
                {isWatching ? 'Watching ad...' : 'Loading...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Eye size={16} />
                Watch Ad (30 seconds)
              </span>
            )}
          </button>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl font-semibold text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Maybe Later
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Ads help us keep Eco Tracker free and ad-supported 🌱
        </p>
      </div>
    </div>
  );
}
