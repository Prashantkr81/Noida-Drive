import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { colors } from '../../constants/colors';
import { useMarketplaceCars } from '../../hooks/useMarketplaceCars';
import MarketplaceCard from '../../components/marketplace/MarketplaceCard';

const TYPES = [
  'All',
  'SUV',
  'Sedan',
  'Hatchback',
  'Luxury',
  'Convertible',
];

export default function MarketplaceScreen() {
  const {
    cars,
    loading,
    error,
  } = useMarketplaceCars();

  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');

  const filteredCars = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return cars.filter((car) => {
      const matchesSearch =
        !searchValue ||
        `${car.make} ${car.model}`
          .toLowerCase()
          .includes(searchValue);

      const matchesType =
        type === 'All' ||
        car.type === type;

      return (
        matchesSearch &&
        matchesType
      );
    });
  }, [cars, search, type]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading marketplace...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cloud-offline-outline"
          size={50}
          color={colors.error}
        />

        <Text style={styles.errorTitle}>
          Couldn't load cars
        </Text>

        <Text style={styles.errorText}>
          Please check your connection and try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}

      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>
            NOIDA DRIVE
          </Text>

          <Text style={styles.title}>
            Buy & Sell
          </Text>

          <Text style={styles.subtitle}>
            Find your next car.
          </Text>
        </View>

        <Pressable
          style={styles.sellButton}
          onPress={() =>
            router.push('/sell')
          }
        >
          <Ionicons
            name="add"
            size={18}
            color={colors.background}
          />

          <Text style={styles.sellText}>
            Sell
          </Text>
        </Pressable>
      </View>

      {/* Search */}

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
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
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

      {/* Filters */}

      <View style={styles.filterHeader}>
        <Text style={styles.sectionTitle}>
          Marketplace
        </Text>

        <Pressable
          style={styles.filterButton}
          onPress={() =>
            router.push('/marketplace/filters')
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

      <FlatList
        horizontal
        data={TYPES}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.typeList}
        renderItem={({ item }) => {
          const active = item === type;

          return (
            <Pressable
              onPress={() => setType(item)}
              style={[
                styles.typeButton,
                active &&
                  styles.typeButtonActive,
              ]}
            >
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

      {/* Result count */}

      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          {filteredCars.length} cars available
        </Text>

        <Text style={styles.quoteText}>
          Request a quote
        </Text>
      </View>

      {/* Cars */}

      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <MarketplaceCard
            car={item}
            onPress={() =>
              router.push({
                pathname:
                  '/marketplace/[id]',
                params: {
                  id: item.id,
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="car-outline"
              size={55}
              color={colors.textMuted}
            />

            <Text style={styles.emptyTitle}>
              No cars available
            </Text>

            <Text style={styles.emptyText}>
              There are currently no approved
              cars listed for sale.
            </Text>

            {(search || type !== 'All') && (
              <Pressable
                style={styles.clearButton}
                onPress={() => {
                  setSearch('');
                  setType('All');
                }}
              >
                <Text style={styles.clearText}>
                  Clear Filters
                </Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 55,
  },

  header: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  headerText: {
    flex: 1,
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

  sellButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  sellText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '900',
  },

  searchContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 52,
    backgroundColor: colors.surface,
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

  filterHeader: {
    marginTop: 22,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '800',
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

  typeList: {
    paddingHorizontal: 20,
    paddingVertical: 13,
    gap: 8,
  },

  typeButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  typeText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },

  typeTextActive: {
    color: colors.background,
  },

  resultRow: {
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  resultText: {
    color: colors.textMuted,
    fontSize: 10,
  },

  quoteText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  loadingText: {
    color: colors.textSecondary,
    marginTop: 12,
    fontSize: 13,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 15,
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 7,
    textAlign: 'center',
  },

  empty: {
    alignItems: 'center',
    paddingTop: 70,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 15,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 7,
  },

  clearButton: {
    marginTop: 18,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 11,
  },

  clearText: {
    color: colors.background,
    fontSize: 11,
    fontWeight: '800',
  },
});