/**
 * ECO TRACKER — Data Store & Scoring Logic
 * Biophilic Minimalism design system
 * Persists to localStorage for MVP demo purposes.
 */

export type TransportOption = 'car' | 'public' | 'bike' | 'walk';
export type FoodOption = 'meat' | 'vegetarian' | 'vegan';
export type EnergyOption = 'high' | 'medium' | 'low';
export type ShoppingOption = 'many' | 'few' | 'none';
export type GoalType = 'transport' | 'food' | 'energy';
export type ImpactCategory = 'Low' | 'Medium' | 'High';

export interface DailyLog {
  date: string; // ISO date string YYYY-MM-DD
  transport: TransportOption;
  food: FoodOption;
  energy: EnergyOption;
  shopping: ShoppingOption;
  score: number;
  category: ImpactCategory;
}

export interface UserGoal {
  type: GoalType;
  streakCount: number;
  lastCompletedDate: string | null;
}

export interface EcoState {
  logs: DailyLog[];
  goal: UserGoal | null;
  hasLoggedToday: boolean;
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

const TRANSPORT_SCORES: Record<TransportOption, number> = {
  car: 30,
  public: 15,
  bike: 5,
  walk: 5,
};

const FOOD_SCORES: Record<FoodOption, number> = {
  meat: 25,
  vegetarian: 15,
  vegan: 10,
};

const ENERGY_SCORES: Record<EnergyOption, number> = {
  high: 20,
  medium: 10,
  low: 5,
};

const SHOPPING_SCORES: Record<ShoppingOption, number> = {
  many: 15,
  few: 8,
  none: 0,
};

export function calculateScore(
  transport: TransportOption,
  food: FoodOption,
  energy: EnergyOption,
  shopping: ShoppingOption
): number {
  const raw =
    TRANSPORT_SCORES[transport] +
    FOOD_SCORES[food] +
    ENERGY_SCORES[energy] +
    SHOPPING_SCORES[shopping];
  // Normalize to 0-100 (max possible = 30+25+20+15 = 90)
  return Math.min(100, Math.round((raw / 90) * 100));
}

export function getImpactCategory(score: number): ImpactCategory {
  if (score <= 40) return 'Low';
  if (score <= 70) return 'Medium';
  return 'High';
}

// ─── Suggestions ─────────────────────────────────────────────────────────────

export function getSuggestions(log: Omit<DailyLog, 'date' | 'score' | 'category'>): string[] {
  const suggestions: string[] = [];

  if (log.transport === 'car') {
    suggestions.push('Try public transport or cycling for your next commute.');
    suggestions.push('Consider carpooling to halve your transport emissions.');
  } else if (log.transport === 'public') {
    suggestions.push('Great choice using public transport! Try cycling for short trips.');
  }

  if (log.food === 'meat') {
    suggestions.push('Swap one meat meal for a plant-based option tomorrow.');
    suggestions.push('Try a vegetarian lunch — it can cut food emissions by 40%.');
  } else if (log.food === 'vegetarian') {
    suggestions.push('Excellent! Going fully vegan even once a week makes a big difference.');
  }

  if (log.energy === 'high') {
    suggestions.push('Turn off unused appliances and lower your thermostat by 2°C.');
    suggestions.push('Switch to LED bulbs — they use 75% less energy.');
  } else if (log.energy === 'medium') {
    suggestions.push('Try air-drying clothes instead of using a dryer.');
  }

  if (log.shopping === 'many') {
    suggestions.push('Consider a no-buy day tomorrow to offset today\'s shopping.');
    suggestions.push('Buy second-hand or borrow items when possible.');
  } else if (log.shopping === 'few') {
    suggestions.push('Great restraint! Try to repair items before replacing them.');
  }

  // Return 2–3 most relevant suggestions
  return suggestions.slice(0, 3);
}

// ─── Persistence ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'eco_tracker_v1';

export function loadState(): EcoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as EcoState;
  } catch {
    // ignore
  }
  return { logs: [], goal: null, hasLoggedToday: false };
}

export function saveState(state: EcoState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getWeeklyAverage(logs: DailyLog[]): number {
  const recent = logs.slice(-7);
  if (recent.length === 0) return 0;
  return Math.round(recent.reduce((sum, l) => sum + l.score, 0) / recent.length);
}

export function getWeeklyLogs(logs: DailyLog[]): DailyLog[] {
  return logs.slice(-7);
}

export function checkStreakUpdate(goal: UserGoal, log: DailyLog): UserGoal {
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Check if goal was met today
  let goalMet = false;
  if (goal.type === 'transport' && (log.transport === 'bike' || log.transport === 'walk' || log.transport === 'public')) {
    goalMet = true;
  } else if (goal.type === 'food' && (log.food === 'vegetarian' || log.food === 'vegan')) {
    goalMet = true;
  } else if (goal.type === 'energy' && log.energy === 'low') {
    goalMet = true;
  }

  if (!goalMet) return goal;

  const newStreak =
    goal.lastCompletedDate === yesterdayStr
      ? goal.streakCount + 1
      : goal.lastCompletedDate === today
      ? goal.streakCount
      : 7; // Start streak at day 7 instead of day 1

  return { ...goal, streakCount: newStreak, lastCompletedDate: today };
}

// ─── Seed demo data ───────────────────────────────────────────────────────────

export function seedDemoData(): EcoState {
  const transports: TransportOption[] = ['car', 'public', 'bike', 'walk', 'public', 'bike', 'car'];
  const foods: FoodOption[] = ['meat', 'vegetarian', 'vegan', 'vegetarian', 'meat', 'vegan', 'vegetarian'];
  const energies: EnergyOption[] = ['high', 'medium', 'low', 'medium', 'high', 'low', 'medium'];
  const shoppings: ShoppingOption[] = ['many', 'few', 'none', 'few', 'none', 'none', 'few'];

  const logs: DailyLog[] = transports.map((transport, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (7 - i));
    const score = calculateScore(transport, foods[i], energies[i], shoppings[i]);
    return {
      date: date.toISOString().split('T')[0],
      transport,
      food: foods[i],
      energy: energies[i],
      shopping: shoppings[i],
      score,
      category: getImpactCategory(score),
    };
  });

  return {
    logs,
    goal: { type: 'transport', streakCount: 3, lastCompletedDate: logs[logs.length - 2].date },
    hasLoggedToday: false,
  };
}
