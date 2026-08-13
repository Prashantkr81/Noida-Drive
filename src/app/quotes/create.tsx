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
import { useEffect, useState } from 'react';

import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { createQuote } from '../../services/firebase/quotes';
import { db } from '../../services/firebase/config';

import {
  doc,
  getDoc,
} from 'firebase/firestore';

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
        message: message.trim(),
      });

      Alert.alert(
        'Quote Submitted',
        'Your quote has been submitted successfully. Our team will review it.',
        [
          {
            text: 'View My Quotes',
            onPress: () =>
              router.replace('/quotes'),
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

  if (loadingCar) {
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
        <Text style={styles.errorTitle}>
          Car listing not found
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

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

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
            Request a Quote
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Car */}

        <View style={styles.carCard}>
          <Ionicons
            name="car-sport-outline"
            size={32}
            color={colors.primary}
          />

          <View style={styles.carInfo}>
            <Text style={styles.carName}>
              {car.make} {car.model}
            </Text>

            <Text style={styles.carYear}>
              {car.year}
            </Text>

            {car.salePrice && (
              <Text style={styles.askingPrice}>
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

          <Text style={styles.infoText}>
            Submit the amount you'd like to offer.
            Our team will review your quote and
            coordinate with the seller.
          </Text>
        </View>

        {/* Offer */}

        <Text style={styles.sectionTitle}>
          Your Offer
        </Text>

        <Text style={styles.label}>
          OFFER PRICE
        </Text>

        <View style={styles.priceInput}>
          <Text style={styles.currency}>
            ₹
          </Text>

          <TextInput
            value={offeredPrice}
            onChangeText={setOfferedPrice}
            placeholder="Enter your offer"
            placeholderTextColor={
              colors.textMuted
            }
            keyboardType="numeric"
            style={styles.priceTextInput}
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
              color={colors.background}
            />
          ) : (
            <>
              <Ionicons
                name="paper-plane-outline"
                size={19}
                color={colors.background}
              />

              <Text style={styles.submitText}>
                Submit Quote
              </Text>
            </>
          )}
        </Pressable>

        <Text style={styles.disclaimer}>
          Submitting a quote does not guarantee
          purchase. Final terms are subject to
          review and confirmation.
        </Text>
      </ScrollView>
    </View>
  );
}