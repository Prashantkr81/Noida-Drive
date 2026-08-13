import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors } from '../../constants/colors';
import { useBookings } from '../../hooks/useBookings';
import { Booking } from '../../types';

export default function BookingsScreen() {
  const {
    bookings,
    loading,
    error,
  } = useBookings();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading your rentals...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cloud-offline-outline"
          size={50}
          color={colors.error}
        />

        <Text style={styles.errorTitle}>
          Unable to load rentals
        </Text>

        <Text style={styles.errorText}>
          Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            My Rentals
          </Text>

          <Text style={styles.subtitle}>
            {bookings.length} request
            {bookings.length !== 1
              ? 's'
              : ''}
          </Text>
        </View>

        <View style={styles.headerSpace} />
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          bookings.length === 0 &&
            styles.emptyList,
        ]}
        renderItem={({ item }) => (
          <BookingCard
            booking={item}
            onPress={() =>
              router.push({
                pathname:
                  '/bookings/[id]',
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyBookings />
        }
      />
    </View>
  );
}

function BookingCard({
  booking,
  onPress,
}: {
  booking: Booking;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      {/* Car Icon */}

      <View style={styles.carIcon}>
        <Ionicons
          name="car-sport-outline"
          size={24}
          color={colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        {/* Top */}

        <View style={styles.topRow}>
          <Text
            style={styles.carName}
            numberOfLines={1}
          >
            {booking.carMake}{' '}
            {booking.carModel}
          </Text>

          <StatusBadge
            status={booking.status}
          />
        </View>

        {/* Rental Type */}

        <View style={styles.rentalTypeRow}>
          <Ionicons
            name={
              booking.rentalType ===
              'chauffeur'
                ? 'person-outline'
                : 'car-outline'
            }
            size={13}
            color={colors.textMuted}
          />

          <Text style={styles.rentalType}>
            {booking.rentalType ===
            'chauffeur'
              ? 'Chauffeur'
              : 'Self Drive'}
          </Text>
        </View>

        {/* Dates */}

        <View style={styles.dateRow}>
          <View>
            <Text style={styles.dateLabel}>
              START
            </Text>

            <Text style={styles.date}>
              {formatDate(
                booking.startDate,
              )}
            </Text>
          </View>

          <Ionicons
            name="arrow-forward"
            size={15}
            color={colors.textMuted}
          />

          <View>
            <Text style={styles.dateLabel}>
              END
            </Text>

            <Text style={styles.date}>
              {formatDate(
                booking.endDate,
              )}
            </Text>
          </View>
        </View>

        {/* Bottom */}

        <View style={styles.bottomRow}>
          <Text style={styles.location}>
            <Ionicons
              name="location-outline"
              size={11}
              color={colors.textMuted}
            />{' '}
            {booking.pickupLocation}
          </Text>

          <Ionicons
            name="chevron-forward"
            size={17}
            color={colors.textMuted}
          />
        </View>
      </View>
    </Pressable>
  );
}

function StatusBadge({
  status,
}: {
  status: Booking['status'];
}) {
  const config = {
    pending: {
      label: 'Pending',
      color: colors.primary,
    },

    reviewing: {
      label: 'Reviewing',
      color: '#F59E0B',
    },

    confirmed: {
      label: 'Confirmed',
      color: '#22C55E',
    },

    rejected: {
      label: 'Rejected',
      color: colors.error,
    },

    cancelled: {
      label: 'Cancelled',
      color: colors.textMuted,
    },

    completed: {
      label: 'Completed',
      color: '#22C55E',
    },
  };

  const current =
    config[status];

  return (
    <View
      style={[
        styles.status,
        {
          borderColor:
            current.color,
        },
      ]}
    >
      <Text
        style={[
          styles.statusText,
          {
            color: current.color,
          },
        ]}
      >
        {current.label}
      </Text>
    </View>
  );
}

function EmptyBookings() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="car-outline"
          size={40}
          color={colors.primary}
        />
      </View>

      <Text style={styles.emptyTitle}>
        No Rentals Yet
      </Text>

      <Text style={styles.emptyText}>
        Your rental requests and booking
        history will appear here.
      </Text>

      <Pressable
        style={styles.browseButton}
        onPress={() =>
          router.replace('/rent')
        }
      >
        <Text style={styles.browseText}>
          Browse Rental Cars
        </Text>
      </Pressable>
    </View>
  );
}

function formatDate(
  value: unknown,
) {
  // Current implementation stores
  // dates as strings from the rental form.
  if (typeof value === 'string') {
    return value || 'N/A';
  }

  // Supports Firestore Timestamp
  // if we switch to Timestamp later.
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: 12,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 15,
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 7,
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
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

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 3,
  },

  headerSpace: {
    width: 42,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
  },

  carIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContent: {
    flex: 1,
    marginLeft: 13,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  carName: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    marginRight: 8,
  },

  status: {
    borderWidth: 1,
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 8,
    fontWeight: '900',
  },

  rentalTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 8,
  },

  rentalType: {
    color: colors.textMuted,
    fontSize: 9,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 13,
  },

  dateLabel: {
    color: colors.textMuted,
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  date: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },

  bottomRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 12,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  location: {
    flex: 1,
    color: colors.textMuted,
    fontSize: 9,
    marginRight: 10,
  },

  empty: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 18,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },

  browseButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  browseText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '900',
  },
});