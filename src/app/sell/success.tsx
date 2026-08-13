import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import { colors } from '../../constants/colors';

export default function SellSuccessScreen() {
  const { id } =
    useLocalSearchParams<{
      id?: string;
    }>();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Icon */}

        <View style={styles.successIcon}>
          <Ionicons
            name="checkmark"
            size={48}
            color={colors.background}
          />
        </View>

        {/* Heading */}

        <Text style={styles.eyebrow}>
          SUBMISSION RECEIVED
        </Text>

        <Text style={styles.title}>
          Your Car Is Under Review
        </Text>

        <Text style={styles.description}>
          Thanks for submitting your car to
          Noida Drive. Our team will review
          the information and contact you
          regarding the next steps.
        </Text>

        {/* Status Card */}

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIcon}>
              <Ionicons
                name="time-outline"
                size={22}
                color="#F59E0B"
              />
            </View>

            <View style={styles.statusHeaderText}>
              <Text style={styles.statusLabel}>
                CURRENT STATUS
              </Text>

              <Text style={styles.status}>
                Pending Review
              </Text>
            </View>
          </View>

          <View style={styles.separator} />

          <Text style={styles.statusDescription}>
            Your submission has been successfully
            recorded. An administrator will review
            your vehicle before it can appear on
            the marketplace.
          </Text>
        </View>

        {/* Submission ID */}

        {id ? (
          <View style={styles.idCard}>
            <Text style={styles.idLabel}>
              SUBMISSION ID
            </Text>

            <Text style={styles.idValue}>
              {id}
            </Text>
          </View>
        ) : null}

        {/* Process */}

        <Text style={styles.sectionTitle}>
          What Happens Next?
        </Text>

        <View style={styles.timeline}>
          <TimelineItem
            number="1"
            title="Submission Received"
            description="Your vehicle information has been submitted successfully."
            active
          />

          <TimelineItem
            number="2"
            title="Admin Review"
            description="Our team will verify your vehicle details and submitted photos."
            active
          />

          <TimelineItem
            number="3"
            title="Approval"
            description="If approved, your car will be prepared for marketplace listing."
            active={false}
          />

          <TimelineItem
            number="4"
            title="Marketplace Listing"
            description="Your approved car becomes visible to potential buyers."
            active={false}
            last
          />
        </View>

        {/* Important Note */}

        <View style={styles.noteCard}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />

          <Text style={styles.noteText}>
            Submission does not automatically
            publish your car. All seller submissions
            are reviewed by Noida Drive before
            appearing in the marketplace.
          </Text>
        </View>

        {/* Actions */}

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push('/profile')
          }
        >
          <Ionicons
            name="person-outline"
            size={18}
            color={colors.background}
          />

          <Text style={styles.primaryButtonText}>
            View My Profile
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() =>
            router.replace('/marketplace')
          }
        >
          <Text style={styles.secondaryButtonText}>
            Browse Marketplace
          </Text>

          <Ionicons
            name="arrow-forward"
            size={17}
            color={colors.primary}
          />
        </Pressable>

        <Pressable
          onPress={() =>
            router.replace('/')
          }
        >
          <Text style={styles.homeText}>
            Back to Home
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

/* ===================================== */
/* TIMELINE */
/* ===================================== */

function TimelineItem({
  number,
  title,
  description,
  active,
  last = false,
}: {
  number: string;
  title: string;
  description: string;
  active: boolean;
  last?: boolean;
}) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View
          style={[
            styles.timelineCircle,
            active &&
              styles.timelineCircleActive,
          ]}
        >
          {active ? (
            <Ionicons
              name="checkmark"
              size={12}
              color={colors.background}
            />
          ) : (
            <Text style={styles.timelineNumber}>
              {number}
            </Text>
          )}
        </View>

        {!last && (
          <View
            style={[
              styles.timelineLine,
              active &&
                styles.timelineLineActive,
            ]}
          />
        )}
      </View>

      <View style={styles.timelineContent}>
        <Text
          style={[
            styles.timelineTitle,
            !active &&
              styles.timelineTitleInactive,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.timelineDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

/* ===================================== */
/* STYLES */
/* ===================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 45,
    alignItems: 'center',
  },

  /* Success */

  successIcon: {
    width: 92,
    height: 92,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 10,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginTop: 28,
  },

  title: {
    color: colors.white,
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 7,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 340,
  },

  /* Status */

  statusCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 17,
    marginTop: 25,
  },

  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor:
      'rgba(245,158,11,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusHeaderText: {
    marginLeft: 11,
  },

  statusLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  status: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 3,
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },

  statusDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
  },

  /* ID */

  idCard: {
    width: '100%',
    marginTop: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    padding: 13,
  },

  idLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  idValue: {
    color: colors.textSecondary,
    fontSize: 9,
    marginTop: 6,
  },

  /* Timeline */

  sectionTitle: {
    width: '100%',
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 28,
    marginBottom: 13,
  },

  timeline: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 17,
  },

  timelineItem: {
    flexDirection: 'row',
    minHeight: 72,
  },

  timelineLeft: {
    width: 27,
    alignItems: 'center',
  },

  timelineCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  timelineCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  timelineNumber: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
  },

  timelineLine: {
    flex: 1,
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 3,
  },

  timelineLineActive: {
    backgroundColor: colors.primary,
  },

  timelineContent: {
    flex: 1,
    marginLeft: 12,
  },

  timelineTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },

  timelineTitleInactive: {
    color: colors.textMuted,
  },

  timelineDescription: {
    color: colors.textMuted,
    fontSize: 9,
    lineHeight: 15,
    marginTop: 4,
  },

  /* Note */

  noteCard: {
    width: '100%',
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: 9,
  },

  noteText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 9,
    lineHeight: 15,
  },

  /* Buttons */

  primaryButton: {
    width: '100%',
    height: 52,
    marginTop: 25,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  primaryButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '900',
  },

  secondaryButton: {
    width: '100%',
    height: 50,
    marginTop: 10,
    borderRadius: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  secondaryButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  homeText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 18,
  },
});