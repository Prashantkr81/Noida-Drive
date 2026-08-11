import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import AuthLoading from '../components/common/AuthLoading';

function RootNavigation() {
  const { user, loading } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }

    if (user && inAuthGroup) {
      router.replace('/(main');
    }
  }, [user, loading, segments]);

  if (loading) {
    return <AuthLoading />;
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
      <RootNavigation />
    </AuthProvider>
  );
}