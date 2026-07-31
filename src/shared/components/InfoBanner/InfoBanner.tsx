import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { styles } from './InfoBanner.styles';
import type { InfoBannerProps } from './InfoBanner.types';

const DEFAULT_ICONS = {
  accent: 'shield-checkmark' as const,
  verify: 'shield-checkmark' as const,
  security: 'lock-closed' as const,
};

const DEFAULT_ICON_COLORS = {
  accent: colors.primary,
  verify: '#341100',
  security: '#0342D1',
};

export const InfoBanner = React.memo(
  ({
    title,
    description,
    variant = 'accent',
    icon,
    actionLabel,
    onActionPress,
    leading,
    style,
  }: InfoBannerProps) => {
    const handleAction = useCallback(() => {
      if (!onActionPress) {
        return;
      }
      triggerLightHaptic();
      onActionPress();
    }, [onActionPress]);

    const variantStyle =
      variant === 'verify'
        ? styles.verify
        : variant === 'security'
          ? styles.security
          : styles.accent;

    const iconWrapStyle =
      variant === 'verify'
        ? styles.iconVerify
        : variant === 'security'
          ? styles.iconSecurity
          : styles.iconAccent;

    return (
      <View style={[styles.base, variantStyle, style]}>
        {leading ?? (
          <View style={[styles.iconWrap, iconWrapStyle]}>
            <Ionicons
              name={icon ?? DEFAULT_ICONS[variant]}
              size={variant === 'accent' ? 28 : 20}
              color={DEFAULT_ICON_COLORS[variant]}
            />
          </View>
        )}

        <View style={styles.content}>
          <Text style={[styles.title, variant === 'security' && styles.titleSecurity]}>
            {title}
          </Text>
          <Text
            style={[styles.description, variant === 'security' && styles.descriptionSecurity]}
          >
            {description}
          </Text>

          {actionLabel && onActionPress ? (
            variant === 'verify' ? (
              <Pressable
                onPress={handleAction}
                style={({ pressed }) => [styles.actionPill, pressed && { opacity: 0.9 }]}
                accessibilityRole="button"
                accessibilityLabel={actionLabel}
              >
                <Text style={styles.actionPillLabel}>{actionLabel}</Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleAction}
                accessibilityRole="button"
                accessibilityLabel={actionLabel}
                android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
              >
                <Text style={styles.actionText}>{actionLabel}</Text>
              </Pressable>
            )
          ) : null}
        </View>
      </View>
    );
  },
);

InfoBanner.displayName = 'InfoBanner';
