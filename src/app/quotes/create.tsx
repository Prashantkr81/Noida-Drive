import {
  ActivityIndicator,
  Alert,
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

import {
  useEffect,
  useState,
} from 'react';

import {
  doc,
  getDoc,
} from 'firebase/firestore';

import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../services/firebase/config';
import { createQuote } from '../../services/firebase/quotes';

export default function CreateQuoteScreen() {
  const { carId } =
    useLocalSearchParams<{
      carId: string;
    }>();

  const { user, profile } = useAuth();

  const [car, setCar] =
    useState<any>(null);

  const [offeredPrice, setOfferedPrice] =
    useState('');

  const [message, setMessage] =
    useState('');

  const [submitting, setSubmitting] =
    useState(false);

  const [loadingCar, setLoadingCar] =
    useState(true);

  useEffect(() => {
    const loadCar = async () => {
      if (!carId) {
        setLoadingCar(false);
        return;
      }

      try {
        const snapshot = await getDoc(
          doc(db, 'cars', carId),
        );

        if (snapshot.exists()) {
          setCar({
            id: snapshot.id,
            ...snapshot.data(),
          });
        }
      } catch (error) {
        console.error(
          'QUOTE CAR ERROR:',
          error,
        );
      } finally {
        setLoadingCar(false);
      }
    };

    loadCar();
  }, [carId]);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login before requesting a quote.',
      );

      return;
    }

    if (!carId) {
      Alert.alert(
        'Error',
        'Car listing information is missing.',
      );

      return;
    }

    const price = Number(
      offeredPrice.replace(/,/g, ''),
    );

    if (!price || price <= 0) {
      Alert.alert(
        'Invalid Price',
        'Please enter a valid offer price.',
      );

      return;
    }

    try {
      setSubmitting(true);

      await createQuote({
        carId,

        buyerId: user.uid,

        buyerName:
          profile?.name ||
          user.displayName ||
          '',

        buyerPhone:
          profile?.phone || '',

        offeredPrice: price,

        message:
          message.trim(),
      });

      Alert.alert(
        'Quote Submitted',
        'Your quote has been submitted successfully. Our team will review it.',
        [
          {
            text: 'View My Quotes',
            onPress: () =>
              router.replace(
                '/quotes',
              ),
          },
        ],
      );
    } catch (error: any) {
      console.error(
        'CREATE QUOTE ERROR:',
        error,
      );

      Alert.alert(
        'Unable to Submit',
        error?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* =================================== */
  /* LOADING */
  /* =================================== */

  if (loadingCar) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading car...
        </Text>
      </View>
    );
  }

  /* =================================== */
  /* CAR NOT FOUND */
  /* =================================== */

  if (!car) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="car-outline"
          size={48}
          color={colors.textMuted}
        />

        <Text style={styles.errorTitle}>
          Car listing not found
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Text style={styles.backText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  /* =================================== */
  /* MAIN UI */
  /* =================================== */

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable
            style={styles.iconButton}
            onPress={() =>
              router.back()
            }
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.white}
            />
          </Pressable>

          <Text
            style={styles.headerTitle}
          >
            Request a Quote
          </Text>

          <View
            style={styles.headerSpace}
          />
        </View>

        {/* Car */}

        <View style={styles.carCard}>
          <View style={styles.carIcon}>
            <Ionicons
              name="car-sport-outline"
              size={32}
              color={colors.primary}
            />
          </View>

          <View style={styles.carInfo}>
            <Text
              style={styles.carName}
              numberOfLines={1}
            >
              {car.make} {car.model}
            </Text>

            <Text style={styles.carYear}>
              {car.year}
            </Text>

            {typeof car.salePrice ===
              'number' && (
              <Text
                style={
                  styles.askingPrice
                }
              >
                Asking ₹
                {car.salePrice.toLocaleString(
                  'en-IN',
                )}
              </Text>
            )}
          </View>
        </View>

        {/* Explanation */}

        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color={colors.primary}
          />

          <Text
            style={styles.infoText}
          >
            Submit the amount you'd like
            to offer. Our team will review
            your quote and coordinate with
            the seller.
          </Text>
        </View>

        {/* Offer */}

        <Text
          style={styles.sectionTitle}
        >
          Your Offer
        </Text>

        <Text style={styles.label}>
          OFFER PRICE
        </Text>

        <View style={styles.priceInput}>
          <Text
            style={styles.currency}
          >
            ₹
          </Text>

          <TextInput
            value={offeredPrice}
            onChangeText={
              setOfferedPrice
            }
            placeholder="Enter your offer"
            placeholderTextColor={
              colors.textMuted
            }
            keyboardType="numeric"
            style={
              styles.priceTextInput
            }
          />
        </View>

        {/* Message */}

        <Text style={styles.label}>
          MESSAGE (OPTIONAL)
        </Text>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Add a message for the seller..."
          placeholderTextColor={
            colors.textMuted
          }
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          style={styles.messageInput}
        />

        {/* Submit */}

        <Pressable
          style={[
            styles.submitButton,

            submitting &&
              styles.submitDisabled,
          ]}
          disabled={submitting}
          onPress={handleSubmit}
        >
          {submitting ? (
            <ActivityIndicator
              color={
                colors.background
              }
            />
          ) : (
            <>
              <Ionicons
                name="paper-plane-outline"
                size={19}
                color={
                  colors.background
                }
              />

              <Text
                style={
                  styles.submitText
                }
              >
                Submit Quote
              </Text>
            </>
          )}
        </Pressable>

        {/* Disclaimer */}

        <Text
          style={styles.disclaimer}
        >
          Submitting a quote does not
          guarantee purchase. Final terms
          are subject to review and
          confirmation.
        </Text>
      </ScrollView>
    </View>
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

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      colors.background,
    padding: 24,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 12,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  iconButton: {
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

  headerTitle: {
    flex: 1,
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginHorizontal: 12,
  },

  headerSpace: {
    width: 42,
  },

  carCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 18,
    padding: 16,
  },

  carIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor:
      colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  carInfo: {
    flex: 1,
    marginLeft: 14,
  },

  carName: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
  },

  carYear: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 3,
  },

  askingPrice: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 6,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 16,
    padding: 15,
  },

  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 10,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 28,
    marginBottom: 14,
  },

  label: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginBottom: 7,
    marginTop: 14,
  },

  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 14,
    minHeight: 54,
  },

  currency: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
    paddingLeft: 15,
  },

  priceTextInput: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 14,
  },

  messageInput: {
    minHeight: 125,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.white,
    fontSize: 13,
  },

  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 28,
    backgroundColor:
      colors.primary,
    borderRadius: 14,
    minHeight: 52,
    paddingHorizontal: 20,
  },

  submitDisabled: {
    opacity: 0.5,
  },

  submitText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '900',
  },

  disclaimer: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 14,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 14,
  },

  backButton: {
    marginTop: 20,
    backgroundColor:
      colors.primary,
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },

  backText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '900',
  },
});