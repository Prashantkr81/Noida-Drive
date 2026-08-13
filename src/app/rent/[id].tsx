import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
} from 'firebase/firestore';

import { colors } from '../../constants/colors';
import { db } from '../../services/firebase/config';
import { createBooking } from '../../services/firebase/bookings';
import { useAuth } from '../../hooks/useAuth';
import { Car } from '../../types';

type RentalType =
  | 'self_drive'
  | 'chauffeur';

export default function RentCarDetails() {
  const { id } =
    useLocalSearchParams<{
      id: string;
    }>();

  const { user } = useAuth();

  const [car, setCar] =
    useState<Car | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [rentalType, setRentalType] =
    useState<RentalType>('self_drive');

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  const [pickupLocation, setPickupLocation] =
    useState('');

  const [dropLocation, setDropLocation] =
    useState('');

  const [specialRequest, setSpecialRequest] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);

  useEffect(() => {
    const loadCar = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDoc(
          doc(db, 'cars', id),
        );

        if (snapshot.exists()) {
          setCar({
            id: snapshot.id,
            ...snapshot.data(),
          } as Car);
        }
      } catch (error) {
        console.error(
          'RENT CAR ERROR:',
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  const handleRequest = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login before requesting a rental.',
        [
          {
            text: 'Login',
            onPress: () =>
              router.push('/(auth)/login'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
      );

      return;
    }

    if (!car) {
      return;
    }

    if (
      !startDate.trim() ||
      !endDate.trim()
    ) {
      Alert.alert(
        'Dates Required',
        'Please enter your rental start and end dates.',
      );
      return;
    }

    if (!pickupLocation.trim()) {
      Alert.alert(
        'Pickup Location Required',
        'Please enter your pickup location.',
      );
      return;
    }

    try {
      setSubmitting(true);

      await createBooking({
        userId: user.uid,

        userName:
          user.displayName || '',

        userPhone:
          user.phoneNumber || '',

        userEmail:
          user.email || '',

        carId: car.id,

        rentalType,

        startDate:
          startDate.trim(),

        endDate:
          endDate.trim(),

        pickupLocation:
          pickupLocation.trim(),

        dropLocation:
          dropLocation.trim(),

        specialRequest:
          specialRequest.trim(),

        estimatedPrice:
          car.pricePerDay || 0,
      });

      Alert.alert(
        'Rental Request Submitted',
        'Your request has been sent to Noida Drive. Our team will review it and contact you.',
        [
          {
            text: 'View My Bookings',
            onPress: () =>
              router.replace(
                '/bookings',
              ),
          },
        ],
      );
    } catch (error: any) {
      console.error(
        'RENTAL REQUEST ERROR:',
        error,
      );

      Alert.alert(
        'Request Failed',
        error?.message ||
          'Unable to submit rental request.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  if (!car) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="car-outline"
          size={55}
          color={colors.textMuted}
        />

        <Text style={styles.notFound}>
          Rental car not found
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const image =
    car.thumbnail ||
    car.images?.[0];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Car Image */}

        <View style={styles.imageContainer}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="car-outline"
                size={70}
                color={colors.textMuted}
              />
            </View>
          )}

          <Pressable
            style={styles.backIcon}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.white}
            />
          </Pressable>

          <View style={styles.availableBadge}>
            <View
              style={styles.availableDot}
            />

            <Text style={styles.availableText}>
              AVAILABLE FOR RENT
            </Text>
          </View>
        </View>

        {/* Car Information */}

        <View style={styles.carInfo}>
          <Text style={styles.make}>
            {car.make}
          </Text>

          <Text style={styles.model}>
            {car.model}
          </Text>

          <Text style={styles.year}>
            {car.year} • {car.type}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {car.pricePerDay
                ? `₹${car.pricePerDay.toLocaleString(
                    'en-IN',
                  )}`
                : 'Price on request'}
            </Text>

            {car.pricePerDay && (
              <Text style={styles.perDay}>
                / day
              </Text>
            )}
          </View>
        </View>

        {/* Specs */}

        <View style={styles.specGrid}>
          <Spec
            icon="flash-outline"
            label="Fuel"
            value={car.fuelType}
          />

          <Spec
            icon="settings-outline"
            label="Transmission"
            value={car.transmission}
          />

          <Spec
            icon="speedometer-outline"
            label="Mileage"
            value={
              car.mileage
                ? `${car.mileage.toLocaleString(
                    'en-IN',
                  )} km`
                : 'N/A'
            }
          />

          <Spec
            icon="color-palette-outline"
            label="Color"
            value={car.color || 'N/A'}
          />
        </View>

        {/* Rental Request */}

        <Text style={styles.sectionTitle}>
          Rental Request
        </Text>

        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />

          <Text style={styles.infoText}>
            This is a rental request, not an
            instant booking. Our team will
            confirm availability and final
            pricing.
          </Text>
        </View>

        {/* Rental Type */}

        <Text style={styles.label}>
          RENTAL TYPE
        </Text>

        <View style={styles.rentalTypes}>
          <RentalTypeButton
            icon="car-outline"
            title="Self Drive"
            active={
              rentalType === 'self_drive'
            }
            onPress={() =>
              setRentalType(
                'self_drive',
              )
            }
          />

          <RentalTypeButton
            icon="person-outline"
            title="Chauffeur"
            active={
              rentalType === 'chauffeur'
            }
            onPress={() =>
              setRentalType(
                'chauffeur',
              )
            }
          />
        </View>

        {/* Dates */}

        <Text style={styles.label}>
          RENTAL DATES
        </Text>

        <View style={styles.dateRow}>
          <DateInput
            label="START DATE"
            placeholder="DD/MM/YYYY"
            value={startDate}
            onChange={setStartDate}
          />

          <DateInput
            label="END DATE"
            placeholder="DD/MM/YYYY"
            value={endDate}
            onChange={setEndDate}
          />
        </View>

        {/* Pickup */}

        <Text style={styles.label}>
          PICKUP LOCATION
        </Text>

        <Input
          icon="location-outline"
          placeholder="Where should we deliver/pickup?"
          value={pickupLocation}
          onChange={setPickupLocation}
        />

        {/* Drop */}

        <Text style={styles.label}>
          DROP LOCATION
        </Text>

        <Input
          icon="navigate-outline"
          placeholder="Return/drop location"
          value={dropLocation}
          onChange={setDropLocation}
        />

        {/* Special Request */}

        <Text style={styles.label}>
          SPECIAL REQUEST
        </Text>

        <TextInput
          value={specialRequest}
          onChangeText={setSpecialRequest}
          placeholder="Any additional requirements..."
          placeholderTextColor={
            colors.textMuted
          }
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={styles.textArea}
        />

        {/* Request */}

        <Pressable
          style={[
            styles.requestButton,
            submitting &&
              styles.disabledButton,
          ]}
          disabled={submitting}
          onPress={handleRequest}
        >
          {submitting ? (
            <ActivityIndicator
              color={colors.background}
            />
          ) : (
            <>
              <Ionicons
                name="paper-plane-outline"
                size={19}
                color={colors.background}
              />

              <Text
                style={styles.requestButtonText}
              >
                Request Rental
              </Text>
            </>
          )}
        </Pressable>

        <Text style={styles.disclaimer}>
          Final availability and pricing will
          be confirmed by Noida Drive.
        </Text>
      </ScrollView>
    </View>
  );
}

function RentalTypeButton({
  icon,
  title,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.rentalType,
        active &&
          styles.rentalTypeActive,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={22}
        color={
          active
            ? colors.background
            : colors.primary
        }
      />

      <Text
        style={[
          styles.rentalTypeText,
          active &&
            styles.rentalTypeTextActive,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

function DateInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.dateInputContainer}>
      <Text style={styles.dateLabel}>
        {label}
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons
          name="calendar-outline"
          size={17}
          color={colors.textMuted}
        />

        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={
            colors.textMuted
          }
          style={styles.input}
        />
      </View>
    </View>
  );
}

function Input({
  icon,
  placeholder,
  value,
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.inputContainer}>
      <Ionicons
        name={icon}
        size={18}
        color={colors.textMuted}
      />

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={
          colors.textMuted
        }
        style={styles.input}
      />
    </View>
  );
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.spec}>
      <View style={styles.specIcon}>
        <Ionicons
          name={icon}
          size={19}
          color={colors.primary}
        />
      </View>

      <View style={styles.specContent}>
        <Text style={styles.specLabel}>
          {label}
        </Text>

        <Text style={styles.specValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingBottom: 45,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  imageContainer: {
    height: 290,
    backgroundColor: colors.surface,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    position: 'absolute',
    top: 55,
    left: 18,
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor:
      'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  availableBadge: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    backgroundColor:
      'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },

  availableText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  carInfo: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },

  make: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  model: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 4,
  },

  year: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 16,
  },

  price: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '900',
  },

  perDay: {
    color: colors.textMuted,
    fontSize: 11,
    marginLeft: 4,
  },

  specGrid: {
    paddingHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  spec: {
    width: '48%',
    minHeight: 65,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },

  specIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  specContent: {
    flex: 1,
    marginLeft: 9,
  },

  specLabel: {
    color: colors.textMuted,
    fontSize: 9,
  },

  specValue: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 3,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 12,
    paddingHorizontal: 20,
  },

  infoCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
  },

  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
  },

  label: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 20,
  },

  rentalTypes: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
  },

  rentalType: {
    flex: 1,
    height: 75,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  rentalTypeActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  rentalTypeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '800',
  },

  rentalTypeTextActive: {
    color: colors.background,
  },

  dateRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
  },

  dateInputContainer: {
    flex: 1,
  },

  dateLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    marginBottom: 6,
  },

  inputContainer: {
    minHeight: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    color: colors.white,
    fontSize: 12,
    marginLeft: 8,
  },

  textArea: {
    marginHorizontal: 20,
    minHeight: 105,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    color: colors.white,
    fontSize: 12,
  },

  requestButton: {
    marginHorizontal: 20,
    height: 55,
    borderRadius: 14,
    backgroundColor: colors.primary,
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  requestButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '900',
  },

  disclaimer: {
    color: colors.textMuted,
    fontSize: 9,
    lineHeight: 15,
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 10,
  },

  notFound: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 15,
  },

  backButton: {
    marginTop: 20,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  backText: {
    color: colors.background,
    fontWeight: '800',
  },
});