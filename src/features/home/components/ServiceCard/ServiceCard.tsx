import React, { useCallback } from 'react';
import { Image, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button } from '@/shared/components';
import { colors } from '@/shared/theme';
import { styles } from './ServiceCard.styles';
import type { ServiceCardProps } from './ServiceCard.types';

const ENTRANCE_BASE_DELAY = 80;

export const ServiceCard = React.memo(
  ({ data, index, illustration, onPress }: ServiceCardProps) => {
    const handlePress = useCallback(() => {
      onPress(data);
    }, [data, onPress]);

    return (
      <Animated.View
        entering={FadeInDown.delay(index * ENTRANCE_BASE_DELAY).duration(400)}
        style={styles.card}
      >
        <View style={styles.badge}>
          <Ionicons name={data.badgeIcon as never} size={14} color={colors.primary} />
          <Text style={styles.badgeText}>{data.badge}</Text>
        </View>

        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>

        {illustration ? (
          <Image
            source={illustration}
            style={styles.illustration}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
            accessibilityLabel={`${data.title} illustration`}
          />
        ) : null}

        <Button
          label={data.actionLabel}
          onPress={handlePress}
          disabled={!data.enabled}
          variant="primary"
          showArrow
          fullWidth={false}
          style={styles.actionButton}
          accessibilityLabel={`${data.actionLabel} for ${data.title}`}
        />
      </Animated.View>
    );
  },
);

ServiceCard.displayName = 'ServiceCard';
