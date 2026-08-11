import React from 'react';
import { View } from 'react-native';

import { styles } from './ScreenIntro.styles';
import type { ScreenIntroProps } from './ScreenIntro.types';
import { AppText as Text } from '../AppText';

export const ScreenIntro = ({
  title,
  subtitle,
  variant = 'large',
  align = 'left',
  style,
  titleAccessibilityRole = 'header',
}: ScreenIntroProps) => {
  const centered = align === 'center';

  return (
    <View style={[styles.wrapper, centered && styles.centered, style]}>
      <Text
        style={[
          styles.title,
          variant === 'large' ? styles.titleLarge : styles.titleDefault,
          centered && styles.titleCentered,
        ]}
        accessibilityRole={titleAccessibilityRole}
      >
        {title}
      </Text>
      {subtitle ? (
        <Text style={[styles.subtitle, centered && styles.subtitleCentered]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};
