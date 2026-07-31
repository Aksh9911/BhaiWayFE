import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  card: {
    width: '100%',
    minHeight: layout.inputHeight,
    borderRadius: layout.radiusMd,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unselected: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
  label: {
    ...typography.input,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  labelSelected: {
    color: colors.textInverse,
  },
});
