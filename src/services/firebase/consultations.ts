import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  query,
} from 'firebase/firestore';

import { db } from './config';

export type ConsultationStatus =
  | 'pending'
  | 'reviewing'
  | 'contacted'
  | 'completed'
  | 'cancelled';

export interface CreateConsultationData {
  userId: string;

  userName?: string;
  userEmail?: string;
  userPhone?: string;

  subject?: string;
  message: string;

  preferredContactMethod?:
    | 'phone'
    | 'email';

  preferredDate?: string;
}

export interface Consultation {
  id: string;

  userId: string;

  userName?: string;
  userEmail?: string;
  userPhone?: string;

  subject?: string;
  message: string;

  preferredContactMethod?:
    | 'phone'
    | 'email';

  preferredDate?: string;

  status: ConsultationStatus;

  adminNotes?: string;
  reviewedBy?: string;

  createdAt?: unknown;
  updatedAt?: unknown;
}

/**
 * Create a consultation request.
 */
export const createConsultation =
  async (
    data: CreateConsultationData,
  ) => {
    const consultationRef =
      await addDoc(
        collection(
          db,
          'consultations',
        ),
        {
          userId: data.userId,

          userName:
            data.userName || '',

          userEmail:
            data.userEmail || '',

          userPhone:
            data.userPhone || '',

          subject:
            data.subject || '',

          message:
            data.message.trim(),

          preferredContactMethod:
            data.preferredContactMethod ||
            'phone',

          preferredDate:
            data.preferredDate || '',

          status: 'pending',

          adminNotes: '',
          reviewedBy: '',

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        },
      );

    return consultationRef.id;
  };

/**
 * Subscribe to current user's consultations.
 */
export const subscribeToMyConsultations =
  (
    userId: string,
    onData: (
      consultations: Consultation[],
    ) => void,
    onError?: (
      error: Error,
    ) => void,
  ) => {
    const q = query(
      collection(
        db,
        'consultations',
      ),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const consultations =
          snapshot.docs
            .map(
              (document) =>
                ({
                  id: document.id,
                  ...document.data(),
                }) as Consultation,
            )
            .filter(
              (consultation) =>
                consultation.userId ===
                userId,
            );

        onData(
          consultations,
        );
      },
      (error) => {
        console.error(
          'MY CONSULTATIONS ERROR:',
          error,
        );

        onError?.(error);
      },
    );
  };