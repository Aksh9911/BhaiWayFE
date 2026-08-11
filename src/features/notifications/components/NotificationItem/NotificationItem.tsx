import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { NOTIFICATION_CATEGORY_ICON } from '../../constants';
import { styles } from './NotificationItem.styles';
import type { NotificationItemProps } from './NotificationItem.types';

export const NotificationItem = ({ notification, onPress }: NotificationItemProps) => {
  const unread = notification.unread;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        unread && styles.cardUnread,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(notification)}
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}. ${notification.body}`}
      accessibilityState={{ selected: unread }}
    >
      <View style={styles.iconWrap}>
        <Ionicons
          name={NOTIFICATION_CATEGORY_ICON[notification.category]}
          size={22}
          color={colors.primary}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.title, unread && styles.titleUnread]} numberOfLines={1}>
            {notification.title}
          </Text>
          <Text style={styles.time}>{notification.timeLabel}</Text>
        </View>
        <Text style={[styles.body, unread && styles.bodyUnread]} numberOfLines={2}>
          {notification.body}
        </Text>
      </View>

      {unread ? <View style={styles.unreadDot} /> : null}
    </Pressable>
  );
};
