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
          borderTopWidth: 1,
          height: 68,
          paddingTop: 6,
          paddingBottom: 8,
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
      }}
    >
      {/* HOME */}

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

      {/* RENT */}

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

      {/* BUY & SELL */}

      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Buy & Sell',

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="storefront-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE */}

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