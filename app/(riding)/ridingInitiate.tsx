
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
import { calculateDistance } from "@/utils/utilities";

type LocationState = Location.LocationObject | null;

const RidingInitiatePage = () => {


  const data = useRideStore((state) => state.confirmationData)

  const razorpayKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string | undefined;

  const {

    setPhoneNumber,
  } = useOtpVerification();

  // Booking states


  // razorpay
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('online');
  const [paymentPending, setPaymentPending] = useState<boolean>(false);

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
  const [bootLoading, setBootLoading] = useState<boolean>(true);


  // Distance warning states
  const [location, setLocation] = useState<LocationState>(null)
  const [distanceToPickup, setDistanceToPickup] = useState<number | null>(null);
  const [showDistanceWarning, setShowDistanceWarning] = useState<boolean>(false);

  // Cancel feedback modal

  // check users data

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
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        data.pickupCoords.lat,
        data.pickupCoords.lng
      );
      setDistanceToPickup(distance);

      // Show warning if distance > 200m
      if (distance > 200) {
        setShowDistanceWarning(true);
      }
    }
  }, [data?.pickupCoords]);


  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <AnimatedBackground />
      <View>

        <View>
          <Text>PICKUP</Text>
          <Text>{data?.pickupAddress}</Text>
        </View>

        <View>
          <Text>DROP-OFF</Text>
          <Text>{data?.dropAddress}</Text>
        </View>

        <View>
          <Text>DISTANCE</Text>
          <Text>12 km . 35 mins</Text>
        </View>

        <View>
          {/* Riders list */}
        </View>
      </View>
    </View>
  )
}

export default RidingInitiatePage

