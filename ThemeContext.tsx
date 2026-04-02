/**
 * SCORE RING — Biophilic Minimalism
 * Animated SVG ring showing eco score with leaf-petal aesthetic
 */
import { useEffect, useState } from 'react';
import type { ImpactCategory } from '@/lib/ecoStore';

interface ScoreRingProps {
  score: number;
  category: ImpactCategory;
  size?: number;
  animate?: boolean;
}

const CATEGORY_COLORS: Record<ImpactCategory, { stroke: string; text: string; bg: string; label: string }> = {
  Low: {
    stroke: 'oklch(0.42 0.12 148)',
    text: 'text-[oklch(0.42_0.12_148)]',
    bg: 'bg-[oklch(0.42_0.12_148)]',
    label: 'Low Impact 🌿',
  },
  Medium: {
    stroke: 'oklch(0.72 0.14 75)',
    text: 'text-[oklch(0.72_0.14_75)]',
    bg: 'bg-[oklch(0.72_0.14_75)]',
    label: 'Medium Impact 🌤️',
  },
  High: {
    stroke: 'oklch(0.577 0.245 27.325)',
    text: 'text-[oklch(0.577_0.245_27.325)]',
    bg: 'bg-[oklch(0.577_0.245_27.325)]',
    label: 'High Impact ⚠️',
  },
};

export function ScoreRing({ score, category, size = 180, animate = true }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;
  const colors = CATEGORY_COLORS[category];

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    setDisplayScore(0);
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Spring-like easing
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score, animate]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.88 0.04 148)"
            strokeWidth={10}
          />
          {/* Score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={10}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-['Fraunces'] font-black leading-none"
            style={{ fontSize: size * 0.28, color: colors.stroke }}
          >
            {displayScore}
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">/ 100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold px-3 py-1 rounded-full text-white ${colors.bg}`}>
        {colors.label}
      </span>
    </div>
  );
}
