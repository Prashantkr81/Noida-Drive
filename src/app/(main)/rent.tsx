import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import CarCard from '../../components/car/CarCard';
import { colors } from '../../constants/colors';
import { useRentCars } from '../../hooks/useRentCars';
import { useMemo, useState } from 'react';

export default function RentScreen() {
  const { cars, loading, error } = useRentCars();

  const [search, setSearch] = useState('');

  const filteredCars = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return cars;
    }

    return cars.filter((car) =>
      `${car.make} ${car.model}`
        .toLowerCase()
        .includes(value),
    );
  }, [cars, search]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Finding available cars...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color={colors.error}
        />

        <Text style={styles.errorTitle}>
          Unable to load cars
        </Text>

        <Text style={styles.errorText}>
          Please check your connection and try again.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>
          Rent a Car
        </Text>

        <Text style={styles.subtitle}>
          Find the perfect car for your journey.
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textMuted}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Search make or model..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          {filteredCars.length} cars available
        </Text>
      </View>

      <FlatList
        data={filteredCars}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CarCard car={item} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons
              name="car-outline"
              size={56}
              color={colors.textMuted}
            />

            <Text style={styles.emptyTitle}>
              No cars found
            </Text>

            <Text style={styles.emptyText}>
              Try changing your search.
            </Text>
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
    paddingTop: 58,
  },

  header: {
    paddingHorizontal: 20,
  },

  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 7,
  },

  searchContainer: {
    marginHorizontal: 20,
    marginTop: 22,
    height: 52,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  searchInput: {
    flex: 1,
    color: colors.white,
    fontSize: 14,
    marginLeft: 10,
  },

  resultRow: {
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 12,
  },

  resultText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    marginTop: 14,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 15,
  },

  errorText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },

  empty: {
    alignItems: 'center',
    paddingTop: 90,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 16,
  },

  emptyText: {
    color: colors.textSecondary,
    marginTop: 7,
  },
});