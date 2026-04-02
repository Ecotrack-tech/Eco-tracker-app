/**
 * SOCIAL SHARING SERVICE — Eco Tracker
 * Generates share links and messages for social platforms
 */

export type SocialPlatform = 'twitter' | 'facebook' | 'whatsapp' | 'copy';

export interface ShareData {
  streak: number;
  platform: SocialPlatform;
  url?: string;
}

/**
 * Generate share message for a milestone
 */
export function generateShareMessage(streak: number): string {
  const messages: Record<number, string> = {
    7: `🌱 I've been eco-conscious for a week! I'm tracking my daily habits to reduce my environmental impact. Join me on Eco Tracker!`,
    14: `🌿 14 days of sustainable choices! Every small action counts. I'm on a journey to reduce my carbon footprint with Eco Tracker.`,
    30: `🌳 30 days of eco-friendly habits! I'm committed to making a difference for our planet. Track your impact too!`,
    60: `🌲 60 days of sustainable living! I've logged 60 days of eco-conscious choices. Let's build a greener future together.`,
    100: `🏆 100 DAYS! I've reached 100 days of tracking my eco impact. I'm an eco champion! Join the movement on Eco Tracker.`,
  };

  return messages[streak] || `I've reached a ${streak}-day streak on Eco Tracker! Join me in making sustainable choices every day.`;
}

/**
 * Get the share URL for a platform
 */
export function getShareUrl(platform: SocialPlatform, message: string, appUrl?: string): string {
  const baseUrl = appUrl || 'https://eco-tracker.app';
  const encodedMessage = encodeURIComponent(message);
  const encodedUrl = encodeURIComponent(baseUrl);

  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;

    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMessage}`;

    case 'whatsapp':
      return `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;

    case 'copy':
      return message;

    default:
      return '';
  }
}

/**
 * Open share link in a new window
 */
export function openShareWindow(url: string, platform: SocialPlatform): void {
  if (platform === 'copy') {
    // Copy to clipboard
    navigator.clipboard.writeText(url).catch((err) => {
      console.error('Failed to copy to clipboard:', err);
    });
    return;
  }

  // Open in new window for social platforms
  const width = 600;
  const height = 400;
  const left = window.innerWidth / 2 - width / 2;
  const top = window.innerHeight / 2 - height / 2;

  window.open(
    url,
    'Share',
    `width=${width},height=${height},left=${left},top=${top}`
  );
}

/**
 * Share milestone achievement
 */
export function shareAchievement(
  streak: number,
  platform: SocialPlatform,
  appUrl?: string
): void {
  const message = generateShareMessage(streak);
  const shareUrl = getShareUrl(platform, message, appUrl);
  openShareWindow(shareUrl, platform);
}

/**
 * Get platform display info
 */
export function getPlatformInfo(platform: SocialPlatform) {
  const info: Record<SocialPlatform, { label: string; icon: string; color: string }> = {
    twitter: {
      label: 'Twitter',
      icon: '𝕏',
      color: 'oklch(0.235 0.015 65)', // Black
    },
    facebook: {
      label: 'Facebook',
      icon: 'f',
      color: 'oklch(0.42 0.12 261)', // Facebook blue
    },
    whatsapp: {
      label: 'WhatsApp',
      icon: '💬',
      color: 'oklch(0.55 0.15 142)', // WhatsApp green
    },
    copy: {
      label: 'Copy Link',
      icon: '📋',
      color: 'oklch(0.42 0.12 148)', // Primary green
    },
  };

  return info[platform];
}
