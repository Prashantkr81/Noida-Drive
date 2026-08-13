import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Configure how notifications behave
 * when the app is in the foreground.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Register the device for push notifications
 * and return the Expo push token.
 */
export const registerForPushNotificationsAsync =
  async (): Promise<string | null> => {
    // Push notifications require a physical device.
    if (!Device.isDevice) {
      console.warn(
        'Push notifications require a physical device.',
      );

      return null;
    }

    /*
     * Android notification channel
     */
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        'default',
        {
          name: 'default',
          importance:
            Notifications.AndroidImportance.MAX,
          vibrationPattern: [
            0,
            250,
            250,
            250,
          ],
          lightColor: '#00D9FF',
        },
      );
    }

    /*
     * Check existing permission
     */
    const {
      status: existingStatus,
    } =
      await Notifications.getPermissionsAsync();

    let finalStatus =
      existingStatus;

    /*
     * Ask user if permission
     * has not been granted.
     */
    if (existingStatus !== 'granted') {
      const {
        status,
      } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn(
        'Notification permission was not granted.',
      );

      return null;
    }

    /*
     * Expo project ID
     *
     * This is required by Expo's push
     * notification service.
     */
    const projectId =
      Constants.expoConfig
        ?.extra
        ?.eas
        ?.projectId;

    if (!projectId) {
      console.warn(
        'Expo projectId is missing.',
      );

      return null;
    }

    try {
      const token =
        await Notifications.getExpoPushTokenAsync({
          projectId,
        });

      console.log(
        'EXPO PUSH TOKEN:',
        token.data,
      );

      return token.data;
    } catch (error) {
      console.error(
        'PUSH TOKEN ERROR:',
        error,
      );

      return null;
    }
  };

/**
 * Listen for notifications received
 * while the application is open.
 */
export const addNotificationReceivedListener =
  (
    callback: (
      notification: Notifications.Notification,
    ) => void,
  ) => {
    return Notifications.addNotificationReceivedListener(
      callback,
    );
  };

/**
 * Listen when the user taps a notification.
 */
export const addNotificationResponseListener =
  (
    callback: (
      response: Notifications.NotificationResponse,
    ) => void,
  ) => {
    return Notifications.addNotificationResponseReceivedListener(
      callback,
    );
  };

/**
 * Remove a notification listener.
 */
export const removeNotificationListener = (
  subscription: Notifications.EventSubscription,
) => {
  subscription.remove();
};