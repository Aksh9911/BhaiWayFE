import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  headerWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#C6C6CD',
    backgroundColor: '#F8F9FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
    gap: spacing.cardGap,
  },
  assuredNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#C6C6CD',
    borderRadius: 12,
    padding: spacing.md,
  },
  assuredNoticeText: {
    flex: 1,
    gap: 4,
  },
  assuredNoticeTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  assuredNoticeBody: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  secureText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#5C5F61',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    ...createShadow({
      color: colors.shadow,
      opacity: 0.04,
      radius: 20,
      offsetY: -4,
      elevation: 8,
    }),
  },
});
