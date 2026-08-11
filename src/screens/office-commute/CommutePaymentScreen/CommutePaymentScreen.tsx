import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, Button, KeyboardAwareScrollView, ScreenHeader, AppText as Text } from '@/shared/components';
import { getSearchParam } from '@/shared/utils';
import { PaymentMethodList } from '@/features/ride-search/components';
import { usePaymentOptions } from '@/features/ride-search/hooks';
import type { RideType } from '@/features/ride-search/types';
import { COMMUTE_PAYMENT_SCREEN } from '@/features/office-commute/constants';
import { styles } from './CommutePaymentScreen.styles';

const isRideType = (value: string): value is RideType =>
  value === 'regular' || value === 'assured';

export const CommutePaymentScreen = () => {
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

  const {
    selectedId,
    setSelectedId,
    continuePayment,
    onAddCoins,
    onAddUpi,
    onAddCard,
    onSeeAllBanks,
  } = usePaymentOptions({
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
    successPath: '/office-commute/booked',
  });

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    }
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={COMMUTE_PAYMENT_SCREEN.title}
          onBack={handleBack}
          right={<View style={{ width: 40 }} />}
        />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        footer={
          <View style={styles.footer}>
            <Button
              label={COMMUTE_PAYMENT_SCREEN.continueLabel}
              onPress={continuePayment}
              showArrow
              accessibilityLabel="Continue to booking confirmation"
            />
          </View>
        }
      >
        <PaymentMethodList
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCoins={onAddCoins}
          onAddUpi={onAddUpi}
          onAddCard={onAddCard}
          onSeeAllBanks={onSeeAllBanks}
          showPayAfterRide
        />

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#5C5F61" />
          <Text style={styles.secureText}>{COMMUTE_PAYMENT_SCREEN.secureLabel}</Text>
        </View>
      </KeyboardAwareScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
