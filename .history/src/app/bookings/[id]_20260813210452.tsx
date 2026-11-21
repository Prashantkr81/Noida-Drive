import {
  ActivityIndicator,
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
import {
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { colors } from '../../constants/colors';
import { db } from '../../services/firebase/config';
import { Booking } from '../../types';

export default function BookingDetailsScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    if (!id) {
      setError('Booking not found.');
      setLoading(false);
      return;
    }

    const bookingRef = doc(
      db,
      'bookings',
      id,
    );

    const unsubscribe = onSnapshot(
      bookingRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setBooking(null);
          setError(
            'This rental request no longer exists.',
          );
        } else {
          setBooking({
            id: snapshot.id,
            ...snapshot.data(),
          } as Booking);

          setError('');
        }

        setLoading(false);
      },
      (firebaseError) => {
        console.error(
          'BOOKING DETAILS ERROR:',
          firebaseError,
        );

        setError(
          'Unable to load rental request.',
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
          Loading rental request...
        </Text>
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Ionicons
            name="alert-circle-outline"
            size={40}
            color={colors.error}
          />
        </View>

        <Text style={styles.errorTitle}>
          Rental Request Not Found
        </Text>

        <Text style={styles.errorText}>
          {error ||
            'This request could not be found.'}
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
      booking.status,
    );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* HEADER */}

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
              RENTAL REQUEST
            </Text>

            <Text style={styles.title}>
              Request Details
            </Text>
          </View>
        </View>

        {/* STATUS */}

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

        {/* CAR */}

        <SectionTitle title="Vehicle" />

        <View style={styles.card}>
          <View style={styles.carIcon}>
            <Ionicons
              name="car-sport-outline"
              size={28}
              color={colors.primary}
            />
          </View>

          <View style={styles.carInfo}>
            <Text style={styles.carName}>
              {booking.carMake}{' '}
              {booking.carModel}
            </Text>

            <Text style={styles.carId}>
              Car ID: {booking.carId}
            </Text>
          </View>
        </View>

        {/* RENTAL */}

        <SectionTitle title="Rental Details" />

        <View style={styles.card}>
          <Detail
            icon="options-outline"
            label="Rental Type"
            value={
              booking.rentalType ===
              'chauffeur'
                ? 'Chauffeur'
                : 'Self Drive'
            }
          />

          <Detail
            icon="calendar-outline"
            label="Start Date"
            value={formatDate(
              booking.startDate,
            )}
          />

          <Detail
            icon="calendar-outline"
            label="End Date"
            value={formatDate(
              booking.endDate,
            )}
          />

          <Detail
            icon="location-outline"
            label="Pickup Location"
            value={
              booking.pickupLocation ||
              'Not specified'
            }
          />

          <Detail
            icon="navigate-outline"
            label="Drop Location"
            value={
              booking.dropLocation ||
              'Not specified'
            }
          />
        </View>

        {/* PRICE */}

        <SectionTitle title="Pricing" />

        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Estimated Price
            </Text>

            <Text style={styles.estimatedPrice}>
              ₹
              {Number(
                booking.estimatedPrice || 0,
              ).toLocaleString(
                'en-IN',
              )}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              Final Price
            </Text>

            <Text style={styles.finalPrice}>
              {booking.finalPrice != null
                ? `₹${Number(
                    booking.finalPrice,
                  ).toLocaleString(
                    'en-IN',
                  )}`
                : 'To be confirmed'}
            </Text>
          </View>
        </View>

        {/* SPECIAL REQUEST */}

        {booking.specialRequest ? (
          <>
            <SectionTitle title="Special Request" />

            <View style={styles.noteCard}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color={colors.primary}
              />

              <Text style={styles.noteText}>
                {booking.specialRequest}
              </Text>
            </View>
          </>
        ) : null}

        {/* ADMIN NOTES */}

        {booking.adminNotes ? (
          <>
            <SectionTitle title="Admin Update" />

            <View style={styles.noteCard}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color={colors.primary}
              />

              <Text style={styles.noteText}>
                {booking.adminNotes}
              </Text>
            </View>
          </>
        ) : null}

        {/* REJECTION */}

        {booking.rejectionReason ? (
          <>
            <SectionTitle title="Reason" />

            <View
              style={styles.rejectionCard}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={colors.error}
              />

              <Text
                style={
                  styles.rejectionText
                }
              >
                {booking.rejectionReason}
              </Text>
            </View>
          </>
        ) : null}

        {/* REQUEST ID */}

        <View style={styles.idCard}>
          <Text style={styles.idLabel}>
            REQUEST ID
          </Text>

          <Text style={styles.idValue}>
            {booking.id}
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
  status: Booking['status'],
) {
  switch (status) {
    case 'reviewing':
      return {
        label: 'Under Review',
        color: '#F59E0B',
        icon:
          'eye-outline' as const,
        description:
          'Our team is currently reviewing your rental request.',
      };

    case 'confirmed':
      return {
        label: 'Confirmed',
        color: '#22C55E',
        icon:
          'checkmark-circle-outline' as const,
        description:
          'Your rental request has been confirmed.',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        color: colors.error,
        icon:
          'close-circle-outline' as const,
        description:
          'Your rental request was not approved.',
      };

    case 'cancelled':
      return {
        label: 'Cancelled',
        color: colors.textMuted,
        icon:
          'remove-circle-outline' as const,
        description:
          'This rental request has been cancelled.',
      };

    case 'completed':
      return {
        label: 'Completed',
        color: '#22C55E',
        icon:
          'checkmark-done-outline' as const,
        description:
          'This rental has been completed.',
      };

    case 'pending':
    default:
      return {
        label: 'Pending',
        color: colors.primary,
        icon:
          'time-outline' as const,
        description:
          'Your rental request is waiting for review.',
      };
  }
}

/* ===================================== */
/* SECTION */
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
  if (typeof value === 'string') {
    return value || 'N/A';
  }

  if (
    value &&
    typeof value === 'object' &&
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

  return 'N/A';
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
    paddingBottom: 45,
  },

  center: {
    flex: 1,
    backgroundColor:
      colors.background,
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
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
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
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
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
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 17,
    padding: 15,
  },

  /* Car */

  carIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor:
      colors.surfaceLight,
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
    backgroundColor:
      colors.surfaceLight,
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

  /* Price */

  priceCard: {
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 17,
    padding: 16,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  priceLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  estimatedPrice: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },

  finalPrice: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor:
      colors.border,
    marginVertical: 13,
  },

  /* Notes */

  noteCard: {
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 9,
  },

  noteText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 16,
  },

  rejectionCard: {
    backgroundColor:
      'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(239,68,68,0.2)',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    gap: 9,
  },

  rejectionText: {
    flex: 1,
    color: colors.error,
    fontSize: 10,
    lineHeight: 16,
  },

  /* ID */

  idCard: {
    marginTop: 20,
    padding: 13,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
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
    backgroundColor:
      'rgba(239,68,68,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '900',
    marginTop: 17,
    textAlign: 'center',
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
    backgroundColor:
      colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '900',
  },
});