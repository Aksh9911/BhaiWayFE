import { StyleSheet } from 'react-native';
import { colors, layout, spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  card: {
    borderRadius: layout.radiusXl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accentLight,
  },
  lineGroup: {
    flex: 1,
    gap: spacing.sm,
  },
  line: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accentLight,
  },
  lineShort: {
    width: '40%',
  },
  lineMedium: {
    width: '65%',
  },
  priceBlock: {
    width: 64,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.accentLight,
  },
  infoBox: {
    height: 56,
    borderRadius: layout.radiusMd,
    backgroundColor: '#EFF4FF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatLine: {
    width: 100,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accentLight,
  },
  button: {
    width: 120,
    height: 44,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.accentLight,
  },
});
