import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: layout.inputHeight,
    gap: spacing.sm,
  },
  fieldOpen: {
    borderColor: colors.primary,
    backgroundColor: colors.accentLight,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  titleOpen: {
    color: colors.primary,
  },
  value: {
    ...typography.input,
    fontSize: 15,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textPlaceholder,
  },
});
