/**
 * App-wide colour theme for BhaiWay.
 *
 * Import from `@/theme` (or `@/theme/colorTheme`) — do not hardcode brand blues
 * in screens when a token already exists here.
 */
export const colors = {
  /** Brand primary — BhaiWay blue */
  primary: '#0342D1',
  primaryDark: '#0231A0',
  /** Interactive / pressed blue */
  secondary: '#335EEA',
  accentLight: '#DADFF7',

  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceMuted: '#EFF4FF',
  white: '#FFFFFF',
  black: '#000000',

  textPrimary: '#191C1D',
  textSecondary: '#434655',
  textMuted: '#5C6276',
  textBrand: '#0342D1',
  textInverse: '#FFFFFF',
  textPlaceholder: '#76777D',

  border: '#C4C5D7',
  borderLight: '#DADFF7',
  divider: '#E5E6EC',

  disabled: '#93B5E8',
  error: '#DC2626',

  success: '#16A34A',
  successDark: '#15803D',
  successSoft: '#DCFCE7',

  warning: '#D97706',
  warningDark: '#C2410C',
  warningSoft: '#FFFBEB',

  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.4)',
  gradientGlowStart: 'rgba(3, 66, 209, 0.10)',
  gradientGlowEnd: 'rgba(255, 255, 255, 0)',
} as const;

export type AppColors = typeof colors;

/** Alias used when a screen needs a compact brand palette object. */
export const colorTheme = colors;
