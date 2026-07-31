import { StyleSheet } from 'react-native';
import { colors, layout, spacing } from '@/shared/theme';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    minHeight: layout.minTouchTarget + spacing.md * 2,
  },
  slot: {
    width: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotWide: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
});
