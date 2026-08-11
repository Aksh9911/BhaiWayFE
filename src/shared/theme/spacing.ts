export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  /** Space between stacked peer cards / form sections. */
  cardGap: 16,
  /** Space between major screen sections (hero → cards, section groups). */
  sectionGap: 24,
  /** Dense list rows (inbox threads, short transaction rows). */
  listGap: 12,
  screenHorizontal: 24,
  screenVertical: 16,
} as const;

export const layout = {
  inputHeight: 56,
  buttonHeight: 56,
  minTouchTarget: 44,
  otpBoxSize: 64,
  avatarSize: 120,
  logoCardSize: 96,
  logoCardRadius: 26,
  logoSize: 58,
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 14,
  radiusXl: 20,
  maxContentWidth: 520,
  buttonWidthPercent: '92%',
} as const;

export type AppSpacing = typeof spacing;
export type AppLayout = typeof layout;
