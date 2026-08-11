import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#EFF4FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C6C6CD',
    padding: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarRing: {
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 24,
    ...createShadow({ color: colors.shadow, opacity: 0.08, radius: 4, offsetY: 1, elevation: 2 }),
  },
  meta: {
    flex: 1,
    gap: 0,
  },
  name: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
    color: '#191C1D',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: '#45464D',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#C6C6CD',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
