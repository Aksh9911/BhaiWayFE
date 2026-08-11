import React from 'react';
import { View } from 'react-native';

import { styles } from './SectionHeader.styles';
import type { SectionHeaderProps } from './SectionHeader.types';
import { AppText as Text } from '../AppText';

export const SectionHeader = React.memo(
  ({
    title,
    showAccent = true,
    accentColor,
    style,
    titleStyle,
  }: SectionHeaderProps) => (
    <View style={[styles.row, style]} accessibilityRole="header">
      {showAccent ? (
        <View style={[styles.accent, accentColor ? { backgroundColor: accentColor } : null]} />
      ) : null}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
    </View>
  ),
);

SectionHeader.displayName = 'SectionHeader';
