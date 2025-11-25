
import { useEffect, useState } from "react";
import api from "../services/api"; // your API service
import olaMapsService, { MapCoordinates, RouteResponse } from "../services/olaMapsService";

interface Fare {
  fare: number;
  duration: string;
}

export default function useFareEstimator(
  pickupCoords: MapCoordinates | null,
  dropCoords: MapCoordinates | null
): { fareSolo: Fare | null; fareShared: Fare | null; routeData: RouteResponse | null } {
  const [fareSolo, setFareSolo] = useState<Fare | null>(null);
  const [fareShared, setFareShared] = useState<Fare | null>(null);
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);

  useEffect(() => {
    if (!pickupCoords || !dropCoords) return;
    if (pickupCoords.lat === 0 || dropCoords.lat === 0) return;
    let cancelled = false;

    const fetchRouteAndFare = async () => {
      try {
        // Convert addresses to coordinates
        const route = await olaMapsService.getRoute(pickupCoords, dropCoords);
        if (!cancelled) setRouteData(route);

        // Fetch fare estimates from API
        const [soloFareRes, sharedFareRes] = await Promise.all([

          api.post('/bookings/calculate-fare', {
            pickup: pickupCoords,
            dropoff: dropCoords,
            rideType: 'private'
          }),
          api.post('/bookings/calculate-fare', {
            pickup: pickupCoords,
            dropoff: dropCoords,
            rideType: 'shared'
          })

        ]);

        if (!cancelled) {
          if (soloFareRes.data?.success) setFareSolo({ fare: soloFareRes.data.fare, duration: soloFareRes.data.duration });
          if (sharedFareRes.data?.success) setFareShared({ fare: sharedFareRes.data.fare, duration: sharedFareRes.data.duration });
        }
      } catch (err) {
        console.log("Fare estimation error:", err);
        // Fallback simple fare calculation
        if (!cancelled) {
          const dummyFare = 100;
          const dummyDuration = "15 mins";
          setFareSolo({ fare: dummyFare, duration: dummyDuration });
          setFareShared({ fare: Math.round(dummyFare * 0.7), duration: dummyDuration });
        }
      }
    };

    fetchRouteAndFare();

    return () => {
      cancelled = true;
    };
  }, [pickupCoords, dropCoords]);

  return { fareSolo, fareShared, routeData };
}
