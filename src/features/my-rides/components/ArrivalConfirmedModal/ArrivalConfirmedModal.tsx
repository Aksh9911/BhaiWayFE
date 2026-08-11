import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { DRIVER_PICKUP_SCREEN } from '../../constants';
import { styles } from './ArrivalConfirmedModal.styles';
import type { ArrivalConfirmedModalProps } from './ArrivalConfirmedModal.types';
import { AppText as Text } from '@/shared/components';

export const ArrivalConfirmedModal = ({
  visible,
  passengerName,
  isLastStop,
  onContinue,
}: ArrivalConfirmedModalProps) => {
  const actionLabel = isLastStop
    ? DRIVER_PICKUP_SCREEN.confirmedStartTripLabel
    : DRIVER_PICKUP_SCREEN.confirmedNextPickupLabel;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onContinue}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View
          style={styles.card}
          accessibilityRole="summary"
          accessibilityLabel={`${DRIVER_PICKUP_SCREEN.confirmedTitle}. ${DRIVER_PICKUP_SCREEN.confirmedMessage(passengerName)}`}
        >
          <View style={styles.header}>
            <View style={styles.iconWrap}>
              <Ionicons name="checkmark-circle" size={40} color="#1B7A4A" />
            </View>
            <Text style={styles.title}>{DRIVER_PICKUP_SCREEN.confirmedTitle}</Text>
            <Text style={styles.message}>
              Arrival Confirmed for <Text style={styles.riderName}>'{passengerName}'</Text>
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            onPress={onContinue}
            accessibilityRole="button"
            accessibilityLabel={actionLabel}
          >
            <Text style={styles.continueLabel}>{actionLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
