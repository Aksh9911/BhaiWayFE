import {
  FlatList,
  Keyboard,
  SectionList,
  ScrollView,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

type ScrollableDefaults = {
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  keyboardDismissMode?: 'none' | 'on-drag' | 'interactive';
  automaticallyAdjustKeyboardInsets?: boolean;
  onScrollBeginDrag?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
};

const dismissKeyboardOnScrollStart = (
  existing?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void,
) => {
  return (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    Keyboard.dismiss();
    existing?.(event);
  };
};

const applyScrollKeyboardDefaults = (Component: {
  defaultProps?: ScrollableDefaults | null;
}): void => {
  const previous = Component.defaultProps ?? {};
  Component.defaultProps = {
    ...previous,
    keyboardShouldPersistTaps: previous.keyboardShouldPersistTaps ?? 'handled',
    keyboardDismissMode: previous.keyboardDismissMode ?? 'on-drag',
    // Keep focused fields visible above the keyboard on plain ScrollViews.
    automaticallyAdjustKeyboardInsets: previous.automaticallyAdjustKeyboardInsets ?? true,
    onScrollBeginDrag: dismissKeyboardOnScrollStart(previous.onScrollBeginDrag),
  };
};

/**
 * Apply once at app boot so every ScrollView / FlatList / SectionList
 * dismisses the keyboard on scroll, without editing each screen.
 */
export const setupGlobalKeyboardDismiss = (): void => {
  applyScrollKeyboardDefaults(ScrollView as typeof ScrollView & {
    defaultProps?: ScrollableDefaults | null;
  });
  applyScrollKeyboardDefaults(FlatList as typeof FlatList & {
    defaultProps?: ScrollableDefaults | null;
  });
  applyScrollKeyboardDefaults(SectionList as typeof SectionList & {
    defaultProps?: ScrollableDefaults | null;
  });
};
