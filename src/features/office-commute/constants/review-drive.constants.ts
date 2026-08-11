export const REVIEW_DRIVE_SCREEN = {
  title: 'Review Drive',
  routeLabel: 'Route Details',
  pickupLabel: 'Pickup',
  destinationLabel: 'Destination',
  departureLabel: 'Departure Time',
  repeatLabel: 'Repeat Days',
  seatsLabel: 'Seats Offered',
  priceLabel: 'Price per Seat',
  earningsLabel: 'Estimated earnings per ride',
  earningsHint: 'Based on full occupancy',
  profitableBadge: 'PROFITABLE DRIVE',
  distanceLabel: 'Best route',
  oneTimeLabel: 'One-time',
  verifyWarning:
    'You have not verified your workspace email, please verify for smooth onboarding.',
  verifyLabel: 'Verify Workspace Email',
  verifiedLabel: 'Workspace email verified',
  publishLabel: 'Publish Ride',
  publishingLabel: 'Publishing...',
} as const;

export const formatDisplayTime = (value: string): string => {
  const [hoursRaw = '9', minutesRaw = '00'] = value.split(':');
  const hours24 = Number(hoursRaw) || 0;
  const minutes = String(Number(minutesRaw) || 0).padStart(2, '0');
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${String(hours12).padStart(2, '0')}:${minutes} ${period}`;
};
