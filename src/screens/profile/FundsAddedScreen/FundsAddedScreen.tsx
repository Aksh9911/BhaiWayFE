import React, { useEffect } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppFooter, IconButton, KeyboardAwareScrollView, BhaiWayCoinIcon, AppText as Text } from '@/shared/components';
import { triggerSuccessHaptic } from '@/shared/utils';
import { useFundsAdded } from '@/features/profile/hooks';
import { fundsAddedTokens, styles } from './FundsAddedScreen.styles';

export const FundsAddedScreen = () => {
  const {
    brandTitle,
    title,
    subtitle,
    amountLabel,
    balanceLabel,
    statusLabel,
    statusTitle,
    updatedLabel,
    goToWalletLabel,
    bookRideLabel,
    receiptLabel,
    avatarUri,
    goToWallet,
    bookRide,
    viewReceipt,
    openNotifications,
    openProfile,
  } = useFundsAdded();

  const bounce = useSharedValue(0);

  useEffect(() => {
    triggerSuccessHaptic();
    bounce.value = withRepeat(
      withSequence(withTiming(-10, { duration: 900 }), withTiming(0, { duration: 900 })),
      -1,
      false,
    );
  }, [bounce]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bounce.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          style={styles.headerLeft}
          onPress={openProfile}
          accessibilityRole="button"
          accessibilityLabel="Open profile"
        >
          <Image source={{ uri: avatarUri }} style={styles.avatar} accessibilityIgnoresInvertColors />
          <Text style={styles.brandTitle} accessibilityRole="header" numberOfLines={1}>
            {brandTitle}
          </Text>
        </Pressable>
        <IconButton
          icon="notifications-outline"
          onPress={openNotifications}
          color={fundsAddedTokens.PRIMARY}
          accessibilityLabel="Notifications"
        />
      </View>

      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        bottomInset={24}
      >
        <View style={styles.glow} pointerEvents="none" />
        <View style={styles.content}>
          <Animated.View style={[styles.iconWrap, iconStyle]}>
            <Ionicons name="checkmark-circle" size={48} color={fundsAddedTokens.ON_PRIMARY_CONTAINER} />
          </Animated.View>

          <View style={styles.headlines}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.amountRow}>
              <BhaiWayCoinIcon size={32} />
              <Text style={styles.amount}>{amountLabel}</Text>
            </View>
            <View style={styles.amountUnderline} />
          </View>

          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.statusCard}>
            <View style={styles.statusLeft}>
              <Text style={styles.statusLabel}>{statusLabel}</Text>
              <Text style={styles.statusTitle}>{statusTitle}</Text>
            </View>
            <View style={styles.statusRight}>
              <View style={styles.balanceRow}>
                <BhaiWayCoinIcon size={18} />
                <Text style={styles.balanceValue}>{balanceLabel}</Text>
              </View>
              <View style={styles.updatedRow}>
                <Ionicons name="trending-up" size={14} color={fundsAddedTokens.PRIMARY} />
                <Text style={styles.updatedText}>{updatedLabel}</Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && { opacity: 0.94, transform: [{ scale: 0.98 }] },
              ]}
              onPress={goToWallet}
              accessibilityRole="button"
              accessibilityLabel={goToWalletLabel}
            >
              <Ionicons name="wallet" size={20} color={fundsAddedTokens.ON_PRIMARY} />
              <Text style={styles.primaryLabel}>{goToWalletLabel}</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && { opacity: 0.94, transform: [{ scale: 0.98 }] },
              ]}
              onPress={bookRide}
              accessibilityRole="button"
              accessibilityLabel={bookRideLabel}
            >
              <Ionicons name="car-outline" size={20} color={fundsAddedTokens.SECONDARY} />
              <Text style={styles.secondaryLabel}>{bookRideLabel}</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.receiptLink}
            onPress={viewReceipt}
            accessibilityRole="link"
            accessibilityLabel={receiptLabel}
          >
            <Text style={styles.receiptLabel}>{receiptLabel}</Text>
            <Ionicons name="arrow-forward" size={14} color={fundsAddedTokens.PRIMARY} />
          </Pressable>
        </View>
      </KeyboardAwareScrollView>

      <AppFooter activeTab="profile" />
    </SafeAreaView>
  );
};
