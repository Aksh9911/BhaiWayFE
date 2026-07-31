import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { ACCOUNT_DELETED_SCREEN } from '@/features/profile/constants';
import { useAccountDeleted } from '@/features/profile/hooks';
import { accountDeletedTokens, styles } from './AccountDeletedScreen.styles';

export const AccountDeletedScreen = () => {
  const { goHome } = useAccountDeleted();

  const floatY = useSharedValue(0);
  const waveRotate = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(withTiming(-8, { duration: 900 }), withTiming(0, { duration: 900 })),
      -1,
      false,
    );
    waveRotate.value = withRepeat(
      withSequence(withTiming(18, { duration: 500 }), withTiming(0, { duration: 500 })),
      -1,
      false,
    );
  }, [floatY, waveRotate]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${12 + waveRotate.value}deg` }],
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.blobTop} pointerEvents="none" />
      <View style={styles.blobBottom} pointerEvents="none" />

      <View style={styles.header}>
        <Text style={styles.brand} accessibilityRole="header">
          {ACCOUNT_DELETED_SCREEN.brand}
        </Text>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.visualWrap}>
          <View style={styles.glow} />
          <Animated.View style={[styles.checkCircle, floatStyle]}>
            <Ionicons name="checkmark-circle" size={56} color={accountDeletedTokens.ON_PRIMARY_CONTAINER} />
          </Animated.View>

          <Animated.View style={[styles.waveBadge, waveStyle]}>
            <Ionicons
              name="hand-left-outline"
              size={22}
              color={accountDeletedTokens.ON_SECONDARY_CONTAINER}
            />
          </Animated.View>

          <View style={styles.cloudBadge}>
            <Ionicons name="cloud-offline-outline" size={18} color={accountDeletedTokens.OUTLINE} />
          </View>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>{ACCOUNT_DELETED_SCREEN.title}</Text>
          <Text style={styles.bodyText}>
            {ACCOUNT_DELETED_SCREEN.bodyPrefix}
            <Text style={styles.brandInline}>{ACCOUNT_DELETED_SCREEN.brand}</Text>
            {ACCOUNT_DELETED_SCREEN.bodySuffix}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.homeButton,
              pressed && { opacity: 0.92, transform: [{ scale: 0.97 }] },
            ]}
            onPress={goHome}
            accessibilityRole="button"
            accessibilityLabel={ACCOUNT_DELETED_SCREEN.goHomeLabel}
          >
            <Text style={styles.homeLabel}>{ACCOUNT_DELETED_SCREEN.goHomeLabel}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.endLabel}>{ACCOUNT_DELETED_SCREEN.endLabel}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.copyright}>{ACCOUNT_DELETED_SCREEN.copyright}</Text>
      </View>
    </SafeAreaView>
  );
};
