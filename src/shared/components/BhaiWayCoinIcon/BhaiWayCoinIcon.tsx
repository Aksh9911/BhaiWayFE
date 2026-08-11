import React from 'react';
import { Image, type ImageStyle, type StyleProp, View, type ViewStyle } from 'react-native';

import { BHAIWAY_COIN_IMAGE, BHAIWAY_COIN_NAME } from '@/shared/utils';
import { styles } from './BhaiWayCoinIcon.styles';

export interface BhaiWayCoinIconProps {
  size?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}

export const BhaiWayCoinIcon = ({ size = 18, style, imageStyle }: BhaiWayCoinIconProps) => (
  <View style={[styles.wrap, { width: size, height: size }, style]}>
    <Image
      source={BHAIWAY_COIN_IMAGE}
      style={[styles.image, { width: size, height: size }, imageStyle]}
      resizeMode="contain"
      accessibilityIgnoresInvertColors
      accessibilityLabel={BHAIWAY_COIN_NAME}
    />
  </View>
);

BhaiWayCoinIcon.displayName = 'BhaiWayCoinIcon';
