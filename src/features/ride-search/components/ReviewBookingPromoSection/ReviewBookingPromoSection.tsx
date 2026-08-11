import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { formatBookingAmount, REVIEW_BOOKING_SCREEN } from '../../constants';
import { styles } from './ReviewBookingPromoSection.styles';
import { AppText as Text, AppTextInput as TextInput } from '@/shared/components';

export interface ReviewBookingPromoSectionProps {
  value: string;
  applied: boolean;
  discount: number;
  onChange: (value: string) => void;
  onApply: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const ReviewBookingPromoSection = React.memo(
  ({ value, applied, discount, onChange, onApply, onFocus, onBlur }: ReviewBookingPromoSectionProps) => (
    <View style={styles.card}>
      <Text style={styles.title}>{REVIEW_BOOKING_SCREEN.promoTitle}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={REVIEW_BOOKING_SCREEN.promoPlaceholder}
          placeholderTextColor={colors.textPlaceholder}
          autoCapitalize="characters"
          accessibilityLabel="Promo code input"
        />
        <Pressable
          style={styles.applyButton}
          onPress={onApply}
          accessibilityRole="button"
          accessibilityLabel="Apply promo code"
          android_ripple={{ color: 'rgba(255, 255, 255, 0.25)' }}
        >
          <Text style={styles.applyLabel}>{REVIEW_BOOKING_SCREEN.applyLabel}</Text>
        </Pressable>
      </View>
      {applied ? (
        <View style={styles.successRow}>
          <View style={styles.successLeft}>
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
            <Text style={styles.successText}>{REVIEW_BOOKING_SCREEN.promoSuccess}</Text>
          </View>
          <Text style={styles.discount}>- {formatBookingAmount(discount)}</Text>
        </View>
      ) : null}
    </View>
  ),
);

ReviewBookingPromoSection.displayName = 'ReviewBookingPromoSection';
