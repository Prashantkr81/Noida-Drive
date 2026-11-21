
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';

interface Props {
  latitude: number;
  longitude: number;
  driverName?: string;
}

export default function DriverMap({
  latitude,
  longitude,
  driverName,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LIVE DRIVER LOCATION</Text>

      <Text style={styles.driverName}>
        {driverName || 'Your Driver'}
      </Text>

      <Text style={styles.text}>
        Latitude: {latitude.toFixed(5)}
      </Text>

      <Text style={styles.text}>
        Longitude: {longitude.toFixed(5)}
      </Text>

      <Text style={styles.note}>
        Live GPS coordinates are being received.
        Open the Android app to view the map.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  driverName: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 12,
  },
  text: {
    color: colors.white,
    marginVertical: 5,
  },
  note: {
    color: colors.textSecondary,
    marginTop: 20,
    textAlign: 'center',
  },
});
