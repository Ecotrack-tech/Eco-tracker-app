/**
 * DETAILED INSIGHTS — Biophilic Minimalism
 * Unlocked after watching rewarded ad
 * Shows deeper eco impact analysis
 */
import { TrendingDown, TrendingUp, AlertCircle, Leaf } from 'lucide-react';
import type { DailyLog } from '@/lib/ecoStore';

interface DetailedInsightsProps {
  log: DailyLog;
}

export function DetailedInsights({ log }: DetailedInsightsProps) {
  const getImpactBreakdown = () => {
    const scores = {
      transport: log.transport === 'car' ? 30 : log.transport === 'public' ? 15 : 5,
      food: log.food === 'meat' ? 25 : log.food === 'vegetarian' ? 15 : 10,
      energy: log.energy === 'high' ? 20 : log.energy === 'medium' ? 10 : 5,
      shopping: log.shopping === 'many' ? 15 : log.shopping === 'few' ? 8 : 0,
    };
    return scores;
  };

  const breakdown = getImpactBreakdown();
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4">
      {/* Impact Breakdown */}
      <div className="eco-card p-5">
        <h3 className="font-['Fraunces'] font-bold text-base text-foreground mb-4 flex items-center gap-2">
          <Leaf size={18} className="text-primary" />
          Impact Breakdown
        </h3>
        <div className="space-y-3">
          {Object.entries(breakdown).map(([category, score]) => (
            <div key={category} className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground capitalize">{category}</p>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(score / 30) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-semibold text-foreground min-w-[2rem] text-right">
                {score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Highest Impact Area */}
      <div className="eco-card p-5">
        <h3 className="font-['Fraunces'] font-bold text-base text-foreground mb-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-[oklch(0.72_0.14_75)]" />
          Highest Impact
        </h3>
        <p className="text-sm text-foreground">
          {breakdown.transport === Math.max(...Object.values(breakdown))
            ? '🚗 Your transport choice had the biggest impact today. Consider using public transit or biking for shorter trips.'
            : breakdown.food === Math.max(...Object.values(breakdown))
            ? '🍖 Your food choices contributed most to your footprint. Try reducing meat consumption by one meal.'
            : breakdown.energy === Math.max(...Object.values(breakdown))
            ? '⚡ High energy usage was your main impact. Look for ways to reduce consumption at home.'
            : '🛍️ Shopping activity contributed significantly. Consider buying secondhand or reducing purchases.'}
        </p>
      </div>

      {/* Comparison */}
      <div className="eco-card p-5">
        <h3 className="font-['Fraunces'] font-bold text-base text-foreground mb-3 flex items-center gap-2">
          <TrendingDown size={18} className="text-primary" />
          How to Improve
        </h3>
        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Walk or bike for trips under 2km</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Replace one meat meal with a plant-based alternative</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Turn off lights and unplug devices when not in use</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary font-bold">•</span>
            <span>Buy only what you need, choose quality over quantity</span>
          </li>
        </ul>
      </div>

      {/* Score Interpretation */}
      <div className="eco-card p-5 bg-gradient-to-br from-primary/10 to-primary/5 border-l-4 border-primary">
        <p className="text-xs text-muted-foreground mb-2">YOUR SCORE TODAY</p>
        <p className="text-2xl font-['Fraunces'] font-bold text-foreground">
          {log.score} / 100
        </p>
        <p className="text-xs text-foreground mt-2">
          {log.score <= 40
            ? '✅ Low impact — Great eco choices!'
            : log.score <= 70
            ? '⚠️ Medium impact — Room for improvement'
            : '❌ High impact — Focus on reducing your footprint'}
        </p>
      </div>
    </div>
  );
}
