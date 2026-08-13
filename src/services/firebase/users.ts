import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { db } from './config';

export const getUserProfile = async (
  userId: string,
) => {
  const snapshot = await getDoc(
    doc(db, 'users', userId),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
};

export const updateUserProfile = async (
  userId: string,
  data: {
    name?: string;
    phone?: string;
  },
) => {
  const userRef = doc(
    db,
    'users',
    userId,
  );

  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Save an Expo push token for the user.
 *
 * arrayUnion prevents the same token from
 * being added multiple times.
 */
export const savePushToken = async (
  userId: string,
  pushToken: string,
) => {
  if (!pushToken) {
    return;
  }

  const userRef = doc(
    db,
    'users',
    userId,
  );

  await updateDoc(userRef, {
    pushTokens: arrayUnion(pushToken),
    updatedAt: serverTimestamp(),
  });
};