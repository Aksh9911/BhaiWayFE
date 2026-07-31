import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { androidTextInputFix } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
  },
  intro: {
    marginBottom: spacing.xl,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  fieldHalf: {
    flex: 1,
  },
  pressableField: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: layout.inputHeight,
    justifyContent: 'center',
  },
  pressableFieldActive: {
    borderColor: colors.primary,
    backgroundColor: colors.accentLight,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  fieldLabelActive: {
    color: colors.primary,
  },
  fieldValue: {
    ...typography.input,
    fontSize: 15,
    color: colors.textPrimary,
  },
  fieldPlaceholder: {
    color: colors.textPlaceholder,
  },
  fieldIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  priceInput: {
    ...typography.input,
    fontSize: 16,
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
    flex: 1,
    ...androidTextInputFix,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
});
