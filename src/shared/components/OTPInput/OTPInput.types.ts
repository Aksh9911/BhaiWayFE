export interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  cellCount?: number;
  error?: string;
}
