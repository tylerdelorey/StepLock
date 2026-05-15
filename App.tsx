import { useEffect } from 'react';
import { initStepService, subscribeToSteps } from './src/services/StepService';
import { useAppStore } from './src/store/useAppStore';
import AppNavigator from './src/AppNavigator';

export default function App() {
  const setCurrentSteps = useAppStore(state => state.setCurrentSteps);

  useEffect(() => {
    initStepService();
    const unsubscribe = subscribeToSteps((steps) => {
      setCurrentSteps(steps);
    });
    return unsubscribe;
  }, []);

  return <AppNavigator />;
}