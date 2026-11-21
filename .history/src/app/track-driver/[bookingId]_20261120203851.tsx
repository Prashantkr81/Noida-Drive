
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import MapView, { Marker, Region } from 'react-native-maps';

import { db } from '../../src/services/firebase/config';
import {
  subscribeToDriverLocation,
  DriverLiveLocation,
} from '../../src/services/firebase/driverTracking';
import { COLORS } from '../../src/constants/colors';

interface BookingInfo {
  rentalType: string;
  driverId?: string;
  driverName?: string;
  pickupLocation?: string;
}

export default function TrackDriverScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [location, setLocation] = useState<DriverLiveLocation | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!bookingId) return;

    let unsubscribeLocation: (() => void) | undefined;
    let cancelled = false;

    const loadBooking = async () => {
      try {
        const snapshot = await getDoc(doc(db, 'bookings', bookingId));

        if (!snapshot.exists()) {
          throw new Error('Booking not found.');
        }

        const data = snapshot.data() as BookingInfo;

        if (data.rentalType !== 'chauffeur') {
          throw new Error('Live tracking is only available for chauffeur bookings.');
        }

        if (!data.driverId) {
          throw new Error('A driver has not been assigned yet.');
        }

        if (cancelled) return;

        setBooking(data);

        unsubscribeLocation = subscribeToDriverLocation(
          data.driverId,
          bookingId,
          setLocation,
          (err) => setError(err.message)
        );
      } catch (err: any) {
        if (!cancelled) setError(err.message || 'Unable to load booking.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBooking();

    return () => {
      cancelled = true;
      unsubscribeLocation?.();
    };
  }, [bookingId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.muted}>Loading tracking...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  const coordinates = location?.currentLocation;

  const region: Region | undefined = coordinates
    ? {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : undefined;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Live Driver Tracking' }} />

      <View style={styles.header}>
        <Text style={styles.title}>Live Driver Tracking</Text>
        <Text style={styles.muted}>
          {booking?.driverName || 'Your assigned driver'}
        </Text>
      </View>

      {coordinates && region ? (
        <MapView
          style={styles.map}
          region={region}
        >
          <Marker
            coordinate={{
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            }}
            title={booking?.driverName || 'Your Driver'}
            description="Current driver location"
          />
        </MapView>
      ) : (
        <View style={[styles.map, styles.center]}>
          <Text style={styles.muted}>
            {location === null
              ? 'Waiting for driver to start GPS sharing...'
              : 'Driver location unavailable'}
          </Text>
        </View>
      )}

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>
          {location ? '🟢 Driver is sharing location' : '⚪ Waiting for driver'}
        </Text>

        <Text style={styles.muted}>
          {coordinates
            ? `Latitude: ${coordinates.latitude.toFixed(5)}\nLongitude: ${coordinates.longitude.toFixed(5)}`
            : 'Location will appear here when the driver starts sharing.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: { padding: 20 },
  title: { color: COLORS.white, fontSize: 22, fontWeight: 'bold' },
  muted: { color: COLORS.textSecondary, marginTop: 8 },
  error: { color: COLORS.danger, fontSize: 16, textAlign: 'center' },
  map: { flex: 1, minHeight: 300 },
  statusCard: {
    backgroundColor: COLORS.surface,
    padding: 20,
    margin: 16,
    borderRadius: 14,
  },
  statusTitle: { color: COLORS.success, fontSize: 16, fontWeight: 'bold' },
});
