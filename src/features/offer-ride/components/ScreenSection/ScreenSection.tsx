import React from 'react';
import { View } from 'react-native';

import { AppText as Text } from '@/shared/components';
import { styles } from './ScreenSection.styles';
import type { ScreenSectionProps } from './ScreenSection.types';

/** Lightweight titled block used across publish / preferences flows. */
export const ScreenSection = ({
  title,
  headerRight,
  children,
  style,
}: ScreenSectionProps) => (
  <View style={[styles.section, style]}>
    {title || headerRight ? (
      <View style={styles.header}>
        {title ? <Text style={styles.title}>{title}</Text> : <View />}
        {headerRight}
      </View>
    ) : null}
    {children}
  </View>
);
