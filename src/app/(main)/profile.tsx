import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { logoutUser } from '../../services/firebase/auth';

export default function ProfileScreen() {
  const { user, profile } = useAuth();

  const displayName =
    profile?.name ||
    user?.displayName ||
    'Noida Drive User';

  const email =
    profile?.email ||
    user?.email ||
    '';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();

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
            try {
              await logoutUser();
            } catch (error) {
              Alert.alert(
                'Error',
                'Unable to logout. Please try again.',
              );
            }
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
          <View>
            <Text style={styles.eyebrow}>
              NOIDA DRIVE
            </Text>

            <Text style={styles.title}>
              Profile
            </Text>
          </View>

          <Pressable
            style={styles.settingsButton}
            onPress={() =>
              router.push('/settings')
            }
          >
            <Ionicons
              name="settings-outline"
              size={21}
              color={colors.white}
            />
          </Pressable>
        </View>

        {/* Profile Card */}

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {initials || 'U'}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>
              {displayName}
            </Text>

            <Text style={styles.email}>
              {email}
            </Text>

            <View style={styles.verifiedRow}>
              <Ionicons
                name="checkmark-circle"
                size={14}
                color={colors.primary}
              />

              <Text style={styles.verifiedText}>
                Account verified
              </Text>
            </View>
          </View>
        </View>

        {/* Edit Profile */}

        <Pressable
          style={styles.editButton}
          onPress={() =>
            router.push('/profile/edit')
          }
        >
          <Ionicons
            name="create-outline"
            size={18}
            color={colors.primary}
          />

          <Text style={styles.editText}>
            Edit Profile
          </Text>
        </Pressable>

        {/* Activity */}

        <Text style={styles.sectionTitle}>
          My Activity
        </Text>

        <View style={styles.menuCard}>

          <ProfileItem
            icon="car-outline"
            title="My Rentals"
            subtitle="View your rental requests and history"
            onPress={() =>
              router.push('/bookings')
            }
          />

          <Divider />

          <ProfileItem
            icon="swap-horizontal-outline"
            title="My Quotes"
            subtitle="Track quotes you've sent"
            onPress={() =>
              router.push('/quotes')
            }
          />

          <Divider />

          <ProfileItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="View your latest updates"
            onPress={() =>
              router.push('/notifications')
            }
          />

        </View>

        {/* Account */}

        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.menuCard}>

          <ProfileItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Manage your profile details"
            onPress={() =>
              router.push('/profile/edit')
            }
          />

          <Divider />

          <ProfileItem
            icon="lock-closed-outline"
            title="Security & Settings"
            subtitle="Manage account preferences"
            onPress={() =>
              router.push('/profile/settings')
            }
          />

        </View>

        {/* Support */}

        <Text style={styles.sectionTitle}>
          Support
        </Text>

        <View style={styles.menuCard}>

          <ProfileItem
            icon="help-circle-outline"
            title="Help & Support"
            subtitle="Get help with Noida Drive"
            onPress={() =>
              router.push('/help')
            }
          />

          <Divider />

          <ProfileItem
            icon="call-outline"
            title="Contact Us"
            subtitle="Talk to our team"
            onPress={() =>
              router.push('/contact')
            }
          />

          <Divider />

          <ProfileItem
            icon="information-circle-outline"
            title="About Noida Drive"
            subtitle="Learn more about us"
            onPress={() =>
              router.push('/about')
            }
          />

        </View>

        {/* Logout */}

        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons
            name="log-out-outline"
            size={20}
            color={colors.error}
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>

        <Text style={styles.version}>
          Noida Drive • Version 1.0.0
        </Text>

      </ScrollView>
    </View>
  );
}

function ProfileItem({
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
      style={styles.profileItem}
      onPress={onPress}
    >
      <View style={styles.itemIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={colors.primary}
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {title}
        </Text>

        <Text style={styles.itemSubtitle}>
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
    paddingBottom: 35,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 7,
  },

  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    marginTop: 25,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 66,
    height: 66,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.background,
    fontSize: 22,
    fontWeight: '900',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 15,
  },

  name: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
  },

  email: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },

  verifiedText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },

  editButton: {
    marginTop: 12,
    height: 46,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  editText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 12,
  },

  menuCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    overflow: 'hidden',
  },

  profileItem: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemContent: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  itemTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },

  itemSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 69,
  },

  logoutButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.error,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  logoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '800',
  },

  version: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 18,
  },
});