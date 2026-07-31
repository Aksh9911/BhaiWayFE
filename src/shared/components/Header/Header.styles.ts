import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingBottom: spacing.md,
  },
  profileContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  side: {
    width: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconPlaceholder: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    ...typography.title,
    color: colors.primary,
  },
  titlePlaceholder: {
    flex: 1,
  },
});
