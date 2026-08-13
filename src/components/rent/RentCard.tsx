import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../../constants/colors';
import { Car } from '../../types';

interface RentCardProps {
  car: Car;
  onPress: () => void;
}

export default function RentCard({
  car,
  onPress,
}: RentCardProps) {
  const image =
    car.thumbnail ||
    car.images?.[0];

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
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
          <View style={styles.placeholder}>
            <Ionicons
              name="car-outline"
              size={50}
              color={colors.textMuted}
            />
          </View>
        )}

        {/* Available Badge */}

        <View style={styles.availableBadge}>
          <View style={styles.availableDot} />

          <Text style={styles.availableText}>
            AVAILABLE
          </Text>
        </View>

        {/* Favourite */}

        <Pressable
          style={styles.favoriteButton}
          onPress={(event) => {
            event.stopPropagation();
          }}
        >
          <Ionicons
            name="heart-outline"
            size={20}
            color={colors.white}
          />
        </Pressable>
      </View>

      {/* Content */}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={styles.titleContainer}>
            <Text
              style={styles.carName}
              numberOfLines={1}
            >
              {car.make} {car.model}
            </Text>

            <Text style={styles.year}>
              {car.year} • {car.type}
            </Text>
          </View>
        </View>

        {/* Specs */}

        <View style={styles.specs}>
          <Spec
            icon="flash-outline"
            value={car.fuelType}
          />

          <Spec
            icon="settings-outline"
            value={car.transmission}
          />

          <Spec
            icon="speedometer-outline"
            value={
              car.mileage
                ? `${car.mileage.toLocaleString(
                    'en-IN',
                  )} km`
                : 'N/A'
            }
          />
        </View>

        {/* Price + CTA */}

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.priceLabel}>
              RENT FROM
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

          <View style={styles.rentButton}>
            <Text style={styles.rentText}>
              Rent
            </Text>

            <Ionicons
              name="arrow-forward"
              size={15}
              color={colors.background}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function Spec({
  icon,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
}) {
  return (
    <View style={styles.spec}>
      <Ionicons
        name={icon}
        size={14}
        color={colors.textMuted}
      />

      <Text
        style={styles.specText}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },

  imageContainer: {
    height: 210,
    backgroundColor: colors.surfaceLight,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  availableBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
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

  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    padding: 16,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleContainer: {
    flex: 1,
  },

  carName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
  },

  year: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },

  specs: {
    flexDirection: 'row',
    gap: 13,
    marginTop: 14,
  },

  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  specText: {
    color: colors.textSecondary,
    fontSize: 9,
  },

  bottomRow: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  priceLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 3,
  },

  price: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
  },

  perDay: {
    color: colors.textMuted,
    fontSize: 9,
    marginLeft: 3,
  },

  rentButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  rentText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '900',
  },
});