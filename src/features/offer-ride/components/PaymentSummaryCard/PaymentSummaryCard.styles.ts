import { StyleSheet } from 'react-native';

import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusXl,
    padding: spacing.md,
    gap: spacing.sm,
    ...createShadow({
      color: colors.shadow,
      opacity: 0.04,
      radius: 8,
      offsetY: 2,
      elevation: 2,
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  muted: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  value: {
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  hint: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
    marginTop: 2,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  totalLabel: {
    ...typography.title,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.title,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.primary,
  },
});
