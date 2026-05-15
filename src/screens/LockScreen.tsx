import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useAppStore } from '../store/useAppStore';

function ProgressRing({ progress }: { progress: number }) {
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(progress, 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);
  const color = progress >= 1 ? '#00cc66' : '#7F77DD';

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#222"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}

function getMotivationalMessage(progress: number): string {
  if (progress >= 1) return "Goal reached! Enjoy your scroll 🎉";
  if (progress >= 0.75) return "So close! Keep going 💪";
  if (progress >= 0.5) return "Halfway there, don't stop now";
  if (progress >= 0.25) return "Good start! Keep moving 🚶";
  return "Time to move. You've got this.";
}

function formatTimeLeft(expiresAt: Date | string | null): string {
  if (!expiresAt) return '';
  const expiry = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  const diff = Math.max(0, expiry.getTime() - new Date().getTime());
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function LockScreen() {
  const currentSteps = useAppStore(state => state.currentSteps);
  const dailyGoal = useAppStore(state => state.dailyGoal);
  const isLocked = useAppStore(state => state.isLocked);
  const unlockExpiresAt = useAppStore(state => state.unlockExpiresAt);

  const [timeLeft, setTimeLeft] = useState('');
  const progress = currentSteps / dailyGoal;
  const stepsLeft = Math.max(0, dailyGoal - currentSteps);

  useEffect(() => {
    if (!isLocked && unlockExpiresAt) {
      const interval = setInterval(() => {
        setTimeLeft(formatTimeLeft(unlockExpiresAt));
      }, 1000);
      setTimeLeft(formatTimeLeft(unlockExpiresAt));
      return () => clearInterval(interval);
    } else {
      setTimeLeft('');
    }
  }, [isLocked, unlockExpiresAt]);

  function openMaps() {
    Linking.openURL('https://maps.apple.com/?dirflg=w');
  }

  return (
    <View style={[
      styles.container,
      { backgroundColor: isLocked ? '#0a0a0a' : '#001a0a' }
    ]}>

      <Text style={styles.appName}>StepLock</Text>
      <Text style={styles.subtitle}>
        {isLocked ? 'Walk to unlock your apps' : 'Apps unlocked'}
      </Text>

      <View style={styles.ringContainer}>
        <ProgressRing progress={progress} />
        <View style={styles.ringCenter}>
          <Text style={[
            styles.stepCount,
            { color: isLocked ? '#ffffff' : '#00cc66' }
          ]}>
            {currentSteps.toLocaleString()}
          </Text>
          <Text style={styles.stepLabel}>of {dailyGoal.toLocaleString()}</Text>
          <Text style={styles.stepWord}>steps</Text>
        </View>
      </View>

      <Text style={styles.message}>
        {getMotivationalMessage(progress)}
      </Text>

      {isLocked && stepsLeft > 0 && (
        <Text style={styles.stepsLeft}>
          {stepsLeft.toLocaleString()} steps to go
        </Text>
      )}

      {!isLocked && timeLeft !== '' && (
        <View style={styles.timerBox}>
          <Text style={styles.timerLabel}>Scroll time remaining</Text>
          <Text style={styles.timerValue}>{timeLeft}</Text>
        </View>
      )}

      {isLocked && (
        <TouchableOpacity style={styles.walkButton} onPress={openMaps}>
          <Text style={styles.walkButtonText}>Open Maps for a walk →</Text>
        </TouchableOpacity>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 48,
  },
  ringContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  stepCount: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  stepWord: {
    fontSize: 13,
    color: '#555',
  },
  message: {
    fontSize: 18,
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepsLeft: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  timerBox: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#0d2d1a',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00cc66',
  },
  timerLabel: {
    fontSize: 13,
    color: '#00cc66',
    marginBottom: 4,
  },
  timerValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#00cc66',
  },
  walkButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#444',
  },
  walkButtonText: {
    color: '#aaa',
    fontSize: 15,
  },
});