import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  appAlertStore,
  type AppAlertButton,
  type AppAlertPayload,
  type AppAlertVariant,
} from '@/store';
import { triggerLightHaptic } from '@/shared/utils';
import { appAlertTokens, styles } from './AppAlertModal.styles';
import { AppText as Text } from '../AppText';

const variantUi = (variant: AppAlertVariant) => {
  if (variant === 'success') {
    return {
      icon: 'checkmark-circle' as const,
      color: appAlertTokens.SUCCESS,
      background: appAlertTokens.SUCCESS_SOFT,
    };
  }
  if (variant === 'error') {
    return {
      icon: 'alert-circle' as const,
      color: appAlertTokens.ERROR,
      background: appAlertTokens.ERROR_SOFT,
    };
  }
  if (variant === 'warning') {
    return {
      icon: 'warning' as const,
      color: appAlertTokens.WARNING,
      background: appAlertTokens.WARNING_SOFT,
    };
  }
  return {
    icon: 'information-circle' as const,
    color: appAlertTokens.PRIMARY,
    background: appAlertTokens.PRIMARY_FIXED,
  };
};

const sortButtons = (buttons: AppAlertButton[]): AppAlertButton[] => {
  const cancel = buttons.filter((button) => button.style === 'cancel');
  const destructive = buttons.filter((button) => button.style === 'destructive');
  const rest = buttons.filter(
    (button) => button.style !== 'cancel' && button.style !== 'destructive',
  );
  // Primary actions first, then destructive, cancel last (matches common mobile patterns).
  return [...rest, ...destructive, ...cancel];
};

export const AppAlertModal = () => {
  const [payload, setPayload] = useState<AppAlertPayload | null>(() => appAlertStore.get());

  useEffect(() => appAlertStore.subscribe(setPayload), []);

  const buttons = useMemo(
    () => sortButtons(payload?.buttons ?? [{ text: 'OK', style: 'default' }]),
    [payload?.buttons],
  );

  const ui = variantUi(payload?.variant ?? 'info');

  const handlePress = useCallback((button: AppAlertButton) => {
    triggerLightHaptic();
    appAlertStore.hide();
    button.onPress?.();
  }, []);

  const handleDismiss = useCallback(() => {
    const cancelButton = buttons.find((button) => button.style === 'cancel');
    if (cancelButton) {
      handlePress(cancelButton);
      return;
    }
    if (buttons.length === 1) {
      handlePress(buttons[0]);
    }
  }, [buttons, handlePress]);

  if (!payload) {
    return null;
  }

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
      statusBarTranslucent
    >
      <Pressable
        style={styles.overlay}
        onPress={handleDismiss}
        accessibilityRole="button"
        accessibilityLabel="Dismiss alert"
      >
        <Pressable
          style={styles.card}
          onPress={(event) => event.stopPropagation()}
          accessibilityRole="summary"
          accessibilityLabel={`${payload.title}${payload.message ? `. ${payload.message}` : ''}`}
        >
          <View style={[styles.iconWrap, { backgroundColor: ui.background }]}>
            <Ionicons name={ui.icon} size={32} color={ui.color} />
          </View>

          <Text style={styles.title} accessibilityRole="header">
            {payload.title}
          </Text>
          {payload.message ? (
            <Text style={styles.message}>{payload.message}</Text>
          ) : (
            <View style={styles.messageOnlyTitle} />
          )}

          <View style={styles.actions}>
            {buttons.map((button) => {
              const isCancel = button.style === 'cancel';
              const isDestructive = button.style === 'destructive';
              return (
                <Pressable
                  key={`${button.text}-${button.style ?? 'default'}`}
                  style={({ pressed }) => [
                    styles.button,
                    isDestructive
                      ? styles.buttonDestructive
                      : isCancel
                        ? styles.buttonCancel
                        : styles.buttonPrimary,
                    pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                  ]}
                  onPress={() => handlePress(button)}
                  accessibilityRole="button"
                  accessibilityLabel={button.text}
                >
                  <Text
                    style={[
                      styles.buttonLabel,
                      isDestructive
                        ? styles.buttonLabelDestructive
                        : isCancel
                          ? styles.buttonLabelCancel
                          : styles.buttonLabelPrimary,
                    ]}
                  >
                    {button.text}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
