import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useUpload } from '@/hooks/useUpload';
import { UPLOAD_KIND_CONFIG } from '@/shared/constants/uploadTypes';
import { colors, layout, spacing } from '@/shared/theme';
import type { CloudinaryUploadResponse, UploadKind, UploadSource } from '@/types/cloudinary';
import { UploadProgress } from './UploadProgress';
import { AppText as Text } from '../AppText';

export interface ImageUploaderProps {
  kind: UploadKind;
  title: string;
  subtitle?: string;
  onUploaded?: (result: CloudinaryUploadResponse) => Promise<void> | void;
  onSuccess?: (result: CloudinaryUploadResponse) => void;
  submitLabel?: string;
  /** When true, picking immediately uploads. Default true. */
  autoUpload?: boolean;
}

const SOURCE_LABEL: Record<UploadSource, string> = {
  camera: 'Camera',
  gallery: 'Gallery',
  files: 'Files',
};

const SOURCE_ICON: Record<UploadSource, keyof typeof Ionicons.glyphMap> = {
  camera: 'camera-outline',
  gallery: 'images-outline',
  files: 'document-outline',
};

export const ImageUploader = ({
  kind,
  title,
  subtitle,
  onUploaded,
  onSuccess,
}: ImageUploaderProps) => {
  const config = UPLOAD_KIND_CONFIG[kind];
  const {
    progress,
    isUploading,
    result,
    localPreviewUri,
    pickAndUpload,
    cancelUpload,
  } = useUpload({
    kind,
    onUploaded: async (uploaded) => {
      await onUploaded?.(uploaded);
      onSuccess?.(uploaded);
    },
  });

  const sources = useMemo(() => [...config.sources], [config.sources]);
  const previewUri = localPreviewUri ?? result?.secureUrl ?? null;
  const isPdf = (result?.format ?? '').toLowerCase() === 'pdf';

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

      <View style={styles.preview}>
        {previewUri && !isPdf ? (
          <Image source={{ uri: previewUri }} style={styles.previewImage} />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Ionicons
              name={isPdf ? 'document-text-outline' : 'cloud-upload-outline'}
              size={36}
              color={colors.textSecondary}
            />
            <Text style={styles.previewHint}>
              {isPdf ? 'PDF ready' : 'No file selected'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.sourceRow}>
        {sources.map((source) => (
          <Pressable
            key={source}
            style={({ pressed }) => [
              styles.sourceButton,
              (isUploading || pressed) && styles.sourceButtonDisabled,
            ]}
            disabled={isUploading}
            onPress={() => {
              void pickAndUpload(source);
            }}
            accessibilityRole="button"
            accessibilityLabel={SOURCE_LABEL[source]}
          >
            <Ionicons name={SOURCE_ICON[source]} size={20} color={colors.primary} />
            <Text style={styles.sourceLabel}>{SOURCE_LABEL[source]}</Text>
          </Pressable>
        ))}
      </View>

      {isUploading ? (
        <View style={styles.progressBlock}>
          <UploadProgress progress={progress} />
          <Pressable onPress={cancelUpload} accessibilityRole="button">
            <Text style={styles.cancelLabel}>Cancel upload</Text>
          </Pressable>
        </View>
      ) : null}

      {result ? (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Uploaded</Text>
          <Text style={styles.resultMeta}>Upload completed successfully.</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusXl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.xxxl,
    gap: spacing.lg,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  preview: {
    height: 180,
    borderRadius: layout.radiusLg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  previewHint: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  sourceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.accentLight,
  },
  sourceButtonDisabled: {
    opacity: 0.55,
  },
  sourceLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  progressBlock: {
    gap: spacing.sm,
  },
  cancelLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  resultBox: {
    gap: spacing.xs,
    padding: spacing.lg,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.surfaceMuted,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  resultMeta: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  submitHint: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
