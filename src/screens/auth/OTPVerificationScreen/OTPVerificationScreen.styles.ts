import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xs,
    minHeight: 44,
  },
  topBarSpacer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xl,
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
    color: colors.textPrimary,
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
