import { StyleSheet } from 'react-native';
import { colors, layout, spacing } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
  },
  intro: {
    marginBottom: spacing.xxl,
  },
  searchCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: layout.radiusXl,
    backgroundColor: colors.white,
    padding: spacing.lg,
    gap: spacing.lg,
    ...createShadow({
      color: colors.primary,
      opacity: 0.08,
      radius: 14,
      offsetY: 4,
      elevation: 3,
    }),
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.md,
  },
  officeSearchButton: {
    backgroundColor: '#335EEA',
  },
});
