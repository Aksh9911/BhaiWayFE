export type DropdownOption<T extends string | number = string> = {
  value: T;
  label: string;
};

export interface DropdownProps<T extends string | number = string> {
  visible: boolean;
  title: string;
  options: readonly DropdownOption<T>[];
  selectedValue: T | null;
  onSelect: (value: T) => void;
  onClose: () => void;
}

export interface DropdownFieldProps {
  label: string;
  valueLabel: string;
  placeholder?: string;
  open: boolean;
  onPress: () => void;
  icon?: React.ComponentProps<typeof import('@expo/vector-icons').Ionicons>['name'];
  accessibilityLabel?: string;
}
