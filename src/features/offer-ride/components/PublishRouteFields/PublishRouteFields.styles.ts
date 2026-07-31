import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  indicator: {
    width: 20,
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
    minHeight: 28,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    backgroundColor: colors.white,
  },
  fields: {
    flex: 1,
    gap: spacing.md,
  },
  field: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: layout.inputHeight,
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.input,
    fontSize: 16,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.textPlaceholder,
  },
});
