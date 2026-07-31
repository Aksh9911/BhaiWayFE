export interface PassengerStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}
