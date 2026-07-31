import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import {
  pickDocumentFromCamera,
  pickDocumentFromGallery,
} from './uploadDocument.helpers';
import { styles } from './UploadDocumentSheet.styles';
import type {
  UploadDocumentSheetProps,
  UploadDocumentSource,
} from './UploadDocumentSheet.types';

const DEFAULT_SOURCES: readonly UploadDocumentSource[] = ['camera', 'gallery'];

export const UploadDocumentSheet = ({
  visible,
  onClose,
  onPicked,
  title = 'Upload Document',
  subtitle = 'Choose how you want to add your file.',
  cameraLabel = 'Take Photo',
  cameraHint = 'Use your camera to capture the document',
  galleryLabel = 'Choose from Gallery',
  galleryHint = 'Select an existing photo from your device',
  cancelLabel = 'Cancel',
  sources = DEFAULT_SOURCES,
  imagePickerOptions,
}: UploadDocumentSheetProps) => {
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);

  const handleClose = useCallback(() => {
    if (busy) {
      return;
    }
    onClose();
  }, [busy, onClose]);

  const runSource = useCallback(
    async (source: UploadDocumentSource) => {
      if (busy) {
        return;
      }

      triggerLightHaptic();
      setBusy(true);
      onClose();

      try {
        const document =
          source === 'camera'
            ? await pickDocumentFromCamera(imagePickerOptions)
            : await pickDocumentFromGallery(imagePickerOptions);

        if (document) {
          onPicked(document);
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, imagePickerOptions, onClose, onPicked],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={handleClose} accessibilityLabel="Close upload sheet">
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.xxl) }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              {busy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Ionicons name="cloud-upload-outline" size={24} color={colors.white} />
              )}
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>

          <View style={styles.options}>
            {sources.includes('camera') ? (
              <Pressable
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                onPress={() => void runSource('camera')}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={cameraLabel}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="camera-outline" size={24} color="#0342D1" />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{cameraLabel}</Text>
                  <Text style={styles.optionHint}>{cameraHint}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C4C5D7" />
              </Pressable>
            ) : null}

            {sources.includes('gallery') ? (
              <Pressable
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                onPress={() => void runSource('gallery')}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={galleryLabel}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="images-outline" size={24} color="#0342D1" />
                </View>
                <View style={styles.optionText}>
                  <Text style={styles.optionLabel}>{galleryLabel}</Text>
                  <Text style={styles.optionHint}>{galleryHint}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#C4C5D7" />
              </Pressable>
            ) : null}
          </View>

          <Pressable
            style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.85 }]}
            onPress={handleClose}
            disabled={busy}
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
          >
            <Text style={styles.cancelLabel}>{cancelLabel}</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
