import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { MY_RIDES_SCREEN_INDEX } from '@/features/my-rides/navigation';
import { colors } from '@/shared/theme';
import { stackAnimation, stackGestureOptions } from '@/shared/utils/platform';

export default function MyRidesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: stackAnimation,
        contentStyle: styles.screen,
        ...stackGestureOptions,
      }}
    >
      {MY_RIDES_SCREEN_INDEX.map((screen) => (
        <Stack.Screen
          key={screen.id}
          name={screen.segment}
          options={{ title: screen.title }}
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
