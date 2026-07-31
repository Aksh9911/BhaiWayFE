export type HeaderVariant = 'light' | 'dark' | 'profile';

export interface HeaderProps {
  onBack?: () => void;
  onHelp?: () => void;
  title?: string;
  variant?: HeaderVariant;
  showBack?: boolean;
  showHelp?: boolean;
}
