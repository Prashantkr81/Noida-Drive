
import React from 'react';
import MapView, { Marker, Region } from 'react-native-maps';

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
  const region: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <MapView
      style={{ flex: 1, minHeight: 300 }}
      region={region}
    >
      <Marker
        coordinate={{ latitude, longitude }}
        title={driverName || 'Your Driver'}
        description="Current driver location"
      />
    </MapView>
  );
}
