import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { saveProfilePhotoUrl } from '@/features/media';
import { uploadFile } from '@/services/cloudinary';
import { UploadDocumentSheet } from '@/shared/components';
import { colors } from '@/shared/theme';
import { CloudinaryUploadError } from '@/types/cloudinary';
import { logger, triggerLightHaptic, triggerSuccessHaptic } from '@/shared/utils';
import { styles } from './AvatarPicker.styles';
import type { AvatarPickerProps } from './AvatarPicker.types';

const PROFILE_PICKER_OPTIONS = {
  allowsEditing: true,
  aspect: [1, 1] as [number, number],
  quality: 0.8,
};

export const AvatarPicker = ({ imageUri, onImageSelected, error }: AvatarPickerProps) => {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [brokenRemote, setBrokenRemote] = useState(false);

  const openSheet = useCallback(() => {
    if (uploading) {
      return;
    }
    triggerLightHaptic();
    setSheetVisible(true);
  }, [uploading]);

  const closeSheet = useCallback(() => {
    setSheetVisible(false);
  }, []);

  const handlePicked = useCallback(
    (document: { uri: string; fileName?: string; mimeType?: string }) => {
      setBrokenRemote(false);
      onImageSelected(document.uri);
      setUploading(true);

      void (async () => {
        try {
          const uploaded = await uploadFile({
            uri: document.uri,
            kind: 'profile',
            fileName: document.fileName ?? `profile_${Date.now()}.jpg`,
            mimeType: document.mimeType ?? 'image/jpeg',
            resourceType: 'image',
          });

          await saveProfilePhotoUrl(uploaded);
          onImageSelected(uploaded.secureUrl);
          triggerSuccessHaptic();
        } catch (pickerError) {
          logger.error('Avatar Cloudinary upload failed', pickerError);
          const message =
            pickerError instanceof CloudinaryUploadError
              ? pickerError.message
              : 'Unable to upload your profile photo. Please try again.';
          Alert.alert('Upload failed', message);
        } finally {
          setUploading(false);
        }
      })();
    },
    [onImageSelected],
  );

  const showImage = Boolean(imageUri) && !brokenRemote;

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={openSheet}
        style={styles.avatarContainer}
        accessibilityRole="button"
        accessibilityLabel="Profile photo. Tap to add or change photo."
        disabled={uploading}
      >
        <View style={styles.avatarCircle}>
          {showImage ? (
            <Image
              source={{ uri: imageUri as string }}
              style={styles.avatarImage}
              onError={() => setBrokenRemote(true)}
            />
          ) : (
            <Ionicons name="person" size={56} color={colors.primary} />
          )}
          {uploading ? (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color={colors.white} />
            </View>
          ) : null}
        </View>
        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={18} color={colors.white} />
        </View>
      </Pressable>

      <Text style={styles.hint}>{uploading ? 'Uploading…' : 'Tap to add photo'}</Text>

      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}

      <UploadDocumentSheet
        visible={sheetVisible}
        onClose={closeSheet}
        onPicked={handlePicked}
        title="Profile Photo"
        subtitle="Take a new photo or choose one from your gallery."
        imagePickerOptions={PROFILE_PICKER_OPTIONS}
      />
    </View>
  );
};
