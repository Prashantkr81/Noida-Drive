import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
  createContext,
  ReactNode,
  useEffect,
  useState,
} from 'react';

import { auth, db } from '../services/firebase/config';
import { UserProfile } from '../types/user';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
});

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          setUser(firebaseUser);

          if (!firebaseUser) {
            setProfile(null);
            return;
          }

          const profileRef = doc(
            db,
            'users',
            firebaseUser.uid,
          );

          const profileSnapshot = await getDoc(profileRef);

          if (profileSnapshot.exists()) {
            setProfile(
              profileSnapshot.data() as UserProfile,
            );
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('AUTH PROFILE ERROR:', error);
          setProfile(null);
        } finally {
          setLoading(false);
        }
      },
    );

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}