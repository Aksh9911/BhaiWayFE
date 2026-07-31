import React, { useCallback, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { UploadDocumentSheet } from '@/shared/components';
import { logger, triggerLightHaptic } from '@/shared/utils';
import { styles } from './AvatarPicker.styles';
import type { AvatarPickerProps } from './AvatarPicker.types';

export const AvatarPicker = ({ imageUri, onImageSelected, error }: AvatarPickerProps) => {
  const [sheetVisible, setSheetVisible] = useState(false);

  const openSheet = useCallback(() => {
    triggerLightHaptic();
    setSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={openSheet}
        style={styles.avatarContainer}
        accessibilityRole="button"
        accessibilityLabel="Profile photo. Tap to add or change photo."
      >
        <View style={styles.avatarCircle}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person" size={56} color={colors.primary} />
          )}
        </View>
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={18} color={colors.white} />
        </View>
      </Pressable>

      <Text style={styles.hint}>Tap to add photo</Text>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <UploadDocumentSheet
        visible={sheetVisible}
        onClose={closeSheet}
        onPicked={(document) => {
          try {
            onImageSelected(document.uri);
          } catch (pickerError) {
            logger.error('Avatar picker failed to apply image', pickerError);
          }
        }}
        title="Profile Photo"
        subtitle="Take a new photo or choose one from your gallery."
        imagePickerOptions={{
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        }}
      />
    </View>
  );
};
