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
import { useSell } from '../../hooks/useSell';
import { SellSubmission } from '../../types';

export default function SellSubmissionsScreen() {
  const {
    submissions,
    loading,
    error,
  } = useSell();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading your submissions...
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
          Unable to load submissions
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
            My Sell Submissions
          </Text>

          <Text style={styles.subtitle}>
            {submissions.length} submission
            {submissions.length !== 1
              ? 's'
              : ''}
          </Text>
        </View>

        <View style={styles.headerSpace} />
      </View>

      {/* Submissions */}

      <FlatList
        data={submissions}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.list,
          submissions.length === 0 &&
            styles.emptyList,
        ]}
        renderItem={({ item }) => (
          <SubmissionCard
            submission={item}
            onPress={() =>
              router.push({
                pathname:
                  '/profile/sell-submission/[id]',
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptySubmissions />
        }
      />
    </View>
  );
}

/* ===================================== */
/* SUBMISSION CARD */
/* ===================================== */

function SubmissionCard({
  submission,
  onPress,
}: {
  submission: SellSubmission;
  onPress: () => void;
}) {
  const status =
    getStatusConfig(
      submission.status,
    );

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.carIcon}>
        <Ionicons
          name="car-sport-outline"
          size={24}
          color={colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.topRow}>
          <Text
            style={styles.carName}
            numberOfLines={1}
          >
            {submission.make}{' '}
            {submission.model}
          </Text>

          <View
            style={[
              styles.status,
              {
                borderColor:
                  status.color,
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    status.color,
                },
              ]}
            >
              {status.label}
            </Text>
          </View>
        </View>

        <Text style={styles.carMeta}>
          {submission.year} •{' '}
          {Number(
            submission.kilometersDriven,
          ).toLocaleString(
            'en-IN',
          )}{' '}
          km
        </Text>

        <View style={styles.priceRow}>
          <View>
            <Text
              style={styles.priceLabel}
            >
              EXPECTED PRICE
            </Text>

            <Text style={styles.price}>
              {submission.expectedPrice
                ? `₹${Number(
                    submission.expectedPrice,
                  ).toLocaleString(
                    'en-IN',
                  )}`
                : 'Not specified'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.textMuted}
          />
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.date}>
            {formatDate(
              submission.createdAt,
            )}
          </Text>

          <Text
            style={[
              styles.statusDescription,
              {
                color: status.color,
              },
            ]}
          >
            {status.shortDescription}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/* ===================================== */
/* STATUS */
/* ===================================== */

function getStatusConfig(
  status: SellSubmission['status'],
) {
  switch (status) {
    case 'reviewing':
      return {
        label: 'Reviewing',
        color: '#3B82F6',
        shortDescription:
          'Under review',
      };

    case 'approved':
      return {
        label: 'Approved',
        color: '#22C55E',
        shortDescription:
          'Listing approved',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        color: colors.error,
        shortDescription:
          'Not approved',
      };

    case 'cancelled':
      return {
        label: 'Cancelled',
        color: colors.textMuted,
        shortDescription:
          'Cancelled',
      };

    case 'pending':
    default:
      return {
        label: 'Pending',
        color: '#F59E0B',
        shortDescription:
          'Waiting for review',
      };
  }
}

/* ===================================== */
/* EMPTY STATE */
/* ===================================== */

function EmptySubmissions() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="car-outline"
          size={38}
          color={colors.primary}
        />
      </View>

      <Text style={styles.emptyTitle}>
        No Sell Submissions
      </Text>

      <Text style={styles.emptyText}>
        Cars you submit for selling will
        appear here once you create a
        submission.
      </Text>

      <Pressable
        style={styles.sellButton}
        onPress={() =>
          router.push('/sell')
        }
      >
        <Text style={styles.sellButtonText}>
          Sell Your Car
        </Text>

        <Ionicons
          name="arrow-forward"
          size={16}
          color={colors.background}
        />
      </Pressable>
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
    backgroundColor:
      colors.background,
  },

  center: {
    flex: 1,
    backgroundColor:
      colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 11,
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

  /* Header */

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
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  title: {
    color: colors.white,
    fontSize: 19,
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

  /* List */

  list: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  /* Card */

  card: {
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 18,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
  },

  carIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor:
      colors.surfaceLight,
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

  carMeta: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 5,
  },

  priceRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  priceLabel: {
    color: colors.textMuted,
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  price: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },

  bottomRow: {
    marginTop: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  date: {
    color: colors.textMuted,
    fontSize: 9,
  },

  statusDescription: {
    fontSize: 8,
    fontWeight: '800',
  },

  /* Empty */

  empty: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
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

  sellButton: {
    marginTop: 20,
    backgroundColor:
      colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  sellButtonText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '900',
  },
});