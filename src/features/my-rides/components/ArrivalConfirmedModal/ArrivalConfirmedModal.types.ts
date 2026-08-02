export interface ArrivalConfirmedModalProps {
  visible: boolean;
  passengerName: string;
  isLastStop: boolean;
  onContinue: () => void;
}
