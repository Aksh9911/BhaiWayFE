import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
    ...createShadow({ color: colors.shadow, opacity: 0.06, radius: 8, offsetY: 2, elevation: 3 }),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: '#0B1C30',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 24,
  },
  footerAction: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 72,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#0B1C30',
    borderRadius: 12,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    ...createShadow({ color: colors.shadow, opacity: 0.2, radius: 16, offsetY: 6, elevation: 8 }),
  },
  confirmButtonBusy: {
    opacity: 0.85,
  },
  confirmLabel: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: colors.white,
  },
});
