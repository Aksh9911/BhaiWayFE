import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#C6C6CD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: '#EFF4FF',
    borderColor: colors.primary,
  },
  chipLabel: {
    ...typography.caption,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipLabelSelected: {
    color: colors.primary,
  },
});
