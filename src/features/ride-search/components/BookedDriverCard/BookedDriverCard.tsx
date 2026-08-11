import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, AppText as Text } from '@/shared/components';
import { styles } from './BookedDriverCard.styles';

export interface BookedDriverCardProps {
  name: string;
  subtitle: string;
  onChat: () => void;
  onCall: () => void;
}

export const BookedDriverCard = React.memo(
  ({ name, subtitle, onChat, onCall }: BookedDriverCardProps) => (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={styles.avatarRing}>
          <Avatar size={48} accessibilityLabel={`${name} photo`} />
        </View>
        <View style={styles.meta}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && { transform: [{ scale: 0.95 }] }]}
          onPress={onChat}
          accessibilityRole="button"
          accessibilityLabel="Chat with driver"
        >
          <Ionicons name="chatbubble-outline" size={20} color="#45464D" />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.actionBtn, pressed && { transform: [{ scale: 0.95 }] }]}
          onPress={onCall}
          accessibilityRole="button"
          accessibilityLabel="Call driver"
        >
          <Ionicons name="call-outline" size={20} color="#45464D" />
        </Pressable>
      </View>
    </View>
  ),
);

BookedDriverCard.displayName = 'BookedDriverCard';
