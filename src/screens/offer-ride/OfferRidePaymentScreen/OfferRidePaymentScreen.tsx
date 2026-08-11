import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AppFooter,
  Button,
  KeyboardAwareScrollView,
  ScreenHeader,
  AppText as Text,
} from '@/shared/components';
import { colors } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { PaymentMethodList } from '@/features/ride-search/components';
import { OFFER_RIDE_PAYMENT_SCREEN } from '@/features/offer-ride/constants';
import { useOfferRidePayment } from '@/features/offer-ride/hooks';
import { styles } from './OfferRidePaymentScreen.styles';

export const OfferRidePaymentScreen = () => {
  const {
    selectedId,
    setSelectedId,
    confirmAndPublish,
    onAddCoins,
    onAddUpi,
    onAddCard,
    onSeeAllBanks,
    goBack,
  } = useOfferRidePayment();

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader
          title={OFFER_RIDE_PAYMENT_SCREEN.title}
          onBack={handleBack}
          right={<View style={{ width: 40 }} />}
        />
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        footer={
          <View style={styles.footer}>
            <Button
              label={OFFER_RIDE_PAYMENT_SCREEN.continueLabel}
              onPress={confirmAndPublish}
              showArrow
              accessibilityLabel={OFFER_RIDE_PAYMENT_SCREEN.continueLabel}
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
          showPayAfterRide={false}
        />

        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.secureText}>{OFFER_RIDE_PAYMENT_SCREEN.secureLabel}</Text>
        </View>
      </KeyboardAwareScrollView>

      <AppFooter />
    </SafeAreaView>
  );
};
