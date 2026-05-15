import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendUnlockNotification, sendLockedNotification } from '../services/NotificationService';

interface AppState {
  currentSteps: number;
  dailyGoal: number;
  isLocked: boolean;
  scrollWindowMins: number;
  unlockExpiresAt: string | null;
  selectedApps: string[];
  streakDays: number;
  hasCompletedOnboarding: boolean;

  setCurrentSteps: (steps: number) => void;
  setDailyGoal: (goal: number) => void;
  setLocked: (locked: boolean) => void;
  setUnlockExpiry: (date: Date | null) => void;
  toggleApp: (app: string) => void;
  setStreak: (days: number) => void;
  completeOnboarding: () => void;
  checkAndUpdateLockStatus: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentSteps: 0,
      dailyGoal: 1000,
      isLocked: true,
      scrollWindowMins: 30,
      unlockExpiresAt: null,
      selectedApps: [],
      streakDays: 0,
      hasCompletedOnboarding: false,

      setCurrentSteps: (steps) => {
        set({ currentSteps: steps });
        get().checkAndUpdateLockStatus();
      },

      setDailyGoal: (goal) => set({ dailyGoal: goal }),

      setLocked: (locked) => set({ isLocked: locked }),

      setUnlockExpiry: (date) => set({
        unlockExpiresAt: date ? date.toISOString() : null,
      }),

      toggleApp: (app) => {
        const current = get().selectedApps;
        const updated = current.includes(app)
          ? current.filter(a => a !== app)
          : [...current, app];
        set({ selectedApps: updated });
      },

      setStreak: (days) => set({ streakDays: days }),

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: false, });
      },

      checkAndUpdateLockStatus: () => {
        const {
          currentSteps,
          dailyGoal,
          isLocked,
          scrollWindowMins,
          unlockExpiresAt,
        } = get();

        if (unlockExpiresAt && new Date() > new Date(unlockExpiresAt)) {
          set({ isLocked: true, unlockExpiresAt: null });
          sendLockedNotification();
          return;
        }

        if (isLocked && currentSteps >= dailyGoal) {
          const expiry = new Date();
          expiry.setMinutes(expiry.getMinutes() + scrollWindowMins);
          set({ isLocked: false, unlockExpiresAt: expiry.toISOString() });
          sendUnlockNotification(scrollWindowMins);
        }
      },
    }),
    {
      name: 'steplock-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        dailyGoal: state.dailyGoal,
        scrollWindowMins: state.scrollWindowMins,
        selectedApps: state.selectedApps,
        streakDays: state.streakDays,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        unlockExpiresAt: state.unlockExpiresAt,
      }),
    }
  )
);