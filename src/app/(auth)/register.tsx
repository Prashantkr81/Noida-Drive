import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { registerUser } from '../../services/firebase/auth';
import { colors } from '../../constants/colors';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // -------------------------
    // Validation
    // -------------------------

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      Alert.alert(
        'Missing Information',
        'Name, email and password are required.',
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 6 characters long.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Password and confirm password must match.',
      );
      return;
    }

    try {
      setLoading(true);

      console.log('REGISTER: starting');

      const user = await registerUser(
        trimmedEmail,
        password,
        password,
        trimmedPhone,
        { name: trimmedName },
      );

      console.log('REGISTER: successful');
      console.log('UID:', user.uid);

      Alert.alert(
        'Account Created',
        'Your Noida Drive account has been created successfully.',
        [
          {
            text: 'Continue',
            onPress: () => router.replace('/'),
          },
        ],
      );
    } catch (error: any) {
      console.log('REGISTER ERROR:', error);

      let message = 'Unable to create your account. Please try again.';

      switch (error?.code) {
        case 'auth/email-already-in-use':
          message = 'An account already exists with this email address.';
          break;

        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;

        case 'auth/weak-password':
          message = 'Password is too weak. Use at least 6 characters.';
          break;

        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection.';
          break;

        case 'permission-denied':
          message =
            'Account authentication succeeded, but your profile could not be saved. Please contact support.';
          break;

        default:
          if (error?.message) {
            message = error.message;
          }
      }

      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.logo}>NOIDA DRIVE</Text>

          <Text style={styles.title}>Create Account</Text>

          <Text style={styles.subtitle}>
            Join Noida Drive and experience a better way to rent,
            buy and sell cars.
          </Text>
        </View>

        {/* Form */}

        <View style={styles.form}>
          {/* Name */}

          <View style={styles.field}>
            <Text style={styles.label}>FULL NAME</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>

          {/* Phone */}

          <View style={styles.field}>
            <Text style={styles.label}>PHONE NUMBER</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>

          {/* Email */}

          <View style={styles.field}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Password */}

          <View style={styles.field}>
            <Text style={styles.label}>PASSWORD</Text>

            <TextInput
              style={styles.input}
              placeholder="Create a password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />

            <Text style={styles.helper}>
              Minimum 6 characters
            </Text>
          </View>

          {/* Confirm Password */}

          <View style={styles.field}>
            <Text style={styles.label}>CONFIRM PASSWORD</Text>

            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              placeholderTextColor={colors.textMuted}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Register Button */}

          <Pressable
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="small"
                  color={colors.background}
                />

                <Text style={styles.buttonText}>
                  Creating Account...
                </Text>
              </View>
            ) : (
              <Text style={styles.buttonText}>
                Create Account
              </Text>
            )}
          </Pressable>
        </View>

        {/* Login */}

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?
          </Text>

          <Pressable
            disabled={loading}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.loginLink}>
              Sign In
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 32,
  },

  logo: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: 28,
  },

  title: {
    color: colors.white,
    fontSize: 34,
    fontWeight: '800',
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
  },

  form: {
    gap: 18,
  },

  field: {
    gap: 8,
  },

  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.white,
    fontSize: 15,
  },

  helper: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: -2,
  },

  button: {
    backgroundColor: colors.primary,
    minHeight: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },

  loginText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 5,
  },
});