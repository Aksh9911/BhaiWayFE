import React, { useMemo } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  getMissingLocationCopy,
  MISSING_LOCATION_DONE_LABEL,
} from './MissingLocationModal.constants';
import { missingLocationTokens, styles } from './MissingLocationModal.styles';
import type { MissingLocationModalProps } from './MissingLocationModal.types';
import { AppText as Text } from '../AppText';

export const MissingLocationModal = ({
  visible,
  kind,
  context = 'ride',
  onClose,
  onSelect,
}: MissingLocationModalProps) => {
  const copy = useMemo(() => {
    if (!kind) {
      return null;
    }
    return getMissingLocationCopy(kind, context);
  }, [context, kind]);

  if (!copy) {
    return null;
  }

  const iconName =
    kind === 'origin' ? 'navigate-circle-outline' : kind === 'destination' ? 'flag-outline' : 'map-outline';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.overlay}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Dismiss missing location message"
      >
        <Pressable
          style={styles.card}
          onPress={(event) => event.stopPropagation()}
          accessibilityRole="summary"
          accessibilityLabel={`${copy.title}. ${copy.message}`}
        >
          <View style={styles.iconWrap}>
            <Ionicons name={iconName} size={32} color={missingLocationTokens.PRIMARY} />
          </View>

          <Text style={styles.title} accessibilityRole="header">
            {copy.title}
          </Text>
          <Text style={styles.message}>{copy.message}</Text>

          <View style={styles.actions}>
            {onSelect ? (
              <Pressable
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}
                onPress={onSelect}
                accessibilityRole="button"
                accessibilityLabel={copy.actionLabel}
              >
                <Text style={styles.primaryLabel}>{copy.actionLabel}</Text>
              </Pressable>
            ) : null}

            <Pressable
              style={({ pressed }) => [
                onSelect ? styles.secondaryButton : styles.primaryButton,
                pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
              ]}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={MISSING_LOCATION_DONE_LABEL}
            >
              <Text style={onSelect ? styles.secondaryLabel : styles.primaryLabel}>
                {MISSING_LOCATION_DONE_LABEL}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
