import React from 'react';
import { View } from 'react-native';

import { styles } from './AppTopBar.styles';
import type { AppTopBarProps } from './AppTopBar.types';

export const AppTopBar = ({ left, center, right, style }: AppTopBarProps) => (
  <View style={[styles.container, style]}>
    <View style={center ? styles.slot : styles.slotWide}>{left ?? null}</View>
    {center ? <View style={styles.center}>{center}</View> : null}
    <View style={styles.slot}>{right ?? null}</View>
  </View>
);
