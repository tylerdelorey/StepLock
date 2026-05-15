import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import LockScreen from './screens/LockScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import DashboardScreen from './screens/DashboardScreen';
import SettingsScreen from './screens/SettingsScreen';
import { useAppStore } from './store/useAppStore';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>{emoji}</Text>
  );
}

export default function AppNavigator() {
  const hasCompletedOnboarding = useAppStore(
    state => state.hasCompletedOnboarding
  );

  if (!hasCompletedOnboarding) {
    return (
      <NavigationContainer>
        <OnboardingScreen onDone={() => {}} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#111',
            borderTopColor: '#222',
            borderTopWidth: 0.5,
            paddingBottom: 8,
            paddingTop: 8,
            height: 70,
          },
          tabBarActiveTintColor: '#7F77DD',
          tabBarInactiveTintColor: '#555',
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: 2,
          },
        }}
      >
        <Tab.Screen
          name="Lock"
          component={LockScreen}
          options={{
            tabBarLabel: 'Lock',
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="🔒" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Stats',
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="📊" focused={focused} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ focused }) => (
              <TabIcon emoji="⚙️" focused={focused} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}