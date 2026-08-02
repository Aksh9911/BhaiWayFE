export interface PickupOtpModalProps {
  visible: boolean;
  passengerName: string;
  otpLength: number;
  value: string;
  error: string | null;
  verifying: boolean;
  hintOtp?: string;
  onChange: (value: string) => void;
  onVerify: () => void;
  onClose: () => void;
}
