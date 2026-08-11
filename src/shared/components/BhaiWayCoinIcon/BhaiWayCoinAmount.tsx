import React from 'react';
import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { AppText as Text } from '@/shared/components/AppText';
import {
  BHAIWAY_COIN_NAME,
  formatBhaiWayCoins,
  formatSignedBhaiWayCoins,
} from '@/shared/utils';
import { BhaiWayCoinIcon } from './BhaiWayCoinIcon';
import { styles } from './BhaiWayCoinAmount.styles';

export interface BhaiWayCoinAmountProps {
  amount: number;
  size?: number;
  signed?: boolean;
  sign?: '+' | '-';
  minimumFractionDigits?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconPosition?: 'left' | 'right';
  accessibilityLabel?: string;
}

export const BhaiWayCoinAmount = ({
  amount,
  size = 18,
  signed = false,
  sign,
  minimumFractionDigits,
  style,
  textStyle,
  iconPosition = 'left',
  accessibilityLabel,
}: BhaiWayCoinAmountProps) => {
  const label = signed
    ? formatSignedBhaiWayCoins(amount, { sign, minimumFractionDigits })
    : formatBhaiWayCoins(amount, { minimumFractionDigits });

  const icon = <BhaiWayCoinIcon size={size} />;
  const value = <Text style={[styles.amount, textStyle]}>{label}</Text>;

  return (
    <View
      style={[styles.row, style]}
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? `${label} ${BHAIWAY_COIN_NAME}`}
    >
      {iconPosition === 'left' ? (
        <>
          {icon}
          {value}
        </>
      ) : (
        <>
          {value}
          {icon}
        </>
      )}
    </View>
  );
};

BhaiWayCoinAmount.displayName = 'BhaiWayCoinAmount';
