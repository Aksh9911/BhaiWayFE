import { StyleSheet } from 'react-native';

import { colors, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerWrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
    gap: spacing.cardGap,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  secureText: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  footer: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    ...createShadow({
      color: colors.shadow,
      opacity: 0.04,
      radius: 20,
      offsetY: -4,
      elevation: 8,
    }),
  },
});
