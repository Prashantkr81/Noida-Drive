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

interface MarketplaceCardProps {
  car: Car;
  onPress: () => void;
}

export default function MarketplaceCard({
  car,
  onPress,
}: MarketplaceCardProps) {
  const image =
    car.thumbnail ||
    car.images?.[0];

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
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
              size={50}
              color={colors.textMuted}
            />
          </View>
        )}

        {/* Sale Badge */}

        <View style={styles.saleBadge}>
          <Text style={styles.saleBadgeText}>
            FOR SALE
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

      {/* Information */}

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
              {car.year}
            </Text>
          </View>
        </View>

        {/* Specs */}

        <View style={styles.specs}>
          <Spec
            icon="speedometer-outline"
            text={`${formatMileage(car.mileage)} km`}
          />

          <Spec
            icon="flash-outline"
            text={car.fuelType}
          />

          <Spec
            icon="settings-outline"
            text={car.transmission}
          />
        </View>

        {/* Price */}

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.priceLabel}>
              ASKING PRICE
            </Text>

            <Text style={styles.price}>
              {formatPrice(car.salePrice)}
            </Text>
          </View>

          <View style={styles.quoteButton}>
            <Text style={styles.quoteText}>
              Get Quote
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
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
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
        {text}
      </Text>
    </View>
  );
}

function formatMileage(
  mileage?: number,
) {
  if (!mileage) {
    return 'N/A';
  }

  return mileage.toLocaleString('en-IN');
}

function formatPrice(
  price?: number,
) {
  if (!price) {
    return 'Price on request';
  }

  return `₹${price.toLocaleString('en-IN')}`;
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

  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saleBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },

  saleBadgeText: {
    color: colors.background,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.8,
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
    fontSize: 11,
    marginTop: 4,
  },

  specs: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 14,
  },

  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  specText: {
    color: colors.textSecondary,
    fontSize: 10,
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

  price: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '900',
    marginTop: 3,
  },

  quoteButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  quoteText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '900',
  },
});