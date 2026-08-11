import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xxl,
  },
  sectionCards: {
    marginBottom: spacing.xxl,
    marginTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  heading: {
    ...typography.caption,
    color: colors.primary,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    fontWeight: '700',
  },
  headingCards: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#191C1D',
    textTransform: 'none',
    letterSpacing: 0,
    marginBottom: 0,
  },
  clearAll: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
    color: '#7C839B',
  },
  list: {
    gap: spacing.listGap,
  },
  item: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.cardGap,
    backgroundColor: '#EFF4FF',
    borderRadius: 8,
    padding: 16,
    borderWidth: 0,
    marginBottom: 0,
    minHeight: undefined,
  },
  iconWrap: {
    backgroundColor: '#D3E4FE',
    padding: 8,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  routeLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
    color: '#191C1D',
  },
  route: {
    ...typography.input,
    fontSize: 15,
    color: colors.textPrimary,
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  metaCard: {
    fontSize: 14,
    lineHeight: 20,
    color: '#45464D',
    marginTop: 0,
  },
  empty: {
    fontSize: 14,
    lineHeight: 20,
    color: '#45464D',
    paddingVertical: 8,
  },
});
