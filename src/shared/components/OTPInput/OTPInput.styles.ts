import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  codeFieldRoot: {
    gap: spacing.md,
    justifyContent: 'center',
  },
  cell: {
    borderRadius: layout.radiusSm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    ...typography.title,
    fontSize: 28,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  error: {
    marginTop: spacing.md,
    color: colors.error,
    ...typography.caption,
    textAlign: 'center',
  },
});
