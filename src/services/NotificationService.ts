import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function sendUnlockNotification(mins: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Apps unlocked! 🎉",
      body: `You've earned ${mins} minutes of scroll time. Enjoy!`,
      sound: true,
    },
    trigger: null as any,
  });
}

export async function sendExpiryWarningNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "5 minutes left ⏰",
      body: "Your scroll time is almost up. Make it count!",
      sound: true,
    },
    trigger: null as any,
  });
}

export async function sendLockedNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Scroll time over 🔒",
      body: "Apps are locked again. Walk to unlock.",
      sound: true,
    },
    trigger: null as any,
  });
}

export async function scheduleMorningReminder(goalSteps: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Good morning! 👟",
      body: `Walk ${goalSteps.toLocaleString()} steps today to unlock your apps.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}