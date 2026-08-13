import { Quote } from '../../types';

import {
  addDoc,
  doc,
  getDoc,
  serverTimestamp,
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

import { db } from './config';

export interface CreateQuoteData {
  carId: string;
  buyerId: string;
  buyerName?: string;
  buyerPhone?: string;
  offeredPrice: number;
  message?: string;
}

export const createQuote = async (
  data: CreateQuoteData,
) => {
  // Get car first so we don't trust
  // car information coming from the client.
  const carSnapshot = await getDoc(
    doc(db, 'cars', data.carId),
  );

  if (!carSnapshot.exists()) {
    throw new Error('Car listing not found.');
  }

  const car = carSnapshot.data();

  if (
    car.isListedForSale !== true ||
    car.listingStatus !== 'approved'
  ) {
    throw new Error(
      'This car is not available for quotes.',
    );
  }

  const quoteRef = await addDoc(
    collection(db, 'quotes'),
    {
      carId: data.carId,

      carMake: car.make,
      carModel: car.model,

      buyerId: data.buyerId,
      buyerName: data.buyerName || '',
      buyerPhone: data.buyerPhone || '',

      sellerId: car.ownerId || '',

      offeredPrice: data.offeredPrice,
      message: data.message || '',

      status: 'pending',

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return quoteRef.id;
};

export const subscribeToMyQuotes = (
  userId: string,
  onData: (quotes: Quote[]) => void,
  onError?: (error: Error) => void,
) => {
  const q = query(
    collection(db, 'quotes'),
    where('buyerId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const quotes = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Quote,
      );

      onData(quotes);
    },
    (error) => {
      console.error(
        'MY QUOTES ERROR:',
        error,
      );

      onError?.(error);
    },
  );
};