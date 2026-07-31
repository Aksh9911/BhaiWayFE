import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: layout.radiusXl,
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    ...createShadow({ opacity: 0.08, radius: 16, offsetY: 8, elevation: 4 }),
    overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.accentLight,
    borderRadius: layout.radiusSm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    fontSize: 22,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.caption,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  illustration: {
    width: '100%',
    height: 160,
    borderRadius: layout.radiusMd,
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  actionButton: {
    alignSelf: 'flex-start',
  },
});
