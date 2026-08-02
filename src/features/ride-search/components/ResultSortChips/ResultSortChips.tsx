import React from 'react';
import { Pressable, ScrollView, Text } from 'react-native';

import { RIDE_RESULT_SORT_OPTIONS } from '../../constants';
import type { RideResultSortId } from '../../types';
import { styles } from './ResultSortChips.styles';
import type { ResultSortChipsProps } from './ResultSortChips.types';

export const ResultSortChips = React.memo(
  ({ selectedId, onSelect }: ResultSortChipsProps) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      accessibilityRole="tablist"
      accessibilityLabel="Sort rides"
    >
      {RIDE_RESULT_SORT_OPTIONS.map((option) => {
        const id = option.id as RideResultSortId;
        const selected = id === selectedId;
        return (
          <Pressable
            key={id}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => onSelect(id)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={`Sort by ${option.label}`}
            android_ripple={{ color: 'rgba(29, 78, 216, 0.12)' }}
          >
            <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  ),
);

ResultSortChips.displayName = 'ResultSortChips';
