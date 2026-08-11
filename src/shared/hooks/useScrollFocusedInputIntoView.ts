import { useCallback, useEffect, useRef } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  TextInput,
  type KeyboardEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollView,
} from 'react-native';

const FOCUS_GAP = 32;

type Scrollable = ScrollView & {
  measureInWindow?: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

type FocusedInput = {
  measureInWindow?: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

/**
 * Keeps the focused TextInput visible above the keyboard by scrolling
 * the provided ScrollView when the field would otherwise be covered.
 */
export const useScrollFocusedInputIntoView = (
  scrollRef: React.RefObject<ScrollView | null>,
  options: { enabled?: boolean; extraBottomOffset?: number } = {},
) => {
  const { enabled = true, extraBottomOffset = 0 } = options;
  const keyboardTopRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const extraBottomOffsetRef = useRef(extraBottomOffset);
  extraBottomOffsetRef.current = extraBottomOffset;

  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
  }, []);

  const scrollFocusedIntoView = useCallback(() => {
    if (!enabled) {
      return;
    }

    const scrollNode = scrollRef.current as Scrollable | null;
    if (!scrollNode?.measureInWindow) {
      return;
    }

    const focusedRaw =
      typeof TextInput.State?.currentlyFocusedInput === 'function'
        ? TextInput.State.currentlyFocusedInput()
        : null;
    const focused = focusedRaw as FocusedInput | null;
    if (!focused?.measureInWindow) {
      return;
    }

    const keyboardTop = keyboardTopRef.current;
    if (keyboardTop <= 0) {
      return;
    }

    focused.measureInWindow((_fx, fy, _fw, fh) => {
      scrollNode.measureInWindow?.((_sx, sy, _sw, sh) => {
        const fieldBottom = fy + fh;
        const visibleBottom =
          Math.min(sy + sh, keyboardTop) - FOCUS_GAP - extraBottomOffsetRef.current;
        if (fieldBottom <= visibleBottom) {
          return;
        }

        const nextY = Math.max(0, scrollOffsetRef.current + (fieldBottom - visibleBottom));
        scrollNode.scrollTo({ y: nextY, animated: true });
      });
    });
  }, [enabled, scrollRef]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEvent) => {
      // Prefer screenY — reliable on Android adjustResize where window height already shrinks.
      const screenY = event.endCoordinates?.screenY;
      keyboardTopRef.current =
        typeof screenY === 'number' && screenY > 0
          ? screenY
          : Dimensions.get('window').height - (event.endCoordinates?.height ?? 0);
      requestAnimationFrame(() => {
        setTimeout(scrollFocusedIntoView, Platform.OS === 'ios' ? 60 : 120);
      });
    };

    const onHide = () => {
      keyboardTopRef.current = 0;
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [enabled, scrollFocusedIntoView]);

  return { scrollFocusedIntoView, onScroll };
};
