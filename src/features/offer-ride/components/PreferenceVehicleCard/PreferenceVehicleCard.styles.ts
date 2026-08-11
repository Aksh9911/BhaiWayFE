import { StyleSheet } from 'react-native';

import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: layout.radiusXl,
    padding: spacing.md,
    ...createShadow({
      color: colors.shadow,
      opacity: 0.04,
      radius: 12,
      offsetY: 4,
      elevation: 2,
    }),
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cardPressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: {
    backgroundColor: colors.accentLight,
  },
  meta: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  name: {
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  plate: {
    ...typography.caption,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
