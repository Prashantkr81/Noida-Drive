import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { createRentalRequest } from '../../services/firebase/bookings';

export default function RentalRequestScreen() {
  const { carId } = useLocalSearchParams<{
    carId: string;
  }>();

  const { user } = useAuth();

  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [location, setLocation] = useState('');
  const [requirements, setRequirements] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login before requesting a rental.',
      );
      return;
    }

    if (!carId) {
      Alert.alert(
        'Error',
        'Car information is missing.',
      );
      return;
    }

    if (
      !pickupDate.trim() ||
      !returnDate.trim() ||
      !location.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please provide pickup date, return date and pickup location.',
      );
      return;
    }

    try {
      setSubmitting(true);

      const requestId = await createRentalRequest({
        userId: user.uid,
        carId,
        pickupDate: pickupDate.trim(),
        returnDate: returnDate.trim(),
        pickupLocation: location.trim(),
        requirements: requirements.trim(),
      });

      console.log(
        'RENTAL REQUEST CREATED:',
        requestId,
      );

      Alert.alert(
        'Request Submitted',
        'Your rental request has been submitted successfully. Our team will review it shortly.',
        [
          {
            text: 'View My Requests',
            onPress: () =>
              router.replace('/bookings'),
          },
        ],
      );
    } catch (error) {
      console.error(
        'CREATE RENTAL REQUEST ERROR:',
        error,
      );

      Alert.alert(
        'Request Failed',
        'We could not submit your rental request. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={colors.white}
          />
        </Pressable>

        <Text style={styles.title}>
          Rental Request
        </Text>

        <Text style={styles.subtitle}>
          Tell us when and where you need the car.
        </Text>

        <View style={styles.form}>
          <Field
            label="PICKUP DATE"
            placeholder="DD/MM/YYYY"
            value={pickupDate}
            onChangeText={setPickupDate}
          />

          <Field
            label="RETURN DATE"
            placeholder="DD/MM/YYYY"
            value={returnDate}
            onChangeText={setReturnDate}
          />

          <Field
            label="PICKUP LOCATION"
            placeholder="Greater Noida"
            value={location}
            onChangeText={setLocation}
          />

          <View>
            <Text style={styles.label}>
              ADDITIONAL REQUIREMENTS
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Anything else we should know?"
              placeholderTextColor={colors.textMuted}
              value={requirements}
              onChangeText={setRequirements}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.info}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.primary}
            />

            <Text style={styles.infoText}>
              This is a rental request. Your booking
              is confirmed only after our team reviews
              and approves the request.
            </Text>
          </View>

          <Pressable
            style={[
              styles.button,
              submitting && styles.disabled,
            ]}
            disabled={submitting}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {submitting
                ? 'Submitting...'
                : 'Submit Rental Request'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 24,
    paddingTop: 58,
    paddingBottom: 40,
  },

  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 28,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },

  form: {
    gap: 20,
    marginTop: 30,
  },

  label: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
  },

  textArea: {
    minHeight: 130,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    padding: 16,
    fontSize: 14,
  },

  info: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 15,
    gap: 10,
  },

  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },

  disabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '900',
  },
});