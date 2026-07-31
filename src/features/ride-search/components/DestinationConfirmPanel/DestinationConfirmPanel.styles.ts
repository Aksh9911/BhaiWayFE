import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.white,
    borderTopLeftRadius: layout.radiusXl,
    borderTopRightRadius: layout.radiusXl,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    ...createShadow({ color: colors.primary, opacity: 0.1, radius: 16, offsetY: -4, elevation: 8 }),
  },
  locationRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationText: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  address: {
    ...typography.caption,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  hint: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
