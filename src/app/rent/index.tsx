import { Ionicons } from '@expo/vector-icons';
import {
    router,
    useLocalSearchParams,
} from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import RentCard from '../../components/rent/RentCard';
import { colors } from '../../constants/colors';
import { useRentCars } from '../../hooks/useRentCars';

const TYPES = [
  'All',
  'SUV',
  'Sedan',
  'Hatchback',
  'Luxury',
  'Convertible',
];

export default function RentScreen() {
  const params = useLocalSearchParams<{
    type?: string;
    fuel?: string;
    transmission?: string;
    maxPrice?: string;
  }>();

  const {
    cars,
    loading,
    error,
  } = useRentCars();

  const [search, setSearch] =
    useState('');

  /*
   * Filters coming from:
   * app/rent/filters.tsx
   */

  const [type, setType] =
    useState(
      params.type || 'All',
    );

  const [fuel, setFuel] =
    useState(
      params.fuel || 'All',
    );

  const [transmission, setTransmission] =
    useState(
      params.transmission || 'All',
    );

  const [maxPrice, setMaxPrice] =
    useState(
      Number(params.maxPrice) || 50000,
    );

  /*
   * Filter cars
   */

  const filteredCars = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase();

    return cars.filter((car) => {
      /*
       * Search
       */

      const matchesSearch =
        !searchValue ||
        `${car.make} ${car.model}`
          .toLowerCase()
          .includes(searchValue);

      /*
       * Car Type
       */

      const matchesType =
        type === 'All' ||
        car.type === type;

      /*
       * Fuel
       */

      const matchesFuel =
        fuel === 'All' ||
        car.fuelType === fuel;

      /*
       * Transmission
       */

      const matchesTransmission =
        transmission === 'All' ||
        car.transmission ===
          transmission;

      /*
       * Price
       */

      const matchesPrice =
        (car.pricePerDay || 0) <=
        maxPrice;

      return (
        matchesSearch &&
        matchesType &&
        matchesFuel &&
        matchesTransmission &&
        matchesPrice
      );
    });
  }, [
    cars,
    search,
    type,
    fuel,
    transmission,
    maxPrice,
  ]);

  /*
   * Reset all filters
   */

  const clearFilters = () => {
    setSearch('');
    setType('All');
    setFuel('All');
    setTransmission('All');
    setMaxPrice(50000);

    /*
     * Remove route params so that
     * old filters don't come back.
     */
    router.setParams({
      type: undefined,
      fuel: undefined,
      transmission: undefined,
      maxPrice: undefined,
    });
  };

  /*
   * Loading
   */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Finding cars for you...
        </Text>
      </View>
    );
  }

  /*
   * Firebase error
   */

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cloud-offline-outline"
          size={50}
          color={colors.error}
        />

        <Text style={styles.errorTitle}>
          Couldn't load rental cars
        </Text>

        <Text style={styles.errorText}>
          Please check your connection
          and try again.
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() =>
            router.replace('/rent')
          }
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          NOIDA DRIVE
        </Text>

        <Text style={styles.title}>
          Rent a Car
        </Text>

        <Text style={styles.subtitle}>
          Choose a car for your next
          journey.
        </Text>
      </View>

      {/* ================================= */}
      {/* SEARCH */}
      {/* ================================= */}

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textMuted}
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search make or model..."
          placeholderTextColor={
            colors.textMuted
          }
          style={styles.searchInput}
          returnKeyType="search"
        />

        {search.length > 0 && (
          <Pressable
            onPress={() => setSearch('')}
          >
            <Ionicons
              name="close-circle"
              size={19}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>

      {/* ================================= */}
      {/* SECTION HEADER */}
      {/* ================================= */}

      <View style={styles.filterHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            Available Cars
          </Text>

          <Text style={styles.resultText}>
            {filteredCars.length} car
            {filteredCars.length !== 1
              ? 's'
              : ''}{' '}
            found
          </Text>
        </View>

        <Pressable
          style={styles.filterButton}
          onPress={() =>
            router.push('/rent/filters')
          }
        >
          <Ionicons
            name="options-outline"
            size={17}
            color={colors.primary}
          />

          <Text style={styles.filterText}>
            Filters
          </Text>
        </Pressable>
      </View>

      {/* ================================= */}
      {/* QUICK TYPE FILTERS */}
      {/* ================================= */}

      <FlatList
        horizontal
        data={TYPES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.typeList
        }
        renderItem={({ item }) => {
          const active =
            item === type;

          return (
            <Pressable
              onPress={() => setType(item)}
              style={[
                styles.typeButton,
                active &&
                  styles.typeButtonActive,
              ]}
            >
              {active && (
                <Ionicons
                  name="checkmark"
                  size={13}
                  color={colors.background}
                />
              )}

              <Text
                style={[
                  styles.typeText,
                  active &&
                    styles.typeTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          );
        }}
      />

      {/* ================================= */}
      {/* ACTIVE FILTER SUMMARY */}
      {/* ================================= */}

      {(
        type !== 'All' ||
        fuel !== 'All' ||
        transmission !== 'All' ||
        maxPrice !== 50000 ||
        search.length > 0
      ) && (
        <View style={styles.activeFilters}>
          <View style={styles.activeFilterLabel}>
            <Ionicons
              name="filter-outline"
              size={13}
              color={colors.primary}
            />

            <Text
              style={styles.activeFilterText}
            >
              Filters applied
            </Text>
          </View>

          <Pressable
            onPress={clearFilters}
          >
            <Text style={styles.clearText}>
              Clear all
            </Text>
          </Pressable>
        </View>
      )}

      {/* ================================= */}
      {/* CAR LIST */}
      {/* ================================= */}

      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <RentCard
            car={item}
            onPress={() =>
              router.push({
                pathname: '/rent/[id]',
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            hasFilters={
              type !== 'All' ||
              fuel !== 'All' ||
              transmission !== 'All' ||
              maxPrice !== 50000 ||
              search.length > 0
            }
            onClear={clearFilters}
          />
        }
      />
    </View>
  );
}

/* ===================================== */
/* EMPTY STATE */
/* ===================================== */

function EmptyState({
  hasFilters,
  onClear,
}: {
  hasFilters: boolean;
  onClear: () => void;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="car-outline"
          size={42}
          color={colors.textMuted}
        />
      </View>

      <Text style={styles.emptyTitle}>
        No Cars Found
      </Text>

      <Text style={styles.emptyText}>
        {hasFilters
          ? 'No rental cars match your current search and filters.'
          : 'There are currently no cars available for rent.'}
      </Text>

      {hasFilters && (
        <Pressable
          style={styles.clearButton}
          onPress={onClear}
        >
          <Text style={styles.clearButtonText}>
            Clear Filters
          </Text>
        </Pressable>
      )}
    </View>
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
    paddingTop: 55,
  },

  /*
   * Header
   */

  header: {
    paddingHorizontal: 20,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
    marginTop: 6,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 5,
  },

  /*
   * Search
   */

  searchContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 52,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    marginLeft: 10,
  },

  /*
   * Section
   */

  filterHeader: {
    marginTop: 22,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
  },

  resultText: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 4,
  },

  filterButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  filterText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },

  /*
   * Quick filters
   */

  typeList: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    gap: 8,
  },

  typeButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  typeButtonActive: {
    backgroundColor:
      colors.primary,
    borderColor:
      colors.primary,
  },

  typeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  typeTextActive: {
    color: colors.background,
  },

  /*
   * Active filters
   */

  activeFilters: {
    marginHorizontal: 20,
    marginBottom: 10,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'space-between',
  },

  activeFilterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  activeFilterText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '700',
  },

  clearText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
  },

  /*
   * List
   */

  list: {
    paddingHorizontal: 20,
    paddingBottom: 35,
    paddingTop: 3,
  },

  /*
   * Loading
   */

  center: {
    flex: 1,
    backgroundColor:
      colors.background,
    alignItems: 'center',
    justifyContent:
      'center',
    padding: 30,
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: 12,
    fontSize: 13,
  },

  /*
   * Error
   */

  errorTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 15,
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 7,
  },

  retryButton: {
    marginTop: 18,
    backgroundColor:
      colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 11,
  },

  retryText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '800',
  },

  /*
   * Empty
   */

  empty: {
    alignItems: 'center',
    paddingTop: 65,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 85,
    height: 85,
    borderRadius: 27,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 18,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },

  clearButton: {
    marginTop: 20,
    backgroundColor:
      colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },

  clearButtonText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '900',
  },
});