
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  latitude: number;
  longitude: number;
  driverName?: string;
}

export default function DriverMap({
  latitude,
  longitude,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live GPS Coordinates</Text>
      <Text style={styles.text}>
        Latitude: {latitude.toFixed(5)}
      </Text>
      <Text style={styles.text}>
        Longitude: {longitude.toFixed(5)}
      </Text>
      <Text style={styles.note}>
        Open this screen on Android to view the live map.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  text: {
    color: COLORS.white,
    marginVertical: 5,
  },
  note: {
    color: COLORS.textSecondary,
    marginTop: 20,
    textAlign: 'center',
  },
});
