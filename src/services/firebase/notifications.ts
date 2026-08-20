import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { db } from './config';

export type NotificationType =
  | 'booking'
  | 'quote'
  | 'sell'
  | 'consultation'
  | 'system';

export interface AppNotification {
  id: string;

  userId: string;

  title: string;
  message: string;

  type: NotificationType;

  isRead: boolean;

  createdAt?: unknown;
}

/**
 * Listen to current user's notifications.
 */
export const subscribeToMyNotifications = (
  userId: string,
  onData: (
    notifications: AppNotification[],
  ) => void,
  onError?: (
    error: Error,
  ) => void,
) => {
  const q = query(
    collection(
      db,
      'notifications',
    ),

    where(
      'userId',
      '==',
      userId,
    ),

    orderBy(
      'createdAt',
      'desc',
    ),
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const notifications =
        snapshot.docs.map(
          (document) =>
            ({
              id: document.id,
              ...document.data(),
            }) as AppNotification,
        );

      onData(notifications);
    },
    (error) => {
      console.error(
        'NOTIFICATIONS ERROR:',
        error,
      );

      onError?.(error);
    },
  );
};