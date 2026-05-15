import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import Svg, { Circle } from 'react-native-svg';

const APP_NAMES: Record<string, string> = {
  instagram: '📸 Instagram',
  tiktok: '🎵 TikTok',
  youtube: '▶️ YouTube',
  twitter: '🐦 Twitter / X',
  facebook: '👥 Facebook',
  snapchat: '👻 Snapchat',
  reddit: '🤖 Reddit',
  linkedin: '💼 LinkedIn',
};

function MiniRing({ progress }: { progress: number }) {
  const size = 80;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(progress, 1);
  const offset = circumference * (1 - clamped);
  const color = progress >= 1 ? '#00cc66' : '#7F77DD';

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="#222" strokeWidth={strokeWidth} fill="none"
      />
      <Circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}

export default function DashboardScreen() {
  const currentSteps = useAppStore(state => state.currentSteps);
  const dailyGoal = useAppStore(state => state.dailyGoal);
  const isLocked = useAppStore(state => state.isLocked);
  const selectedApps = useAppStore(state => state.selectedApps);
  const streakDays = useAppStore(state => state.streakDays);
  const scrollWindowMins = useAppStore(state => state.scrollWindowMins);

  const progress = currentSteps / dailyGoal;
  const stepsLeft = Math.max(0, dailyGoal - currentSteps);
  const pct = Math.min(100, Math.round(progress * 100));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <Text style={styles.heading}>Today</Text>

      {/* Status card */}
      <View style={[styles.statusCard, {
        borderColor: isLocked ? '#333' : '#00cc66',
        backgroundColor: isLocked ? '#111' : '#001a0a'
      }]}>
        <View style={styles.statusLeft}>
          <Text style={styles.statusLabel}>Status</Text>
          <Text style={[styles.statusValue, {
            color: isLocked ? '#ff4444' : '#00cc66'
          }]}>
            {isLocked ? '🔒 Locked' : '🔓 Unlocked'}
          </Text>
          {isLocked && stepsLeft > 0 && (
            <Text style={styles.statusSub}>
              {stepsLeft.toLocaleString()} steps to go
            </Text>
          )}
          {!isLocked && (
            <Text style={styles.statusSub}>
              {scrollWindowMins} min scroll window
            </Text>
          )}
        </View>
        <View style={styles.statusRight}>
          <MiniRing progress={progress} />
          <Text style={styles.pctText}>{pct}%</Text>
        </View>
      </View>

      {/* Steps row */}
      <View style={styles.row}>
        <View style={[styles.statBox, { flex: 1.5 }]}>
          <Text style={styles.statLabel}>Steps today</Text>
          <Text style={styles.statValue}>
            {currentSteps.toLocaleString()}
          </Text>
          <Text style={styles.statSub}>of {dailyGoal.toLocaleString()} goal</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>
            {streakDays}
          </Text>
          <Text style={styles.statSub}>
            {streakDays === 1 ? 'day 🔥' : streakDays > 1 ? 'days 🔥' : 'days'}
          </Text>
        </View>
      </View>

      {/* Locked apps */}
      <Text style={styles.sectionTitle}>Locked apps</Text>
      {selectedApps.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No apps selected. Go to Settings to choose which apps to lock.
          </Text>
        </View>
      ) : (
        <View style={styles.appsCard}>
          {selectedApps.map((app, index) => (
            <View key={app} style={[
              styles.appRow,
              index < selectedApps.length - 1 && styles.appRowBorder
            ]}>
              <Text style={styles.appName}>
                {APP_NAMES[app] || app}
              </Text>
              <View style={[styles.appStatus, {
                backgroundColor: isLocked ? '#2a0a0a' : '#0a2a1a'
              }]}>
                <Text style={[styles.appStatusText, {
                  color: isLocked ? '#ff4444' : '#00cc66'
                }]}>
                  {isLocked ? 'Locked' : 'Open'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* How it works reminder */}
      <View style={styles.hintCard}>
        <Text style={styles.hintTitle}>How StepLock works</Text>
        <Text style={styles.hintText}>
          Walk {dailyGoal.toLocaleString()} steps → apps unlock for {scrollWindowMins} mins → repeat daily.
          Your streak grows every day you hit your goal.
        </Text>
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
    paddingBottom: 40,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  statusCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLeft: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusSub: {
    fontSize: 13,
    color: '#666',
  },
  statusRight: {
    alignItems: 'center',
  },
  pctText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#222',
    padding: 14,
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statSub: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 10,
  },
  emptyCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#222',
    padding: 16,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  appsCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#222',
    marginBottom: 16,
    overflow: 'hidden',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  appRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#1a1a1a',
  },
  appName: {
    fontSize: 14,
    color: '#ffffff',
  },
  appStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  appStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  hintCard: {
    backgroundColor: '#111',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#222',
    padding: 14,
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  hintText: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },
});