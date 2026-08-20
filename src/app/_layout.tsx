import {
  Stack,
  router,
} from 'expo-router';

import { useEffect } from 'react';

import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';

function AppNavigator() {
  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace('/login');
    }
  }, [user, loading]);

  if (loading) {
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