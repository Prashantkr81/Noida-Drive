import {
  ActivityIndicator,
  Image,
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
  collection,
  doc,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { colors } from '../../../constants/colors';
import { db } from '../../../services/firebase/config';
import type { SellSubmission } from '../../../types';

export default function SellSubmissionDetailScreen() {
  const { id } =
    useLocalSearchParams<{ id: string }>();

  const [submission, setSubmission] =
    useState<SellSubmission | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    if (!id) {
      setError('Submission not found.');
      setLoading(false);
      return;
    }

    const submissionRef = doc(
      db,
      'sellSubmissions',
      id,
    );

    const unsubscribe = onSnapshot(
      submissionRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError(
            'This submission no longer exists.',
          );
          setSubmission(null);
        } else {
          setSubmission({
            id: snapshot.id,
            ...snapshot.data(),
          } as SellSubmission);

          setError('');
        }

        setLoading(false);
      },
      (firebaseError) => {
        console.error(
          'SELL SUBMISSION DETAIL ERROR:',
          firebaseError,
        );

        setError(
          'Unable to load this submission.',
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
          Loading submission...
        </Text>
      </View>
    );
  }

  if (error || !submission) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Ionicons
            name="alert-circle-outline"
            size={38}
            color={colors.error}
          />
        </View>

        <Text style={styles.errorTitle}>
          Unable to Load Submission
        </Text>

        <Text style={styles.errorText}>
          {error ||
            'The requested submission could not be found.'}
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const statusConfig =
    getStatusConfig(
      submission.status,
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

          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>
              SELL SUBMISSION
            </Text>

            <Text style={styles.title}>
              Submission Details
            </Text>
          </View>
        </View>

        {/* Car */}

        <View style={styles.carCard}>
          {submission.images?.length ? (
            <Image
              source={{
                uri: submission.images[0],
              }}
              style={styles.coverImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="car-sport-outline"
                size={50}
                color={colors.textMuted}
              />
            </View>
          )}

          <View style={styles.carInfo}>
            <Text style={styles.carName}>
              {submission.make}{' '}
              {submission.model}
            </Text>

            <Text style={styles.carMeta}>
              {submission.year} •{' '}
              {Number(
                submission.kilometersDriven,
              ).toLocaleString('en-IN')}{' '}
              km
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
                  `${statusConfig.color}15`,
              },
            ]}
          >
            <Ionicons
              name={statusConfig.icon}
              size={25}
              color={statusConfig.color}
            />
          </View>

          <View style={styles.statusContent}>
            <Text style={styles.statusLabel}>
              CURRENT STATUS
            </Text>

            <Text
              style={[
                styles.statusText,
                {
                  color:
                    statusConfig.color,
                },
              ]}
            >
              {statusConfig.label}
            </Text>

            <Text style={styles.statusDescription}>
              {statusConfig.description}
            </Text>
          </View>
        </View>

        {/* Car Details */}

        <SectionTitle title="Vehicle Details" />

        <View style={styles.detailsCard}>
          <Detail
            label="Make"
            value={submission.make}
          />

          <Detail
            label="Model"
            value={submission.model}
          />

          <Detail
            label="Year"
            value={String(
              submission.year,
            )}
          />

          <Detail
            label="Kilometers"
            value={`${Number(
              submission.kilometersDriven,
            ).toLocaleString(
              'en-IN',
            )} km`}
          />

          <Detail
            label="Condition"
            value={formatValue(
              submission.condition,
            )}
          />

          <Detail
            label="Fuel"
            value={
              submission.fuelType ||
              'Not specified'
            }
          />

          <Detail
            label="Transmission"
            value={
              submission.transmission ||
              'Not specified'
            }
          />

          <Detail
            label="Color"
            value={
              submission.color ||
              'Not specified'
            }
          />

          <Detail
            label="Expected Price"
            value={
              submission.expectedPrice
                ? `₹${Number(
                    submission.expectedPrice,
                  ).toLocaleString(
                    'en-IN',
                  )}`
                : 'Not specified'
            }
          />
        </View>

        {/* Photos */}

        {submission.images?.length ? (
          <>
            <SectionTitle title="Vehicle Photos" />

            <View style={styles.gallery}>
              {submission.images.map(
                (image, index) => (
                  <Image
                    key={`${image}-${index}`}
                    source={{
                      uri: image,
                    }}
                    style={styles.galleryImage}
                  />
                ),
              )}
            </View>
          </>
        ) : null}

        {/* Admin Feedback */}

        {submission.adminNotes ? (
          <>
            <SectionTitle title="Admin Notes" />

            <View style={styles.noteCard}>
              <Ionicons
                name="information-circle-outline"
                size={21}
                color={colors.primary}
              />

              <Text style={styles.noteText}>
                {submission.adminNotes}
              </Text>
            </View>
          </>
        ) : null}

        {/* Rejection */}

        {submission.rejectionReason ? (
          <>
            <SectionTitle title="Reason for Rejection" />

            <View style={styles.rejectionCard}>
              <Ionicons
                name="close-circle-outline"
                size={21}
                color={colors.error}
              />

              <Text
                style={styles.rejectionText}
              >
                {submission.rejectionReason}
              </Text>
            </View>
          </>
        ) : null}

        {/* Approved Listing */}

        {submission.status ===
          'approved' &&
        submission.listingId ? (
          <View style={styles.approvedCard}>
            <View style={styles.approvedIcon}>
              <Ionicons
                name="checkmark-circle"
                size={25}
                color={colors.primary}
              />
            </View>

            <View style={styles.approvedContent}>
              <Text style={styles.approvedTitle}>
                Your car has been approved
              </Text>

              <Text style={styles.approvedText}>
                Your vehicle is now available as
                an approved marketplace listing.
              </Text>
            </View>

            <Pressable
              style={styles.viewListingButton}
              onPress={() =>
                router.push({
                  pathname:
                    '/marketplace/[id]',
                  params: {
                    id: submission.listingId,
                  },
                })
              }
            >
              <Text
                style={
                  styles.viewListingText
                }
              >
                View Listing
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.background}
              />
            </Pressable>
          </View>
        ) : null}

        {/* Submission ID */}

        <View style={styles.idCard}>
          <Text style={styles.idLabel}>
            SUBMISSION ID
          </Text>

          <Text style={styles.idValue}>
            {submission.id}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ===================================== */
/* STATUS CONFIG */
/* ===================================== */

function getStatusConfig(
  status: SellSubmission['status'],
) {
  switch (status) {
    case 'reviewing':
      return {
        label: 'Under Review',
        color: '#3B82F6',
        icon:
          'eye-outline' as const,
        description:
          'Our team is currently reviewing your vehicle information.',
      };

    case 'approved':
      return {
        label: 'Approved',
        color: '#22C55E',
        icon:
          'checkmark-circle-outline' as const,
        description:
          'Your vehicle has been approved.',
      };

    case 'rejected':
      return {
        label: 'Rejected',
        color: colors.error,
        icon:
          'close-circle-outline' as const,
        description:
          'Your submission was not approved.',
      };

    case 'cancelled':
      return {
        label: 'Cancelled',
        color: colors.textMuted,
        icon:
          'remove-circle-outline' as const,
        description:
          'This submission has been cancelled.',
      };

    case 'pending':
    default:
      return {
        label: 'Pending Review',
        color: '#F59E0B',
        icon:
          'time-outline' as const,
        description:
          'Your submission is waiting for admin review.',
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
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

/* ===================================== */
/* HELPERS */
/* ===================================== */

function formatValue(
  value?: string,
) {
  if (!value) {
    return 'Not specified';
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
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
    marginBottom: 22,
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

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  title: {
    color: colors.white,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 3,
  },

  /* Car */

  carCard: {
    backgroundColor:
      colors.surface,
    borderRadius: 19,
    borderWidth: 1,
    borderColor:
      colors.border,
    overflow: 'hidden',
  },

  coverImage: {
    width: '100%',
    height: 190,
  },

  imagePlaceholder: {
    width: '100%',
    height: 190,
    backgroundColor:
      colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  carInfo: {
    padding: 15,
  },

  carName: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '900',
  },

  carMeta: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 5,
  },

  /* Status */

  statusCard: {
    marginTop: 15,
    padding: 15,
    backgroundColor:
      colors.surface,
    borderRadius: 17,
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

  statusText: {
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

  /* Section */

  sectionTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 25,
    marginBottom: 11,
  },

  /* Details */

  detailsCard: {
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  detail: {
    width: '50%',
    paddingVertical: 9,
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
    marginTop: 4,
  },

  /* Gallery */

  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  galleryImage: {
    width: '31.8%',
    aspectRatio: 1,
    borderRadius: 11,
    backgroundColor:
      colors.surface,
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

  /* Rejection */

  rejectionCard: {
    backgroundColor:
      'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(239,68,68,0.22)',
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

  /* Approved */

  approvedCard: {
    marginTop: 25,
    padding: 15,
    backgroundColor:
      'rgba(34,197,94,0.07)',
    borderWidth: 1,
    borderColor:
      'rgba(34,197,94,0.2)',
    borderRadius: 16,
  },

  approvedIcon: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor:
      'rgba(34,197,94,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  approvedContent: {
    marginTop: 10,
  },

  approvedTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
  },

  approvedText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  viewListingButton: {
    height: 45,
    marginTop: 13,
    borderRadius: 11,
    backgroundColor:
      colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  viewListingText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '900',
  },

  /* ID */

  idCard: {
    marginTop: 20,
    padding: 13,
    backgroundColor:
      colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor:
      colors.border,
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
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
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