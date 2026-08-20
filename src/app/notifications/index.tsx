import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Ionicons,
} from '@expo/vector-icons';

import {
  router,
} from 'expo-router';

import {
  AppNotification,
} from '../../services/firebase/notifications';

import {
  useNotifications,
} from '../../hooks/useNotifications';

import {
  colors,
} from '../../constants/colors';

export default function NotificationsScreen() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
  } = useNotifications();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />

        <Text style={styles.loadingText}>
          Loading notifications...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons
          name="cloud-offline-outline"
          size={50}
          color={colors.error}
        />

        <Text style={styles.errorTitle}>
          Unable to load notifications
        </Text>

        <Text style={styles.errorText}>
          Please try again later.
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() =>
            router.back()
          }
        >
          <Text style={styles.backText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.iconButton}
          onPress={() =>
            router.back()
          }
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.white}
          />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            Notifications
          </Text>

          <Text style={styles.subtitle}>
            {unreadCount > 0
              ? `${unreadCount} unread`
              : 'All caught up'}
          </Text>
        </View>

        <View
          style={styles.headerSpace}
        />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) =>
          item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={[
          styles.list,
          notifications.length ===
            0 &&
            styles.emptyList,
        ]}
        renderItem={({
          item,
        }) => (
          <NotificationCard
            notification={item}
          />
        )}
        ListEmptyComponent={
          <EmptyNotifications />
        }
      />
    </View>
  );
}

/* ===================================== */
/* CARD */
/* ===================================== */

function NotificationCard({
  notification,
}: {
  notification: AppNotification;
}) {
  return (
    <View
      style={[
        styles.card,
        !notification.isRead &&
          styles.unreadCard,
      ]}
    >
      <View style={styles.notificationIcon}>
        <Ionicons
          name={getIcon(
            notification.type,
          )}
          size={22}
          color={colors.primary}
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <Text
            style={styles.cardTitle}
            numberOfLines={1}
          >
            {notification.title}
          </Text>

          {!notification.isRead && (
            <View
              style={styles.unreadDot}
            />
          )}
        </View>

        <Text style={styles.message}>
          {notification.message}
        </Text>

        <Text style={styles.date}>
          {formatDate(
            notification.createdAt,
          )}
        </Text>
      </View>
    </View>
  );
}

/* ===================================== */
/* EMPTY */
/* ===================================== */

function EmptyNotifications() {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>
        <Ionicons
          name="notifications-outline"
          size={38}
          color={colors.primary}
        />
      </View>

      <Text style={styles.emptyTitle}>
        No Notifications
      </Text>

      <Text style={styles.emptyText}>
        Updates about your bookings,
        quotes and other activities
        will appear here.
      </Text>
    </View>
  );
}

/* ===================================== */
/* ICON */
/* ===================================== */

function getIcon(
  type: AppNotification['type'],
): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'booking':
      return 'calendar-outline';

    case 'quote':
      return 'pricetag-outline';

    case 'sell':
      return 'car-outline';

    case 'consultation':
      return 'chatbubble-ellipses-outline';

    default:
      return 'information-circle-outline';
  }
}

/* ===================================== */
/* DATE */
/* ===================================== */

function formatDate(
  value: unknown,
) {
  if (!value) {
    return 'Recently';
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value
  ) {
    const timestamp =
      value as {
        toDate: () => Date;
      };

    return timestamp
      .toDate()
      .toLocaleDateString(
        'en-IN',
        {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
      );
  }

  return 'Recently';
}

/* ===================================== */
/* STYLES */
/* ===================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  center: {
    flex: 1,
    backgroundColor:
      colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },

  loadingText: {
    color:
      colors.textSecondary,
    fontSize: 12,
    marginTop: 12,
  },

  errorTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 15,
  },

  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 7,
  },

  backButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor:
      colors.primary,
  },

  backText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '900',
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 3,
  },

  headerSpace: {
    width: 42,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 35,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  card: {
    flexDirection: 'row',
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    borderRadius: 17,
    padding: 14,
    marginBottom: 11,
  },

  unreadCard: {
    borderColor:
      colors.primary,
  },

  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor:
      colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContent: {
    flex: 1,
    marginLeft: 12,
  },

  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardTitle: {
    flex: 1,
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },

  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      colors.primary,
    marginLeft: 8,
  },

  message: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },

  date: {
    color: colors.textMuted,
    fontSize: 9,
    marginTop: 7,
  },

  empty: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 82,
    height: 82,
    borderRadius: 25,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 18,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 8,
  },
});