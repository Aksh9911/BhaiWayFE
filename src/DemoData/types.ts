/** Types for locally stored user-entered demo data. */

export type DemoUserRole = 'driver' | 'passenger' | 'both';
export type DemoUserGender = 'Male' | 'Female' | 'Other';

export interface DemoUser {
  user_id: number;
  full_name: string;
  email: string;
  mobile: string;
  profile_image: string;
  gender: DemoUserGender;
  rating: number;
  total_rides: number;
  is_verified: boolean;
  role: DemoUserRole;
  created_at: string;
}

export type DemoVehicleType = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Coupe' | 'Other';

export interface DemoVehicle {
  vehicle_id: number;
  owner_id: number;
  make: string;
  model: string;
  vehicle_number: string;
  vehicle_type: DemoVehicleType;
  color: string;
  year: number;
  seats: number;
  ac: boolean;
}

export type DemoBookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type DemoPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface DemoBooking {
  booking_id: number;
  ride_id: number;
  passenger_id: number;
  seats_booked: number;
  amount: number;
  booking_status: DemoBookingStatus;
  payment_status: DemoPaymentStatus;
  booked_at: string;
}

export type DemoUserInput = Omit<DemoUser, 'user_id' | 'created_at' | 'rating' | 'total_rides' | 'is_verified'> &
  Partial<Pick<DemoUser, 'created_at' | 'rating' | 'total_rides' | 'is_verified' | 'profile_image'>>;

export type DemoVehicleInput = Omit<DemoVehicle, 'vehicle_id'>;

export type DemoBookingInput = Omit<DemoBooking, 'booking_id' | 'booked_at'> &
  Partial<Pick<DemoBooking, 'booked_at'>>;
