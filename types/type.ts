
export interface ConfirmationState {
  rideId?: string;
  startOtp?: string;
  fare?: number;
  distance?: number;
  duration?: string;
  scheduledDate?: string,
  scheduledTime?: string,
  rideType?: string;
  pickupAddress?: string;
  dropAddress?: string;
  pickupCoords?: { lat: number; lng: number };
  dropCoords?: { lat: number; lng: number };
}

