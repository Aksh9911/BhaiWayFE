import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, AppText as Text } from '@/shared/components';
import { INBOX_RIDE_TYPE_LABEL } from '../../constants';
import type { InboxThread } from '../../types';
import { styles } from './InboxThreadCard.styles';
import type { InboxThreadCardProps } from './InboxThreadCard.types';

export const InboxThreadCard = ({ thread, onPress }: InboxThreadCardProps) => {
  const hasUnread = thread.unreadCount > 0;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => onPress(thread)}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${thread.peerName}`}
    >
      <View style={styles.avatarWrap}>
        <Avatar
          size={52}
          uri={thread.avatarUri}
          accessibilityLabel={`${thread.peerName} photo`}
        />
        {thread.isOnline ? <View style={styles.onlineDot} /> : null}
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={[styles.name, hasUnread && styles.nameUnread]} numberOfLines={1}>
            {thread.peerName}
          </Text>
          <Text style={[styles.time, hasUnread && styles.timeUnread]}>{thread.timeLabel}</Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{INBOX_RIDE_TYPE_LABEL[thread.rideType]}</Text>
          </View>
          <Text style={styles.route} numberOfLines={1}>
            {thread.routeLabel}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <Text
            style={[styles.preview, hasUnread && styles.previewUnread]}
            numberOfLines={1}
          >
            {thread.lastMessage}
          </Text>
          {hasUnread ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {thread.unreadCount > 9 ? '9+' : thread.unreadCount}
              </Text>
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={16} color="#C4C5D7" />
          )}
        </View>
      </View>
    </Pressable>
  );
};
