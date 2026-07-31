export type ServiceCardVariant = 'outstation' | 'office' | 'publish';

export interface ServiceCardData {
  id: string;
  variant: ServiceCardVariant;
  badge: string;
  badgeIcon: string;
  title: string;
  subtitle: string;
  actionLabel: string;
  enabled: boolean;
}

export interface HomeLocation {
  label: string;
  city: string;
}

export interface HomeDashboard {
  location: HomeLocation;
  cardIds: string[];
}

export interface HomeViewData {
  location: HomeLocation;
  serviceCards: ServiceCardData[];
}
