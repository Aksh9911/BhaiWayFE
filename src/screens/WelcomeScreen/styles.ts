import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  content: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignItems: 'center',
    alignSelf: 'center',
  },
  logoWrapper: {
    marginTop: spacing.logoMarginTop,
    alignItems: 'center',
  },
  headingContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  headingLine: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headingBrand: {
    ...typography.heading,
    color: colors.textBrand,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  description: {
    ...typography.description,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.descriptionPaddingHorizontal,
    marginTop: spacing.descriptionMarginTop,
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.buttonGap,
  },
});
