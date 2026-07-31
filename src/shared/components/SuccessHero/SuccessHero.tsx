import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/shared/theme';
import { styles } from './SuccessHero.styles';
import type { SuccessHeroProps } from './SuccessHero.types';

export const SuccessHero = React.memo(
  ({ title, subtitle, iconSize = 56, style, children }: SuccessHeroProps) => {
    const checkScale = useSharedValue(0.85);
    const checkOpacity = useSharedValue(0);

    useEffect(() => {
      checkOpacity.value = withTiming(1, { duration: 260 });
      checkScale.value = withSequence(
        withSpring(1.04, { damping: 14, stiffness: 200 }),
        withSpring(1, { damping: 16, stiffness: 220 }),
      );
    }, [checkOpacity, checkScale]);

    const checkAnimatedStyle = useAnimatedStyle(() => ({
      opacity: checkOpacity.value,
      transform: [{ scale: checkScale.value }],
    }));

    return (
      <View style={[styles.container, style]}>
        <View style={styles.iconWrap}>
          <View style={styles.glowOuter}>
            <View style={styles.glowInner}>
              <Animated.View style={[styles.successCircle, checkAnimatedStyle]}>
                <Ionicons name="checkmark" size={iconSize} color={colors.white} />
              </Animated.View>
            </View>
          </View>
        </View>

        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </View>
    );
  },
);

SuccessHero.displayName = 'SuccessHero';
