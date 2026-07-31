import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type AppFooterTabId = 'home' | 'rides' | 'inbox' | 'profile';

export interface AppFooterItem {
  id: AppFooterTabId;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  activeIcon: ComponentProps<typeof Ionicons>['name'];
}

export interface AppFooterProps {
  /** Currently highlighted tab. */
  activeTab?: AppFooterTabId;
}
