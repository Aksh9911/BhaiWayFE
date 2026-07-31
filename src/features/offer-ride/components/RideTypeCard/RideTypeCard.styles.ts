import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

const ORANGE_ACCENT = '#F97316';
const ORANGE_BADGE_BG = '#FFEDD5';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusXl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...createShadow({ opacity: 0.04, radius: 10, offsetY: 4, elevation: 2 }),
  },
  cardHighlighted: {
    borderWidth: 2,
    borderColor: colors.black,
    borderLeftWidth: 4,
    borderLeftColor: ORANGE_ACCENT,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: layout.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  iconMuted: {
    backgroundColor: colors.surfaceMuted,
  },
  iconDark: {
    backgroundColor: colors.black,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.title,
    fontSize: 20,
    color: colors.textPrimary,
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: ORANGE_BADGE_BG,
    borderRadius: layout.radiusLg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    ...typography.caption,
    color: ORANGE_ACCENT,
    fontWeight: '700',
  },
  description: {
    ...typography.subtitle,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  note: {
    ...typography.caption,
    fontStyle: 'italic',
    color: colors.error,
    marginBottom: spacing.md,
  },
});
