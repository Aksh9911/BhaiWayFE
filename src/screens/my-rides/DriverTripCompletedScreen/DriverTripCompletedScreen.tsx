import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, type Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_CONFIG } from '@/config';
import { AppFooter, Avatar, IconButton } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';
import { getSearchParam, triggerLightHaptic } from '@/shared/utils';
import { DRIVER_TRIP_COMPLETED_SCREEN } from '@/features/my-rides/constants';
import { useDriverTripCompleted } from '@/features/my-rides/hooks';
import type { DriverTripCompletedCoordinate } from '@/features/my-rides/types';
import { styles } from './DriverTripCompletedScreen.styles';

const EDGE_PADDING = {
  top: spacing.xl,
  right: spacing.xl,
  bottom: spacing.xl,
  left: spacing.xl,
};

const buildRegion = (coordinates: DriverTripCompletedCoordinate[]): Region => {
  const lats = coordinates.map((c) => c.latitude);
  const lngs = coordinates.map((c) => c.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.7, 0.05),
    longitudeDelta: Math.max((maxLng - minLng) * 1.7, 0.05),
  };
};

export const DriverTripCompletedScreen = () => {
  const params = useLocalSearchParams<{ destination?: string }>();
  const destination = getSearchParam(params.destination);

  const { trip, routeCoordinates, finishTrip, openNotifications } = useDriverTripCompleted({
    destination: destination || undefined,
  });

  const mapRef = useRef<MapView>(null);

  const polyline = useMemo(() => {
    if (routeCoordinates.length >= 2) {
      return routeCoordinates;
    }
    return [trip.pickup, trip.dropoff];
  }, [routeCoordinates, trip.dropoff, trip.pickup]);

  const initialRegion = useMemo(() => buildRegion(polyline), [polyline]);

  const fitRoute = useCallback(() => {
    mapRef.current?.fitToCoordinates(polyline, {
      edgePadding: EDGE_PADDING,
      animated: false,
    });
  }, [polyline]);

  useEffect(() => {
    fitRoute();
  }, [fitRoute]);

  const handleDone = useCallback(() => {
    triggerLightHaptic();
    finishTrip();
  }, [finishTrip]);

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
          color="#434655"
          accessibilityLabel="Open notifications"
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Text style={styles.heading}>{DRIVER_TRIP_COMPLETED_SCREEN.heading}</Text>
          <Text style={styles.subtitle}>{DRIVER_TRIP_COMPLETED_SCREEN.subtitle}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.summaryLabel}>{DRIVER_TRIP_COMPLETED_SCREEN.summaryLabel}</Text>
              <Text style={styles.summaryDate}>{trip.dateLabel}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{trip.statusLabel}</Text>
            </View>
          </View>

          <View style={styles.timeline}>
            <View style={styles.timelineTrack} />
            <View style={styles.timelineRow}>
              <View style={styles.timelineDotPrimary}>
                <Ionicons name="location" size={12} color={colors.white} />
              </View>
              <View style={styles.locationMeta}>
                <Text style={styles.locationLabel}>
                  {DRIVER_TRIP_COMPLETED_SCREEN.pickupLabel}
                </Text>
                <Text style={styles.locationTitle}>{trip.pickupTitle}</Text>
                <Text style={styles.locationAddress}>{trip.pickupAddress}</Text>
              </View>
            </View>
            <View style={styles.timelineRow}>
              <View style={styles.timelineDotSecondary}>
                <Ionicons name="flag" size={12} color={colors.white} />
              </View>
              <View style={styles.locationMeta}>
                <Text style={styles.locationLabel}>
                  {DRIVER_TRIP_COMPLETED_SCREEN.destinationLabel}
                </Text>
                <Text style={styles.locationTitle}>{trip.dropoffTitle}</Text>
                <Text style={styles.locationAddress}>{trip.dropoffAddress}</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryFooter}>
            <View style={styles.ridersBlock}>
              <Text style={styles.ridersLabel}>{DRIVER_TRIP_COMPLETED_SCREEN.ridersLabel}</Text>
              {trip.passengers.map((passenger) => (
                <View key={passenger.id} style={styles.riderRow}>
                  <Avatar
                    size={36}
                    uri={passenger.avatarUri}
                    accessibilityLabel={`${passenger.name} photo`}
                  />
                  <Text style={styles.riderName}>{passenger.name}</Text>
                  <Text style={styles.riderFare}>{passenger.fareLabel}</Text>
                </View>
              ))}
            </View>
            <View style={styles.amountBlock}>
              <Text style={styles.amountLabel}>{DRIVER_TRIP_COMPLETED_SCREEN.earningsLabel}</Text>
              <Text style={styles.amountValue}>{trip.earningsLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.mapCard}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            onMapReady={fitRoute}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
            showsCompass={false}
            liteMode={Platform.OS === 'android'}
            pointerEvents="none"
          >
            <Marker coordinate={trip.pickup} pinColor={colors.primary} tracksViewChanges={false} />
            <Marker coordinate={trip.dropoff} pinColor="#585E72" tracksViewChanges={false} />
            <Polyline coordinates={polyline} strokeColor="#0342D1" strokeWidth={4} />
          </MapView>
          <View style={styles.mapTint} pointerEvents="none" />
          <View style={styles.distanceBadge}>
            <Ionicons name="navigate-outline" size={18} color={colors.primary} />
            <Text style={styles.distanceText}>{trip.distanceLabel}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.earningsTitle}>{DRIVER_TRIP_COMPLETED_SCREEN.earningsTitle}</Text>

          <View style={styles.fareList}>
            {trip.fareLines.map((line) => (
              <View key={line.label} style={styles.fareRow}>
                <Text style={styles.fareLabel}>{line.label}</Text>
                <Text style={styles.fareValue}>{line.amountLabel}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{DRIVER_TRIP_COMPLETED_SCREEN.totalLabel}</Text>
              <Text style={styles.totalValue}>{trip.earningsLabel}</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.doneButton,
              pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleDone}
            accessibilityRole="button"
            accessibilityLabel={DRIVER_TRIP_COMPLETED_SCREEN.doneCta}
          >
            <Text style={styles.doneLabel}>{DRIVER_TRIP_COMPLETED_SCREEN.doneCta}</Text>
          </Pressable>

          <View style={styles.noteRow}>
            <Ionicons name="wallet-outline" size={14} color="#434655" />
            <Text style={styles.noteText}>{DRIVER_TRIP_COMPLETED_SCREEN.walletNote}</Text>
          </View>
        </View>
      </ScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
