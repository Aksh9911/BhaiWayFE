import { StyleSheet } from 'react-native';

import { colors, layout, spacing, typography } from '@/shared/theme';
import { androidTextInputFix, createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerWrap: {
    backgroundColor: colors.white,
    ...createShadow({
      color: colors.shadow,
      opacity: 0.06,
      radius: 6,
      offsetY: 2,
      elevation: 2,
    }),
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    gap: spacing.xxl,
  },
  intro: {
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  section: {
    gap: spacing.md,
  },
  sectionLabel: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  reasonChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(116, 118, 134, 0.2)',
    backgroundColor: colors.white,
  },
  reasonChipSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  reasonLabel: {
    ...typography.caption,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  reasonLabelSelected: {
    color: colors.textInverse,
  },
  notesInput: {
    minHeight: 96,
    borderRadius: layout.radiusXl,
    borderWidth: 1,
    borderColor: 'rgba(116, 118, 134, 0.2)',
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    ...androidTextInputFix,
  },
  actions: {
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  confirmBtn: {
    minHeight: 56,
    borderRadius: layout.radiusXl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow({
      color: colors.primary,
      opacity: 0.2,
      radius: 12,
      offsetY: 4,
      elevation: 4,
    }),
  },
  confirmBtnDisabled: {
    opacity: 0.45,
  },
  confirmLabel: {
    ...typography.button,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.textInverse,
  },
  backBtn: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.radiusLg,
  },
  backLabel: {
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: colors.primary,
  },
});
