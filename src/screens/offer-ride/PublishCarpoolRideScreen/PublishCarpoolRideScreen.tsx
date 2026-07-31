import React, { useCallback } from 'react';
import { Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '@/config';
import { AppFooter, ScreenHeader, ScreenIntro } from '@/shared/components';
import { IncentiveBanner, RideTypeCard } from '@/features/offer-ride/components';
import {
  OUTSTATION_HERO_IMAGE,
  OUTSTATION_INCENTIVE,
  OUTSTATION_RIDE_INTRO,
  OUTSTATION_RIDE_SCREEN,
  OUTSTATION_RIDE_TYPES,
  getPublishRidePath,
} from '@/features/offer-ride/constants';
import type { OutstationRideTypeOption } from '@/features/offer-ride/types';
import { styles } from './PublishCarpoolRideScreen.styles';

export const PublishCarpoolRideScreen = () => {
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.home);
  }, [router]);

  const handleProfilePress = useCallback(() => {
    router.push(ROUTES.profile);
  }, [router]);

  const handleSelect = useCallback(
    (option: OutstationRideTypeOption) => {
      router.push(getPublishRidePath(option.id));
    },
    [router],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScreenHeader
        title={OUTSTATION_RIDE_SCREEN.title}
        onBack={handleBack}
        onProfilePress={handleProfilePress}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenIntro
          title={OUTSTATION_RIDE_INTRO.title}
          subtitle={OUTSTATION_RIDE_INTRO.subtitle}
          variant="default"
          style={styles.intro}
        />

        {OUTSTATION_RIDE_TYPES.map((option) => (
          <RideTypeCard
            key={option.id}
            title={option.title}
            icon={option.icon}
            iconVariant={option.iconVariant}
            description={option.description}
            buttonLabel={option.buttonLabel}
            buttonVariant={option.buttonVariant}
            highlighted={option.highlighted}
            badge={option.badge}
            note={option.note}
            onSelect={() => handleSelect(option)}
          />
        ))}

        <IncentiveBanner message={OUTSTATION_INCENTIVE.message} />

        <Image
          source={OUTSTATION_HERO_IMAGE}
          style={styles.heroImage}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
          accessibilityLabel="Highway illustration"
        />
      </ScrollView>

      <AppFooter />
    </SafeAreaView>
  );
};
