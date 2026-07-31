import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  headerBlock: {
    gap: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#0B1C30',
  },
  separator: {
    height: 16,
  },
  skeletonStack: {
    gap: 16,
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
    color: '#0B1C30',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#45464D',
    textAlign: 'center',
    maxWidth: 280,
  },
});
