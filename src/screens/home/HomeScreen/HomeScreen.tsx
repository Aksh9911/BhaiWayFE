import React, { useCallback } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { APP_CONFIG, ROUTES } from '@/config';
import { ScreenIntro } from '@/shared/components';
import { colors, spacing } from '@/shared/theme';
import { appModeStore } from '@/store';
import { myRidesSurfaceStore } from '@/features/my-rides/store';
import {
  EmptyHomeState,
  HomeHeader,
  HomeLoader,
  ServiceCard,
} from '@/features/home/components';
import { HOME_SERVICE_CARD_ILLUSTRATIONS } from '@/features/home/constants';
import { useHome } from '@/features/home/hooks';
import type { ServiceCardData } from '@/features/home/types';
import { styles } from './HomeScreen.styles';

export const HomeScreen = () => {
  const router = useRouter();
  const {
    loading,
    refreshing,
    error,
    firstName,
    greetingSubtitle,
    location,
    serviceCards,
    refresh,
    retry,
  } = useHome();

  const handleNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const handleProfile = useCallback(() => {
    router.push(ROUTES.profile);
  }, [router]);

  const handleCardPress = useCallback(
    (data: ServiceCardData) => {
      if (data.variant === 'office') {
        myRidesSurfaceStore.setOfficeCommute();
        appModeStore.setRiding();
        router.push(ROUTES.officeCommute);
        return;
      }

      if (data.variant === 'publish') {
        myRidesSurfaceStore.setStandard();
        appModeStore.setDriving();
        router.push(ROUTES.offerRide);
        return;
      }

      myRidesSurfaceStore.setStandard();
      appModeStore.setRiding();
      router.push({
        pathname: ROUTES.rideSearch,
        params: { mode: data.variant },
      });
    },
    [router],
  );

  const showEmpty = !loading && !error && serviceCards.length === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <HomeHeader
        brandName={APP_CONFIG.name}
        location={location}
        onNotificationsPress={handleNotifications}
        onProfilePress={handleProfile}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <ScreenIntro
          title={`Hi, ${firstName}!`}
          subtitle={greetingSubtitle}
          variant="default"
          style={styles.intro}
        />

        {loading ? <HomeLoader /> : null}

        {error ? (
          <EmptyHomeState
            variant="error"
            title="Something went wrong"
            message={error}
            onRetry={retry}
          />
        ) : null}

        {showEmpty ? (
          <EmptyHomeState
            variant="empty"
            title="No services available"
            message="Please check back in a little while."
            onRetry={retry}
          />
        ) : null}

        {!loading && !error
          ? serviceCards.map((card, index) => (
              <ServiceCard
                key={card.id}
                data={card}
                index={index}
                illustration={HOME_SERVICE_CARD_ILLUSTRATIONS[card.variant]}
                onPress={handleCardPress}
              />
            ))
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};
