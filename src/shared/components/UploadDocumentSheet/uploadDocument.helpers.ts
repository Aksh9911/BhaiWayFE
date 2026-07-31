import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import type { UploadedDocument } from '../UploadDocumentSheet/UploadDocumentSheet.types';

const DEFAULT_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  quality: 0.85,
};

const toUploadedDocument = (asset: ImagePicker.ImagePickerAsset): UploadedDocument => ({
  uri: asset.uri,
  fileName: asset.fileName ?? undefined,
  mimeType: asset.mimeType ?? undefined,
  width: asset.width,
  height: asset.height,
});

export const pickDocumentFromCamera = async (
  options?: ImagePicker.ImagePickerOptions,
): Promise<UploadedDocument | null> => {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission required', 'Camera access is needed to capture your document.');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    ...DEFAULT_OPTIONS,
    ...options,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return toUploadedDocument(result.assets[0]);
};

export const pickDocumentFromGallery = async (
  options?: ImagePicker.ImagePickerOptions,
): Promise<UploadedDocument | null> => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Permission required', 'Gallery access is needed to upload your document.');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    ...DEFAULT_OPTIONS,
    ...options,
  });

  if (result.canceled || !result.assets[0]) {
    return null;
  }

  return toUploadedDocument(result.assets[0]);
};
