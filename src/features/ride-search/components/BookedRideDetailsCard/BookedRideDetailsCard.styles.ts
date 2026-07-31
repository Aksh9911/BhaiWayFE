import { StyleSheet } from 'react-native';
import { colors } from '@/shared/theme';
import { createShadow } from '@/shared/utils/platform';

const RADIUS_XL = 12;

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: RADIUS_XL,
    borderWidth: 1,
    borderColor: '#C6C6CD',
    padding: 16,
    overflow: 'hidden',
    ...createShadow({ color: colors.shadow, opacity: 0.04, radius: 20, offsetY: 4, elevation: 2 }),
  },
  decorCircle: {
    position: 'absolute',
    top: -48,
    right: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E5EEFF',
    opacity: 0.3,
  },
  sectionLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#45464D',
    marginBottom: 16,
  },
  routeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  indicator: {
    alignItems: 'center',
    paddingTop: 4,
  },
  pickupDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  routeLine: {
    width: 2,
    height: 40,
    marginVertical: 4,
    borderStyle: 'dotted',
    borderLeftWidth: 2,
    borderColor: '#C6C6CD',
  },
  dropDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  routeText: {
    flex: 1,
    justifyContent: 'space-between',
    height: 64,
  },
  locationBlock: {
    gap: 0,
  },
  locationLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.24,
    color: '#45464D',
  },
  locationValue: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    color: '#0B1C30',
  },
  metaBlock: {
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#C6C6CD',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E5EEFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoMeta: {
    flex: 1,
    gap: 0,
  },
  infoLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.24,
    color: '#45464D',
  },
  infoValue: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: '#0B1C30',
  },
});
