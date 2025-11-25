
import { useRideStore } from "@/stores/bookingConfirmStore";
import { View, Text, StyleSheet } from "react-native"

const BookingConfirmationPage = () => {
  const data = useRideStore((state) => state.confirmationData);
  console.log("drppping: ", data?.dropCoords, "picking: ", data?.pickupCoords)
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.text}>Ride Type: {data?.rideType}</Text>
      <Text style={styles.text}>Fare: {data?.fare}</Text>
      <Text style={styles.text}>Pickup: {data?.pickupAddress}</Text>
      <Text style={styles.text}>Pickup: {data?.pickupAddress}</Text>
      <Text style={styles.text}>Drop: {data?.dropAddress}</Text>
    </View>
  );
}

export default BookingConfirmationPage

const styles = StyleSheet.create({
  text: {
    alignItems: "center",

  }
})
