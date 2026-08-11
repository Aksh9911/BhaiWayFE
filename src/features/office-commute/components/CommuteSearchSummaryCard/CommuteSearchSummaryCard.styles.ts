import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF4FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C6C6CD',
    padding: 16,
    gap: 12,
    ...createShadow({ color: colors.shadow, opacity: 0.04, radius: 8, offsetY: 2, elevation: 2 }),
  },
  content: {
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#45464D',
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#C6C6CD',
  },
  editButton: {
    backgroundColor: '#D3E4FE',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  editLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
    color: '#191C1D',
  },
});
