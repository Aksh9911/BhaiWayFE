import React, { useCallback, useEffect } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_CONFIG } from '@/config';
import { AppFooter, IconButton, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { getSearchParam, triggerLightHaptic } from '@/shared/utils';
import { DriverFareBreakdown } from '@/features/my-rides/components';
import { DRIVER_TRIP_COMPLETED_SCREEN } from '@/features/my-rides/constants';
import { useDriverTripCompleted } from '@/features/my-rides/hooks';
import { styles } from './DriverTripCompletedScreen.styles';

export const DriverTripCompletedScreen = () => {
  const params = useLocalSearchParams<{ destination?: string }>();
  const destination = getSearchParam(params.destination);

  const { trip, openNotifications, ratePassengers, viewTripDetails } =
    useDriverTripCompleted({
      destination: destination || undefined,
    });

  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 420 }),
        withSpring(0, { damping: 8, stiffness: 160 }),
      ),
      3,
      false,
    );
  }, [bounce]);

  const bounceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  const handleNotifications = useCallback(() => {
    triggerLightHaptic();
    openNotifications();
  }, [openNotifications]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="car" size={28} color={colors.primary} />
          <Text style={styles.brandName}>{APP_CONFIG.name}</Text>
        </View>
        <IconButton
          icon="notifications-outline"
          onPress={handleNotifications}
          color={colors.textMuted}
          accessibilityLabel="Open notifications"
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Animated.View style={[styles.successCircle, bounceStyle]}>
            <Ionicons name="checkmark-circle" size={44} color={colors.white} />
          </Animated.View>
          <Text style={styles.heading} accessibilityRole="header">
            {DRIVER_TRIP_COMPLETED_SCREEN.heading}
          </Text>
          <Text style={styles.subtitle}>{DRIVER_TRIP_COMPLETED_SCREEN.subtitle}</Text>
        </View>

        <View style={styles.earningsCard}>
          <View style={styles.earningsWatermark} pointerEvents="none">
            <Ionicons name="cash-outline" size={88} color={colors.primary} />
          </View>

          <View style={styles.earningsTop}>
            <View>
              <Text style={styles.earningsLabel}>
                {DRIVER_TRIP_COMPLETED_SCREEN.totalEarningsLabel}
              </Text>
              <Text style={styles.earningsValue}>{trip.earningsLabel}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{trip.statusLabel}</Text>
            </View>
          </View>

          <DriverFareBreakdown lines={trip.fareLines} />
        </View>

        <View style={styles.communityCard}>
          <View style={styles.communityIcon}>
            <Ionicons name="people" size={22} color={colors.textSecondary} />
          </View>
          <Text style={styles.communityText}>
            {DRIVER_TRIP_COMPLETED_SCREEN.communityMessage}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
            onPress={ratePassengers}
            accessibilityRole="button"
            accessibilityLabel={DRIVER_TRIP_COMPLETED_SCREEN.ratePassengersLabel}
          >
            <Text style={styles.primaryLabel}>
              {DRIVER_TRIP_COMPLETED_SCREEN.ratePassengersLabel}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.9 }]}
            onPress={viewTripDetails}
            accessibilityRole="button"
            accessibilityLabel={DRIVER_TRIP_COMPLETED_SCREEN.viewTripDetailsLabel}
          >
            <Text style={styles.secondaryLabel}>
              {DRIVER_TRIP_COMPLETED_SCREEN.viewTripDetailsLabel}
            </Text>
          </Pressable>
        </View>

        <View style={styles.mapCard}>
          <Image
            source={{ uri: DRIVER_TRIP_COMPLETED_SCREEN.mapImageUri }}
            style={styles.mapImage}
            resizeMode="cover"
            accessibilityLabel="Completed route map"
          />
          <View style={styles.mapFade} pointerEvents="none" />
        </View>
      </ScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
