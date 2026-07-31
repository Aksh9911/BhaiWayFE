export interface NativeDatePickerProps {
  visible: boolean;
  value: Date;
  minimumDate?: Date;
  maximumDate?: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  title?: string;
  mode?: 'date' | 'time';
}
