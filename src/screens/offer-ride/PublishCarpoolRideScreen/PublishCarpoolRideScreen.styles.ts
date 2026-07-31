import { StyleSheet } from 'react-native';
import { colors, layout, spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.huge,
  },
  intro: {
    marginBottom: spacing.xl,
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: layout.radiusXl,
    backgroundColor: colors.surfaceMuted,
  },
});
