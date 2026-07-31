import React, { useCallback } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { AppFooter } from '@/shared/components';
import { getSearchParam } from '@/shared/utils';
import { RideSearchTopBar } from '@/features/ride-search/components';
import {
  CommuteRideResultCard,
  CommuteSearchSummaryCard,
} from '@/features/office-commute/components';
import { COMMUTE_RIDE_RESULT_SCREEN } from '@/features/office-commute/constants';
import { useCommuteRideResult } from '@/features/office-commute/hooks';
import type { CommuteRideResultItem } from '@/features/office-commute/types';
import { styles } from './CommuteRideResultScreen.styles';

export const CommuteRideResultScreen = () => {
  const params = useLocalSearchParams<{
    origin?: string;
    destination?: string;
    dateLabel?: string;
    timeLabel?: string;
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
    loading,
    refreshing,
    requestStates,
    refresh,
    editSearch,
    requestToJoin,
    goBack,
    openProfile,
  } = useCommuteRideResult({
    origin: getSearchParam(params.origin),
    destination: getSearchParam(params.destination),
    dateLabel: getSearchParam(params.dateLabel),
    timeLabel: getSearchParam(params.timeLabel),
    originLat: Number.isFinite(originLat) ? originLat : undefined,
    originLng: Number.isFinite(originLng) ? originLng : undefined,
    destinationLat: Number.isFinite(destinationLat) ? destinationLat : undefined,
    destinationLng: Number.isFinite(destinationLng) ? destinationLng : undefined,
  });

  const handleRidePress = useCallback((_ride: CommuteRideResultItem) => {
    // Details can be added later; card CTA is the primary action.
  }, []);

  const renderItem = useCallback<ListRenderItem<CommuteRideResultItem>>(
    ({ item, index }) => (
      <Animated.View entering={FadeInUp.duration(320).delay(Math.min(index * 60, 240))}>
        <CommuteRideResultCard
          ride={item}
          requestState={requestStates[item.id] ?? 'idle'}
          onPress={handleRidePress}
          onRequestPress={requestToJoin}
        />
      </Animated.View>
    ),
    [handleRidePress, requestStates, requestToJoin],
  );

  const keyExtractor = useCallback((item: CommuteRideResultItem) => item.id, []);

  const listHeader = (
    <Animated.View entering={FadeInDown.duration(350)} style={styles.headerBlock}>
      <CommuteSearchSummaryCard summary={summary} onEdit={editSearch} />
      <Text style={styles.title}>{COMMUTE_RIDE_RESULT_SCREEN.title}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <RideSearchTopBar onMenuPress={goBack} onProfilePress={openProfile} />

      {loading ? (
        <View style={styles.listContent}>
          {listHeader}
          <View style={styles.skeletonStack}>
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
          </View>
        </View>
      ) : (
        <FlatList
          data={[...rides]}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>{COMMUTE_RIDE_RESULT_SCREEN.emptyTitle}</Text>
              <Text style={styles.emptySubtitle}>{COMMUTE_RIDE_RESULT_SCREEN.emptySubtitle}</Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refresh}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          accessibilityLabel="Available commute rides"
        />
      )}

      <AppFooter />
    </SafeAreaView>
  );
};
