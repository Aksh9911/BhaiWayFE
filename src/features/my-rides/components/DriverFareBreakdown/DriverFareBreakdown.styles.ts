import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  list: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: colors.border,
    paddingTop: spacing.xl,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  label: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  value: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  valueHighlight: {
    color: colors.primary,
  },
});
