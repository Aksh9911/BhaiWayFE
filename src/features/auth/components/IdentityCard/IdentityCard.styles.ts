import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusLg,
    backgroundColor: colors.white,
    overflow: 'hidden',
    flexDirection: 'row',
    marginTop: spacing.xxl,
  },
  accentBar: {
    width: 5,
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  illustration: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: spacing.xs,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personIcon: {
    marginTop: spacing.sm,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    ...typography.button,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  verifyButton: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: layout.radiusSm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    alignSelf: 'flex-start',
    minHeight: layout.minTouchTarget,
  },
  verifyLabel: {
    ...typography.button,
    fontSize: 16,
    color: colors.textInverse,
  },
});
