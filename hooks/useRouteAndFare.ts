
import { useEffect, useState } from "react";
import { geocodeToCoords } from "../services/geocode";
import olaMapsService, { RouteResponse } from "../services/olaMapsService";
import api from "../services/api";

export default function useRouteAndFare() {
  // addresses
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropAddress, setDropAddress] = useState("");

  // coordinates
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [dropCoords, setDropCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  // route + fare
  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [fareSolo, setFareSolo] = useState<{ fare: number; duration: string } | null>(
    null
  );
  const [fareShared, setFareShared] = useState<{ fare: number; duration: string } | null>(
    null
  );

  const [pageLoading, setPageLoading] = useState(false);

  // ride type
  const [selectedRideType, setSelectedRideType] = useState<
    "private" | "shared" | "scheduled"
  >("private");

  // scheduling
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // ----------------------------------------------------------
  // GEOCODE WHEN ADDRESS CHANGES
  // ----------------------------------------------------------
  useEffect(() => {
    const fetchCoords = async () => {
      if (pickupAddress) {
        const result = await geocodeToCoords(pickupAddress);
        if (result) setPickupCoords(result);
      }
      if (dropAddress) {
        const result = await geocodeToCoords(dropAddress);
        if (result) setDropCoords(result);
      }
    };

    fetchCoords();
  }, [pickupAddress, dropAddress]);

  // ----------------------------------------------------------
  // FETCH ROUTE + FARE WHEN BOTH COORDS AVAILABLE
  // ----------------------------------------------------------
  useEffect(() => {
    if (!pickupCoords || !dropCoords) return;

    const fetchRouteAndFare = async () => {
      setPageLoading(true);

      try {
        const route = await olaMapsService.getRoute(pickupCoords, dropCoords);
        setRouteData(route);

        // parallel fare calc
        const [solo, shared] = await Promise.all([
          api.post("/bookings/calculate-fare", {
            pickup: pickupCoords,
            dropoff: dropCoords,
            rideType: "private",
          }),
          api.post("/bookings/calculate-fare", {
            pickup: pickupCoords,
            dropoff: dropCoords,
            rideType: "shared",
          }),
        ]);

        if (solo.data?.success) {
          setFareSolo({
            fare: solo.data.fare,
            duration: solo.data.duration,
          });
        }

        if (shared.data?.success) {
          setFareShared({
            fare: shared.data.fare,
            duration: shared.data.duration,
          });
        }
      } catch (err) {
        console.error("Route/fare error:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchRouteAndFare();
  }, [pickupCoords, dropCoords]);

  return {
    pickupAddress,
    dropAddress,
    pickupCoords,
    dropCoords,
    fareSolo,
    fareShared,
    selectedRideType,
    scheduledDate,
    scheduledTime,
    pageLoading,

    setPickupAddress,
    setDropAddress,
    setSelectedRideType,
    setScheduledDate,
    setScheduledTime,
  };
}
