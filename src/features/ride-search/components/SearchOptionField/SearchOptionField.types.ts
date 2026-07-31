export interface SearchOptionFieldProps {
  icon: React.ComponentProps<typeof import('@expo/vector-icons').Ionicons>['name'];
  title: string;
  value: string;
  onPress: () => void;
  accessibilityLabel?: string;
  isPlaceholder?: boolean;
  open?: boolean;
}
