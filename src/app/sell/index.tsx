import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import { colors } from '../../constants/colors';

export default function SellScreen() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [kilometers, setKilometers] =
    useState('');

  const [error, setError] =
    useState('');

  const handleContinue = () => {
    setError('');

    if (!make.trim()) {
      setError('Please enter the car make.');
      return;
    }

    if (!model.trim()) {
      setError('Please enter the car model.');
      return;
    }

    const yearValue = Number(year);

    if (
      !year ||
      !Number.isInteger(yearValue) ||
      yearValue < 1900 ||
      yearValue > new Date().getFullYear() + 1
    ) {
      setError('Please enter a valid model year.');
      return;
    }

    const kmValue = Number(kilometers);

    if (
      !kilometers ||
      !Number.isFinite(kmValue) ||
      kmValue < 0
    ) {
      setError(
        'Please enter valid kilometers driven.',
      );
      return;
    }

    router.push({
      pathname: '/sell/details',
      params: {
        make: make.trim(),
        model: model.trim(),
        year,
        kilometers,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
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
              NOIDA DRIVE
            </Text>

            <Text style={styles.title}>
              Sell Your Car
            </Text>

            <Text style={styles.subtitle}>
              Submit your car for review and get
              started with the selling process.
            </Text>
          </View>
        </View>

        {/* Progress */}

        <View style={styles.progressContainer}>
          <ProgressStep
            number="1"
            label="Basic Details"
            active
          />

          <View style={styles.progressLine} />

          <ProgressStep
            number="2"
            label="Car Details"
          />

          <View style={styles.progressLine} />

          <ProgressStep
            number="3"
            label="Submit"
          />
        </View>

        {/* Info */}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="shield-checkmark-outline"
              size={22}
              color={colors.primary}
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Sell through Noida Drive
            </Text>

            <Text style={styles.infoText}>
              Your car will be reviewed by our team
              before it becomes available on the
              marketplace.
            </Text>
          </View>
        </View>

        {/* Form */}

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>
            Car Information
          </Text>

          <Text style={styles.formSubtitle}>
            Tell us about the vehicle you want to
            sell.
          </Text>

          {/* Make */}

          <Input
            label="CAR MAKE"
            placeholder="e.g. BMW, Mercedes, Toyota"
            value={make}
            onChangeText={setMake}
            autoCapitalize="words"
          />

          {/* Model */}

          <Input
            label="CAR MODEL"
            placeholder="e.g. 3 Series, Fortuner"
            value={model}
            onChangeText={setModel}
            autoCapitalize="words"
          />

          {/* Year */}

          <Input
            label="MODEL YEAR"
            placeholder="e.g. 2023"
            value={year}
            onChangeText={(value) =>
              setYear(
                value.replace(/[^0-9]/g, ''),
              )
            }
            keyboardType="number-pad"
            maxLength={4}
          />

          {/* Kilometers */}

          <Input
            label="KILOMETERS DRIVEN"
            placeholder="e.g. 25000"
            value={kilometers}
            onChangeText={(value) =>
              setKilometers(
                value.replace(/[^0-9]/g, ''),
              )
            }
            keyboardType="number-pad"
          />

          {/* Error */}

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={17}
                color={colors.error}
              />

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          ) : null}

          {/* Continue */}

          <Pressable
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>
              Continue
            </Text>

            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.background}
            />
          </Pressable>
        </View>

        {/* Process */}

        <View style={styles.process}>
          <Text style={styles.processTitle}>
            What happens next?
          </Text>

          <ProcessItem
            number="1"
            title="Submit your car"
            description="Provide your vehicle information and photos."
          />

          <ProcessItem
            number="2"
            title="Our team reviews it"
            description="We'll verify the details and evaluate your car."
          />

          <ProcessItem
            number="3"
            title="Get your car listed"
            description="Once approved, your car can appear on our marketplace."
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ===================================== */
/* INPUT */
/* ===================================== */

function Input({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  maxLength,
  autoCapitalize,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?:
    | 'default'
    | 'number-pad';
  maxLength?: number;
  autoCapitalize?:
    | 'none'
    | 'sentences'
    | 'words'
    | 'characters';
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={
          colors.textMuted
        }
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

/* ===================================== */
/* PROGRESS */
/* ===================================== */

function ProgressStep({
  number,
  label,
  active = false,
}: {
  number: string;
  label: string;
  active?: boolean;
}) {
  return (
    <View style={styles.progressStep}>
      <View
        style={[
          styles.progressCircle,
          active &&
            styles.progressCircleActive,
        ]}
      >
        <Text
          style={[
            styles.progressNumber,
            active &&
              styles.progressNumberActive,
          ]}
        >
          {number}
        </Text>
      </View>

      <Text
        style={[
          styles.progressLabel,
          active &&
            styles.progressLabelActive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

/* ===================================== */
/* PROCESS ITEM */
/* ===================================== */

function ProcessItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.processItem}>
      <View style={styles.processNumber}>
        <Text style={styles.processNumberText}>
          {number}
        </Text>
      </View>

      <View style={styles.processContent}>
        <Text style={styles.processItemTitle}>
          {title}
        </Text>

        <Text style={styles.processItemDescription}>
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
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 45,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginRight: 14,
  },

  headerText: {
    flex: 1,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  title: {
    color: colors.white,
    fontSize: 29,
    fontWeight: '900',
    marginTop: 5,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },

  /* Progress */

  progressContainer: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  progressStep: {
    alignItems: 'center',
    width: 75,
  },

  progressCircle: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  progressNumber: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '900',
  },

  progressNumberActive: {
    color: colors.background,
  },

  progressLabel: {
    color: colors.textMuted,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 6,
  },

  progressLabelActive: {
    color: colors.primary,
    fontWeight: '800',
  },

  progressLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
    marginTop: 14,
  },

  /* Info */

  infoCard: {
    marginTop: 25,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    padding: 15,
    flexDirection: 'row',
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoContent: {
    flex: 1,
    marginLeft: 11,
  },

  infoTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },

  infoText: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },

  /* Form */

  formCard: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 18,
  },

  formTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '900',
  },

  formSubtitle: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
    marginBottom: 5,
  },

  inputGroup: {
    marginTop: 18,
  },

  label: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.9,
    marginBottom: 7,
  },

  input: {
    height: 50,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 13,
    color: colors.white,
    fontSize: 12,
  },

  /* Error */

  errorContainer: {
    marginTop: 15,
    padding: 11,
    borderRadius: 11,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 10,
  },

  /* Button */

  continueButton: {
    height: 53,
    marginTop: 22,
    borderRadius: 13,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  continueText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '900',
  },

  /* Process */

  process: {
    marginTop: 28,
  },

  processTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 15,
  },

  processItem: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  processNumber: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  processNumberText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
  },

  processContent: {
    flex: 1,
    marginLeft: 11,
  },

  processItemTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },

  processItemDescription: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: 3,
  },
});