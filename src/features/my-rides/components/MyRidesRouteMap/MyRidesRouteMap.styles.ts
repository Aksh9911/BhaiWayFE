import { StyleSheet } from 'react-native';

import { colors } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E7E8E9',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  badge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    maxWidth: '70%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    ...createShadow({ color: colors.shadow, opacity: 0.1, radius: 6, offsetY: 2, elevation: 2 }),
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    color: '#191C1D',
  },
  expandBtn: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...createShadow({ color: colors.shadow, opacity: 0.14, radius: 8, offsetY: 2, elevation: 3 }),
  },
});
