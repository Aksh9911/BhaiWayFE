export interface ComingSoonScreenProps {
  title: string;
  message?: string;
  icon?: string;
  /** When set, shows the shared app footer with this tab highlighted. */
  footerActiveTab?: 'home' | 'rides' | 'inbox' | 'profile';
}
