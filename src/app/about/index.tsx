import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  router,
} from 'expo-router';

import {
  Ionicons,
} from '@expo/vector-icons';

import { colors } from '../../constants/colors';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.white}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            About App
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.logoCard}>
          <View style={styles.logo}>
            <Ionicons
              name="car-sport"
              size={38}
              color={colors.primary}
            />
          </View>

          <Text style={styles.appName}>
            Noida Drive
          </Text>

          <Text style={styles.tagline}>
            Your trusted car marketplace
          </Text>
        </View>

        <InfoCard
          title="About Noida Drive"
          text="Noida Drive connects customers with vehicles for rental and marketplace transactions. Browse cars, request rentals, submit quotes, and manage your vehicle-related requests in one place."
        />

        <InfoCard
          title="What You Can Do"
          text="Rent cars, explore marketplace listings, submit quotes, sell your vehicle, track requests, and connect with our team for consultation and support."
        />

        <InfoCard
          title="Version"
          text="Noida Drive App • v1.0.0"
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 Noida Drive
          </Text>

          <Text style={styles.footerSubtext}>
            Built for a better driving experience.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>
        {title}
      </Text>

      <Text style={styles.infoText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  iconButton: {
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
    flex: 1,
    textAlign: 'center',
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    marginHorizontal: 10,
  },

  headerSpace: {
    width: 42,
  },

  logoCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 25,
  },

  logo: {
    width: 78,
    height: 78,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  appName: {
    color: colors.white,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 16,
  },

  tagline: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 17,
    marginTop: 14,
  },

  infoTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '900',
  },

  infoText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 8,
  },

  footer: {
    alignItems: 'center',
    marginTop: 28,
  },

  footerText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },

  footerSubtext: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 5,
  },
});