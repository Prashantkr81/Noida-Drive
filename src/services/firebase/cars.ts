import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

import { db } from './config';
import { Car } from '../../types';

const carsCollection = collection(
  db,
  'cars',
);

/**
 * =========================================
 * RENT CARS
 * =========================================
 *
 * Only cars that:
 * 1. are available for rent
 * 2. are approved by admin
 */
export const subscribeToRentCars = (
  onData: (cars: Car[]) => void,
  onError?: (error: Error) => void,
) => {
  console.log(
    '🔥 RENT QUERY STARTED',
  );

  const q = query(
    carsCollection,

    where(
      'isAvailableForRent',
      '==',
      true,
    ),

    where(
      'listingStatus',
      '==',
      'approved',
    ),
  );

  return onSnapshot(
    q,

    (snapshot) => {
      console.log(
        '🔥 RENT SNAPSHOT SIZE:',
        snapshot.size,
      );

      console.log(
        '🔥 RENT DOCUMENTS:',
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            data: doc.data(),
          }),
        ),
      );

      const cars = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Car,
      );

      onData(cars);
    },

    (error) => {
      console.error(
        '🔥 RENT FIREBASE ERROR:',
        error,
      );

      onError?.(error);
    },
  );
};

/**
 * =========================================
 * MARKETPLACE CARS
 * =========================================
 *
 * Only cars that:
 * 1. are listed for sale
 * 2. are approved by admin
 */
export const subscribeToMarketplaceCars = (
  onData: (cars: Car[]) => void,
  onError?: (error: Error) => void,
) => {
  console.log(
    '🔥 MARKETPLACE QUERY STARTED',
  );

  const q = query(
    carsCollection,

    where(
      'isListedForSale',
      '==',
      true,
    ),

    where(
      'listingStatus',
      '==',
      'approved',
    ),
  );

  return onSnapshot(
    q,

    (snapshot) => {
      console.log(
        '🔥 MARKETPLACE SNAPSHOT SIZE:',
        snapshot.size,
      );

      console.log(
        '🔥 MARKETPLACE DOCUMENTS:',
        snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            data: doc.data(),
          }),
        ),
      );

      const cars = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Car,
      );

      onData(cars);
    },

    (error) => {
      console.error(
        '🔥 MARKETPLACE FIREBASE ERROR:',
        error,
      );

      onError?.(error);
    },
  );
};