/**
 * App-wide theme entrypoint.
 *
 * Prefer:
 *   import { colors, fonts, typography } from '@/theme'
 *   import { colors } from '@/theme/colorTheme'
 *   import { fonts, typography } from '@/theme/fontTheme'
 */
export { colors, colorTheme } from './colorTheme';
export type { AppColors } from './colorTheme';

export {
  fonts,
  fontTheme,
  typography,
  fontFamilyForWeight,
  resolveFontStyle,
  isExplicitNonBrandFont,
} from './fontTheme';
export type { AppFontFamily, AppTypography, FlattenedTextStyle } from './fontTheme';

export { spacing, layout } from '@/shared/theme/spacing';
export type { AppSpacing, AppLayout } from '@/shared/theme/spacing';

export { useBhaiWayFonts } from '@/shared/theme/useBhaiWayFonts';
