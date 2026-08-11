import {
  Comfortaa_300Light,
  Comfortaa_400Regular,
  Comfortaa_500Medium,
  Comfortaa_600SemiBold,
  Comfortaa_700Bold,
} from '@expo-google-fonts/comfortaa';
import { useFonts } from 'expo-font';

import { fonts } from '@/theme/fontTheme';

/** Loads BhaiWay brand fonts (Comfortaa). Returns [loaded, error]. */
export const useBhaiWayFonts = () =>
  useFonts({
    [fonts.light]: Comfortaa_300Light,
    [fonts.regular]: Comfortaa_400Regular,
    [fonts.medium]: Comfortaa_500Medium,
    [fonts.semiBold]: Comfortaa_600SemiBold,
    [fonts.bold]: Comfortaa_700Bold,
  });
