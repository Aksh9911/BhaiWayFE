export interface SwipeToCompleteProps {
  label: string;
  completedLabel: string;
  completed: boolean;
  onComplete: () => void;
}
