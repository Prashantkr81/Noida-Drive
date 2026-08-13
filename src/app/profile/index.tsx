import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';

import { colors } from '../../constants/colors';
import { auth } from '../../services/firebase/config';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      router.replace('/(auth)/login');
    } catch (error) {
      console.error(
        'LOGOUT ERROR:',
        error,
      );
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  const displayName =
    user.displayName ||
    'Noida Drive User';

  const email =
    user.email ||
    'No email available';

  const initial =
    displayName
      .charAt(0)
      .toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            NOIDA DRIVE
          </Text>

          <Text style={styles.title}>
            My Profile
          </Text>
        </View>

        {/* ================================= */}
        {/* PROFILE CARD */}
        {/* ================================= */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initial}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text
              style={styles.profileName}
              numberOfLines={1}
            >
              {displayName}
            </Text>

            <Text
              style={styles.profileEmail}
              numberOfLines={1}
            >
              {email}
            </Text>

            <View style={styles.verifiedRow}>
              <Ionicons
                name="checkmark-circle"
                size={13}
                color={colors.primary}
              />

              <Text style={styles.verifiedText}>
                Account Active
              </Text>
            </View>
          </View>

          <Pressable
            style={styles.editButton}
            onPress={() =>
              router.push(
                '/profile/edit',
              )
            }
          >
            <Ionicons
              name="create-outline"
              size={18}
              color={colors.primary}
            />
          </Pressable>
        </View>

        {/* ================================= */}
        {/* ACTIVITY */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          My Activity
        </Text>

        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="calendar-outline"
            title="My Bookings"
            subtitle="View your rental requests and history"
            onPress={() =>
              router.push('/bookings')
            }
          />

          <Divider />

          <ProfileMenuItem
            icon="pricetag-outline"
            title="My Quotes"
            subtitle="Track quotes sent and received"
            onPress={() =>
              router.push('/quotes')
            }
          />

          <Divider />

          <ProfileMenuItem
            icon="car-outline"
            title="My Sell Submissions"
            subtitle="Track cars submitted for sale"
            onPress={() =>
              router.push(
                '/profile/sell-submissions',
              )
            }
          />
        </View>

        {/* ================================= */}
        {/* ACCOUNT */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() =>
              router.push(
                '/profile/edit',
              )
            }
          />

          <Divider />

          <ProfileMenuItem
            icon="settings-outline"
            title="Settings"
            subtitle="Manage your account preferences"
            onPress={() =>
              router.push(
                '/profile/settings',
              )
            }
          />

          <Divider />

          <ProfileMenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="View your latest updates"
            onPress={() =>
              router.push(
                '/notifications',
              )
            }
          />
        </View>

        {/* ================================= */}
        {/* SUPPORT */}
        {/* ================================= */}

        <Text style={styles.sectionTitle}>
          Support
        </Text>

        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help with your account or bookings"
            onPress={() =>
              router.push('/help')
            }
          />

          <Divider />

          <ProfileMenuItem
            icon="call-outline"
            title="Contact Us"
            subtitle="Talk to the Noida Drive team"
            onPress={() =>
              router.push('/contact')
            }
          />

          <Divider />

          <ProfileMenuItem
            icon="information-circle-outline"
            title="About Noida Drive"
            subtitle="Learn more about us"
            onPress={() =>
              router.push('/about')
            }
          />
        </View>

        {/* ================================= */}
        {/* LOGOUT */}
        {/* ================================= */}

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={19}
            color={colors.error}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>

        <Text style={styles.version}>
          Noida Drive • v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

/* ===================================== */
/* MENU ITEM */
/* ===================================== */

function ProfileMenuItem({
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
      style={({ pressed }) => [
        styles.menuItem,
        pressed &&
          styles.menuItemPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={colors.primary}
        />
      </View>

      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>
          {title}
        </Text>

        <Text style={styles.menuSubtitle}>
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

/* ===================================== */
/* DIVIDER */
/* ===================================== */

function Divider() {
  return (
    <View style={styles.divider} />
  );
}

/* ===================================== */
/* STYLES */
/* ===================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  content: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor:
      colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Header */

  header: {
    marginBottom: 20,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  title: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 4,
  },

  /* Profile */

  profileCard: {
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 20,
    padding: 17,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor:
      colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.background,
    fontSize: 24,
    fontWeight: '900',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 13,
  },

  profileName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },

  profileEmail: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },

  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },

  verifiedText: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '700',
  },

  editButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor:
      colors.surfaceLight,
    borderWidth: 1,
    borderColor:
      colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Sections */

  sectionTitle: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.2,
    marginTop: 25,
    marginBottom: 10,
  },

  /* Menu */

  menuCard: {
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 18,
    overflow: 'hidden',
  },

  menuItem: {
    minHeight: 70,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuItemPressed: {
    backgroundColor:
      colors.surfaceLight,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor:
      colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuContent: {
    flex: 1,
    marginLeft: 11,
  },

  menuTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },

  menuSubtitle: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor:
      colors.border,
    marginLeft: 67,
  },

  /* Logout */

  logoutButton: {
    height: 52,
    marginTop: 25,
    borderRadius: 14,
    backgroundColor:
      'rgba(239,68,68,0.07)',
    borderWidth: 1,
    borderColor:
      'rgba(239,68,68,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  logoutText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '900',
  },

  version: {
    color: colors.textMuted,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 18,
  },
});