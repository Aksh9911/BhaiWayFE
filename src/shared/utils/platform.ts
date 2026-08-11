import { Platform, type ViewStyle } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const selectPlatform = <T>(options: {
  ios?: T;
  android?: T;
  default: T;
}): T => Platform.select(options) ?? options.default;

/** iOS uses padding; Android relies on softwareKeyboardLayoutMode: resize in app.json */
export const keyboardAvoidingBehavior = selectPlatform({
  ios: 'padding' as const,
  android: undefined,
  default: undefined,
});

export const keyboardVerticalOffset = selectPlatform({
  ios: 8,
  android: 0,
  default: 0,
});

export const scrollKeyboardDismissMode = selectPlatform({
  ios: 'on-drag' as const,
  android: 'on-drag' as const,
  default: 'on-drag' as const,
});

export const stackAnimation = selectPlatform({
  ios: 'default' as const,
  android: 'slide_from_right' as const,
  default: 'default' as const,
});

/**
 * iOS edge swipe only (same as Back) — not full-screen swipe.
 * Full-screen gestures often pop the parent stack straight to Home/Login.
 */
export const stackGestureOptions = {
  gestureEnabled: true,
  fullScreenGestureEnabled: false,
  gestureDirection: 'horizontal' as const,
} as const;

/** Root-level Expo Router groups that own their own Stack. */
export const NESTED_ROOT_SEGMENTS = [
  'login',
  'ride-search',
  'office-commute',
  'offer-ride',
  'my-rides',
] as const;

export const isNestedRootSegment = (segment: string): boolean =>
  (NESTED_ROOT_SEGMENTS as readonly string[]).includes(segment);

interface ShadowOptions {
  color?: string;
  offsetY?: number;
  opacity?: number;
  radius?: number;
  elevation?: number;
}

/** Consistent card/button shadows across iOS (shadow*) and Android (elevation). */
export const createShadow = ({
  color = '#000000',
  offsetY = 4,
  opacity = 0.1,
  radius = 12,
  elevation = 4,
}: ShadowOptions = {}): ViewStyle =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
    default: {},
  }) ?? {};

/** Android TextInput extra padding fix; no-op on iOS. */
export const androidTextInputFix = selectPlatform({
  android: {
    includeFontPadding: false,
    textAlignVertical: 'center' as const,
  },
  default: {},
});
