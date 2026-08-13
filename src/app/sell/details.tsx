import { uploadImage } from '../../services/cloudinary/uploadImage';

import {
  ActivityIndicator,
  Alert,
  Image,
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
import {
  router,
  useLocalSearchParams,
} from 'expo-router';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import { colors } from '../../constants/colors';
import { useAuth } from '../../hooks/useAuth';
import { createSellSubmission } from '../../services/firebase/sell';

type Condition =
  | 'excellent'
  | 'good'
  | 'fair';

const FUEL_TYPES = [
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
];

const TRANSMISSIONS = [
  'Manual',
  'Automatic',
];

export default function SellDetailsScreen() {
  const params =
    useLocalSearchParams<{
      make?: string;
      model?: string;
      year?: string;
      kilometers?: string;
    }>();

  const { user } = useAuth();

  const [condition, setCondition] =
    useState<Condition>('good');

  const [fuelType, setFuelType] =
    useState('');

  const [transmission, setTransmission] =
    useState('');

  const [color, setColor] =
    useState('');

  const [expectedPrice, setExpectedPrice] =
    useState('');

  const [images, setImages] =
    useState<string[]>([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  /*
   * Pick car images
   */
  const pickImages = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow photo library access to upload car images.',
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync(
          {
            mediaTypes: [
              'images',
            ],
            allowsMultipleSelection: true,
            selectionLimit: 8,
            quality: 0.8,
          },
        );

      if (
        !result.canceled &&
        result.assets
      ) {
        const selected =
          result.assets.map(
            (asset) => asset.uri,
          );

        setImages((current) => [
          ...current,
          ...selected,
        ].slice(0, 8));
      }
    } catch (err) {
      console.error(
        'IMAGE PICKER ERROR:',
        err,
      );
    }
  };

  /*
   * Remove image
   */
  const removeImage = (
    index: number,
  ) => {
    setImages((current) =>
      current.filter(
        (_, i) => i !== index,
      ),
    );
  };

  /*
   * Submit
   */
  const handleSubmit = async () => {
    setError('');

        const uploadedImages: string[] = [];

        for (const image of images) {
        const url = await uploadImage(image);
        uploadedImages.push(url);
        }

    if (!user) {
      Alert.alert(
        'Login Required',
        'Please login before submitting your car.',
      );
      return;
    }

    if (!params.make || !params.model) {
      setError(
        'Basic car information is missing.',
      );
      return;
    }

    if (!fuelType) {
      setError(
        'Please select the fuel type.',
      );
      return;
    }

    if (!transmission) {
      setError(
        'Please select the transmission.',
      );
      return;
    }

    if (images.length === 0) {
      setError(
        'Please upload at least one car image.',
      );
      return;
    }

    const price =
      Number(expectedPrice);

    if (
      expectedPrice &&
      (!Number.isFinite(price) ||
        price < 0)
    ) {
      setError(
        'Please enter a valid expected price.',
      );
      return;
    }

    try {
  setSubmitting(true);

  const uploadedImages: string[] = [];

  for (const image of images) {
    const url = await uploadImage(image);
    uploadedImages.push(url);
  }

  const submissionId =
    await createSellSubmission({
      sellerId: user.uid,

      sellerName:
        user.displayName || '',

      sellerEmail:
        user.email || '',

      sellerPhone:
        user.phoneNumber || '',

      make: params.make!.trim(),

      model: params.model!.trim(),

      year: Number(params.year),

      kilometersDriven:
        Number(params.kilometers),

      condition,

      fuelType,

      transmission,

      color: color.trim(),

      images: uploadedImages,

      expectedPrice:
        Number(expectedPrice) || 0,
    });

  router.replace({
    pathname: '/sell/success',
    params: {
      id: submissionId,
    },
  });
} catch (err: any) {
  console.error(
    'SELL SUBMISSION ERROR:',
    err,
  );

  setError(
    err?.message ||
      'Unable to submit your car.',
  );
} finally {
  setSubmitting(false);
}
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
              STEP 2 OF 3
            </Text>

            <Text style={styles.title}>
              Car Details
            </Text>
          </View>
        </View>

        {/* Basic Details Summary */}

        <View style={styles.summaryCard}>
          <View style={styles.carIcon}>
            <Ionicons
              name="car-sport-outline"
              size={25}
              color={colors.primary}
            />
          </View>

          <View style={styles.summaryContent}>
            <Text style={styles.carName}>
              {params.make}{' '}
              {params.model}
            </Text>

            <Text style={styles.carMeta}>
              {params.year} •{' '}
              {Number(
                params.kilometers || 0,
              ).toLocaleString(
                'en-IN',
              )}{' '}
              km
            </Text>
          </View>
        </View>

        {/* Condition */}

        <SectionTitle>
          CONDITION
        </SectionTitle>

        <View style={styles.options}>
          {[
            {
              value: 'excellent',
              label: 'Excellent',
            },
            {
              value: 'good',
              label: 'Good',
            },
            {
              value: 'fair',
              label: 'Fair',
            },
          ].map((item) => {
            const active =
              condition ===
              item.value;

            return (
              <Pressable
                key={item.value}
                style={[
                  styles.option,
                  active &&
                    styles.optionActive,
                ]}
                onPress={() =>
                  setCondition(
                    item.value as Condition,
                  )
                }
              >
                {active && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color={
                      colors.background
                    }
                  />
                )}

                <Text
                  style={[
                    styles.optionText,
                    active &&
                      styles.optionTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Fuel */}

        <SectionTitle>
          FUEL TYPE
        </SectionTitle>

        <View style={styles.options}>
          {FUEL_TYPES.map(
            (item) => {
              const active =
                fuelType === item;

              return (
                <Pressable
                  key={item}
                  style={[
                    styles.option,
                    active &&
                      styles.optionActive,
                  ]}
                  onPress={() =>
                    setFuelType(item)
                  }
                >
                  {active && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={
                        colors.background
                      }
                    />
                  )}

                  <Text
                    style={[
                      styles.optionText,
                      active &&
                        styles.optionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            },
          )}
        </View>

        {/* Transmission */}

        <SectionTitle>
          TRANSMISSION
        </SectionTitle>

        <View style={styles.options}>
          {TRANSMISSIONS.map(
            (item) => {
              const active =
                transmission === item;

              return (
                <Pressable
                  key={item}
                  style={[
                    styles.option,
                    active &&
                      styles.optionActive,
                  ]}
                  onPress={() =>
                    setTransmission(
                      item,
                    )
                  }
                >
                  {active && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={
                        colors.background
                      }
                    />
                  )}

                  <Text
                    style={[
                      styles.optionText,
                      active &&
                        styles.optionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            },
          )}
        </View>

        {/* Color */}

        <SectionTitle>
          COLOR
        </SectionTitle>

        <TextInput
          value={color}
          onChangeText={setColor}
          placeholder="e.g. Pearl White"
          placeholderTextColor={
            colors.textMuted
          }
          style={styles.input}
        />

        {/* Expected Price */}

        <SectionTitle>
          EXPECTED PRICE
        </SectionTitle>

        <View style={styles.priceInput}>
          <Text style={styles.rupee}>
            ₹
          </Text>

          <TextInput
            value={expectedPrice}
            onChangeText={(value) =>
              setExpectedPrice(
                value.replace(
                  /[^0-9]/g,
                  '',
                ),
              )
            }
            placeholder="Your expected selling price"
            placeholderTextColor={
              colors.textMuted
            }
            keyboardType="number-pad"
            style={styles.priceTextInput}
          />
        </View>

        {/* Images */}

        <SectionTitle>
          CAR PHOTOS
        </SectionTitle>

        <Text style={styles.helper}>
          Upload clear photos of the exterior
          and interior. Maximum 8 images.
        </Text>

        <View style={styles.imagesGrid}>
          {images.map(
            (uri, index) => (
              <View
                key={`${uri}-${index}`}
                style={styles.imageWrapper}
              >
                <Image
                  source={{
                    uri,
                  }}
                  style={styles.carImage}
                />

                <Pressable
                  style={
                    styles.removeImage
                  }
                  onPress={() =>
                    removeImage(index)
                  }
                >
                  <Ionicons
                    name="close"
                    size={14}
                    color={
                      colors.white
                    }
                  />
                </Pressable>
              </View>
            ),
          )}

          {images.length < 8 && (
            <Pressable
              style={styles.addImage}
              onPress={pickImages}
            >
              <Ionicons
                name="add"
                size={30}
                color={
                  colors.primary
                }
              />

              <Text
                style={
                  styles.addImageText
                }
              >
                Add Photos
              </Text>
            </Pressable>
          )}
        </View>

        {/* Error */}

        {error ? (
          <View
            style={
              styles.errorContainer
            }
          >
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={colors.error}
            />

            <Text
              style={styles.errorText}
            >
              {error}
            </Text>
          </View>
        ) : null}

        {/* Submit */}

        <Pressable
          style={[
            styles.submitButton,
            submitting &&
              styles.disabledButton,
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
              <Text
                style={
                  styles.submitText
                }
              >
                Submit Car for Review
              </Text>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={
                  colors.background
                }
              />
            </>
          )}
        </Pressable>

        <Text
          style={styles.disclaimer}
        >
          By submitting, you agree that Noida
          Drive may contact you regarding the
          vehicle and verify the information
          provided.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ===================================== */
/* SECTION TITLE */
/* ===================================== */

function SectionTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Text style={styles.sectionTitle}>
      {children}
    </Text>
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

  header: {
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
    marginRight: 13,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  title: {
    color: colors.white,
    fontSize: 27,
    fontWeight: '900',
    marginTop: 3,
  },

  /* Summary */

  summaryCard: {
    marginTop: 22,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 17,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  carIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor:
      colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryContent: {
    marginLeft: 12,
    flex: 1,
  },

  carName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },

  carMeta: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },

  /* Sections */

  sectionTitle: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 23,
    marginBottom: 10,
  },

  helper: {
    color: colors.textMuted,
    fontSize: 10,
    lineHeight: 15,
    marginTop: -4,
    marginBottom: 12,
  },

  /* Options */

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  option: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  optionActive: {
    backgroundColor:
      colors.primary,
    borderColor:
      colors.primary,
  },

  optionText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  optionTextActive: {
    color: colors.background,
  },

  /* Input */

  input: {
    height: 51,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    color: colors.white,
    fontSize: 12,
  },

  /* Price */

  priceInput: {
    height: 51,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  rupee: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  priceTextInput: {
    flex: 1,
    color: colors.white,
    fontSize: 12,
    marginLeft: 8,
  },

  /* Images */

  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  imageWrapper: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor:
      colors.surface,
  },

  carImage: {
    width: '100%',
    height: '100%',
  },

  removeImage: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor:
      'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addImage: {
    width: '31.5%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor:
      colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      colors.surface,
  },

  addImageText: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 3,
  },

  /* Error */

  errorContainer: {
    marginTop: 18,
    padding: 11,
    borderRadius: 11,
    backgroundColor:
      'rgba(239,68,68,0.08)',
    borderWidth: 1,
    borderColor:
      'rgba(239,68,68,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 10,
  },

  /* Submit */

  submitButton: {
    height: 54,
    marginTop: 24,
    borderRadius: 14,
    backgroundColor:
      colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '900',
  },

  disclaimer: {
    color: colors.textMuted,
    fontSize: 9,
    lineHeight: 14,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
});