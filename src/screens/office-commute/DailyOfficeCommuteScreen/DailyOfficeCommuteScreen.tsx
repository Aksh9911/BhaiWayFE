import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ROUTES } from '@/config';
import { BrandTopBar, AppFooter, IconButton, ScreenIntro } from '@/shared/components';
import { appModeStore } from '@/store';
import { myRidesSurfaceStore } from '@/features/my-rides/store';
import { CommuteOptionCard, VerificationBanner } from '@/features/office-commute/components';
import {
  OFFICE_COMMUTE_INTRO,
  OFFICE_COMMUTE_OPTIONS,
  VERIFICATION_BANNER,
  VERIFIED_BANNER,
} from '@/features/office-commute/constants';
import { corporateVerificationStore } from '@/features/office-commute/store';
import type { CommuteOption } from '@/features/office-commute/types';
import { styles } from './DailyOfficeCommuteScreen.styles';

export const DailyOfficeCommuteScreen = () => {
  const router = useRouter();
  const [isCorporateVerified, setIsCorporateVerified] = useState(() =>
    corporateVerificationStore.isVerified(),
  );

  useEffect(() => {
    myRidesSurfaceStore.setOfficeCommute();
    appModeStore.setRiding();
  }, []);

  useEffect(
    () =>
      corporateVerificationStore.subscribe((record) => {
        setIsCorporateVerified(record != null);
      }),
    [],
  );

  const handleMenuPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.home);
  }, [router]);

  const handleNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const handleOptionPress = useCallback(
    (option: CommuteOption) => {
      router.push(option.route);
    },
    [router],
  );

  const handleVerification = useCallback(() => {
    router.push(ROUTES.officeCommuteVerify);
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <BrandTopBar
        onMenuPress={handleMenuPress}
        right={
          <IconButton
            icon="notifications-outline"
            onPress={handleNotifications}
            accessibilityLabel="Notifications"
          />
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenIntro
          title={OFFICE_COMMUTE_INTRO.title}
          subtitle={OFFICE_COMMUTE_INTRO.subtitle}
        />

        {OFFICE_COMMUTE_OPTIONS.map((option) => (
          <CommuteOptionCard
            key={option.id}
            badge={option.badge}
            badgeVariant={option.badgeVariant}
            title={option.title}
            icon={option.icon}
            description={option.description}
            actionLabel={option.actionLabel}
            image={option.image}
            onPress={() => handleOptionPress(option)}
          />
        ))}

        {isCorporateVerified ? (
          <VerificationBanner
            title={VERIFIED_BANNER.title}
            description={VERIFIED_BANNER.description}
          />
        ) : (
          <VerificationBanner
            title={VERIFICATION_BANNER.title}
            description={VERIFICATION_BANNER.description}
            actionLabel={VERIFICATION_BANNER.actionLabel}
            onPress={handleVerification}
          />
        )}
      </ScrollView>

      <AppFooter />
    </SafeAreaView>
  );
};
