
import * as SecureStore from "expo-secure-store";
import useOtpVerification from "@/hooks/useOtpVerification";
import { StyleSheet, Text, View } from "react-native"
import PhoneVerificationCard from "@/components/phoneVerification";
import RideTypeSelector from "@/components/rideTypeSelector";
import { useEffect, useState } from "react";
import { useRideStore } from "@/stores/bookingConfirmStore";
import useFareEstimator from "@/hooks/useFareEstimator";
import olaMapsService, { MapCoordinates } from "@/services/olaMapsService";
import AnimatedBackground from "@/components/animatedBackground";
import MyButton from "@/components/button";
import { BookingState } from "@/types/type";
import api from "@/services/api";
import { useRouter } from "expo-router";


const BookingDetail = () => {

  const router = useRouter()

  const otpHook = useOtpVerification()
  const [selectedRideType, setSelectedRideType] = useState<
    "private" | "shared" | "scheduled"
  >("private");

  const [phoneNumber, setPhoneNumber] = useState<string | null>(null)

  const rideData = useRideStore((state) => state.confirmationData)
  const setRideData = useRideStore((state) => state.setConfirmationData);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const { fareSolo, fareShared } = useFareEstimator(rideData?.pickupCoords || null, rideData?.dropCoords || null)


  const handleBooking = () => {

    if (!phoneNumber) return

    const bookingData: BookingState = {
      pickupAddress: rideData?.pickupAddress,
      pickupCoords: rideData?.pickupCoords,
      dropCoords: rideData?.dropCoords,
      dropAddress: rideData?.dropAddress,
      rideType: selectedRideType,
      firstName: 'User',
      lastName: '',
      phoneNumber: phoneNumber,
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      bookingForSelf: selectedRideType === 'private'
    };

    setRideData(bookingData)

    router.push('/(riding)/waiting')
  }

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
            router.replace('/(tabs)/home')

          }
        }
      } catch (error) {
        console.log('User not authenticated');
        router.replace('/(tabs)/home')
      }
    };

    checkAuth();
  }, []);




  return (
    <View style={styles.container}>
      <AnimatedBackground />

      <View
        style={{
          padding: 20,
          borderRadius: 12,
          marginBottom: 30,
        }}
      >
        <Text style={{ color: "#555", fontSize: 12 }}>PICKUP</Text>
        <Text style={{ color: "#000", fontSize: 16, marginBottom: 10 }}>
          {rideData?.pickupAddress}
        </Text>

        <Text style={{ color: "#555", fontSize: 12 }}>DROP</Text>
        <Text style={{ color: "#000", fontSize: 16 }}>
          {rideData?.dropAddress}
        </Text>
      </View>

      <View
        style={{
          padding: 15,
          borderRadius: 12,
          marginBottom: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ color: "#555", fontSize: 12 }}>DISTANCE{" "}</Text>
          <Text style={{ color: "#000", fontSize: 16 }}>
            {olaMapsService.formatDistance(rideData?.routeData?.distance) || "—"}
          </Text>
        </View>

        <View>
          <Text style={{ color: "#555", fontSize: 12 }}>DURATION{" "}</Text>
          <Text style={{ color: "#000", fontSize: 16 }}>
            {olaMapsService.formatDuration(rideData?.routeData?.duration) || "—"}
          </Text>
        </View>
      </View>

      <View>
        {!otpHook.isAuthenticated ? <PhoneVerificationCard /> : null}
        <RideTypeSelector
          selectedRideType={selectedRideType}
          setSelectedRideType={setSelectedRideType}
          fareSolo={fareSolo}
          fareShared={fareShared}
          scheduledDate={scheduledDate}
          scheduledTime={scheduledTime}
          setScheduledDate={setScheduledDate}
          setScheduledTime={setScheduledTime}
        />

      </View>
      <View>
        <MyButton title="Book Ride" onPress={handleBooking} />
      </View>
    </View>
  )
}

export default BookingDetail

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  }
})

