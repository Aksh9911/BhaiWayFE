import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(29, 78, 216, 0.28)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: layout.radiusXl,
    borderTopRightRadius: layout.radiusXl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.screenHorizontal,
    ...createShadow({ color: colors.primary, opacity: 0.12, radius: 16, offsetY: -2, elevation: 8 }),
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accentLight,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    fontSize: 18,
    color: colors.primary,
    flex: 1,
  },
  done: {
    ...typography.label,
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  pickerWrap: {
    borderWidth: 1.5,
    borderColor: colors.accentLight,
    borderRadius: layout.radiusLg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  picker: {
    alignSelf: 'center',
    width: '100%',
  },
});
