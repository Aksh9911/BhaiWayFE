import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './CommuteOptionCard.styles';
import type { CommuteOptionCardProps } from './CommuteOptionCard.types';
import { AppText as Text } from '@/shared/components';

export const CommuteOptionCard = React.memo(
  ({
    badge,
    badgeVariant,
    title,
    icon,
    description,
    actionLabel,
    image,
    onPress,
  }: CommuteOptionCardProps) => (
    <Pressable
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${actionLabel}`}
      android_ripple={{ color: 'rgba(29, 78, 216, 0.06)' }}
    >
      <View style={styles.imageWrapper}>
        <Image source={image} style={styles.image} resizeMode="cover" accessibilityIgnoresInvertColors />
        <View style={[styles.badge, badgeVariant === 'primary' ? styles.badgePrimary : styles.badgeLight]}>
          <Text style={badgeVariant === 'primary' ? styles.badgeTextPrimary : styles.badgeTextLight}>
            {badge}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <Ionicons name={icon as never} size={22} color={colors.primary} />
        </View>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  ),
);

CommuteOptionCard.displayName = 'CommuteOptionCard';
