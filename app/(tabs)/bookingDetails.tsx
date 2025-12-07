
import * as SecureStore from "expo-secure-store";
import useOtpVerification from "@/hooks/useOtpVerification";
import { Alert, StyleSheet, Text, View } from "react-native"
import PhoneVerificationCard from "@/components/phoneVerification";
import RideTypeSelector from "@/components/rideTypeSelector";
import { useEffect, useState } from "react";
import { useRideStore } from "@/stores/bookingConfirmStore";
import useFareEstimator from "@/hooks/useFareEstimator";
import olaMapsService from "@/services/olaMapsService";
import AnimatedBackground from "@/components/animatedBackground";
import MyButton from "@/components/button";
import { BookingState } from "@/types/type";
import api from "@/services/api";
import { useRouter } from "expo-router";
import LoadingOverlay from "@/components/loadingOverlay";

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

  const { fareSolo, fareShared } = useFareEstimator(
    rideData?.pickupCoords || null,
    rideData?.dropCoords || null
  );

  const [pageLoading, setPageLoading] = useState<boolean>(false)
  const [processing, setProcessing] = useState(false)


  const handleBooking = async () => {
    setProcessing(true)

    if (!otpHook.phoneNumber || !rideData) return setProcessing(false)

    const routeData = await olaMapsService.getRoute(rideData?.pickupCoords || null, rideData?.dropCoords || null)
    const bookingData: BookingState = {
      pickupAddress: rideData?.pickupAddress,
      pickupCoords: rideData?.pickupCoords,
      dropCoords: rideData?.dropCoords,
      dropAddress: rideData?.dropAddress,
      rideType: selectedRideType,
      firstName: 'User',
      lastName: '',
      phoneNumber: otpHook.phoneNumber,
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      bookingForSelf: selectedRideType === 'private',
      routeData: routeData
    };

    setRideData(bookingData)

    setProcessing(false)
    router.push('/(riding)/waiting')
  }


  // Check stored token
  useEffect(() => {
    const checkAuth = async () => {
      setPageLoading(true)
      try {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
          const response = await api.get('/users/profile');
          if (response.data?.success) {
            setPhoneNumber(response.data.user.phoneNumber || '');
          } else {
            router.replace('/(tabs)/home')
          }
        }
      } catch {
        Alert.alert("Verify your phone first ...")
        router.replace('/(tabs)/home')
      } finally {
        setPageLoading(false)
      }
    };

    checkAuth();
  }, []);


  return (
    <View style={styles.container}>
      <AnimatedBackground />

      {pageLoading && <LoadingOverlay message="Preparing your ride details..." />}

      {/* Route Info Card */}
      <View style={styles.card}>
        <Text style={styles.label}>PICKUP</Text>
        <Text style={styles.value}>{rideData?.pickupAddress}</Text>

        <Text style={[styles.label, { marginTop: 12 }]}>DROP</Text>
        <Text style={styles.value}>{rideData?.dropAddress}</Text>
      </View>

      {/* Distance and Durantion */}
      <View style={[styles.card, styles.rowBetween]}>
        <View>
          <Text style={styles.label}>DISTANCE</Text>
          <Text style={styles.value}>
            {olaMapsService.formatDistance(rideData?.routeData?.distance || 0) || "—"}
          </Text>
        </View>

        <View>
          <Text style={styles.label}>DURATION</Text>
          <Text style={styles.value}>
            {olaMapsService.formatDuration(rideData?.routeData?.duration || 0) || "—"}
          </Text>
        </View>
      </View>

      {/* Verification + Ride Type */}
      <View style={{ marginBottom: 20 }}>
        {!otpHook.isAuthenticated && (
          <PhoneVerificationCard otpHook={otpHook} />
        )}

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

      {/* Button */}
      <MyButton
        title="Book Ride"
        onPress={handleBooking}
        disabled={processing}
      />
    </View>
  );
};

export default BookingDetail;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 18,
    borderRadius: 14,
    marginBottom: 18,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#555",
    fontSize: 12,
    marginBottom: 4,
  },

  value: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  }
});

