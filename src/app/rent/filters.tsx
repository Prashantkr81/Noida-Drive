import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';

import { colors } from '../../constants/colors';

const CAR_TYPES = [
  'All',
  'SUV',
  'Sedan',
  'Hatchback',
  'Luxury',
  'Convertible',
];

const FUEL_TYPES = [
  'All',
  'Petrol',
  'Diesel',
  'Electric',
  'Hybrid',
];

const TRANSMISSIONS = [
  'All',
  'Manual',
  'Automatic',
];

const MAX_PRICE_OPTIONS = [
  1000,
  2000,
  3000,
  5000,
  10000,
];

export default function RentFiltersScreen() {
  const [type, setType] =
    useState('All');

  const [fuel, setFuel] =
    useState('All');

  const [transmission, setTransmission] =
    useState('All');

  const [maxPrice, setMaxPrice] =
    useState(5000);

  const handleApply = () => {
    router.replace({
      pathname: '/rent',
      params: {
        type,
        fuel,
        transmission,
        maxPrice: String(maxPrice),
      },
    });
  };

  const handleReset = () => {
    setType('All');
    setFuel('All');
    setTransmission('All');
    setMaxPrice(5000);
  };

  return (
    <View style={styles.container}>
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

        <Text style={styles.title}>
          Filters
        </Text>

        <Pressable
          onPress={handleReset}
        >
          <Text style={styles.reset}>
            Reset
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }
      >
        {/* Car Type */}

        <FilterSection title="CAR TYPE">
          <OptionGrid
            options={CAR_TYPES}
            selected={type}
            onSelect={setType}
          />
        </FilterSection>

        {/* Fuel */}

        <FilterSection title="FUEL TYPE">
          <OptionGrid
            options={FUEL_TYPES}
            selected={fuel}
            onSelect={setFuel}
          />
        </FilterSection>

        {/* Transmission */}

        <FilterSection title="TRANSMISSION">
          <OptionGrid
            options={TRANSMISSIONS}
            selected={transmission}
            onSelect={setTransmission}
          />
        </FilterSection>

        {/* Price */}

        <FilterSection title="MAXIMUM DAILY PRICE">
          <View style={styles.priceContainer}>
            <Text style={styles.priceValue}>
              ₹
              {maxPrice.toLocaleString(
                'en-IN',
              )}
            </Text>

            <Text style={styles.priceUnit}>
              / day
            </Text>
          </View>

          <View style={styles.priceOptions}>
            {MAX_PRICE_OPTIONS.map(
              (price) => {
                const active =
                  maxPrice === price;

                return (
                  <Pressable
                    key={price}
                    onPress={() =>
                      setMaxPrice(price)
                    }
                    style={[
                      styles.priceOption,
                      active &&
                        styles.priceOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.priceOptionText,
                        active &&
                          styles.priceOptionTextActive,
                      ]}
                    >
                      ₹
                      {price.toLocaleString(
                        'en-IN',
                      )}
                    </Text>
                  </Pressable>
                );
              },
            )}
          </View>
        </FilterSection>
      </ScrollView>

      {/* Bottom */}

      <View style={styles.bottom}>
        <Pressable
          style={styles.applyButton}
          onPress={handleApply}
        >
          <Text style={styles.applyText}>
            Apply Filters
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.background}
          />
        </Pressable>
      </View>
    </View>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      {children}
    </View>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.options}>
      {options.map((option) => {
        const active =
          selected === option;

        return (
          <Pressable
            key={option}
            onPress={() =>
              onSelect(option)
            }
            style={[
              styles.option,
              active &&
                styles.optionActive,
            ]}
          >
            {active && (
              <Ionicons
                name="checkmark"
                size={14}
                color={colors.background}
              />
            )}

            <Text
              style={[
                styles.optionText,
                active &&
                  styles.optionTextActive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '900',
  },

  reset: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 130,
  },

  section: {
    marginTop: 25,
  },

  sectionTitle: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 12,
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  option: {
    minWidth: 85,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },

  optionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  optionText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  optionTextActive: {
    color: colors.background,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },

  priceValue: {
    color: colors.white,
    fontSize: 27,
    fontWeight: '900',
  },

  priceUnit: {
    color: colors.textMuted,
    fontSize: 11,
    marginLeft: 5,
  },

  priceOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginTop: 15,
  },

  priceOption: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 11,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  priceOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  priceOptionText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  priceOptionTextActive: {
    color: colors.background,
  },

  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 25,
  },

  applyButton: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  applyText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '900',
  },
});