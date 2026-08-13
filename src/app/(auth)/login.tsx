import { useState } from 'react';
import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { router } from 'expo-router';

import { colors } from '../../constants/colors';
import { loginUser } from '../../services/firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter email and password.');
      return;
    }

    try {
      setLoading(true);

      await loginUser(email.trim(), password);

      router.replace('/');
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error?.message || 'Unable to login.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NOIDA DRIVE</Text>

      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Sign in to continue your journey.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colors.textMuted}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        onPress={() => router.push('/(auth)/forgot-password')}
      >
        <Text style={styles.forgot}>
          Forgot Password?
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing In...' : 'Sign In'}
        </Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Do not have an account?
        </Text>

        <Pressable
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.link}> Create Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 30,
  },
  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 32,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.white,
    marginBottom: 14,
  },
  forgot: {
    color: colors.primary,
    textAlign: 'right',
    marginBottom: 24,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: colors.textSecondary,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
});