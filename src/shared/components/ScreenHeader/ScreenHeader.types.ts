import type { ReactNode } from 'react';

export interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  onProfilePress?: () => void;
  right?: ReactNode;
  showBack?: boolean;
}
