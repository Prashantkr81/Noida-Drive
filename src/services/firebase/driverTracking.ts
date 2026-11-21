
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './config';

export interface DriverLiveLocation {
  driverId: string;
  activeBookingId: string;
  isSharing: boolean;
  currentLocation: {
    latitude: number;
    longitude: number;
    heading?: number | null;
    speed?: number | null;
  } | null;
  updatedAt?: any;
}

export const subscribeToDriverLocation = (
  driverId: string,
  bookingId: string,
  callback: (location: DriverLiveLocation | null) => void,
  onError?: (error: Error) => void
) => {
  const locationRef = doc(db, 'driverLocations', driverId);

  return onSnapshot(
    locationRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }

      const data = snapshot.data() as DriverLiveLocation;

      // Only show location for this driver's currently assigned booking.
      if (
        !data.isSharing ||
        data.activeBookingId !== bookingId ||
        !data.currentLocation
      ) {
        callback(null);
        return;
      }

      callback(data);
    },
    (error) => {
      console.error('Driver location listener failed:', error);
      onError?.(error);
    }
  );
};
