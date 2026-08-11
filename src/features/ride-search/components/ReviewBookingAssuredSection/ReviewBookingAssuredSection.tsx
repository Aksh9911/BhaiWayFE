import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { formatBookingAmount, REVIEW_BOOKING_SCREEN } from '../../constants';
import { styles } from './ReviewBookingAssuredSection.styles';
import { AppText as Text } from '@/shared/components';

export interface ReviewBookingAssuredSectionProps {
  fee: number;
}

export const ReviewBookingAssuredSection = React.memo(({ fee }: ReviewBookingAssuredSectionProps) => (
  <>
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
      </View>
      <View style={styles.meta}>
        <Text style={styles.title}>{REVIEW_BOOKING_SCREEN.assuredTitle}</Text>
        <Text style={styles.subtitle}>{REVIEW_BOOKING_SCREEN.assuredSubtitle}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{formatBookingAmount(fee)}</Text>
        <Text style={styles.selected}>{REVIEW_BOOKING_SCREEN.assuredSelected}</Text>
      </View>
    </View>
    <View style={styles.note}>
      <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
      <Text style={styles.noteText}>{REVIEW_BOOKING_SCREEN.assuredNote}</Text>
    </View>
  </>
));

ReviewBookingAssuredSection.displayName = 'ReviewBookingAssuredSection';
