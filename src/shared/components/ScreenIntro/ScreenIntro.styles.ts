import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.xxl,
  },
  centered: {
    alignItems: 'center',
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
  },
  titleCentered: {
    textAlign: 'center',
  },
  titleDefault: {
    fontSize: 32,
    lineHeight: 40,
  },
  titleLarge: {
    fontSize: 34,
    lineHeight: 40,
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  subtitleCentered: {
    textAlign: 'center',
  },
});
