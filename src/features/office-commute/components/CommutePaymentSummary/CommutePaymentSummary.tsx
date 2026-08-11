import React from 'react';
import { Pressable, View } from 'react-native';

import { colors } from '@/shared/theme';
import {
  COMMUTE_REVIEW_BOOKING_SCREEN,
  formatCommuteAmount,
} from '../../constants/commute-review-booking.constants';
import { styles } from './CommutePaymentSummary.styles';
import type { CommutePaymentSummaryProps } from './CommutePaymentSummary.types';
import { AppText as Text, AppTextInput as TextInput } from '@/shared/components';

export const CommutePaymentSummary = React.memo(
  ({
    fare,
    promoValue,
    promoApplied,
    onPromoChange,
    onApplyPromo,
    onPromoFocus,
    onPromoBlur,
  }: CommutePaymentSummaryProps) => (
    <View style={styles.section}>
      <Text style={styles.title}>{COMMUTE_REVIEW_BOOKING_SCREEN.paymentTitle}</Text>

      <View style={styles.promoWrap}>
        <TextInput
          style={styles.promoInput}
          value={promoValue}
          onChangeText={onPromoChange}
          onFocus={onPromoFocus}
          onBlur={onPromoBlur}
          placeholder={COMMUTE_REVIEW_BOOKING_SCREEN.promoPlaceholder}
          placeholderTextColor={colors.textPlaceholder}
          autoCapitalize="characters"
          accessibilityLabel="Promo code"
        />
        <Pressable
          style={({ pressed }) => [styles.applyButton, pressed && { opacity: 0.9 }]}
          onPress={onApplyPromo}
          accessibilityRole="button"
          accessibilityLabel={COMMUTE_REVIEW_BOOKING_SCREEN.applyLabel}
        >
          <Text style={styles.applyLabel}>{COMMUTE_REVIEW_BOOKING_SCREEN.applyLabel}</Text>
        </Pressable>
      </View>
      {promoApplied ? (
        <Text style={styles.promoSuccess}>{COMMUTE_REVIEW_BOOKING_SCREEN.promoSuccess}</Text>
      ) : null}

      <View style={styles.fareCard}>
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>{COMMUTE_REVIEW_BOOKING_SCREEN.baseFareLabel}</Text>
          <Text style={styles.fareValue}>{formatCommuteAmount(fare.baseFare)}</Text>
        </View>
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>{COMMUTE_REVIEW_BOOKING_SCREEN.platformFeeLabel}</Text>
          <Text style={styles.fareValue}>{formatCommuteAmount(fare.platformFee)}</Text>
        </View>
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>{COMMUTE_REVIEW_BOOKING_SCREEN.taxesLabel}</Text>
          <Text style={styles.fareValue}>{formatCommuteAmount(fare.taxes)}</Text>
        </View>
        {fare.promoDiscount > 0 ? (
          <View style={styles.fareRow}>
            <Text style={styles.fareLabel}>{COMMUTE_REVIEW_BOOKING_SCREEN.promoDiscountLabel}</Text>
            <Text style={[styles.fareValue, styles.discount]}>
              - {formatCommuteAmount(fare.promoDiscount)}
            </Text>
          </View>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.fareRow}>
          <Text style={styles.totalLabel}>{COMMUTE_REVIEW_BOOKING_SCREEN.totalLabel}</Text>
          <Text style={styles.totalValue}>{formatCommuteAmount(fare.total)}</Text>
        </View>
      </View>
    </View>
  ),
);

CommutePaymentSummary.displayName = 'CommutePaymentSummary';
