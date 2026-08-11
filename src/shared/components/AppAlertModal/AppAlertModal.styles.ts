import { StyleSheet } from 'react-native';

import { colors, layout, spacing } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const appAlertTokens = {
  PRIMARY: colors.primary,
  PRIMARY_CONTAINER: colors.secondary,
  PRIMARY_FIXED: '#DDE1FF',
  ON_PRIMARY_CONTAINER: '#EAEBFF',
  ON_SURFACE: colors.textPrimary,
  ON_SURFACE_VARIANT: colors.textSecondary,
  OUTLINE: '#747686',
  OUTLINE_VARIANT: 'rgba(196, 197, 215, 0.25)',
  OVERLAY: 'rgba(25, 28, 29, 0.45)',
  SUCCESS: colors.successDark,
  SUCCESS_SOFT: colors.successSoft,
  ERROR: '#BA1A1A',
  ERROR_SOFT: '#FFDAD6',
  WARNING: colors.warningDark,
  WARNING_SOFT: colors.warningSoft,
} as const;

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: appAlertTokens.OVERLAY,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.white,
    borderRadius: layout.radiusXl,
    padding: spacing.xxxl,
    borderWidth: 1,
    borderColor: appAlertTokens.OUTLINE_VARIANT,
    alignItems: 'center',
    ...createShadow({
      color: colors.shadow,
      opacity: 0.12,
      radius: 28,
      offsetY: 10,
      elevation: 8,
    }),
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    color: appAlertTokens.ON_SURFACE,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    color: appAlertTokens.ON_SURFACE_VARIANT,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    maxWidth: 300,
  },
  messageOnlyTitle: {
    marginBottom: spacing.xxxl,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  button: {
    width: '100%',
    minHeight: 52,
    borderRadius: layout.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonPrimary: {
    backgroundColor: appAlertTokens.PRIMARY_CONTAINER,
  },
  buttonCancel: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#C4C5D7',
  },
  buttonDestructive: {
    backgroundColor: appAlertTokens.ERROR,
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonLabelPrimary: {
    color: appAlertTokens.ON_PRIMARY_CONTAINER,
  },
  buttonLabelCancel: {
    color: appAlertTokens.ON_SURFACE_VARIANT,
    fontWeight: '600',
  },
  buttonLabelDestructive: {
    color: colors.white,
  },
});
