import { useCallback } from 'react';
import { Alert, FlatList, ListRenderItem, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { ROUTES } from '@/config';
import { AppFooter } from '@/shared/components';
import { getSearchParam } from '@/shared/utils';
import {
  EmptyRideResults,
  ResultFilterChips,
  RideResultCard,
  RideResultSkeleton,
  RideSearchTopBar,
  SearchSummaryCard,
} from '@/features/ride-search/components';
import { getReviewBookingPath, RIDE_RESULT_SCREEN } from '@/features/ride-search/constants';
import { useRideResult } from '@/features/ride-search/hooks';
import type { RideResultItem } from '@/features/ride-search/types';
import { styles } from './RideResultScreen.styles';

export const RideResultScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    origin?: string;
    destination?: string;
    dateLabel?: string;
    passengers?: string;
    originLat?: string;
    originLng?: string;
    destinationLat?: string;
    destinationLng?: string;
  }>();

  const originLat = Number(getSearchParam(params.originLat));
  const originLng = Number(getSearchParam(params.originLng));
  const destinationLat = Number(getSearchParam(params.destinationLat));
  const destinationLng = Number(getSearchParam(params.destinationLng));

  const {
    summary,
    rides,
    totalCount,
    loading,
    refreshing,
    activeFilter,
    setActiveFilter,
    refresh,
  } = useRideResult({
    origin: getSearchParam(params.origin),
    destination: getSearchParam(params.destination),
    dateLabel: getSearchParam(params.dateLabel),
    passengers: getSearchParam(params.passengers),
  });

  const handleMenuPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.home);
  }, [router]);

  const handleProfilePress = useCallback(() => {
    router.push(ROUTES.profile);
  }, [router]);

  const handleModifySearch = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  const handleRidePress = useCallback((ride: RideResultItem) => {
    Alert.alert(
      'Ride Details',
      `${ride.driver.name} · ${ride.carModel}\n${ride.departureTime} · ₹${ride.price.toLocaleString('en-IN')}`,
    );
  }, []);

  const handleBookPress = useCallback(
    (ride: RideResultItem) => {
      router.push(
        getReviewBookingPath({
          rideId: ride.id,
          rideType: ride.rideType,
          origin: summary.originCity,
          destination: summary.destinationCity,
          driverName: ride.driver.name,
          carModel: ride.carModel,
          price: ride.price,
          originLat: Number.isFinite(originLat) ? originLat : undefined,
          originLng: Number.isFinite(originLng) ? originLng : undefined,
          destinationLat: Number.isFinite(destinationLat) ? destinationLat : undefined,
          destinationLng: Number.isFinite(destinationLng) ? destinationLng : undefined,
        }),
      );
    },
    [
      destinationLat,
      destinationLng,
      originLat,
      originLng,
      router,
      summary.destinationCity,
      summary.originCity,
    ],
  );

  const renderItem = useCallback<ListRenderItem<RideResultItem>>(
    ({ item, index }) => (
      <Animated.View entering={FadeInUp.duration(320).delay(Math.min(index * 60, 240))}>
        <RideResultCard
          ride={item}
          onPress={handleRidePress}
          onBookPress={handleBookPress}
        />
      </Animated.View>
    ),
    [handleBookPress, handleRidePress],
  );

  const keyExtractor = useCallback((item: RideResultItem) => item.id, []);

  const listHeader = (
    <Animated.View entering={FadeInDown.duration(350)} style={styles.headerBlock}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{RIDE_RESULT_SCREEN.title}</Text>
        {!loading ? (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{totalCount} Found</Text>
          </View>
        ) : null}
      </View>

      <SearchSummaryCard summary={summary} />

      <ResultFilterChips selectedId={activeFilter} onSelect={setActiveFilter} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <RideSearchTopBar onMenuPress={handleMenuPress} onProfilePress={handleProfilePress} />

      {loading ? (
        <View style={styles.listContent}>
          {listHeader}
          <RideResultSkeleton />
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <EmptyRideResults onModifySearch={handleModifySearch} onRefresh={refresh} />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refresh}
          initialNumToRender={4}
          windowSize={7}
          removeClippedSubviews
          accessibilityLabel="Available rides list"
        />
      )}

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
