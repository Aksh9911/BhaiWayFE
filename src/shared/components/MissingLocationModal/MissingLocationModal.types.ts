export type MissingLocationKind = 'origin' | 'destination' | 'both';

export type MissingLocationContext = 'ride' | 'drive' | 'commute';

export interface MissingLocationModalProps {
  visible: boolean;
  kind: MissingLocationKind | null;
  context?: MissingLocationContext;
  onClose: () => void;
  onSelect?: () => void;
}
