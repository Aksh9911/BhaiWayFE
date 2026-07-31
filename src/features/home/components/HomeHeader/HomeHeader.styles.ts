import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    minHeight: layout.minTouchTarget + spacing.md * 2,
    gap: spacing.md,
  },
  brandBlock: {
    flex: 1,
    minWidth: 0,
  },
  brandName: {
    ...typography.title,
    fontSize: 20,
    lineHeight: 24,
    color: colors.primary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  locationText: {
    ...typography.caption,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
