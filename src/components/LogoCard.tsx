import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { colors, layout } from '../theme';

const logoSource = require('../assets/logo.png');

type LogoCardProps = {
  scale: SharedValue<number>;
};

export default function LogoCard({ scale }: LogoCardProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[styles.card, animatedStyle]}
      accessibilityLabel="BhaiWay logo"
      accessibilityRole="image"
    >
      <Image
        source={logoSource}
        style={styles.logo}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: layout.logoCardSize,
    height: layout.logoCardSize,
    borderRadius: layout.logoCardRadius,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  logo: {
    width: layout.logoSize,
    height: layout.logoSize,
  },
});
