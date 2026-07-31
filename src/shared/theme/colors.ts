export const colors = {
  primary: '#1D4ED8',
  primaryDark: '#1E40AF',
  secondary: '#3B82F6',
  accentLight: '#DBEAFE',

  background: '#FFFFFF',
  surface: '#F9FAFB',
  surfaceMuted: '#F3F4F6',
  white: '#FFFFFF',
  black: '#000000',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#5B6170',
  textBrand: '#1D4ED8',
  textInverse: '#FFFFFF',
  textPlaceholder: '#9CA3AF',

  border: '#D1D5DB',
  borderLight: '#D8D8E2',
  divider: '#ECECEC',

  disabled: '#93B5E8',
  error: '#DC2626',

  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.4)',
  gradientGlowStart: 'rgba(29, 78, 216, 0.10)',
  gradientGlowEnd: 'rgba(255, 255, 255, 0)',
} as const;

export type AppColors = typeof colors;
