import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xxxl,
    alignItems: 'center',
  },
  lockWrapper: {
    marginBottom: spacing.xxl,
  },
  lockCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    ...typography.heading,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    lineHeight: 24,
  },
  otpWrapper: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  resendButton: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  resendText: {
    ...typography.caption,
    color: colors.secondary,
    textAlign: 'center',
  },
  resendDisabled: {
    color: colors.textSecondary,
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 'auto',
  },
});
