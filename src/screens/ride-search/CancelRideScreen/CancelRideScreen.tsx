import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, IconButton } from '@/shared/components';
import { colors } from '@/shared/theme';
import { getSearchParam, triggerLightHaptic } from '@/shared/utils';
import { CANCEL_RIDE_SCREEN } from '@/features/ride-search/constants';
import { useCancelRide } from '@/features/ride-search/hooks';
import type { RideType } from '@/features/ride-search/types';
import { styles } from './CancelRideScreen.styles';

const isRideType = (value: string): value is RideType =>
  value === 'regular' || value === 'assured';

export const CancelRideScreen = () => {
  const params = useLocalSearchParams<{
    rideId?: string;
    rideType?: string;
    origin?: string;
    destination?: string;
  }>();

  const rideTypeParam = getSearchParam(params.rideType);
  const rideType: RideType = isRideType(rideTypeParam) ? rideTypeParam : 'assured';

  const {
    summary,
    reasons,
    selectedReason,
    comments,
    isAssured,
    submitting,
    selectReason,
    setComments,
    confirmCancellation,
    goBack,
    openNotifications,
  } = useCancelRide({
    rideId: getSearchParam(params.rideId) || 'ride-default',
    rideType,
    origin: getSearchParam(params.origin),
    destination: getSearchParam(params.destination),
  });

  const handleConfirm = useCallback(() => {
    triggerLightHaptic();
    confirmCancellation();
  }, [confirmCancellation]);

  const handleGoBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-back"
            onPress={handleGoBack}
            color={colors.primary}
            accessibilityLabel="Go back"
          />
          <Text style={styles.headerTitle}>{CANCEL_RIDE_SCREEN.title}</Text>
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
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.cancelIconWrap}>
            <Ionicons name="close-circle" size={48} color={colors.error} />
          </View>
          <Text style={styles.heading}>{CANCEL_RIDE_SCREEN.heading}</Text>
          <Text style={styles.subtitle}>{CANCEL_RIDE_SCREEN.subtitle}</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryLabel}>{CANCEL_RIDE_SCREEN.rideDetailsLabel}</Text>
              <View style={styles.routeRow}>
                <Ionicons name="navigate" size={16} color={colors.primary} />
                <Text style={styles.routeLabel}>{summary.routeLabel}</Text>
              </View>
            </View>
            <View style={styles.summaryRight}>
              <Text style={styles.dateLabel}>{summary.dateLabel}</Text>
              <Text style={styles.timeLabel}>{summary.timeLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{CANCEL_RIDE_SCREEN.reasonLabel}</Text>
          <View style={styles.reasonGrid}>
            {reasons.map((reason) => {
              const selected = selectedReason === reason.id;
              return (
                <Pressable
                  key={reason.id}
                  style={({ pressed }) => [
                    styles.reasonChip,
                    selected && styles.reasonChipSelected,
                    pressed && { transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() => selectReason(reason.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={reason.label}
                >
                  <Text style={[styles.reasonLabel, selected && styles.reasonLabelSelected]}>
                    {reason.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{CANCEL_RIDE_SCREEN.commentsLabel}</Text>
          <TextInput
            style={styles.commentsInput}
            value={comments}
            onChangeText={setComments}
            placeholder={CANCEL_RIDE_SCREEN.commentsPlaceholder}
            placeholderTextColor="#747686"
            multiline
            textAlignVertical="top"
            accessibilityLabel="Cancellation comments"
          />
        </View>

        {isAssured ? (
          <View style={styles.warningCard}>
            <Ionicons name="information-circle" size={22} color="#5C6276" />
            <Text style={styles.warningText}>
              <Text style={styles.warningBold}>{CANCEL_RIDE_SCREEN.assuredNotePrefix} </Text>
              {CANCEL_RIDE_SCREEN.assuredNote}
            </Text>
          </View>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              submitting && styles.confirmButtonBusy,
              pressed && !submitting && { opacity: 0.92, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleConfirm}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Confirm cancellation"
          >
            {submitting ? (
              <View style={styles.confirmBusyRow}>
                <ActivityIndicator color={colors.white} />
                <Text style={styles.confirmLabel}>{CANCEL_RIDE_SCREEN.confirmingLabel}</Text>
              </View>
            ) : (
              <Text style={styles.confirmLabel}>{CANCEL_RIDE_SCREEN.confirmLabel}</Text>
            )}
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              pressed && { backgroundColor: '#F3F4F5', transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleGoBack}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backLabel}>{CANCEL_RIDE_SCREEN.goBackLabel}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
