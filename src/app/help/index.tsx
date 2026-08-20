import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { router } from 'expo-router';

export default function ContactUsScreen() {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>
          ← Back
        </Text>
      </Pressable>

      <Text style={styles.title}>
        Contact Us
      </Text>

      <Text style={styles.subtitle}>
        Get in touch with the Noida Drive
        team.
      </Text>

      <Text style={styles.contact}>
        support@noidadrive.com
      </Text>

      <Text style={styles.contact}>
        +91 99999 99999
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 60,
    paddingHorizontal: 20,
  },

  backButton: {
    marginBottom: 30,
  },

  backText: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 12,
  },

  contact: {
    color: '#22D3EE',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 18,
  },
});