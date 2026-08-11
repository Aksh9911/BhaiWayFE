import React, { useCallback, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppFooter, IconButton, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { triggerLightHaptic, useExitOnBack } from '@/shared/utils';
import { COMMUTE_CANCEL_CONFIRMED_SCREEN } from '@/features/office-commute/constants';
import { useCommuteCancelConfirmed } from '@/features/office-commute/hooks';
import { styles } from './CommuteCancelConfirmedScreen.styles';

export const CommuteCancelConfirmedScreen = () => {
  const { goHome, bookAgain } = useCommuteCancelConfirmed();
  useExitOnBack(goHome);

  const iconScale = useSharedValue(0.8);
  const iconOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslate = useSharedValue(12);
  const subtitleOpacity = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.2);

  useEffect(() => {
    iconOpacity.value = withTiming(1, { duration: 280 });
    iconScale.value = withSpring(1, { damping: 12, stiffness: 180 });

    textOpacity.value = withDelay(100, withTiming(1, { duration: 320 }));
    textTranslate.value = withDelay(100, withSpring(0, { damping: 14, stiffness: 160 }));
    subtitleOpacity.value = withDelay(200, withTiming(1, { duration: 360 }));

    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 900, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 900, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false,
    );
    pulseOpacity.value = withRepeat(
      withSequence(withTiming(0.08, { duration: 900 }), withTiming(0.2, { duration: 900 })),
      -1,
      false,
    );
  }, [
    iconOpacity,
    iconScale,
    pulseOpacity,
    pulseScale,
    subtitleOpacity,
    textOpacity,
    textTranslate,
  ]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const headingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslate.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
    transform: [{ scale: pulseScale.value }],
  }));

  const handleHome = useCallback(() => {
    triggerLightHaptic();
    goHome();
  }, [goHome]);

  const handleBookAgain = useCallback(() => {
    triggerLightHaptic();
    bookAgain();
  }, [bookAgain]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={handleHome}
          color={colors.primary}
          accessibilityLabel="Go back"
        />
        <Text style={styles.headerTitle}>{COMMUTE_CANCEL_CONFIRMED_SCREEN.title}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconStack}>
          <Animated.View style={[styles.pulseOuter, pulseAnimatedStyle]} />
          <View style={styles.pulseInner} />
          <Animated.View style={[styles.iconCircle, iconAnimatedStyle]}>
            <Ionicons name="close" size={48} color="#BA1A1A" />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.heading, headingAnimatedStyle]}>
          {COMMUTE_CANCEL_CONFIRMED_SCREEN.heading}
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, subtitleAnimatedStyle]}>
          {COMMUTE_CANCEL_CONFIRMED_SCREEN.subtitle}
        </Animated.Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.bookButton,
            pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleBookAgain}
          accessibilityRole="button"
          accessibilityLabel={COMMUTE_CANCEL_CONFIRMED_SCREEN.bookAgainLabel}
        >
          <Text style={styles.bookLabel}>{COMMUTE_CANCEL_CONFIRMED_SCREEN.bookAgainLabel}</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.homeButton, pressed && { opacity: 0.7 }]}
          onPress={handleHome}
          accessibilityRole="button"
          accessibilityLabel={COMMUTE_CANCEL_CONFIRMED_SCREEN.homeLabel}
        >
          <Text style={styles.homeLabel}>{COMMUTE_CANCEL_CONFIRMED_SCREEN.homeLabel}</Text>
        </Pressable>
      </View>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
