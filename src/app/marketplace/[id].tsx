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
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
} from 'firebase/firestore';

import { db } from '../../services/firebase/config';
import { colors } from '../../constants/colors';
import { Car } from '../../types';

export default function MarketplaceCarDetails() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

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
          'MARKETPLACE CAR ERROR:',
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

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
          Car listing not found
        </Text>

        <Pressable
          style={styles.backHome}
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
        {/* Image */}

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
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.white}
            />
          </Pressable>

          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>
              FOR SALE
            </Text>
          </View>
        </View>

        {/* Main Info */}

        <View style={styles.mainInfo}>
          <Text style={styles.make}>
            {car.make}
          </Text>

          <Text style={styles.model}>
            {car.model}
          </Text>

          <Text style={styles.year}>
            {car.year}
          </Text>

          <Text style={styles.price}>
            {car.salePrice
              ? `₹${car.salePrice.toLocaleString(
                  'en-IN',
                )}`
              : 'Price on request'}
          </Text>

          <Text style={styles.priceHint}>
            Asking price
          </Text>
        </View>

        {/* Specs */}

        <Text style={styles.sectionTitle}>
          Vehicle Details
        </Text>

        <View style={styles.specGrid}>
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
            icon="car-outline"
            label="Type"
            value={car.type}
          />

          <Spec
            icon="color-palette-outline"
            label="Color"
            value={car.color || 'N/A'}
          />

          <Spec
            icon="calendar-outline"
            label="Year"
            value={String(car.year)}
          />
        </View>

        {/* Description */}

        <Text style={styles.sectionTitle}>
          About This Car
        </Text>

        <View style={styles.descriptionCard}>
          <Text style={styles.description}>
            This {car.year} {car.make} {car.model}{' '}
            is available for purchase through
            Noida Drive Marketplace.
          </Text>

          <Text style={styles.description}>
            Interested buyers can submit a quote.
            Our team will coordinate the next
            steps with the buyer and seller.
          </Text>
        </View>

        {/* Seller */}

        {car.ownerName && (
          <>
            <Text style={styles.sectionTitle}>
              Seller
            </Text>

            <View style={styles.sellerCard}>
              <View style={styles.sellerIcon}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View>
                <Text style={styles.sellerLabel}>
                  Listed by
                </Text>

                <Text style={styles.sellerName}>
                  {car.ownerName}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Quote CTA */}

        <View style={styles.quoteCard}>
          <View style={styles.quoteIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={25}
              color={colors.primary}
            />
          </View>

          <View style={styles.quoteContent}>
            <Text style={styles.quoteTitle}>
              Interested in this car?
            </Text>

            <Text style={styles.quoteSubtitle}>
              Submit your quote and our team will
              get in touch with you.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.quoteButton}
          onPress={() =>
            router.push({
              pathname: '/quotes/create',
              params: {
                carId: car.id,
              },
            })
          }
        >
          <Ionicons
            name="pricetag-outline"
            size={20}
            color={colors.background}
          />

          <Text style={styles.quoteButtonText}>
            Request a Quote
          </Text>
        </Pressable>
      </ScrollView>
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
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  imageContainer: {
    height: 300,
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

  backButton: {
    position: 'absolute',
    top: 55,
    left: 18,
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saleBadge: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    backgroundColor: colors.primary,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
  },

  saleText: {
    color: colors.background,
    fontSize: 9,
    fontWeight: '900',
  },

  mainInfo: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },

  make: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },

  model: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '900',
    marginTop: 3,
  },

  year: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },

  price: {
    color: colors.white,
    fontSize: 25,
    fontWeight: '900',
    marginTop: 18,
  },

  priceHint: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 3,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 28,
    marginBottom: 12,
    paddingHorizontal: 20,
  },

  specGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  spec: {
    width: '48%',
    minHeight: 68,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
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

  descriptionCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 16,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 10,
  },

  sellerCard: {
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  sellerIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sellerLabel: {
    color: colors.textMuted,
    fontSize: 9,
  },

  sellerName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 3,
  },

  quoteCard: {
    marginHorizontal: 20,
    marginTop: 28,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },

  quoteIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quoteContent: {
    flex: 1,
    marginLeft: 12,
  },

  quoteTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },

  quoteSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  quoteButton: {
    marginHorizontal: 20,
    marginTop: 12,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  quoteButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '900',
  },

  notFound: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 15,
  },

  backHome: {
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