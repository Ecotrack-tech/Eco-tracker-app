/**
 * BANNER AD — Biophilic Minimalism
 * Non-intrusive banner ad displayed at bottom of dashboard
 * Fixed position, minimal visual weight
 */
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { loadBannerAd, trackAdImpression } from '@/lib/admob';

interface BannerAdProps {
  visible?: boolean;
}

export function BannerAd({ visible = true }: BannerAdProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!visible || isDismissed) return;

    const loadAd = async () => {
      const loaded = await loadBannerAd();
      if (loaded) {
        setIsLoaded(true);
        trackAdImpression('banner');
      }
    };

    loadAd();
  }, [visible, isDismissed]);

  if (!visible || isDismissed || !isLoaded) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-muted/80 to-muted/40 backdrop-blur-sm border-t border-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        {/* Ad Content */}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium">
            💚 Support Eco Tracker — Ad-free version coming soon
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="ml-2 text-muted-foreground hover:text-foreground transition-colors p-1 flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
