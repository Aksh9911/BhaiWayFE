export interface PromoCodeFieldProps {
  value: string;
  onChangeText: (value: string) => void;
  onApply: () => void;
  placeholder: string;
  applyLabel: string;
  accessibilityLabel?: string;
}
