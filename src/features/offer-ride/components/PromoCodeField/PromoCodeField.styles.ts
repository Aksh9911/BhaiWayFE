import { StyleSheet } from 'react-native';

import { colors, layout, spacing, typography } from '@/shared/theme';
import { androidTextInputFix } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: layout.radiusXl,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    justifyContent: 'center',
  },
  input: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
    ...androidTextInputFix,
  },
  apply: {
    minHeight: 52,
    paddingHorizontal: spacing.md,
    borderRadius: layout.radiusXl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyLabel: {
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textInverse,
  },
});
