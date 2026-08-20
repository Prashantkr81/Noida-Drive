import {
  useEffect,
  useState,
} from 'react';

import {
  AppNotification,
  subscribeToMyNotifications,
} from '../services/firebase/notifications';

import { useAuth } from './useAuth';

export const useNotifications = () => {
  const { user } = useAuth();

  const [
    notifications,
    setNotifications,
  ] = useState<
    AppNotification[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      setError(null);

      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe =
      subscribeToMyNotifications(
        user.uid,

        (data) => {
          setNotifications(data);
          setLoading(false);
        },

        (err) => {
          console.error(
            'NOTIFICATIONS HOOK ERROR:',
            err,
          );

          setError(err);
          setLoading(false);
        },
      );

    return unsubscribe;
  }, [user]);

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  return {
    notifications,
    unreadCount,
    loading,
    error,
  };
};