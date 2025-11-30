
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
import { StyleSheet, Text, View } from "react-native"

type LocationState = Location.LocationObject | null;

const Home = () => {
  const [pickupCoords, setPickup] = useState<MapCoordinates | null>(null);
  const [pickupAddress, setPickupAddress] = useState<string>("");
  const [dropCoords, setDrop] = useState<MapCoordinates | null>(null);
  const [dropAddress, setDropAddress] = useState<string>("")
  const router = useRouter()

  const [location, setLocation] = useState<LocationState>(null)

  const setRideData = useRideStore((state) => state.setConfirmationData)
  const handleBooking = async () => {


    if (!pickupCoords || !dropCoords) {
      alert("Please select pickup and drop locations!");
      return;
    }
    const routeData = await olaMapsService.getRoute(pickupCoords, dropCoords)

    const bookingConfirmationData: BookingState = {
      pickupCoords,
      dropCoords,
      pickupAddress,
      dropAddress,
      routeData,
    }

    setRideData(bookingConfirmationData)

    router.push('/(tabs)/bookingDetails')

  };

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
  }, [])


  return (
    <View style={styles.container}>
      <AnimatedBackground />
      <View style={{ paddingVertical: 130 }}>
        <Text style={styles.titleAtt}>Book an <Text style={{ color: "yellow" }}>e-Rickshaw </Text></Text>
        <Text style={styles.titleAtt}>in Your City</Text>
      </View>

      <View>
        <LocationSelector
          label="Pickup"
          iconColor="#16a34a"
          value={pickupAddress}
          onSelectLocation={(coords, address) => {
            setPickup(coords);
            setPickupAddress(address)
          }}
        />

        <LocationSelector
          label="Drop"
          value={dropAddress}
          iconColor="#2563eb"
          onSelectLocation={(coords, address) => {
            setDrop(coords);
            setDropAddress(address)
          }}
        />

      </View>
      <View>
        <MyButton title="Book" onPress={handleBooking} />
      </View>

    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    paddingHorizontal: 5
  },
  titleAtt: {
    color: "white",
    fontSize: 34,
    alignItems: "center",
    textAlign: "left",
    paddingHorizontal: 5,
  }
});


