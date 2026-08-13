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

const TYPES = [
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

const YEARS = [
  'Any',
  '2025+',
  '2023+',
  '2020+',
  '2018+',
];

const PRICE_RANGES = [
  'Any',
  'Under ₹10 Lakh',
  '₹10 - ₹20 Lakh',
  '₹20 - ₹40 Lakh',
  'Above ₹40 Lakh',
];

export default function MarketplaceFilters() {
  const [type, setType] = useState('All');
  const [fuel, setFuel] = useState('All');
  const [transmission, setTransmission] =
    useState('All');
  const [year, setYear] = useState('Any');
  const [price, setPrice] = useState('Any');

  const clearFilters = () => {
    setType('All');
    setFuel('All');
    setTransmission('All');
    setYear('Any');
    setPrice('Any');
  };

  const applyFilters = () => {
    // We'll connect these filters to the
    // Firestore marketplace query next.
    router.back();
  };

  return (
    <View style={styles.container}>
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

        <Text style={styles.title}>
          Filters
        </Text>

        <Pressable onPress={clearFilters}>
          <Text style={styles.clear}>
            Clear
          </Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <FilterSection
          title="Body Type"
          options={TYPES}
          selected={type}
          onSelect={setType}
        />

        <FilterSection
          title="Fuel Type"
          options={FUEL_TYPES}
          selected={fuel}
          onSelect={setFuel}
        />

        <FilterSection
          title="Transmission"
          options={TRANSMISSIONS}
          selected={transmission}
          onSelect={setTransmission}
        />

        <FilterSection
          title="Model Year"
          options={YEARS}
          selected={year}
          onSelect={setYear}
        />

        <FilterSection
          title="Price Range"
          options={PRICE_RANGES}
          selected={price}
          onSelect={setPrice}
        />

        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />

          <Text style={styles.infoText}>
            Only cars approved by Noida Drive will
            appear in the marketplace.
          </Text>
        </View>
      </ScrollView>

      {/* Apply */}

      <View style={styles.bottom}>
        <Pressable
          style={styles.applyButton}
          onPress={applyFilters}
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
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <View style={styles.options}>
        {options.map((option) => {
          const active =
            selected === option;

          return (
            <Pressable
              key={option}
              style={[
                styles.option,
                active &&
                  styles.optionActive,
              ]}
              onPress={() =>
                onSelect(option)
              }
            >
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
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  },

  title: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '800',
  },

  clear: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
  },

  content: {
    padding: 20,
    paddingBottom: 130,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },

  option: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 10,
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

  infoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  infoText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
  },

  bottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  applyButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  applyText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '900',
  },
});