/**
 * ECO TRACKER — Global State Context
 * Biophilic Minimalism design system
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  type DailyLog,
  type EcoState,
  type GoalType,
  type UserGoal,
  checkStreakUpdate,
  loadState,
  saveState,
  seedDemoData,
  getTodayString,
} from '@/lib/ecoStore';

interface EcoContextValue {
  state: EcoState;
  submitLog: (log: Omit<DailyLog, 'date'>) => void;
  setGoal: (type: GoalType) => void;
  resetToday: () => void;
}

const EcoContext = createContext<EcoContextValue | null>(null);

export function EcoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EcoState>(() => {
    const loaded = loadState();
    // Seed demo data if no logs exist
    if (loaded.logs.length === 0) {
      return seedDemoData();
    }
    // Check if today's log exists
    const today = getTodayString();
    const hasLoggedToday = loaded.logs.some((l) => l.date === today);
    return { ...loaded, hasLoggedToday };
  });

  // Persist on every state change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const submitLog = useCallback((log: Omit<DailyLog, 'date'>) => {
    const today = getTodayString();
    setState((prev) => {
      // Remove existing today log if any
      const filtered = prev.logs.filter((l) => l.date !== today);
      const newLog: DailyLog = { ...log, date: today };
      const updatedLogs = [...filtered, newLog].sort((a, b) => a.date.localeCompare(b.date));

      let updatedGoal = prev.goal;
      if (updatedGoal) {
        updatedGoal = checkStreakUpdate(updatedGoal, newLog);
      }

      return {
        ...prev,
        logs: updatedLogs,
        goal: updatedGoal,
        hasLoggedToday: true,
      };
    });
  }, []);

  const setGoal = useCallback((type: GoalType) => {
    setState((prev) => {
      const existing = prev.goal;
      const goal: UserGoal =
        existing && existing.type === type
          ? existing
          : { type, streakCount: 0, lastCompletedDate: null };
      return { ...prev, goal };
    });
  }, []);

  const resetToday = useCallback(() => {
    setState((prev) => ({ ...prev, hasLoggedToday: false }));
  }, []);

  return (
    <EcoContext.Provider value={{ state, submitLog, setGoal, resetToday }}>
      {children}
    </EcoContext.Provider>
  );
}

export function useEco() {
  const ctx = useContext(EcoContext);
  if (!ctx) throw new Error('useEco must be used within EcoProvider');
  return ctx;
}
