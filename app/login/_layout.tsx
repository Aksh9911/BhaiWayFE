import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import { AUTH_SCREEN_INDEX } from '@/features/auth/navigation';
import { colors } from '@/shared/theme';
import { stackAnimation } from '@/shared/utils/platform';

export default function LoginLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: stackAnimation,
        contentStyle: styles.screen,
        gestureEnabled: true,
      }}
    >
      {AUTH_SCREEN_INDEX.map((screen) => (
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
