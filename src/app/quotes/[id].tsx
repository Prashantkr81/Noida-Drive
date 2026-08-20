import { Ionicons } from '@expo/vector-icons';
import {
    router,
    useLocalSearchParams,
} from 'expo-router';
import {
    doc,
    onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { colors } from '../../constants/colors';
import { db } from '../../services/firebase/config';
import { Quote } from '../../types';

export default function QuoteDetailsScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const [quote, setQuote] =
    useState<Quote | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    if (!id) {
      setError('Quote not found.');
      setLoading(false);
      return;
    }

    const quoteRef = doc(
      db,
      'quotes',
      id,
    );

    const unsubscribe = onSnapshot(
      quoteRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setQuote(null);
          setError(
            'This quote no longer exists.',
          );
        } else {
          setQuote({
            id: snapshot.id,
            ...snapshot.data(),
          } as Quote);

          setError('');
        }

        setLoading(false);
      },
      (firebaseError) => {
        console.error(
          'QUOTE DETAILS ERROR:',
          firebaseError,
        );

        setError(
          'Unable to load quote details.',
        );

        setLoading(false);
      },
    );

    return unsubscribe;
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading quote...
        </Text>
      </View>
    );
  }

  if (!quote) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Ionicons
            name="pricetag-outline"
            size={38}
            color={colors.error}
          />
        </View>

        <Text style={styles.errorTitle}>
          Quote Not Found
        </Text>

        <Text style={styles.errorText}>
          {error ||
            'This quote could not be found.'}
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.back()}
        >
          <Text
            style={styles.primaryButtonText}
          >
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const status =
    getStatusConfig(
      quote.status,
    );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
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

          <View>
            <Text style={styles.eyebrow}>
              QUOTE REQUEST
            </Text>

            <Text style={styles.title}>
              Quote Details
            </Text>
          </View>
        </View>

        {/* Status */}

        <View style={styles.statusCard}>
          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor:
                  `${status.color}15`,
              },
            ]}
          >
            <Ionicons
              name={status.icon}
              size={25}
              color={status.color}
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>
              CURRENT STATUS
            </Text>

            <Text
              style={[
                styles.status,
                {
                  color: status.color,
                },
              ]}
            >
              {status.label}
            </Text>

            <Text
              style={styles.statusDescription}
            >
              {status.description}
            </Text>
          </View>
        </View>

        {/* Vehicle */}

        <SectionTitle title="Vehicle" />

        <View style={styles.card}>
          <View style={styles.carIcon}>
            <Ionicons
              name="car-outline"
              size={28}
              color={colors.primary}
            />
          </View>

          <View style={styles.carInfo}>
            <Text style={styles.carName}>
              {quote.carMake}{' '}
              {quote.carModel}
            </Text>

            <Text style={styles.carId}>
              Car ID: {quote.carId}
            </Text>
          </View>
        </View>

        {/* Offer */}

        <SectionTitle title="Your Offer" />

        <View style={styles.offerCard}>
          <Text style={styles.offerLabel}>
            OFFERED PRICE
          </Text>

          <Text style={styles.offerPrice}>
            ₹
            {Number(
              quote.offeredPrice || 0,
            ).toLocaleString(
              'en-IN',
            )}
          </Text>

          <Text style={styles.offerDescription}>
            This is the price you submitted to
            the seller.
          </Text>
        </View>

        {/* Message */}

        {quote.message ? (
          <>
            <SectionTitle title="Your Message" />

            <View style={styles.messageCard}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color={colors.primary}
              />

              <Text style={styles.messageText}>
                {quote.message}
              </Text>
            </View>
          </>
        ) : null}

        {/* Buyer information */}

        <SectionTitle title="Request Information" />

        <View style={styles.card}>
          <Detail
            icon="person-outline"
            label="Buyer"
            value={
              quote.buyerName ||
              'Not specified'
            }
          />

          <Detail
            icon="call-outline"
            label="Phone"
            value={
              quote.buyerPhone ||
              'Not specified'
            }
          />

          <Detail
            icon="calendar-outline"
            label="Submitted"
            value={formatDate(
              quote.createdAt,
            )}
          />
        </View>

        {/* Status information */}

        {quote.status ===
          'pending' && (
          <View style={styles.infoCard}>
            <Ionicons
              name="time-outline"
              size={21}
              color={colors.primary}
            />

            <Text style={styles.infoText}>
              Your quote has been submitted and
              is waiting for review.
            </Text>
          </View>
        )}

        {quote.status ===
          'reviewing' && (
          <View style={styles.infoCard}>
            <Ionicons
              name="eye-outline"
              size={21}
              color={colors.primary}
            />

            <Text style={styles.infoText}>
              Your quote is currently being
              reviewed.
            </Text>
          </View>
        )}

        {quote.status ===
          'accepted' && (
          <View style={styles.successCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={21}
              color="#22C55E"
            />

            <Text style={styles.successText}>
              Your quote has been accepted.
              Further transaction details can
              be handled through the marketplace
              workflow.
            </Text>
          </View>
        )}

        {quote.status ===
          'rejected' && (
          <View style={styles.rejectionCard}>
            <Ionicons
              name="close-circle-outline"
              size={21}
              color={colors.error}
            />

            <Text
              style={styles.rejectionText}
            >
              This quote was rejected by the
              seller.
            </Text>
          </View>
        )}

        {quote.status ===
          'withdrawn' && (
          <View style={styles.withdrawnCard}>
            <Ionicons
              name="remove-circle-outline"
              size={21}
              color={colors.textMuted}
            />

            <Text style={styles.withdrawnText}>
              This quote has been withdrawn.
            </Text>
          </View>
        )}

        {/* Quote ID */}

        <View style={styles.idCard}>
          <Text style={styles.idLabel}>
            QUOTE ID
          </Text>

          <Text style={styles.idValue}>
            {quote.id}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ===================================== */
/* STATUS */
/* ===================================== */

function getStatusConfig(
  status: Quote['status'],
) {
  switch (status) {
    case 'reviewing':
      return {
        label: 'Reviewing',
        color: '#F59E0B',
        icon:
          'eye-outline' as const,
        description:
          'Your quote is currently being reviewed.',
      };

    case 'accepted':
      return {
        label: 'Accepted',
        color: '#22C55E',
        icon:
          'checkmark-circle-outline' as const,
        description:
          'Your quote has been accepted.',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        color: colors.error,
        icon:
          'close-circle-outline' as const,
        description:
          'Your quote was not accepted.',
      };

    case 'withdrawn':
      return {
        label: 'Withdrawn',
        color: colors.textMuted,
        icon:
          'remove-circle-outline' as const,
        description:
          'This quote has been withdrawn.',
      };

    case 'pending':
    default:
      return {
        label: 'Pending',
        color: colors.primary,
        icon:
          'time-outline' as const,
        description:
          'Your quote is waiting for review.',
      };
  }
}

/* ===================================== */
/* SECTION TITLE */
/* ===================================== */

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <Text style={styles.sectionTitle}>
      {title}
    </Text>
  );
}

/* ===================================== */
/* DETAIL */
/* ===================================== */

function Detail({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detail}>
      <View style={styles.detailIcon}>
        <Ionicons
          name={icon}
          size={17}
          color={colors.primary}
        />
      </View>

      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>
          {label}
        </Text>

        <Text style={styles.detailValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

/* ===================================== */
/* DATE */
/* ===================================== */

function formatDate(
  value: unknown,
) {
  if (!value) {
    return 'Recently';
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value
  ) {
    const date = (
      value as {
        toDate: () => Date;
      }
    ).toDate();

    return date.toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      },
    );
  }

  return 'Recently';
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
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 45,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 10,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    marginRight: 13,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 3,
  },

  /* Status */

  statusCard: {
    padding: 15,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusContent: {
    flex: 1,
    marginLeft: 12,
  },

  statusLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  status: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 3,
  },

  statusDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  /* Sections */

  sectionTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 25,
    marginBottom: 10,
  },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    padding: 15,
  },

  /* Vehicle */

  carIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  carInfo: {
    marginTop: 10,
  },

  carName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },

  carId: {
    color: colors.textMuted,
    fontSize: 8,
    marginTop: 4,
  },

  /* Offer */

  offerCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    padding: 18,
  },

  offerLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  offerPrice: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 5,
  },

  offerDescription: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 7,
  },

  /* Details */

  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },

  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailContent: {
    flex: 1,
    marginLeft: 10,
  },

  detailLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
  },

  detailValue: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },

  /* Message */

  messageCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 9,
  },

  messageText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
  },

  /* Info */

  infoCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: 9,
  },

  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
  },

  successCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(34,197,94,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.2)',
    flexDirection: 'row',
    gap: 9,
  },

  successText: {
    flex: 1,
    color: '#22C55E',
    fontSize: 10,
    lineHeight: 16,
  },

  rejectionCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
    flexDirection: 'row',
    gap: 9,
  },

  rejectionText: {
    flex: 1,
    color: colors.error,
    fontSize: 10,
    lineHeight: 16,
  },

  withdrawnCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: 9,
  },

  withdrawnText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 16,
  },

  /* ID */

  idCard: {
    marginTop: 20,
    padding: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },

  idLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },

  idValue: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 6,
  },

  /* Error */

  errorIcon: {
    width: 75,
    height: 75,
    borderRadius: 24,
    backgroundColor: 'rgba(239,68,68,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 17,
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 7,
  },

  primaryButton: {
    height: 50,
    paddingHorizontal: 25,
    marginTop: 20,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '900',
  },
});