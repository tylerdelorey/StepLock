import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useAppStore } from '../store/useAppStore';

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
const WINDOWS = [15, 30, 45, 60];

export default function SettingsScreen() {
  const dailyGoal = useAppStore(state => state.dailyGoal);
  const setDailyGoal = useAppStore(state => state.setDailyGoal);
  const scrollWindowMins = useAppStore(state => state.scrollWindowMins);
  const selectedApps = useAppStore(state => state.selectedApps);
  const toggleApp = useAppStore(state => state.toggleApp);

  function setScrollWindow(mins: number) {
    useAppStore.setState({ scrollWindowMins: mins });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={styles.heading}>Settings</Text>

      {/* Step goal */}
      <Text style={styles.sectionTitle}>Daily step goal</Text>
      <View style={styles.card}>
        {GOALS.map((goal, index) => {
          const selected = dailyGoal === goal;
          return (
            <TouchableOpacity
              key={goal}
              style={[
                styles.optionRow,
                index < GOALS.length - 1 && styles.optionBorder,
                selected && styles.optionSelected
              ]}
              onPress={() => setDailyGoal(goal)}
            >
              <View>
                <Text style={[styles.optionMain, selected && styles.optionMainSelected]}>
                  {goal.toLocaleString()} steps
                </Text>
                <Text style={styles.optionSub}>
                  {goal === 500 ? '~5 min walk' :
                   goal === 1000 ? '~10 min walk' :
                   goal === 2000 ? '~20 min walk' :
                   goal === 5000 ? '~50 min walk' :
                   '~100 min walk'}
                </Text>
              </View>
              {selected && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Scroll window */}
      <Text style={styles.sectionTitle}>Scroll time window</Text>
      <Text style={styles.sectionSub}>How long you can scroll after hitting your goal</Text>
      <View style={styles.card}>
        {WINDOWS.map((mins, index) => {
          const selected = scrollWindowMins === mins;
          return (
            <TouchableOpacity
              key={mins}
              style={[
                styles.optionRow,
                index < WINDOWS.length - 1 && styles.optionBorder,
                selected && styles.optionSelected
              ]}
              onPress={() => setScrollWindow(mins)}
            >
              <Text style={[styles.optionMain, selected && styles.optionMainSelected]}>
                {mins} minutes
              </Text>
              {selected && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Locked apps */}
      <Text style={styles.sectionTitle}>Locked apps</Text>
      <Text style={styles.sectionSub}>Toggle which apps StepLock blocks</Text>
      <View style={styles.card}>
        {APPS.map((app, index) => {
          const selected = selectedApps.includes(app.id);
          return (
            <View
              key={app.id}
              style={[
                styles.optionRow,
                index < APPS.length - 1 && styles.optionBorder,
              ]}
            >
              <Text style={styles.appEmoji}>{app.emoji}</Text>
              <Text style={[styles.optionMain, { flex: 1, marginLeft: 10 }]}>
                {app.name}
              </Text>
              <Switch
                value={selected}
                onValueChange={() => toggleApp(app.id)}
                trackColor={{ false: '#333', true: '#7F77DD' }}
                thumbColor={selected ? '#fff' : '#888'}
              />
            </View>
          );
        })}
      </View>

      {/* About */}
      <View style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>StepLock</Text>
        <Text style={styles.aboutText}>
          Walk to unlock your social apps. Built to help you move more and scroll less.
        </Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 60,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 8,
  },
  sectionSub: {
    fontSize: 12,
    color: '#444',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#222',
    marginBottom: 24,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  optionBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a1a1a',
  },
  optionSelected: {
    backgroundColor: '#1a1933',
  },
  optionMain: {
    fontSize: 15,
    color: '#888',
  },
  optionMainSelected: {
    color: '#ffffff',
    fontWeight: '500',
  },
  optionSub: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
  check: {
    fontSize: 16,
    color: '#7F77DD',
    marginLeft: 'auto',
    fontWeight: 'bold',
  },
  appEmoji: {
    fontSize: 20,
  },
  aboutCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#222',
    padding: 16,
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 10,
  },
  version: {
    fontSize: 11,
    color: '#333',
  },
});