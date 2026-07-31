import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { androidTextInputFix } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    minHeight: layout.inputHeight,
    paddingHorizontal: spacing.lg,
    ...typography.input,
    color: colors.textPrimary,
    ...androidTextInputFix,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: spacing.sm,
    color: colors.error,
    ...typography.caption,
  },
});
