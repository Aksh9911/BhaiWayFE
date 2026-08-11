import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { styles } from './RideTypeCard.styles';
import type { RideTypeCardProps } from './RideTypeCard.types';

export const RideTypeCard = React.memo(
  ({
    title,
    icon,
    iconVariant,
    description,
    buttonLabel,
    buttonVariant,
    highlighted = false,
    badge,
    note,
    onSelect,
  }: RideTypeCardProps) => (
    <View style={[styles.card, highlighted && styles.cardHighlighted]}>
      <View style={[styles.iconBox, iconVariant === 'dark' ? styles.iconDark : styles.iconMuted]}>
        <Ionicons
          name={icon as never}
          size={22}
          color={iconVariant === 'dark' ? colors.white : colors.primary}
        />
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {badge ? (
          <View style={styles.badge}>
            <Ionicons name="star" size={12} color={colors.primary} />
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.description}>{description}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}

      <Button
        label={buttonLabel}
        onPress={onSelect}
        variant={buttonVariant}
        accessibilityLabel={buttonLabel}
      />
    </View>
  ),
);

RideTypeCard.displayName = 'RideTypeCard';
