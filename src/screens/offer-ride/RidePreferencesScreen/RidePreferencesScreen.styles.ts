import { StyleSheet } from 'react-native';

import { colors, layout, spacing, typography } from '@/shared/theme';
import { androidTextInputFix } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.lg,
    paddingBottom: spacing.huge,
    gap: spacing.xl,
  },
  addVehicle: {
    ...typography.button,
    fontSize: 14,
    lineHeight: 20,
    color: colors.primary,
  },
  preferenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  notesWrap: {
    position: 'relative',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: layout.radiusXl,
    minHeight: 120,
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  notesInput: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    minHeight: 88,
    textAlignVertical: 'top',
    ...androidTextInputFix,
  },
  notesCounter: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.sm,
    ...typography.caption,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
  notesCounterWarn: {
    color: colors.error,
  },
  vehicleList: {
    gap: spacing.sm,
  },
  emptyVehicles: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: layout.radiusXl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  emptyVehiclesTitle: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  emptyVehiclesMessage: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  emptyAddButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
  },
});
