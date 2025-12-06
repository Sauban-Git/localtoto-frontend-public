import { MapCoordinates, RouteResponse } from "@/services/olaMapsService";

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
  pickupCoords?: MapCoordinates;
  dropCoords?: MapCoordinates;
  routeData?: RouteResponse | null
  phoneNumber?: string
  bookingForSelf?: boolean
}

