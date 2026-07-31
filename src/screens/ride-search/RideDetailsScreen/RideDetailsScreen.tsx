import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '@/config';
import { AppFooter, IconButton } from '@/shared/components';
import { getSearchParam, triggerLightHaptic } from '@/shared/utils';
import {
  RideDetailsCoPassengers,
  RideDetailsDriverCard,
  RideDetailsFareCard,
  RideDetailsRouteCard,
  RideDetailsScheduleCard,
} from '@/features/ride-search/components';
import { RIDE_DETAILS_SCREEN } from '@/features/ride-search/constants';
import { useRideDetails } from '@/features/ride-search/hooks';
import type { RideType } from '@/features/ride-search/types';
import { styles } from './RideDetailsScreen.styles';

const isRideType = (value: string): value is RideType =>
  value === 'regular' || value === 'assured';

export const RideDetailsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideId?: string;
    rideType?: string;
    origin?: string;
    destination?: string;
    driverName?: string;
    carModel?: string;
    price?: string;
    originLat?: string;
    originLng?: string;
    destinationLat?: string;
    destinationLng?: string;
  }>();

  const rideTypeParam = getSearchParam(params.rideType);
  const rideType: RideType = isRideType(rideTypeParam) ? rideTypeParam : 'regular';
  const priceParam = Number(getSearchParam(params.price));
  const originLat = Number(getSearchParam(params.originLat));
  const originLng = Number(getSearchParam(params.originLng));
  const destinationLat = Number(getSearchParam(params.destinationLat));
  const destinationLng = Number(getSearchParam(params.destinationLng));

  const { details, routeCoordinates, cancelRide, chatPassenger, openMore } = useRideDetails({
    rideId: getSearchParam(params.rideId) || 'ride-default',
    rideType,
    origin: getSearchParam(params.origin),
    destination: getSearchParam(params.destination),
    driverName: getSearchParam(params.driverName),
    carModel: getSearchParam(params.carModel),
    price: Number.isFinite(priceParam) ? priceParam : undefined,
    originLat: Number.isFinite(originLat) ? originLat : undefined,
    originLng: Number.isFinite(originLng) ? originLng : undefined,
    destinationLat: Number.isFinite(destinationLat) ? destinationLat : undefined,
    destinationLng: Number.isFinite(destinationLng) ? destinationLng : undefined,
  });

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.rideSearchBooked);
  }, [router]);

  const handleCancel = useCallback(() => {
    triggerLightHaptic();
    cancelRide();
  }, [cancelRide]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-back"
            onPress={handleBack}
            color="#191C1D"
            accessibilityLabel="Go back"
          />
          <Text style={styles.headerTitle}>{RIDE_DETAILS_SCREEN.title}</Text>
        </View>
        <IconButton
          icon="ellipsis-vertical"
          onPress={openMore}
          color="#191C1D"
          accessibilityLabel="More options"
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RideDetailsScheduleCard dateTimeLabel={details.dateTimeLabel} />

        <RideDetailsRouteCard
          pickup={details.pickup}
          dropoff={details.dropoff}
          routeCoordinates={routeCoordinates}
        />

        <RideDetailsDriverCard driver={details.driver} />

        <RideDetailsCoPassengers
          passengers={details.coPassengers}
          maxPassengers={details.maxPassengers}
          seatsLeft={details.seatsLeft}
          onChat={chatPassenger}
        />

        <RideDetailsFareCard fare={details.fare} />

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              pressed && { backgroundColor: 'rgba(186, 26, 26, 0.05)', transform: [{ scale: 0.98 }] },
            ]}
            onPress={handleCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel ride"
          >
            <Text style={styles.cancelLabel}>{RIDE_DETAILS_SCREEN.cancelLabel}</Text>
          </Pressable>
        </View>
      </ScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
