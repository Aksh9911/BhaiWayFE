import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.radiusXl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...createShadow({ opacity: 0.04, radius: 10, offsetY: 4, elevation: 2 }),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.label,
    fontSize: 16,
    color: colors.textPrimary,
  },
});
