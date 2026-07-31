import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(243, 244, 245, 0.3)',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(196, 197, 215, 0.5)',
    padding: 20,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#434655',
    marginBottom: 16,
  },
  rows: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    lineHeight: 24,
    color: '#434655',
  },
  value: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#191C1D',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(196, 197, 215, 0.4)',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: '#191C1D',
  },
  totalValue: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.primary,
  },
});
