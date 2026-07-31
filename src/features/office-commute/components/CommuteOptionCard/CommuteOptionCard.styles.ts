import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusXl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    ...createShadow({ opacity: 0.06, radius: 14, offsetY: 6, elevation: 3 }),
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    backgroundColor: colors.surfaceMuted,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    borderRadius: layout.radiusLg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgePrimary: {
    backgroundColor: colors.primary,
  },
  badgeLight: {
    backgroundColor: colors.accentLight,
  },
  badgeTextPrimary: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeTextLight: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  body: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
    flex: 1,
    paddingRight: spacing.md,
  },
  description: {
    ...typography.subtitle,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  actionText: {
    ...typography.label,
    color: colors.primary,
  },
});
