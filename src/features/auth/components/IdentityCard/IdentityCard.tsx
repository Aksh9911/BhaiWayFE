import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { colors } from '@/shared/theme';
import { styles } from './IdentityCard.styles';
import type { IdentityCardProps } from './IdentityCard.types';

export const IdentityCard = ({ onVerifyPress }: IdentityCardProps) => {
  const handleVerify = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onVerifyPress?.();
  }, [onVerifyPress]);

  return (
    <View style={styles.card}>
      <View style={styles.accentBar} />

      <View style={styles.content}>
        <View style={styles.illustration}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
          </View>
          <Ionicons name="person" size={28} color={colors.primary} style={styles.personIcon} />
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>Verify Your Identity</Text>
          <Text style={styles.subtitle}>
            Stand out to others and unlock all BhaiWay features by verifying your ID.
          </Text>

          <Pressable
            onPress={handleVerify}
            style={styles.verifyButton}
            accessibilityRole="button"
            accessibilityLabel="Verify your identity now"
          >
            <Ionicons name="shield-checkmark" size={16} color={colors.white} />
            <Text style={styles.verifyLabel}>Verify Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
