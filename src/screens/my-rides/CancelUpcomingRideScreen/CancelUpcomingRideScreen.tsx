import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, IconButton } from '@/shared/components';
import { colors } from '@/shared/theme';
import { getSearchParam, triggerLightHaptic } from '@/shared/utils';
import { CANCEL_UPCOMING_RIDE_SCREEN } from '@/features/my-rides/constants';
import { useCancelUpcomingRide } from '@/features/my-rides/hooks';
import { styles } from './CancelUpcomingRideScreen.styles';

export const CancelUpcomingRideScreen = () => {
  const params = useLocalSearchParams<{
    rideId?: string;
    dateLabel?: string;
    title?: string;
    pickupLabel?: string;
    dropoffLabel?: string;
    mode?: string;
  }>();

  const {
    summary,
    subtitle,
    note,
    confirming,
    keepRide,
    confirmCancel,
    goBack,
    openNotifications,
  } = useCancelUpcomingRide({
    rideId: getSearchParam(params.rideId),
    dateLabel: getSearchParam(params.dateLabel),
    title: getSearchParam(params.title),
    pickupLabel: getSearchParam(params.pickupLabel),
    dropoffLabel: getSearchParam(params.dropoffLabel),
    mode: getSearchParam(params.mode),
  });

  const handleKeep = useCallback(() => {
    triggerLightHaptic();
    keepRide();
  }, [keepRide]);

  const handleConfirm = useCallback(() => {
    triggerLightHaptic();
    confirmCancel();
  }, [confirmCancel]);

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-back"
            onPress={handleBack}
            color={colors.primary}
            accessibilityLabel="Go back"
          />
          <Text style={styles.headerTitle}>{CANCEL_UPCOMING_RIDE_SCREEN.title}</Text>
        </View>
        <IconButton
          icon="notifications-outline"
          onPress={openNotifications}
          color={colors.primary}
          accessibilityLabel="Open notifications"
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.cancelIconWrap}>
            <Ionicons name="warning" size={40} color="#BA1A1A" />
          </View>
          <Text style={styles.heading}>{CANCEL_UPCOMING_RIDE_SCREEN.heading}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{CANCEL_UPCOMING_RIDE_SCREEN.rideDetailsLabel}</Text>
          <Text style={styles.rideTitle}>{summary.title}</Text>
          <View style={styles.routeRow}>
            <Ionicons name="navigate" size={16} color={colors.primary} />
            <Text style={styles.routeLabel}>{summary.routeLabel}</Text>
          </View>
          <Text style={styles.dateLabel}>{summary.dateLabel}</Text>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>{CANCEL_UPCOMING_RIDE_SCREEN.noteLabel}</Text>
          <Text style={styles.noteText}>{note}</Text>
        </View>
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.keepButton,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleKeep}
          disabled={confirming}
          accessibilityRole="button"
          accessibilityLabel={CANCEL_UPCOMING_RIDE_SCREEN.keepLabel}
        >
          <Text style={styles.keepLabel}>{CANCEL_UPCOMING_RIDE_SCREEN.keepLabel}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
            confirming && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={confirming}
          accessibilityRole="button"
          accessibilityLabel={CANCEL_UPCOMING_RIDE_SCREEN.confirmLabel}
        >
          {confirming ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.confirmLabel}>{CANCEL_UPCOMING_RIDE_SCREEN.confirmLabel}</Text>
          )}
        </Pressable>
      </View>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
