import { StyleSheet } from 'react-native';

import { colors } from '@/shared/theme';

export const createAvatarStyles = (size: number) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: colors.accentLight,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });
