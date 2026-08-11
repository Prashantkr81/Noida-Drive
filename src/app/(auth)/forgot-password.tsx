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

import { resetPassword } from '../../services/firebase/auth';
import { colors } from '../../constants/colors';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Email Required', 'Please enter your email address.');
      return;
    }

    try {
      setLoading(true);

      await resetPassword(email.trim());

      Alert.alert(
        'Email Sent',
        'Check your email for password reset instructions.',
      );

      router.back();
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.message || 'Unable to send reset email.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NOIDA DRIVE</Text>

      <Text style={styles.title}>Reset Password</Text>

      <Text style={styles.subtitle}>
        Enter your email and we'll send you a reset link.
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

      <Pressable
        style={styles.button}
        onPress={handleReset}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.link}>Back to Login</Text>
      </Pressable>
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
    marginBottom: 28,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.white,
    marginBottom: 18,
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
  backButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
});