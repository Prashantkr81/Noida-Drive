import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../constants/colors';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>
            NOIDA DRIVE
          </Text>

          <Text style={styles.location}>
            Greater Noida
          </Text>
        </View>

        <Pressable
          style={styles.menuButton}
          onPress={() => router.push('/menu')}
        >
          <Ionicons
            name="menu-outline"
            size={28}
            color={colors.white}
          />
        </Pressable>
      </View>

      {/* Hero */}

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Your Journey.{'\n'}
          Your Car.
        </Text>

        <Text style={styles.heroSubtitle}>
          Rent, buy or sell cars with Noida Drive.
        </Text>
      </View>

      {/* Services */}

      <View style={styles.services}>

        <Pressable
          style={styles.serviceCard}
          onPress={() => router.push('/(main)/rent')}
        >
          <Ionicons
            name="car-sport-outline"
            size={32}
            color={colors.primary}
          />

          <Text style={styles.serviceTitle}>
            Rent a Car
          </Text>

          <Text style={styles.serviceDescription}>
            Find the right car for your journey.
          </Text>
        </Pressable>

        <Pressable
          style={styles.serviceCard}
          onPress={() => router.push('/(main)/marketplace')}
        >
          <Ionicons
            name="swap-horizontal-outline"
            size={32}
            color={colors.secondary}
          />

          <Text style={styles.serviceTitle}>
            Buy & Sell
          </Text>

          <Text style={styles.serviceDescription}>
            Discover cars and send quotes.
          </Text>
        </Pressable>

      </View>

      {/* Corporate */}

      <Pressable
        style={styles.corporateCard}
        onPress={() => router.push('/corporate')}
      >
        <View style={styles.corporateIcon}>
          <Ionicons
            name="business-outline"
            size={28}
            color={colors.primary}
          />
        </View>

        <View style={styles.corporateContent}>
          <Text style={styles.corporateTitle}>
            Corporate Mobility
          </Text>

          <Text style={styles.corporateDescription}>
            Monthly rentals and tailored business plans.
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={22}
          color={colors.textMuted}
        />
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 58,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2.5,
  },

  location: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },

  menuButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hero: {
    marginTop: 48,
  },

  heroTitle: {
    color: colors.white,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '900',
  },

  heroSubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 14,
    maxWidth: 320,
  },

  services: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 36,
  },

  serviceCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    minHeight: 170,
  },

  serviceTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 20,
  },

  serviceDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },

  corporateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginTop: 14,
  },

  corporateIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  corporateContent: {
    flex: 1,
    marginLeft: 14,
  },

  corporateTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },

  corporateDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },
});