import React from 'react';
import { Pressable, View } from 'react-native';

import { RIDE_RESULT_FILTERS } from '../../constants';
import type { RideTypeTabId } from './ResultFilterChips.types';
import { styles } from './ResultFilterChips.styles';
import type { ResultFilterChipsProps } from './ResultFilterChips.types';
import { AppText as Text } from '@/shared/components';

export const ResultFilterChips = React.memo(
  ({ selectedId, onSelect }: ResultFilterChipsProps) => (
    <View style={styles.list} accessibilityRole="tablist">
      {RIDE_RESULT_FILTERS.map((filter) => {
        const id = filter.id as RideTypeTabId;
        const selected = id === selectedId;
        return (
          <Pressable
            key={id}
            style={[styles.chip, selected && styles.chipSelected]}
            onPress={() => onSelect(id)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={filter.label}
            android_ripple={{ color: 'rgba(29, 78, 216, 0.12)' }}
          >
            <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  ),
);

ResultFilterChips.displayName = 'ResultFilterChips';
