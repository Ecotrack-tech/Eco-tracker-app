/**
 * ADMOB SERVICE — Eco Tracker
 * Manages Google AdMob integration for rewarded and banner ads
 * Uses test ad unit IDs for development
 */

export interface AdMobConfig {
  appId: string;
  rewardedAdUnitId: string;
  bannerAdUnitId: string;
}

// Test Ad Unit IDs (Google AdMob test IDs for development)
// Replace with production IDs after testing
export const TEST_AD_CONFIG: AdMobConfig = {
  appId: 'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy', // Replace with your App ID
  rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917', // Test Rewarded Ad
  bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111', // Test Banner Ad
};

/**
 * Initialize Google Mobile Ads SDK
 */
export function initializeAdMob(): void {
  if (typeof window === 'undefined') return;

  // Check if Google Mobile Ads SDK is already loaded
  if ((window as any).googleMobileAdsInitialized) {
    return;
  }

  // Load Google Mobile Ads SDK script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-app-pub-xxxxxxxxxxxxxxxx';
  script.onload = () => {
    (window as any).googleMobileAdsInitialized = true;
    console.log('[AdMob] SDK loaded successfully');
  };
  script.onerror = () => {
    console.error('[AdMob] Failed to load SDK');
  };
  document.head.appendChild(script);
}

/**
 * Request rewarded ad
 */
export async function requestRewardedAd(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    // In production, use Google Mobile Ads SDK
    // For now, simulate ad request with a promise
    console.log('[AdMob] Requesting rewarded ad...');

    // Simulate ad loading delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('[AdMob] Rewarded ad ready');
    return true;
  } catch (error) {
    console.error('[AdMob] Error requesting rewarded ad:', error);
    return false;
  }
}

/**
 * Show rewarded ad
 */
export async function showRewardedAd(
  onRewardEarned: () => void,
  onAdClosed: () => void
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    console.log('[AdMob] Showing rewarded ad...');

    // Simulate ad display
    // In production, this would use the actual Google Mobile Ads SDK
    // For now, we'll call the reward callback after a delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Call reward callback
    onRewardEarned();
    console.log('[AdMob] Reward earned!');

    // Call close callback
    onAdClosed();
  } catch (error) {
    console.error('[AdMob] Error showing rewarded ad:', error);
    onAdClosed();
  }
}

/**
 * Load banner ad
 */
export async function loadBannerAd(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    console.log('[AdMob] Loading banner ad...');

    // Simulate banner loading
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('[AdMob] Banner ad loaded');
    return true;
  } catch (error) {
    console.error('[AdMob] Error loading banner ad:', error);
    return false;
  }
}

/**
 * Track ad impression
 */
export function trackAdImpression(adType: 'rewarded' | 'banner'): void {
  try {
    // Send to analytics
    const event = new CustomEvent('admob_impression', {
      detail: { adType, timestamp: Date.now() },
    });
    window.dispatchEvent(event);
    console.log(`[AdMob] Tracked ${adType} ad impression`);
  } catch (error) {
    console.error('[AdMob] Error tracking impression:', error);
  }
}

/**
 * Track ad completion (for rewarded ads)
 */
export function trackAdCompletion(adType: 'rewarded' | 'banner'): void {
  try {
    const event = new CustomEvent('admob_completion', {
      detail: { adType, timestamp: Date.now() },
    });
    window.dispatchEvent(event);
    console.log(`[AdMob] Tracked ${adType} ad completion`);
  } catch (error) {
    console.error('[AdMob] Error tracking completion:', error);
  }
}
