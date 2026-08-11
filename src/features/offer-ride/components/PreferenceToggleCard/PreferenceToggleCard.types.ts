import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export interface PreferenceToggleCardProps {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  selected: boolean;
  onToggle: () => void;
}
