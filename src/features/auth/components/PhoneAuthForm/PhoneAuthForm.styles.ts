import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme';

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
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xl,
  },
  heading: {
    ...typography.heading,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
  },
  inputWrapper: {
    marginBottom: spacing.xxxl,
  },
  buttonWrapper: {
    marginTop: 'auto',
    paddingTop: spacing.xxl,
  },
});
