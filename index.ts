/**
 * LOG HABITS PAGE — Biophilic Minimalism
 * Step-by-step habit logging flow. One category per screen.
 * Tap-based selections with satisfying animations.
 */
import { useEffect, useState } from 'react';
import { useEco } from '@/contexts/EcoContext';
import { useNotifications } from '@/contexts/NotificationsContext';
import { useAds } from '@/contexts/AdContext';
import { RewardedAdModal } from '@/components/RewardedAdModal';
import {
  calculateScore,
  getImpactCategory,
  getSuggestions,
  type TransportOption,
  type FoodOption,
  type EnergyOption,
  type ShoppingOption,
} from '@/lib/ecoStore';
import { ScoreRing } from '@/components/ScoreRing';
import { useLocation } from 'wouter';
import { habitEvents } from '@/lib/analytics';
import { createMilestoneNotification } from '@/lib/notifications';
import {
  Car, Bus, Bike, Footprints,
  Beef, Salad, Leaf,
  Zap, ZapOff, Minus,
  ShoppingBag, ShoppingCart, Package,
  ArrowLeft, ArrowRight, CheckCircle2,
  Lightbulb,
} from 'lucide-react';

// ─── Step definitions ─────────────────────────────────────────────────────────

type Step = 'transport' | 'food' | 'energy' | 'shopping' | 'result';

interface HabitOption<T> {
  value: T;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const TRANSPORT_OPTIONS: HabitOption<TransportOption>[] = [
  { value: 'car', label: 'Car', icon: <Car size={28} />, description: 'Private vehicle', color: 'oklch(0.577 0.245 27.325)' },
  { value: 'public', label: 'Public', icon: <Bus size={28} />, description: 'Bus, train, metro', color: 'oklch(0.72 0.14 75)' },
  { value: 'bike', label: 'Bike', icon: <Bike size={28} />, description: 'Cycling', color: 'oklch(0.42 0.12 148)' },
  { value: 'walk', label: 'Walk', icon: <Footprints size={28} />, description: 'On foot', color: 'oklch(0.42 0.12 148)' },
];

const FOOD_OPTIONS: HabitOption<FoodOption>[] = [
  { value: 'meat', label: 'Meat', icon: <Beef size={28} />, description: 'Includes red meat or poultry', color: 'oklch(0.577 0.245 27.325)' },
  { value: 'vegetarian', label: 'Vegetarian', icon: <Salad size={28} />, description: 'No meat, may include dairy/eggs', color: 'oklch(0.72 0.14 75)' },
  { value: 'vegan', label: 'Vegan', icon: <Leaf size={28} />, description: 'Fully plant-based', color: 'oklch(0.42 0.12 148)' },
];

const ENERGY_OPTIONS: HabitOption<EnergyOption>[] = [
  { value: 'high', label: 'High', icon: <Zap size={28} />, description: 'Heavy appliance use, heating/AC', color: 'oklch(0.577 0.245 27.325)' },
  { value: 'medium', label: 'Medium', icon: <Minus size={28} />, description: 'Typical daily usage', color: 'oklch(0.72 0.14 75)' },
  { value: 'low', label: 'Low', icon: <ZapOff size={28} />, description: 'Minimal energy consumption', color: 'oklch(0.42 0.12 148)' },
];

const SHOPPING_OPTIONS: HabitOption<ShoppingOption>[] = [
  { value: 'many', label: 'Many', icon: <ShoppingCart size={28} />, description: 'Multiple new purchases', color: 'oklch(0.577 0.245 27.325)' },
  { value: 'few', label: 'Few', icon: <ShoppingBag size={28} />, description: '1–2 items bought', color: 'oklch(0.72 0.14 75)' },
  { value: 'none', label: 'None', icon: <Package size={28} />, description: 'No new purchases', color: 'oklch(0.42 0.12 148)' },
];

const STEPS: Step[] = ['transport', 'food', 'energy', 'shopping', 'result'];

const STEP_META: Record<Exclude<Step, 'result'>, { title: string; subtitle: string; emoji: string }> = {
  transport: { title: 'How did you travel today?', subtitle: 'Select your primary mode of transport', emoji: '🚗' },
  food: { title: 'What did you eat today?', subtitle: 'Choose your main meal type', emoji: '🥗' },
  energy: { title: 'How was your energy use?', subtitle: 'Estimate your home energy consumption', emoji: '⚡' },
  shopping: { title: 'Did you go shopping?', subtitle: 'Count new items you purchased', emoji: '🛍️' },
};

// ─── Option Button ────────────────────────────────────────────────────────────

function OptionBtn<T extends string>({
  option,
  selected,
  onSelect,
}: {
  option: HabitOption<T>;
  selected: boolean;
  onSelect: (v: T) => void;
}) {
  return (
    <button
      onClick={() => onSelect(option.value)}
      className={`habit-btn w-full text-left ${selected ? 'selected' : ''}`}
      style={selected ? { borderColor: option.color, background: `${option.color}18` } : {}}
    >
      <div className="flex items-center gap-4 w-full">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200"
          style={{
            background: selected ? `${option.color}22` : 'oklch(0.93 0.04 148)',
            color: selected ? option.color : 'oklch(0.52 0.06 148)',
          }}
        >
          {option.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{option.label}</p>
          <p className="text-xs text-muted-foreground">{option.description}</p>
        </div>
        {selected && (
          <CheckCircle2 size={20} style={{ color: option.color, flexShrink: 0 }} />
        )}
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LogHabits() {
  const { state, submitLog } = useEco();
  const { addNotification } = useNotifications();
  const { showRewardedAd, setShowRewardedAd, adsWatchedToday, recordAdWatched } = useAds();
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('transport');

  // Track habit logging start
  useEffect(() => {
    habitEvents.logStarted();
  }, []);

  const [transport, setTransport] = useState<TransportOption | null>(null);
  const [food, setFood] = useState<FoodOption | null>(null);
  const [energy, setEnergy] = useState<EnergyOption | null>(null);
  const [shopping, setShopping] = useState<ShoppingOption | null>(null);

  const stepIndex = STEPS.indexOf(currentStep);
  const progress = (stepIndex / (STEPS.length - 1)) * 100;

  const canAdvance = () => {
    if (currentStep === 'transport') return transport !== null;
    if (currentStep === 'food') return food !== null;
    if (currentStep === 'energy') return energy !== null;
    if (currentStep === 'shopping') return shopping !== null;
    return false;
  };

  const handleNext = () => {
    if (currentStep === 'shopping' && transport && food && energy && shopping) {
      const score = calculateScore(transport, food, energy, shopping);
      const category = getImpactCategory(score);
      submitLog({ transport, food, energy, shopping, score, category });
      habitEvents.logCompleted(score, category);

      // Check for milestone and show notification
      const newStreak = (state.goal?.streakCount || 0) + 1;
      const milestoneDays = [7, 14, 30, 60, 100];
      if (milestoneDays.includes(newStreak)) {
        // Delay notification to show after result screen
        setTimeout(() => {
          addNotification(createMilestoneNotification(newStreak));
        }, 1000);
      }

      // Show rewarded ad after result (max 2 per session)
      if (adsWatchedToday < 2) {
        setTimeout(() => {
          setShowRewardedAd(true);
        }, 2500);
      }

      setCurrentStep('result');
    } else {
      const next = STEPS[stepIndex + 1];
      setCurrentStep(next);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setCurrentStep(STEPS[stepIndex - 1]);
    }
  };

  // Result screen
  if (currentStep === 'result' && transport && food && energy && shopping) {
    const score = calculateScore(transport, food, energy, shopping);
    const category = getImpactCategory(score);
    const suggestions = getSuggestions({ transport, food, energy, shopping });

    return (
      <>
        <RewardedAdModal
          isOpen={showRewardedAd}
          onClose={() => setShowRewardedAd(false)}
          onRewardEarned={() => {
            recordAdWatched();
            addNotification({
              id: `reward_${Date.now()}`,
              type: 'encouragement',
              title: 'Reward Unlocked! 🎁',
              message: 'You\'ve unlocked detailed eco insights. Check your progress page!',
              icon: '🎁',
              color: 'oklch(0.55 0.13 148)',
              createdAt: Date.now(),
            });
          }}
        />
        <div className="min-h-screen pb-24 px-4 pt-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6 animate-fade-up">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">
              Today's Result
            </p>
            <h1 className="font-['Fraunces'] font-black text-2xl text-foreground">
              Your Eco Score
            </h1>
          </div>

          <div className="eco-card p-6 flex flex-col items-center animate-fade-up animate-fade-up-delay-1">
            <ScoreRing score={score} category={category} size={180} animate />
          </div>

          <div className="eco-card p-5 mt-4 animate-fade-up animate-fade-up-delay-2">
            <h2 className="font-['Fraunces'] font-bold text-base text-foreground mb-3 flex items-center gap-2">
              <Lightbulb size={18} className="text-[oklch(0.72_0.14_75)]" />
              Personalized Suggestions
            </h2>
            <ul className="space-y-3">
              {suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ background: 'oklch(0.42 0.12 148)' }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">{s}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="eco-card p-5 mt-4 animate-fade-up animate-fade-up-delay-3">
            <h2 className="font-['Fraunces'] font-bold text-base text-foreground mb-3">
              Today's Summary
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Transport', value: transport },
                { label: 'Food', value: food },
                { label: 'Energy', value: energy },
                { label: 'Shopping', value: shopping },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted/50 rounded-xl p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                  <p className="text-sm font-semibold text-foreground capitalize mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 bg-primary text-primary-foreground py-3.5 rounded-2xl font-semibold text-sm hover:bg-primary/90 transition-colors animate-fade-up animate-fade-up-delay-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
      </>
    );
  }

  // Already logged today
  if (state.hasLoggedToday && currentStep === 'transport') {
    return (
      <div className="min-h-screen pb-24 px-4 pt-16 flex flex-col items-center">
        <div className="eco-card p-8 max-w-sm w-full text-center animate-fade-up">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: 'oklch(0.93 0.04 148)' }}
          >
            <CheckCircle2 size={40} className="text-primary" />
          </div>
          <h2 className="font-['Fraunces'] font-black text-xl text-foreground mb-2">
            Already logged today!
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            You've already tracked your habits for today. Come back tomorrow to keep your streak going.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-primary text-primary-foreground py-3 rounded-2xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            View Dashboard
          </button>
        </div>
      </div>
    );
  }

  const meta = STEP_META[currentStep as Exclude<Step, 'result'>];

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="px-4 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-6">
          {stepIndex > 0 && (
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                Step {stepIndex + 1} of {STEPS.length - 1}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="animate-fade-up">
          <span className="text-3xl">{meta.emoji}</span>
          <h1 className="font-['Fraunces'] font-black text-2xl text-foreground mt-2 leading-tight">
            {meta.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{meta.subtitle}</p>
        </div>
      </div>

      {/* Options */}
      <div className="px-4 space-y-3 animate-fade-up animate-fade-up-delay-1">
        {currentStep === 'transport' &&
          TRANSPORT_OPTIONS.map((opt) => (
            <OptionBtn
              key={opt.value}
              option={opt}
              selected={transport === opt.value}
              onSelect={setTransport}
            />
          ))}
        {currentStep === 'food' &&
          FOOD_OPTIONS.map((opt) => (
            <OptionBtn
              key={opt.value}
              option={opt}
              selected={food === opt.value}
              onSelect={setFood}
            />
          ))}
        {currentStep === 'energy' &&
          ENERGY_OPTIONS.map((opt) => (
            <OptionBtn
              key={opt.value}
              option={opt}
              selected={energy === opt.value}
              onSelect={setEnergy}
            />
          ))}
        {currentStep === 'shopping' &&
          SHOPPING_OPTIONS.map((opt) => (
            <OptionBtn
              key={opt.value}
              option={opt}
              selected={shopping === opt.value}
              onSelect={setShopping}
            />
          ))}
      </div>

      {/* Next Button */}
      <div className="px-4 mt-6">
        <button
          onClick={handleNext}
          disabled={!canAdvance()}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98]"
        >
          {currentStep === 'shopping' ? 'See My Score' : 'Continue'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
