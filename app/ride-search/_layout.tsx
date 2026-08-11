import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { RIDE_SEARCH_SCREEN_INDEX } from '@/features/ride-search/navigation';
import { colors } from '@/shared/theme';
import { stackAnimation, stackGestureOptions } from '@/shared/utils/platform';

const TERMINAL_SEGMENTS = new Set(['cancel-confirmed', 'feedback-submitted']);

export default function RideSearchLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: stackAnimation,
        contentStyle: styles.screen,
        ...stackGestureOptions,
      }}
    >
      {RIDE_SEARCH_SCREEN_INDEX.map((screen) => (
        <Stack.Screen
          key={screen.id}
          name={screen.segment}
          options={{
            title: screen.title,
            gestureEnabled: !TERMINAL_SEGMENTS.has(screen.segment),
            fullScreenGestureEnabled: false,
          }}
        />
      ))}
    </Stack>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
  },
});
