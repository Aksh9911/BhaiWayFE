import React, { useMemo } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { IconButton, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { styles } from './HomeHeader.styles';
import type { HomeHeaderProps } from './HomeHeader.types';

export const HomeHeader = React.memo(
  ({
    brandName,
    location,
    hasUnreadNotifications = false,
    onNotificationsPress,
    onProfilePress,
  }: HomeHeaderProps) => {
    const locationLabel = useMemo(() => {
      if (location.label && location.city && location.label !== location.city) {
        return `${location.label}, ${location.city}`;
      }
      return location.label || location.city || 'Locating…';
    }, [location.city, location.label]);

    return (
      <View style={styles.container}>
        <View style={styles.brandBlock}>
          <Text style={styles.brandName} accessibilityRole="header">
            {brandName}
          </Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {locationLabel}
            </Text>
          </View>
        </View>

        <View style={styles.right}>
          <IconButton
            icon="notifications-outline"
            onPress={onNotificationsPress}
            accessibilityLabel="Notifications"
            showBadge={hasUnreadNotifications}
          />
          <IconButton
            icon="person-circle-outline"
            onPress={onProfilePress}
            accessibilityLabel="Profile"
          />
        </View>
      </View>
    );
  },
);

HomeHeader.displayName = 'HomeHeader';
