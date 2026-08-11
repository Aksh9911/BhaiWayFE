import React, { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, IconButton, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { UpcomingRideCard } from '@/features/my-rides/components';
import { MY_RIDES_SCREEN } from '@/features/my-rides/constants';
import { useMyRides } from '@/features/my-rides/hooks';
import type { HistoryRideItem, MyRidesTab, UpcomingRideSummary } from '@/features/my-rides/types';
import { styles } from './MyRidesScreen.styles';

export const MyRidesScreen = () => {
  const {
    showModeBadge,
    modeBadge,
    tab,
    setTab,
    upcomingRides,
    historyRides,
    modifyLabel,
    emptyUpcomingSubtitle,
    emptyPastSubtitle,
    resolveRideRole,
    labelsForRole,
    openNotifications,
    openRideDetails,
    openPastRide,
    modifyRide,
    trackRide,
    cancelRequest,
  } = useMyRides();

  const handleTab = useCallback(
    (next: MyRidesTab) => {
      triggerLightHaptic();
      setTab(next);
    },
    [setTab],
  );

  const handleTrack = useCallback(
    (ride: UpcomingRideSummary) => {
      triggerLightHaptic();
      trackRide(ride);
    },
    [trackRide],
  );

  const handleCancel = useCallback(
    (ride: UpcomingRideSummary) => {
      triggerLightHaptic();
      cancelRequest(ride);
    },
    [cancelRequest],
  );

  const handleModify = useCallback(
    (ride: UpcomingRideSummary) => {
      triggerLightHaptic();
      modifyRide(ride);
    },
    [modifyRide],
  );

  const handleOpenDetails = useCallback(
    (ride: UpcomingRideSummary) => {
      const role = resolveRideRole(ride);
      if (role !== 'driver' || ride.assured) {
        return;
      }
      triggerLightHaptic();
      openRideDetails(ride);
    },
    [openRideDetails, resolveRideRole],
  );

  const handleOpenPastRide = useCallback(
    (ride: HistoryRideItem) => {
      triggerLightHaptic();
      openPastRide(ride);
    },
    [openPastRide],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{MY_RIDES_SCREEN.title}</Text>
          {showModeBadge ? (
            <View style={styles.modeBadge}>
              <Text style={styles.modeBadgeText}>{modeBadge}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          <IconButton
            icon="notifications-outline"
            onPress={openNotifications}
            color={colors.primary}
            accessibilityLabel="Open notifications"
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabs}>
          <Pressable
            style={styles.tab}
            onPress={() => handleTab('upcoming')}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'upcoming' }}
          >
            <Text style={[styles.tabLabel, tab === 'upcoming' && styles.tabLabelActive]}>
              {MY_RIDES_SCREEN.tabUpcoming}
            </Text>
            {tab === 'upcoming' ? <View style={styles.tabIndicator} /> : null}
          </Pressable>
          <Pressable
            style={styles.tab}
            onPress={() => handleTab('past')}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === 'past' }}
          >
            <Text style={[styles.tabLabel, tab === 'past' && styles.tabLabelActive]}>
              {MY_RIDES_SCREEN.tabPast}
            </Text>
            {tab === 'past' ? <View style={styles.tabIndicator} /> : null}
          </Pressable>
        </View>

        {tab === 'upcoming' ? (
          upcomingRides.length > 0 ? (
            <View style={styles.upcomingList}>
              {upcomingRides.map((ride) => {
                const role = resolveRideRole(ride);
                const labels = labelsForRole(role);
                return (
                  <UpcomingRideCard
                    key={ride.id}
                    ride={ride}
                    role={role}
                    peerLabel={labels.peerLabel}
                    cancelLabel={labels.cancelLabel}
                    trackLabel={labels.trackLabel}
                    modifyLabel={modifyLabel}
                    onCancel={() => handleCancel(ride)}
                    onTrack={() => handleTrack(ride)}
                    onModify={() => handleModify(ride)}
                    onOpenDetails={() => handleOpenDetails(ride)}
                  />
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={32} color="#747686" />
              <Text style={styles.emptyTitle}>{MY_RIDES_SCREEN.emptyUpcomingTitle}</Text>
              <Text style={styles.emptySubtitle}>{emptyUpcomingSubtitle}</Text>
            </View>
          )
        ) : historyRides.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={32} color="#747686" />
            <Text style={styles.emptyTitle}>{MY_RIDES_SCREEN.emptyPastTitle}</Text>
            <Text style={styles.emptySubtitle}>{emptyPastSubtitle}</Text>
          </View>
        ) : (
          <View style={styles.pastList}>
            {historyRides.map((ride, index) => (
              <Pressable
                key={ride.id}
                style={({ pressed }) => [
                  styles.pastRow,
                  index === historyRides.length - 1 && styles.pastRowLast,
                  pressed && { opacity: 0.88 },
                ]}
                onPress={() => handleOpenPastRide(ride)}
                accessibilityRole="button"
                accessibilityLabel={`${ride.routeLabel}, ${ride.dateLabel}`}
              >
                <Text style={styles.pastRoute}>{ride.routeLabel}</Text>
                <Text style={styles.pastDate}>{ride.dateLabel}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
