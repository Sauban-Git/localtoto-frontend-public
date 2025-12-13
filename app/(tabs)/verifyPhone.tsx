
import { Alert, View } from "react-native"
import PhoneVerificationCard from "@/components/phoneVerification";
import useOtpVerification from "@/hooks/useOtpVerification";
import { useRideStore } from "@/stores/bookingConfirmStore";
import { BookingState } from "@/types/type";
import MyButton from "@/components/button";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AnimatedBackground from "@/components/animatedBackground";
import LoadingOverlay from "@/components/loadingOverlay";

const VerifyPhone = () => {
  const router = useRouter()
  const otpHook = useOtpVerification();
  const rideData = useRideStore((state) => state.confirmationData)
  const setRideData = useRideStore((state) => state.setConfirmationData)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)

  useEffect(() => {
    setPageLoading(true)
    if (otpHook.isAuthenticated) {
      const bookingData: BookingState = {
        pickupAddress: rideData?.pickupAddress,
        pickupCoords: rideData?.pickupCoords,
        dropCoords: rideData?.dropCoords,
        dropAddress: rideData?.dropAddress,
        rideType: rideData?.rideType,
        firstName: 'User',
        lastName: '',
        phoneNumber: otpHook.phoneNumber,
        scheduledDate: rideData?.scheduledDate,
        scheduledTime: rideData?.scheduledTime,
        bookingForSelf: rideData?.bookingForSelf,
        routeData: rideData?.routeData
      };

      setRideData(bookingData)

      router.replace('/(riding)/waiting')
    }
    setPageLoading(false)
  }, [])


  const nextPage = async () => {
    setLoading(true)
    if (!otpHook.isAuthenticated) {
      Alert.alert("Not authorized", "Very your phone number first");
      setLoading(false)
      return
    }

    const bookingData: BookingState = {
      pickupAddress: rideData?.pickupAddress,
      pickupCoords: rideData?.pickupCoords,
      dropCoords: rideData?.dropCoords,
      dropAddress: rideData?.dropAddress,
      rideType: rideData?.rideType,
      firstName: 'User',
      lastName: '',
      phoneNumber: otpHook.phoneNumber,
      scheduledDate: rideData?.scheduledDate,
      scheduledTime: rideData?.scheduledTime,
      bookingForSelf: rideData?.bookingForSelf,
      routeData: rideData?.routeData
    };

    setRideData(bookingData)
    router.replace('/(riding)/waiting')
  }


  return (
    <View style={{ flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
      <AnimatedBackground />
      {pageLoading && (
        <LoadingOverlay message="Checking your authtentication..." />
      )}
      <PhoneVerificationCard otpHook={otpHook} />
      <MyButton title="Proceed" disabled={loading} onPress={nextPage} />
    </View>
  )
}

export default VerifyPhone;
