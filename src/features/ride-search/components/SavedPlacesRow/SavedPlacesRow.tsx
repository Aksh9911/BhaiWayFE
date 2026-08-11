import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { styles } from './SavedPlacesRow.styles';
import type { SavedPlacesRowProps } from './SavedPlacesRow.types';
import { AppText as Text } from '@/shared/components';

export const SavedPlacesRow = React.memo(({ places, onSelect }: SavedPlacesRowProps) => {
  if (places.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Saved Places</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {places.map((place) => (
          <Pressable
            key={place.id}
            style={styles.card}
            onPress={() => onSelect(place)}
            accessibilityRole="button"
            accessibilityLabel={`Set destination to ${place.label}, ${place.location.placeName}`}
            android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
          >
            <Text style={styles.emoji}>{place.emoji}</Text>
            <View style={styles.textCol}>
              <Text style={styles.label}>{place.label}</Text>
              <Text style={styles.place} numberOfLines={1}>
                {place.location.placeName}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

SavedPlacesRow.displayName = 'SavedPlacesRow';
