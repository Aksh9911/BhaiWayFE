import React, { useCallback } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, Avatar } from '@/shared/components';
import { triggerLightHaptic } from '@/shared/utils';
import { MY_RIDES_SCREEN } from '@/features/my-rides/constants';
import { useMyRides } from '@/features/my-rides/hooks';
import type { MyRidesTab } from '@/features/my-rides/types';
import { myRidesTokens, styles } from './MyRidesScreen.styles';

export const MyRidesScreen = () => {
  const {
    tab,
    setTab,
    avatarUri,
    upcomingRide,
    historyRides,
    openProfile,
    openNotifications,
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

  const handleTrack = useCallback(() => {
    triggerLightHaptic();
    trackRide();
  }, [trackRide]);

  const handleCancel = useCallback(() => {
    triggerLightHaptic();
    cancelRequest();
  }, [cancelRequest]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>{MY_RIDES_SCREEN.title}</Text>
          <View style={styles.modeBadge}>
            <Text style={styles.modeBadgeText}>{MY_RIDES_SCREEN.riderModeBadge}</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <Pressable
            style={({ pressed }) => [styles.notifyBtn, pressed && { opacity: 0.7 }]}
            onPress={openNotifications}
            accessibilityRole="button"
            accessibilityLabel="Open notifications"
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={myRidesTokens.ON_SURFACE_VARIANT}
            />
          </Pressable>
          <Pressable
            style={styles.avatarRing}
            onPress={openProfile}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Avatar uri={avatarUri} size={36} accessibilityLabel="Profile photo" />
          </Pressable>
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
          upcomingRide ? (
            <>
              <View style={styles.rideCard}>
                <View style={styles.cardBody}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.dateLabel}>{upcomingRide.dateLabel}</Text>
                      <Text style={styles.rideTitle}>{upcomingRide.title}</Text>
                      {upcomingRide.assured ? (
                        <View style={styles.assuredBadge}>
                          <Ionicons name="checkmark-circle" size={14} color="#0342D1" />
                          <Text style={styles.assuredText}>{MY_RIDES_SCREEN.assuredLabel}</Text>
                        </View>
                      ) : null}
                    </View>
                    <View style={styles.otpBox}>
                      <Text style={styles.otpLabel}>{MY_RIDES_SCREEN.otpLabel}</Text>
                      <Text style={styles.otpValue}>{upcomingRide.otp}</Text>
                    </View>
                  </View>

                  <View style={styles.mapRouteRow}>
                    <View style={styles.mapPreview}>
                      <Image
                        source={{ uri: upcomingRide.mapImageUri }}
                        style={styles.mapImage}
                        resizeMode="cover"
                        accessibilityLabel="Route map preview"
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.2)']}
                        style={styles.mapGradient}
                        pointerEvents="none"
                      />
                      <Pressable
                        style={({ pressed }) => [
                          styles.fullscreenBtn,
                          pressed && { transform: [{ scale: 0.94 }] },
                        ]}
                        onPress={handleTrack}
                        accessibilityRole="button"
                        accessibilityLabel="Open live map"
                      >
                        <Ionicons name="expand-outline" size={16} color="#0342D1" />
                      </Pressable>
                    </View>

                    <View style={styles.routeBlock}>
                      <View style={styles.routeLine} />
                      <View style={styles.stopRow}>
                        <View style={styles.stopDot}>
                          <View style={styles.stopDotInner} />
                        </View>
                        <Text style={styles.stopLabel}>{MY_RIDES_SCREEN.pickupLabel}</Text>
                        <Text style={styles.stopValue}>{upcomingRide.pickupLabel}</Text>
                      </View>
                      <View style={styles.stopRow}>
                        <View style={styles.stopDot}>
                          <Ionicons name="business" size={12} color="#0342D1" />
                        </View>
                        <Text style={styles.stopLabel}>{MY_RIDES_SCREEN.dropoffLabel}</Text>
                        <Text style={styles.stopValue}>{upcomingRide.dropoffLabel}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.driverSection}>
                    <View style={styles.driverRow}>
                      <View style={styles.driverAvatarRing}>
                        <Avatar
                          size={48}
                          uri={upcomingRide.driver.avatarUri}
                          accessibilityLabel={`${upcomingRide.driver.name} photo`}
                        />
                      </View>
                      <View style={styles.driverMeta}>
                        <View style={styles.driverNameRow}>
                          <Text style={styles.driverName}>{upcomingRide.driver.name}</Text>
                          {upcomingRide.driver.verified ? (
                            <View style={styles.verifiedBadge}>
                              <Ionicons name="checkmark-circle" size={12} color="#15803D" />
                              <Text style={styles.verifiedText}>
                                {MY_RIDES_SCREEN.verifiedLabel}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={styles.vehicleText}>
                          {upcomingRide.driver.vehicleLabel} • {upcomingRide.driver.plateNumber}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.actionRow}>
                      <Pressable
                        style={({ pressed }) => [
                          styles.cancelButton,
                          pressed && { transform: [{ scale: 0.97 }] },
                        ]}
                        onPress={handleCancel}
                        accessibilityRole="button"
                        accessibilityLabel={MY_RIDES_SCREEN.cancelLabel}
                      >
                        <Text style={styles.cancelLabel}>{MY_RIDES_SCREEN.cancelLabel}</Text>
                      </Pressable>
                      <Pressable
                        style={({ pressed }) => [
                          styles.trackButton,
                          pressed && { opacity: 0.92, transform: [{ scale: 0.97 }] },
                        ]}
                        onPress={handleTrack}
                        accessibilityRole="button"
                        accessibilityLabel={MY_RIDES_SCREEN.trackLabel}
                      >
                        <Ionicons name="navigate" size={16} color="#FFFFFF" />
                        <Text style={styles.trackLabel}>{MY_RIDES_SCREEN.trackLabel}</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.dashedPlaceholder} />
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={32} color="#747686" />
              <Text style={styles.emptyTitle}>{MY_RIDES_SCREEN.emptyUpcomingTitle}</Text>
              <Text style={styles.emptySubtitle}>{MY_RIDES_SCREEN.emptyUpcomingSubtitle}</Text>
            </View>
          )
        ) : historyRides.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={32} color="#747686" />
            <Text style={styles.emptyTitle}>{MY_RIDES_SCREEN.emptyPastTitle}</Text>
            <Text style={styles.emptySubtitle}>{MY_RIDES_SCREEN.emptyPastSubtitle}</Text>
          </View>
        ) : (
          <View style={styles.historyList}>
            {historyRides.map((ride) => (
              <View key={ride.id} style={styles.historyCard}>
                <View style={styles.historyTop}>
                  <Text style={styles.historyTitle}>{ride.title}</Text>
                  <Text style={styles.historyStatus}>{ride.statusLabel}</Text>
                </View>
                <Text style={styles.historyMeta}>{ride.routeLabel}</Text>
                <Text style={styles.historyMeta}>{ride.dateLabel}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
