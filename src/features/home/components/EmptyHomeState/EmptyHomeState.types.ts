export type EmptyHomeVariant = 'error' | 'empty';

export interface EmptyHomeStateProps {
  variant?: EmptyHomeVariant;
  title?: string;
  message?: string;
  onRetry?: () => void;
}
