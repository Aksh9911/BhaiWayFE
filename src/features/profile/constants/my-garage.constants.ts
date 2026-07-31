import type { GarageVehicle } from '../types';

export const MY_GARAGE_SCREEN = {
  title: 'My Garage',
  heroEyebrow: 'Active Fleet',
  heroTitle: 'Manage Your Vehicles',
  heroSubtitle: 'Ensure your RC documents are verified for a seamless driving experience.',
  whyTitle: 'Why Verify RC?',
  whyBody:
    'Verified vehicles gain higher trust scores, attracting more passengers and ensuring compliance with regional transport regulations. Process typically takes 24-48 hours.',
  addVehicleLabel: '+ Add New Vehicle',
  comingSoonTitle: 'Coming Soon',
  comingSoonMessage: 'This garage action will be available soon.',
  vehicleActionsTitle: 'Vehicle Options',
} as const;

export const GARAGE_VEHICLES: readonly GarageVehicle[] = [
  {
    id: 'v1',
    name: 'White Swift Dzire',
    plateNumber: 'DL 01 AB 1234',
    rcStatus: 'approved',
  },
  {
    id: 'v2',
    name: 'Hyundai Creta',
    plateNumber: 'UP 16 XY 9876',
    rcStatus: 'pending',
  },
] as const;

export const VEHICLE_RC_STATUS_LABEL = {
  approved: 'RC Approved',
  pending: 'RC Verification Pending',
} as const;

export const GARAGE_WHY_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCkGxikjrNAGjb7uctQ_02cJ5W-_5wM1W9XyGhfNFI25_DdhIh0HEN1RevyiJx69IvhwXCzsFjCxOMZs61kb4gJjo3n4uZvOP2HYpQQ0T9uhfyZdkRwNZKEIcCHG_U_AaExwEYF463PAE8Q96qhSmW3y1KZksnCCLZYcVs6Rwq-Fi_02vEGLmcnjuJKNriMgHDfSlilZtUkj1jq8FPWfGT16JyFst33b-lssLrMj-Dg2xlIKT1-iY9c9690nS1pCQ7saxmygOJCOS8';
