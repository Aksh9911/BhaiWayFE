import { StyleSheet } from 'react-native';

import { spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  headerBlock: {
    gap: spacing.sectionGap,
    marginBottom: spacing.cardGap,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#191C1D',
  },
  separator: {
    height: spacing.cardGap,
  },
  skeletonStack: {
    gap: spacing.cardGap,
  },
  skeletonCard: {
    height: 280,
    borderRadius: 12,
    backgroundColor: '#E5EEFF',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: '#191C1D',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#45464D',
    textAlign: 'center',
    maxWidth: 280,
  },
});
