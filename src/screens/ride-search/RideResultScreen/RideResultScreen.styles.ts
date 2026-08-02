import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
    gap: spacing.md,
  },
  headerBlock: {
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.label,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  countBadge: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  countText: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.textInverse,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#C6C6CD',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  sortBlock: {
    gap: spacing.sm,
  },
  sortLabel: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
