import { StyleSheet } from 'react-native';

import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.warningSoft,
    borderRadius: layout.radiusXl,
    padding: spacing.md,
  },
  text: {
    flex: 1,
    ...typography.caption,
    fontSize: 14,
    lineHeight: 20,
    color: colors.warningDark,
  },
  prefix: {
    fontWeight: '700',
  },
});
