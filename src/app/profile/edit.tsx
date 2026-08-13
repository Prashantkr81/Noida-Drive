import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile } from '../../services/firebase/users';

export default function EditProfileScreen() {
  const { user, profile } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login again.',
      );
      return;
    }

    if (!name.trim()) {
      Alert.alert(
        'Missing Information',
        'Please enter your name.',
      );
      return;
    }

    try {
      setSaving(true);

      await updateUserProfile(user.uid, {
        name: name.trim(),
        phone: phone.trim(),
      });

      Alert.alert(
        'Profile Updated',
        'Your profile has been updated successfully.',
        [
          {
            text: 'Done',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      console.error(
        'UPDATE PROFILE ERROR:',
        error,
      );

      Alert.alert(
        'Update Failed',
        'Unable to update your profile. Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.white}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Edit Profile
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Avatar */}

        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name
                ? name
                    .charAt(0)
                    .toUpperCase()
                : 'U'}
            </Text>
          </View>

          <Text style={styles.avatarHint}>
            Profile information
          </Text>
        </View>

        {/* Form */}

        <View style={styles.form}>
          <Field
            label="FULL NAME"
            value={name}
            placeholder="Your full name"
            onChangeText={setName}
          />

          <View>
            <Text style={styles.label}>
              EMAIL ADDRESS
            </Text>

            <View style={styles.disabledInput}>
              <Text style={styles.disabledText}>
                {user?.email || ''}
              </Text>

              <Ionicons
                name="lock-closed-outline"
                size={17}
                color={colors.textMuted}
              />
            </View>

            <Text style={styles.helper}>
              Email address cannot be changed here.
            </Text>
          </View>

          <Field
            label="PHONE NUMBER"
            value={phone}
            placeholder="+91 XXXXX XXXXX"
            keyboardType="phone-pad"
            onChangeText={setPhone}
          />

          <Pressable
            style={[
              styles.saveButton,
              saving && styles.disabled,
            ]}
            disabled={saving}
            onPress={handleSave}
          >
            {saving ? (
              <ActivityIndicator
                color={colors.background}
              />
            ) : (
              <Text style={styles.saveText}>
                Save Changes
              </Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <View>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },

  headerSpacer: {
    width: 42,
  },

  avatarContainer: {
    alignItems: 'center',
    marginTop: 30,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 27,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.background,
    fontSize: 28,
    fontWeight: '900',
  },

  avatarHint: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 10,
  },

  form: {
    gap: 22,
    marginTop: 35,
  },

  label: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    color: colors.white,
    fontSize: 14,
  },

  disabledInput: {
    height: 52,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  disabledText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  helper: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 6,
  },

  saveButton: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  saveText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '900',
  },

  disabled: {
    opacity: 0.6,
  },
});
