import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  section: {
    marginTop: spacing.xl,
  },
  heading: {
    ...typography.label,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  scrollContent: {
    gap: spacing.md,
    paddingRight: spacing.screenHorizontal,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusLg,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
    ...createShadow({ color: colors.primary, opacity: 0.06, radius: 8, offsetY: 2, elevation: 2 }),
  },
  emoji: {
    fontSize: 20,
  },
  textCol: {
    gap: 1,
  },
  label: {
    ...typography.label,
    fontSize: 14,
    color: colors.textPrimary,
  },
  place: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    maxWidth: 140,
  },
});
