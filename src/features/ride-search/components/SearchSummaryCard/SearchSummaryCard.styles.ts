import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#C6C6CD',
    borderRadius: layout.radiusXl,
    backgroundColor: colors.white,
    padding: spacing.md,
    ...createShadow({ color: colors.shadow, opacity: 0.04, radius: 8, offsetY: 2, elevation: 2 }),
  },
  routeCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  routeIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  originDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  routeLine: {
    width: 2,
    height: 24,
    borderRadius: 999,
    backgroundColor: '#C6C6CD',
  },
  destinationRing: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  routeText: {
    flex: 1,
    gap: 4,
  },
  city: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  metaCol: {
    alignItems: 'flex-end',
    borderLeftWidth: 1,
    borderLeftColor: '#C6C6CD',
    paddingLeft: spacing.md,
    gap: 4,
  },
  dateValue: {
    ...typography.label,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  passengerValue: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
