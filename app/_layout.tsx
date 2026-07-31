import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ROOT_SCREEN_INDEX } from '@/config';
import { setAuthTokenProvider } from '@/network';
import { authSession } from '@/store';
import { colors } from '@/shared/theme';
import { stackAnimation } from '@/shared/utils/platform';

setAuthTokenProvider(() => authSession.getToken());

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: stackAnimation,
            contentStyle: styles.screen,
            gestureEnabled: true,
            fullScreenGestureEnabled: true,
          }}
        >
          {ROOT_SCREEN_INDEX.map((screen) => (
            <Stack.Screen
              key={screen.id}
              name={screen.segment}
              options={{ title: screen.title }}
            />
          ))}
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    backgroundColor: colors.background,
  },
});
