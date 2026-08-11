import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../constants/colors';

export default function MainLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="rent"
        options={{
          title: 'Rent',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="car-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Buy & Sell',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="swap-horizontal-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}