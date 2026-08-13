import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

import { db } from './config';
import { SellSubmission } from '../../types';

export interface CreateSellSubmissionData {
  sellerId: string;

  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;

  make: string;
  model: string;
  year: number;
  kilometersDriven: number;

  condition:
    | 'excellent'
    | 'good'
    | 'fair';

  fuelType?: string;
  transmission?: string;
  color?: string;

  images?: string[];

  expectedPrice?: number;
}

/**
 * Create a new seller submission.
 *
 * IMPORTANT:
 * This does NOT create a marketplace listing.
 *
 * The submission first goes to:
 *
 * pending -> reviewing -> approved/rejected
 *
 * Admin can later create/activate
 * the marketplace listing.
 */
export const createSellSubmission = async (
  data: CreateSellSubmissionData,
) => {
  const submissionRef = await addDoc(
    collection(db, 'sellSubmissions'),
    {
      // Seller
      sellerId: data.sellerId,
      sellerName:
        data.sellerName || '',
      sellerEmail:
        data.sellerEmail || '',
      sellerPhone:
        data.sellerPhone || '',

      // Car
      make: data.make.trim(),
      model: data.model.trim(),
      year: data.year,
      kilometersDriven:
        data.kilometersDriven,

      condition: data.condition,

      // Additional details
      fuelType:
        data.fuelType || '',
      transmission:
        data.transmission || '',
      color:
        data.color || '',

      // Images
      images:
        data.images || [],

      // Seller expectation
      expectedPrice:
        data.expectedPrice || 0,

      // Admin workflow
      status: 'pending',

      adminNotes: '',
      rejectionReason: '',
      reviewedBy: '',

      // Listing created only after
      // admin approval
      listingId: '',

      // Metadata
      createdAt:
        serverTimestamp(),
      updatedAt:
        serverTimestamp(),
    },
  );

  return submissionRef.id;
};

/**
 * Listen to current user's
 * sell submissions.
 */
export const subscribeToMySellSubmissions = (
  sellerId: string,
  onData: (
    submissions: SellSubmission[],
  ) => void,
  onError?: (
    error: Error,
  ) => void,
) => {
  const q = query(
    collection(
      db,
      'sellSubmissions',
    ),

    where(
      'sellerId',
      '==',
      sellerId,
    ),

    orderBy(
      'createdAt',
      'desc',
    ),
  );

  return onSnapshot(
    q,

    (snapshot) => {
      const submissions =
        snapshot.docs.map(
          (document) =>
            ({
              id: document.id,
              ...document.data(),
            }) as SellSubmission,
        );

      onData(submissions);
    },

    (error) => {
      console.error(
        'SELL SUBMISSIONS ERROR:',
        error,
      );

      onError?.(error);
    },
  );
};