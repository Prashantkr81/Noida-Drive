import { useEffect } from 'react';

import {
  addNotificationReceivedListener,
  addNotificationResponseListener,
  registerForPushNotificationsAsync,
} from '../services/notifications/pushNotifications';

import { savePushToken } from '../services/firebase/users';
import { useAuth } from '../hooks/useAuth';

export default function NotificationInitializer() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }

    let mounted = true;

    const registerNotifications =
      async () => {
        try {
          const token =
            await registerForPushNotificationsAsync();

          if (
            mounted &&
            token
          ) {
            await savePushToken(
              user.uid,
              token,
            );

            console.log(
              'PUSH TOKEN SAVED FOR USER:',
              user.uid,
            );
          }
        } catch (error) {
          console.error(
            'NOTIFICATION INITIALIZATION ERROR:',
            error,
          );
        }
      };

    registerNotifications();

    const receivedSubscription =
      addNotificationReceivedListener(
        (notification) => {
          console.log(
            'NOTIFICATION RECEIVED:',
            notification,
          );
        },
      );

    const responseSubscription =
      addNotificationResponseListener(
        (response) => {
          console.log(
            'NOTIFICATION TAPPED:',
            response,
          );

          /*
           * Navigation based on notification
           * data will be added later.
           */
        },
      );

    return () => {
      mounted = false;

      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [user]);

  return null;
}