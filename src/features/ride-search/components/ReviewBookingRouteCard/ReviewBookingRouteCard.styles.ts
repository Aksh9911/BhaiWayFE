import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusXl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(198, 198, 205, 0.3)',
    ...createShadow({ color: colors.shadow, opacity: 0.04, radius: 20, offsetY: 4, elevation: 3 }),
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  indicatorCol: {
    alignItems: 'center',
    paddingTop: 6,
    gap: 4,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 40,
    backgroundColor: '#C6C6CD',
  },
  contentCol: {
    flex: 1,
    gap: spacing.lg,
  },
  locationBlock: {
    gap: 4,
  },
  locationText: {
    flex: 1,
    gap: 4,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textSecondary,
  },
  edit: {
    ...typography.label,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.primary,
  },
  address: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
