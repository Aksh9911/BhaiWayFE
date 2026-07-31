export interface DestinationConfirmPanelProps {
  name: string;
  address: string;
  hint: string;
  confirmLabel: string;
  loading?: boolean;
  disabled?: boolean;
  onConfirm: () => void;
}
