import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../services/firebase/auth';

export default function ProfileSettingsScreen() {
  const { user } = useAuth();

  const [notifications, setNotifications] =
    useState(true);

  const [bookingUpdates, setBookingUpdates] =
    useState(true);

  const [quoteUpdates, setQuoteUpdates] =
    useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logoutUser();
          },
        },
      ],
    );
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
            Settings
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Notifications */}

        <Text style={styles.sectionTitle}>
          Notifications
        </Text>

        <View style={styles.card}>
          <SettingSwitch
            icon="notifications-outline"
            title="Push Notifications"
            subtitle="Receive important updates from Noida Drive"
            value={notifications}
            onValueChange={setNotifications}
          />

          <Divider />

          <SettingSwitch
            icon="car-outline"
            title="Rental Updates"
            subtitle="Updates about your rental requests"
            value={bookingUpdates}
            onValueChange={setBookingUpdates}
          />

          <Divider />

          <SettingSwitch
            icon="chatbubble-ellipses-outline"
            title="Quote Updates"
            subtitle="Updates about your marketplace quotes"
            value={quoteUpdates}
            onValueChange={setQuoteUpdates}
          />
        </View>

        {/* Account */}

        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.card}>
          <SettingItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() =>
              router.push('/profile/edit')
            }
          />

          <Divider />

          <SettingItem
            icon="lock-closed-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() =>
              router.push('/forgot-password')
            }
          />
        </View>

        {/* Information */}

        <Text style={styles.sectionTitle}>
          Information
        </Text>

        <View style={styles.card}>
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy"
            subtitle="How we handle your information"
            onPress={() =>
              Alert.alert(
                'Privacy',
                'Privacy settings will be available here.',
              )
            }
          />

          <Divider />

          <SettingItem
            icon="document-text-outline"
            title="Terms & Conditions"
            subtitle="Read our terms of service"
            onPress={() =>
              Alert.alert(
                'Terms',
                'Terms and conditions will be available here.',
              )
            }
          />
        </View>

        {/* Logout */}

        <Pressable
          style={styles.logout}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color={colors.error}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>

        <Text style={styles.accountId}>
          Account: {user?.email || 'Unknown'}
        </Text>
      </ScrollView>
    </View>
  );
}

function SettingSwitch({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.primary}
        />
      </View>

      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>
          {title}
        </Text>

        <Text style={styles.settingSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: colors.border,
          true: colors.primary,
        }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function SettingItem({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.settingItem}
      onPress={onPress}
    >
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.primary}
        />
      </View>

      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>
          {title}
        </Text>

        <Text style={styles.settingSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
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

  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 12,
  },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    overflow: 'hidden',
  },

  settingItem: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  settingTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },

  settingSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 69,
  },

  logout: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 14,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  logoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '800',
  },

  accountId: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 15,
  },
});

