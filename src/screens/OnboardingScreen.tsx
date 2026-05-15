import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions
} from 'react-native';
import { useAppStore } from '../store/useAppStore';

const { width } = Dimensions.get('window');

const APPS = [
  { id: 'instagram', name: 'Instagram', emoji: '📸' },
  { id: 'tiktok', name: 'TikTok', emoji: '🎵' },
  { id: 'youtube', name: 'YouTube', emoji: '▶️' },
  { id: 'twitter', name: 'Twitter / X', emoji: '🐦' },
  { id: 'facebook', name: 'Facebook', emoji: '👥' },
  { id: 'snapchat', name: 'Snapchat', emoji: '👻' },
  { id: 'reddit', name: 'Reddit', emoji: '🤖' },
  { id: 'linkedin', name: 'LinkedIn', emoji: '💼' },
];

const GOALS = [500, 1000, 2000, 5000, 10000];
const GOAL_LABELS: Record<number, string> = {
  500: 'Light — ~5 min walk',
  1000: 'Easy — ~10 min walk',
  2000: 'Moderate — ~20 min walk',
  5000: 'Active — ~50 min walk',
  10000: 'Hardcore — ~100 min walk',
};

export default function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(1000);

  const toggleApp = useAppStore(state => state.toggleApp);
  const selectedApps = useAppStore(state => state.selectedApps);
  const setDailyGoal = useAppStore(state => state.setDailyGoal);
  const completeOnboarding = useAppStore(state => state.completeOnboarding);

  function handleFinish() {
    setDailyGoal(selectedGoal);
    completeOnboarding();
    onDone();
  }

  return (
    <View style={styles.container}>

      {step === 0 && (
        <View style={styles.page}>
          <Text style={styles.emoji}>🔒</Text>
          <Text style={styles.headline}>Walk to scroll.</Text>
          <Text style={styles.body}>
            StepLock blocks your social media apps until you hit your daily step goal.
            No steps, no scroll. Simple.
          </Text>
          <Text style={styles.body2}>
            Takes 2 minutes to set up.
          </Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(1)}>
            <Text style={styles.primaryBtnText}>Get started →</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 1 && (
        <View style={styles.page}>
          <Text style={styles.stepIndicator}>Step 1 of 2</Text>
          <Text style={styles.headline}>Which apps do{'\n'}you want to lock?</Text>
          <Text style={styles.body}>Tap to select. Pick at least one.</Text>

          <ScrollView style={styles.appGrid} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {APPS.map(app => {
                const selected = selectedApps.includes(app.id);
                return (
                  <TouchableOpacity
                    key={app.id}
                    style={[styles.appCard, selected && styles.appCardSelected]}
                    onPress={() => toggleApp(app.id)}
                  >
                    <Text style={styles.appEmoji}>{app.emoji}</Text>
                    <Text style={[styles.appName, selected && styles.appNameSelected]}>
                      {app.name}
                    </Text>
                    {selected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.primaryBtn, selectedApps.length === 0 && styles.primaryBtnDisabled]}
            onPress={() => selectedApps.length > 0 && setStep(2)}
          >
            <Text style={styles.primaryBtnText}>
              {selectedApps.length === 0 ? 'Select at least one app' : `Lock ${selectedApps.length} app${selectedApps.length > 1 ? 's' : ''} →`}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View style={styles.page}>
          <Text style={styles.stepIndicator}>Step 2 of 2</Text>
          <Text style={styles.headline}>Set your{'\n'}daily step goal.</Text>
          <Text style={styles.body}>You need to hit this every day to unlock your apps.</Text>

          <View style={styles.goalList}>
            {GOALS.map(goal => {
              const selected = selectedGoal === goal;
              return (
                <TouchableOpacity
                  key={goal}
                  style={[styles.goalCard, selected && styles.goalCardSelected]}
                  onPress={() => setSelectedGoal(goal)}
                >
                  <View style={styles.goalLeft}>
                    <Text style={[styles.goalNumber, selected && styles.goalNumberSelected]}>
                      {goal.toLocaleString()}
                    </Text>
                    <Text style={styles.goalSteps}>steps</Text>
                  </View>
                  <Text style={[styles.goalLabel, selected && styles.goalLabelSelected]}>
                    {GOAL_LABELS[goal]}
                  </Text>
                  {selected && <Text style={styles.goalCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleFinish}>
            <Text style={styles.primaryBtnText}>Start StepLock →</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  page: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  stepIndicator: {
    fontSize: 13,
    color: '#555',
    marginBottom: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  emoji: {
    fontSize: 56,
    marginBottom: 24,
  },
  headline: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 44,
  },
  body: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
    marginBottom: 8,
  },
  body2: {
    fontSize: 14,
    color: '#555',
    marginBottom: 48,
  },
  appGrid: {
    flex: 1,
    marginTop: 20,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingBottom: 16,
  },
  appCard: {
    width: (width - 76) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    gap: 6,
  },
  appCardSelected: {
    borderColor: '#7F77DD',
    backgroundColor: '#1a1933',
  },
  appEmoji: {
    fontSize: 28,
  },
  appName: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  appNameSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 12,
    color: '#7F77DD',
    fontWeight: 'bold',
  },
  goalList: {
    flex: 1,
    marginTop: 20,
    gap: 10,
  },
  goalCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2a2a2a',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalCardSelected: {
    borderColor: '#7F77DD',
    backgroundColor: '#1a1933',
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    minWidth: 70,
  },
  goalNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
  },
  goalNumberSelected: {
    color: '#ffffff',
  },
  goalSteps: {
    fontSize: 12,
    color: '#555',
  },
  goalLabel: {
    flex: 1,
    fontSize: 13,
    color: '#666',
  },
  goalLabelSelected: {
    color: '#aaa',
  },
  goalCheck: {
    fontSize: 14,
    color: '#7F77DD',
    fontWeight: 'bold',
  },
  primaryBtn: {
    backgroundColor: '#7F77DD',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryBtnDisabled: {
    backgroundColor: '#2a2a2a',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});