import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useRef, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { colors } from '../constants/colors';

const { width } =
  Dimensions.get('window');

const ONBOARDING_KEY =
  '@noida_drive_onboarding_completed';

const slides = [
  {
    id: '1',
    icon: 'car-sport-outline' as const,
    eyebrow: 'WELCOME TO NOIDA DRIVE',
    title: 'Find the right car for your journey',
    description:
      'Explore approved cars for rental and marketplace deals, all from one simple app.',
  },
  {
    id: '2',
    icon: 'search-outline' as const,
    eyebrow: 'EXPLORE & REQUEST',
    title: 'Choose a car and make your request',
    description:
      'Request a rental or submit a quote. Every request goes through a clear review process.',
  },
  {
    id: '3',
    icon: 'shield-checkmark-outline' as const,
    eyebrow: 'SAFE & MANAGED',
    title: 'Everything stays organized',
    description:
      'Track your bookings, quotes, sell submissions and updates from one place.',
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const flatListRef =
    useRef<FlatList>(null);

  const isLast =
    currentIndex ===
    slides.length - 1;

  const goNext = () => {
    if (isLast) {
      finishOnboarding();
      return;
    }

    flatListRef.current?.scrollToIndex({
      index: currentIndex + 1,
      animated: true,
    });
  };

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(
        ONBOARDING_KEY,
        'true',
      );
    } catch (error) {
      console.error(
        'ONBOARDING SAVE ERROR:',
        error,
      );
    }

    router.replace('/(auth)/login');
  };

  const skipOnboarding = () => {
    finishOnboarding();
  };

  return (
    <View style={styles.container}>
      {/* Skip */}

      <View style={styles.topBar}>
        <Text style={styles.brand}>
          NOIDA DRIVE
        </Text>

        {!isLast && (
          <Pressable
            onPress={skipOnboarding}
          >
            <Text style={styles.skip}>
              Skip
            </Text>
          </Pressable>
        )}
      </View>

      {/* Slides */}

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={
          false
        }
        keyExtractor={(item) =>
          item.id
        }
        onMomentumScrollEnd={(
          event,
        ) => {
          const index = Math.round(
            event.nativeEvent.contentOffset
              .x / width,
          );

          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.illustration}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name={item.icon}
                  size={72}
                  color={colors.primary}
                />
              </View>

              <View
                style={[
                  styles.smallDot,
                  styles.dotOne,
                ]}
              />

              <View
                style={[
                  styles.smallDot,
                  styles.dotTwo,
                ]}
              />

              <View
                style={[
                  styles.smallDot,
                  styles.dotThree,
                ]}
              />
            </View>

            <Text style={styles.eyebrow}>
              {item.eyebrow}
            </Text>

            <Text style={styles.title}>
              {item.title}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Bottom */}

      <View style={styles.bottom}>
        <View style={styles.dots}>
          {slides.map(
            (_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index ===
                    currentIndex &&
                    styles.activeDot,
                ]}
              />
            ),
          )}
        </View>

        <Pressable
          onPress={goNext}
          style={styles.nextButton}
        >
          <Text style={styles.nextText}>
            {isLast
              ? 'Get Started'
              : 'Continue'}
          </Text>

          <Ionicons
            name={
              isLast
                ? 'checkmark'
                : 'arrow-forward'
            }
            size={19}
            color={
              colors.background
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      colors.background,
  },

  topBar: {
    paddingTop: 58,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
  },

  skip: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },

  slide: {
    width,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },

  illustration: {
    width: 250,
    height: 250,
    borderRadius: 80,
    backgroundColor:
      colors.surface,
    borderWidth: 1,
    borderColor:
      colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 35,
  },

  iconCircle: {
    width: 135,
    height: 135,
    borderRadius: 68,
    backgroundColor:
      colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor:
      colors.primary,
  },

  dotOne: {
    top: 40,
    right: 45,
  },

  dotTwo: {
    left: 35,
    bottom: 55,
  },

  dotThree: {
    right: 35,
    bottom: 38,
    opacity: 0.5,
  },

  eyebrow: {
    color: colors.primary,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },

  title: {
    color: colors.white,
    fontSize: 29,
    lineHeight: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 14,
    maxWidth: 330,
  },

  bottom: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      colors.border,
    marginHorizontal: 4,
  },

  activeDot: {
    width: 24,
    backgroundColor:
      colors.primary,
  },

  nextButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor:
      colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },

  nextText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: '900',
  },
});