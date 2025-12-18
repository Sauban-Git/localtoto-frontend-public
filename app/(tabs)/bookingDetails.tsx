
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import RideTypeSelector from "@/components/rideTypeSelector";
import { useState } from "react";
import { useRideStore } from "@/stores/bookingConfirmStore";
import useFareEstimator from "@/hooks/useFareEstimator";
import olaMapsService from "@/services/olaMapsService";
import AnimatedBackground from "@/components/animatedBackground";
import MyButton from "@/components/button";
import { BookingState } from "@/types/type";
import { useRouter } from "expo-router";

const BookingDetail = () => {

  const router = useRouter()
  const [selectedRideType, setSelectedRideType] = useState<
    "private" | "shared" | "scheduled"
  >("private");

  const rideData = useRideStore((state) => state.confirmationData)
  const setRideData = useRideStore((state) => state.setConfirmationData);

  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const { fareSolo, fareShared } = useFareEstimator(
    rideData?.pickupCoords || null,
    rideData?.dropCoords || null
  );

  const [processing, setProcessing] = useState(false)

  const handleBooking = async () => {
    setProcessing(true)

    const routeData = await olaMapsService.getRoute(rideData?.pickupCoords || null, rideData?.dropCoords || null)
    const bookingData: BookingState = {
      pickupAddress: rideData?.pickupAddress,
      pickupCoords: rideData?.pickupCoords,
      dropCoords: rideData?.dropCoords,
      dropAddress: rideData?.dropAddress,
      rideType: selectedRideType,
      firstName: 'User',
      lastName: '',
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      bookingForSelf: selectedRideType === 'private',
      routeData: routeData
    };

    setRideData(bookingData)

    setProcessing(false)
    router.push('/(tabs)/verifyPhone')
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <AnimatedBackground />

          {/* Route Info Card */}
          <View style={styles.card}>
            <Text style={styles.label}>PICKUP</Text>
            <Text style={styles.value}>{rideData?.pickupAddress}</Text>

            <Text style={[styles.label, { marginTop: 12 }]}>DROP</Text>
            <Text style={styles.value}>{rideData?.dropAddress}</Text>
          </View>

          {/* Distance and Duration */}
          <View style={[styles.card, styles.rowBetween]}>
            <View>
              <Text style={styles.label}>DISTANCE</Text>
              <Text style={styles.value}>
                {olaMapsService.formatDistance(
                  rideData?.routeData?.distance || 0
                ) || "—"}
              </Text>
            </View>

            <View>
              <Text style={styles.label}>DURATION</Text>
              <Text style={styles.value}>
                {olaMapsService.formatDuration(
                  rideData?.routeData?.duration || 0
                ) || "—"}
              </Text>
            </View>
          </View>

          {/* Verification + Ride Type */}
          <View style={{ marginBottom: 20 }}>
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

          <MyButton title="Book Ride" onPress={handleBooking} disabled={processing} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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

