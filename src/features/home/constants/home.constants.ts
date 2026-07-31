import type { HomeLocation, ServiceCardData } from '../types';

export const HOME_GREETING = {
  prefix: 'Hi',
  subtitle: 'Where are we heading today?',
} as const;

export const DEFAULT_HOME_LOCATION: HomeLocation = {
  label: 'Locating…',
  city: '',
};

export const HOME_SERVICE_CARDS: readonly ServiceCardData[] = [
  {
    id: 'outstation-carpool',
    variant: 'outstation',
    badge: 'Intercity',
    badgeIcon: 'car-sport-outline',
    title: 'Outstation Carpool',
    subtitle: 'Share rides, split costs, and travel comfortably across cities.',
    actionLabel: 'Book Now',
    enabled: true,
  },
  {
    id: 'daily-office-commute',
    variant: 'office',
    badge: 'Office',
    badgeIcon: 'briefcase-outline',
    title: 'Daily Office Commute',
    subtitle: 'Find trusted companions for your daily office routes. Build connections while saving on travel.',
    actionLabel: 'Book Now!',
    enabled: true,
  },
  {
    id: 'publish-carpool-ride',
    variant: 'publish',
    badge: 'Driver',
    badgeIcon: 'add-circle-outline',
    title: 'Publish Carpool Ride',
    subtitle: 'Share your journey, reduce traffic, and earn on your daily commute.',
    actionLabel: 'Publish Ride',
    enabled: true,
  },
] as const;

export const HOME_MOCK_DELAY_MS = 500;
