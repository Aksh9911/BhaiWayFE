import { StyleSheet } from 'react-native';
import { colors, layout } from '@/shared/theme';

export const styles = StyleSheet.create({
  card: {
    width: layout.logoCardSize,
    height: layout.logoCardSize,
    borderRadius: layout.logoCardRadius,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  logo: {
    width: layout.logoSize,
    height: layout.logoSize,
  },
});
