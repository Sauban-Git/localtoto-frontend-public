
import { DriverLocation, RouteResponse } from "@/services/olaMapsService";
import { useRideStore } from "@/stores/bookingConfirmStore";
import { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native"

const BookingConfirmationPage = () => {
  const data = useRideStore((state) => state.confirmationData);


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    </View>
  );
}

export default BookingConfirmationPage
