import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

export const styles = StyleSheet.create({
  container: {
    height: 240,
    width: '100%',
    backgroundColor: '#E5EEFF',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  statsCard: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C6C6CD',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...createShadow({ color: colors.shadow, opacity: 0.1, radius: 12, offsetY: 4, elevation: 4 }),
  },
  statCol: {
    flex: 1,
    gap: 2,
  },
  statCenter: {
    alignItems: 'center',
  },
  statEnd: {
    alignItems: 'flex-end',
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#45464D',
  },
  statValue: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#191C1D',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: '#C6C6CD',
    marginHorizontal: 8,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#D3E4FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  matchBadgeText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.1,
    color: '#191C1D',
  },
  matchCaption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
    color: '#45464D',
    marginTop: 4,
  },
});
