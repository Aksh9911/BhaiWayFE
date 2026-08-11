import type { CommuteRideResultItem } from '../types/commute-ride-result.types';

export const COMMUTE_RIDE_RESULT_SCREEN = {
  title: 'Available Rides',
  editLabel: 'Edit',
  bookLabel: 'Request to Join',
  requestingLabel: 'Requesting...',
  requestedLabel: 'Requested',
  requestSuccessToast: 'Ride request sent successfully!',
  verifiedBadge: 'Verified Corporate ID',
  unverifiedBadge: 'Un-verified',
  priceCaption: 'per seat',
  departureLabel: 'Departure',
  sameOrganizationBadge: 'Same Organization',
  emptyTitle: 'No commute rides found',
  emptySubtitle: 'Try a different time or route to find colleagues heading your way.',
} as const;

export const MOCK_COMMUTE_RIDE_RESULTS: readonly CommuteRideResultItem[] = [
  {
    id: 'commute-ride-1',
    rideType: 'assured',
    driver: {
      id: 'commute-driver-1',
      name: 'Arjun Sharma',
      rating: 4.8,
      verified: true,
      yearsDriving: 5,
      avatarUri:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBGXEwV_CL7Qtrocw_tFFcvkUvSpKJKLvziJF_aBJ6ybdW-Z-8GRWWZpBnCSUBVEjWJMosTdTNvpvMhqLMnhbF-rqWyrXUVOP9vaxaxa8fQN0FIizEX1CiLeko1knCs4UUktdy59CXh4gesUClsjt5lYsY-tldW_JxAwylrU5l1kNb4OHMptvBV2QEgb7WYwPaHThpG2V7dc6rbJJ00ERArRPCy1SVVj7pNELaagzXQfY5RoxE6jeWRCMu6stte6g-_sa68sShYgzU',
    },
    price: 150,
    departureTime: '06:45 PM',
    carModel: 'Honda City',
    vehicleColor: 'White',
    seatsLeft: 2,
    seatsNote: 'Shared by 2 others',
    organization: 'Acme Corp',
    ac: true,
    luggage: 'Medium',
    originCity: 'Cyber City',
    destinationCity: 'Noida Sector 62',
    distanceKm: 28,
    durationMinutes: 45,
    durationLabel: '45 mins',
    preferences: [],
    features: [],
  },
  {
    id: 'commute-ride-2',
    rideType: 'regular',
    driver: {
      id: 'commute-driver-2',
      name: 'Priya Verma',
      rating: 4.9,
      verified: true,
      yearsDriving: 4,
      avatarUri:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB0uF-fl3C9CqU4TKuJAj7mjfIeldUgSBQ4eMI_Enmaa5o4ZX2Tyghin95hYBmPxNH1HEPDUv_gPCvs2HCdibKUOQyFPdsLp6AJQ3EpJgojq2X7ZWs857VfQAB6LyUvmi67bHCDVeptyii-ACVEALMyzP_5MXtwRfLw40p7bz1x_B53qVrBXh68DJO71zykKSkjNG-NGiA3agLk-STH1gT8HLAZmv1pTzglWLkqhqDkzoezcmQLht94qvAiPZEqS5yP-C2wH2i7yys',
    },
    price: 180,
    departureTime: '07:10 PM',
    carModel: 'Hyundai Creta',
    vehicleColor: 'Black',
    seatsLeft: 3,
    seatsNote: 'Direct ride',
    organization: 'BhaiWay',
    ac: true,
    luggage: 'Large',
    originCity: 'Cyber City',
    destinationCity: 'Noida Sector 62',
    distanceKm: 28,
    durationMinutes: 40,
    durationLabel: '40 mins',
    preferences: [],
    features: [],
  },
  {
    id: 'commute-ride-3',
    rideType: 'regular',
    driver: {
      id: 'commute-driver-3',
      name: 'Rahul Kapoor',
      rating: 4.6,
      verified: false,
      yearsDriving: 3,
      avatarUri:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA0pjRMGgrgfJZifzKDMb_3xu7M6djaPuNDYiAfv2TsGsxy2riCfBZklQX0P4tlmPQto-tiLUK10dFCmbnuK1x3Jwx5ATlByROxV1qx8GVNSSYpeWDrTrJ8juWWtaHofZpJatFtvohGlLAs0VC9561tWzF07M6FCHmEFBJMxdat8GOLgZzg2vk4EGAj4Bv_TR7ul5IP6v5cDwbndDzUFd0SrimeHmLLWabJUvwResAwXTX7EUEX2XEouZaCmaMNy_8nYMt7bFGqUFw',
    },
    price: 120,
    departureTime: '06:55 PM',
    carModel: 'Maruti Swift',
    vehicleColor: 'Grey',
    seatsLeft: 1,
    seatsNote: '1 pick-up on way',
    organization: 'Globex',
    ac: true,
    luggage: 'Small',
    originCity: 'Cyber City',
    destinationCity: 'Noida Sector 62',
    distanceKm: 30,
    durationMinutes: 50,
    durationLabel: '50 mins',
    preferences: [],
    features: [],
  },
] as const;

export const getCommuteRideResultPath = (params: {
  origin: string;
  destination: string;
  dateLabel: string;
  timeLabel: string;
  sameOrganizationOnly?: boolean;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}) => ({
  pathname: '/office-commute/result' as const,
  params: {
    origin: params.origin,
    destination: params.destination,
    dateLabel: params.dateLabel,
    timeLabel: params.timeLabel,
    sameOrganizationOnly: params.sameOrganizationOnly ? 'true' : 'false',
    originLat: params.originLat != null ? String(params.originLat) : '',
    originLng: params.originLng != null ? String(params.originLng) : '',
    destinationLat: params.destinationLat != null ? String(params.destinationLat) : '',
    destinationLng: params.destinationLng != null ? String(params.destinationLng) : '',
  },
});
