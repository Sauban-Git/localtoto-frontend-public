
import { View, StyleSheet } from "react-native";
import { useRideStore } from "@/stores/bookingConfirmStore";
import MapView from "react-native-ola-maps";
import { Marker, Polyline } from "react-native-maps";

const LiveTrackMap = () => {
  const data = useRideStore((state) => state.confirmationData);
  const routeData = data?.routeData || [];

  // Ensure routeData exists AND has coordinates
  const coordinatesArray = routeData?.coordinates || [];

  // Convert GeoJSON [lng, lat] → MapView { lat, lng }
  const polylineCoords =
    coordinatesArray.map((c: any) => ({
      latitude: Number(c[1]),
      longitude: Number(c[0]),
    })) || [];

  // If no coords available, fallback position (India center)
  const fallbackRegion = {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  // Start & end safely extracted
  const start = polylineCoords[0];
  const end = polylineCoords[polylineCoords.length - 1];

  const initialRegion = start
    ? {
      ...start,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }
    : fallbackRegion;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>

        {/* Show markers only if valid coords exist */}
        {start && (
          <Marker coordinate={start} title="Start" pinColor="green" />
        )}

        {end && (
          <Marker coordinate={end} title="Destination" pinColor="blue" />
        )}

        {/* Render polyline only if 2+ points exist */}
        {polylineCoords.length > 1 && (
          <Polyline
            coordinates={polylineCoords}
            strokeColor="#007bff"
            strokeWidth={4}
          />
        )}

      </MapView>
    </View>
  );
};

export default LiveTrackMap;

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

