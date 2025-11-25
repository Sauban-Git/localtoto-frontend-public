
import { DriverLocation, RouteResponse } from "@/services/olaMapsService";
import { useRideStore } from "@/stores/bookingConfirmStore";
import { useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native"

const BookingConfirmationPage = () => {
  const data = useRideStore((state) => state.confirmationData);

  const [isCancelling, setIsCancelling] = useState(false);
  const [driverAssigned, setDriverAssigned] = useState(false);
  const [driverDetails, setDriverDetails] = useState<{
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    photo: string;
  } | null>(null);

  const [routeData, setRouteData] = useState<RouteResponse | null>(null);
  const [driverToPickupRoute, setDriverToPickupRoute] = useState<RouteResponse | null>(null);
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(null);
  const [near, setNear] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [wsRetryLimitReached, setWsRetryLimitReached] = useState(false);
  const wsRetriesRef = useRef(0);
  const shouldReconnectRef = useRef(true);
  const isConnectingRef = useRef(false);
  const [isCompleted, setIsCompleted] = useState(false); // Flag to prevent unnecessary API calls
  const [userPhone, setUserPhone] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');



  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={styles.text}>Ride Type: {data?.rideType}</Text>
      <Text style={styles.text}>Fare: {data?.fare}</Text>
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
