import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  base: {
    height: layout.buttonHeight,
    borderRadius: layout.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: colors.primary,
    ...createShadow({
      color: colors.primary,
      offsetY: 6,
      opacity: 0.28,
      radius: 10,
      elevation: 6,
    }),
  },
  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  dark: {
    backgroundColor: colors.black,
    ...createShadow({
      color: colors.black,
      offsetY: 4,
      opacity: 0.2,
      radius: 8,
      elevation: 4,
    }),
  },
  accent: {
    backgroundColor: colors.accentLight,
  },
  disabled: {
    backgroundColor: colors.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  labelPrimary: {
    ...typography.button,
    color: colors.textInverse,
  },
  labelSecondary: {
    ...typography.button,
    color: colors.textMuted,
  },
  labelAccent: {
    ...typography.button,
    color: colors.primary,
  },
});
