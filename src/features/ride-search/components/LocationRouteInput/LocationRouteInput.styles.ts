import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { androidTextInputFix } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  routeIndicator: {
    width: 20,
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  routeLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.accentLight,
    marginVertical: spacing.xs,
    minHeight: 28,
  },
  originDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  fields: {
    flex: 1,
    gap: spacing.md,
  },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: layout.radiusMd,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: layout.inputHeight,
  },
  fieldContent: {
    flex: 1,
    justifyContent: 'center',
  },
  clearButton: {
    marginLeft: spacing.sm,
  },
  swapColumn: {
    justifyContent: 'center',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  fieldInput: {
    ...typography.input,
    fontSize: 16,
    color: colors.textPrimary,
    padding: 0,
    margin: 0,
    ...androidTextInputFix,
  },
  destinationPlaceholder: {
    color: colors.textPlaceholder,
  },
});
