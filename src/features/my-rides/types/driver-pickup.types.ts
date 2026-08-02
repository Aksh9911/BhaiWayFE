export interface DriverPickupCoordinate {
  latitude: number;
  longitude: number;
}

export interface DriverPickupStop {
  id: string;
  index: number;
  total: number;
  passengerName: string;
  locationLabel: string;
  etaLabel: string;
  /** Pickup point shown on the live map background. */
  coordinate: DriverPickupCoordinate;
  /** Rider-shared pickup OTP the driver must enter. */
  otp: string;
}

export interface DriverPickupState {
  stops: readonly DriverPickupStop[];
  currentIndex: number;
}
