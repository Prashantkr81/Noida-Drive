import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../constants/colors';

const benefits = [
  {
    icon: 'airplane-outline' as const,
    title: 'Airport Transfers',
    description:
      'Professional and reliable transportation for executive airport travel.',
  },
  {
    icon: 'people-outline' as const,
    title: 'Employee Mobility',
    description:
      'Reliable transportation solutions for your workforce.',
  },
  {
    icon: 'car-sport-outline' as const,
    title: 'Executive Fleet',
    description:
      'Premium cars for executives, clients and business events.',
  },
  {
    icon: 'headset-outline' as const,
    title: 'Priority Support',
    description:
      'Dedicated assistance for your corporate transportation needs.',
  },
  {
    icon: 'receipt-outline' as const,
    title: 'Flexible Billing',
    description:
      'Monthly billing and plans designed around your business.',
  },
  {
    icon: 'trending-up-outline' as const,
    title: 'Flexible Scaling',
    description:
      'Scale your fleet based on your business requirements.',
  },
];

export default function CorporateScreen() {
  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.white}
          />
        </Pressable>

        <Text style={styles.headerTitle}>
          Corporate
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

        {/* Hero */}

        <View style={styles.hero}>
          <Text style={styles.badge}>
            BUSINESS MOBILITY
          </Text>

          <Text style={styles.title}>
            Elevate Your{'\n'}
            Business Mobility
          </Text>

          <Text style={styles.description}>
            Tailored car rental solutions for modern
            businesses across Greater Noida and Delhi NCR.
          </Text>
        </View>

        {/* CTA */}

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push('/corporate/consultation')}
        >
          <Text style={styles.primaryButtonText}>
            Schedule a Consultation
          </Text>

          <Ionicons
            name="arrow-forward"
            size={20}
            color={colors.background}
          />
        </Pressable>

        {/* Benefits */}

        <Text style={styles.sectionTitle}>
          Corporate Solutions
        </Text>

        <View style={styles.grid}>
          {benefits.map((benefit) => (
            <View
              key={benefit.title}
              style={styles.benefitCard}
            >
              <View style={styles.benefitIcon}>
                <Ionicons
                  name={benefit.icon}
                  size={24}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.benefitTitle}>
                {benefit.title}
              </Text>

              <Text style={styles.benefitDescription}>
                {benefit.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Bottom CTA */}

        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>
            Need a custom corporate plan?
          </Text>

          <Text style={styles.bottomDescription}>
            Tell us about your requirements and our team
            will design a solution for your business.
          </Text>

          <Pressable
            style={styles.outlineButton}
            onPress={() =>
              router.push('/corporate/consultation')
            }
          >
            <Text style={styles.outlineButtonText}>
              Talk to Our Team
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    height: 95,
    paddingTop: 48,
    paddingHorizontal: 20,
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
    fontSize: 17,
    fontWeight: '800',
  },

  headerSpacer: {
    width: 42,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  hero: {
    marginTop: 25,
  },

  badge: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 18,
  },

  title: {
    color: colors.white,
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
  },

  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
    marginTop: 18,
  },

  primaryButton: {
    marginTop: 28,
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingVertical: 17,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  primaryButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '900',
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 40,
    marginBottom: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  benefitCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 16,
    minHeight: 180,
  },

  benefitIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  benefitTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 16,
  },

  benefitDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },

  bottomCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 22,
    marginTop: 24,
  },

  bottomTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
  },

  bottomDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },

  outlineButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 13,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },

  outlineButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
});