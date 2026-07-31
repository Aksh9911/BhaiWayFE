import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.huge,
  },
  intro: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
  },
});
