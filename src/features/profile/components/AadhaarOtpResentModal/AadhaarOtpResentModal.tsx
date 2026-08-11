import React from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { VERIFY_AADHAAR_SCREEN } from '../../constants';
import { otpResentTokens, styles } from './AadhaarOtpResentModal.styles';
import type { AadhaarOtpResentModalProps } from './AadhaarOtpResentModal.types';
import { AppText as Text } from '@/shared/components';

export const AadhaarOtpResentModal = ({
  visible,
  maskedMobile,
  onClose,
}: AadhaarOtpResentModalProps) => (
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
      accessibilityLabel="Dismiss OTP resent message"
    >
      <Pressable
        style={styles.card}
        onPress={(event) => event.stopPropagation()}
        accessibilityRole="summary"
        accessibilityLabel={`${VERIFY_AADHAAR_SCREEN.otpResentTitle}. ${VERIFY_AADHAAR_SCREEN.otpResentMessage(maskedMobile)}`}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="mail-unread" size={32} color={otpResentTokens.PRIMARY} />
        </View>

        <Text style={styles.title} accessibilityRole="header">
          {VERIFY_AADHAAR_SCREEN.otpResentTitle}
        </Text>
        <Text style={styles.message}>
          {VERIFY_AADHAAR_SCREEN.otpResentMessage(maskedMobile)}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.doneButton,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={VERIFY_AADHAAR_SCREEN.otpResentDoneLabel}
        >
          <Text style={styles.doneLabel}>{VERIFY_AADHAAR_SCREEN.otpResentDoneLabel}</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  </Modal>
);
