import { StyleSheet } from 'react-native';
import { colors, layout, spacing, typography } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: layout.radiusMd,
  },
  accent: {
    backgroundColor: colors.accentLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  verify: {
    backgroundColor: colors.white,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA500',
    ...createShadow({
      color: colors.shadow,
      opacity: 0.04,
      radius: 20,
      offsetY: 4,
      elevation: 3,
    }),
  },
  security: {
    backgroundColor: 'rgba(218, 223, 247, 0.3)',
    borderWidth: 1,
    borderColor: '#DADFF7',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAccent: {
    backgroundColor: 'transparent',
  },
  iconVerify: {
    backgroundColor: '#FFDBCA',
  },
  iconSecurity: {
    backgroundColor: colors.white,
    ...createShadow({ color: colors.shadow, opacity: 0.06, radius: 4, offsetY: 1, elevation: 2 }),
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.label,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  titleSecurity: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#5C6276',
  },
  description: {
    ...typography.caption,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  descriptionSecurity: {
    color: '#5C6276',
  },
  actionText: {
    ...typography.label,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  actionPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#0B1C30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginTop: 8,
  },
  actionPillLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
    color: '#F8F9FF',
  },
});
