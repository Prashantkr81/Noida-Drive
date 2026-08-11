import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config'; // Adjust path if your firebase setup file is named differently

// 1. Register User
export const registerUser = async (email: string, password: string, trimmedPhone: string, userData: Record<string, any>) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create user document in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    ...userData,
    uid: user.uid,
    email: user.email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return user;
};

// 2. Login User
export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// 3. Reset Password
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

// 4. Logout User
export const logoutUser = async () => {
  await signOut(auth);
};