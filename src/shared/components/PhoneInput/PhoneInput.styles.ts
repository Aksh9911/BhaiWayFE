import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { androidTextInputFix } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    minHeight: layout.inputHeight,
    overflow: 'hidden',
  },
  containerError: {
    borderColor: colors.error,
  },
  countrySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    minHeight: layout.minTouchTarget,
  },
  flag: {
    fontSize: 22,
  },
  dialCode: {
    ...typography.input,
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  input: {
    flex: 1,
    ...typography.input,
    color: colors.textPrimary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...androidTextInputFix,
  },
  error: {
    marginTop: spacing.sm,
    color: colors.error,
    ...typography.caption,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: layout.radiusXl,
    borderTopRightRadius: layout.radiusXl,
    maxHeight: '60%',
    paddingBottom: spacing.xxl,
  },
  modalTitle: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
    padding: spacing.xl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    minHeight: layout.minTouchTarget,
  },
  countryName: {
    flex: 1,
    ...typography.input,
    color: colors.textPrimary,
  },
  countryDial: {
    ...typography.subtitle,
    color: colors.textSecondary,
  },
});
