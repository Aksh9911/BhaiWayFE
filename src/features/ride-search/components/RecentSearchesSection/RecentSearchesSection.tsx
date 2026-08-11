import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './RecentSearchesSection.styles';
import type { RecentSearchesSectionProps } from './RecentSearchesSection.types';
import type { RecentSearchItem } from '../../types';
import { AppText as Text } from '@/shared/components';

export const RecentSearchesSection = React.memo(
  ({
    items,
    onSelect,
    title = 'Recent Searches',
    clearAllLabel = 'Clear All',
    emptyLabel,
    onClearAll,
    variant = 'list',
  }: RecentSearchesSectionProps) => {
    const handlePress = useCallback(
      (item: RecentSearchItem) => () => onSelect(item),
      [onSelect],
    );

    const isCards = variant === 'cards';

    if (items.length === 0 && !emptyLabel) {
      return null;
    }

    return (
      <View style={[styles.section, isCards && styles.sectionCards]}>
        <View style={isCards ? styles.header : undefined}>
          <Text style={[styles.heading, isCards && styles.headingCards]}>{title}</Text>
          {isCards && items.length > 0 && onClearAll ? (
            <Pressable
              onPress={onClearAll}
              accessibilityRole="button"
              accessibilityLabel={clearAllLabel}
              hitSlop={8}
            >
              <Text style={styles.clearAll}>{clearAllLabel}</Text>
            </Pressable>
          ) : null}
        </View>

        {items.length === 0 ? (
          emptyLabel ? <Text style={styles.empty}>{emptyLabel}</Text> : null
        ) : isCards ? (
          <View style={styles.list}>
            {items.map((item) => (
              <Pressable
                key={item.id}
                onPress={handlePress(item)}
                style={({ pressed }) => [styles.item, styles.itemCard, pressed && { opacity: 0.92 }]}
                accessibilityRole="button"
                accessibilityLabel={`Recent search from ${item.origin} to ${item.destination}`}
                android_ripple={{ color: 'rgba(51, 94, 234, 0.08)' }}
              >
                <View style={styles.iconWrap}>
                  <Ionicons name="time-outline" size={20} color="#000000" />
                </View>
                <View style={styles.itemContent}>
                  <View style={styles.routeRow}>
                    <Text style={styles.routeLabel} numberOfLines={1}>
                      {item.origin}
                    </Text>
                    <Ionicons name="arrow-forward" size={14} color="#45464D" />
                    <Text style={styles.routeLabel} numberOfLines={1}>
                      {item.destination}
                    </Text>
                  </View>
                  <Text style={[styles.meta, styles.metaCard]} numberOfLines={1}>
                    {item.dateLabel}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C6C6CD" />
              </Pressable>
            ))}
          </View>
        ) : (
          items.map((item) => (
            <Pressable
              key={item.id}
              onPress={handlePress(item)}
              style={styles.item}
              accessibilityRole="button"
              accessibilityLabel={`Recent search from ${item.origin} to ${item.destination}`}
              android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
            >
              <Text style={styles.route} numberOfLines={1}>
                {item.origin} → {item.destination}
              </Text>
              <Text style={styles.meta}>{item.dateLabel}</Text>
            </Pressable>
          ))
        )}
      </View>
    );
  },
);

RecentSearchesSection.displayName = 'RecentSearchesSection';
