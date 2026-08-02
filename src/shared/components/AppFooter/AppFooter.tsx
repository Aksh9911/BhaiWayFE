import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { TAB_ROUTES } from '@/navigation';
import { colors } from '@/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { styles } from './AppFooter.styles';
import type { AppFooterItem, AppFooterProps, AppFooterTabId } from './AppFooter.types';

export const APP_FOOTER_ITEMS: readonly AppFooterItem[] = [
  { id: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { id: 'rides', label: 'My Rides', icon: 'car-outline', activeIcon: 'car' },
  { id: 'inbox', label: 'Inbox', icon: 'chatbubble-outline', activeIcon: 'chatbubble' },
  { id: 'profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
] as const;

export const AppFooter = React.memo(({ activeTab }: AppFooterProps) => {
  const router = useRouter();

  const handlePress = useCallback(
    (id: AppFooterTabId) => {
      triggerLightHaptic();

      if (id === activeTab) {
        return;
      }

      if (id === 'home') {
        router.replace(TAB_ROUTES.home);
        return;
      }

      if (id === 'inbox') {
        router.replace(TAB_ROUTES.inbox);
        return;
      }

      if (id === 'profile') {
        router.replace(TAB_ROUTES.profile);
        return;
      }

      if (id === 'rides') {
        router.push(TAB_ROUTES.rides);
      }
    },
    [activeTab, router],
  );

  return (
    <View style={styles.container} accessibilityRole="tablist">
      {APP_FOOTER_ITEMS.map((item) => {
        const active = item.id === activeTab;
        return (
          <Pressable
            key={item.id}
            style={styles.item}
            onPress={() => handlePress(item.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={item.label}
          >
            <Ionicons
              name={active ? item.activeIcon : item.icon}
              size={24}
              color={active ? colors.primary : '#45464D'}
            />
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
});

AppFooter.displayName = 'AppFooter';
