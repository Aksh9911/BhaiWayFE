export interface CommuteRideAlong {
  id: string;
  name: string;
  rating: number;
  verificationLabel: string;
  seatLabel: string;
  verified: boolean;
  avatarUri?: string;
}

export interface CommuteBookingFare {
  baseFare: number;
  platformFee: number;
  taxes: number;
  promoDiscount: number;
  total: number;
}

export interface CommuteReviewBookingData {
  rideId: string;
  driverName: string;
  carModel: string;
  distanceLabel: string;
  durationLabel: string;
  matchPercent: number;
  matchCaption: string;
  pickup: {
    label: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  dropoff: {
    label: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  rideAlongs: CommuteRideAlong[];
  fare: CommuteBookingFare;
}
