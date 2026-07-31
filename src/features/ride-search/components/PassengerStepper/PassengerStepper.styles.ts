import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  field: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: layout.inputHeight,
    justifyContent: 'center',
  },
  title: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceMuted,
  },
  value: {
    flex: 1,
    textAlign: 'center',
    ...typography.input,
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
