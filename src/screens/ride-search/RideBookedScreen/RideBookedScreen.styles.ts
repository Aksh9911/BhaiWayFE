import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

/** Design tokens from Ride Booked HTML reference */
const SURFACE = '#F8F9FF';
const ON_SURFACE = '#0B1C30';
const ON_SURFACE_VARIANT = '#45464D';
const OUTLINE_VARIANT = '#C6C6CD';
const SURFACE_CONTAINER = '#E5EEFF';
const SURFACE_CONTAINER_LOW = '#EFF4FF';
const RADIUS_XL = 12;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: SURFACE,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: SURFACE,
    ...createShadow({
      color: colors.shadow,
      opacity: 0.06,
      radius: 4,
      offsetY: 1,
      elevation: 2,
    }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  brandName: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.24,
    color: colors.primary,
  },
  avatarBorder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: OUTLINE_VARIANT,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  checkWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...createShadow({
      color: colors.primary,
      opacity: 0.3,
      radius: 16,
      offsetY: 8,
      elevation: 8,
    }),
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700',
    color: ON_SURFACE,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    color: ON_SURFACE_VARIANT,
    textAlign: 'center',
  },
  assuredRefund: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: SURFACE_CONTAINER_LOW,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: RADIUS_XL,
    padding: 16,
    marginBottom: 16,
  },
  assuredRefundText: {
    fontSize: 13,
    lineHeight: 18,
    color: ON_SURFACE,
    flex: 1,
  },
  detailsCardWrap: {
    marginBottom: 16,
  },
  driverWrap: {
    marginBottom: 32,
  },
  cancelNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFF7ED',
    borderRadius: RADIUS_XL,
    padding: 12,
    marginBottom: 16,
  },
  cancelNoteText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#9A3412',
    flex: 1,
  },
  actions: {
    paddingTop: 24,
    gap: 16,
  },
  trackButton: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow({
      color: colors.primary,
      opacity: 0.28,
      radius: 12,
      offsetY: 6,
      elevation: 6,
    }),
  },
  trackLabel: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.white,
  },
  detailsButton: {
    width: '100%',
    height: 56,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: OUTLINE_VARIANT,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsLabel: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: ON_SURFACE,
  },
});

export const bookedTokens = {
  SURFACE,
  ON_SURFACE,
  ON_SURFACE_VARIANT,
  OUTLINE_VARIANT,
  SURFACE_CONTAINER,
  SURFACE_CONTAINER_LOW,
  RADIUS_XL,
} as const;
