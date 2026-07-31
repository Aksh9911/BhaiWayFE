import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#F8F9FF',
    borderTopWidth: 1,
    borderTopColor: '#C6C6CD',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.24,
    color: '#45464D',
  },
  labelActive: {
    fontWeight: '700',
    color: colors.primary,
  },
});
