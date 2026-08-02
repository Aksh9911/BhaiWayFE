import React, { useCallback, useEffect } from 'react';
import { LayoutChangeEvent, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { styles } from './SwipeToComplete.styles';
import type { SwipeToCompleteProps } from './SwipeToComplete.types';

const HANDLE_SIZE = 56;
const TRACK_PADDING = 4;

export const SwipeToComplete = ({
  label,
  completedLabel,
  completed,
  onComplete,
}: SwipeToCompleteProps) => {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const maxX = useSharedValue(0);
  const finished = useSharedValue(false);

  useEffect(() => {
    if (completed) {
      finished.value = true;
      translateX.value = withSpring(maxX.value);
    }
  }, [completed, finished, maxX, translateX]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const width = event.nativeEvent.layout.width;
      const nextMax = Math.max(0, width - HANDLE_SIZE - TRACK_PADDING * 2);
      maxX.value = nextMax;
      if (completed || finished.value) {
        translateX.value = nextMax;
      }
    },
    [completed, finished, maxX, translateX],
  );

  const triggerComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const pan = Gesture.Pan()
    .enabled(!completed)
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      if (finished.value) {
        return;
      }
      const next = Math.max(0, Math.min(startX.value + event.translationX, maxX.value));
      translateX.value = next;
    })
    .onEnd(() => {
      if (finished.value) {
        return;
      }
      if (translateX.value >= maxX.value - 8) {
        finished.value = true;
        translateX.value = withSpring(maxX.value);
        runOnJS(triggerComplete)();
        return;
      }
      translateX.value = withSpring(0);
    });

  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const labelStyle = useAnimatedStyle(() => {
    const progress = maxX.value > 0 ? translateX.value / maxX.value : 0;
    return {
      opacity: finished.value ? 1 : Math.max(0, 1 - progress),
    };
  });

  return (
    <View style={styles.track} onLayout={handleLayout}>
      <Animated.View style={[styles.labelWrap, labelStyle]} pointerEvents="none">
        <Text style={[styles.label, completed && styles.labelCompleted]}>
          {completed ? completedLabel : label}
        </Text>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.handle,
            completed && styles.handleCompleted,
            handleStyle,
          ]}
        >
          <Ionicons
            name={completed ? 'checkmark' : 'chevron-forward'}
            size={22}
            color="#FFFFFF"
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};
