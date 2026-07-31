export const typography = {
  displayLarge: {
    fontSize: 46,
    fontWeight: '800' as const,
    lineHeight: 52,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 34,
  },
  input: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  button: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  buttonCompact: {
    fontSize: 17,
    fontWeight: '700' as const,
  },
  buttonCompactMuted: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
} as const;

export type AppTypography = typeof typography;
