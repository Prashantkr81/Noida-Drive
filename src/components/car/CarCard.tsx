import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { colors } from '../../constants/colors';
import { Car } from '../../types/car';

interface Props {
  car: Car;
}

export default function CarCard({ car }: Props) {
  const image =
    car.images?.length > 0
      ? car.images[0]
      : 'https://via.placeholder.com/800x500.png?text=No+Image';

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/rent/[id]',
          params: { id: car.id },
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {car.type}
          </Text>
        </View>
      </View>

      <View style={styles.content}>

        <View style={styles.titleRow}>
          <View style={styles.nameContainer}>
            <Text style={styles.make}>
              {car.make}
            </Text>

            <Text style={styles.model}>
              {car.model}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ₹{car.pricePerDay?.toLocaleString('en-IN') || '—'}
            </Text>

            <Text style={styles.perDay}>
              / day
            </Text>
          </View>
        </View>

        <View style={styles.specs}>

          <Spec
            icon="calendar-outline"
            text={`${car.year}`}
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

        <View style={styles.detailsRow}>
          <Text style={styles.detailsText}>
            View Details
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.primary}
          />
        </View>

      </View>
    </Pressable>
  );
}

interface SpecProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

function Spec({ icon, text }: SpecProps) {
  return (
    <View style={styles.spec}>
      <Ionicons
        name={icon}
        size={15}
        color={colors.textMuted}
      />

      <Text style={styles.specText}>
        {text}
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
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  typeBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(5,5,5,0.8)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 9,
  },

  typeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '800',
  },

  content: {
    padding: 17,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  nameContainer: {
    flex: 1,
  },

  make: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  model: {
    color: colors.white,
    fontSize: 21,
    fontWeight: '800',
    marginTop: 3,
  },

  priceContainer: {
    alignItems: 'flex-end',
  },

  price: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },

  perDay: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },

  specs: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 17,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  specText: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
  },

  detailsText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
});