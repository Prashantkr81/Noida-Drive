import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from './config';
import { Booking } from '../../types';

export interface CreateBookingData {
  userId: string;

  userName?: string;
  userPhone?: string;
  userEmail?: string;

  carId: string;

  rentalType:
    | 'self_drive'
    | 'chauffeur';

  startDate: unknown;
  endDate: unknown;

  pickupLocation: string;
  dropLocation?: string;

  specialRequest?: string;

  estimatedPrice?: number;
}

/**
 * Create a rental request
 */
export const createBooking = async (
  data: CreateBookingData,
) => {
  // Verify that the car exists
  const carSnapshot = await getDoc(
    doc(db, 'cars', data.carId),
  );

  if (!carSnapshot.exists()) {
    throw new Error(
      'Selected car was not found.',
    );
  }

  const car = carSnapshot.data();

  // Car must currently be available for rent
  if (car.isAvailableForRent !== true) {
    throw new Error(
      'This car is currently not available for rent.',
    );
  }

  const bookingRef = await addDoc(
    collection(db, 'bookings'),
    {
      // User
      userId: data.userId,
      userName: data.userName || '',
      userPhone: data.userPhone || '',
      userEmail: data.userEmail || '',

      // Car
      carId: data.carId,
      carMake: car.make,
      carModel: car.model,

      // Rental
      rentalType: data.rentalType,

      startDate: data.startDate,
      endDate: data.endDate,

      // Location
      pickupLocation:
        data.pickupLocation,
      dropLocation:
        data.dropLocation || '',

      // Requirements
      specialRequest:
        data.specialRequest || '',

      // Pricing
      estimatedPrice:
        data.estimatedPrice || 0,

      finalPrice: null,

      // Admin workflow
      status: 'pending',

      adminNotes: '',
      rejectionReason: '',
      reviewedBy: '',

      // Metadata
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return bookingRef.id;
};

/**
 * Subscribe to current user's bookings
 */
export const subscribeToMyBookings = (
  userId: string,
  onData: (bookings: Booking[]) => void,
  onError?: (error: Error) => void,
) => {
  const q = query(
    collection(db, 'bookings'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const bookings =
        snapshot.docs.map(
          (document) =>
            ({
              id: document.id,
              ...document.data(),
            }) as Booking,
        );

      onData(bookings);
    },
    (error) => {
      console.error(
        'MY BOOKINGS ERROR:',
        error,
      );

      onError?.(error);
    },
  );
};