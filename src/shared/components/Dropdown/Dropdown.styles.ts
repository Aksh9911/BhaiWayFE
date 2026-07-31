import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(29, 78, 216, 0.28)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: layout.radiusXl,
    borderTopRightRadius: layout.radiusXl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.screenHorizontal,
    maxHeight: '70%',
    ...createShadow({ color: colors.primary, opacity: 0.12, radius: 16, offsetY: -2, elevation: 8 }),
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accentLight,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    fontSize: 18,
    color: colors.primary,
    flex: 1,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: layout.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
  },
  optionSelected: {
    backgroundColor: colors.accentLight,
    borderColor: colors.primary,
  },
  optionLabel: {
    ...typography.input,
    fontSize: 16,
    color: colors.textPrimary,
  },
  optionLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: layout.inputHeight,
    justifyContent: 'center',
  },
  fieldOpen: {
    borderColor: colors.primary,
    backgroundColor: colors.accentLight,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  fieldLabelOpen: {
    color: colors.primary,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fieldValue: {
    flex: 1,
    ...typography.input,
    fontSize: 15,
    color: colors.textPrimary,
  },
  fieldPlaceholder: {
    color: colors.textPlaceholder,
  },
});
