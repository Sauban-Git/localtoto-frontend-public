
import olaMapsService, { MapCoordinates, ReverseGeocodingResponse } from "@/services/olaMapsService";
import * as IntentLauncher from "expo-intent-launcher";
import * as Location from "expo-location"
import * as SecureStore from "expo-secure-store";
import AnimatedBackground from '@/components/animatedBackground'
import { useRideStore } from '@/stores/bookingConfirmStore'
import { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text } from 'react-native'
import api from "@/services/api";
import useOtpVerification from "@/hooks/useOtpVerification";
import { router } from "expo-router";

type LocationState = Location.LocationObject | null;

const RidingInitiatePage = () => {


  const data = useRideStore((state) => state.confirmationData)

  const razorpayKey = process.env?.VITE_RAZORPAY_KEY_ID as string | undefined;

  const {
    isAuthenticated,
    phoneNumber,
    setPhoneNumber,
  } = useOtpVerification();

  // Booking states
  const [isBookingRide, setIsBookingRide] = useState<boolean>(false);
  const [showBookingAnimation, setShowBookingAnimation] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [driverAssigned, setDriverAssigned] = useState<boolean>(false);
  const navigatedRef = useRef<boolean>(false);
  const [driverInfo, setDriverInfo] = useState<any>(null);

  //razorpay
  const [paymentPending, setPaymentPending] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('online');
  const amountDue = useMemo(() => data?.fare || 0, [data?.rideType, data?.fare])
  const loadScript = (src: string) =>
    new Promise<boolean>((resolve) => {
      if (document.querySelector(`script[src='${src}']`)) return resolve(true);
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  useEffect(() => {
    if (razorpayKey) {
      loadScript('https://checkout.razorpay.com/v1/checkout.js');
    }
  }, [razorpayKey]);


  // Waiting animation states
  const [waitingTime, setWaitingTime] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [searchStatus, setSearchStatus] = useState<string>('Finding drivers...');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const MAX_WAIT_SECONDS = 180; // 3 minutes
  const [expired, setExpired] = useState<boolean>(false);
  const [bootLoading, setBootLoading] = useState<boolean>(true);

  // Distance warning states
  const [location, setLocation] = useState<LocationState>(null)
  const [distanceToPickup, setDistanceToPickup] = useState<number | null>(null);
  const [showDistanceWarning, setShowDistanceWarning] = useState<boolean>(false);
  const [onlineDrivers, setOnlineDrivers] = useState<{ lat: number; lng: number }[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(0);

  // Cancel feedback modal

  // check users data



  // Handle ride booking
  const handleBookRide = async () => {
    // if (!isAuthenticated) {
    //   alert('Please verify your phone number first');
    //   return;
    // }
    //
    // setIsBookingRide(true);
    // setShowBookingAnimation(true);
    // setWaitingTime(0);
    // setCurrentStep(0);
    // setSearchStatus('Finding drivers...');
    // setScanProgress(0);
    //
    // try {
    //
    //   const bookingData = {
    //     pickupLocation: { address: data?.pickupAddress, coords: data?.pickupCoords },
    //     dropoffLocation: { address: data?.dropAddress, coords: data?.dropCoords },
    //     rideType: data?.rideType,
    //     paymentMethod: paymentMethod,
    //     firstName: 'User',
    //     lastName: '',
    //     phoneNumber: phoneNumber,
    //     scheduledDate: data?.scheduledDate,
    //     scheduledTime: data?.scheduledTime,
    //     bookingForSelf: data?.rideType === 'private'
    //   };
    //
    //   const response = await api.post('/bookings/book', bookingData);
    //
    //   if (response.data?.success) {
    //     console.log(response.data)
    //     const rideId = response.data.bookingId || response.data.rideId;
    //     setBookingId(rideId);
    //     // If online, immediately create order and open payment modal
    //     if (paymentMethod === 'online') {
    //       try {
    //         const orderRes = await api.post('/payments/create-order', { bookingId: rideId, amount: amountDue });
    //         if (orderRes.data?.success) {
    //           setPaymentPending(true);
    //           setPaymentOrderId(orderRes.data.orderId);
    //           setPaymentId(orderRes.data.paymentId);
    //           setPaymentModalOpen(true);
    //         }
    //       } catch (_) {
    //         setPaymentPending(true);
    //         setPaymentModalOpen(true);
    //       }
    //     }
    //
    //     // Keep showing the map (waiting room) and poll for driver assignment
    //     // We will navigate once a driver confirms the ride
    //   } else {
    //     alert(response.data?.message || 'Failed to book ride');
    //     setShowBookingAnimation(false);
    //   }
    // } catch (error: any) {
    //   alert(error?.response?.data?.message || 'Failed to book ride');
    //   setShowBookingAnimation(false);
    // } finally {
    //   setIsBookingRide(false);
    // }
    simulateDriverAssignment()
  };

  useEffect(() => {
    // short boot loader
    const t = setTimeout(() => setBootLoading(false), 400);
    return () => clearTimeout(t);
  }, []);


  // no need just rely on useOtpVerification hooks
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          const response = await api.get('/users/profile');
          if (response.data?.success) {
            console.log('User profile data:', response.data.user);
            setPhoneNumber(response.data.user.phoneNumber || '');
          } else {
            router.replace('/(booking)/bookingdetailpage')

          }
        }
      } catch (error) {
        console.log('User not authenticated');
        router.replace('/(booking)/bookingdetailpage')
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (paymentMethod === 'online') {
      try { setPaymentPending(true); } catch { }
    }
  }, [paymentMethod]);

  // get location of user and distance from pickup point
  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          console.log("Permission denied..")
          return
        }
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          console.log("Location services are OFF");
          alert("Please enable your device's GPS / Location Services.");
          IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS);
          return;
        }
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)
      } catch (error) {
        console.log("Error while getting location ", error)
      }
    }
    getLocation()

    if (location && data?.pickupCoords) {

      // Calculate distance to pickup point
      const userLocation: MapCoordinates = { lat: location.coords.latitude, lng: location.coords.longitude }
      const distance = olaMapsService.calculateDistance(userLocation, data.pickupCoords)
      setDistanceToPickup(distance);

      // Show warning if distance > 200m
      if (distance > 200) {
        setShowDistanceWarning(true);
      }
    }
  }, [data?.pickupCoords]);



  // fetch drivers on regular interval
  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;
    const load = async () => {
      try {
        const params: any = {};
        if (location && typeof location.coords.latitude === 'number' && typeof location.coords.longitude === 'number') {
          params.lat = location.coords.latitude; params.lng = location.coords.longitude;
        }
        const res = await api.get('/riders/online-drivers', { params });
        const backendCount = typeof res.data?.count === 'number' ? res.data.count : 0;
        const drivers = Array.isArray(res.data?.drivers) ? res.data.drivers : [];
        if (!cancelled) { setOnlineDrivers(drivers); setOnlineCount(backendCount); }
      } catch { }
    };
    // initial fetch without waiting for geolocation
    load();
    // refresh every 10s
    // @ts-ignore
    timer = window.setInterval(load, 10000);
    return () => { cancelled = true; if (timer) window.clearInterval(timer); };
  }, [location]);


  // Calculate pickup marker position when booking animation starts
  useEffect(() => {
    if (showBookingAnimation) {
      // Small delay to ensure map is loaded
      const timer = setTimeout(() => {
        // avoid for nowwwwwwwwwwww
        // calculatePickupMarkerPosition();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showBookingAnimation]);

  // Memoize route data to avoid identity changes causing map layer flicker
  const memoRouteData = useMemo(() => {
    if (!data) return undefined;
    const rd = data?.routeData;
    return {
      coordinates: rd.coordinates as any,
      distance: rd.distance,
      duration: rd.duration,
      provider: rd.provider
    };
  }, [data?.routeData?.coordinates, data?.routeData?.distance, data?.routeData?.duration, data?.routeData?.provider]);


  // Expire the ride when maximum waiting time is reached
  useEffect(() => {
    if (!showBookingAnimation || expired) return;
    if (waitingTime >= MAX_WAIT_SECONDS) {
      (async () => {
        // Stop the search UI and mark as expired; do NOT auto-cancel so user can retry
        setExpired(true);
        setShowBookingAnimation(false);
        setPaymentModalOpen(false);
        setPaymentPending(false);
      })();
    }
  }, [waitingTime, showBookingAnimation, expired, bookingId]);

  const retrySearch = async () => {
    // Restart the 3-minute window; keep existing booking if any
    setExpired(false);
    setWaitingTime(0);
    setCurrentStep(0);
    setScanProgress(0);
    setSearchStatus('Finding drivers...');
    setShowBookingAnimation(true);
    // If there is no booking yet (edge case), create one
    if (!bookingId) {
      await handleBookRide();
    }
  };


  // Handle driver assignment (simulated)
  const simulateDriverAssignment = () => {
    const mockDriver = {
      id: 'driver_123',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      vehicle: {
        model: 'Maruti Swift',
        number: 'DL 01 AB 1234',
        color: 'White'
      },
      rating: 4.8,
      eta: '5 mins'
    };

    setDriverAssigned(true);
    setDriverInfo(mockDriver);

    // Navigate to booking confirmation page
    console.log("yeeeeeeeeeeeeee rider founddd")
  };



  useEffect(() => {
    handleBookRide();  // trigger driver simulation immediately
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <AnimatedBackground />

      {/* DRIVER FOUND UI */}
      {driverAssigned && driverInfo ? (
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>

          <Text style={{ fontSize: 24, color: "#2ecc71", fontWeight: "700", textAlign: "center" }}>
            Driver Found!
          </Text>
          <Text style={{ color: "#aaa", marginTop: 5, textAlign: "center" }}>
            Your ride is on the way
          </Text>

          {/* Driver Card */}
          <View
            style={{
              marginTop: 40,
              backgroundColor: "#111",
              padding: 20,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
              {driverInfo.name}
            </Text>

            <Text style={{ color: "#aaa", marginTop: 4 }}>
              ⭐ {driverInfo.rating}
            </Text>

            <View style={{ marginTop: 15 }}>
              <Text style={{ color: "#888", fontSize: 12 }}>PHONE</Text>
              <Text style={{ color: "#fff", fontSize: 16 }}>
                {driverInfo.phone}
              </Text>
            </View>

            <View style={{ marginTop: 15 }}>
              <Text style={{ color: "#888", fontSize: 12 }}>CAR</Text>
              <Text style={{ color: "#fff", fontSize: 16 }}>
                {driverInfo.vehicle.model} • {driverInfo.vehicle.color}
              </Text>
              <Text style={{ color: "#2ecc71", fontSize: 18, fontWeight: "700", marginTop: 4 }}>
                {driverInfo.vehicle.number}
              </Text>
            </View>

            <View style={{ marginTop: 20 }}>
              <Text style={{ color: "#888", fontSize: 12 }}>ARRIVING IN</Text>
              <Text style={{ color: "#fff", fontSize: 18 }}>
                {driverInfo.eta}
              </Text>
            </View>
          </View>

        </View>
      ) : (
        /* WAITING SCREEN */
        <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>

          {/* Header */}
          <View style={{ marginBottom: 40, alignItems: "center" }}>
            <Text style={{ fontSize: 22, color: "#fff", fontWeight: "600" }}>
              {expired ? "No Drivers Found" : "Searching for drivers..."}
            </Text>

            {!expired && (
              <Text style={{ marginTop: 6, color: "#aaa" }}>
                We’re connecting you with the nearest driver
              </Text>
            )}
          </View>

          {/* Searching Loader Animation */}
          {!expired && (
            <View style={{ alignItems: "center", marginBottom: 50 }}>
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 100,
                  borderWidth: 8,
                  borderColor: "#2ecc71",
                  borderStyle: "dotted",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 16 }}>
                  {scanProgress}%
                </Text>
              </View>

              <Text style={{ marginTop: 12, color: "#ccc" }}>
                {searchStatus}
              </Text>
            </View>
          )}

          {/* Pickup / Drop Info */}
          <View
            style={{
              backgroundColor: "#111",
              padding: 20,
              borderRadius: 12,
              marginBottom: 30,
            }}
          >
            <Text style={{ color: "#888", fontSize: 12 }}>PICKUP</Text>
            <Text style={{ color: "#fff", fontSize: 16, marginBottom: 10 }}>
              {data?.pickupAddress}
            </Text>

            <Text style={{ color: "#888", fontSize: 12 }}>DROP</Text>
            <Text style={{ color: "#fff", fontSize: 16 }}>
              {data?.dropAddress}
            </Text>
          </View>

          {/* Distance Section */}
          <View
            style={{
              backgroundColor: "#111",
              padding: 15,
              borderRadius: 12,
              marginBottom: 20,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={{ color: "#888", fontSize: 12 }}>DISTANCE</Text>
              <Text style={{ color: "#fff", fontSize: 16 }}>
                {olaMapsService.formatDistance(data?.routeData?.distance) || "—"}
              </Text>
            </View>

            <View>
              <Text style={{ color: "#888", fontSize: 12 }}>DURATION</Text>
              <Text style={{ color: "#fff", fontSize: 16 }}>
                {olaMapsService.formatDuration(data?.routeData?.duration) || "—"}
              </Text>
            </View>
          </View>

          {/* If Wait Time Expired */}
          {expired && (
            <View style={{ alignItems: "center", marginTop: 30 }}>
              <Text style={{ color: "#ff5555", fontSize: 16, marginBottom: 20 }}>
                No drivers available right now.
              </Text>

              <View
                style={{
                  backgroundColor: "#2ecc71",
                  paddingVertical: 12,
                  paddingHorizontal: 25,
                  borderRadius: 8,
                }}
              >
                <Text
                  onPress={retrySearch}
                  style={{ color: "#000", fontWeight: "600", fontSize: 16 }}
                >
                  Retry
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );

}

export default RidingInitiatePage

