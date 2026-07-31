import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, Button, KeyboardAwareScrollView, ScreenHeader } from '@/shared/components';
import { getSearchParam } from '@/shared/utils';
import { PaymentMethodList } from '@/features/ride-search/components';
import { PAYMENT_SCREEN } from '@/features/ride-search/constants';
import { usePaymentOptions } from '@/features/ride-search/hooks';
import type { RideType } from '@/features/ride-search/types';
import { styles } from './PaymentOptionsScreen.styles';

const isRideType = (value: string): value is RideType =>
  value === 'regular' || value === 'assured';

export const PaymentOptionsScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideId?: string;
    rideType?: string;
    origin?: string;
    destination?: string;
    driverName?: string;
    carModel?: string;
    price?: string;
  }>();

  const rideTypeParam = getSearchParam(params.rideType);
  const rideType: RideType = isRideType(rideTypeParam) ? rideTypeParam : 'regular';
  const priceParam = Number(getSearchParam(params.price));

  const {
    selectedId,
    setSelectedId,
    continuePayment,
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
          title={PAYMENT_SCREEN.title}
          onBack={handleBack}
          right={<View style={{ width: 40 }} />}
        />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        footer={
          <View style={styles.footer}>
            <Button
              label={PAYMENT_SCREEN.continueLabel}
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
          onAddUpi={onAddUpi}
          onAddCard={onAddCard}
          onSeeAllBanks={onSeeAllBanks}
        />

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color="#5C5F61" />
          <Text style={styles.secureText}>{PAYMENT_SCREEN.secureLabel}</Text>
        </View>
      </KeyboardAwareScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
