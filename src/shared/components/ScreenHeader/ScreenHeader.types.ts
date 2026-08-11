import type { ReactNode } from 'react';

export interface ScreenHeaderProps {
  title: string;
  onBack: () => void;
  /** Opens notifications. Defaults to `/notifications`. */
  onNotificationsPress?: () => void;
  right?: ReactNode;
  showBack?: boolean;
}
