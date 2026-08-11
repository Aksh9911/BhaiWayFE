import React, { useCallback } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppFooter, ScreenHeader, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { REQUEST_DECLINED_SCREEN } from '@/features/my-rides/constants';
import { useRequestDeclined } from '@/features/my-rides/hooks';
import { styles } from './RequestDeclinedScreen.styles';

export const RequestDeclinedScreen = () => {
  const { riderName, goToDashboard, viewOtherRequests, goBack } = useRequestDeclined();

  const handleBack = useCallback(() => {
    triggerLightHaptic();
    goBack();
  }, [goBack]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.headerWrap}>
        <ScreenHeader title={REQUEST_DECLINED_SCREEN.brandName} onBack={handleBack} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.iconRing}>
            <View style={styles.iconCircle}>
              <Ionicons name="ban-outline" size={48} color={colors.textMuted} />
            </View>
          </View>
          <Text style={styles.title} accessibilityRole="header">
            {REQUEST_DECLINED_SCREEN.title}
          </Text>
          <Text style={styles.subtitle}>
            {REQUEST_DECLINED_SCREEN.subtitle(riderName)}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
          <Text style={styles.infoText}>
            {REQUEST_DECLINED_SCREEN.infoNote(riderName)}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && { opacity: 0.92 }]}
            onPress={goToDashboard}
            accessibilityRole="button"
            accessibilityLabel={REQUEST_DECLINED_SCREEN.dashboardLabel}
          >
            <Text style={styles.primaryLabel}>{REQUEST_DECLINED_SCREEN.dashboardLabel}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.85 }]}
            onPress={viewOtherRequests}
            accessibilityRole="button"
            accessibilityLabel={REQUEST_DECLINED_SCREEN.viewRequestsLabel}
          >
            <Text style={styles.secondaryLabel}>
              {REQUEST_DECLINED_SCREEN.viewRequestsLabel}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <AppFooter activeTab="rides" />
    </SafeAreaView>
  );
};
