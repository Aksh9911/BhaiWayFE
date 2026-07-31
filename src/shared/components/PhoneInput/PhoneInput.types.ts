export interface PhoneInputProps {
  value: string;
  onChangeText: (value: string) => void;
  autoFocus?: boolean;
  error?: string;
}
