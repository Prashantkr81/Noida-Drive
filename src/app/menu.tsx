import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../services/firebase/auth';

export default function MenuScreen() {
  const { profile } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      Alert.alert('Error', 'Unable to logout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>NOIDA DRIVE</Text>
          <Text style={styles.menuTitle}>Menu</Text>
        </View>

        <Pressable
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="close"
            size={26}
            color={colors.white}
          />
        </Pressable>
      </View>

      {/* User */}

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {profile?.name || 'User'}
          </Text>

          <Text style={styles.userEmail}>
            {profile?.email || ''}
          </Text>
        </View>
      </View>

      {/* Menu Items */}

      <View style={styles.menu}>

        <MenuItem
          icon="person-outline"
          title="Profile"
          onPress={() => router.push('/(main)/profile')}
        />

        <MenuItem
          icon="business-outline"
          title="Corporate"
          onPress={() => router.push('/corporate')}
        />

        <MenuItem
          icon="information-circle-outline"
          title="About Us"
          onPress={() => router.push('/about')}
        />

        <MenuItem
          icon="call-outline"
          title="Contact Us"
          onPress={() => router.push('/contact-us')}
        />

        <MenuItem
          icon="help-circle-outline"
          title="Help & Support"
          onPress={() => router.push('/help')}
        />

        <MenuItem
          icon="settings-outline"
          title="Settings"
          onPress={() => router.push('/profile/settings')}
        />

      </View>

      {/* Logout */}

      <Pressable
        style={styles.logout}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color={colors.error}
        />

        <Text style={styles.logoutText}>
          Logout
        </Text>
      </Pressable>

    </View>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
}

function MenuItem({
  icon,
  title,
  onPress,
}: MenuItemProps) {
  return (
    <Pressable
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <Ionicons
          name={icon}
          size={22}
          color={colors.primary}
        />
      </View>

      <Text style={styles.menuText}>
        {title}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 22,
    paddingTop: 58,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2.5,
  },

  menuTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
  },

  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    marginTop: 30,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.background,
    fontSize: 20,
    fontWeight: '900',
  },

  userInfo: {
    marginLeft: 14,
    flex: 1,
  },

  userName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },

  userEmail: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },

  menu: {
    marginTop: 24,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
  },

  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginLeft: 14,
  },

  logout: {
    marginTop: 'auto',
    marginBottom: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 14,
  },

  logoutText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '800',
  },
});