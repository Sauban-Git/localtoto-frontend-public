
import * as IntentLauncher from "expo-intent-launcher";
import * as Location from "expo-location"
import AnimatedBackground from "@/components/animatedBackground"
import MyButton from "@/components/button";
import LocationSelector from "@/components/locationSelector"
import olaMapsService, { MapCoordinates } from "@/services/olaMapsService";
import { useRideStore } from "@/stores/bookingConfirmStore";
import { BookingState } from "@/types/type";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native"
import Toast from "react-native-toast-message"

type LocationState = Location.LocationObject | null;

const Home = () => {
  const [pickupCoords, setPickup] = useState<MapCoordinates | null>(null);
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [dropCoords, setDrop] = useState<MapCoordinates | null>(null);
  const [dropAddress, setDropAddress] = useState<string>("")
  const [processing, setProcessing] = useState(false)
  const [pickupLoading, setPickupLoading] = useState(false)
  const [dropLoading, setDropLoading] = useState(false)
  const router = useRouter()

  const [location, setLocation] = useState<LocationState>(null)
  const [currPickUp, setCurrPickUp] = useState<{ lat: number, lng: number, address: string } | null>(null)
  const [currDropoff, setCurrDropOff] = useState<{ lat: number, lng: number, address: string } | null>(null)

  const setRideData = useRideStore((state) => state.setConfirmationData)
  const handleBooking = async () => {
    setProcessing(true)
    if (!pickupCoords || !dropCoords) {
      Toast.show({
        type: "error",
        text1: "Missing Info",
        text2: "Please select a pickup and dropoff point!",
        position: "bottom",
      });
      setProcessing(false)
      return;
    }
    const routeData = await olaMapsService.getRoute(pickupCoords, dropCoords)

    const bookingConfirmationData: BookingState = {
      pickupCoords,
      dropCoords,
      pickupAddress,
      dropAddress,
      routeData: routeData,
    }

    setRideData(bookingConfirmationData)
    setProcessing(false)

    router.push('/(tabs)/bookingDetails')

  };

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== 'granted') {
          alert("Permission Denied")
          return
        }
        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          alert("Please enable your device's GPS / Location Services.");
          IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS);
          return;
        }
        const location = await Location.getCurrentPositionAsync({})
        setLocation(location)
      } catch (error) {
      }
    }
    getLocation()
  }, [])

  const useCurrentLocationForPickUp = async () => {
    if (!location) return;

    setPickupLoading(true);

    try {
      const data = await olaMapsService.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      if (data?.success && data.address) {
        const currentLocation = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          address: data.address
        };
        setCurrPickUp(currentLocation);
      } else {
      }
    } catch {
    } finally {
      setPickupLoading(false);
    }
  };

  const useCurrentLocationForDropOff = async () => {
    if (!location) return;

    setDropLoading(true);

    try {
      const data = await olaMapsService.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      if (data?.success && data.address) {
        const currentLocation = {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
          address: data.address
        };
        setCurrDropOff(currentLocation);
      } else {
      }
    } catch (error) {
    } finally {
      setDropLoading(false);
    }
  };


  return (
    <View style={{ flex: 1 }}>
      {/* Background stays fixed */}
      <AnimatedBackground />


      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "green" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 120}   // ← move UP more
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingVertical: 130 }}>
            <Text style={styles.titleAtt}>
              Book an <Text style={{ color: "yellow", fontWeight: "900" }}>e-Rickshaw</Text>
            </Text>
            <Text style={styles.titleAtt}>in Your City</Text>
          </View>

          <LocationSelector
            label="Pickup"
            isLoading={pickupLoading}
            iconColor="#16a34a"
            value={pickupAddress}
            onSelectLocation={(coords, address) => {
              setPickup(coords);
              setPickupAddress(address);
            }}
            externalLocation={currPickUp}
            onCurrentLocation={useCurrentLocationForPickUp}
          />

          <LocationSelector
            label="Drop"
            isLoading={dropLoading}
            value={dropAddress}
            iconColor="#2563eb"
            onSelectLocation={(coords, address) => {
              setDrop(coords);
              setDropAddress(address);
            }}
            externalLocation={currDropoff}
            onCurrentLocation={useCurrentLocationForDropOff}
          />

          <MyButton title="Book" disabled={processing} backgroundColor="white" onPress={handleBooking} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );

}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5
  },
  titleAtt: {
    color: "white",
    fontSize: 34,
    alignItems: "center",
    textAlign: "left",
    paddingHorizontal: 5,
    fontWeight: "900",
  }
});


