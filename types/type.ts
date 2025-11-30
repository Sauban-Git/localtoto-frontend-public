
export interface BookingState {
  rideId?: string;
  startOtp?: string;
  fare?: number;
  firstName?: string
  lastName?: string
  distance?: number;
  duration?: string;
  scheduledDate?: string,
  scheduledTime?: string,
  rideType?: string;
  pickupAddress?: string;
  dropAddress?: string;
  pickupCoords?: { lat: number; lng: number };
  dropCoords?: { lat: number; lng: number };
  routeData?: any
  phoneNumber?: string
  bookingForSelf?: boolean
}

