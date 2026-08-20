import {
  Stack,
  router,
} from 'expo-router';

import {
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  AuthProvider,
} from '../context/AuthContext';

import {
  useAuth,
} from '../hooks/useAuth';

const ONBOARDING_KEY =
  '@noida_drive_onboarding_completed';

function AppNavigator() {
  const {
    user,
    loading,
  } = useAuth();

  const [
    onboardingLoading,
    setOnboardingLoading,
  ] = useState(true);

  const [
    onboardingCompleted,
    setOnboardingCompleted,
  ] = useState(false);

  useEffect(() => {
    const checkOnboarding =
      async () => {
        try {
          const value =
            await AsyncStorage.getItem(
              ONBOARDING_KEY,
            );

          setOnboardingCompleted(
            value === 'true',
          );
        } catch (error) {
          console.error(
            'ONBOARDING CHECK ERROR:',
            error,
          );
        } finally {
          setOnboardingLoading(false);
        }
      };

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (
      loading ||
      onboardingLoading
    ) {
      return;
    }

    if (!onboardingCompleted) {
      router.replace(
        '/onboarding',
      );

      return;
    }

    if (!user) {
      router.replace(
        '/(auth)/login',
      );
    }
  }, [
    user,
    loading,
    onboardingLoading,
    onboardingCompleted,
  ]);

  if (
    loading ||
    onboardingLoading
  ) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}