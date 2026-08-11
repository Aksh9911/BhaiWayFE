import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppFooter, IconButton, KeyboardAwareScrollView, AppText as Text } from '@/shared/components';
import { triggerSuccessHaptic } from '@/shared/utils';
import { useUpiLinkedSuccess } from '@/features/profile/hooks';
import { styles, upiLinkedTokens } from './UpiLinkedSuccessScreen.styles';

export const UpiLinkedSuccessScreen = () => {
  const {
    headerTitle,
    title,
    subtitle,
    linkedLabel,
    verifiedBadge,
    continueWalletLabel,
    backPaymentLabel,
    upiId,
    goBack,
    continueToWallet,
    backToPaymentMethods,
  } = useUpiLinkedSuccess();

  const bounce = useSharedValue(0);

  useEffect(() => {
    triggerSuccessHaptic();
    bounce.value = withSequence(
      withTiming(-12, { duration: 280 }),
      withTiming(0, { duration: 280 }),
      withTiming(-6, { duration: 200 }),
      withTiming(0, { duration: 200 }),
    );
  }, [bounce]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-back"
          onPress={goBack}
          color={upiLinkedTokens.PRIMARY}
          accessibilityLabel="Go back"
        />
        <Text style={styles.headerTitle} accessibilityRole="header" numberOfLines={1}>
          {headerTitle}
        </Text>
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bottomInset={24}
      >
        <View style={styles.content}>
          <View style={styles.iconOuter}>
            <View style={styles.iconPulse} />
            <Animated.View style={[styles.iconCircle, iconStyle]}>
              <Ionicons name="checkmark-circle" size={64} color={upiLinkedTokens.ON_PRIMARY} />
            </Animated.View>
          </View>

          <View style={styles.copyBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <View style={styles.detailsCard}>
            <View style={styles.detailsLeft}>
              <View style={styles.walletIcon}>
                <Ionicons name="wallet-outline" size={22} color={upiLinkedTokens.PRIMARY} />
              </View>
              <View style={styles.detailsText}>
                <Text style={styles.linkedLabel}>{linkedLabel}</Text>
                <Text style={styles.upiId} numberOfLines={1}>
                  {upiId}
                </Text>
              </View>
            </View>
            <View style={styles.verifiedPill}>
              <Ionicons name="checkmark-circle" size={18} color={upiLinkedTokens.PRIMARY} />
              <Text style={styles.verifiedText}>{verifiedBadge}</Text>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
              ]}
              onPress={continueToWallet}
              accessibilityRole="button"
              accessibilityLabel={continueWalletLabel}
            >
              <Text style={styles.primaryLabel}>{continueWalletLabel}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && { opacity: 0.9, backgroundColor: '#EDEEEF' },
              ]}
              onPress={backToPaymentMethods}
              accessibilityRole="button"
              accessibilityLabel={backPaymentLabel}
            >
              <Text style={styles.secondaryLabel}>{backPaymentLabel}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <AppFooter activeTab="profile" />
    </SafeAreaView>
  );
};
