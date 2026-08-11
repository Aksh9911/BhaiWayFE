import { StyleSheet } from 'react-native';

import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: layout.radiusXl,
    padding: spacing.md,
    gap: spacing.sm,
    ...createShadow({
      color: colors.shadow,
      opacity: 0.04,
      radius: 12,
      offsetY: 4,
      elevation: 2,
    }),
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceMuted,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  checkboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
});
