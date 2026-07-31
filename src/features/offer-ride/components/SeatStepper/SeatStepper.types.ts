export interface SeatStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}
