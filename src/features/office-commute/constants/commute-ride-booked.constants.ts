export const COMMUTE_RIDE_BOOKED_SCREEN = {
  title: 'Ride Booked Successfully!',
  subtitle: 'Your corporate commute is confirmed.',
  messageLabel: 'Message',
  callLabel: 'Call',
  pickupLabel: 'Pickup',
  dropoffLabel: 'Drop-off',
  etaBadge: (mins: number) => `${mins} mins away`,
  trackLabel: 'Track My Ride',
  optionsLabel: 'Ride Options & Cancellation',
  defaultDateLabel: 'Today, Oct 24',
  defaultTimeLabel: '08:30 AM',
  defaultVehicle: 'White Honda City • DL 3C AB 1234',
  defaultDriverName: 'Arjun Sharma',
  defaultDriverRating: 4.9,
  defaultPickupTitle: 'Sector 62, Noida',
  defaultPickupAddress: 'Stellar IT Park, Tower B Entrance',
  defaultDropoffTitle: 'Cyber Hub, Gurgaon',
  defaultDropoffAddress: 'Main Gate Passenger Drop-off',
  driverEtaMinutes: 4,
  driverAvatarUri:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBhD36Er5tosGGN0-zxVWGJVlY2fYnAme9Z8HF-K8IaGUnGlbalofSLuYZnoTpVPh9vPWtgdqk4gmUhcuCmGG6xQXNcCePEF8eBZm7UowA1pwQOsLkL_1JOz13zZK_PZQHoGdDIWZHQ7dUjaAsmked1pIKWQhFowaeSRACE3_GEmJomoivg--qFGMqY0oDVQBa_5gHmdpaVxxlwOE-rgwPjD0f5UnMGq0I1uyLm0BOEj20COctRUWs64zhBVrPg5-uWW4FoizgrbJA',
  mapImageUri:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCYk3XR84y_P9jDuGa_-X7iIVTGCImy8fMbFpNRcUzbr-H5Obk8HSFSlJlB-NDu0nNZKnBDb0saxQBi3ww-rW7WkZcJ-lpY5qtTrmuxH77B5XhQS-w_Fr0SUKcDQMBCiXzQon-jiafOmesgJc8hGtov86eFZUpmbNA99taVjL0GDjskyDQGBxtd27ctErs8uJBTSs8vZZVz176p0DKuZHRCh-r40ZgYHS3L71x0NayhzAi7Ezj4H8SN4Nn2x45FHUQaTyasbTgafDc',
} as const;

export const getCommuteRideBookedPath = (params: {
  rideId: string;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
  price?: number;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}) => ({
  pathname: '/office-commute/booked' as const,
  params: {
    rideId: params.rideId,
    rideType: 'regular',
    origin: params.origin ?? '',
    destination: params.destination ?? '',
    driverName: params.driverName ?? '',
    carModel: params.carModel ?? '',
    price: params.price != null ? String(params.price) : '',
    originLat: params.originLat != null ? String(params.originLat) : '',
    originLng: params.originLng != null ? String(params.originLng) : '',
    destinationLat: params.destinationLat != null ? String(params.destinationLat) : '',
    destinationLng: params.destinationLng != null ? String(params.destinationLng) : '',
  },
});
