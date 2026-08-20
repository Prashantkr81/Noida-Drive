import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  router,
} from 'expo-router';

import {
  Ionicons,
} from '@expo/vector-icons';

import { colors } from '../constants/colors';

export default function ContactUsScreen() {
  const handleEmail = () => {
    Linking.openURL(
      'mailto:support@noidadrive.com',
    );
  };

  const handleCall = () => {
    Linking.openURL(
      'tel:+91999999999',
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={colors.white}
            />
          </Pressable>

          <Text style={styles.headerTitle}>
            Contact Us
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <Text style={styles.intro}>
          We're here to help. Reach out to
          the Noida Drive team.
        </Text>

        <ContactCard
          icon="mail-outline"
          title="Email"
          value="support@noidadrive.com"
          onPress={handleEmail}
        />

        <ContactCard
          icon="call-outline"
          title="Phone"
          value="+91 99999 99999"
          onPress={handleCall}
        />

        <View style={styles.card}>
          <Ionicons
            name="time-outline"
            size={24}
            color={colors.primary}
          />

          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Support Hours
            </Text>

            <Text style={styles.value}>
              Monday – Saturday
            </Text>

            <Text style={styles.secondary}>
              9:00 AM – 7:00 PM
            </Text>
          </View>
        </View>

        <View style={styles.note}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />

          <Text style={styles.noteText}>
            For urgent rental issues, please
            mention your booking/request ID
            when contacting support.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function ContactCard({
  icon,
  title,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.iconBox}>
        <Ionicons
          name={icon}
          size={24}
          color={colors.primary}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {title}
        </Text>

        <Text style={styles.value}>
          {value}
        </Text>
      </View>

      <Ionicons
        name="open-outline"
        size={18}
        color={colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
    marginHorizontal: 10,
  },

  headerSpace: {
    width: 42,
  },

  intro: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    padding: 14,
    marginBottom: 12,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textContainer: {
    flex: 1,
    marginLeft: 13,
  },

  title: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },

  value: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },

  secondary: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },

  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 14,
    marginTop: 4,
  },

  noteText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
    marginLeft: 9,
  },
});