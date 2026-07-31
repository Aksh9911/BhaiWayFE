import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    borderRadius: layout.radiusLg,
    overflow: 'hidden',
    backgroundColor: colors.white,
  },
  map: {
    height: 160,
    width: '100%',
  },
  originMarker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    ...createShadow({ color: colors.primary, opacity: 0.3, radius: 4, offsetY: 1, elevation: 3 }),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statText: {
    ...typography.label,
    fontSize: 14,
    color: colors.textPrimary,
  },
  statCaption: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    backgroundColor: colors.border,
  },
  statTextCol: {
    gap: 1,
  },
});
