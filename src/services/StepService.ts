import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STEPS_KEY = 'steplock_daily_steps';
const DATE_KEY = 'steplock_step_date';

let currentSteps = 0;
let subscribers: ((steps: number) => void)[] = [];

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function notifySubscribers(): void {
  subscribers.forEach(cb => cb(currentSteps));
}

export async function initStepService(): Promise<void> {
  const savedDate = await AsyncStorage.getItem(DATE_KEY);
  const today = getTodayString();

  if (savedDate !== today) {
    currentSteps = 0;
    await AsyncStorage.setItem(DATE_KEY, today);
    await AsyncStorage.setItem(STEPS_KEY, '0');
  } else {
    const saved = await AsyncStorage.getItem(STEPS_KEY);
    currentSteps = saved ? parseInt(saved) : 0;
  }

  const isAvailable = await Pedometer.isAvailableAsync();

  if (!isAvailable) {
    console.log('Pedometer not available on this device');
    return;
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();

  try {
    const result = await Pedometer.getStepCountAsync(start, end);
    if (result) {
      currentSteps = result.steps;
      await AsyncStorage.setItem(STEPS_KEY, String(currentSteps));
      notifySubscribers();
    }
  } catch (e) {
    console.log('Could not get historical steps:', e);
  }

  Pedometer.watchStepCount(result => {
    currentSteps = result.steps;
    AsyncStorage.setItem(STEPS_KEY, String(currentSteps));
    notifySubscribers();
  });
}

export function subscribeToSteps(callback: (steps: number) => void): () => void {
  subscribers.push(callback);
  callback(currentSteps);
  return () => {
    subscribers = subscribers.filter(cb => cb !== callback);
  };
}

export function getCurrentSteps(): number {
  return currentSteps;
}