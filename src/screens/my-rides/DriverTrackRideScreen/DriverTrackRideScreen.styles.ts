import { StyleSheet } from 'react-native';

import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerWrap: {
    backgroundColor: colors.white,
    ...createShadow({
      color: colors.shadow,
      opacity: 0.06,
      radius: 6,
      offsetY: 2,
      elevation: 2,
    }),
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.xxl,
  },
  activeCard: {
    backgroundColor: colors.secondary,
    borderRadius: layout.radiusLg,
    padding: spacing.xxl,
    overflow: 'hidden',
  },
  activeLabel: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(234, 235, 255, 0.8)',
    marginBottom: spacing.xs,
  },
  activeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  activeMeta: {
    flex: 1,
    gap: spacing.sm,
  },
  routeTitle: {
    ...typography.title,
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.textInverse,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dateLabel: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(234, 235, 255, 0.9)',
  },
  idBadge: {
    backgroundColor: 'rgba(234, 235, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: layout.radiusSm,
  },
  idBadgeText: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.textInverse,
  },
  section: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.title,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  fillBadge: {
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  fillBadgeText: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.textMuted,
  },
  list: {
    gap: spacing.md,
  },
});
