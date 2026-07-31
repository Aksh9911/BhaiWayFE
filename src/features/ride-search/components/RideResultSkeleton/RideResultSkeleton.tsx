import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { styles } from './RideResultSkeleton.styles';

const SkeletonCard = () => {
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 750, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, shimmerStyle]}>
      <View style={styles.row}>
        <View style={styles.avatar} />
        <View style={styles.lineGroup}>
          <View style={[styles.line, styles.lineMedium]} />
          <View style={[styles.line, styles.lineShort]} />
        </View>
        <View style={styles.priceBlock} />
      </View>
      <View style={styles.infoBox} />
      <View style={styles.footer}>
        <View style={styles.seatLine} />
        <View style={styles.button} />
      </View>
    </Animated.View>
  );
};

export const RideResultSkeleton = React.memo(() => (
  <View style={{ gap: 16 }}>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </View>
));

RideResultSkeleton.displayName = 'RideResultSkeleton';
