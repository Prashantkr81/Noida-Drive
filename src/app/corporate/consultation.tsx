import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';

import { colors } from '../../constants/colors';

export default function ConsultationScreen() {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [requirement, setRequirement] = useState('');

  const handleSubmit = () => {
    if (!companyName || !contactName || !phone) {
      Alert.alert(
        'Missing Information',
        'Please fill in the required fields.',
      );
      return;
    }

    // Firebase integration comes next.
    Alert.alert(
      'Request Submitted',
      'Our corporate team will contact you shortly.',
      [
        {
          text: 'Done',
          onPress: () => router.back(),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        <Pressable
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ← Back
          </Text>
        </Pressable>

        <Text style={styles.title}>
          Schedule a Consultation
        </Text>

        <Text style={styles.subtitle}>
          Tell us about your corporate transportation
          requirements.
        </Text>

        <View style={styles.form}>

          <Field
            label="COMPANY NAME"
            placeholder="Your company"
            value={companyName}
            onChangeText={setCompanyName}
          />

          <Field
            label="CONTACT PERSON"
            placeholder="Your name"
            value={contactName}
            onChangeText={setContactName}
          />

          <Field
            label="PHONE NUMBER"
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <View>
            <Text style={styles.label}>
              REQUIREMENTS
            </Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about your fleet requirements..."
              placeholderTextColor={colors.textMuted}
              value={requirement}
              onChangeText={setRequirement}
              multiline
              textAlignVertical="top"
            />
          </View>

          <Pressable
            style={styles.button}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              Submit Consultation Request
            </Text>
          </Pressable>

        </View>

      </ScrollView>
    </View>
  );
}

interface FieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'phone-pad';
}

function Field({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
}: FieldProps) {
  return (
    <View>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    padding: 24,
    paddingTop: 58,
    paddingBottom: 40,
  },

  back: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },

  title: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '900',
    marginTop: 28,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },

  form: {
    gap: 20,
    marginTop: 32,
  },

  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    color: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
  },

  textArea: {
    minHeight: 140,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },

  buttonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '900',
  },
});