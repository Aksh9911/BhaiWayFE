import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusXl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(198, 198, 205, 0.3)',
    ...createShadow({ color: colors.shadow, opacity: 0.04, radius: 20, offsetY: 4, elevation: 3 }),
  },
  title: {
    ...typography.label,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  value: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  discount: {
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#C6C6CD',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  totalLabel: {
    ...typography.label,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.title,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});
